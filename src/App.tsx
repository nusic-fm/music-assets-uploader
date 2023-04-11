import { CrossmintPayButton } from "@crossmint/client-sdk-react-ui";
import {
  Badge,
  Button,
  ButtonGroup,
  Chip,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import useAuth from "./hooks/useAuth";
import { useWeb3React } from "@web3-react/core";
import { BigNumber, ethers } from "ethers";
import { LoadingButton } from "@mui/lab";
import { useState } from "react";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

const getEthValue = (price: number): BigNumber => {
  return ethers.utils.parseEther(price.toString());
};

const getEtherForQuantity = (price: number, quantity: number): string => {
  return ethers.utils.formatEther(
    getEthValue(price).mul(BigNumber.from(quantity))
  );
};

const App = () => {
  const { login } = useAuth();
  const { account } = useWeb3React();

  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // const [crossmint, setCrossmint] = useState(1);
  // const [crypto, setCrypto] = useState(1);
  const [price] = useState(0.25);

  const onMint = async () => {
    if (!account) {
      alert("Please connect your wallet and continue.");
      return;
    }
    try {
      setIsLoading(true);
      // const nftContract = new ethers.Contract(
      //   price === 18.04
      //     ? "0x91cb12fb7a1678B6CDC1B18Ef8D5eC0d7697c4A0"
      //     : "0xa81B81384fD201ABD482662312207fB1cADe7F1d",
      //   [
      //     {
      //       inputs: [
      //         {
      //           internalType: "uint256",
      //           name: "tokenQuantity",
      //           type: "uint256",
      //         },
      //       ],
      //       name: "mint",
      //       outputs: [],
      //       stateMutability: "payable",
      //       type: "function",
      //     },
      //   ],
      //   library.getSigner()
      // );
      // const options = {
      //   value: getEthValue(price).mul(BigNumber.from(quantity)),
      // };
      // console.log(ethers.utils.formatEther(options.value.toString()));
      // const tx = await nftContract.mint(quantity, options);
      // await tx.wait();
      // alert("You have successfully minted the NFT(s), thanks.");
    } catch (e: any) {
      console.log(e.message);
      alert(e.data?.message || e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ bgcolor: "background.paper", minHeight: "100vh" }} p={2}>
      <Box
        p={2}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
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
              login();
            }}
          >
            Connect wallet
          </Button>
        )}
      </Box>

      <Box mt={{ xs: "40%", md: "10%" }} pb={6}>
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
              <Box
                sx={{ bgcolor: "#5525b4" }}
                borderRadius="6px"
                p={2}
                minWidth={{ xs: "95%", md: "50%" }}
              >
                <Box
                  display={"flex"}
                  justifyContent="space-between"
                  alignItems={"center"}
                >
                  <Box display={"flex"} gap={1} alignItems="baseline">
                    <img src="/nusic-white.png" alt="" width={60} />
                    <Typography>alive</Typography>
                  </Box>
                  <Typography variant="h5">nGenesis Edition</Typography>
                </Box>
                <Box mt={15} display="flex" justifyContent={"center"}>
                  <Typography variant="caption">
                    Every Time a Song is Created a Soul is Born
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box
              py={20}
              px={{ xs: 2, md: "20%" }}
              sx={{
                background:
                  "linear-gradient(0deg, rgba(6,0,14,1) 0%, rgba(37,11,89,1) 100%)",
              }}
            >
              <Box mb={2}>
                <Typography align="center" color={"gray"} fontStyle="italic">
                  Price per card: 0.25 ETH
                </Typography>
              </Box>
              <Box
                display={"flex"}
                justifyContent="space-between"
                alignItems={"center"}
                mb={2}
              >
                <Typography>Number of Cards</Typography>
                <ButtonGroup sx={{ width: "150px" }}>
                  <Button>
                    <RemoveIcon />
                  </Button>
                  <TextField></TextField>
                  <Button>
                    <AddIcon />
                  </Button>
                </ButtonGroup>
              </Box>
              <Stack alignItems={"end"}>
                <Typography>0.25 ETH</Typography>
                <Typography color={"gray"}>$500</Typography>
              </Stack>
              <Stack alignItems={"center"} gap={2} mt={2}>
                <Button variant="contained" style={{ width: "50%" }}>
                  Mint with ETH
                </Button>
                <Button
                  variant="outlined"
                  style={{ width: "50%", color: "white" }}
                >
                  Mint with CARD
                </Button>
              </Stack>
            </Box>
          </Grid>
          <Grid item md={3}></Grid>
        </Grid>
      </Box>
      <Stack mt={5} gap={1} alignItems="center">
        <Typography variant="h4" align="center">
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
        <Typography variant="h4" align="center">
          First Access to the Protocol
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
              "radial-gradient(circle, rgba(58,180,164,1) 0%, rgba(154,69,179,1) 48%, rgba(94,16,117,1) 100%)",
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
        <Box p={2} border="1px solid gray" borderRadius={"6px"}>
          <Typography variant="h4" align="center">
            Inject your PFP into the NUSIC alive pass
          </Typography>
          <Typography align="center" color={"gray"}>
            Connect your favorite NFT directly to your NUSIC Alive Pass
          </Typography>
        </Box>
        <Box p={2} border="1px solid gray" borderRadius={"6px"}>
          <Typography variant="h4" align="center">
            Powering the Evolution of Music
          </Typography>
          <Typography align="center" color={"gray"}>
            A decentralized content delivery network dedicated to music
          </Typography>
        </Box>
      </Stack>

      <Box mt={20} pb={8}>
        {/* <Typography variant="h5" align="center" fontFamily="monospace">
          Powered By
        </Typography> */}
        {/* <Typography variant="h3" align="center">
          NUSIC
        </Typography> */}
        <Box display="flex" justifyContent="center" p={2}>
          <Button href="//nusic.fm" target="_blank">
            <img src="/nusic-white.png" alt="nusic" width="250px"></img>
          </Button>
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="h5" fontFamily="monospace" align="center">
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
          </Box>
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
    </Box>
  );
};

export default App;
