import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import MusicUploader from "./components/MusicUploader";
// import { ApiPromise, WsProvider, Keyring } from "@polkadot/api";

function App() {
  const [cid, setCid] = useState<string>();
  const [title, setTitle] = useState<string>();
  const [album, setAlbum] = useState<string>();
  const [bpm, setBpm] = useState<string>();
  const [key, setKey] = useState<string>();

  useEffect(() => {}, []);

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
                    <Typography>Title</Typography>
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
                  <MusicUploader cid={cid} setCid={setCid} />
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
                <Grid container>
                  <Grid item xs={12}>
                    <Box p={1} display="flex" alignItems={"center"}>
                      <Box flexBasis={{ xs: "45%", md: "20%" }}>
                        <Typography fontWeight="bold" color="black">
                          Title:
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
                          Music:
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

        <Box mt={8} display="flex" justifyContent="center">
          <Button variant="outlined" color="secondary">
            Send To Blockchain
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default App;
