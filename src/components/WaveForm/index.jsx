/* eslint-disable react-hooks/exhaustive-deps */

import SpectrogramPlugin from "wavesurfer.js/dist/plugin/wavesurfer.spectrogram.min.js";
import TimelinePlugin from "wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js";
import RegionsPlugin from "wavesurfer.js/dist/plugin/wavesurfer.regions.min.js";
import MakersPlugin from "wavesurfer.js/dist/plugin/wavesurfer.markers.min.js";
import WaveSurfer from "wavesurfer.js";
import {
  Box,
  Button,
  Typography,
  Stack,
  Slider,
  Select,
  MenuItem,
  IconButton,
  Card,
  TextField,
} from "@mui/material";
import colormap from "colormap";
import { useEffect, useRef, useState } from "react";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import PlayCircleFilledWhiteOutlinedIcon from "@mui/icons-material/PlayCircleFilledWhiteOutlined";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const SectionNames = [
  "Intro",
  "Verse",
  "Pre-Chorus",
  "Chorus",
  "Bridge",
  "Outro",
];

const WaveForm = (props) => {
  const {
    url,
    durationOfEachBarInSec,
    noOfBars,
    startBeatOffsetMs,
    sections,
    setSections,
  } = props;
  const [isLoading, setIsLoading] = useState(true);
  const wavesurferIns = useRef(null);
  const [zoomValue, setZoomValue] = useState(1);
  const [bars, setBars] = useState({});

  useEffect(() => {
    if (noOfBars && durationOfEachBarInSec) {
      let start = startBeatOffsetMs / 1000;
      let end;
      const newBars = {};
      for (let i = 0; i < noOfBars; i++) {
        end = start + durationOfEachBarInSec;
        console.log({ start, end });
        // const hue = (360 * i) / noOfBars
        // wavesurferIns.current.addRegion({
        //   start,
        //   end,
        //   color: `hsla(${hue}, 50%, 70%, 0.4)`,
        //   resize: false
        // });
        const no = i + 1;
        wavesurferIns.current.addMarker({
          time: start,
          label: no,
          color: "#ff990a",
        });
        newBars[no] = { start, end };
        start = end;
      }
      setBars(newBars);
    }
  }, [durationOfEachBarInSec, noOfBars, startBeatOffsetMs]);

  const showWaveForm = () => {
    const colors = colormap({
      colormap: "hot",
      nshades: 256,
      format: "float",
    });
    var wavesurfer = WaveSurfer.create({
      scrollParent: true,
      fillParent: false,
      barGap: 50,
      container: "#waveform",
      backgroundColor: "white",
      waveColor: "#573FC8",
      cursorColor: "red",
      backend: "MediaElement",
      height: 200,
      // barHeight: 1.5,
      // barGap: 3,
      plugins: [
        TimelinePlugin.create({
          container: "#wave-timeline",
        }),
        RegionsPlugin.create({
          dragSelection: false,
        }),
        SpectrogramPlugin.create({
          container: "#wave-spectrogram",
          waveColor: "yellow",
          colorMap: colors,
        }),
        MakersPlugin.create(),
      ],
    });
    wavesurfer.on("ready", function () {
      setIsLoading(false);
      const list = wavesurferIns.current?.regions?.list;
      console.log({ list });
      // wavesurfer.backend()
    });
    // wavesurfer.on("region-created", function (region) {
    //   region.color = 'hsla(200, 50%, 70%, 0.4)'
    // })
    // wavesurfer.on("region-update-end", function () {
    //   // start, end, id,
    //   setSegments(Object.values(wavesurferIns.current.regions.list).map(region => ({internalId: region.id, start: region.start, end: region.end, })))
    //   // const updatedSegments = segments.map(segment => {
    //   //   if (segment.id === region.id) {
    //   //     return {}
    //   //   }
    //   //   return segment
    //   // })
    //   // setSegments()
    // })
    // wavesurfer.on("region-removed", function () {
    //   // start, end, id,
    //   setSegments(Object.values(wavesurferIns.current.regions.list).map(region => ({internalId: region.id, start: region.start, end: region.end, })))
    //   // const updatedSegments = segments.map(segment => {
    //   //   if (segment.id === region.id) {
    //   //     return {}
    //   //   }
    //   //   return segment
    //   // })
    //   // setSegments()
    // })
    wavesurfer.load(url);
    wavesurferIns.current = wavesurfer;
  };

  useEffect(() => {
    if (url) {
      showWaveForm();
    }
  }, [url]);

  const pauseOrPlay = () => {
    wavesurferIns.current.playPause();
  };

  const onZoom = (e) => {
    setZoomValue(Number(e.target.value));
    wavesurferIns.current.zoom(Number(e.target.value));
  };

  return (
    <Box mt={5}>
      <Typography variant="h6">Waveform Explorer</Typography>
      <Box mt={4}>
        {!isLoading && (
          <Button variant="contained" onClick={pauseOrPlay}>
            Play/Pause
          </Button>
        )}
      </Box>
      <Box mt={4}>
        <Box id="waveform" style={{ width: "100%" }}></Box>
        <Box id="wave-timeline"></Box>
      </Box>
      <Box display="flex" justifyContent="end">
        {url && (
          <Stack
            spacing={2}
            direction="row"
            sx={{ mb: 1 }}
            alignItems="center"
            width={300}
          >
            <RemoveIcon color="primary" />
            <Slider
              aria-label="Volume"
              value={zoomValue}
              onChange={onZoom}
              step={10}
              min={1}
              max={100}
            />
            <AddIcon color="primary" />
          </Stack>
        )}
      </Box>
      <Accordion
        expandIcon={<ExpandMoreIcon />}
        mt={4}
        width="100%"
        color="primary"
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Audio Fingerprint</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box mt={2} id="wave-spectrogram" width="100%"></Box>
        </AccordionDetails>
      </Accordion>
      {/* <Box mt={4} width="100%">
        <Typography variant="h6">Audio Fingerprint</Typography>
        <Box mt={2} id="wave-spectrogram" width="100%"></Box>
      </Box> */}
      <Box mt={2}>
        <Typography variant="h6">Sections Information</Typography>
        <Box mt={2}>
          <Box>
            <Typography>No of Sections</Typography>
            <TextField
              type="number"
              onChange={(e) => {
                const noOfSections = parseInt(e.target.value);
                if (noOfSections > sections.length) {
                  const newNoSections = noOfSections - sections.length;
                  const newSections = [...sections];
                  for (let i = 0; i < newNoSections; i++) {
                    newSections.push({
                      internalId: newSections + i,
                      name: SectionNames[i] || "",
                      start: 0,
                      end: 0,
                    });
                  }
                  setSections(newSections);
                }
              }}
            />
          </Box>
        </Box>
        <Box display="flex" gap={3} flexWrap="wrap" mt={2}>
          {sections.map((section, i) => (
            <Card>
              <Box p={2}>
                <Box mb={1}>
                  <Typography>Section Name</Typography>
                  <Select
                    size="small"
                    value={section.name}
                    onChange={(e) => {
                      const newSections = [...sections];
                      const idx = newSections.findIndex(
                        (sec) => sec.internalId === section.internalId
                      );
                      newSections[idx].name = e.target.value;
                      setSections(newSections);
                    }}
                  >
                    <MenuItem value={"Intro"}>Intro</MenuItem>
                    <MenuItem value={"Verse"}>Verse</MenuItem>
                    <MenuItem value={"Pre-Chorus"}>Pre-Chorus</MenuItem>
                    <MenuItem value={"Chorus"}>Chorus</MenuItem>
                    <MenuItem value={"Bridge"}>Bridge</MenuItem>
                    <MenuItem value={"Outro"}>Outro</MenuItem>
                  </Select>
                </Box>
                <Box>
                  <Typography>Measures</Typography>
                  <TextField
                    size="small"
                    style={{ width: "100px" }}
                    onChange={(e) => {
                      const splits = e.target.value.split(",");
                      if (splits.length === 2) {
                        const [startBar, endBar] = splits;
                        const newSections = [...sections];
                        const idx = newSections.findIndex(
                          (sec) => sec.internalId === section.internalId
                        );
                        newSections[idx].start = bars[startBar].start;
                        newSections[idx].end = bars[endBar].end;
                        setSections(newSections);
                        var o = Math.round,
                          r = Math.random,
                          s = 255;
                        const color =
                          "rgba(" +
                          o(r() * s) +
                          "," +
                          o(r() * s) +
                          "," +
                          o(r() * s) +
                          "," +
                          0.4 +
                          ")";
                        wavesurferIns.current.addRegion({
                          start: bars[startBar].start,
                          end: bars[endBar].end,
                          color,
                          resize: false,
                          drag: false,
                          id: i,
                        });
                      }
                    }}
                  ></TextField>
                </Box>
                {section.end > 0 && (
                  <Box mt={2}>
                    <Typography>Start: {section.start.toFixed(2)}s</Typography>
                    <Typography>End: {section.end.toFixed(2)}s</Typography>
                    <Box>
                      <IconButton
                        onClick={() => {
                          wavesurferIns.current.regions.list[i].play();
                        }}
                      >
                        <PlayCircleFilledWhiteOutlinedIcon />
                      </IconButton>
                      {/* <IconButton
                        onClick={() => {
                          wavesurferIns.current.regions.list[i].remove();
                        }}
                      >
                        <ClearIcon />
                      </IconButton> */}
                    </Box>
                  </Box>
                )}
              </Box>
            </Card>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default WaveForm;
