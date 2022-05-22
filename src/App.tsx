import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Select,
  MenuItem,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import MusicUploader from "./components/MusicUploader";
// import { ApiPromise, WsProvider, Keyring } from "@polkadot/api";
import WaveForm from "./components/WaveForm";
import CachedIcon from "@mui/icons-material/Cached";
import AcceptStems from "./components/Dropzone";
import { useDropzone } from "react-dropzone";
import axios from "axios";

const StemTypes = ["Vocal", "Instrumental", "Bass", "Drums"];
type Stem = {
  [key: string]: { file: File; name: string; type: string };
};

function App() {
  const [fullTrackFile, setFullTrackFile] = useState<File>();
  const [cid, setCid] = useState<string>();
  const [artist, setArtist] = useState<string>();
  const [duration, setDuration] = useState<number>();
  const [title, setTitle] = useState<string>();
  const [album, setAlbum] = useState<string>();
  const [genre, setGenre] = useState<string>();
  const [bpm, setBpm] = useState<number>();
  const [key, setKey] = useState<string>();
  const [timeSignature, setTimeSignature] = useState<string>();
  const [noOfBars, setNoOfBars] = useState<number>();
  const [fileUrl, setFileUrl] = useState<string>();
  const [startBeatOffsetMs, setStartBeatOffsetMs] = useState<number>();
  const [durationOfEachBarInSec, setDurationOfEachBarInSec] =
    useState<number>();
  const [isUploaded, setIsUploaded] = useState(false);
  const [sections, setSections] = useState<
    { internalId: string; name: string; start: number; end: number }[]
  >([]);
  const [stemObj, setStemObj] = useState<Stem>({});

  const getSelectedBeatOffet = useRef(null);
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone();

  useEffect(() => {
    const obj = {} as Stem;
    acceptedFiles.map((acceptedFile, i) => {
      obj[i] = {
        file: acceptedFile,
        name: acceptedFile.name,
        type: StemTypes[i] || "",
      };
      return "";
    });
    setStemObj(obj);
  }, [acceptedFiles]);

  useEffect(() => {
    if (duration && bpm && timeSignature?.includes("/4") && startBeatOffsetMs) {
      const beatsPerSecond = bpm / 60;
      const totalNoOfBeats =
        beatsPerSecond * (duration - startBeatOffsetMs / 1000);
      const noOfBeatsPerBar = parseInt(timeSignature.split("/")[0]);
      const durationOfEachBar = noOfBeatsPerBar * beatsPerSecond;
      setDurationOfEachBarInSec(durationOfEachBar);
      const noOfMeasures = Math.floor(totalNoOfBeats / noOfBeatsPerBar);
      setNoOfBars(noOfMeasures);
    }
  }, [duration, bpm, timeSignature, startBeatOffsetMs]);

  const onFetchStartBeatOffet = async () => {
    if (fileUrl) {
      const time = document.getElementsByTagName("audio")[0]?.currentTime;
      setStartBeatOffsetMs(Math.floor(time * 1000));
    }
    // const response = await fetch(
    //   "http://localhost:8080/cid/bafybeianjehxvg3qpore2bkt5vjmou5qovxuxl46izid4wm4kugxtxcq5e"
    // );
    // const content = await response.arrayBuffer();
    // const blob = new Blob([content], { type: "audio/wav" });
    // const a = new Audio(URL.createObjectURL(blob));
    // a.play();
  };

  // const onClick = async () => {
  //   //wss://rpc.polkadot.io
  //   // const wsProvider = new WsProvider("ws://127.0.0.1:9944");
  //   // const api = await ApiPromise.create({ provider: wsProvider });
  //   // // Do something
  //   // console.log(api.genesisHash.toHex());
  //   // const keyring = new Keyring({ type: "sr25519" });
  //   // const alice = keyring.addFromUri("//Alice", { name: "Alice default" });
  //   // const txHash = await api.tx.templateModule
  //   //   .createClaim("0x8888", "Kenya", "Some Title", "54")
  //   //   .signAndSend(alice);
  //   // console.log({ txHash });
  //   // debugger;
  //   // const queried = await api.query.templateModule.proofs(
  //   //   "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty"
  //   // );
  //   // const data = await api.query.system.account(
  //   //   "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"
  //   // );
  //   // console.log(
  //   //   `${(data as any).now}: balance of ${
  //   //     (data as any).data.free
  //   //   } and a nonce of ${(data as any).nonce}`
  //   // );
  //   // The length of an epoch (session) in Babe
  //   // console.log(api.consts.babe.epochDuration.toNumber());
  //   // // The amount required to create a new account
  //   // console.log(api.consts.balances.existentialDeposit.toNumber());
  //   // // The amount required per byte on an extrinsic
  //   // console.log(api.consts.transactionPayment.transactionByteFee.toNumber());
  // };

  // const transfer = async () => {
  //   // Sign and send a transfer from Alice to Bob
  //   // const txHash = await api.tx.balances
  //   //   .transfer("5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty", 12345)
  //   //   .signAndSend("5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY");
  //   // const txHash = await api.tx.templateModule.createClaim()
  // };
  const onTxClick = async () => {
    if (isUploaded) {
      alert("Tx to blockchain is currently disabled");
    } else {
      if (!fullTrackFile) {
        alert("Upload Full Track.");
        return;
      } else if (acceptedFiles.length === 0) {
        alert("Submit PoC/stem files");
        return;
      }
      const files = [
        fullTrackFile,
        ...Object.values(stemObj).map((obj) => obj.file),
      ];
      const formData = new FormData();
      files.map((file) => {
        formData.append(file.name, file);
        return false;
      });
      const response = await axios.post(
        "http://localhost:8080/upload",
        formData
      );
      if (response.data.cid) {
        setCid(response.data.cid);
        setIsUploaded(true);
      } else {
        alert("Some error Occured, please try again later.");
      }
    }
  };

  return (
    <Box sx={{ bgcolor: "background.paper", minHeight: "100vh" }}>
      <Box p={{ xs: 4, md: 10 }}>
        <Typography variant="h4" fontWeight="600" align="left">
          Music Metadata Information
        </Typography>
        <Grid container mt={8} gap={{ xs: 2 }}>
          <Grid item xs={12} md={7}>
            <Grid container gap={2}>
              <Grid item xs={10} md={4}>
                <Box display="flex" justifyContent="start">
                  <Box>
                    <Typography>Artist</Typography>
                    <TextField
                      variant="outlined"
                      onChange={(e: any) => setArtist(e.target.value)}
                    ></TextField>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={10} md={4}>
                <Box display="flex" justifyContent="start">
                  <Box>
                    <Typography>Track Title</Typography>
                    <TextField
                      variant="outlined"
                      onChange={(e: any) => setTitle(e.target.value)}
                    ></TextField>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={10} md={4}>
                <Box>
                  <Typography>Album Name</Typography>
                  <TextField
                    variant="outlined"
                    onChange={(e: any) => setAlbum(e.target.value)}
                  ></TextField>
                </Box>
              </Grid>
              <Grid item xs={10} md={4}>
                <Box>
                  <Typography>Genre</Typography>
                  <TextField
                    variant="outlined"
                    onChange={(e: any) => setGenre(e.target.value)}
                  ></TextField>
                </Box>
              </Grid>
              <Grid item xs={10} md={4}>
                <Box>
                  <Typography>Key</Typography>
                  <TextField
                    variant="outlined"
                    onChange={(e: any) => setKey(e.target.value)}
                  ></TextField>
                </Box>
              </Grid>
              <Grid item xs={10} md={4}>
                <Box>
                  <MusicUploader
                    fullTrackFile={fullTrackFile}
                    setFullTrackFile={setFullTrackFile}
                    setFileUrl={setFileUrl}
                    setDuration={setDuration}
                  />
                </Box>
              </Grid>
              <Grid item xs={10} md={4}>
                <Box>
                  <Typography>Duration</Typography>
                  <TextField
                    variant="outlined"
                    value={duration}
                    disabled
                    placeholder="Fetched from upload"
                  ></TextField>
                </Box>
              </Grid>
              <Grid item xs={10} md={4}>
                <Box>
                  <Typography>Start Beat offset(ms)</Typography>
                  <OutlinedInput
                    value={startBeatOffsetMs}
                    onChange={(e) =>
                      setStartBeatOffsetMs(parseInt(e.target.value))
                    }
                    type="number"
                    placeholder="Waveform Selection"
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton onClick={onFetchStartBeatOffet} edge="end">
                          <CachedIcon />
                        </IconButton>
                      </InputAdornment>
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
                    onChange={(e: any) => setBpm(parseInt(e.target.value))}
                  ></TextField>
                </Box>
              </Grid>
              <Grid item xs={10} md={4}>
                <Box>
                  <Typography>Time Signature</Typography>
                  <TextField
                    variant="outlined"
                    onChange={(e: any) => setTimeSignature(e.target.value)}
                  ></TextField>
                </Box>
              </Grid>
              <Grid item xs={10} md={4}>
                <Box>
                  <Typography>No Of Measures</Typography>
                  <TextField
                    variant="outlined"
                    type="number"
                    value={noOfBars}
                    disabled
                  ></TextField>
                </Box>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box>
              <Box
                style={{
                  backgroundColor: "white",
                  color: "black",
                  borderRadius: "4px",
                }}
                p={1}
              >
                <Typography
                  variant="h5"
                  p={1}
                  color={"black"}
                  textAlign="center"
                >
                  Metadata Information
                </Typography>
                <Grid container>
                  <Grid item xs={12}>
                    <Box p={1} display="flex" alignItems={"center"}>
                      <Box flexBasis={{ xs: "45%", md: "20%" }}>
                        <Typography fontWeight="bold" color="black">
                          Artist:
                        </Typography>
                      </Box>
                      <Box>
                        <Typography color="black">{artist}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box p={1} display="flex" alignItems={"center"}>
                      <Box flexBasis={{ xs: "45%", md: "20%" }}>
                        <Typography fontWeight="bold" color="black">
                          Track Title:
                        </Typography>
                      </Box>
                      <Box>
                        <Typography color="black">{title}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box p={1} display="flex" alignItems={"center"}>
                      <Box flexBasis={{ xs: "45%", md: "20%" }}>
                        <Typography fontWeight="bold" color="black">
                          Album:
                        </Typography>
                      </Box>
                      <Box>
                        <Typography color="black">{album}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box p={1} display="flex" alignItems={"center"}>
                      <Box flexBasis={{ xs: "45%", md: "20%" }}>
                        <Typography fontWeight="bold" color="black">
                          Genre:
                        </Typography>
                      </Box>
                      <Box>
                        <Typography color="black">{genre}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box p={1} display="flex" alignItems={"center"}>
                      <Box flexBasis={{ xs: "45%", md: "20%" }}>
                        <Typography fontWeight="bold" color="black">
                          Bpm:
                        </Typography>
                      </Box>
                      <Box>
                        <Typography color="black">{bpm}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box p={1} display="flex" alignItems={"center"}>
                      <Box flexBasis={{ xs: "45%", md: "20%" }}>
                        <Typography fontWeight="bold" color="black">
                          Key:
                        </Typography>
                      </Box>
                      <Box>
                        <Typography color="black">{key}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box p={1} display="flex" alignItems={"center"}>
                      <Box flexBasis={{ xs: "45%", md: "20%" }}>
                        <Typography fontWeight="bold" color="black">
                          Time Signature:
                        </Typography>
                      </Box>
                      <Box>
                        <Typography color="black">{timeSignature}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box p={1} display="flex" alignItems={"center"}>
                      <Box flexBasis={{ xs: "45%", md: "20%" }}>
                        <Typography fontWeight="bold" color="black">
                          No Of Measures:
                        </Typography>
                      </Box>
                      <Box>
                        <Typography color="black">{noOfBars}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box p={1} display="flex" alignItems={"center"}>
                      <Box flexBasis={{ xs: "45%", md: "20%" }}>
                        <Typography fontWeight="bold" color="black">
                          Duration:
                        </Typography>
                      </Box>
                      <Box>
                        <Typography color="black">{duration}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box p={1} display="flex" alignItems={"center"}>
                      <Box flexBasis={{ xs: "45%", md: "20%" }}>
                        <Typography fontWeight="bold" color="black">
                          Start Beat Offset:
                        </Typography>
                      </Box>
                      <Box>
                        <Typography color="black">
                          {startBeatOffsetMs}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box p={1} display="flex" alignItems={"center"}>
                      <Box flexBasis={{ xs: "45%", md: "20%" }}>
                        <Typography fontWeight="bold" color="black">
                          Music Cid:
                        </Typography>
                      </Box>
                      <Box>
                        <Typography
                          color="black"
                          overflow={"hidden"}
                          textOverflow={"ellipsis"}
                          whiteSpace="nowrap"
                        >
                          {cid}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Grid>
        </Grid>
        <WaveForm
          url={fileUrl}
          durationOfEachBarInSec={durationOfEachBarInSec}
          noOfBars={noOfBars}
          startBeatOffsetMs={startBeatOffsetMs}
          getSelectedBeatOffet={getSelectedBeatOffet}
          sections={sections}
          setSections={setSections}
        />
        <Box mt={8}>
          <Typography variant="h6">Proof of Creation</Typography>
          <Box mt={4} display="flex" justifyContent="center">
            <AcceptStems
              getRootProps={getRootProps}
              getInputProps={getInputProps}
            />
          </Box>
          <Box
            mt={4}
            display="flex"
            gap={2}
            justifyContent="center"
            flexWrap="wrap"
          >
            {Object.values(stemObj).map(({ file, name, type }, i) => (
              <Box>
                <Box display="flex" justifyContent="center">
                  <Select
                    size="small"
                    value={type}
                    onChange={(e) => {
                      const newObject = { ...stemObj };
                      newObject[i].type = String(e.target.value);
                      setStemObj(newObject);
                    }}
                  >
                    <MenuItem value={"Vocal"}>Vocal</MenuItem>
                    <MenuItem value={"Instrumental"}>Instrumental</MenuItem>
                    <MenuItem value={"Bass"}>Bass</MenuItem>
                    <MenuItem value={"Drums"}>Drums</MenuItem>
                  </Select>
                </Box>
                <Box mt={2}>
                  <TextField
                    placeholder="Name"
                    value={name}
                    onChange={(e) => {
                      const newObject = { ...stemObj };
                      newObject[i].name = e.target.value;
                      setStemObj(newObject);
                    }}
                  ></TextField>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
        <Box mt={8} display="flex" justifyContent="center">
          <Button variant="contained" color="primary" onClick={onTxClick}>
            {!isUploaded ? "Upload Music Assets" : "Send To Blockchain"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default App;
