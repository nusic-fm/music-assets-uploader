import { CrossmintPayButton } from "@crossmint/client-sdk-react-ui";
import {
  Badge,
  Button,
  Chip,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
// import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { logFirebaseEvent } from "./services/firebase.service";
import useAuth from "./hooks/useAuth";
import { useWeb3React } from "@web3-react/core";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { BigNumber, ethers } from "ethers";
import { LoadingButton } from "@mui/lab";
import { getMints } from "./services/graphql";
import { motion } from "framer-motion";

ChartJS.register(ArcElement, Tooltip, Legend);
// export const data = {
//   labels: ["Your Contribution", "Total Raised"],
//   datasets: [
//     {
//       // label: "# of Votes",
//       data: [0, 1],
//       backgroundColor: ["rgba(153, 102, 255, 0.2)", "rgba(54, 162, 235, 0.2)"],
//       borderColor: ["rgba(153, 102, 255, 0.2)", "rgba(54, 162, 235, 0.2)"],
//       borderWidth: 2,
//     },
//   ],
// };

const trackDetails = {
  artist: "Captain Haiti",
  title: "Bare Yo!",
  coverUrl: "/cover.jpeg",
  profileUrl: "/captainhaiti.webp",
  socials: {
    tiktok: "tiktok.com/@captainhaiti",
    twitter: "twitter.com/haiticaptain",
    instagram: "instagram.com/captainhaiti",
    youtube: "youtube.com/channel/UCFn86vJtQff1Lk8co5obm1g",
    facebook: "facebook.com/gaming/RealCaptainHaiti",
    linkedin: "linkedin.com/in/captain-haiti-816b59208",
    soundcloud: "soundcloud.com/nandev-parolier",
  },
};
const getTimerObj = () => {
  const revealDate = "Fri, 9 Dec 2022 06:00:00 GMT";
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

const getEthValue = (price: number): BigNumber => {
  return ethers.utils.parseEther(price.toString());
};

const getEtherForQuantity = (price: number, quantity: number): string => {
  return ethers.utils.formatEther(
    getEthValue(price).mul(BigNumber.from(quantity))
  );
};

const spring = {
  type: "spring",
  stiffness: 700,
  damping: 30,
};

const App = () => {
  const [spotifyArtistId, setSpotifyArtistId] = useState<string>();
  const { login } = useAuth();
  const { account, library } = useWeb3React();

  const [timerObj] = useState(getTimerObj);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [totalRaised, setTotalRaised] = useState(1);
  const [contributions, setContributions] = useState(0);
  const [price, setPrice] = useState(199);

  // useEffect(() => {
  //   const myInterval = setInterval(() => {
  //     const _newTimerObj = getTimerObj();
  //     setTimerObj(_newTimerObj);
  //   }, 1000);
  //   return () => {
  //     clearInterval(myInterval);
  //   };
  // }, [timerObj]);
  const onSpotifyId = (e: any) => {
    if (!spotifyArtistId?.length) {
      alert("Please enter valid Spotify Artist ID");
      return;
    }
    logFirebaseEvent("select_content", {
      content_type: "spotifyArtistId",
      content_id: spotifyArtistId,
    });
    alert("successfully submitted");
  };
  const fetchMintsAnalytics = async () => {
    const mints = await getMints();
    // const mints = [
    //   { amountTransfered: "10000000000000000000", to: "me" },
    //   { amountTransfered: "20000000000000000000", to: "a" },
    //   { amountTransfered: "30000000000000000000", to: "asdf" },
    // ];
    if (mints?.length) {
      const total = mints
        .map((mint) => BigNumber.from(mint.amountTransfered))
        .reduce((x, y) => BigNumber.from(x).add(BigNumber.from(y)));
      setTotalRaised(Number(ethers.utils.formatEther(total)));
      const totalContributions = mints
        .filter((mint) => mint.to === "me")
        .map((mint) => BigNumber.from(mint.amountTransfered))
        .reduce((x, y) => BigNumber.from(x).add(BigNumber.from(y)));
      setContributions(Number(ethers.utils.formatEther(totalContributions)));
    }
  };
  useEffect(() => {
    if (account) {
      fetchMintsAnalytics();
    }
  }, [account]);

  const onMint = async () => {
    if (!account) {
      alert("Please connect your wallet and continue.");
      return;
    }
    try {
      setIsLoading(true);
      const nftContract = new ethers.Contract(
        price === 9.9
          ? "0x91cb12fb7a1678B6CDC1B18Ef8D5eC0d7697c4A0"
          : "0xa81B81384fD201ABD482662312207fB1cADe7F1d",
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
        value: getEthValue(price).mul(BigNumber.from(quantity)),
      };
      console.log(ethers.utils.formatEther(options.value.toString()));
      const tx = await nftContract.mint(quantity, options);
      await tx.wait();
      alert("You have successfully minted the NFT(s), thanks.");
    } catch (e: any) {
      console.log(e.message);
      alert(e.data?.message || e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ bgcolor: "background.paper", minHeight: "100vh" }}>
      <Box
        p={2}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Box
          sx={{
            background: `url(/dao_logo.png)`,
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
            Connect
          </Button>
        )}
      </Box>
      <Box
        display="flex"
        gap={6}
        justifyContent="space-around"
        flexWrap="wrap"
        p={{ xs: 2, sm: 5 }}
        style={{
          backgroundImage: `url('${trackDetails?.coverUrl}')`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "top right",
          boxShadow: "inset 0 0 0 1000px rgba(0,0,0,75%)",
        }}
      >
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          gap={2}
          maxWidth={{ md: "35%" }}
        >
          <Box
            display="flex"
            gap={6}
            alignItems="center"
            justifyContent="center"
            flexWrap="wrap"
          >
            <Box>
              <img
                src={trackDetails?.profileUrl}
                alt=""
                width="150px"
                height="150px"
                style={{ borderRadius: "6px" }}
              ></img>
            </Box>
            <Box>
              <Box>
                <Typography variant="h5" fontWeight="bold">
                  {trackDetails?.title}
                </Typography>
                <Typography variant="body1">{trackDetails?.artist}</Typography>
              </Box>
              <Box mt={3} display="flex" flexWrap="wrap">
                <IconButton
                  sx={{ p: 0 }}
                  href={`//${trackDetails?.socials?.tiktok}`}
                  target="_blank"
                >
                  <img src="/social/tiktok.png" alt="tiktok" />
                </IconButton>
                <IconButton
                  sx={{ p: 0 }}
                  href={`//${trackDetails?.socials?.twitter}`}
                  target="_blank"
                >
                  <img src="/social/twitter.png" alt="twitter" />
                </IconButton>
                <IconButton
                  sx={{ p: 0 }}
                  href={`//${trackDetails?.socials?.facebook}`}
                  target="_blank"
                >
                  <img src="/social/facebook.svg" alt="fb" />
                </IconButton>
                <IconButton
                  sx={{ p: 0 }}
                  href={`//${trackDetails?.socials?.instagram}`}
                  target="_blank"
                >
                  <img src="/social/instagram.png" alt="instagram" />
                </IconButton>
                <IconButton
                  sx={{ p: 0 }}
                  href={`//${trackDetails?.socials?.youtube}`}
                  target="_blank"
                >
                  <img src="/social/youtube.png" alt="youtube" />
                </IconButton>
                {/* <IconButton
                  sx={{ p: 0 }}
                  href={`//${trackDetails?.socials?.linkedin}`}
                  target="_blank"
                >
                  <img src="/social/linkedin.svg" alt="fb" />
                </IconButton> */}
                <IconButton
                  sx={{ p: 0 }}
                  href={`//${trackDetails?.socials?.soundcloud}`}
                  target="_blank"
                >
                  <img src="/social/soundcloud.png" alt="fb" />
                </IconButton>
              </Box>
              {/* <Box mt={3}>
              <Typography>Genre: {trackDetails?.genre}</Typography>
              <Typography> Bpm: {trackDetails?.bpm} </Typography>
              <Typography>Key: {trackDetails?.key}</Typography>
            </Box> */}
            </Box>
          </Box>
          <Box>
            <Typography fontFamily="BenchNine">
              Residents and businesses of Little Haiti-Miami are being displaced
              by Real Estate development
            </Typography>
            <Typography
              // variant="caption"
              // fontWeight="bold"
              fontFamily="BenchNine"
              variant="h4"
            >
              Why? The value of each sq.ft. of their community has increased
              56,1% within a year
            </Typography>
            <Typography fontFamily="BenchNine" variant="body1">
              The Captain Haiti Foundation is creating a digital twin of the
              neighborhood in the metaverse to raise money and save Little
              Haiti-Miami from gentrification
            </Typography>
          </Box>
        </Box>

        <Box
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          gap={2}
          maxWidth={{ md: "30%" }}
        >
          <Box>
            <Box>
              {timerObj.isRevealed === false && (
                <Typography fontWeight="bold" variant="h5">
                  Mint "Bare Yo!" In...
                </Typography>
              )}
            </Box>
            {timerObj.isRevealed === false ? (
              <Box
                display="flex"
                flexWrap="wrap"
                justifyContent="center"
                gap={4}
              >
                <Box
                  // mr={2}
                  mt={2}
                  p={2}
                  sx={{ border: "2px solid white", borderRadius: "6px" }}
                  width="35px"
                  fontWeight="bold"
                >
                  <Typography fontWeight="bold" variant="h4" align="center">
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
                  sx={{ border: "2px solid white", borderRadius: "6px" }}
                  width="35px"
                >
                  <Typography fontWeight="bold" variant="h4" align="center">
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
                  sx={{ border: "2px solid white", borderRadius: "6px" }}
                  width="35px"
                >
                  <Typography fontWeight="bold" variant="h4" align="center">
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
                  sx={{ border: "2px solid white", borderRadius: "6px" }}
                  width="35px"
                >
                  <Typography fontWeight="bold" variant="h4" align="center">
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
            ) : (
              <Box
                my={2}
                // mx={4}
                p={2}
                sx={{ border: "2px solid white", borderRadius: "6px" }}
              >
                <Typography variant="h4" align="center" fontWeight="bold">
                  "Bare Yo!" Live
                </Typography>
                <Typography variant="body2" align="center">
                  Mint went live on Dec 9th 01:00 hrs ET
                </Typography>
              </Box>
            )}
          </Box>
          <Box display={"flex"} flexDirection="column" justifyContent={"start"}>
            <Typography fontFamily="BenchNine">
              Each Music-NFT of “Bare Yo!” is geolocated to 1 square foot of
              Little Haiti
            </Typography>
            <Typography
              // variant="caption"
              // fontWeight="bold"
              fontFamily="BenchNine"
              variant="h4"
            >
              Each Music-NFT will fund Captain Haiti’s bid to buy back his
              neighborhood
            </Typography>
            <Typography fontFamily="BenchNine" variant="body1">
              The NFT-funded smart village will serve as a “living lab” for
              year-round living, working, and playing, with the goal of becoming
              a destination for WEB3 innovation
            </Typography>
          </Box>
        </Box>

        <Box
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          gap={2}
          maxWidth={{ md: "20%" }}
        >
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/gENgcFL6LnM"
            title="Take the #BareYoChallenge - Make the song go Platinum and fund a smart village in Miami."
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>

          <Box display={"flex"} flexDirection="column" justifyContent={"start"}>
            <Typography fontFamily="BenchNine">
              Hurry! 17 buildings are going on auction on December 15th
            </Typography>
            <Typography
              // variant="caption"
              // fontWeight="bold"
              fontFamily="BenchNine"
              variant="h4"
            >
              Most tenants only have Month to Month leases. If their buildings
              are sold to someone else, they will be removed sooner or later!
            </Typography>
            <Typography fontFamily="BenchNine" variant="body1">
              By purchasing the Music-NFT “Bare Yo!” , you are joining in saving
              these buildings and bringing innovation and opportunity for all!
            </Typography>
          </Box>
        </Box>
        {/* <Box>
          <Typography
            // variant="caption"
            // fontWeight="bold"
            fontFamily="BenchNine"
          >
            Cherry is a twenty-two year old artist from Pittsburgh, Pennsylvania
            currently based out of Los Angeles. Pushing forward the sounds of
            indie pop, trap & electronic. After an introduction to making beats
            4 years ago, Cherry started to focus on creating music, and has been
            working. Being around music his whole life, becoming a creative was
            the outlet Cherry needed to find his own path. Cherry is a producer,
            engineer, mix&master, singer/songwriter and composes all of his own
            projects. Recently dropping his latest EP in l.a. he is set to focus
            on his connection to music, and release new music in 2022.
          </Typography>
        </Box> */}
      </Box>

      <Box mt={6} pb={6}>
        <Grid container>
          <Grid item xs={12} md={6}>
            <Box
              width={"100%"}
              display="flex"
              justifyContent={"center"}
              alignItems="center"
              height="100%"
            >
              <Box width={{ sx: "100%", md: "80%" }} position={"relative"}>
                <img
                  src="/captain-mint.png"
                  alt=""
                  width={"100%"}
                  style={{ objectFit: "cover" }}
                />
                <Box position={"absolute"} top={0} width={"100%"}>
                  <Box display={"flex"} justifyContent="center" width={"100%"}>
                    <Box
                      sx={{ background: "rgba(0,0,0,60%)" }}
                      width={"100%"}
                      p={2}
                    >
                      <Box
                        display={"flex"}
                        justifyContent="center"
                        alignItems={"center"}
                        gap={2}
                      >
                        <Box>
                          <Typography
                            sx={{
                              background:
                                "linear-gradient(43deg, #90D5EC 10%, #F907FC 100%)",
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                              fontWeight: "bolder",
                            }}
                          >
                            Whole Song
                          </Typography>
                          <Typography variant="h6">199 MATIC</Typography>
                        </Box>
                        <Box
                          width="80px"
                          // height="80px"
                          display={"flex"}
                          justifyContent={
                            price === 199 ? "flex-start" : "flex-end"
                          }
                          borderRadius={"25px"}
                          p={1}
                          sx={{
                            cursor: "pointer",
                            // backgroundColor: "rgba(255,255,255,0.4)",
                            background:
                              "linear-gradient(225deg, rgb(255, 60, 172) 0%, rgb(120, 75, 160) 50%, rgb(43, 134, 197) 100%)",
                          }}
                          onClick={() => {
                            if (price === 9.9) {
                              setPrice(199);
                            } else {
                              setPrice(9.9);
                            }
                          }}
                        >
                          <motion.div
                            style={{
                              width: "40px",
                              height: "40px",
                              backgroundColor: "#fff",
                              borderRadius: "40px",
                            }}
                            layout
                            transition={spring}
                          />
                        </Box>

                        <Box>
                          <Typography
                            sx={{
                              background:
                                "linear-gradient(43deg, #90D5EC 10%, #F907FC 100%)",
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                              fontWeight: "bolder",
                            }}
                          >
                            Chorus Only
                          </Typography>
                          <Typography variant="h6">9.9 MATIC</Typography>
                        </Box>
                      </Box>
                      {/* <Typography
                        align="center"
                        variant="h4"
                        fontFamily={"BenchNine"}
                        fontWeight="bold"
                      >
                        {parseFloat(getEtherForQuantity(price, quantity))} MATIC
                      </Typography> */}
                    </Box>
                  </Box>
                </Box>
                <Box position={"absolute"} bottom={0} width={"100%"}>
                  <Box
                    display={"flex"}
                    justifyContent="space-around"
                    alignItems={"center"}
                    flexWrap={"wrap"}
                    sx={{ background: "rgba(0,0,0,40%)" }}
                    gap={1}
                    p={2}
                  >
                    <CrossmintPayButton
                      showOverlay
                      clientId={
                        price === 9.9
                          ? "3d040d1a-f2eb-4b48-8036-a20bcc6dd8fe"
                          : "959b0097-d4a5-4990-bc69-7039c054753e"
                      }
                      mintConfig={{
                        type: "erc-721",
                        totalPrice: getEtherForQuantity(price, quantity),
                        tokenQuantity: quantity,
                      }}
                    />
                    <Box>
                      <Badge
                        badgeContent={
                          quantity > 1
                            ? parseFloat(getEtherForQuantity(price, quantity))
                            : null
                        }
                        color="success"
                        max={999999999999999999999999}
                      >
                        <TextField
                          value={quantity}
                          onChange={(e) => {
                            setQuantity(parseInt(e.target.value));
                          }}
                          inputProps={{ step: 1, min: 1 }}
                          type="number"
                          // variant="filled"
                          sx={{
                            width: "70px",
                            background: "rgb(30, 30, 30)",
                            borderRadius: "6px",
                          }}
                          disabled={isLoading}
                        />
                      </Badge>
                      {/* <TextField
                        value={parseFloat(getEtherForQuantity(price, quantity))}
                        sx={{
                          width: "70px",
                          background: "rgb(30, 30, 30)",
                          borderRadius: "6px",
                        }}
                      /> */}
                      {/* <Box
                        sx={{
                          background: "rgb(30, 30, 30)",
                        }}
                        p={2}
                      >
                        <Typography>
                          {getEtherForQuantity(price, quantity)}
                        </Typography>
                      </Box> */}
                      {/* <Select
                        onChange={(e) => {
                          setPrice(Number(e.target.value));
                        }}
                        disabled={isLoading}
                        value={price}
                        sx={{
                          background: "rgb(30, 30, 30)",
                        }}
                      >
                        <MenuItem value={199}>199 MATIC</MenuItem>
                        <MenuItem value={9.9}>9.9 MATIC</MenuItem>
                      </Select> */}
                    </Box>
                    <LoadingButton
                      loading={isLoading}
                      variant="contained"
                      sx={{
                        // fontFamily: "monospace",
                        textTransform: "unset",
                      }}
                      onClick={onMint}
                    >
                      Mint with MATIC
                    </LoadingButton>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              display={"flex"}
              flexDirection="column"
              justifyContent={"space-between"}
              alignItems="center"
            >
              <Box width={"50%"} py={2} position="relative">
                {!account && (
                  <Box
                    position={"absolute"}
                    width="100%"
                    height="100%"
                    display={"flex"}
                    alignItems="center"
                    justifyContent={"center"}
                  >
                    <Box
                      p={{ xs: 1, md: 2 }}
                      sx={{
                        background: "rgba(0,0,0,40%)",
                        borderRadius: "6px",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        login();
                      }}
                    >
                      <Typography color={"#c4c4c4"}>Connect Wallet</Typography>
                    </Box>
                  </Box>
                )}
                <Pie
                  data={{
                    labels: ["Your Contribution", "Total Raised"],
                    datasets: [
                      {
                        // label: "# of Votes",
                        data: [contributions, totalRaised],
                        backgroundColor: [
                          "rgba(153, 102, 255, 0.2)",
                          "rgba(54, 162, 235, 0.2)",
                        ],
                        borderColor: [
                          "rgba(153, 102, 255, 0.2)",
                          "rgba(54, 162, 235, 0.2)",
                        ],
                        borderWidth: 2,
                      },
                    ],
                  }}
                />
              </Box>
              <Box width={"50%"} py={2}>
                <img src="/map.png" alt="" width={"100%"} />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Box mt={4} pb={8} display="flex" justifyContent="center">
        <Grid
          container
          rowSpacing={2}
          xs={11}
          md={6}
          sx={{
            ".MuiGrid-item": { borderBottom: "1px solid #c4c4c4", p: 1.5 },
          }}
        >
          <Grid item xs={4} borderBottom="1px solid #c4c4c4"></Grid>
          <Grid item xs={4} borderBottom="1px solid #c4c4c4">
            <Typography textAlign={"center"}>Song</Typography>
          </Grid>
          <Grid item xs={4} borderBottom="1px solid #c4c4c4">
            <Typography textAlign={"center"}>Chorus</Typography>
          </Grid>
          <Grid item xs={4} sx={{ background: "rgba(204, 204, 204, 15%)" }}>
            <Typography>Geo-Location</Typography>
          </Grid>
          <Grid
            item
            xs={4}
            sx={{ background: "rgba(204, 204, 204, 15%)" }}
          ></Grid>
          <Grid
            item
            xs={4}
            sx={{ background: "rgba(204, 204, 204, 15%)" }}
          ></Grid>
          <Grid item xs={4}>
            <Typography>Location</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography textAlign={"center"}>17 Physical Addresses</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography textAlign={"center"}>Little Haiti</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography noWrap>Circulation</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography textAlign={"center"}>112,171 Sq. Ft.</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography textAlign={"center"}>9,634,750 Sq. Ft.</Typography>
          </Grid>
          <Grid item xs={4} sx={{ background: "rgba(204, 204, 204, 15%)" }}>
            <Typography>Social Club</Typography>
          </Grid>
          <Grid
            item
            xs={4}
            sx={{ background: "rgba(204, 204, 204, 15%)" }}
          ></Grid>
          <Grid
            item
            xs={4}
            sx={{ background: "rgba(204, 204, 204, 15%)" }}
          ></Grid>
          <Grid item xs={4}>
            <Typography>Discounts</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography textAlign={"center"}>X</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography textAlign={"center"}>X</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography>Free Samples and Goods</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography textAlign={"center"}>X</Typography>
          </Grid>
          <Grid item xs={4}></Grid>
          <Grid item xs={4}>
            <Typography>Free Events</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography textAlign={"center"}>X</Typography>
          </Grid>
          <Grid item xs={4}></Grid>
          <Grid item xs={4} sx={{ background: "rgba(204, 204, 204, 15%)" }}>
            <Typography>Metaverse</Typography>
          </Grid>
          <Grid
            item
            xs={4}
            sx={{ background: "rgba(204, 204, 204, 15%)" }}
          ></Grid>
          <Grid
            item
            xs={4}
            sx={{ background: "rgba(204, 204, 204, 15%)" }}
          ></Grid>
          <Grid item xs={4}>
            <Typography>Metaverse Concert</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography textAlign={"center"}>X</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography textAlign={"center"}>X</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography>Metaverse Listing</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography textAlign={"center"}>X</Typography>
          </Grid>
          <Grid item xs={4}></Grid>
          <Grid item xs={4} sx={{ background: "rgba(204, 204, 204, 15%)" }}>
            <Typography>Airdrops</Typography>
          </Grid>
          <Grid
            item
            xs={4}
            sx={{ background: "rgba(204, 204, 204, 15%)" }}
          ></Grid>
          <Grid
            item
            xs={4}
            sx={{ background: "rgba(204, 204, 204, 15%)" }}
          ></Grid>
          <Grid item xs={4}>
            <Typography>“Bare Yo!” Party Mix</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography textAlign={"center"}>X</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography textAlign={"center"}>X</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography>$CAPH tokens</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography noWrap textAlign={"center"}>
              10,000,000
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography textAlign={"center"} noWrap>
              1,000,000
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography noWrap>$LittleHaitiCoin</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography textAlign={"center"}>10</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography textAlign={"center"}>1</Typography>
          </Grid>
        </Grid>
      </Box>
      <Box mt={4} pb={8}>
        <Typography variant="h5" align="center" fontFamily="monospace">
          Powered By
        </Typography>
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
            <TextField
              placeholder="Spotify Artist ID"
              onChange={(e) => setSpotifyArtistId(e.target.value)}
            />
          </Box>
          <Button
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
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default App;
