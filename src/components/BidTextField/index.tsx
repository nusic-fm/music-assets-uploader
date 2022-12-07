import {
  Box,
  TextField,
  CircularProgress,
  Typography,
  Link,
} from "@mui/material";
import { BigNumber, ethers } from "ethers";
import { motion } from "framer-motion";
import { useState } from "react";
import { AuctionTokenDoc } from "../../models/BidAuction";

type Props = {
  auctionObj: AuctionTokenDoc;
  onBidNow: (newBid: BigNumber) => void;
  isLoading: boolean;
  previousBid: BigNumber;
  setShowAlertMessage: any;
};

const BidTextField = ({
  auctionObj,
  onBidNow,
  isLoading,
  previousBid,
  setShowAlertMessage,
}: Props) => {
  const [bidValueUi, setBidValueUi] = useState<Number>();
  const [bidValue, setBidValue] = useState(BigNumber.from("0"));
  const onBidChange = (e: any) => {
    setBidValueUi(Number(e.target.value));
    setBidValue(BigNumber.from(ethers.utils.parseEther(e.target.value)));
  };
  return (
    <Box display={"flex"} flexDirection="column" alignItems={"start"}>
      <Box display={"flex"} alignItems="center">
        <TextField
          type={"number"}
          onChange={onBidChange}
          value={bidValueUi}
          InputProps={{
            inputProps: { min: 0.1, step: "0.1" },
          }}
          sx={{ mr: 1, width: "150px" }}
        />
        <motion.div
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.8 }}
          style={{
            background: `linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)`,
            borderRadius: "6px",
            // width: "150px",
            padding: "8px 20px",
            // height: "80px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            userSelect: "none",
            MozUserSelect: "none",
            msUserSelect: "none",
          }}
          onClick={() => {
            const _nextStepBid = previousBid.add(previousBid.mul(10).div(100));
            if (bidValue.lte(_nextStepBid)) {
              setShowAlertMessage(
                `Place higher bid than ${ethers.utils.formatEther(
                  _nextStepBid
                )} WETH`
              );
              return;
            }
            if (!!auctionObj) {
              onBidNow(bidValue);
            }
          }}
        >
          {isLoading ? (
            <CircularProgress size={36} color="secondary" />
          ) : (
            <Typography variant="h6" align="center">
              BID NOW
            </Typography>
          )}
        </motion.div>
      </Box>
      <Link
        href="//app.uniswap.org/#/tokens/ethereum/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
        target={"_blank"}
        sx={{ mt: 1, color: "cornflowerblue" }}
      >
        Get WETH
      </Link>
    </Box>
  );
};

export default BidTextField;
