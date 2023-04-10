import { ethers } from "ethers";

// const providerURL = "https://rpc.api.moonbase.moonbeam.network";
// Define Provider
export const provider = new ethers.providers.JsonRpcProvider(
  "https://mainnet.infura.io/v3/3f0d969229604235b801f6bdba713212"
);
//   new ethers.providers.StaticJsonRpcProvider(
//   providerURL,
//   {
//     chainId: 1287,
//     name: "moonbase-alphanet",
//   }
// );
