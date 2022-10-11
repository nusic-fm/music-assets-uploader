import { ethers } from "ethers";

const providerURL = "https://rpc.api.moonbase.moonbeam.network";
// Define Provider
export const provider = new ethers.providers.StaticJsonRpcProvider(
  providerURL,
  {
    chainId: 1287,
    name: "moonbase-alphanet",
  }
);
