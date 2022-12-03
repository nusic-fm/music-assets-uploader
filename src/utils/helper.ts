import { BigNumber, ethers } from "ethers";
import { AuctionConfig } from "../models/BidAuction";

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

export const withdrawForUser = async (
  custodialWallet: string,
  toAddress: string
): Promise<string> => {
  const provider = new ethers.providers.AlchemyProvider(
    process.env.REACT_APP_CHAIN_NAME as string,
    process.env.REACT_APP_ALCHEMY as string
  );
  const wallet = new ethers.Wallet(
    process.env.REACT_APP_MASTER_PK as string,
    provider
  );
  const nftContract = new ethers.Contract(
    process.env.REACT_APP_MASTER_CONTRACT_ADDRESS as string,
    [
      {
        inputs: [
          {
            internalType: "address",
            name: "_userAddress",
            type: "address",
          },
          {
            internalType: "address",
            name: "_to",
            type: "address",
          },
        ],
        name: "withdrawForUser",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
    wallet
  );
  const tx = await nftContract.withdrawForUser(custodialWallet, toAddress);
  await tx.wait();
  return tx.hash;
};

export const getWethBalance = async (address: string): Promise<BigNumber> => {
  const provider = new ethers.providers.AlchemyProvider(
    process.env.REACT_APP_CHAIN_NAME as string,
    process.env.REACT_APP_ALCHEMY as string
  );
  const wethContract = new ethers.Contract(
    process.env.REACT_APP_WETH as string,
    [
      {
        inputs: [
          {
            internalType: "address",
            name: "account",
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
  const balanceBn = await wethContract.balanceOf(address);
  // const balance = balanceBn.toString();
  return balanceBn;
};

const auctionABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_contract",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
      {
        internalType: "bytes4",
        name: "_tokenKind",
        type: "bytes4",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "auction_startTime",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "auction_endTime",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "auction_hammerTimeDuration",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "auction_bidDecimals",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "auction_stepMin",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "auction_incMin",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "auction_incMax",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "auction_bidMultiplier",
            type: "uint256",
          },
        ],
        internalType: "struct AuctionController.AuctionConfig",
        name: "_auctionConfig",
        type: "tuple",
      },
    ],
    name: "registerAnAuctionToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_auctionID",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_bidAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_highestBid",
        type: "uint256",
      },
    ],
    name: "bid",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export const registerAuction = async (
  signer: any,
  tokenId: string,
  config: AuctionConfig
): Promise<string> => {
  // const provider = new ethers.providers.AlchemyProvider(
  //   process.env.REACT_APP_CHAIN_NAME as string,
  //   process.env.REACT_APP_ALCHEMY as string
  // );
  const auctionContract = new ethers.Contract(
    process.env.REACT_APP_AUCTION_CONTROLLER as string,
    auctionABI,
    signer
  );
  const nftAddress = process.env.REACT_APP_CONTRACT_ADDRESS as string;
  const tx = await auctionContract.registerAnAuctionToken(
    nftAddress,
    tokenId,
    "0x73ad2146",
    config
  );
  await tx.wait();
  // const balance = balanceBn.toString();
  return tx.hash;
};
export const getAuctionId = async (tokenId: string): Promise<string> => {
  const provider = new ethers.providers.AlchemyProvider(
    process.env.REACT_APP_CHAIN_NAME as string,
    process.env.REACT_APP_ALCHEMY as string
  );
  const auctionContract = new ethers.Contract(
    process.env.REACT_APP_AUCTION_CONTROLLER as string,
    [
      {
        inputs: [
          {
            internalType: "address",
            name: "_contract",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "_tokenID",
            type: "uint256",
          },
        ],
        name: "getAuctionID",
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
  const nftAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
  const auctionIdBn = await auctionContract.getAuctionID(nftAddress, tokenId);
  // const balance = balanceBn.toString();
  return auctionIdBn.toString();
};
export const getHighestBid = async (auctionId: string): Promise<BigNumber> => {
  const provider = new ethers.providers.AlchemyProvider(
    process.env.REACT_APP_CHAIN_NAME as string,
    process.env.REACT_APP_ALCHEMY as string
  );
  const auctionContract = new ethers.Contract(
    process.env.REACT_APP_AUCTION_CONTROLLER as string,
    [
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_auctionID",
            type: "uint256",
          },
        ],
        name: "getAuctionHighestBid",
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
  const highestBid = await auctionContract.getAuctionHighestBid(auctionId);
  return highestBid;
};
export const bid = async (
  signer: any,
  auctionId: string,
  amount: BigNumber,
  highestBid: BigNumber
): Promise<string> => {
  const auctionContract = new ethers.Contract(
    process.env.REACT_APP_AUCTION_CONTROLLER as string,
    auctionABI,
    signer
  );
  const tx = await auctionContract.bid(auctionId, amount, highestBid);
  await tx.wait();
  return tx.hash;
};

export const approveNftForAuction = async (
  tokenId: string,
  signer: any
): Promise<string> => {
  // const provider = new ethers.providers.AlchemyProvider(
  //   process.env.REACT_APP_CHAIN_NAME as string,
  //   process.env.REACT_APP_ALCHEMY as string
  // );
  const nftContract = new ethers.Contract(
    process.env.REACT_APP_CONTRACT_ADDRESS as string,
    [
      {
        inputs: [
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
        ],
        name: "approve",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
    signer
  );
  const tx = await nftContract.approve(
    process.env.REACT_APP_AUCTION_CONTROLLER as string,
    tokenId
  );
  await tx.wait();
  return tx.hash;
};
export const approveWeth = async (
  signer: any,
  amount: BigNumber,
  toAddress: string
): Promise<string> => {
  const wethContract = new ethers.Contract(
    process.env.REACT_APP_WETH as string,
    [
      {
        inputs: [
          {
            internalType: "address",
            name: "spender",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
        ],
        name: "approve",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
    signer
  );
  const tx = await wethContract.approve(toAddress, amount);
  await tx.wait();
  return tx.hash;
};

export const getWethAllowance = async (
  library: any,
  from: string,
  toAddress: string
): Promise<BigNumber> => {
  const wethContract = new ethers.Contract(
    process.env.REACT_APP_WETH as string,
    [
      {
        inputs: [
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            internalType: "address",
            name: "spender",
            type: "address",
          },
        ],
        name: "allowance",
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
    library
  );
  const tx = await wethContract.allowance(from, toAddress);
  return tx;
};

// function hex2a(hexx: string) {
//   var hex = hexx.toString(); //force conversion
//   var str = "";
//   for (var i = 0; i < hex.length; i += 2)
//     str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
//   return str;
// }

// export const getBidEvents = async (): Promise<any> => {
//   const provider = new ethers.providers.AlchemyProvider(
//     process.env.REACT_APP_CHAIN_NAME as string,
//     process.env.REACT_APP_ALCHEMY as string
//   );
//   const auctionContract = new ethers.Contract(
//     process.env.REACT_APP_AUCTION_CONTROLLER as string,
//     auctionABI,
//     provider
//   );
//   const bids = await auctionContract.queryFilter("*");
//   debugger;
//   // BidPlaced;
// };
