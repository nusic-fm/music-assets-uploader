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

function App() {
  const [cid, setCid] = useState<string>();
  const [artist, setArtist] = useState<string>();
  const [duration, setDuration] = useState<number>();
  const [title, setTitle] = useState<string>();
  const [album, setAlbum] = useState<string>();
  const [genre, setGenre] = useState<string>();
  const [bpm, setBpm] = useState<string>();
  const [key, setKey] = useState<string>();
  const [timeSignature, setTimeSignature] = useState<string>();
  const [noOfBars, setNoOfBars] = useState<string>();
  const [fileUrl, setFileUrl] = useState<string>();
  const [startBeatOffset, setStartBeatOffset] = useState<number>();
  const [segments, setSegments] = useState([]);
  const [stems, setStems] = useState([]);

  const getSelectedBeatOffet = useRef(null);
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone();

  useEffect(() => {
    // showWaveForm();
  }, []);

  const onFetchStartBeatOffet = () => {
    if (fileUrl) {
      const time = document.getElementsByTagName("audio")[0]?.currentTime;
      setStartBeatOffset(Math.floor(time * 1000));
    }
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
                  <Typography>Bpm</Typography>
                  <TextField
                    variant="outlined"
                    type={"number"}
                    onChange={(e: any) => setBpm(e.target.value)}
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
                  <Typography>Time Signature</Typography>
                  <TextField
                    variant="outlined"
                    onChange={(e: any) => setTimeSignature(e.target.value)}
                  ></TextField>
                </Box>
              </Grid>
              <Grid item xs={10} md={4}>
                <Box>
                  <Typography>No Of Bars</Typography>
                  <TextField
                    variant="outlined"
                    type="number"
                    onChange={(e: any) => setNoOfBars(e.target.value)}
                  ></TextField>
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
                    id="outlined-adornment-password"
                    value={startBeatOffset}
                    onChange={(e) =>
                      setStartBeatOffset(parseInt(e.target.value))
                    }
                    type="number"
                    disabled
                    placeholder="Waveform Selection"
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton onClick={onFetchStartBeatOffet} edge="end">
                          <CachedIcon />
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Password"
                  />
                </Box>
              </Grid>
              <Grid item xs={10} md={4}>
                <Box>
                  <MusicUploader
                    cid={cid}
                    setCid={setCid}
                    setFileUrl={setFileUrl}
                    setDuration={setDuration}
                  />
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
                          No Of Bars:
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
                        <Typography color="black">{startBeatOffset}</Typography>
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
          getSelectedBeatOffet={getSelectedBeatOffet}
          segments={segments}
          setSegments={setSegments}
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
            {acceptedFiles.map((file, i) => (
              <Box>
                <Box display="flex" justifyContent="center">
                  <Select size="small" value={i}>
                    <MenuItem value={0}>Vocal</MenuItem>
                    <MenuItem value={1}>Instrumental</MenuItem>
                    <MenuItem value={2}>Bass</MenuItem>
                    <MenuItem value={3}>Drums</MenuItem>
                  </Select>
                </Box>
                <Box mt={2}>
                  <TextField
                    placeholder="Name"
                    value={file.name.split(".")[0]}
                  ></TextField>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
        <Box mt={8} display="flex" justifyContent="center">
          <Button variant="contained" color="primary">
            Send To Blockchain
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default App;
