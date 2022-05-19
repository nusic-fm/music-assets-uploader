/* eslint-disable react-hooks/exhaustive-deps */

import SpectrogramPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.spectrogram.min.js';
import TimelinePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.regions.min.js';
import WaveSurfer from "wavesurfer.js";
import { Box, Button, Typography, Stack, Slider, Select, MenuItem, IconButton, Card } from "@mui/material";
import colormap from 'colormap';
import { useEffect, useRef, useState } from 'react';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import PlayCircleFilledWhiteOutlinedIcon from "@mui/icons-material/PlayCircleFilledWhiteOutlined";

const WaveForm = (props) => {
  const { url, segments, setSegments } = props;
  const [isLoading, setIsLoading] = useState(true);
  const wavesurferIns = useRef(null);
  const [zoomValue, setZoomValue] = useState(1);

  const showWaveForm = () => {
    const colors = colormap({
      colormap: 'hot',
      nshades: 256,
      format: 'float'
  });
    var wavesurfer = WaveSurfer.create({
      container: '#waveform',
      backgroundColor: 'white',
      waveColor: 'green',
      cursorColor: 'red',
      backend: 'MediaElement',
      height: 200,
      // barHeight: 1.5,
      // barGap: 3,
      plugins: [
        TimelinePlugin.create({
          container: "#wave-timeline",
          primaryFontColor: 'white',
          secondaryFontColor: 'white'
        }),
        RegionsPlugin.create({
          dragSelection: true,
        }),
        SpectrogramPlugin.create({
          container: "#wave-spectrogram",
          waveColor: 'yellow',
          colorMap: colors
        }),
      ]
    });
    wavesurfer.on("ready", function () {
      setIsLoading(false)
      const list = wavesurferIns.current?.regions?.list
      console.log({list})
      // wavesurfer.backend()
    })
    wavesurfer.on("region-created", function (region) {
      region.color = 'hsla(200, 50%, 70%, 0.4)'
    })
    wavesurfer.on("region-update-end", function () {
      // start, end, id,
      setSegments(Object.values(wavesurferIns.current.regions.list).map(region => ({internalId: region.id, start: region.start, end: region.end, })))
      // const updatedSegments = segments.map(segment => {
      //   if (segment.id === region.id) {
      //     return {}
      //   }
      //   return segment
      // })
      // setSegments()
    })
    wavesurfer.on("region-removed", function () {
      // start, end, id,
      setSegments(Object.values(wavesurferIns.current.regions.list).map(region => ({internalId: region.id, start: region.start, end: region.end, })))
      // const updatedSegments = segments.map(segment => {
      //   if (segment.id === region.id) {
      //     return {}
      //   }
      //   return segment
      // })
      // setSegments()
    })
    wavesurfer.load(url);
    wavesurferIns.current = wavesurfer;
  };

  useEffect(() => {
    if (url) {
      showWaveForm();
    }
  }, [url]);

  const pauseOrPlay = () => {
    wavesurferIns.current.playPause()
  }

  const onZoom = (e) => {
    setZoomValue(Number(e.target.value))
    wavesurferIns.current.zoom(Number(e.target.value));
  }

  return <Box mt={5}>
    <Typography variant='h6'>Waveform Explorer</Typography>
    {!isLoading && <Button onClick={pauseOrPlay}>Play/Pause</Button>}
    <Box mt={8}>
      <Box id="waveform" style={{ width: '100%'}}></Box>
      <Box id="wave-timeline"></Box>
    </Box>
    <Box display='flex' justifyContent='end'>
    {url && <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center" width={300}>
      <RemoveIcon color='primary' />
      <Slider aria-label="Volume" value={zoomValue} onChange={onZoom} step={100} min={1} max={1000} />
      <AddIcon color='primary' />
    </Stack>}
    </Box>
    <Box mt={2}>
      <Typography variant='h6'>Segments Information</Typography>
      <Box display='flex' gap={3} flexWrap='wrap' mt={2}>
        {segments.map((region, i) =>
            <Card> <Box p={2}>
          <Box mb={1}>
            <Select size='small' value={i}>
              <MenuItem value={0}>Intro</MenuItem>
              <MenuItem value={1}>Verse</MenuItem>
              <MenuItem value={2}>Pre Chores</MenuItem>
              <MenuItem value={3}>Chores</MenuItem>
              <MenuItem value={4}>Bridge</MenuItem>
              <MenuItem value={5}>Outro</MenuItem>
            </Select>
          </Box>
          <Typography>Start: {region.start.toFixed(2)}s</Typography>
          <Typography>End: {region.end.toFixed(2)}s</Typography>
          <Box>
            <IconButton onClick={() => {wavesurferIns.current.regions.list[region.internalId].play()}}>
              <PlayCircleFilledWhiteOutlinedIcon />
            </IconButton>
            <IconButton onClick={() => {wavesurferIns.current.regions.list[region.internalId].remove()}}>
              <ClearIcon />
            </IconButton>
          </Box></Box>
            </Card>
        )}
      </Box>
        {/* <Box width='100%'>
          <Typography variant='h6'>Audio Fingerprint</Typography>
          <Box mt={2} id="wave-spectrogram" width='100%'></Box>
        </Box> */}
    </Box>
  </Box>
}

export default WaveForm;
