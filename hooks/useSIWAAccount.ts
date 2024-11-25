import { keccak256 } from "js-sha3";
import algosdk from "algosdk";

const useSIWAAccount = (algoAddress: string) => {
  const initAddress = algoAddress;

  // Validate the Algorand address
  if (!initAddress || typeof initAddress !== "string") {
    //console.error('Invalid or missing address');
    return { address: null, chain: { id: null } };
  }

  // Decode the Algorand address to get the publicKey
  let addrArray;
  try {
    addrArray = algosdk.decodeAddress(initAddress);
  } catch (error) {
    console.error("Failed to decode address:", error);
    return { address: null, chain: { id: null } };
  }

  // Convert publicKey to a hex string
  const publicKeyHex = Buffer.from(addrArray.publicKey).toString("hex");

  // Create a keccak256 hash of the public key
  const hash = keccak256(Buffer.from(publicKeyHex, "hex"));

  // Convert the hash to a hexadecimal string and take the last 20 bytes (40 characters)
  const addressHex = Buffer.from(hash).toString("hex").substring(24, 64);

  // Initialize a variable for the checksum address starting with '0x'
  let checksumAddress = "0x";

  // Apply the EIP-55 checksum rules based on the hash
  for (let i = 0; i < 40; i++) {
    const character = addressHex[i];
    const hashValue = parseInt(hash[i % hash.length], 16);
    checksumAddress +=
      hashValue >= 8 ? character.toUpperCase() : character.toLowerCase();
  }

  return {
    address: checksumAddress,
    chain: { id: 1 },
  };
};

export default useSIWAAccount;
