import { CrossmintPayButton } from "@crossmint/client-sdk-react-ui";
import {
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

const trackDetails = {
  artist: "Captain Haiti",
  title: "Bare Yo!",
  coverUrl: "/cover.jpeg",
  profileUrl:
    "https://d1fdloi71mui9q.cloudfront.net/EDUJ2p7SIOcMrrZapo6r_4oHS4REbRjov2OJA",
  socials: {
    tiktok: "tiktok.com/@captainhaiti",
    twitter: "twitter.com/haiticaptain",
    instagram: "instagram.com/captainhaiti",
    youtube: "youtube.com/channel/UCFn86vJtQff1Lk8co5obm1g",
    facebook: "facebook.com/gaming/RealCaptainHaiti",
    linkedin: "linkedin.com/in/captain-haiti-816b59208",
  },
};
const getTimerObj = () => {
  const revealDate = "Fri, 9 Dec 2022 07:00:00 GMT";
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
  const [spotifyArtistId, setSpotifyArtistId] = useState<string>();
  const { login } = useAuth();
  const { account } = useWeb3React();

  const [timerObj, setTimerObj] = useState(getTimerObj);

  useEffect(() => {
    const myInterval = setInterval(() => {
      const _newTimerObj = getTimerObj();
      setTimerObj(_newTimerObj);
    }, 1000);
    return () => {
      clearInterval(myInterval);
    };
  }, [timerObj]);
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
                <IconButton
                  sx={{ p: 0 }}
                  href={`//${trackDetails?.socials?.linkedin}`}
                  target="_blank"
                >
                  <img src="/social/linkedin.svg" alt="fb" />
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
              17 BUILDINGS OF LITTLE HAITI-MIAMI WILL BE AUCTIONED ON DECEMBER
              15TH @ 11AM
            </Typography>
            <Typography
              // variant="caption"
              // fontWeight="bold"
              fontFamily="BenchNine"
              variant="h4"
            >
              The Captain Haiti Foundation is raising money to buy them and
              create a Crypto-City.
            </Typography>
            <Typography fontFamily="BenchNine" variant="body1">
              Also, 90% of Haitian Mom and Pop Shops only have Month to Month
              leases. If their buildings are sold to someone else, they will be
              removed sooner or later!
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
                  Mint Bare Yo In...
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
                  nGenesis Live
                </Typography>
                <Typography variant="body2" align="center">
                  nGenesis went live at Block 15744745 Oct 14th 00:05 hrs PDT
                </Typography>
              </Box>
            )}
          </Box>
          <Box>
            <Typography fontFamily="BenchNine">
              HOW WILL WE RAISE THE MONEY NEEDED?
            </Typography>
            <Typography
              // variant="caption"
              // fontWeight="bold"
              fontFamily="BenchNine"
              variant="h4"
            >
              Dance, sing, buy, donate or share "Bare Yo!" to make it platinum!.
            </Typography>
            <Typography fontFamily="BenchNine" variant="body1">
              The Captain Haiti Foundation is raising money with the song "Bare
              Yo!" to help them win the bid on their buildings!
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

          <Box>
            <Typography fontFamily="BenchNine">
              WHAT IS THE FORMAT OF THE SONG?
            </Typography>
            <Typography
              // variant="caption"
              // fontWeight="bold"
              fontFamily="BenchNine"
              variant="h4"
              pb={5}
            >
              "Bare Yo!" is a NFT
            </Typography>
            <Typography fontFamily="BenchNine" variant="body1">
              Like CDs have been a vinyl killer and mp3s have been a CD
              killer... NFTs is a new technology certifying your rights to the
              song.
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
              display={"flex"}
              flexDirection="column"
              justifyContent={"center"}
              alignItems="center"
            >
              <img src="/polygon.png" alt="" width={"100%"} />
              <CrossmintPayButton
                onClick={() => {
                  // setIsListening(true);
                }}
                showOverlay={false}
                clientId="284d3037-de14-4c1e-9e9e-e76c2f120c8a"
                mintConfig={{
                  type: "erc-721",
                  totalPrice: "0",
                }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              display={"flex"}
              flexDirection="column"
              justifyContent={"center"}
              alignItems="center"
            >
              <img src="/polygon.png" alt="" width={"100%"} />
              <Button variant="contained">Mint</Button>
            </Box>
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
