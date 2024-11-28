"use client"

import { useState, useEffect, useCallback } from "react";
import { PeraWalletConnect } from "@perawallet/connect";
import { DeflyWalletConnect } from "@blockshake/defly-connect";
import algosdk from "algosdk";
import {
  getMessageBytes,
  hashMessage,
  initializeAlgodClient,
} from "@/utils/siwaUtils";
import LuteConnect from "lute-connect";

export type WalletProvider = "Pera" | "Defly" | "Kibisis" | "Lute";

declare global {
  interface Window {
    algorand: any;
    handleWalletError: (error: string) => void;
  }
}

const isClient = typeof window !== "undefined";

let luteWallet: LuteConnect | null = null;
let peraWallet: PeraWalletConnect;
let deflyWallet: DeflyWalletConnect;
let algodClient: algosdk.Algodv2;

if (isClient) {
  luteWallet = new LuteConnect("SIWA Connect");
  peraWallet = new PeraWalletConnect();
  deflyWallet = new DeflyWalletConnect();
  algodClient = initializeAlgodClient();
}

export const useWalletConnection = () => {
  const [address, setAddress] = useState<string | null>(null);
  const [provider, setProvider] = useState<WalletProvider>("Pera");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isClient) {
      const storedAddress = localStorage.getItem("address");
      const storedProvider = localStorage.getItem("walletProvider") as WalletProvider;
      if (storedAddress) setAddress(storedAddress);
      if (storedProvider) setProvider(storedProvider);
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem("walletProvider", provider);
    }
  }, [provider]);

  const disconnectWallet = useCallback(() => {
    if (provider === "Pera") {
      peraWallet.disconnect();
    } else if (provider === "Defly") {
      deflyWallet.disconnect();
    }
    setAddress(null);
    if (isClient) {
      localStorage.removeItem("walletProvider");
      localStorage.removeItem("address");
    }
  }, [provider]);

  const connectWallet = async (selectedProvider: WalletProvider) => {
    setIsLoading(true);
    try {
      let newAccounts: string[];
      if (selectedProvider === "Pera") {
        newAccounts = await peraWallet.connect();
        peraWallet.connector?.on("disconnect", disconnectWallet);
      } else if (selectedProvider === "Defly") {
        newAccounts = await deflyWallet.connect();
        deflyWallet.connector?.on("disconnect", disconnectWallet);
      } else if (selectedProvider === "Kibisis") {
        const address = await injectKibisis();
        newAccounts = [address];
      } else if (selectedProvider === "Lute") {
        const address = await connectLute();
        newAccounts = [address];
      } else {
        throw new Error("Unsupported wallet provider");
      }
      setAddress(newAccounts[0]);
      setProvider(selectedProvider);
      if (isClient) {
        localStorage.setItem("walletProvider", selectedProvider);
        localStorage.setItem("address", newAccounts[0]);
      }
    } catch (error) {
      console.error(`Error connecting to ${selectedProvider}:`, error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const reconnectSession = useCallback(async () => {
    setIsLoading(true);
    try {
      if (isClient) {
        const storedProvider = localStorage.getItem("walletProvider") as WalletProvider;
        const storedAddress = localStorage.getItem("algoAddress");

        if (storedProvider && storedAddress) {
          setProvider(storedProvider);
          setAddress(storedAddress);

          if (storedProvider === "Pera") {
            await peraWallet.reconnectSession();
            peraWallet.connector?.on("disconnect", disconnectWallet);
          } else if (storedProvider === "Defly") {
            await deflyWallet.reconnectSession();
            deflyWallet.connector?.on("disconnect", disconnectWallet);
          }
        }
      }
    } catch (error) {
      console.error("Error reconnecting session:", error);
      disconnectWallet();
    } finally {
      setIsLoading(false);
    }
  }, [disconnectWallet]);

  useEffect(() => {
    reconnectSession();
    return () => {
      if (isClient) {
        peraWallet.connector?.off("disconnect");
        deflyWallet.connector?.off("disconnect");
      }
    };
  }, [reconnectSession]);

  const signMessage = async (message: string): Promise<{ signature: Uint8Array; transaction?: any | null }> => {
    if (!address) {
      throw new Error("No address connected");
    }

    const hashedMessage = hashMessage(message);
    const encodedHashedMessage = getMessageBytes(Buffer.from(hashedMessage).toString("utf8"));

    const suggestedParams = ["Defly", "Lute"].includes(provider)
      ? await algodClient.getTransactionParams().do()
      : null;

    switch (provider) {
      case "Pera":
        const peraSigArray = await peraWallet.signData(
          [{ data: encodedHashedMessage, message: "" }],
          address
        );
        return {
          signature: peraSigArray[0],
          transaction: null,
        }

      case "Defly":
        if (!suggestedParams) {
          throw new Error("Suggested params are not available");
        }
        const deflyTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
          note: encodedHashedMessage,
          from: address,
          to: address,
          amount: 0,
          suggestedParams,
        } as any);

        const deflyTxnGroup = [{ txn: deflyTxn, signerAddress: [address] }];
        const deflySigArray = await deflyWallet.signTransaction([deflyTxnGroup]);
        const decodedDeflyTxn = algosdk.decodeSignedTransaction(deflySigArray[0]);
        return {
          signature: decodedDeflyTxn.sig as unknown as Uint8Array,
          transaction: deflySigArray[0],
        }

      case "Kibisis":
        if (!isClient) {
          throw new Error("Kibisis is only available in the browser");
        }
        const kibisisMessage = "MX" + JSON.stringify(message);
        const kibisisResult = await window.algorand.signBytes({
          data: new Uint8Array(Buffer.from(kibisisMessage)),
        });

        return {
          signature: kibisisResult?.signature,
          transaction: null,
        };

      case "Lute":
        if (!suggestedParams) {
          throw new Error("Suggested params are not available");
        }
        const luteTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
          note: encodedHashedMessage,
          from: address,
          to: address,
          amount: 0,
          suggestedParams,
        });

        const luteSigArray = await luteWallet!.signTxns([
          { txn: Buffer.from(algosdk.encodeUnsignedTransaction(luteTxn)).toString("base64") },
        ]);

        if (!luteSigArray[0]) {
          throw new Error("Lute signature array is empty");
        }
        const decodedLuteTxn = algosdk.decodeSignedTransaction(luteSigArray[0]);

        return {
          signature: decodedLuteTxn.sig as unknown as Uint8Array,
          transaction: luteSigArray[0],
        }

      default:
        throw new Error("Unsupported wallet provider");
    }
  };

  return {
    address,
    provider,
    isLoading,
    connectWallet,
    disconnectWallet,
    signMessage,
  };
};

// Function to handle Lute wallet connection
export const connectLute = async () => {
  if (!isClient || !luteWallet) {
    throw new Error("Lute wallet is not available");
  }
  try {
    const genesis = await algodClient.genesis().do();
    const genesisID = `${genesis.network}-${genesis.id}`;
    const addresses = await luteWallet.connect(genesisID);
    return addresses[0];
  } catch (err: any) {
    console.error(`[LuteWallet] Error connecting: ${err.message}`);
    throw err;
  }
};

// Function to inject Kibisis wallet
export const injectKibisis = async () => {
  if (!isClient) {
    throw new Error("Kibisis is only available in the browser");
  }
  console.log("Injecting Kibisis script...");

  async function enableWallet() {
    if (!window.algorand) {
      console.error("AVM Wallets not available");
      return null;
    }

    try {
      const result = await window.algorand.enable("kibisis");
      console.log("Wallet enabled:", result);
      if (result.accounts && result.accounts.length > 0) {
        return result.accounts[0].address;
      } else {
        throw new Error("No accounts available");
      }
    } catch (error) {
      console.error("Error enabling wallet:", error);
      return null;
    }
  }

  let address = await enableWallet();
  if (address) {
    return address;
  } else {
    console.log("No address obtained or user cancelled.");
    window.handleWalletError("User cancelled or no accounts available");
    throw new Error("User cancelled or no accounts available");
  }
};

