/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { CrossmintPayButton } from "@crossmint/client-sdk-react-ui";
import {
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import SolAbi from "./abis/SolAbi.json";
import { useLocation } from "react-router-dom";
import axios from "axios";

// signInWithFacebook();
const baseUrl = "https://discord.com/api/oauth2/authorize";
const clientId = process.env.REACT_APP_DISCORD_CLIENT_ID as string;
const redirectUri = process.env.REACT_APP_REDIRECT_URL as string;
const responseType = "token";
const scope = "identify";
const localStorageAccessTokenKey = "nusic_discord_access_token";
const localStorageTokenTypeKey = "nusic_discord_token_type";

const sections: string[] = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
];
interface TrackMetadata {
  artist: string;
  title: string;
  genre: string;
  bpm: number;
  key: string;
  coverUrl: string;
  profileUrl: string;
  tiktokProfileUrl?: string;
  noOfSections: number;
  socials?: {
    tiktok: string;
    twitter: string;
    discord: string;
    instagram: string;
    youtube: string;
    spotify: string;
  };
}
const tracks: TrackMetadata[] = [
  {
    artist: "Mackenzie Sol",
    title: "Happy Ever After All",
    genre: "Pop",
    bpm: 190,
    key: "A",
    coverUrl: "/artist-covers/sol.png",
    profileUrl: "/artist-covers/sol.png",
    tiktokProfileUrl: "",
    noOfSections: 16,
  },
  {
    artist: "mmmCherry",
    title: "The Point of No Return",
    genre: "Pop",
    bpm: 190,
    key: "A",
    coverUrl: "/cherry/banner.jpeg",
    profileUrl: "/cherry/feral.jpeg",
    socials: {
      tiktok: "tiktok.com/@mmmcherry",
      twitter: "twitter.com/mmmcherry",
      discord: "discord.gg/N8kPyFVavQ",
      instagram: "instagram.com/mmmcherrymusic",
      youtube: "youtube.com/channel/UCcfGu5v511FNCsrcBqwTafw",
      spotify: "open.spotify.com/artist/2pjOLjJD4lElSnRaeYad57",
    },
    noOfSections: 12,
  },
];
const NonVisualizer = (props: { trackIdx: number }) => {
  const { trackIdx } = props;
  // const [firstClick, setFirstClick] = useState(false);
  // const [showDownloadIdx, setShowDownloadIdx] = useState("");
  const [ownTokenIds, setOwnTokenIds] = useState<string[]>([]);
  const [mintedTokenIds, setMintedTokenIds] = useState<string[]>([]);
  const [trackDetails, setTrackDetails] = useState<TrackMetadata>();
  const [, setAccessToken] = useState<string>();
  const [, setTokenType] = useState<string>();
  const [isListening, setIsListening] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [newlyMintedToken, setNewlyMintedToken] = useState<string>();

  const getTimerObj = () => {
    const countDownDate = new Date("2022-10-14T20:00:00.000-07:00").getTime();
    const timeleft = countDownDate - Date.now();
    const days = Math.floor(timeleft / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((timeleft % (1000 * 60)) / 1000);
    return { days, hours, minutes, seconds };
  };
  // const timer = useRef<NodeJS.Timer | null>(null);
  const [timerObj, setTimerObj] = useState(getTimerObj);

  // const countDown = () => {
  //   const newSeconds = seconds - 1;
  //   console.log({ seconds, newSeconds });
  //   setSeconds(newSeconds);
  // };

  useEffect(() => {
    const myInterval = setInterval(() => {
      setTimerObj(getTimerObj());
    }, 1000);
    return () => {
      clearInterval(myInterval);
    };
  }, [timerObj]);

  const [user, setUser] = useState<{
    name: string;
    id: string;
    avatar: string;
  }>();
  const location = useLocation();

  const fetchUser = async (
    _tokenType: string,
    _accessToken: string,
    isAlertOnFail: boolean = true
  ) => {
    const url = "https://discord.com/api/users/@me";
    try {
      const response = await axios.get(url, {
        headers: { Authorization: `${_tokenType} ${_accessToken}` },
      });
      const { username, id, avatar } = response.data;
      // https://cdn.discordapp.com/avatars/879400465861869638/5d69e3e90a6d07b3cd15e4cd4e8a1407.png
      setUser({ name: username, id, avatar });
      window.history.replaceState(null, "", window.location.origin);
    } catch (e) {
      if (isAlertOnFail) alert("Please click Sign In to continue");
    }
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.hash.slice(1));
    const _accessToken = searchParams.get("access_token");
    const _tokenType = searchParams.get("token_type");
    if (_accessToken && _tokenType) {
      window.localStorage.setItem(localStorageAccessTokenKey, _accessToken);
      window.localStorage.setItem(localStorageTokenTypeKey, _tokenType);
      fetchUser(_tokenType, _accessToken);
      setTokenType(_tokenType);
      setAccessToken(_accessToken);
    }
  }, []);

  useEffect(() => {
    if (newlyMintedToken) {
      downloadFile();
      setListOfMintedTokens(false);
    }
  }, [newlyMintedToken]);

  useEffect(() => {
    setTrackDetails(tracks[trackIdx]);
  }, [trackIdx]);

  const setListOfMintedTokens = async (isAttachListener: boolean = true) => {
    const provider = new ethers.providers.AlchemyProvider(
      process.env.REACT_APP_CHAIN_NAME as string,
      process.env.REACT_APP_ALCHEMY as string
    );
    const contract = new ethers.Contract(
      process.env.REACT_APP_CONTRACT_ADDRESS as string,
      SolAbi,
      provider
    );
    if (isAttachListener) {
      console.log("Listening");
      contract.on("Minted", (to, id, parentTokenId, tokenId) => {
        setIsListening(false);
        if (id === user?.id) setNewlyMintedToken(tokenId.toString());
      });
    }
    const listOfData = await contract.getChildrenMetadata(0);
    const tokenIds = listOfData
      .filter((data: any) => data.isMinted)
      .map((data: any) => data.tokenId.toString());
    const _ownTokenIds = listOfData
      .filter((data: any) => data.isMinted && data.id === user?.id)
      .map((data: any) => data.tokenId.toString());
    setOwnTokenIds(_ownTokenIds);
    setMintedTokenIds(tokenIds);
    const buyButtons = document.getElementsByClassName("crossmintButton-0-2-1");
    Array.from(buyButtons).map((btn: any) => {
      const icon = btn?.firstChild;
      if (icon.tagName === "IMG") {
        btn?.removeChild(icon);
        if (btn?.children[0]) btn.children[0].innerText = "Buy";
      }
      return "";
    });
  };
  useEffect(() => {
    if (user) {
      setListOfMintedTokens();
    } else {
      const _accessToken = window.localStorage.getItem(
        localStorageAccessTokenKey
      );
      const _tokenType = window.localStorage.getItem(localStorageTokenTypeKey);
      if (_accessToken && _tokenType) {
        fetchUser(_tokenType, _accessToken, false);
      }
    }
  }, [user]);

  const downloadFile = () => {
    setIsDownloading(true);
    fetch("https://assets.nusic.fm/bg.mp4")
      .then((resp) => resp.blob())
      .then((blob) => {
        setIsDownloading(false);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        // the filename you want
        a.download = "Happy Ever After All.mp4";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        alert("your file has downloaded!"); // or you know, something with better UX...
      })
      .catch(() => alert("Download failed. Please try again"));
  };

  // const onSignInWithFb = async () => {
  //   window.open(
  //     `${baseUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}`
  //   );
  // };
  const isTokenAlreadyMinted = (id: number) =>
    mintedTokenIds.includes(id.toString());
  const isTokenMintedByUser = (id: number) =>
    ownTokenIds.includes(id.toString());

  return (
    <Box sx={{ bgcolor: "background.paper", minHeight: "100vh" }}>
      <Box
        p={2}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Box
          style={{
            background: `url(/cherry/logo.png)`,
            objectFit: "cover",
            width: "130px",
            height: "50px",
            backgroundSize: "cover",
            backgroundPosition: "center",
            transform: "scale(2)",
          }}
        ></Box>
        {user ? (
          <Chip label={user.name} />
        ) : (
          <Button
            variant="contained"
            // onClick={onSignInWithFb}
            href={`${baseUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}`}
            startIcon={<img src="/social/discord.png" alt="" width={"22px"} />}
          >
            Sign In
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
          boxShadow: "inset 0 0 0 1000px rgba(67,50,152,65%)",
        }}
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
                href={`//${trackDetails?.socials?.discord}`}
                target="_blank"
              >
                <img src="/social/discord-icon.png" alt="discord" />
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
                href={`//${trackDetails?.socials?.spotify}`}
                target="_blank"
              >
                <img src="/social/spotify.png" alt="spotify" />
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
          <Box>
            <Typography fontWeight="bold" variant="h5">
              nGenesis Begins In...
            </Typography>
          </Box>
          <Box display="flex" flexWrap="wrap" justifyContent="center" gap={4}>
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
              <Typography variant="body2" align="center" fontFamily="BenchNine">
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
              <Typography variant="body2" align="center" fontFamily="BenchNine">
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
              <Typography variant="body2" align="center" fontFamily="BenchNine">
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
              <Typography variant="body2" align="center" fontFamily="BenchNine">
                sec
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box>
          <iframe
            width="100%"
            // height="720"
            src="https://www.youtube.com/embed/mqdVtek28_Q"
            title="My PERFECT 2022 Home Recording Studio Setup Tour"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </Box>
      </Box>
      <Box
        mt={6}
        pb={6}
        display="flex"
        flexWrap="wrap"
        gap={4}
        justifyContent="center"
      >
        {sections
          .slice(0, trackDetails?.noOfSections)
          .map((section: string, i: number) => (
            <Box
              key={i}
              width={200}
              height={200}
              position="relative"
              borderRadius="6px"
            >
              <img
                src={`/cherry/assets/${i <= 7 ? i + 1 : i - 7}.png`}
                alt=""
                width="100%"
                height="100%"
                style={{ borderRadius: "6px" }}
              ></img>
              {/* <video
                width="100%"
                height="100%"
                autoPlay
                muted
                loop
                id="15"
                style={{ borderRadius: "6px" }}
              >
                <source src="bg.mp4" type="video/mp4" />
              </video> */}
              <Box
                position="absolute"
                top={0}
                width="100%"
                height="100%"
                sx={{
                  opacity: "0.6",
                  // transition: "opacity 0.2s",
                  background: "rgba(0,0,0,0.8)",
                  borderRadius: "6px",
                  "&:hover": {
                    opacity: "0",
                  },
                }}
              />
              <Box
                position="absolute"
                top={0}
                width="100%"
                height="100%"
                sx={{
                  opacity: "0",
                  transition: "opacity 0.2s",
                  background: "rgba(0,0,0,0.8)",
                  borderRadius: "6px",
                  "&:hover": {
                    opacity: "1",
                  },
                }}
              >
                <Box
                  boxSizing="border-box"
                  width="100%"
                  height="100%"
                  display="flex"
                  flexDirection="column"
                  justifyContent="space-between"
                  p={1}
                  // onClick={() => {
                  //   if (!firstClick) {
                  //     setFirstClick(true);
                  //   } else {
                  //     setShowDownloadIdx(section);
                  //   }
                  // }}
                >
                  {/* {isTokenAlreadyMinted(i + 1) === false && ( */}
                  <Box m={1}>
                    <Typography variant="h6" fontFamily="BenchNine">
                      Feral #{section}
                    </Typography>
                  </Box>
                  {/* {isTokenAlreadyMinted(i + 1) && isTokenMintedByUser(i + 1) && (
                    <Box display="flex" justifyContent="center">
                      <Button variant="contained" onClick={downloadFile}>
                        Download
                      </Button>
                    </Box>
                  )} */}
                  <Button disabled variant="contained">
                    Reveal soon
                  </Button>
                  {/* {isTokenAlreadyMinted(i + 1) === false &&
                    (user ? (
                      <CrossmintPayButton
                        onClick={() => {
                          setIsListening(true);
                        }}
                        showOverlay={false}
                        clientId="a8a1099c-4dcf-40ff-8179-4c701101604a"
                        mintConfig={{
                          type: "erc-721",
                          totalPrice: "0.01",
                          tokenId: Number(section).toString(),
                          parentTokenId: "0",
                          _id: user.id,
                          uri: "https://gateway.pinata.cloud/ipfs/QmQ89xevkyDy1Nn99ennYEYRhXoswBkfafozqNdYhQT4PN/3.json%22%7D%7D",
                        }}
                        environment="staging"
                      />
                    ) : (
                      <Button
                        variant="contained"
                        // onClick={onSignInWithFb}
                        href={`${baseUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}`}
                        startIcon={
                          <img
                            src="/social/discord.png"
                            alt=""
                            width={"22px"}
                          />
                        }
                      >
                        Sign in
                      </Button>
                    ))} */}
                  {/* {isTokenAlreadyMinted(i + 1) === false && ( */}
                  <Box>
                    <Typography variant="subtitle2" align="right">
                      Price
                    </Typography>
                    <Typography variant="h6" align="right">
                      {/* ~$20 */}
                      TBA
                    </Typography>
                  </Box>
                  {/* {isTokenAlreadyMinted(i + 1) && (
                    <Box>
                      <Typography align="right" fontWeight={"bold"}>
                        Minted
                      </Typography>
                    </Box>
                  )} */}
                </Box>
              </Box>
            </Box>
          ))}
      </Box>
      <Dialog open={isListening || isDownloading}>
        <DialogContent>
          {isListening && (
            <Box>
              <Typography variant="h6">
                Waiting for the tx to complete...
              </Typography>
              <Typography variant="h6">
                Your download will begin once the tx is successful
              </Typography>
            </Box>
          )}
          {isDownloading && (
            <Box>
              {/* <Typography variant="h5">Downloding the file...</Typography> */}
              <CircularProgress />
            </Box>
          )}
        </DialogContent>
      </Dialog>
      <Box mt={4} pb={8}>
        <Typography variant="h5" align="center">
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
      </Box>
    </Box>
  );
};

export default NonVisualizer;
