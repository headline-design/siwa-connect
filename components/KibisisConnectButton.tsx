"use client";

import IconKibisis from "@/icons/kibisis";
import LoadingSpinner from "./LoadingSpinner";

export function KibisisConnectButton({
  isLoading,
  onConnect,
}: {
  isLoading: boolean;
  onConnect: () => void;
}) {
  return (
    <button
      disabled={isLoading}
      className="w-full bg-primary h-12 text-primary-foreground py-3 px-4 rounded-md hover:bg-primary/90 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
      onClick={onConnect}
    >
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <IconKibisis className="mr-2" /> Connect Kibisis
        </>
      )}
    </button>
  );
}
