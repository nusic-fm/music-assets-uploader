export interface Offer {
  userId: string;
  amount: number;
  denom: "weth" | "usdc";
  tokenId: number;
  duration: string;
  userName: string;
  userAvatar?: string;
  walletAddress: string;
  isActive: boolean;
  isSold: boolean;
  approvedHash: string;
  acceptedReceipt?: string;
  acceptedReceiptHash?: string;
  discriminator?: string;
}
export interface OfferDbDoc extends Offer {
  id: string;
}
