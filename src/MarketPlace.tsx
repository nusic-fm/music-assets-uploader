import { TreeItem, TreeView } from "@mui/lab";
import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useState } from "react";
import { NftItem } from "./components/NftItem";
import { getBinaryTree } from "./utils/binaryTreeGenerator";
import * as Tone from "tone";
import { useEffect, useRef } from "react";
import CanvasSectionBox from "./components/CanvasSectionBox";
import TonePlayerViz from "./components/TonePlayerViz";

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
  { sectionStartBeatInSeconds: 1, sectionEndBeatInSeconds: 20 },
  { sectionStartBeatInSeconds: 20, sectionEndBeatInSeconds: 40 },
  { sectionStartBeatInSeconds: 40, sectionEndBeatInSeconds: 60 },
  { sectionStartBeatInSeconds: 60, sectionEndBeatInSeconds: 90 },
  { sectionStartBeatInSeconds: 90, sectionEndBeatInSeconds: 120 },
] as Section[];

export const MarketPlace = () => {
  const tonePlayers = useRef<Tone.Players | null>(null);
  const bassPlayer = useRef<Tone.Player | null>(null);
  const drumsPlayer = useRef<Tone.Player | null>(null);
  const soundPlayer = useRef<Tone.Player | null>(null);
  const synthPlayer = useRef<Tone.Player | null>(null);

  const [isLoaded, setIsLoaded] = useState(false);

  const selectedSectionIndex = useRef<number>(-1);
  const stemPlayerName = useRef<string>("");
  const [clientWidth, setClientWidth] = useState<number>(0);
  const isSongMode = useRef<boolean>(true);

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
  const [sectionLocation, setSectionLocation] = useState({ left: 0, width: 0 });

  const setupTransportTimeline = async () => {
    // const song = songModel.value
    // if (song == null) {
    //   return
    // }
    await Tone.start();
    Tone.Transport.bpm.value = 89.9;
    // eslint-disable-next-line no-console
    console.log("🥁 Tone started");
    // Tone.Transport.start();
    Tone.Transport.cancel(0);

    const startBeatOffset = 2000 / 1000;
    bassPlayer.current?.start(0, startBeatOffset);
    drumsPlayer.current?.start(0, startBeatOffset);
    soundPlayer.current?.start(0, startBeatOffset);
    synthPlayer.current?.start(0, startBeatOffset);

    // this.metronomeLoop = new Tone.Loop((time) => {
    //   this.metronome.start(time)
    //   // TODO: Support time signatures other than 4/4
    // }, '4n').start(0)
    //TODO
    // new Tone.Loop(() => {
    //   if (
    //     Tone.Transport.seconds.toFixed(0) === transport.duration.value.toFixed(0)
    //   ) {
    //     Tone.Transport.stop()
    //   }
    //   transport.position.value = Tone.Transport.position
    //   transport.seconds.value = Tone.Transport.seconds
    //   transport.progress.value = Tone.Transport.seconds / transport.duration.value
    // }, '16n').start(0)
  };

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
      const { left, right } = transformCoordinateSecondsIntoPixels(
        sectionsWithOffset[0].sectionStartBeatInSeconds,
        sectionsWithOffset[0].sectionEndBeatInSeconds
      );
      setSectionLocation({ left, width: right - left });
      setIsLoaded(true);
    });
    tonePlayers.current = players;
    // player.autostart = true;
  };
  const toggleTransport = () => {
    if (Tone.Transport.state !== "started") {
      console.log("started");
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
    });
  };
  const changeSectionAndTone = (
    event: any,
    stemName: string,
    calculatedOffsetLeft: number
  ) => {
    const previousSectionIndex = selectedSectionIndex.current;
    stemPlayerName.current = stemName;
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
    // if (this.toneChangetimer !== null) {
    //   clearTimeout(this.toneChangetimer)
    // }
    const currentBeat = parseInt(
      Tone.Transport.position.toString().split(":")[1]
    );
    const delayTime = ((4 - currentBeat) / 4) * (60 / Tone.Transport.bpm.value);
    // this.toneChangetimer = setTimeout(() => {
    //   Tone.Transport.seconds = this.sectionsWithOffset[
    //     this.selectedSectionIndex
    //   ].sectionStartBeatInSeconds
    // }, delayTime * 1000)
    setTimeout(() => {
      Tone.Transport.seconds =
        sectionsWithOffset[
          selectedSectionIndex.current
        ].sectionStartBeatInSeconds;
    }, delayTime * 1000);
    // console.log("Transport Seconds: ", Tone.Transport.seconds);
  };

  const onMultiTrackHover = (event: React.MouseEvent) => {
    const { left, top } = (
      event.currentTarget as HTMLElement
    ).getBoundingClientRect();
    const calculatedOffsetLeft = event.clientX - left;
    const calculatedOffsetTop = event.clientY - top;
    const cursorToTooltipDifferenceX = 20;
    const playerWidth = event.currentTarget.clientWidth;
    const isTooltipXOutOfPlayer = calculatedOffsetLeft > playerWidth - 150;
    const adjustedLeft = isTooltipXOutOfPlayer
      ? playerWidth - 132
      : calculatedOffsetLeft + cursorToTooltipDifferenceX;

    const cursorToTooltipDifferenceY = 120;
    const isTooltipYOutOfPlayer =
      calculatedOffsetTop < cursorToTooltipDifferenceY;
    const adjustedTop = isTooltipYOutOfPlayer
      ? 0
      : calculatedOffsetTop - cursorToTooltipDifferenceY;

    // TODO:
    // this.waveFormTooltip.position.left = adjustedLeft;
    // this.waveFormTooltip.position.top = adjustedTop;
    if ((event.target as HTMLElement).tagName === "CANVAS") {
      const stemName = (event.target as HTMLElement).getAttribute(
        "data-player"
      ) as string;
      changeSectionAndTone(event, stemName, calculatedOffsetLeft);
    }
  };
  const onPlayOrPause = () => {
    toggleTransport();
  };
  const toggleSongOrStemMode = () => {
    isSongMode.current = !isSongMode.current;
    setMutes();
  };
  return (
    <Box style={{ backgroundColor: "black", minHeight: "100vh" }} p={4}>
      <Typography variant="h4">NUSIC Marketplace</Typography>
      <button onClick={start}>start</button>
      {isLoaded && (
        <div
          style={{ position: "relative", marginTop: "30px" }}
          onMouseMove={onMultiTrackHover}
        >
          <TonePlayerViz
            name="synth"
            onMounted={onMounted}
            tonePlayer={synthPlayer.current as Tone.Player}
          />
          <TonePlayerViz
            name="sound"
            onMounted={onMounted}
            tonePlayer={soundPlayer.current as Tone.Player}
          />
          <TonePlayerViz
            name="bass"
            onMounted={onMounted}
            tonePlayer={bassPlayer.current as Tone.Player}
          />
          <TonePlayerViz
            name="drums"
            onMounted={onMounted}
            tonePlayer={drumsPlayer.current as Tone.Player}
          />
          {/* <canvas
          style={{ width: "100%", height: "100%" }}
          ref={audioWaveformCanvas}
        /> */}
          <CanvasSectionBox
            sectionLocation={sectionLocation}
            onPlayOrPause={onPlayOrPause}
            toggleSongOrStemMode={toggleSongOrStemMode}
          />
        </div>
      )}
    </Box>
  );
};
// TODO:
//   ConvasSectionBox for sections
//   Mint NFTs
//   Waveform Customization
