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
import { OfferDbDoc } from "../../models/Offer";
import { User } from "../../models/User";

type Props = {
  offer: OfferDbDoc;
  onClose: () => void;
  user: User;
  isLoading: boolean;
  onAcceptOffer: (offer: OfferDbDoc) => void;
  ethUsdPrice: number;
};

const AcceptOfferDialog = ({
  offer,
  onClose,
  user,
  isLoading,
  onAcceptOffer,
  ethUsdPrice,
}: Props) => {
  // const [finalEth, setFinalEth] = useState(0);
  // useEffect(() => {
  //   if (offer) {
  //     setFinalEth((offer.amount * 50) / 100);
  //   }
  // }, []);

  const offerInUsd = (offer.amount * ethUsdPrice).toFixed(2);
  const offerAfterDeductionInUsd = (
    ((offer.amount * 50) / 100) *
    ethUsdPrice
  ).toFixed(2);

  return (
    <Dialog open onClose={onClose} fullWidth>
      <DialogTitle fontWeight={"bold"}>Offer</DialogTitle>
      <Divider />
      <DialogContent>
        <Box>
          <Typography variant="h6">
            ${offerInUsd} (WETH {offer.amount.toFixed(2)})
          </Typography>
          {/* <Typography variant="h6">WETH {offer.amount.toFixed(2)}</Typography> */}
          <Typography variant="caption">
            {process.env.REACT_APP_ROYALTY}% royalty
          </Typography>
          <Box mt={0.4}>
            <Typography variant="caption">{`ETH/USD = $${ethUsdPrice}`}</Typography>
          </Box>
        </Box>
        {/* <Box mt={2}>
          <Typography variant="h6">${offerAfterDeductionInUsd}</Typography>
          <Typography variant="h6">WETH {finalEth.toFixed(2)}</Typography>
          <Typography variant="caption">{`ETH/USD APPROX $${ethUsdPrice}`}</Typography>
          <Typography variant="caption">-12343 gwei</Typography>
        </Box> */}
        {/* <Box mt={2}>
          <Typography>WETH</Typography>
          <Typography variant="caption">ETH/USD</Typography>
        </Box> */}
        <Box mt={4}>
          <Typography variant="h4" fontFamily={"Space Mono"}>
            ${offerAfterDeductionInUsd}
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
