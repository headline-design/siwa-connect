import React from "react";
import LoadingSpinner from "./LoadingSpinner";
import { IconDefly } from "@/icons/defly";

interface DeflyConnectButtonProps {
  onConnect: any;
  isLoading: boolean;
}

const DeflyConnectButton: React.FC<DeflyConnectButtonProps> = ({
  onConnect,
  isLoading,
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
      onClick={handleClick}
      disabled={isLoading}
      className="w-full bg-primary h-12 text-primary-foreground py-3 px-4 rounded-md hover:bg-primary/90 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
    >
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <IconDefly className="mr-2" /> Connect Defly
        </>
      )}
    </button>
  );
};

export default DeflyConnectButton;
