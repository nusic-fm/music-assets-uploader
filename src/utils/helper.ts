import { ethers } from "ethers";

export const dataFeedsForUsd: { [key: string]: string } = {
  homestead: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419",
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

export const checkNftBalance = async (address: string): Promise<number> => {
  const provider = new ethers.providers.AlchemyProvider(
    process.env.REACT_APP_CHAIN_NAME as string,
    process.env.REACT_APP_ALCHEMY as string
  );
  const nftContract = new ethers.Contract(
    process.env.REACT_APP_CONTRACT_ADDRESS as string,
    [
      {
        inputs: [
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
        ],
        name: "balanceOf",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
    ],
    provider
  );
  const balanceBn = await nftContract.balanceOf(address);
  const balance = balanceBn.toNumber();
  return balance;
};

export const getUserBalance = async (address: string): Promise<string> => {
  const provider = new ethers.providers.AlchemyProvider(
    process.env.REACT_APP_CHAIN_NAME as string,
    process.env.REACT_APP_ALCHEMY as string
  );
  const nftContract = new ethers.Contract(
    process.env.REACT_APP_MASTER_CONTRACT_ADDRESS as string,
    [
      {
        inputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        name: "userBalance",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
    ],
    provider
  );
  const balanceBn = await nftContract.userBalance(address);
  const balance = balanceBn.toString();
  return balance;
};

export const getOwnerOfNft = async (tokenId: string): Promise<string> => {
  const provider = new ethers.providers.AlchemyProvider(
    process.env.REACT_APP_CHAIN_NAME as string,
    process.env.REACT_APP_ALCHEMY as string
  );
  const nftContract = new ethers.Contract(
    process.env.REACT_APP_CONTRACT_ADDRESS as string,
    [
      {
        inputs: [
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
        ],
        name: "ownerOf",
        outputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
    ],
    provider
  );
  const ownerAddressBn = await nftContract.ownerOf(tokenId);
  const ownerAddress = ownerAddressBn.toString();
  return ownerAddress;
};

export const withdraw = async (tokenId: string): Promise<string> => {
  const provider = new ethers.providers.AlchemyProvider(
    process.env.REACT_APP_CHAIN_NAME as string,
    process.env.REACT_APP_ALCHEMY as string
  );
  const nftContract = new ethers.Contract(
    process.env.REACT_APP_CONTRACT_ADDRESS as string,
    [
      {
        inputs: [
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
        ],
        name: "ownerOf",
        outputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
    ],
    provider
  );
  const ownerAddressBn = await nftContract.ownerOf(tokenId);
  const ownerAddress = ownerAddressBn.toString();
  return ownerAddress;
};
