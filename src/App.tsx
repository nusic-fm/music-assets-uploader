import { CrossmintPayButton } from "@crossmint/client-sdk-react-ui";
import {
  Button,
  ButtonGroup,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Link,
  // Popover,
  Snackbar,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useWeb3React } from "@web3-react/core";
import { BigNumber, ethers } from "ethers";
import { LoadingButton } from "@mui/lab";
import { useEffect, useRef, useState } from "react";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { provider } from "./utils/provider";
import WalletConnectors from "./components/WalletConnector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import CardWithAnimation from "./components/CardWithAnimation";
import CloseIcon from "@mui/icons-material/Close";
// import { Injected } from "./hooks/useWalletConnectors";
// import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const getEthValue = (price: number): BigNumber => {
  // 0000000000000000000000
  return ethers.utils.parseEther(price.toString());
};

const getEtherForQuantity = (price: number, quantity: number): string => {
  // 0.0 ETH
  return ethers.utils.formatEther(
    getEthValue(price).mul(BigNumber.from(quantity))
  );
};

const getTimerObj = () => {
  const revealDate = "Wed, 21 Jun 2023 00:00:00 GMT";
  const countDownDate = new Date(revealDate).getTime();
  const timeleft = countDownDate - Date.now();
  if (timeleft <= 0) {
    return { isRevealed: true };
  }
  const days = Math.floor(timeleft / (1000 * 60 * 60 * 24))
    .toString()
    .padStart(2, "0");
  const hours = Math.floor(
    (timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  )
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60))
    .toString()
    .padStart(2, "0");
  var seconds = Math.floor((timeleft % (1000 * 60)) / 1000)
    .toString()
    .padStart(2, "0");
  return { days, hours, minutes, seconds, isRevealed: false };
};

const App = () => {
  const { account, library, activate } = useWeb3React();

  const stackRef = useRef(null);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // const [crossmint, setCrossmint] = useState(1);
  // const [crypto, setCrypto] = useState(1);
  const [tokenPrice] = useState(Number(process.env.REACT_APP_TOKEN_PRICE));
  const [currentEthPrice, setCurrentEthPrice] = useState(0);
  const [showWalletConnector, setShowWalletConnector] = useState(false);
  const [timerObj, setTimerObj] = useState(getTimerObj);
  const [txInfo, setTxInfo] = useState<{ hash: string }>();
  // const cardRef = useRef(null);

  const fetchEthPrice = async () => {
    const pricingContract = new ethers.Contract(
      process.env.REACT_APP_Price_Feed as string,
      [
        {
          inputs: [],
          name: "latestAnswer",
          outputs: [{ internalType: "int256", name: "", type: "int256" }],
          stateMutability: "view",
          type: "function",
        },
      ],
      provider
    );
    const bn = await pricingContract.latestAnswer();
    setCurrentEthPrice(Number(bn.toString()) / 100000000);
  };

  useEffect(() => {
    fetchEthPrice();
  }, []);

  useEffect(() => {
    const myInterval = setInterval(() => {
      const _newTimerObj = getTimerObj();
      setTimerObj(_newTimerObj);
    }, 1000);
    return () => {
      clearInterval(myInterval);
    };
  }, [timerObj]);

  const onMint = async () => {
    if (!account) {
      setSnackbarMessage("Please connect your wallet and try again");
      setShowWalletConnector(true);
      return;
    }
    try {
      setIsLoading(true);
      const nftContract = new ethers.Contract(
        process.env.REACT_APP_ETH_CONTRACT_ADDRESS as string,
        [
          {
            inputs: [
              {
                internalType: "uint256",
                name: "tokenQuantity",
                type: "uint256",
              },
            ],
            name: "mint",
            outputs: [],
            stateMutability: "payable",
            type: "function",
          },
        ],
        library.getSigner()
      );
      const options = {
        value: getEthValue(tokenPrice).mul(BigNumber.from(quantity)),
      };
      console.log(ethers.utils.formatEther(options.value.toString()));
      const tx = await nftContract.mint(quantity, options);
      await tx.wait();
      setTxInfo({ hash: tx.hash });
      setSnackbarMessage("Successfully Minted");
    } catch (e: any) {
      console.log(e.message);
      setSnackbarMessage(e.data?.message || e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const onSignInUsingWallet = async (
    connector: WalletConnectConnector | WalletLinkConnector | InjectedConnector
  ) => {
    await checkConnection();
    activate(connector, async (e) => {
      if (e.name === "t" || e.name === "UnsupportedChainIdError") {
        setSnackbarMessage("Please switch to Ethereum Mainnet");
      } else {
        setSnackbarMessage(e.message);
      }

      console.log(e.name, e.message);
    });
  };

  const checkConnection = async () => {
    const provider = new ethers.providers.Web3Provider(
      (window as any).ethereum
    );
    const accounts = await provider.listAccounts();
    if (accounts.length) {
      if (
        (window as any).ethereum?.networkVersion !==
        process.env.REACT_APP_CHAIN_ID
      ) {
        try {
          await (window as any).ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [
              {
                chainId: ethers.utils.hexValue(
                  Number(process.env.REACT_APP_CHAIN_ID)
                ),
              },
            ],
          });
        } catch (err) {}
      }
    }
  };

  // useEffect(() => {
  //   checkConnection();
  // }, []);

  useEffect(() => {
    if ((window as any)?.twttr?.widgets) (window as any).twttr.widgets.load();
  }, [txInfo]);

  return (
    <Box
      sx={{
        background:
          "linear-gradient(0deg, rgb(0,0,0) 0%, rgba(27,19,51,1) 70%)",
        minHeight: "100vh",
      }}
    >
      <Box
        px={4}
        py={4}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexWrap={"wrap"}
        gap={4}
      >
        <Box
          ml={4}
          sx={{
            background: `url(/nusic-white.png)`,
            width: "80px",
            height: "20px",
            backgroundSize: "contain",
            backgroundPosition: "center",
            transform: "scale(2)",
            backgroundRepeat: "no-repeat",
          }}
        ></Box>
        {account ? (
          <Chip
            // clickable
            // onClick={() => {
            //   deactivate();
            // }}
            label={`${account.slice(0, 6)}...${account.slice(
              account.length - 4
            )}`}
          />
        ) : (
          <Button
            variant="contained"
            onClick={() => {
              setShowWalletConnector(true);
              // login();
            }}
            sx={{ zIndex: 99 }}
          >
            Connect wallet
          </Button>
        )}
      </Box>
      <Box p={2}>
        <Box>
          <Box position={"relative"} mt={-5}>
            <Box display={"flex"} justifyContent="center">
              <Box
                width={280}
                height={280}
                sx={{
                  background: "url(/vis.gif)",
                  borderRadius: "50%",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  boxShadow: "0 0 30px 30px #1b1333 inset",
                }}
              ></Box>
            </Box>
            <Stack
              position="absolute"
              width="100%"
              height={"100%"}
              justifyContent="center"
              top={0}
            >
              <Typography variant="h4" align="center" fontWeight={900}>
                It's Alive !!!
              </Typography>
            </Stack>
          </Box>
        </Box>
        <Box mt={"180px"} pb={6}>
          <Grid container>
            <Grid item md={3}></Grid>
            <Grid item xs={12} md={6} position="relative">
              <Box
                position={"absolute"}
                width="100%"
                display="flex"
                justifyContent={"center"}
                top={-100}
                height="200px"
              >
                <CardWithAnimation />
              </Box>
              <Box
                pb={6}
                pt={15}
                px={{ xs: 2, md: "20%" }}
                sx={{
                  background:
                    "linear-gradient(0deg, rgba(32,9,77,1) 0%, rgba(27,19,51,1) 100%)",
                  // "linear-gradient(0deg, rgba(34,10,82,1) 0%, rgba(27,19,51,1) 100%)",
                }}
                borderRadius="6px"
              >
                <Box mb={3}>
                  {/* <Typography align="center" color={"gray"} fontStyle="italic">
                    Price per card: {tokenPrice} ETH
                  </Typography> */}
                </Box>
                <Box
                  display={"flex"}
                  justifyContent="space-between"
                  alignItems={"center"}
                  mb={2}
                >
                  <Typography>Number of Cards</Typography>
                  <ButtonGroup sx={{ width: "130px" }} size="small">
                    <Button
                      onClick={() => {
                        if (quantity === 1) return;
                        setQuantity(quantity - 1);
                      }}
                    >
                      <RemoveIcon />
                    </Button>
                    <TextField value={quantity}></TextField>
                    <Button
                      onClick={() => {
                        if (quantity === 99) return;
                        setQuantity(quantity + 1);
                      }}
                    >
                      <AddIcon />
                    </Button>
                  </ButtonGroup>
                </Box>
                <Stack alignItems={"end"}>
                  <Typography>
                    {getEtherForQuantity(tokenPrice, quantity)} ETH
                  </Typography>
                  <Typography color={"gray"}>
                    ${(currentEthPrice * tokenPrice * quantity).toFixed(2)}
                  </Typography>
                </Stack>
                <Stack alignItems={"center"} gap={2} mt={2}>
                  <LoadingButton
                    loading={isLoading}
                    variant="contained"
                    sx={{ width: { xs: "100%", md: "50%" } }}
                    onClick={onMint}
                  >
                    Mint with ETH
                  </LoadingButton>
                  <Tooltip title="Connect your Wallet to receive the NFT directly into your address">
                    <Button
                      component="label"
                      variant="outlined"
                      sx={{ width: { xs: "100%", md: "50%", color: "white" } }}
                      // endIcon={<InfoOutlinedIcon />}
                      // ref={cardRef}
                    >
                      <CrossmintPayButton
                        style={{ display: "none" }}
                        clientId="0c4a330a-7286-4e0d-9d79-43ab7a03db65"
                        mintConfig={{
                          type: "erc-721",
                          totalPrice: (tokenPrice * quantity).toFixed(2),
                          tokenQuantity: quantity,
                        }}
                        // environment="staging"
                        mintTo={account ?? undefined}
                      />
                      Mint with CARD
                    </Button>
                  </Tooltip>
                  <Box mt={4}>
                    <a
                      className="twitter-share-button"
                      // href="https://twitter.com/intent/tweet?text=NUSIC%20Alive%20Collective%20passes%20are%20now%20available%20at%20alive.nusic.fm%20via%20%40nusicOfficial%20%0A%0AJoin%20the%20Movement%20Powering%20the%20Evolution%20of%20Music%0A%0A%23NUSIC"
                      href="https://twitter.com/intent/tweet?text=NUSIC%20Alive%20Collective%20passes%20are%20now%20available%20via%20%40nusicOfficial"
                      // href="https://twitter.com/share"
                      // data-text={`NUSIC Alive Collective passes are now available\n\nJoin the Movement Powering the Evolution of Music\n`}
                      // data-url="alive.nusic.fm"
                      // data-via="nusicOfficial"
                      // data-hashtags="NUSIC"
                    >
                      Tweet
                    </a>
                  </Box>
                </Stack>
              </Box>
            </Grid>
            <Grid item md={3}></Grid>
          </Grid>
        </Box>
        <Stack mt={5} gap={1} alignItems="center">
          <Typography variant="h4" align="center" fontWeight={700}>
            <img
              src="/nusic-white.png"
              alt=""
              width={100}
              style={{ marginRight: "20px" }}
            />
            Alive Collective
          </Typography>
          <Typography variant="body1" align="center" color={"gray"}>
            nGenesis Edition
          </Typography>
          <Button
            size="small"
            sx={{ mt: 1 }}
            onClick={() => {
              (stackRef.current as any).scrollIntoView({
                behavior: "smooth",
                block: "start",
                inline: "nearest",
              });
            }}
          >
            Learn More
          </Button>
        </Stack>
        <Stack mt={5} pt={4} gap={1} alignItems="center" ref={stackRef}>
          <Typography variant="h4" align="center" fontWeight={700}>
            First Access to
            <img
              src="/nusic-white.png"
              alt=""
              width={100}
              style={{ marginLeft: "20px", marginRight: "20px" }}
            />
            Protocol
          </Typography>
        </Stack>
        <Stack
          mt={10}
          direction="row"
          // alignItems="center"
          justifyContent={"center"}
          gap={2}
          flexWrap="wrap"
        >
          <Stack
            width={{ xs: "100%", md: "30%", lg: "25%", xl: "20%" }}
            sx={{
              background:
                "radial-gradient(circle, rgba(0,149,130,1) 0%, rgba(154,69,179,1) 48%, rgba(94,16,117,1) 100%)",
              backgroundAttachment: "fixed",
            }}
            p={4}
            borderRadius="6px"
            gap={2}
          >
            <img src="/1.png" alt="" width={50} />
            <Typography variant="h4">Scale Your Music NFTs</Typography>
            <Typography>
              Move beyond cryptographic references to files to true immutable
              ownership
            </Typography>
          </Stack>
          <Stack
            width={{ xs: "100%", md: "34%", lg: "25%", xl: "20%" }}
            sx={{
              background:
                "radial-gradient(71.89% 71.89% at 68.2% 28.11%, #3D8494 0%, #66198A 55.04%, #4E4192 100%)",
              backgroundAttachment: "fixed",
            }}
            p={4}
            borderRadius="6px"
            gap={2}
          >
            <img src="/2.png" alt="" width={50} />
            <Typography variant="h4">Decentralized Streaming</Typography>
            <Typography>
              A decentralized content delivery network dedicated to music
              streaming & IP protection
            </Typography>
          </Stack>
          <Stack
            width={{ xs: "100%", md: "30%", lg: "25%", xl: "20%" }}
            sx={{
              background:
                "radial-gradient(circle, rgba(58,180,164,1) 0%, rgba(70,40,144,1) 48%, rgba(154,69,179,1) 100%)",
              backgroundAttachment: "fixed",
            }}
            p={4}
            borderRadius="6px"
            gap={2}
          >
            <img src="/3.png" alt="" width={50} />
            <Typography variant="h4">Earn $NUSIC Incentives</Typography>
            <Typography>
              Music NFT creators & holders, listeners & node operators all
              receive $NUSIC tokens
            </Typography>
          </Stack>
        </Stack>
        <Box display={"flex"} justifyContent="center">
          <Stack
            mt={5}
            width={{
              xs: "100%",
              md: "calc(94% + 32px)",
              lg: "calc(75% + 32px)",
              xl: "calc(60% + 32px)",
            }}
          >
            <Box p={2} border="1px solid gray" borderRadius={"6px"}>
              <Typography variant="h5" align="center">
                Powering the Evolution of Music
              </Typography>
              <Typography align="center" color={"gray"}>
                Web3 metadata infrastructure for music rights holders
              </Typography>
            </Box>
          </Stack>
        </Box>
        <Stack
          mt={10}
          mx={{ md: "20%" }}
          p={2}
          gap={2}
          // sx={{
          //   boxShadow:
          //     "rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset",
          // }}
        >
          <Typography align="center" variant="h4" fontWeight={700}>
            Customize Your Membership NFT
          </Typography>
          <Box mt={1} borderRadius={"6px"}>
            {/* <Typography variant="h5" align="center">
              Inject your PFP into the NUSIC alive pass
            </Typography>
            <Typography align="center" color={"gray"}>
              Connect your favorite NFT directly to your NUSIC Alive Pass
            </Typography> */}
            <Typography variant="h3">How?</Typography>
            <Box mt={2}>
              <Typography variant="h6" fontWeight={700}>
                Inject your PFP into the NUSIC alive pass
              </Typography>
              <Typography variant="body1" color={"gray"}>
                Connect your favorite NFT directly to your NUSIC Alive Pass
              </Typography>
              <Typography variant="body1" color={"gray"}>
                Show the world what community you are part of
              </Typography>
            </Box>
          </Box>
          <Box mt={4}>
            <img src="/pfp.gif" alt="" width={"100%"} />
          </Box>
        </Stack>
        <Box mt={10}>
          <Typography variant="h4" align="center" fontWeight={700}>
            Priority Access For 3 Years
          </Typography>
          <Box mt={4}>
            <Typography align="center">Countdown</Typography>
            <Box display="flex" flexWrap="wrap" justifyContent="center" gap={4}>
              <Box
                // mr={2}
                mt={2}
                p={2}
                sx={{ border: "2px solid gray", borderRadius: "6px" }}
                // width="35px"
              >
                <Typography variant="h4" align="center">
                  {timerObj.days}
                </Typography>
                <Typography
                  variant="body2"
                  align="center"
                  fontFamily="BenchNine"
                >
                  days
                </Typography>
              </Box>
              <Box
                // mr={2}
                mt={2}
                p={2}
                sx={{ border: "2px solid gray", borderRadius: "6px" }}
                // width="35px"
              >
                <Typography variant="h4" align="center">
                  {timerObj.hours}
                </Typography>
                <Typography
                  variant="body2"
                  align="center"
                  fontFamily="BenchNine"
                >
                  hrs
                </Typography>
              </Box>
              <Box
                // mr={2}
                mt={2}
                p={2}
                sx={{ border: "2px solid gray", borderRadius: "6px" }}
                // width="35px"
              >
                <Typography variant="h4" align="center">
                  {timerObj.minutes}
                </Typography>
                <Typography
                  variant="body2"
                  align="center"
                  fontFamily="BenchNine"
                >
                  min
                </Typography>
              </Box>
              <Box
                mt={2}
                p={2}
                sx={{ border: "2px solid gray", borderRadius: "6px" }}
                // width="35px"
              >
                <Typography variant="h4" align="center">
                  {timerObj.seconds}
                </Typography>
                <Typography
                  variant="body2"
                  align="center"
                  fontFamily="BenchNine"
                >
                  sec
                </Typography>
              </Box>
            </Box>
            <Typography align="center" sx={{ mt: 2 }}>
              Wednesday, June 21st 2023 - Friday, June 20th 2026
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box mt={20}>
        {/* <Typography variant="h5" align="center" fontFamily="monospace">
          Powered By
        </Typography> */}
        {/* <Typography variant="h3" align="center">
          NUSIC
        </Typography> */}
        <Box
          display="flex"
          justifyContent={"space-between"}
          alignItems="start"
          py={2}
          sx={{
            background:
              "radial-gradient(245.9% 245.82% at 50% -184.76%, #563FC8 0%, rgba(86, 63, 200, 0) 100%)",
          }}
          flexWrap="wrap"
          p={2}
        >
          <Button href="//nusic.fm" target="_blank">
            <img src="/nusic-white.png" alt="nusic" width="120px"></img>
          </Button>
          <Box mr={{ md: 10 }}>
            <Stack gap={3} mt={3} direction="row">
              <Link
                href="https://twitter.com/nusicOfficial"
                target={"_blank"}
                fontFamily="Space Grotesk"
                sx={{ color: "white", textDecoration: "none" }}
              >
                Twitter
              </Link>
              <Link
                href="https://discord.gg/eHyRQADgQ4"
                target={"_blank"}
                fontFamily="Space Grotesk"
                sx={{ color: "white", textDecoration: "none" }}
              >
                Discord
              </Link>
              <Link
                href="https://github.com/nusic-fm"
                target={"_blank"}
                fontFamily="Space Grotesk"
                sx={{ color: "white", textDecoration: "none" }}
              >
                Github
              </Link>
            </Stack>
          </Box>
        </Box>
      </Box>
      <WalletConnectors
        open={!account && showWalletConnector}
        onSignInUsingWallet={onSignInUsingWallet}
        onClose={() => setShowWalletConnector(false)}
      />
      <Snackbar
        open={!!snackbarMessage}
        autoHideDuration={4000}
        message={snackbarMessage}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        onClose={() => setSnackbarMessage("")}
      />
      <Dialog open={!!txInfo} fullWidth>
        <DialogTitle color={"success"}>
          Successfully Minted !!!
          <IconButton
            aria-label="close"
            onClick={() => setTxInfo(undefined)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {/* <Typography>Token: #4</Typography> */}

          <Link
            href={`https://mumbai.polygonscan.com/tx/${txInfo?.hash}`}
            color="secondary"
            target={"_blank"}
          >
            Explore on Etherscan
          </Link>
        </DialogContent>
        <DialogActions>
          <a
            className="twitter-share-button"
            href="https://twitter.com/intent/tweet?text=I%20just%20minted%20a%20NUSIC%20Alive%20Collective%20pass%20at%20alive.nusic.fm%20via%20%40nusicOfficial%20%0A%0AJoin%20the%20Movement%20Powering%20the%20Evolution%20of%20Music%0A%0A%23NUSIC"
          >
            Tweet
          </a>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default App;
