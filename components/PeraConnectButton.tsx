import React from "react";
import LoadingSpinner from "./LoadingSpinner";
import { IconPerra } from "@/icons/pera";

const PeraConnectButton = ({
  onConnect,
  isLoading,
}: {
  onConnect: () => void;
  isLoading: boolean;
}) => {
  const handleClick = async () => {
    try {
      onConnect();
    } catch (error) {
      console.error("Error connecting to Pera Wallet:", error);
    }
  };
  return (
    <button
      disabled={isLoading}
      className="w-full bg-primary h-12 text-primary-foreground py-3 px-4 rounded-md hover:bg-primary/90 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
      onClick={handleClick}
    >
      {isLoading ? <LoadingSpinner /> : <><IconPerra className="mr-2"/> Connect Pera</>}
    </button>
  );
};

export default PeraConnectButton;
