import { Box } from "@mui/material";
import { useEffect, useRef } from "react";
import * as Tone from "tone";
import { Section, sectionsWithOffset } from "../../MarketPlace";

const scaleValue = (
  v: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
) => {
  return ((v - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin;
};

const colors = ["#221AE1", "#B52FD8", "#7074DE", "#5425CC", "#8927E2"];

const TonePlayerViz = (props: {
  onMounted: (width: number) => void;
  tonePlayer: Tone.Player;
  name: string;
}) => {
  const { onMounted, tonePlayer, name } = props;
  const audioWaveformCanvas = useRef<HTMLCanvasElement>(null);

  const computeRMS = (
    buffer: Tone.ToneAudioBuffer,
    width: number
  ): number[] => {
    // if (this._waveform && this._waveform.length === width) {
    //   return;
    // }
    const array = buffer.toArray(0) as Float32Array;
    const length = 64;
    const rmses = [];
    for (let i = 0; i < width; i++) {
      const offsetStart = Math.floor(
        scaleValue(i, 0, width, 0, array.length - length)
      );
      const offsetEnd = offsetStart + length;
      let sum = 0;
      for (let s = offsetStart; s < offsetEnd; s++) {
        sum += Math.pow(array[s], 2);
      }
      const rms = Math.sqrt(sum / length);
      rmses[i] = rms;
    }
    const max = Math.max(...rmses);
    return rmses.map((v) => scaleValue(Math.pow(v, 0.8), 0, max, 0, 1));
  };
  const visualize = (tone: Tone.Player) => {
    if (tone.loaded) {
      const buffer = tone.buffer;
      const canvas = audioWaveformCanvas.current as HTMLCanvasElement;
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      const { width, height } = canvas;
      const context = canvas.getContext("2d") as CanvasRenderingContext2D;
      context.clearRect(0, 0, width, height);
      const waveform = computeRMS(buffer, width);
      context.fillStyle = "white";
      waveform?.forEach((val: number, i: number) => {
        const barHeight = val * height;
        const x = tone.reverse ? width - i : i;
        const offsetStart = scaleValue(
          i,
          0,
          waveform?.length ?? 0,
          0,
          buffer.duration
        );
        const index = (sectionsWithOffset as Section[]).findIndex(
          ({ sectionStartBeatInSeconds, sectionEndBeatInSeconds }) =>
            sectionStartBeatInSeconds < offsetStart &&
            sectionEndBeatInSeconds > offsetStart
        );
        const section = (sectionsWithOffset as Section[])[index];
        if (!section) {
          context.fillStyle = "#553B96";
        } else {
          const hue =
            (section.sectionStartBeatInSeconds / buffer.duration) * 360;
          context.fillStyle = colors[index];
        }
        const y = height / 2 - barHeight / 2;
        // TODO:
        context.fillRect(x, y, 1, barHeight);
        context.fill();

        // context.beginPath();
        // context.moveTo(x, y);
        // // top left edge
        // context.lineTo(x - width / 2, y + height / 2);

        // // bottom left edge
        // context.lineTo(x, y + height);

        // // bottom right edge
        // context.lineTo(x + width / 2, y + height / 2);

        // // closing the path automatically creates
        // // the top right edge
        // context.closePath();

        // // context.fillStyle = "red";
        // context.fill();
      });
    }
  };

  useEffect(() => {
    if (tonePlayer) {
      visualize(tonePlayer);
      onMounted(audioWaveformCanvas.current?.clientWidth ?? 1);
    }
  }, []);

  return (
    <Box width="100%" height="100%">
      <canvas
        style={{ width: "100%", height: "100%" }}
        ref={audioWaveformCanvas}
        data-player={name}
      />
    </Box>
  );
};

export default TonePlayerViz;
