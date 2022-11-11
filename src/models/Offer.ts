export interface Offer {
  userId: string;
  amount: number;
  denom: "weth" | "usdc";
  tokenId: number;
  duration: string;
  userName: string;
  userAvatar: string;
  walletAddress: string;
}
export interface OfferDbDoc extends Offer {
  id: string;
  isCancelled: boolean;
}
