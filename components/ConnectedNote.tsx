import React from 'react';
import { shortenAddress } from "@/utils/siwaUtils";

interface ConnectedNoteProps {
  algoAddress: string | null;
  address: string | null;
  provider: string;
}

const ConnectedNote: React.FC<ConnectedNoteProps> = ({ algoAddress, address, provider }) => {
  return (
    <div className="text-sm text-muted-foreground bg-transparent border p-3 rounded-md break-all mb-4 flex flex-col items-start">
      <span>
        <span className="text-sm text-foreground">Connected: </span>
        <span className="text-sm text-foreground">
          {algoAddress ? shortenAddress(algoAddress, 10) : "N/A"}
        </span>
      </span>
      <span className="text-xs text-foreground">
        {address ? shortenAddress(address, 10) : "N/A"}
      </span>
      <span className="text-xs text-foreground">Provider: {provider}</span>
    </div>
  );
};

export default ConnectedNote;
