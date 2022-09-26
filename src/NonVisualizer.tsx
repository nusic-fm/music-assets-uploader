/* eslint-disable react-hooks/exhaustive-deps */
import { CrossmintPayButton } from "@crossmint/client-sdk-react-ui";
import { Button, Chip, IconButton, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import SolAbi from "./abis/SolAbi.json";
import { useSignInWithFacebook } from "react-firebase-hooks/auth";
import { auth } from "./services/firebase.service";

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
  tiktokProfileUrl: string;
  noOfSections: number;
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
    artist: "GWEN X MmmCherry",
    title: "Sacrifice",
    genre: "Pop",
    bpm: 190,
    key: "A",
    coverUrl: "/artist-covers/cherry-test.jpg",
    profileUrl: "/artist-covers/cherry.jpeg",
    tiktokProfileUrl: "https://www.tiktok.com/@mmmcherry",
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
  const [signInWithFacebook, user] = useSignInWithFacebook(auth);

  useEffect(() => {
    setTrackDetails(tracks[trackIdx]);
  }, [trackIdx]);

  const setListOfMintedTokens = async () => {
    const provider = new ethers.providers.AlchemyProvider(
      process.env.REACT_APP_CHAIN_NAME as string,
      process.env.REACT_APP_ALCHEMY as string
    );
    const contract = new ethers.Contract(
      process.env.REACT_APP_CONTRACT_ADDRESS as string,
      SolAbi,
      provider
    );
    const listOfData = await contract.getChildrenMetadata(0);
    const tokenIds = listOfData
      .filter((data: any) => data.isMinted)
      .map((data: any) => data.tokenId.toString());
    const _ownTokenIds = listOfData
      .filter((data: any) => data.isMinted && data.uid === "")
      .map((data: any) => data.tokenId.toString());
    setOwnTokenIds(_ownTokenIds);
    setMintedTokenIds(tokenIds);
    const buyButtons = document.getElementsByClassName("crossmintButton-0-2-1");
    Array.from(buyButtons).map((btn: any) => {
      const icon = btn?.firstChild;
      if (btn.children[1]) btn.children[1].innerText = "Buy";
      btn?.removeChild(icon);
      return "";
    });
  };
  useEffect(() => {
    if (user?.user) {
      setListOfMintedTokens();
    }
  }, [user]);

  const downloadFile = () => {
    // setFirstClick(false);
    fetch("https://assets.nusic.fm/bg.mp4")
      .then((resp) => resp.blob())
      .then((blob) => {
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
      .catch(() => alert("oh no!"));
  };

  const onSignInWithFb = async () => {
    signInWithFacebook();
  };

  return (
    <Box sx={{ bgcolor: "background.paper", minHeight: "100vh" }}>
      <Box p={2} display="flex" justifyContent="end">
        {user?.user ? (
          <Chip label={user.user.displayName} />
        ) : (
          <Button variant="contained" onClick={onSignInWithFb}>
            Sign In with Facebook
          </Button>
        )}
      </Box>
      <Box
        display="flex"
        justifyContent="center"
        p={5}
        style={{
          backgroundImage: `url('${trackDetails?.coverUrl}')`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "10% 60%",
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
              <Typography variant="caption">{trackDetails?.artist}</Typography>
            </Box>
            <Box mt={3}>
              <IconButton
                href={`//${trackDetails?.tiktokProfileUrl}`}
                target="_blank"
              >
                <img src="/tiktok.png" alt="tiktok" />
              </IconButton>
            </Box>
            {/* <Box mt={3}>
              <Typography>Genre: {trackDetails?.genre}</Typography>
              <Typography> Bpm: {trackDetails?.bpm} </Typography>
              <Typography>Key: {trackDetails?.key}</Typography>
            </Box> */}
          </Box>
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
              width={200}
              height={200}
              position="relative"
              borderRadius="6px"
            >
              <video
                width="100%"
                height="100%"
                autoPlay
                muted
                loop
                id="15"
                style={{ borderRadius: "6px" }}
              >
                <source src="bg.mp4" type="video/mp4" />
              </video>
              <Box
                position="absolute"
                top={0}
                width="100%"
                height="100%"
                sx={{
                  opacity: "0",
                  transition: "opacity 0.2s",
                  background: "rgba(0,0,0,0.6)",
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
                  {mintedTokenIds.includes((i + 1).toString()) === false && (
                    <Box m={1}>
                      <Typography variant="body2">Choc #{section}</Typography>
                    </Box>
                  )}
                  {mintedTokenIds.includes((i + 1).toString()) === false &&
                    (ownTokenIds.includes(section) ? (
                      <Box mt={2} display="flex" justifyContent="center">
                        <Button variant="contained" onClick={downloadFile}>
                          Download
                        </Button>
                      </Box>
                    ) : user?.user ? (
                      <CrossmintPayButton
                        clientId="6e9abed3-b7d4-432c-90c2-c652ad1859a1"
                        mintConfig={{
                          type: "erc-721",
                          totalPrice: "0.01",
                          tokenId: Number(section).toString(),
                          parentTokenId: "0",
                          uri: "https://gateway.pinata.cloud/ipfs/QmbY9oktxxq4Sq4jD4KY3fhsgXQawsLTdWdjrN22jjsGQF/1.json",
                        }}
                        //   environment="staging"
                      />
                    ) : (
                      <Button variant="contained" onClick={onSignInWithFb}>
                        Login
                      </Button>
                    ))}
                  {mintedTokenIds.includes((i + 1).toString()) === false && (
                    <Box>
                      <Typography variant="subtitle2" align="right">
                        Price
                      </Typography>
                      <Typography variant="h6" align="right">
                        ~$20
                      </Typography>
                    </Box>
                  )}
                  {mintedTokenIds.includes((i + 1).toString()) && (
                    <Box position="absolute" bottom={0} right={0} m={1}>
                      <Typography>Minted</Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
          ))}
      </Box>
    </Box>
  );
};

export default NonVisualizer;
