import algosdk from "algosdk";

/**
 * Convert a Uint8Array to a Base64 string
 * @param bytes - The Uint8Array to convert
 * @returns The Base64 encoded string
 */
export function uint8ArrayToBase64(bytes: Uint8Array): string {
  return btoa(String.fromCharCode.apply(null, bytes as any));
}

/**
 * Shorten an Algorand address for display purposes
 * @param address - The full Algorand address
 * @param chars - The number of characters to show at the start and end
 * @returns The shortened address string
 */
export function shortenAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

/**
 * Convert a string message to a Uint8Array
 * @param message - The message to convert
 * @returns The message as a Uint8Array
 */
export function getMessageBytes(message: string): Uint8Array {
  return new Uint8Array(Buffer.from(message, "utf8"));
}

/**
 * Hash a message string
 * @param message - The message to hash
 * @returns The hashed message as a Uint8Array
 */
export function hashMessage(message: string): Uint8Array {
  return new Uint8Array(Buffer.from(JSON.stringify(message), "utf8"));
}

/**
 * Initialize an Algod client for mainnet
 * @returns An instance of Algodv2 client
 */
export function initializeAlgodClient(): algosdk.Algodv2 {
  return new algosdk.Algodv2("", "https://mainnet-api.algonode.cloud", "");
}
