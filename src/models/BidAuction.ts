export interface AuctionConfig {
  auction_startTime: number;
  auction_endTime: number;
  auction_hammerTimeDuration: number;
  auction_bidDecimals: number;
  auction_stepMin: number;
  auction_incMin: number;
  auction_incMax: number;
  auction_bidMultiplier: number;
}
export interface BidDoc {
  bidderAddress: string;
  amount: string;
  time: number;
}
export interface AuctionTokenDoc {
  auctionId: string;
  createdAt: string;
  ownerAddress: string;
  startTime: string;
  endTime: string;
  auction_startTime: number;
  auction_endTime: number;
  auction_hammerTimeDuration: 5;
  auction_stepMin: 10000;
  auction_incMin: 1000;
  auction_incMax: 1000;

  bids?: BidDoc[];
}
