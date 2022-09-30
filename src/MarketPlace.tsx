// import { TreeItem, TreeView } from "@mui/lab";
import {
  Button,
  Chip,
  CircularProgress,
  Grid,
  Tooltip,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useState } from "react";
// import { NftItem } from "./components/NftItem";
// import { getBinaryTree } from "./utils/binaryTreeGenerator";
import * as Tone from "tone";
import { useEffect, useRef } from "react";
import CanvasSectionBox from "./components/CanvasSectionBox";
import TonePlayerViz, { colors } from "./components/TonePlayerViz";
import TransportBar from "./components/TransportBar";
import useAuth from "./hooks/useAuth";
import { useWeb3React } from "@web3-react/core";
import BarChart from "./components/BarChart";
import { ethers } from "ethers";
import Erc20Abi from "./abis/Erc20.json";
import YbNftAbi from "./abis/AtomicMusicYBNFT.json";
import NftAbi from "./abis/AtomicMusicYBNFT.json";

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
  1: [
    {
      sectionStartBeatInSeconds: 0,
      sectionEndBeatInSeconds: 18,
      name: "Intro",
    },
    {
      sectionStartBeatInSeconds: 18,
      sectionEndBeatInSeconds: 42,
      name: "Verse",
    },
    {
      sectionStartBeatInSeconds: 42,
      sectionEndBeatInSeconds: 54,
      name: "Pre-Chorus",
    },
    {
      sectionStartBeatInSeconds: 54,
      sectionEndBeatInSeconds: 79,
      name: "Chorus",
    },
    {
      sectionStartBeatInSeconds: 79,
      sectionEndBeatInSeconds: 90,
      name: "Post-Chorus",
    },
    {
      sectionStartBeatInSeconds: 90,
      sectionEndBeatInSeconds: 114,
      name: "Verse",
    },
    {
      sectionStartBeatInSeconds: 114,
      sectionEndBeatInSeconds: 126,
      name: "Pre-Chorus",
    },
    {
      sectionStartBeatInSeconds: 126,
      sectionEndBeatInSeconds: 150,
      name: "Chorus",
    },
    {
      sectionStartBeatInSeconds: 150,
      sectionEndBeatInSeconds: 162,
      name: "Post-Chorus",
    },
    {
      sectionStartBeatInSeconds: 162,
      sectionEndBeatInSeconds: 186,
      name: "Bridge",
    },
    {
      sectionStartBeatInSeconds: 186,
      sectionEndBeatInSeconds: 210,
      name: "Chorus",
    },
    {
      sectionStartBeatInSeconds: 210,
      sectionEndBeatInSeconds: 222,
      name: "Pre-Chorus",
    },
    {
      sectionStartBeatInSeconds: 222,
      sectionEndBeatInSeconds: 246,
      name: "Chorus",
    },
    {
      sectionStartBeatInSeconds: 246,
      sectionEndBeatInSeconds: 267,
      name: "Hook",
    },
  ] as Section[],
};

const noAir = {
  artistName: "Steven Russell ASCAP Royalties (US Market)",
  trackTitle: "No Air - Jordin Sparks, Chris Brown",

  albumName: "-",

  genre: "Pop",

  bpm: 160,

  key: "A♭ minor",

  timeSignature: "4/4",
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

export const tempStemSectionPrices = {
  1: [0.4, 0.25, 0.04, 0.05, 0.06, 0.07, 0.08, 0.09], //BASS
  10: [0.02, 0.03, 0.04, 0.05, 0.06, 0.07, 0.08, 0.09], //CHORDS
  19: [0.02, 0.03, 0.04, 0.05, 0.06, 0.07, 0.08, 0.09], //PADS
  28: [0.02, 0.03, 0.04, 0.05, 0.06, 0.07, 0.08, 0.09], //PERCUSSION
  37: [0.02, 0.03, 0.04, 0.05, 0.06, 0.07, 0.08, 0.09], //FULLTRACK
} as { 1: number[]; 10: number[]; 19: number[]; 28: number[]; 37: number[] };

export const noAirPrices = [
  247.81, 330.42, 165.21, 344.18, 151.44, 330.42, 165.21, 330.42, 165.21,
  330.42, 330.42, 165.21, 330.42, 289.11,
];

export const MarketPlace = () => {
  const { login } = useAuth();
  const { account, library } = useWeb3React();

  const tonePlayers = useRef<Tone.Players | null>(null);
  const bassPlayer = useRef<Tone.Player | null>(null);
  const drumsPlayer = useRef<Tone.Player | null>(null);
  const soundPlayer = useRef<Tone.Player | null>(null);
  const synthPlayer = useRef<Tone.Player | null>(null);

  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedTrackIndex, setSelectedTrackIndex] = useState(-1);

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
  const [songMetadata, setSongMetadata] = useState<any>(null);

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

  // useEffect(() => {
  //   login();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);
  const [sectionLocation, setSectionLocation] = useState<{
    left: number;
    width: number;
    index: number;
  }>({ left: -1, width: 0, index: -1 });

  const setupTransportTimeline = async () => {
    // const song = songModel.value
    // if (song == null) {
    //   return
    // }
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
    // this.metronomeLoop = new Tone.Loop((time) => {
    //   this.metronome.start(time)
    //   // TODO: Support time signatures other than 4/4
    // }, '4n').start(0)

    new Tone.Loop(() => {
      // if (
      //   Tone.Transport.seconds.toFixed(0) === transport.duration.value.toFixed(0)
      // ) {
      //   Tone.Transport.stop()
      // }
      // transport.position.value = Tone.Transport.position
      // transport.seconds.value = Tone.Transport.seconds
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
    // https://storage.googleapis.com/nusic-mashup-content/Yatta/bass.mp3
    // https://storage.googleapis.com/nusic-mashup-content/Yatta/drums.mp3
    // https://storage.googleapis.com/nusic-mashup-content/Yatta/sound.mp3
    // https://storage.googleapis.com/nusic-mashup-content/Yatta/synth.mp3
    // https://storage.googleapis.com/nusic-mashup-content/Yatta/audio.wav
    setSelectedTrackIndex(trackIndex);
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

    // const stemPlayers = {
    //   bass: "https://storage.googleapis.com/nusic-mashup-content/-G-yZUZFIGY/4stems/-G-yZUZFIGY-bass.mp3",
    //   drums:
    //     "https://storage.googleapis.com/nusic-mashup-content/-G-yZUZFIGY/4stems/-G-yZUZFIGY-drums.mp3",
    //   sound:
    //     "https://storage.googleapis.com/nusic-mashup-content/-G-yZUZFIGY/4stems/-G-yZUZFIGY-melody.mp3",
    //   synth:
    //     "https://storage.googleapis.com/nusic-mashup-content/-G-yZUZFIGY/4stems/-G-yZUZFIGY-vocals.mp3",
    // };

    // const stemsAudioBuffer = await new Promise(async (res) => {
    //   const stemRes = await Promise.all(
    //     Object.keys(stemPlayers).map(async (stem: string) => {
    //       const audioBuffer = await new Promise((res) => {
    //         const url =
    //           stemPlayers[stem as "bass" | "drums" | "sound" | "synth"];
    //         const player = new Tone.Player(url, () => {
    //           res(player.buffer.get());
    //         });
    //       });
    //       return { [stem]: audioBuffer };
    //     })
    //   );
    //   return res(stemRes);
    // });
    const players = new Tone.Players(stemPlayers as any, () => {
      bassPlayer.current = players.player("bass").toDestination().sync();
      if (trackIndex === 0) {
        drumsPlayer.current = players.player("drums").toDestination().sync();
        soundPlayer.current = players.player("sound").toDestination().sync();
        synthPlayer.current = players.player("synth").toDestination().sync();
      }
      setupTransportTimeline();
      // const { left, right } = transformCoordinateSecondsIntoPixels(
      //   sectionsWithOffset[0].sectionStartBeatInSeconds,
      //   sectionsWithOffset[0].sectionEndBeatInSeconds
      // );
      // setSectionLocation({ left, width: right - left });
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
    // this.sectionCoordinate = sectionCoordinate
    // this.toneService.transport.progress.value = sectionCoordinate.left
    if (previousSectionIndex === selectedSectionIndex.current) {
      return;
    }
    //  Forward the loop state to new sections
    // if (Tone.Transport.loop) {
    //   const { sectionStartBeatInSeconds, sectionEndBeatInSeconds } = this
    //     .currentSection as Section
    //   this.toneService.setLoopStartAndEnd(
    //     sectionStartBeatInSeconds,
    //     sectionEndBeatInSeconds
    //   )
    // }
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
    const { left } = (
      event.currentTarget as HTMLElement
    ).getBoundingClientRect();
    const calculatedOffsetLeft = event.clientX - left;
    // const calculatedOffsetTop = event.clientY - top;
    // const cursorToTooltipDifferenceX = 20;
    // const playerWidth = event.currentTarget.clientWidth;
    // const isTooltipXOutOfPlayer = calculatedOffsetLeft > playerWidth - 150;
    // const adjustedLeft = isTooltipXOutOfPlayer
    //   ? playerWidth - 132
    //   : calculatedOffsetLeft + cursorToTooltipDifferenceX;

    // const cursorToTooltipDifferenceY = 120;
    // const isTooltipYOutOfPlayer =
    //   calculatedOffsetTop < cursorToTooltipDifferenceY;
    // const adjustedTop = isTooltipYOutOfPlayer
    //   ? 0
    //   : calculatedOffsetTop - cursorToTooltipDifferenceY;

    // TODO:
    // this.waveFormTooltip.position.left = adjustedLeft;
    // this.waveFormTooltip.position.top = adjustedTop;
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
  const onPlayOrPause = () => {
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
  const fetchFulltracks = async () => {
    const graphqlQuery = {
      query: `query {
                fullTrackRecords (last: 2) {
                  nodes {
                    musicId
                    cid
                    artistName
                    trackTitle
                    albumName
                    genre
                    bpm
                    key
                    timeSignature
                    bars
                    beats
                    duration
                    startBeatOffsetMs
                    sectionsCount
                    stemsCount
                  }
              }
                sectionRecords (last: 30) {
                    nodes {
                      musicId
                      name
                      startTimeMs
                    }
                }
                stemRecords (last: 4) {
                      nodes {
                        musicId
                        cid
                        name
                        type
                      }
                  }
                }`,
      variables: {},
    };
    // sectionRecords (first: 5) {
    //   nodes {
    //     id
    //     musicId
    //   }
    // }
    const fullTracks = await axios.post(
      "https://api.subquery.network/sq/logesh2496/nusic-metadata-layer",
      graphqlQuery
    );
    const raveCodeRecord = fullTracks.data.data.fullTrackRecords.nodes[0];
    console.log({ raveCodeRecord });
    setSongMetadata(raveCode);
  };

  useEffect(() => {
    if (selectedTrackIndex === 0) fetchFulltracks();
    else setSongMetadata(noAir);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTrackIndex]);

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

  const onSectionChipSelection = (sectionIndex: number): void => {
    selectedSectionIndex.current = sectionIndex;
    // setSelectedSectionIndexState(selectedSectionIndex.current);
    const { sectionStartBeatInSeconds, sectionEndBeatInSeconds } =
      sectionsWithOffset[selectedTrackIndex as 0 | 1][
        selectedSectionIndex.current
      ];
    //  Playing only in song mode
    // this.songOrStemMode = 0
    setMutes();
    const currentBeat = parseInt(
      Tone.Transport.position.toString().split(":")[1]
    );
    const delayTime = ((4 - currentBeat) / 4) * (60 / Tone.Transport.bpm.value);
    setTimeout(() => {
      //  Delay included for hover section box as well
      const { left, right } = transformCoordinateSecondsIntoPixels(
        sectionStartBeatInSeconds,
        sectionEndBeatInSeconds
      );
      setSectionLocation({ left, width: right - left, index: sectionIndex });
      Tone.Transport.seconds = sectionStartBeatInSeconds;
      if (isPlaying === false) {
        toggleTransport();
      }
    }, delayTime * 1000);
  };

  //No Air - Jording Sparks, Chris Brown
  return (
    <Box sx={{ bgcolor: "background.paper", minHeight: "100vh" }} p={4}>
      <Box style={{ float: "right" }}>
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
      </Box>
      <Box
        style={{ cursor: "pointer" }}
        position="relative"
        onClick={() => {
          window.location.reload();
        }}
        display="flex"
        alignItems="center"
      >
        <Typography variant="h4">NUSIC Marketplace</Typography>
        <Box ml={2}>
          <Chip label="BETA" size="small" sx={{ paddingX: "15px" }} />
        </Box>
      </Box>
      <Box
        style={{ backgroundColor: "#2E2E44", borderRadius: "6px" }}
        mt={4}
        p={2}
      >
        <Typography variant="h5" align="center">
          Track Explorer
        </Typography>
        <Typography
          variant="body2"
          align="center"
          visibility={selectedTrackIndex === -1 ? "visible" : "hidden"}
        >
          Select a track
        </Typography>
        <Box m={2} display="flex" justifyContent="center">
          <Box
            style={{
              backgroundColor: "rgba(196,196,196,13%",
              borderRadius: "6px",
              minWidth: "80%",
            }}
          >
            {!isLoaded ? (
              <Box
                p={2}
                ml={4}
                display="flex"
                alignItems="center"
                // justifyContent="space-around"
                gap={6}
              >
                <Box>
                  {/* <Typography variant="h6" fontWeight={"bold"} align="center">
                    {songMetadata?.albumName}
                  </Typography>
                  <Typography variant="body2" align="center">
                    By
                  </Typography>
                  <Typography variant="h6" fontWeight={"bold"} align="center">
                    {songMetadata?.artistName}
                  </Typography> */}

                  <Box
                    onClick={() => {
                      start(0);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <img
                      src="/pagoda.jpg"
                      alt="no-air"
                      width="185px"
                      height="185px"
                      style={{ borderRadius: "15px", objectFit: "cover" }}
                    ></img>
                    <Typography align="center">YATTA</Typography>
                  </Box>
                  {/* <Box mt={2} display="flex" justifyContent="center">
                    <Button
                      onClick={() => {
                        start(0);
                      }}
                      variant="contained"
                      size="small"
                    >
                      Load Track
                    </Button>
                  </Box> */}
                </Box>
                <Box>
                  {/* <Typography variant="h6" fontWeight={"bold"} align="center">
                    No Air
                  </Typography>
                  <Typography variant="body2" align="center">
                    By
                  </Typography>
                  <Typography variant="h6" fontWeight={"bold"} align="center">
                    Andrew
                  </Typography> */}
                  <Box
                    onClick={() => {
                      start(1);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <img
                      src="/no-air.png"
                      alt="no-air"
                      width="185px"
                      height="185px"
                      style={{ borderRadius: "15px", objectFit: "cover" }}
                    ></img>
                    <Typography align="center">No Air</Typography>
                  </Box>
                  {/* <Box mt={2}>
                    <Button
                      onClick={() => {
                        start(1);
                      }}
                      variant="contained"
                      size="small"
                    >
                      Load Track
                    </Button>
                  </Box> */}
                </Box>
                <Box position="relative">
                  <img
                    src="/howie-B.webp"
                    alt="no-air"
                    width="185px"
                    height="185px"
                    style={{ borderRadius: "15px", objectFit: "cover" }}
                  ></img>
                  <Typography align="center">Howie B</Typography>
                  <Box
                    position="absolute"
                    style={{ background: "rgba(0,0,0,0)" }}
                    top={-10}
                    left={-20}
                    // right={-100}
                    width="185px"
                    height="185px"
                    // display="flex"
                    // alignItems="center"
                    // justifyContent="flex-end"
                    borderRadius="15px"
                  >
                    <Chip
                      label="Upcoming"
                      variant="filled"
                      color="warning"
                      size="small"
                    ></Chip>
                  </Box>
                </Box>
              </Box>
            ) : (
              <Box p={4} display="flex" alignItems="flex-start">
                <Box>
                  <img
                    src={
                      selectedTrackIndex === 0 ? "/pagoda.jpg" : "/no-air.png"
                    }
                    alt="no-air"
                    width="185px"
                    height="185px"
                    style={{ borderRadius: "15px" }}
                  ></img>
                </Box>
                <Box ml={4}>
                  <Typography variant="h6" fontWeight="bold">
                    {songMetadata?.trackTitle}
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {songMetadata?.artistName}
                  </Typography>
                  <Box mt={2} width="200px">
                    <Grid container>
                      {selectedTrackIndex === 1 && (
                        <>
                          <Grid item xs={6}>
                            <Typography
                              align="right"
                              textTransform="capitalize"
                              fontSize="small"
                            >
                              Contract ID:
                            </Typography>
                          </Grid>
                          <Grid item xs={2}></Grid>
                          <Grid item xs={4}>
                            <Typography
                              align="left"
                              fontWeight="bold"
                              fontSize="small"
                            >
                              1514244
                            </Typography>
                          </Grid>
                        </>
                      )}
                      {["genre", "bpm", "key"].map((prop) => {
                        return (
                          <>
                            <Grid item xs={6}>
                              <Typography
                                align="right"
                                textTransform="capitalize"
                                fontSize="small"
                              >
                                {prop}:
                              </Typography>
                            </Grid>
                            <Grid item xs={2}></Grid>
                            <Grid item xs={4}>
                              <Typography
                                align="left"
                                fontWeight="bold"
                                fontSize="small"
                              >
                                {songMetadata && songMetadata[prop]}
                              </Typography>
                            </Grid>
                          </>
                        );
                      })}
                    </Grid>
                  </Box>
                  {selectedTrackIndex === 0 && (
                    <Box mt={2}>
                      <Grid container>
                        {/* <Grid item xs={4}>
                          <Typography
                            align="right"
                            textTransform="capitalize"
                            fontSize="small"
                          >
                            Description:
                          </Typography>
                        </Grid> */}
                        {/* <Grid item xs={2}></Grid> */}
                        <Grid item xs={12}>
                          <Typography
                            align="left"
                            fontWeight="bold"
                            fontSize="small"
                          >
                            In the 1990’s a mad scientist kidnapped a young
                            woman, connected her brain to a machine and
                            transferred her soul inside a 8 bit videogame. The
                            process turned her into a cyber geisha. Many years
                            later, the geisha’s soul managed to escape through
                            the internet and the blockchain eventually
                            re-emerging in the metaverse as a 3D avatar. As she
                            seeks to heal her soul and tell the story of her
                            long lost love, the geisha uses softwares and
                            virtual instruments to compose music. Her first
                            music album is a collection of short compositions
                            called HAIKU, where traditional Asian instruments
                            and electronic music are blended together into a
                            unique soundtrack.
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  )}
                </Box>
              </Box>
            )}
          </Box>
        </Box>
        {isLoaded && (
          <Box
            mt={2}
            display="flex"
            justifyContent="center"
            gap={2}
            alignItems="center"
          >
            {sectionsWithOffset[selectedTrackIndex as 0 | 1].map(
              ({ name }, i) => (
                <Chip
                  key={i}
                  label={name}
                  sx={{ bgcolor: colors[i] }}
                  clickable
                  onClick={() => onSectionChipSelection(i)}
                ></Chip>
              )
            )}
          </Box>
        )}
      </Box>
      {isLoaded && (
        <div
          style={{
            position: "relative",
            marginTop: "30px",
            margin: "40px",
            marginLeft: "160px",
            marginRight: "160px",
            backgroundColor: "black",
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
          />
          {isSongModeState && (
            <TransportBar transportProgress={transportProgress} />
          )}
          {isSongModeState && sectionLocation.left !== -1 && (
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
      )}
      {isLoaded && (
        <Box mt={5} display="flex" justifyContent="center">
          <Box width="70%">{selectedTrackIndex === 1 && <BarChart />}</Box>
        </Box>
      )}
      {selectedTrackIndex !== -1 && isLoaded === false && (
        <Box display="flex" justifyContent="center" mt={8}>
          <CircularProgress></CircularProgress>
        </Box>
      )}
    </Box>
  );
};
// TODO:
//   USDC: 0xE3F5a90F9cb311505cd691a46596599aA1A0AD7D
//   Not allow sold tokens in UI
