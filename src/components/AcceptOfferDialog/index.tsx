/* eslint-disable react-hooks/exhaustive-deps */
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Typography,
} from "@mui/material";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { OfferDbDoc } from "../../models/Offer";
import { User } from "../../models/User";

type Props = {
  offer: OfferDbDoc;
  onClose: () => void;
  user: User;
  isLoading: boolean;
  onAcceptOffer: (offer: OfferDbDoc) => void;
};

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

const AcceptOfferDialog = ({
  offer,
  onClose,
  user,
  isLoading,
  onAcceptOffer,
}: Props) => {
  const [finalEth, setFinalEth] = useState(0);
  const [ethUsdPrice, setEthUsdPrice] = useState<number>(0);

  const fetchPrice = async () => {
    const price = await getEthPrice();
    setEthUsdPrice(price);
  };
  useEffect(() => {
    if (offer) {
      fetchPrice();
      setFinalEth((offer.amount * 50) / 100);
    }
  }, []);

  return (
    <Dialog open onClose={onClose} fullWidth>
      <DialogTitle fontWeight={"bold"}>Offer</DialogTitle>
      <Divider />
      <DialogContent>
        <Box>
          <Typography variant="h6">WETH {offer.amount.toFixed(2)}</Typography>
          <Typography variant="caption">
            {process.env.REACT_APP_ROYALTY}% royalty
          </Typography>
        </Box>
        <Box mt={2}>
          <Typography variant="h6">WETH {finalEth.toFixed(2)}</Typography>
          <Typography variant="caption">{`ETH/USD $${ethUsdPrice}`}</Typography>
          {/* <Typography variant="caption">-12343 gwei</Typography> */}
        </Box>
        {/* <Box mt={2}>
          <Typography>WETH</Typography>
          <Typography variant="caption">ETH/USD</Typography>
        </Box> */}
        <Box mt={2}>
          <Typography variant="h5" fontFamily={"Space Mono"}>
            ${(finalEth * ethUsdPrice).toFixed(2)}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ pr: { md: 4 } }}>
        <LoadingButton
          variant="outlined"
          color="info"
          loading={isLoading}
          onClick={(e) => {
            e.stopPropagation();
            onAcceptOffer(offer);
          }}
        >
          Accept
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default AcceptOfferDialog;
