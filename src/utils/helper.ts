import { ethers } from "ethers";

export const dataFeedsForUsd: { [key: string]: string } = {
  mainnet: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419",
  maticmum: "0x0715A7794a1dc8e42615F059dD6e406A6594651A",
};
export const getEthPrice = async (): Promise<number> => {
  const provider = new ethers.providers.AlchemyProvider(
    process.env.REACT_APP_CHAIN_NAME as string,
    process.env.REACT_APP_ALCHEMY as string
  );
  const contract = new ethers.Contract(
    dataFeedsForUsd[process.env.REACT_APP_CHAIN_NAME as string],
    ["function latestAnswer() view returns (uint)"],
    provider
  );
  const price = await contract.latestAnswer();
  // Figured it from data feeds: 100000000
  return parseInt(price) / 100000000;
};
