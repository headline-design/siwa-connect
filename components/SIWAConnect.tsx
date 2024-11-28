"use client";

import React, { useState, useEffect } from "react";
import { SiwaMessage } from "@avmkit/siwa";
import JSONViewer from "./JsonViewer";
import LoadingSpinner from "./LoadingSpinner";
import { uint8ArrayToBase64 } from "@/utils/siwaUtils";
import ConnectedNote from "./ConnectedNote";
import PeraConnectButton from "./PeraConnectButton";
import DeflyConnectButton from "./DeflyConnectButton";
import StepExplanation from "./StepExplanation";
import {
  useWalletConnection,
  WalletProvider,
} from "@/hooks/useWalletConnection";
import { Button } from "./Button";
import { Alert } from "./Alert";
import { KibisisConnectButton } from "./KibisisConnectButton";
import LuteConnectButton from "./LuteConnectButton";

/**
 * SIWAConnect Component
 * This component handles the Sign-In with Algorand (SIWA) flow using Pera Wallet and Defly Wallet and Kibisis Wallet and Lute Wallet.
 */
export default function SIWAConnect() {
  // Custom hook to manage wallet connections
  const {
    address,
    provider,
    isLoading,
    connectWallet,
    disconnectWallet,
    signMessage,
  } = useWalletConnection();

  // State management
  const [signedMessage, setSignedMessage] = useState<string | null>(null);
  const [pendingProvider, setPendingProvider] = useState<WalletProvider | null>(
    null,
  );
  const [signing, setSigning] = useState(false);
  const [fullSigningMessage, setFullSigningMessage] = useState<any | null>(
    null,
  );
  const [credentials, setCredentials] = useState<any | null>(null);
  const [error, setError] = useState<any | null>(null);
  const [verificationResult, setVerificationResult] = useState<any | null>(
    null,
  );
  const [siwaMessageInstance, setSiwaMessageInstance] =
    useState<SiwaMessage | null>(null);
  const [activeStep, setActiveStep] = useState(0);

  // Custom hook to get the SIWA account

  // Effect to update activeStep when address changes
  useEffect(() => {
    if (address) {
      setActiveStep(1);
    } else {
      setActiveStep(0);
    }
  }, [address]);

  /**
   * Wrapper function for connectWallet to handle errors
   */
  const handleConnectWallet = async (selectedProvider: WalletProvider) => {
    setError(null);
    try {
      setPendingProvider(selectedProvider);
      await connectWallet(selectedProvider);
      // activeStep will be updated by the effect hook
    } catch (error) {
      console.error(`Error connecting to ${selectedProvider}:`, error);
      setPendingProvider(null);
      setError(error);
    }
  };

  /**
   * Wrapper function for disconnectWallet to handle errors
   */
  const handleDisconnect = async () => {
    setError(null);
    try {
      disconnectWallet();
      setActiveStep(0);
      setSignedMessage(null);
      setCredentials(null);
      setVerificationResult(null);
      setFullSigningMessage(null);
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
      setError(error);
    }
  };

  /**
   * Initiate the sign-in process
   */
  const signIn = async () => {
    if (!address) {
      setError(new Error("No address connected"));
      return;
    }

    setError(null);
    setSigning(true);
    try {
      const uri = typeof window !== "undefined" ? window.location.origin : "";
      const domain = typeof window !== "undefined" ? window.location.host : "";

      const siwaMessage = new SiwaMessage({
        domain,
        address,
        statement: "Sign in with Algorand to the app.",
        uri,
        version: "1",
        chainId: 416001,
        nonce: "randomNonce123", // In production, use a secure random nonce
      });

      setSiwaMessageInstance(siwaMessage);
      setFullSigningMessage(siwaMessage);

      const messageToSign = siwaMessage.prepareMessage();
      const { signature, transaction: encodedTransaction} = await signMessage(messageToSign);

      const algoSig = uint8ArrayToBase64(signature);

      setCredentials({
        message: JSON.stringify(siwaMessage),
        encodedTransaction: encodedTransaction || null,
        provider: provider || null,
        signature: algoSig,
        address: address,
      });

      setSignedMessage(Buffer.from(signature).toString("base64"));
      setActiveStep(2);
      setSigning(false);
    } catch (error) {
      console.error("Error signing message:", error);
      setError(error);
      setSigning(false);
    }
  };

  /**
   * Verify the SIWA message
   */
  const verifySIWAMessage = async () => {
    if (!siwaMessageInstance || !signedMessage) {
      setError(new Error("No signed message to verify"));
      return;
    }

    setError(null);
    try {
      const siwaMessage = new SiwaMessage(
        JSON.parse(credentials?.message || "{}"),
      );

      //const algoSigBase64 = uint8ArrayToBase64(credentials?.signature);

      const verifyParams = {
        signature: credentials?.signature,
        domain: typeof window !== "undefined" ? window.location.host : "",
        provider: provider || null,
        encodedTransaction: credentials?.encodedTransaction || null,
      };

      const result = await siwaMessage.verify(verifyParams);
      setVerificationResult(result);

      if (result.success) {
        console.log("Signature verified successfully");
        setActiveStep(3);
      } else {
        throw result.error || new Error("Error verifying SIWA signature");
      }
    } catch (error) {
      console.error("Error verifying SIWA message:", error);
      setError(error);
    }
  };

  /**
   * Render the current step of the SIWA process
   */
  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return (
          <div className="space-y-4">
            <PeraConnectButton
              isLoading={isLoading && pendingProvider === "Pera"}
              onConnect={() => handleConnectWallet("Pera")}
            />
            <DeflyConnectButton
              onConnect={() => handleConnectWallet("Defly")}
              isLoading={isLoading && pendingProvider === "Defly"}
            />
            <KibisisConnectButton
              isLoading={isLoading && pendingProvider === "Kibisis"}
              onConnect={() => handleConnectWallet("Kibisis")}
            />
            <LuteConnectButton
              onConnect={() => handleConnectWallet("Lute")}
              isLoading={isLoading && pendingProvider === "Lute"}
            />
          </div>
        );
      case 1:
        return (
          <div>
            <Button className="h-12 w-full" onClick={signIn} disabled={signing}>
              {signing ? <LoadingSpinner /> : "Sign In"}
            </Button>
          </div>
        );
      case 2:
        return (
          <div>
            <Button
              className="h-12 w-full"
              onClick={verifySIWAMessage}
              disabled={isLoading}
            >
              {isLoading ? <LoadingSpinner /> : "Verify SIWA Message"}
            </Button>
          </div>
        );
      case 3:
        return (
          <Alert variant="success">
            <p className="font-semibold">Verification Successful</p>
            <p>You have successfully signed in with Algorand.</p>
          </Alert>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full mx-auto">
      <div className="grid grid-rows-2 sm:grid-cols-2 sm:grid-rows-1 h-[100vh] overflow-hidden">
        <div className="w-full max-h-[100vh]  overflow-y-auto p-6 sm:p-8 bg-white text-gray-800 h-full overflow-hidden">
          <div className="max-w-3xl mr-0 ml-auto">
            <>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                {
                  [
                    "Connect Wallet",
                    "Sign Message",
                    "Verify Signature",
                    "Success",
                  ][activeStep]
                }
              </h2>
              <div className="transition-opacity duration-300 ease-in-out">
                {activeStep > 0 && activeStep < 3 && (
                  <ConnectedNote address={address} provider={provider} />
                )}
                {renderStep()}
              </div>
              {activeStep > 0 && (
                <Button
                  variant="secondary"
                  className="h-12 w-full mt-4"
                  onClick={handleDisconnect}
                  disabled={isLoading}
                >
                  Disconnect
                </Button>
              )}
            </>
          </div>
        </div>
        <div className="w-full h-full max-h-[100vh] p-6 sm:p-8 bg-ds-200 text-gray-800 border-t sm:border-t-0 sm:border-l overflow-y-auto">
          <div className="max-w-3xl ml-0 mr-auto">
            <div className="mb-6 h-full">
              <StepExplanation activeStep={activeStep} />
              <div
                className="transition-all duration-300 ease-in-out"
                style={{
                  maxHeight: error ? "1000px" : "0",
                  opacity: error ? 1 : 0,
                  overflow: "hidden",
                }}
              >
                {error && (
                  <Alert variant="error">
                    <p className="text-sm">
                      {error.message || "An error occurred"}
                    </p>
                  </Alert>
                )}
              </div>
              {activeStep === 2 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Credentials
                  </h3>
                  <JSONViewer
                    initialJson={JSON.stringify(credentials, null, 2)}
                  />
                </div>
              )}
              {fullSigningMessage && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Full Signing Message
                  </h3>
                  <JSONViewer
                    initialJson={JSON.stringify(fullSigningMessage, null, 2)}
                  />
                </div>
              )}
              {signedMessage && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Signed Message
                  </h3>
                  <JSONViewer
                    initialJson={JSON.stringify({ signedMessage }, null, 2)}
                  />
                </div>
              )}
              {verificationResult && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Verification Result
                  </h3>
                  <JSONViewer
                    initialJson={JSON.stringify(verificationResult, null, 2)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
