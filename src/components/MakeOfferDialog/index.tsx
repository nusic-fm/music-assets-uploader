/* eslint-disable react-hooks/exhaustive-deps */
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import { BigNumber, ethers } from "ethers";
import { useEffect, useState } from "react";
import { getWethBalance } from "../../utils/helper";

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
  const [amountUi, setAmountUi] = useState(0.1);
  const [amount, setAmount] = useState<BigNumber>(
    BigNumber.from(ethers.utils.parseEther("0.5"))
  );
  // const [denom, setDenom] = useState<"weth" | "usdc">("weth");
  // const [duration, setDuration] = useState(3);
  const { account } = useWeb3React();
  const [userBal, setUserBal] = useState<BigNumber>(BigNumber.from("0"));
  // const [helperText, setHelperText] = useState("");

  const getBalance = async () => {
    if (account) {
      const bal = await getWethBalance(account);
      setUserBal(bal as BigNumber);
      return bal;
    }
  };
  useEffect(() => {
    if (isOpen) getBalance();
  }, [account, isOpen]);

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle fontFamily="BenchNine" variant="h5">
        Feral #{tokenId} - Make Offer
      </DialogTitle>
      <DialogContent>
        <Box>
          <Box display={"flex"} alignItems="center" p={1}>
            <TextField
              label="WETH"
              // inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
              type="number"
              // sx={{ width: "150px" }}
              value={amountUi}
              InputProps={{ inputProps: { min: 0.05, step: "0.1" } }}
              onChange={(e) => {
                setAmountUi(Number(e.target.value));
                if (Number(e.target.value))
                  setAmount(
                    BigNumber.from(ethers.utils.parseEther(e.target.value))
                  );
              }}
              helperText={
                account ? (
                  amount.gt(userBal) ? (
                    "Not enough Balance"
                  ) : (
                    <a
                      href="//app.uniswap.org/#/tokens/ethereum/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
                      style={{ color: "cornflowerblue" }}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Swap for WETH
                    </a>
                  )
                ) : (
                  "Connect your Wallet"
                )
              }
              error={!account || amount.gt(userBal)}
            />
          </Box>
          {/* <Box mt={4}>
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
          </Box> */}
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
          onClick={async () => {
            // const date = new Date();
            // date.setDate(date.getDate() + duration);
            // const bal = await getBalance();
            // if (bal && amount.lte(userBal)) {
            onSubmitOffer(amountUi, "weth", new Date().toUTCString());
            // }
          }}
          disabled={
            amount.gt(userBal) ||
            amount.lt(BigNumber.from(ethers.utils.parseEther("0.05"))) ||
            amountUi < 0.05
          }
          loading={isLoading}
        >
          Submit
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default MakeOfferDialog;

// <Select
//   defaultValue={"eth"}
//   variant="filled"
//   value={denom}
//   onChange={(e) => setDenom(e.target.value as "weth" | "usdc")}
// >
//   <MenuItem value={"weth"}>WETH</MenuItem>
//   {/* <MenuItem value={"usdc"}>USDC</MenuItem> */}
// </Select>;
