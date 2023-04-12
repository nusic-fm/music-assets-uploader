import { CrossmintPayButton } from "@crossmint/client-sdk-react-ui";
import {
  Button,
  ButtonGroup,
  Chip,
  Grid,
  Link,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useWeb3React } from "@web3-react/core";
import { BigNumber, ethers } from "ethers";
import { LoadingButton } from "@mui/lab";
import { useEffect, useState } from "react";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { provider } from "./utils/provider";
import WalletConnectors from "./components/WalletConnector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";

const getEthValue = (price: number): BigNumber => {
  return ethers.utils.parseEther(price.toString());
};

const getEtherForQuantity = (price: number, quantity: number): string => {
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
  const days = Math.floor(timeleft / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((timeleft % (1000 * 60)) / 1000);
  return { days, hours, minutes, seconds, isRevealed: false };
};

const App = () => {
  const { account, library, activate } = useWeb3React();

  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // const [crossmint, setCrossmint] = useState(1);
  // const [crypto, setCrypto] = useState(1);
  const [tokenPrice, setTokenPrice] = useState(0.0008);
  const [currentEthPrice, setCurrentEthPrice] = useState(0);
  const [showWalletConnector, setShowWalletConnector] = useState(false);
  const [timerObj, setTimerObj] = useState(getTimerObj);

  const fetchEthPrice = async () => {
    const pricingContract = new ethers.Contract(
      // "0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419",
      "0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada",
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
      setSnackbarMessage("Please connect your wallet and continue");
      return;
    }
    try {
      setIsLoading(true);
      const nftContract = new ethers.Contract(
        "0x5b5d1F1479BcA067a253e1d6cBF655E0D377227F",
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
    await activate(connector, (e) => {
      //e.name UnsupportedChainIdError
      if (e.name === "UnsupportedChainIdError") {
        setSnackbarMessage("Only Mumbai Testnet is Supported");
      }
    });
  };
  console.log(account);
  return (
    <Box sx={{ bgcolor: "black", minHeight: "100vh" }} p={2}>
      <Box
        p={2}
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
          >
            Connect wallet
          </Button>
        )}
      </Box>

      <Box mt={5}>
        {/* <Box display={"flex"} justifyContent="center" mb={5}>
          <svg
            width="114"
            height="66"
            viewBox="0 0 114 66"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M109.302 28.6316H113.602V37.3684H109.302V28.6316ZM100.83 39.9265H105.13V26.0735H100.83V39.9265ZM92.5005 47.0919H96.7998V18.9081H92.5005V47.0919ZM84.5819 52.621H88.8812V13.6369H84.5819V52.6116V52.621ZM76.1045 43.1008H80.4038V22.8992H76.1045V43.1008ZM67.4927 58.3868H71.792V6.74869H67.4792V58.3868H67.4927ZM59.018 65.7906H63.3172V0.209381H59.018V65.7906ZM50.6882 55.666H54.9874V10.3338H50.6882V55.6662V55.666ZM42.071 42.7926H46.3702V23.6848H42.071V42.7926ZM33.7414 38.2375H38.0407V27.7456H33.7414V38.2548V38.2375ZM25.4117 43.8507H29.7109V22.1419H25.4117V43.8577V43.8507ZM17.2162 54.3594H21.5155V10.3983H17.2165V54.3671L17.2162 54.3594ZM8.8867 47.6434H13.186V17.9791H8.8867V47.6508V47.6434ZM0.398438 39.9265H4.6977V26.0735H0.398438V39.9265Z"
              fill="url(#paint0_linear_58_93)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_58_93"
                x1="57"
                y1="0.209381"
                x2="57"
                y2="65.7906"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#2C1E73" />
                <stop offset="1" stop-color="#0F0A26" />
              </linearGradient>
            </defs>
          </svg>
          <svg
            width="114"
            height="66"
            viewBox="0 0 114 66"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M109.302 28.6316H113.602V37.3684H109.302V28.6316ZM100.83 39.9265H105.13V26.0735H100.83V39.9265ZM92.5005 47.0919H96.7998V18.9081H92.5005V47.0919ZM84.5819 52.621H88.8812V13.6369H84.5819V52.6116V52.621ZM76.1045 43.1008H80.4038V22.8992H76.1045V43.1008ZM67.4927 58.3868H71.792V6.74869H67.4792V58.3868H67.4927ZM59.018 65.7906H63.3172V0.209381H59.018V65.7906ZM50.6882 55.666H54.9874V10.3338H50.6882V55.6662V55.666ZM42.071 42.7926H46.3702V23.6848H42.071V42.7926ZM33.7414 38.2375H38.0407V27.7456H33.7414V38.2548V38.2375ZM25.4117 43.8507H29.7109V22.1419H25.4117V43.8577V43.8507ZM17.2162 54.3594H21.5155V10.3983H17.2165V54.3671L17.2162 54.3594ZM8.8867 47.6434H13.186V17.9791H8.8867V47.6508V47.6434ZM0.398438 39.9265H4.6977V26.0735H0.398438V39.9265Z"
              fill="url(#paint0_linear_58_93)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_58_93"
                x1="57"
                y1="0.209381"
                x2="57"
                y2="65.7906"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#2C1E73" />
                <stop offset="1" stop-color="#0F0A26" />
              </linearGradient>
            </defs>
          </svg>
          <svg
            width="114"
            height="66"
            viewBox="0 0 114 66"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M109.302 28.6316H113.602V37.3684H109.302V28.6316ZM100.83 39.9265H105.13V26.0735H100.83V39.9265ZM92.5005 47.0919H96.7998V18.9081H92.5005V47.0919ZM84.5819 52.621H88.8812V13.6369H84.5819V52.6116V52.621ZM76.1045 43.1008H80.4038V22.8992H76.1045V43.1008ZM67.4927 58.3868H71.792V6.74869H67.4792V58.3868H67.4927ZM59.018 65.7906H63.3172V0.209381H59.018V65.7906ZM50.6882 55.666H54.9874V10.3338H50.6882V55.6662V55.666ZM42.071 42.7926H46.3702V23.6848H42.071V42.7926ZM33.7414 38.2375H38.0407V27.7456H33.7414V38.2548V38.2375ZM25.4117 43.8507H29.7109V22.1419H25.4117V43.8577V43.8507ZM17.2162 54.3594H21.5155V10.3983H17.2165V54.3671L17.2162 54.3594ZM8.8867 47.6434H13.186V17.9791H8.8867V47.6508V47.6434ZM0.398438 39.9265H4.6977V26.0735H0.398438V39.9265Z"
              fill="url(#paint0_linear_58_93)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_58_93"
                x1="57"
                y1="0.209381"
                x2="57"
                y2="65.7906"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#2C1E73" />
                <stop offset="1" stop-color="#0F0A26" />
              </linearGradient>
            </defs>
          </svg>
        </Box> */}
        <Box position={"relative"}>
          <Box display={"flex"} justifyContent="center">
            <img
              src="/vis.gif"
              alt=""
              width={280}
              height={280}
              style={{ borderRadius: "50%", objectFit: "cover" }}
            />
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
      <Box mt={"200px"} pb={6}>
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
              <img
                src="/card.png"
                alt=""
                style={{
                  borderRadius: "35px",
                  width: 280,
                  objectFit: "contain",
                }}
              />
            </Box>
            <Box
              py={15}
              px={{ xs: 2, md: "20%" }}
              sx={{
                background:
                  "linear-gradient(0deg, rgba(6,0,14,1) 0%, rgba(37,11,89,1) 100%)",
              }}
            >
              <Box mb={2}>
                <Typography align="center" color={"gray"} fontStyle="italic">
                  Price per card: {tokenPrice} ETH
                </Typography>
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
                      if (quantity === 30) return;
                      setQuantity(quantity + 1);
                    }}
                  >
                    <AddIcon />
                  </Button>
                </ButtonGroup>
              </Box>
              <Stack alignItems={"end"}>
                <Typography>{quantity * tokenPrice} ETH</Typography>
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
                <Button
                  component="label"
                  variant="outlined"
                  sx={{ width: { xs: "100%", md: "50%", color: "white" } }}
                >
                  <CrossmintPayButton
                    style={{ display: "none" }}
                    clientId="bee2289c-b606-4abd-9140-6e55806646b7"
                    mintConfig={{
                      type: "erc-721",
                      totalPrice: (tokenPrice * quantity).toFixed(4),
                      tokenQuantity: quantity,
                    }}
                    environment="staging"
                    // mintTo="<YOUR_USER_WALLET_ADDRESS>"
                  />
                  Mint with CARD
                </Button>
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
          Alive Collective - nGenesis Edition
        </Typography>
        <Typography variant="body1" align="center" color={"gray"}>
          Join the Movement that is powerin the Evolution of Music
        </Typography>
        <Button size="small" sx={{ mt: 1 }}>
          Learn More
        </Button>
      </Stack>
      <Stack mt={10} gap={1} alignItems="center">
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
          width={{ md: "20%" }}
          sx={{
            background:
              "radial-gradient(circle, rgba(0,149,130,1) 0%, rgba(154,69,179,1) 48%, rgba(94,16,117,1) 100%)",
            backgroundAttachment: "fixed",
          }}
          p={4}
          borderRadius="6px"
          gap={2}
        >
          <Typography variant="h4">Scale Your Music NFTs</Typography>
          <Typography>Move beyond cryptographic references to files</Typography>
        </Stack>
        <Stack
          width={{ md: "20%" }}
          sx={{
            background:
              "radial-gradient(71.89% 71.89% at 68.2% 28.11%, #3D8494 0%, #66198A 55.04%, #4E4192 100%)",
            backgroundAttachment: "fixed",
          }}
          p={4}
          borderRadius="6px"
          gap={2}
        >
          <Typography variant="h4">Decentralized Streaming</Typography>
          <Typography>
            A decentralized content delivery network dedicated to music
          </Typography>
        </Stack>
        <Stack
          width={{ md: "20%" }}
          sx={{
            background:
              "radial-gradient(circle, rgba(58,180,164,1) 0%, rgba(70,40,144,1) 48%, rgba(154,69,179,1) 100%)",
            backgroundAttachment: "fixed",
          }}
          p={4}
          borderRadius="6px"
          gap={2}
        >
          <Typography variant="h4">
            Earn $NUSIC <br />
            <br />
          </Typography>
          <Typography>Move beyond cryptographic references to files</Typography>
        </Stack>
      </Stack>
      <Stack mt={10} px={{ md: "20%" }} gap={2}>
        <Typography align="center" variant="h4" fontWeight={700}>
          Customize Your Membership NFT
        </Typography>
        <Box p={2} mt={5} border="1px solid gray" borderRadius={"6px"}>
          <Typography variant="h5" align="center">
            Inject your PFP into the NUSIC alive pass
          </Typography>
          <Typography align="center" color={"gray"}>
            Connect your favorite NFT directly to your NUSIC Alive Pass
          </Typography>
        </Box>
        <Box p={2} border="1px solid gray" borderRadius={"6px"}>
          <Typography variant="h5" align="center">
            Powering the Evolution of Music
          </Typography>
          <Typography align="center" color={"gray"}>
            A decentralized content delivery network dedicated to music
          </Typography>
        </Box>
        <Box mt={4}>
          <img src="/pfp_pass.png" alt="" width={"100%"} />
        </Box>
      </Stack>
      <Box mt={10}>
        <Typography variant="h4" align="center" fontWeight={700}>
          Early Access For 3 Years
        </Typography>
        <Box mt={4}>
          <Typography align="center">Early Access Countdown</Typography>
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
              <Typography variant="body2" align="center" fontFamily="BenchNine">
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
              <Typography variant="body2" align="center" fontFamily="BenchNine">
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
              <Typography variant="body2" align="center" fontFamily="BenchNine">
                min
              </Typography>
            </Box>
            {/* <Box
              mt={2}
              p={2}
              sx={{ border: "2px solid white", borderRadius: "6px" }}
              // width="35px"
            >
              <Typography fontWeight="bold" variant="h4" align="center">
                {timerObj.seconds}
              </Typography>
              <Typography variant="body2" align="center" fontFamily="BenchNine">
                sec
              </Typography>
            </Box> */}
          </Box>
        </Box>
      </Box>

      <Box mt={20} pb={8}>
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
        >
          <Button href="//nusic.fm" target="_blank">
            <img src="/nusic-white.png" alt="nusic" width="120px"></img>
          </Button>
          <Box mr={{ md: 10 }}>
            <Typography
              variant="h5"
              fontWeight={700}
              fontFamily="Space Grotesk"
            >
              Join Us
            </Typography>
            <Stack gap={3} mt={3}>
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
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          {/* <Typography variant="h5" fontFamily="monospace" align="center">
            The Decentralized Financial Rails for Music
          </Typography>
          <Box maxWidth={{ md: "33%" }} mt={2} px={2}>
            <Typography align="center" fontFamily="BenchNine" variant="h5">
              NUSIC empowers you to release music into Web 3 on your own terms,
              under your own brand, for your own community. Our solutions have
              won multiple awards from top Web 3 infrastructure providers & our
              distributed team is ready to plug your music into the
              decentralized financial rails that power music on the next
              generation of the internet.
            </Typography>
          </Box> */}
          <Box my={2}>
            {/* <TextField
              placeholder="Spotify Artist ID"
              onChange={(e) => setSpotifyArtistId(e.target.value)}
            /> */}
          </Box>
          {/* <Button
            variant="contained"
            onClick={onSpotifyId}
            // size="small"
            sx={{
              fontFamily: "BenchNine",
              borderRadius: "18px",
              // textTransform: "unset",
              // fontWeight: "900",
            }}
          >
            Plug in your music now
          </Button> */}
        </Box>
      </Box>
      <WalletConnectors
        open={!account && showWalletConnector}
        onSignInUsingWallet={onSignInUsingWallet}
      />
      <Snackbar
        open={!!snackbarMessage}
        autoHideDuration={4000}
        message={snackbarMessage}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        onClose={() => setSnackbarMessage("")}
      />
    </Box>
  );
};

export default App;
