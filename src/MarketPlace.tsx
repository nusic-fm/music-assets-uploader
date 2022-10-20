/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
// import { TreeItem, TreeView } from "@mui/lab";
import {
  Button,
  ButtonGroup,
  CircularProgress,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
// import { NftItem } from "./components/NftItem";
// import { getBinaryTree } from "./utils/binaryTreeGenerator";
import * as Tone from "tone";
import { useEffect, useRef } from "react";
import CanvasSectionBox from "./components/CanvasSectionBox";
import TonePlayerViz from "./components/TonePlayerViz";
import TransportBar from "./components/TransportBar";
import useAuth from "./hooks/useAuth";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import Erc20Abi from "./abis/Erc20.json";
import YbNftAbi from "./abis/AtomicMusicYBNFT.json";
import NftAbi from "./abis/AtomicMusicYBNFT.json";
import CalendarViewDayRoundedIcon from "@mui/icons-material/CalendarViewDayRounded";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import PauseRoundedIcon from "@mui/icons-material/PauseRounded";
import HorizontalRuleRoundedIcon from "@mui/icons-material/HorizontalRuleRounded";

export interface Section {
  name: string;
  beatEnd: number;
  beatStart: number;
  stems: {
    bass: boolean;
    melody: boolean;
    drums: boolean;
    vocals: boolean;
  };
  sectionStartBeatInSeconds: number;
  sectionEndBeatInSeconds: number;
}
export type SectionCoordinate = { left: number; right: number };
export type PixelLocation = { offsetX: number; clientWidth: number };
export type SectionInfo = { left: number; width: number; index: number };

export const sectionsWithOffset = {
  0: [
    {
      sectionStartBeatInSeconds: 0,
      sectionEndBeatInSeconds: 25,
      name: "Intro",
    },
    {
      sectionStartBeatInSeconds: 25,
      sectionEndBeatInSeconds: 51,
      name: "Verse",
    },
    {
      sectionStartBeatInSeconds: 51,
      sectionEndBeatInSeconds: 78,
      name: "Chorus",
    },
    {
      sectionStartBeatInSeconds: 78,
      sectionEndBeatInSeconds: 104,
      name: "Verse",
    },
    {
      sectionStartBeatInSeconds: 104,
      sectionEndBeatInSeconds: 129,
      name: "Breakdown",
    },
    {
      sectionStartBeatInSeconds: 129,
      sectionEndBeatInSeconds: 155,
      name: "Pre-Chorus",
    },
    {
      sectionStartBeatInSeconds: 155,
      sectionEndBeatInSeconds: 180,
      name: "Chorus",
    },
    {
      sectionStartBeatInSeconds: 180,
      sectionEndBeatInSeconds: 214,
      name: "Outro",
    },
  ],
  1: [],
};

const raveCode = {
  artistName: "YATTA",
  trackTitle: "Mystery of the Floating Pagoda",

  albumName: "Mystery of the Floating Pagoda",

  genre: "Electronic",

  bpm: 150,

  key: "A♭ minor",

  timeSignature: "4/4",
};

export const stemSectionPrices = {
  1: [0, 50, 60, 10, 10, 40, 60, 0], //BASS
  10: [80, 50, 60, 90, 50, 40, 60, 80], //CHORDS
  19: [0, 50, 60, 10, 50, 40, 60, 0], //PADS
  28: [80, 50, 60, 90, 50, 40, 60, 80], //PERCUSSION
  37: [160, 200, 240, 200, 160, 160, 240, 160], //FULLTRACK
} as { 1: number[]; 10: number[]; 19: number[]; 28: number[]; 37: number[] };

export const MarketPlace = () => {
  const { login } = useAuth();
  const { account, library } = useWeb3React();

  const tonePlayers = useRef<Tone.Players | null>(null);
  const bassPlayer = useRef<Tone.Player | null>(null);
  const drumsPlayer = useRef<Tone.Player | null>(null);
  const soundPlayer = useRef<Tone.Player | null>(null);
  const synthPlayer = useRef<Tone.Player | null>(null);

  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedTrackIndex, setSelectedTrackIndex] = useState(0);

  const selectedSectionIndex = useRef<number>(-1);
  // const [selectedSectionIndexState, setSelectedSectionIndexState] =
  //   useState<number>(-1);
  const stemPlayerName = useRef<string>("");
  const isSongMode = useRef<boolean>(true);
  const transportProgressRef = useRef<number>(0);
  const toneChangetimer = useRef<NodeJS.Timeout>();

  const [clientWidth, setClientWidth] = useState<number>(0);
  const [isSongModeState, setIsSongModeState] = useState<boolean>(true);
  const [selectedStemPlayerName, setSelectedStemPlayerName] =
    useState<string>("");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoopOn, setIsLoopOn] = useState<boolean>(false);
  const [, setDuration] = useState<number>(0);
  const [transportProgress, setTransportProgress] = useState<number>(0);
  const [songMetadata] = useState<any>(raveCode);
  const [showSections, setShowSections] = useState(false);

  const isFirstClickPending = useRef(true);

  const onMounted = (width: number) => {
    setClientWidth(width);
  };

  const transformCoordinateSecondsIntoPixels = (
    startOffsetInSeconds: number,
    endOffsetInSeconds: number
  ): SectionCoordinate => {
    const songDurationInSeconds = bassPlayer.current?.buffer.duration ?? 1;
    const chosenSectionStartBeatInPixels =
      (startOffsetInSeconds / songDurationInSeconds) * clientWidth;
    const chosenSectionEndBeatInPixels =
      (endOffsetInSeconds / songDurationInSeconds) * clientWidth;
    return {
      left: chosenSectionStartBeatInPixels,
      right: chosenSectionEndBeatInPixels,
    };
  };

  const [sectionLocation, setSectionLocation] = useState<{
    left: number;
    width: number;
    index: number;
  }>({ left: -1, width: 0, index: -1 });

  const setupTransportTimeline = async () => {
    await Tone.start();
    Tone.Transport.bpm.value = songMetadata.bpm;
    // eslint-disable-next-line no-console
    console.log("🥁 Tone started");
    // Tone.Transport.start();
    Tone.Transport.cancel(0);

    const startBeatOffset = 0;
    bassPlayer.current?.start(0, startBeatOffset);
    drumsPlayer.current?.start(0, startBeatOffset);
    soundPlayer.current?.start(0, startBeatOffset);
    synthPlayer.current?.start(0, startBeatOffset);
    setDuration(bassPlayer.current?.buffer.duration ?? 0);

    new Tone.Loop(() => {
      const progress =
        Tone.Transport.seconds / (bassPlayer.current?.buffer.duration ?? 0);
      transportProgressRef.current = progress;
    }, "16n").start(0);
  };
  const handleTimerTick = () => {
    setTransportProgress(transportProgressRef.current * clientWidth);
  };
  useEffect(() => {
    let timerEvent: NodeJS.Timer;
    if (isPlaying) {
      timerEvent = setInterval(handleTimerTick, 10);
    }
    return () => {
      clearTimeout(timerEvent);
    };
  }, [isPlaying]); // eslint-disable-line react-hooks/exhaustive-deps

  const start = async (trackIndex: number) => {
    let stemPlayers;
    if (trackIndex === 0) {
      // Synth, Sound, Bass, Drums
      stemPlayers = {
        synth:
          "https://storage.googleapis.com/nusic-mashup-content/Yatta/percussion.mp3",
        sound:
          "https://storage.googleapis.com/nusic-mashup-content/Yatta/chords.mp3",
        bass: "https://storage.googleapis.com/nusic-mashup-content/Yatta/bass.mp3",
        drums:
          "https://storage.googleapis.com/nusic-mashup-content/Yatta/pads.mp3",
      };
    } else {
      // setIsSongModeState(false);
      // isSongMode.current = false;
      stemPlayers = {
        bass: "https://storage.googleapis.com/nusic-mashup-content/No-Air/fulltrack.mp3",
      };
    }
    const players = new Tone.Players(stemPlayers as any, () => {
      bassPlayer.current = players.player("bass").toDestination().sync();
      if (trackIndex === 0) {
        drumsPlayer.current = players.player("drums").toDestination().sync();
        soundPlayer.current = players.player("sound").toDestination().sync();
        synthPlayer.current = players.player("synth").toDestination().sync();
      }
      // setupTransportTimeline();
      setIsLoaded(true);
    });
    tonePlayers.current = players;
    initializeToneTransportBridge();
    // player.autostart = true;
  };
  const toggleTransport = () => {
    if (Tone.Transport.state !== "started") {
      Tone.Transport.start();
    } else {
      Tone.Transport.pause();
    }
  };
  const transformPixelToSectionStartPixel = (
    coordinate: PixelLocation
  ): SectionInfo => {
    const offsetX = coordinate.offsetX;
    const clientWidth = coordinate.clientWidth;
    const songDurationInSeconds = bassPlayer.current?.buffer.duration ?? 1;
    const clickTransportPositionInSeconds =
      (offsetX / clientWidth) * songDurationInSeconds;

    const sectionIndex = sectionsWithOffset[
      selectedTrackIndex as 0 | 1
    ].findIndex(({ sectionStartBeatInSeconds, sectionEndBeatInSeconds }) => {
      return (
        clickTransportPositionInSeconds > sectionStartBeatInSeconds &&
        clickTransportPositionInSeconds < sectionEndBeatInSeconds
      );
    });
    selectedSectionIndex.current = sectionIndex === -1 ? 0 : sectionIndex;
    // setSelectedSectionIndexState(selectedSectionIndex.current);
    const { sectionStartBeatInSeconds, sectionEndBeatInSeconds } =
      sectionsWithOffset[selectedTrackIndex as 0 | 1][
        selectedSectionIndex.current
      ];
    const { left, right } = transformCoordinateSecondsIntoPixels(
      sectionStartBeatInSeconds,
      sectionEndBeatInSeconds
    );
    return { left, width: right - left, index: sectionIndex };
  };
  const setMutes = () => {
    if (selectedTrackIndex === 0) {
      const stems = ["synth", "sound", "bass", "drums"];
      stems.map((section) => {
        if (tonePlayers.current) {
          if (
            isSongMode.current === false &&
            section !== stemPlayerName.current
          ) {
            tonePlayers.current.player(section).mute = true;
          } else {
            tonePlayers.current.player(section).mute = false;
          }
        }
        return "";
      });
    }
  };
  const changeSectionAndTone = (
    event: any,
    stemName: string,
    calculatedOffsetLeft: number
  ) => {
    const previousSectionIndex = selectedSectionIndex.current;
    setMutes();
    if (tonePlayers.current) tonePlayers.current.mute = false;

    const { left, width, index } = transformPixelToSectionStartPixel({
      offsetX: calculatedOffsetLeft,
      clientWidth: event.currentTarget.clientWidth,
    });
    setSectionLocation({
      left,
      width,
      index,
    });
    if (previousSectionIndex === selectedSectionIndex.current) {
      return;
    }
    if (toneChangetimer.current) {
      clearTimeout(toneChangetimer.current);
    }
    const currentBeat = parseInt(
      Tone.Transport.position.toString().split(":")[1]
    );
    const delayTime = ((4 - currentBeat) / 4) * (60 / Tone.Transport.bpm.value);
    toneChangetimer.current = setTimeout(() => {
      Tone.Transport.seconds =
        sectionsWithOffset[selectedTrackIndex as 0 | 1][
          selectedSectionIndex.current
        ].sectionStartBeatInSeconds;
    }, delayTime * 1000);
  };

  const onMultiTrackHover = (event: React.MouseEvent) => {
    if (!showSections) {
      return;
    }
    const { left } = (
      event.currentTarget as HTMLElement
    ).getBoundingClientRect();
    const calculatedOffsetLeft = event.clientX - left;
    if ((event.target as HTMLElement).tagName === "CANVAS") {
      const stemName = (event.target as HTMLElement).getAttribute(
        "data-player"
      ) as string;
      if (selectedStemPlayerName !== stemName)
        setSelectedStemPlayerName(stemName);
      stemPlayerName.current = stemName;
      changeSectionAndTone(event, stemName, calculatedOffsetLeft);
    }
  };
  const onPlayOrPause = async () => {
    if (isFirstClickPending.current) {
      isFirstClickPending.current = false;
      await setupTransportTimeline();
    }
    toggleTransport();
  };
  const toggleSongOrStemMode = () => {
    isSongMode.current = !isSongMode.current;
    setIsSongModeState(isSongMode.current);
    setMutes();
  };
  const initializeToneTransportBridge = (): void => {
    Tone.Transport.on("start", () => {
      setIsPlaying(true);
    });
    Tone.Transport.on("pause", () => {
      setIsPlaying(false);
    });
    Tone.Transport.on("stop", () => {
      setIsPlaying(false);
    });
    Tone.Transport.on("loop", () => {
      setIsLoopOn(true);
    });
    Tone.Transport.off("loop", () => {
      setIsLoopOn(false);
    });
  };

  useEffect(() => {
    if (songMetadata) {
      start(0);
    }
  }, [songMetadata]);

  const onMintNft = async (price: number, sectionIndex: number) => {
    if (library) {
      try {
        const signer = library.getSigner();
        if (selectedTrackIndex === 0) {
          if (
            !isSongMode.current &&
            ["bass", "drums"].includes(stemPlayerName.current) &&
            [0, 7].includes(sectionIndex)
          ) {
            alert("This NFT is not open for sale at the moment");
            return;
          }
          const nftAddress = process.env.REACT_APP_YATTA as string;
          const contract = new ethers.Contract(nftAddress, NftAbi, signer);
          // TODO
          if (isSongMode.current) {
            const parentTokenId = 37;
            // const _price = stemSectionPrices[parentTokenId][sectionIndex];
            const tokenId = parentTokenId + sectionIndex + 1;
            console.log(
              `Token ID: ${tokenId}, Parent Token ID: ${parentTokenId}`
            );
            const isSold = await contract.tokenExists(tokenId);
            if (isSold) {
              alert("This piece of music is already sold.");
              return;
            }
            const value = ethers.utils.parseEther(price.toString());
            const tx = await contract.mint(tokenId, parentTokenId, {
              value,
            });
            await tx.wait();
          } else {
            // Contract order: Bass, Chords, Pads, Percussion
            // Respective variables: bass, sound, drums, synth
            const stemIndex = ["bass", "sound", "drums", "synth"].indexOf(
              stemPlayerName.current
            );
            const parentTokenId = [1, 10, 19, 28][stemIndex] as
              | 1
              | 10
              | 19
              | 28;
            // const _price =
            //   stemSectionPrices[parentTokenId][sectionIndex] * conversionRate;
            const tokenId = parentTokenId + sectionIndex + 1;
            console.log(
              `Token ID: ${tokenId}, Parent Token ID: ${parentTokenId}, Price ${price}`
            );
            const tx = await contract.mint(tokenId, parentTokenId, {
              value: ethers.utils.parseEther(price.toString()),
            });
            await tx.wait();
          }
        } else {
          const tokenId = sectionIndex + 1;
          console.log(`Token ID: ${tokenId}`);
          const nftAddress = process.env.REACT_APP_NO_AIR as string;
          const contract = new ethers.Contract(nftAddress, YbNftAbi, signer);
          const isSold = await contract.tokenExists(tokenId);
          if (isSold) {
            alert("This piece of music is already sold.");
            return;
          }
          const usdcContract = new ethers.Contract(
            process.env.REACT_APP_USDC as string,
            Erc20Abi,
            signer
          );
          const amount = price * 1_000_000;
          const approve = await usdcContract.approve(nftAddress, amount);
          await approve.wait();
          const tx = await contract.mint(tokenId, 0);
          const receipt = await tx.wait();
          console.log({ receipt });
        }
        alert(
          "You have successfully minted the token! Check the metamask transactions for more information."
        );
      } catch (e: any) {
        console.log(e);
        alert(e.data?.message || "Unable to process your tx at the moment.");
      }
    } else {
      alert("Please connect your wallet.");
    }
  };

  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        minHeight: "100vh",
        overflowX: "auto",
      }}
    >
      <Box
        sx={{
          background:
            "radial-gradient(circle at 5% 0%, #34167D 0%, rgba(0,0,0,0) 14.0777587890625%)",
        }}
        p={{ xs: 2, md: 4 }}
      >
        {/* <Box style={{ float: "right" }}>
        {account ? (
          <Tooltip title={account}>
            <Chip
              clickable
              label={`${account.slice(0, 6)}...${account.slice(
                account.length - 4
              )}`}
              style={{ marginLeft: "auto" }}
            />
          </Tooltip>
        ) : (
          <Button variant="contained" onClick={login}>
            Connect
          </Button>
        )}
      </Box> */}
        <Grid container p={{ xs: 2, md: 4 }} rowSpacing={4}>
          <Grid item xs={12} md={4}>
            <Box px={{ md: 2 }}>
              <Typography variant="h2">Mariana</Typography>
              <Typography variant="h2">Makwaia</Typography>
            </Box>
          </Grid>
          <Grid item md={5}></Grid>
          <Grid item xs={12} md={3}>
            <Box display="flex" justifyContent="space-around" width="100%">
              <Box sx={{ cursor: "pointer" }}>
                <Typography
                  sx={{
                    "&:hover": { color: "#998ABE" },
                    transition: "color 0.3s",
                  }}
                >
                  Instagram
                </Typography>
              </Box>
              <Box sx={{ cursor: "pointer" }}>
                <Typography
                  sx={{
                    "&:hover": { color: "#998ABE" },
                    transition: "color 0.3s",
                  }}
                >
                  Twitter
                </Typography>
              </Box>
              <Box sx={{ cursor: "pointer" }}>
                <Typography
                  sx={{
                    "&:hover": { color: "#998ABE" },
                    transition: "color 0.3s",
                  }}
                >
                  Youtube
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
        <Box mt={4}>
          <Typography variant="h3" align="center">
            Push Me Too Far
          </Typography>
        </Box>
        {/* {!isLoaded && (
        <Box display="flex" justifyContent="center" mt={2}>
          <Button
            onClick={() => start(0)}
            color="secondary"
          >
            Show me the track
          </Button>
        </Box>
      )} */}
        <Box mt={2} display="flex" justifyContent="center">
          <ButtonGroup
            variant="outlined"
            color="secondary"
            size="small"
            aria-label="outlined primary button group"
          >
            {isPlaying ? (
              <IconButton onClick={onPlayOrPause}>
                <PauseRoundedIcon color="info" />
              </IconButton>
            ) : (
              <IconButton onClick={onPlayOrPause}>
                <PlayArrowRoundedIcon color="primary" />
              </IconButton>
            )}
            <IconButton
              onClick={() => {
                if (sectionLocation.index === -1) {
                  const { left, width, index } =
                    transformPixelToSectionStartPixel({
                      offsetX: 0,
                      clientWidth: 1500,
                    });
                  setSectionLocation({
                    left,
                    width,
                    index,
                  });
                }
                if (showSections) {
                  toggleSongOrStemMode();
                }
                setShowSections(!showSections);
              }}
            >
              {!showSections ? (
                <CalendarViewDayRoundedIcon color="primary" />
              ) : (
                <HorizontalRuleRoundedIcon color="info" />
              )}
            </IconButton>
          </ButtonGroup>
        </Box>
        {isLoaded && (
          <Box mx={2} my={8} display={{ md: "flex" }} justifyContent="center">
            <div
              style={{
                position: "relative",
                // width: "100%",
                width: "1500px",
                // overflowX: "auto",
              }}
              onMouseMove={onMultiTrackHover}
            >
              <TonePlayerViz
                name="synth"
                onMounted={onMounted}
                tonePlayer={synthPlayer.current as Tone.Player}
                sectionLocation={sectionLocation}
                onPlayOrPause={onPlayOrPause}
                toggleSongOrStemMode={toggleSongOrStemMode}
                isSongModeState={isSongModeState}
                selectedStemPlayerName={selectedStemPlayerName}
                isPlaying={isPlaying}
                isLoopOn={isLoopOn}
                transportProgress={transportProgress}
                onMintNft={onMintNft}
                selectedTrackIndex={selectedTrackIndex}
                showSections={showSections}
              />
              <TonePlayerViz
                name="sound"
                onMounted={onMounted}
                tonePlayer={soundPlayer.current as Tone.Player}
                sectionLocation={sectionLocation}
                onPlayOrPause={onPlayOrPause}
                toggleSongOrStemMode={toggleSongOrStemMode}
                isSongModeState={isSongModeState}
                selectedStemPlayerName={selectedStemPlayerName}
                isPlaying={isPlaying}
                isLoopOn={isLoopOn}
                transportProgress={transportProgress}
                onMintNft={onMintNft}
                selectedTrackIndex={selectedTrackIndex}
                showSections={showSections}
              />
              <TonePlayerViz
                name="bass"
                onMounted={onMounted}
                tonePlayer={bassPlayer.current as Tone.Player}
                sectionLocation={sectionLocation}
                onPlayOrPause={onPlayOrPause}
                toggleSongOrStemMode={toggleSongOrStemMode}
                isSongModeState={isSongModeState}
                selectedStemPlayerName={selectedStemPlayerName}
                isPlaying={isPlaying}
                isLoopOn={isLoopOn}
                transportProgress={transportProgress}
                onMintNft={onMintNft}
                selectedTrackIndex={selectedTrackIndex}
                showSections={showSections}
              />
              <TonePlayerViz
                name="drums"
                onMounted={onMounted}
                tonePlayer={drumsPlayer.current as Tone.Player}
                sectionLocation={sectionLocation}
                onPlayOrPause={onPlayOrPause}
                toggleSongOrStemMode={toggleSongOrStemMode}
                isSongModeState={isSongModeState}
                selectedStemPlayerName={selectedStemPlayerName}
                isPlaying={isPlaying}
                isLoopOn={isLoopOn}
                transportProgress={transportProgress}
                onMintNft={onMintNft}
                selectedTrackIndex={selectedTrackIndex}
                showSections={showSections}
              />
              {isSongModeState && (
                <TransportBar transportProgress={transportProgress} />
              )}
              {showSections &&
                isSongModeState &&
                sectionLocation.left !== -1 && (
                  <CanvasSectionBox
                    sectionLocation={sectionLocation}
                    onPlayOrPause={onPlayOrPause}
                    toggleSongOrStemMode={toggleSongOrStemMode}
                    isPlaying={isPlaying}
                    isLoopOn={isLoopOn}
                    isSongModeState={isSongModeState}
                    onMintNft={onMintNft}
                    selectedTrackIndex={selectedTrackIndex}
                    selectedStemPlayerName={selectedStemPlayerName}
                  />
                )}
            </div>
          </Box>
        )}
        {selectedTrackIndex !== -1 && isLoaded === false && (
          <Box display="flex" justifyContent="center" mt={8}>
            <CircularProgress></CircularProgress>
          </Box>
        )}
        <Box>
          <Typography variant="caption">
            © 2023 by Mariana Makwaia. Powered and secured by nusic.fm
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
// TODO:
//   USDC: 0xE3F5a90F9cb311505cd691a46596599aA1A0AD7D
//   Not allow sold tokens in UI
