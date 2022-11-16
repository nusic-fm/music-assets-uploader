import { LoadingButton } from "@mui/lab";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

const MakeOfferDialog = (props: {
  onSubmitOffer: (
    amount: number,
    denom: "weth" | "usdc",
    duration: string
  ) => Promise<void>;
  isOpen: boolean;
  onClose: () => void;
  tokenId: number;
  isLoading: boolean;
}) => {
  const { onSubmitOffer, isOpen, tokenId, onClose, isLoading } = props;
  const [amount, setAmount] = useState(0.1);
  const [denom, setDenom] = useState<"weth" | "usdc">("weth");
  const [duration, setDuration] = useState(3);

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle fontFamily="BenchNine">
        <Typography variant="h5">Feral #{tokenId} - Make Offer</Typography>
      </DialogTitle>
      <DialogContent>
        <Box>
          <Box display={"flex"} alignItems="center">
            <TextField
              type="number"
              sx={{ width: "150px" }}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
            <Select
              defaultValue={"eth"}
              variant="filled"
              value={denom}
              onChange={(e) => setDenom(e.target.value as "weth" | "usdc")}
            >
              <MenuItem value={"weth"}>WETH</MenuItem>
              {/* <MenuItem value={"usdc"}>USDC</MenuItem> */}
            </Select>
          </Box>
          <Box mt={4}>
            <FormControl fullWidth>
              <InputLabel id="duration">Duration</InputLabel>

              <Select
                labelId="duration"
                label="Duration"
                value={duration}
                onChange={(e) => {
                  setDuration(Number(e.target.value));
                }}
              >
                <MenuItem value={1}>1 day</MenuItem>
                <MenuItem value={3}>3 days</MenuItem>
                <MenuItem value={7}>7 days</MenuItem>
                <MenuItem value={30}>30 days</MenuItem>
              </Select>
            </FormControl>
          </Box>
          {/* <LocalizationProvider>
              <DateTimePicker
                renderInput={(props: any) => <TextField {...props} />}
                label="Duration"
                // value={value}
                // onChange={(newValue) => {
                //   setValue(newValue);
                // }}
              />
            </LocalizationProvider> */}
        </Box>
      </DialogContent>
      <DialogActions>
        <LoadingButton
          variant="contained"
          onClick={() => {
            const date = new Date();
            date.setDate(date.getDate() + duration);
            onSubmitOffer(amount, denom, date.toUTCString());
          }}
          loading={isLoading}
        >
          Submit
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default MakeOfferDialog;
