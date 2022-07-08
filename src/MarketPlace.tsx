// import { TreeItem, TreeView } from "@mui/lab";
import { Button, Chip, Tooltip, Typography } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
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

export interface Section {
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

export const sectionsWithOffset = [
  { sectionStartBeatInSeconds: 0, sectionEndBeatInSeconds: 20 },
  { sectionStartBeatInSeconds: 20, sectionEndBeatInSeconds: 40 },
  { sectionStartBeatInSeconds: 40, sectionEndBeatInSeconds: 60 },
  { sectionStartBeatInSeconds: 60, sectionEndBeatInSeconds: 90 },
  { sectionStartBeatInSeconds: 90, sectionEndBeatInSeconds: 120 },
  { sectionStartBeatInSeconds: 120, sectionEndBeatInSeconds: 160 },
  { sectionStartBeatInSeconds: 160, sectionEndBeatInSeconds: 180 },
  { sectionStartBeatInSeconds: 180, sectionEndBeatInSeconds: 190 },
  { sectionStartBeatInSeconds: 190, sectionEndBeatInSeconds: 220 },
  { sectionStartBeatInSeconds: 220, sectionEndBeatInSeconds: 243 },
] as Section[];

export const MarketPlace = () => {
  const { login } = useAuth();
  const { account } = useWeb3React();

  const tonePlayers = useRef<Tone.Players | null>(null);
  const bassPlayer = useRef<Tone.Player | null>(null);
  const drumsPlayer = useRef<Tone.Player | null>(null);
  const soundPlayer = useRef<Tone.Player | null>(null);
  const synthPlayer = useRef<Tone.Player | null>(null);

  const [isLoaded, setIsLoaded] = useState(false);

  const selectedSectionIndex = useRef<number>(-1);
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

  useEffect(() => {
    // const audioBuffers = {}
  }, []);
  const [sectionLocation, setSectionLocation] = useState<{
    left: number;
    width: number;
  }>({ left: -1, width: 0 });

  const setupTransportTimeline = async () => {
    // const song = songModel.value
    // if (song == null) {
    //   return
    // }
    await Tone.start();
    Tone.Transport.bpm.value = 150;
    // eslint-disable-next-line no-console
    console.log("🥁 Tone started");
    // Tone.Transport.start();
    Tone.Transport.cancel(0);

    const startBeatOffset = 1;
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

  const start = async () => {
    // https://storage.googleapis.com/nusic-mashup-content/Yatta/bass.mp3
    // https://storage.googleapis.com/nusic-mashup-content/Yatta/drums.mp3
    // https://storage.googleapis.com/nusic-mashup-content/Yatta/sound.mp3
    // https://storage.googleapis.com/nusic-mashup-content/Yatta/synth.mp3
    // https://storage.googleapis.com/nusic-mashup-content/Yatta/audio.wav

    const stemPlayers = {
      bass: "https://storage.googleapis.com/nusic-mashup-content/Yatta/bass.mp3",
      drums:
        "https://storage.googleapis.com/nusic-mashup-content/Yatta/drums.mp3",
      sound:
        "https://storage.googleapis.com/nusic-mashup-content/Yatta/sound.mp3",
      synth:
        "https://storage.googleapis.com/nusic-mashup-content/Yatta/synth.mp3",
    };
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
      drumsPlayer.current = players.player("drums").toDestination().sync();
      soundPlayer.current = players.player("sound").toDestination().sync();
      synthPlayer.current = players.player("synth").toDestination().sync();
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
  ): SectionCoordinate => {
    const offsetX = coordinate.offsetX;
    const clientWidth = coordinate.clientWidth;
    const songDurationInSeconds = bassPlayer.current?.buffer.duration ?? 1;
    const clickTransportPositionInSeconds =
      (offsetX / clientWidth) * songDurationInSeconds;

    const sectionIndex = sectionsWithOffset.findIndex(
      ({ sectionStartBeatInSeconds, sectionEndBeatInSeconds }) => {
        return (
          clickTransportPositionInSeconds > sectionStartBeatInSeconds &&
          clickTransportPositionInSeconds < sectionEndBeatInSeconds
        );
      }
    );
    selectedSectionIndex.current = sectionIndex === -1 ? 0 : sectionIndex;
    const { sectionStartBeatInSeconds, sectionEndBeatInSeconds } =
      sectionsWithOffset[selectedSectionIndex.current];

    return transformCoordinateSecondsIntoPixels(
      sectionStartBeatInSeconds,
      sectionEndBeatInSeconds
    );
  };
  const setMutes = () => {
    ["synth", "sound", "bass", "drums"].map((section) => {
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
  };
  const changeSectionAndTone = (
    event: any,
    stemName: string,
    calculatedOffsetLeft: number
  ) => {
    const previousSectionIndex = selectedSectionIndex.current;
    setMutes();
    if (tonePlayers.current) tonePlayers.current.mute = false;

    const sectionCoordinate = transformPixelToSectionStartPixel({
      offsetX: calculatedOffsetLeft,
      clientWidth: event.currentTarget.clientWidth,
    });
    setSectionLocation({
      left: sectionCoordinate.left,
      width: sectionCoordinate.right - sectionCoordinate.left,
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
        sectionsWithOffset[
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
                fullTrackRecords (first: 5) {
                  nodes {
                      id
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
    setSongMetadata(raveCodeRecord);
  };

  useEffect(() => {
    fetchFulltracks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box style={{ backgroundColor: "black", minHeight: "100vh" }} p={4}>
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
      <Typography variant="h4">NUSIC Marketplace</Typography>
      <Box
        style={{ backgroundColor: "#2E2E44", borderRadius: "6px" }}
        mt={4}
        p={2}
      >
        <Typography variant="h5" align="center">
          Track Explorer
        </Typography>
        <Box m={2} display="flex" justifyContent="center">
          <Box
            style={{
              backgroundColor: "rgba(196,196,196,13%",
              borderRadius: "6px",
              minWidth: "80%",
            }}
            p={2}
            display="flex"
            alignItems="center"
            justifyContent="space-around"
          >
            <Box>
              {/* <Button onClick={start} variant="contained">
                Load Audio
              </Button> */}
              <Typography variant="h6" fontWeight={"bold"} align="center">
                {songMetadata?.albumName}
              </Typography>
              <Typography variant="body2" align="center">
                By
              </Typography>
              <Typography variant="h6" fontWeight={"bold"} align="center">
                {songMetadata?.artistName}
              </Typography>
            </Box>
            <Box>
              <Box>
                <Typography>Genre: {songMetadata?.genre}</Typography>
                <Typography>Bpm: {songMetadata?.bpm}</Typography>
                <Typography>Key: {songMetadata?.key}</Typography>
                <Box mt={2}>
                  <Button onClick={start} variant="contained" size="small">
                    Load Track
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      {isLoaded && (
        <div
          style={{
            position: "relative",
            marginTop: "30px",
            margin: "40px",
            marginLeft: "160px",
            marginRight: "160px",
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
            />
          )}
        </div>
      )}
    </Box>
  );
};
// TODO:
//   Fetch data and create sections class
//   Mint NFTs
//
//
