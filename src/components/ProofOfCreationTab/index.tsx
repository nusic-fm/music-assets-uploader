import {
  Grid,
  Typography,
  Box,
  TextField,
  Skeleton,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Tooltip,
} from "@mui/material";
import MusicUploader from "../MusicUploader";
import CachedIcon from "@mui/icons-material/Cached";

type Props = {
  proofOfCreationMetadataObj: {
    fullTrackFile?: File;
    fileUrl?: string;
    duration?: number;
    durationOfEachBarInSec?: number;
    startBeatOffsetMs: number;
    bpm?: number;
    timeSignature: string;
    noOfBeatsPerBar: number;
    noOfBars?: number;
    noOfBeats?: number;
  };
  setProofOfCreationMetadataObj: (obj: any) => void;
  onFetchStartBeatOffet: () => Promise<void>;
};

const ProofOfCreationTab = ({
  proofOfCreationMetadataObj,
  setProofOfCreationMetadataObj,
  onFetchStartBeatOffet,
}: Props) => {
  const {
    fullTrackFile,
    duration,
    startBeatOffsetMs,
    bpm,
    timeSignature,
    noOfBars,
  } = proofOfCreationMetadataObj;
  console.log(fullTrackFile);

  const onPropertyChange = (key: string, value: any) => {
    setProofOfCreationMetadataObj({
      ...proofOfCreationMetadataObj,
      [key]: value,
    });
  };
  return (
    <Grid container mt={8} gap={{ xs: 2 }}>
      <Grid item xs={12} md={12}>
        <Grid container gap={2}>
          <Grid item xs={10} md={4}>
            <Typography>Audio</Typography>
            <MusicUploader
              fullTrackFile={fullTrackFile}
              onMultiplePropsChange={(obj: any) =>
                setProofOfCreationMetadataObj({
                  ...proofOfCreationMetadataObj,
                  ...obj,
                })
              }
            />
          </Grid>
          <Grid item xs={10} md={3}>
            <Box>
              <Typography>Duration</Typography>
              <Tooltip title="Automatically set from the Uploaded Track">
                {duration ? (
                  <TextField
                    variant="outlined"
                    value={duration}
                    size="small"
                    disabled
                  ></TextField>
                ) : (
                  <Skeleton
                    variant="text"
                    width={"50%"}
                    height="50px"
                    animation={false}
                  />
                )}
              </Tooltip>
              {/* <TextField
                    variant="outlined"
                    value={duration}
                    disabled
                    // placeholder="Fetched from upload"
                    helperText="auto calculation"
                  ></TextField> */}
            </Box>
          </Grid>
          <Grid md={1} />
          <Grid item xs={10} md={4}>
            <Box>
              <Typography>Start Beat offset(ms)</Typography>
              <OutlinedInput
                value={startBeatOffsetMs}
                onChange={(e) =>
                  onPropertyChange(
                    "startBeatOffsetMs",
                    parseInt(e.target.value)
                  )
                }
                type="number"
                placeholder="Waveform Selection"
                size="small"
                endAdornment={
                  <Tooltip title="Fetch from the selected Position on the waveform">
                    <InputAdornment position="end">
                      <IconButton onClick={onFetchStartBeatOffet} edge="end">
                        <CachedIcon />
                      </IconButton>
                    </InputAdornment>
                  </Tooltip>
                }
              />
            </Box>
          </Grid>
          <Grid item xs={10} md={4}>
            <Box>
              <Typography>Bpm</Typography>
              <TextField
                variant="outlined"
                type={"number"}
                value={bpm}
                onChange={(e: any) =>
                  onPropertyChange("bpm", parseInt(e.target.value))
                }
                size="small"
                // fullWidth
              ></TextField>
            </Box>
          </Grid>
          <Grid item xs={10} md={4}>
            <Box>
              <Typography>Time Signature</Typography>
              <TextField
                required
                variant="outlined"
                value={timeSignature}
                onChange={(e: any) =>
                  onPropertyChange("timeSignature", e.target.value)
                }
                size="small"
                // fullWidth
              ></TextField>
            </Box>
          </Grid>
          <Grid item xs={10} md={3}>
            <Box>
              <Typography>No Of Measures</Typography>
              {noOfBars ? (
                <TextField
                  variant="outlined"
                  type="number"
                  value={noOfBars}
                  disabled
                  size="small"
                ></TextField>
              ) : (
                <Skeleton
                  variant="text"
                  width={"50%"}
                  height="50px"
                  animation={false}
                />
              )}
              {/* <TextField
                    variant="outlined"
                    type="number"
                    value={noOfBars}
                    disabled
                  ></TextField> */}
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ProofOfCreationTab;
