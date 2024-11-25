import React from "react";
import { Button } from "./Button";
import LoadingSpinner from "./LoadingSpinner";
import { WalletProvider } from "@/hooks/useWalletConnection";

interface WalletSelectorProps {
  onConnect: (provider: WalletProvider) => void;
  isLoading: boolean;
  pendingProvider: WalletProvider | null;
}

export function WalletSelector({
  onConnect,
  isLoading,
  pendingProvider,
}: WalletSelectorProps) {
  return (
    <div className="space-y-4">
      <Button
        onClick={() => onConnect("PeraWallet")}
        disabled={isLoading}
        className="w-full"
      >
        {isLoading && pendingProvider === "PeraWallet" ? (
          <LoadingSpinner />
        ) : (
          "Connect Pera Wallet"
        )}
      </Button>
      <Button
        onClick={() => onConnect("Defly")}
        disabled={isLoading}
        className="w-full"
      >
        {isLoading && pendingProvider === "Defly" ? (
          <LoadingSpinner />
        ) : (
          "Connect Defly Wallet"
        )}
      </Button>
    </div>
  );
}
