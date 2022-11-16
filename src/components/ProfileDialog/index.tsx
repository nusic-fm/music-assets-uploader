/* eslint-disable react-hooks/exhaustive-deps */
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Chip,
  Dialog,
  DialogContent,
  Divider,
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

type Props = {
  isOpen: boolean;
  user: User;
  onClose: () => void;
  refreshUser: () => void;
};

export const checkNftBalance = async (address: string): Promise<number> => {
  const provider = new ethers.providers.AlchemyProvider(
    process.env.REACT_APP_CHAIN_NAME as string,
    process.env.REACT_APP_ALCHEMY as string
  );
  const nftContract = new ethers.Contract(
    process.env.REACT_APP_CONTRACT_ADDRESS as string,
    [
      {
        inputs: [
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
        ],
        name: "balanceOf",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
    ],
    provider
  );
  const balanceBn = await nftContract.balanceOf(address);
  const balance = balanceBn.toNumber();
  return balance;
};

export const getUserBalance = async (address: string): Promise<string> => {
  const provider = new ethers.providers.AlchemyProvider(
    process.env.REACT_APP_CHAIN_NAME as string,
    process.env.REACT_APP_ALCHEMY as string
  );
  const nftContract = new ethers.Contract(
    process.env.REACT_APP_MASTER_CONTRACT_ADDRESS as string,
    [
      {
        inputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        name: "userBalance",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
    ],
    provider
  );
  const balanceBn = await nftContract.userBalance(address);
  const balance = balanceBn.toString();
  return balance;
};

export const getOwnerOfNft = async (tokenId: string): Promise<string> => {
  const provider = new ethers.providers.AlchemyProvider(
    process.env.REACT_APP_CHAIN_NAME as string,
    process.env.REACT_APP_ALCHEMY as string
  );
  const nftContract = new ethers.Contract(
    process.env.REACT_APP_CONTRACT_ADDRESS as string,
    [
      {
        inputs: [
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
        ],
        name: "ownerOf",
        outputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
    ],
    provider
  );
  const ownerAddressBn = await nftContract.ownerOf(tokenId);
  const ownerAddress = ownerAddressBn.toString();
  return ownerAddress;
};

const ProfileDialog = (props: Props) => {
  const { isOpen, user, onClose, refreshUser } = props;
  const [currentStep, setCurrentStep] = useState(0);
  const [userCollection, setUserCollection] = useState(0);
  const [userBalance, setUserBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUserCollection = async () => {
    if (user.pubkey) {
      const noOfTokens = await checkNftBalance(user.pubkey);
      setUserCollection(noOfTokens);
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
      alert("Kindly login and try again.");
    }
    setIsLoading(true);
    try {
      const res = await axios.post("http://localhost:8080/wallet/create", {
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
                      below address
                    </Typography>
                  </Box>
                  <Typography sx={{ mt: 2 }} fontWeight="bold">
                    Custodial Address: {user.pubkey}
                  </Typography>
                  <Box display={"flex"} justifyContent="center" mt={2}>
                    <LoadingButton
                      variant="outlined"
                      color="info"
                      onClick={() => {}}
                      loading={isLoading}
                    >
                      Refresh
                    </LoadingButton>
                  </Box>
                </StepContent>
              </Step>
            </Stepper>
          )}
          {userCollection && (
            <Box my={2} display="flex">
              <Typography variant="h5" fontFamily={"monospace"}>
                Collections
              </Typography>
              <Chip sx={{ ml: 2 }} color="info" label={userCollection} />
            </Box>
          )}
          {userBalance > 0 && (
            <Box my={2} display="flex">
              <Typography variant="h5" fontFamily={"monospace"}>
                Balance
              </Typography>
              <Chip
                sx={{ ml: 2 }}
                color="success"
                label={`${userBalance} ETH`}
              ></Chip>
            </Box>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileDialog;
