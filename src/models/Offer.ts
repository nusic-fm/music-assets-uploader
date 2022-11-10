export interface Offer {
  userId: string;
  amount: number;
  denom: "weth" | "usdc";
  tokenId: number;
  duration: string;
}
