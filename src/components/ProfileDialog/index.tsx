/* eslint-disable react-hooks/exhaustive-deps */
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Chip,
  Dialog,
  DialogContent,
  Divider,
  Grid,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import axios from "axios";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { User } from "../../models/User";
import { checkNftBalance, getUserBalance } from "../../utils/helper";

type Props = {
  isOpen: boolean;
  user: User;
  onClose: () => void;
  refreshUser: () => void;
  setShowAlertMessage: any;
  ethUsdPrice: number;
};

const CREATE_WALLET_URL = `${process.env.REACT_APP_MARKET_API}/wallet/create`;

const ProfileDialog = (props: Props) => {
  const {
    isOpen,
    user,
    onClose,
    refreshUser,
    setShowAlertMessage,
    ethUsdPrice,
  } = props;
  const [currentStep, setCurrentStep] = useState(0);
  const [userCollection, setUserCollection] = useState(0);
  const [userBalance, setUserBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUserCollection = async () => {
    if (user.pubkey) {
      setIsLoading(true);
      const noOfTokens = await checkNftBalance(user.pubkey);
      setUserCollection(noOfTokens);
      setIsLoading(false);
    }
  };
  const fetchUserBalance = async () => {
    if (user.pubkey) {
      const noOfTokens = await getUserBalance(user.pubkey);
      setUserBalance(Number(ethers.utils.formatEther(noOfTokens)));
    }
  };
  useEffect(() => {
    if (user.pubkey) {
      setCurrentStep(1);
      fetchUserCollection();
      fetchUserBalance();
    }
  }, [user.pubkey]);

  const onCreateWallet = async () => {
    if (!user.uid) {
      setShowAlertMessage("Kindly login and try again.");
      return;
    }
    setIsLoading(true);
    try {
      const res = await axios.post(CREATE_WALLET_URL, {
        id: user.uid,
      });
      console.log(res);
      refreshUser();
      setIsLoading(false);
    } catch (e) {}
  };
  return (
    <Dialog
      open={isOpen}
      onClose={() => {
        if (!isLoading) onClose();
      }}
    >
      <DialogContent>
        <Box my={2}>
          <Typography variant="h4">
            Profile - {user.name}#{user.discriminator}
          </Typography>
        </Box>
        {user.pubkey && (
          <Chip
            sx={{ mb: 2 }}
            label={`${user.pubkey.slice(0, 6)}...${user.pubkey.slice(
              user.pubkey.length - 4
            )}`}
            size="small"
            variant="outlined"
            clickable
            onClick={() => {
              navigator.clipboard.writeText(user.pubkey || "");
            }}
          />
        )}
        <Divider />
        <Box my={2}>
          {userCollection === 0 && (
            <Stepper activeStep={currentStep} orientation="vertical">
              <Step>
                <StepLabel>Setup Wallet</StepLabel>
                <StepContent>
                  <Box>
                    <LoadingButton
                      variant="outlined"
                      color="info"
                      onClick={onCreateWallet}
                      loading={isLoading}
                    >
                      Create my wallet
                    </LoadingButton>
                  </Box>
                </StepContent>
              </Step>
              <Step>
                <StepLabel>Import NFT</StepLabel>
                <StepContent>
                  <Box mt={1}>
                    <Typography>
                      If your NFT is in Crossmint, follow the below video to
                      export it to the below address
                    </Typography>
                  </Box>
                  <Box>
                    <Typography align="center">Or</Typography>
                  </Box>
                  <Box>
                    <Typography>
                      If your NFT is in your wallet, Kindly send the NFT to the
                      below address. Watch how to export the NFT from Crossmint{" "}
                      <a
                        href="https://www.youtube.com/watch?v=hywkZfT2APg"
                        target={"_blank"}
                        rel="noreferrer"
                        style={{ color: "cornflowerblue", cursor: "pointer" }}
                      >
                        here
                      </a>
                    </Typography>
                  </Box>
                  <Typography sx={{ mt: 2 }} fontWeight="bold">
                    Custodial Address: {user.pubkey}
                  </Typography>
                  <Box display={"flex"} justifyContent="center" mt={2}>
                    <LoadingButton
                      variant="outlined"
                      color="info"
                      onClick={() => {
                        fetchUserCollection();
                      }}
                      loading={isLoading}
                    >
                      Check for NFT
                    </LoadingButton>
                  </Box>
                </StepContent>
              </Step>
            </Stepper>
          )}
          <Grid container rowSpacing={3}>
            {userCollection > 0 && (
              <>
                <Grid item xs={12} md={4}>
                  <Typography variant="h5" fontFamily={"monospace"}>
                    Collections
                  </Typography>
                </Grid>
                <Grid item xs={12} md={8}>
                  <Chip sx={{ ml: 2 }} color="info" label={userCollection} />
                </Grid>
              </>
              // <Box my={2} display="flex">
              //   <Typography variant="h5" fontFamily={"monospace"}>
              //     Collections
              //   </Typography>
              //   <Chip sx={{ ml: 2 }} color="info" label={userCollection} />
              // </Box>
            )}
            {userBalance > 0 && (
              <>
                <Grid item xs={12} md={4}>
                  <Typography variant="h5" fontFamily={"monospace"}>
                    Balance
                  </Typography>
                </Grid>
                <Grid item xs={12} md={8}>
                  <Box
                    display={"flex"}
                    alignItems="center"
                    flexWrap={"wrap"}
                    gap={2}
                    justifyContent={"center"}
                  >
                    <Chip
                      sx={{ ml: 2 }}
                      color="success"
                      label={`$${(userBalance * ethUsdPrice).toFixed(
                        2
                      )} (${userBalance} ETH)`}
                    ></Chip>
                    {/* <Button variant="outlined" color="info" size="small">
                      Withdraw
                    </Button> */}
                  </Box>
                </Grid>
              </>
              // <Box my={2} display="flex">
              //   <Typography variant="h5" fontFamily={"monospace"}>
              //     Balance
              //   </Typography>
              //   <Chip
              //     sx={{ ml: 2 }}
              //     color="success"
              //     label={`$${(userBalance * ethUsdPrice).toFixed(
              //       2
              //     )} (${userBalance} ETH)`}
              //   ></Chip>
              // </Box>
            )}
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileDialog;
