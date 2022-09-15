/* eslint-disable @typescript-eslint/no-unused-vars */
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
  Checkbox,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import MusicUploader from "./components/MusicUploader";
import WaveForm from "./components/WaveForm";
import CachedIcon from "@mui/icons-material/Cached";
import AcceptStems from "./components/Dropzone";
import { useDropzone } from "react-dropzone";
// import axios from "axios";
// import { ApiPromise, Keyring, WsProvider } from "@polkadot/api";
import TransactionDialog from "./components/TransactionDialog";
import { Web3Storage } from "web3.storage";
import { useNavigate } from "react-router-dom";
import {
  DirectSecp256k1HdWallet,
  OfflineDirectSigner,
} from "@cosmjs/proto-signing";
import { getSigningStargateClient, txClient } from "./module";
import {
  MsgCreateFullTrack,
  MsgCreateSection,
  MsgCreateStem,
} from "./module/types/metadatalayercosmos/tx";
import { ChainInfo } from "@keplr-wallet/types";

export const checkersChainId = "metadatalayercosmos";

export const getCheckersChainInfo = (): ChainInfo => ({
  chainId: checkersChainId,
  chainName: "nusic-layer",
  rpc: "http://localhost:26657",
  rest: "http://0.0.0.0:1317",
  bip44: {
    coinType: 118,
  },
  bech32Config: {
    bech32PrefixAccAddr: "nusic",
    // eslint-disable-next-line no-useless-concat
    bech32PrefixAccPub: "nusic" + "pub",
    // eslint-disable-next-line no-useless-concat
    bech32PrefixValAddr: "nusic" + "valoper",
    // eslint-disable-next-line no-useless-concat
    bech32PrefixValPub: "nusic" + "valoperpub",
    // eslint-disable-next-line no-useless-concat
    bech32PrefixConsAddr: "nusic" + "valcons",
    // eslint-disable-next-line no-useless-concat
    bech32PrefixConsPub: "nusic" + "valconspub",
  },
  currencies: [
    {
      coinDenom: "STAKE",
      coinMinimalDenom: "stake",
      coinDecimals: 0,
      coinGeckoId: "stake",
    },
    {
      coinDenom: "TOKEN",
      coinMinimalDenom: "token",
      coinDecimals: 0,
    },
  ],
  feeCurrencies: [
    {
      coinDenom: "STAKE",
      coinMinimalDenom: "stake",
      coinDecimals: 0,
      coinGeckoId: "stake",
    },
  ],
  stakeCurrency: {
    coinDenom: "STAKE",
    coinMinimalDenom: "stake",
    coinDecimals: 0,
    coinGeckoId: "stake",
  },
  coinType: 118,
  gasPriceStep: {
    low: 1,
    average: 1,
    high: 1,
  },
  features: ["stargate", "ibc-transfer", "no-legacy-stdTx"],
});

const getAliceSignerFromMnemonic = async (): Promise<OfflineDirectSigner> => {
  return DirectSecp256k1HdWallet.fromMnemonic(aliceMnemonic, {
    prefix: "nusic",
  });
  // return new Promise((resolve) => {
  //     readFile("./testnet.alice.mnemonic.key", (err, data) => {
  //         const wallet = DirectSecp256k1HdWallet.fromMnemonic(data.toString(), {
  //             prefix: "cosmos",
  //         })
  //         resolve(wallet);
  //     })
  // })
};

const CryptoJS = require("crypto-js");

const StemTypes = ["Vocal", "Instrumental", "Bass", "Drums"];
// type StemType = "Vocal" | "Instrumental" | "Bass" | "Drums";
const musicKeys = [
  { key: "C major", id: "CMa" },
  { key: "D♭ major", id: "DflMa" },
  { key: "D major", id: "DMa" },
  { key: "E♭ major", id: "EflMa" },
  { key: "E major", id: "EMa" },
  { key: "F major", id: "FMa" },
  { key: "F# major", id: "FshMa" },
  { key: "G major", id: "GMa" },
  { key: "A♭ major", id: "AflMa" },
  { key: "A major", id: "AMa" },
  { key: "B♭ major", id: "BflMa" },
  { key: "B major", id: "BMa" },
  { key: "C minor", id: "CMi" },
  { key: "C# minor", id: "CshMi" },
  { key: "D minor", id: "DMi" },
  { key: "E♭ minor", id: "EflMi" },
  { key: "E minor", id: "EMi" },
  { key: "F minor", id: "FMi" },
  { key: "F# minor", id: "FshMi" },
  { key: "G minor", id: "GMi" },
  { key: "G# minor", id: "GshMi" },
  { key: "A minor", id: "AMi" },
  { key: "A♭ minor", id: "AflMi" },
  { key: "B♭ minor", id: "BflMi" },
  { key: "B minor", id: "BMi" },
];

type Stem = { file: File; name: string; type: string };
type StemsObj = {
  [key: string]: Stem;
};
type Section = { name: string; start: number; end: number; bars: number };
type SectionsObj = {
  [internalId: string]: Section;
};

const getWithoutSpace = (str: string) => str.split(" ").join("");
const aliceMnemonic =
  "army bone catalog aisle harbor unfair situate text shop pony fiscal cover grid doctor clarify buffalo canyon peace change gallery memory music stairs often";

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
  const [noOfBeatsPerBar, setNoOfBeatsPerBar] = useState<number>(0);
  const [noOfBars, setNoOfBars] = useState<number>();
  const [noOfBeats, setNoOfBeats] = useState<number>();
  const [fileUrl, setFileUrl] = useState<string>();
  const [startBeatOffsetMs, setStartBeatOffsetMs] = useState<number>(0);
  const [durationOfEachBarInSec, setDurationOfEachBarInSec] =
    useState<number>();
  const [sectionsObj, setSectionsObj] = useState<SectionsObj>({});
  const [stemsObj, setStemsObj] = useState<StemsObj>({});

  const getSelectedBeatOffet = useRef(null);
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone();
  const [activeTxStep, setActiveTxStep] = useState<number>(0);
  const [isTxDialogOpen, setIsTxDialogOpen] = useState<boolean>(false);
  const [isEncryptFiles, setIsEncryptFiles] = useState<boolean>(false);

  const [fullTrackHash, setFullTrackHash] = useState<string>();
  const [stemsHash, setStemsHash] = useState<string[]>([]);
  const [sectionsHash, setSectionsHash] = useState<string[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (acceptedFiles.length) {
      const obj = {} as StemsObj;
      acceptedFiles.map((acceptedFile, i) => {
        obj[i] = {
          file: acceptedFile,
          name: acceptedFile.name,
          type: StemTypes[i] || "",
        };
        return "";
      });
      setStemsObj(obj);
    }
  }, [acceptedFiles]);

  useEffect(() => {
    if (duration && bpm && timeSignature?.includes("/4")) {
      const beatsPerSecond = bpm / 60;
      const totalNoOfBeats =
        beatsPerSecond * (duration - startBeatOffsetMs / 1000);
      setNoOfBeats(totalNoOfBeats);
      const noOfBeatsPerBar = parseFloat(timeSignature.split("/")[0]);
      setNoOfBeatsPerBar(noOfBeatsPerBar);
      const noOfMeasures = Math.floor(totalNoOfBeats / noOfBeatsPerBar);
      setNoOfBars(noOfMeasures);
      const durationOfEachBar = duration / noOfMeasures;
      setDurationOfEachBarInSec(durationOfEachBar);
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

  const download = (content: any, fileName: string, contentType: string) => {
    var a = document.createElement("a");
    var file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
  };

  const onTx = async () => {
    //wss://rpc.polkadot.io
    // let wsProvider;
    // let api: ApiPromise;
    // try {
    //   wsProvider = new WsProvider(
    //     "wss://node-6948493832736464896.rz.onfinality.io/ws?apikey=78d805ee-1473-4737-a764-1b9fece4dd60"
    //   );
    //   api = await ApiPromise.create({
    //     provider: wsProvider,
    //     throwOnConnect: true,
    //   });
    // } catch (e) {
    //   setFullTrackHash("error");
    //   setActiveTxStep(4);
    //   return;
    // }
    // // // Do something
    // // console.log(api.genesisHash.toHex());
    // const keyring = new Keyring({ type: "sr25519" });
    // const account = keyring.addFromUri("//Alice", { name: "Alice default" });

    // const PHRASE = process.env.REACT_APP_WALLET_PHRASE as string;
    // const account = keyring.addFromUri(PHRASE);
    const titleWithoutSpace = getWithoutSpace(title as string).slice(0, 10);
    const genreWithoutSpace = getWithoutSpace(genre as string);
    const fullTrackContent = {
      id: `fulltrack${titleWithoutSpace}${genreWithoutSpace}${key}${bpm}`,
      cid,
      artist,
      title,
      album,
      genre,
      bpm,
      key,
      timeSignature,
      noOfBars,
      noOfBeats,
      duration,
      startBeatOffsetMs: startBeatOffsetMs.toString(),
      sections: Object.keys(sectionsObj).length,
      stems: Object.keys(stemsObj).length,
    };
    const aliceSigner: OfflineDirectSigner = await getAliceSignerFromMnemonic();
    const alice = (await aliceSigner.getAccounts())[0].address;
    console.log("Alice's address from signer", alice);
    const {
      signAndBroadcast,
      msgCreateFullTrack,
      msgCreateSection,
      msgCreateStem,
    } = await txClient(aliceSigner);
    try {
      const fromJson = MsgCreateFullTrack.fromJSON({
        creator: alice,
        cid,
        artistName: artist,
        trackTitle: title,
        album,
        bpm,
        key,
        bars: noOfBars,
        beats: noOfBeats,
        genre,
        timeSignature,
        durationMs: (duration || 0) * 1000,
        startBeatOffsetMs: startBeatOffsetMs.toString(),
        sectionsCount: Object.keys(sectionsObj).length,
        stemsCount: Object.keys(stemsObj).length,
      });
      const msgEncoded = msgCreateFullTrack(fromJson);
      const broadCast = await signAndBroadcast([msgEncoded]);
      console.log({ msgEncoded });
      console.log(broadCast);
    } catch (err) {
      console.log("error: ", err);
      alert("Error creating fulltrack tx.");
    }
    // try {
    //   const fullTrackTxHash = await new Promise<string>((res) => {
    //     api.tx.uploadModule
    //       .createFulltrack(
    //         `fulltrack${titleWithoutSpace}${genreWithoutSpace}${key}${bpm}`,
    //         cid,
    //         artist?.slice(0, 128),
    //         title?.slice(0, 128),
    //         album?.slice(0, 128),
    //         genre,
    //         bpm,
    //         key,
    //         timeSignature,
    //         noOfBars,
    //         noOfBeats,
    //         duration,
    //         startBeatOffsetMs.toString(),
    //         Object.keys(sectionsObj).length,
    //         Object.keys(stemsObj).length
    //       )
    //       .signAndSend(account, ({ events = [], status }) => {
    //         if (status.isFinalized) {
    //           console.log(
    //             `Transaction included at blockHash ${status.asFinalized}`
    //           );

    //           // Loop through Vec<EventRecord> to display all events
    //           events.forEach(({ phase, event: { data, method, section } }) => {
    //             console.log(`\t' ${phase}: ${section}.${method}:: ${data}`);
    //           });
    //           res(status.hash.toString());
    //         }
    //       });
    //   });
    //   setFullTrackHash(fullTrackTxHash);
    // } catch (e) {
    //   alert(e);
    // }
    setActiveTxStep(2);
    // Stems
    const stems = Object.values(stemsObj);
    const stemsContent = [];
    const broadCastStemsMsgs = [];
    for (let i = 0; i < stems.length; i++) {
      const stemObj = stems[i];
      stemsContent.push({
        id: `stem${i + 1}${titleWithoutSpace}${genreWithoutSpace}${key}${bpm}`,
        cid,
        name: stemObj.name,
        type: stemObj.type,
      });
      const fromJson = MsgCreateStem.fromJSON({
        creator: alice,
        fullTrackID: 0, //TODO
        stemCid: cid, //TODO
        stemName: stemObj.name,
        stemType: stemObj.type,
      });
      const msgEncoded = msgCreateStem(fromJson);
      broadCastStemsMsgs.push(msgEncoded);
      // const stemHash = await new Promise<string>((res) => {
      //   api.tx.uploadModule
      //     .createStem(
      //       `stem${i + 1}${titleWithoutSpace}${genreWithoutSpace}${key}${bpm}`,
      //       cid,
      //       stemObj.name,
      //       stemObj.type
      //     )
      //     .signAndSend(account, ({ events = [], status }) => {
      //       if (status.isFinalized) {
      //         console.log(
      //           `Transaction included at blockHash ${status.asFinalized}`
      //         );

      //         // Loop through Vec<EventRecord> to display all events
      //         events.forEach(({ phase, event: { data, method, section } }) => {
      //           console.log(`\t' ${phase}: ${section}.${method}:: ${data}`);
      //         });
      //         res(status.hash.toString());
      //       }
      //     });
      // });
      // setStemsHash([...stemsHash, stemHash]);
    }
    try {
      const broadCastedStems = await signAndBroadcast(broadCastStemsMsgs);
      console.log({ broadCastStemsMsgs });
      console.log({ broadCastedStems });
    } catch (err) {
      console.log("error: ", err);
      alert("Error creating stems tx.");
    }
    setActiveTxStep(3);

    // Section
    const sections = Object.values(sectionsObj);
    const sectionsContent = [];
    const broadCastSectionsMsgs = [];
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      const fromJson = MsgCreateSection.fromJSON({
        creator: alice,
        fullTrackID: 0, //TODO
        sectionName: section.name,
        sectionStartTimeMs: section.start * 1000,
        sectionEndTimeMs: section.end * 1000,
      });
      const msgEncoded = msgCreateSection(fromJson);
      broadCastSectionsMsgs.push(msgEncoded);
      sectionsContent.push({
        id: `section${
          i + 1
        }${titleWithoutSpace}${genreWithoutSpace}${key}${bpm}`,
        name: section.name,
        startMs: section.start * 1000,
        endMs: section.end * 1000,
        bars: section.bars,
        beats: section.bars * noOfBeatsPerBar,
      });
      // const sectionHash = await new Promise<string>((res) => {
      //   api.tx.uploadModule
      //     .createSection(
      //       `section${
      //         i + 1
      //       }${titleWithoutSpace}${genreWithoutSpace}${key}${bpm}`,
      //       section.name,
      //       section.start * 1000,
      //       section.end * 1000,
      //       section.bars,
      //       section.bars * noOfBeatsPerBar
      //     )
      //     .signAndSend(account, ({ events = [], status }) => {
      //       if (status.isFinalized) {
      //         console.log(
      //           `Transaction included at blockHash ${status.asFinalized}`
      //         );

      //         // Loop through Vec<EventRecord> to display all events
      //         events.forEach(({ phase, event: { data, method, section } }) => {
      //           console.log(`\t' ${phase}: ${section}.${method}:: ${data}`);
      //         });
      //         res(status.hash.toString());
      //       }
      //     });
      // });
      // setSectionsHash([...sectionsHash, sectionHash]);
    }
    try {
      const broadCastedStems = await signAndBroadcast(broadCastSectionsMsgs);
      console.log({ broadCastSectionsMsgs });
      console.log(broadCastedStems);
    } catch (err) {
      console.log("error: ", err);
      alert("Error creating sections tx.");
    }
    download(
      JSON.stringify({ fullTrackContent, stemsContent, sectionsContent }),
      "NUSIC-song-metadata.json",
      "text/plain"
    );
    setActiveTxStep(4);
    // const sectionTxs = await Promise.all(sectionsTxPromises);
    // console.log({ sectionTxs });
    // debugger;
    // const queried = await api.query.uploadModule.proofs(
    //   "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty"
    // );
    // const data = await api.query.system.account(
    //   "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"
    // );
    // console.log(
    //   `${(data as any).now}: balance of ${
    //     (data as any).data.free
    //   } and a nonce of ${(data as any).nonce}`
    // );
    // The length of an epoch (session) in Babe
    // console.log(api.consts.babe.epochDuration.toNumber());
    // // The amount required to create a new account
    // console.log(api.consts.balances.existentialDeposit.toNumber());
    // // The amount required per byte on an extrinsic
    // console.log(api.consts.transactionPayment.transactionByteFee.toNumber());
  };

  // const transfer = async () => {
  //   // Sign and send a transfer from Alice to Bob
  //   // const txHash = await api.tx.balances
  //   //   .transfer("5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty", 12345)
  //   //   .signAndSend("5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY");
  //   // const txHash = await api.tx.uploadModule.createClaim()
  // };
  const onTxClick = async () => {
    if (!fullTrackFile) {
      alert("Upload Full Track.");
      return;
    } else if (acceptedFiles.length === 0) {
      // alert("Submit PoC/stem files");
      // return;
    }
    setIsTxDialogOpen(true);
    const stemFiles: File[] = Object.values(stemsObj).map((obj) => obj.file);
    const allFiles = [fullTrackFile, ...stemFiles];
    let finalFiles;
    if (isEncryptFiles) {
      finalFiles = await encryptFiles(allFiles);
    } else {
      finalFiles = allFiles;
    }
    const client = new Web3Storage({
      token: process.env.REACT_APP_WEB3_STORAGE as string,
    });
    const cid = await client.put(finalFiles);
    setCid(cid);
    // const formData = new FormData();
    // files.map((file) => {
    //   if (file) {
    //     formData.append(file.name, file);
    //   }
    //   return false;
    // });
    // const response = await axios.post(
    //   "https://music-assets-storage-ynfarb57wa-uc.a.run.app/upload",
    //   formData
    // );
    // if (response.data.cid) {
    //   setCid(response.data.cid);
    // } else {
    //   alert("Some error Occured, please try again later.");
    //   setIsTxDialogOpen(false);
    //   return;
    // }
    setActiveTxStep(1);
  };
  useEffect(() => {
    if (cid) {
      onTx();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cid]);

  const encryptFiles = async (files: File[]): Promise<File[]> => {
    const filePromises = files.map((file) => {
      return new Promise<File>((res) => {
        const reader = new FileReader();
        reader.addEventListener("load", (event: any) => {
          const buff = event.target.result;
          var wordArray = CryptoJS.lib.WordArray.create(buff);
          var encrypted = CryptoJS.AES.encrypt(
            wordArray,
            process.env.REACT_APP_ENCRYPTION_KEY
          ).toString();
          const newEncryptedFile = new File([encrypted], file.name);
          res(newEncryptedFile);
        });
        reader.readAsArrayBuffer(file);
      });
    });
    return Promise.all(filePromises);
    // await new Promise((res) => {
    //   const reader = new FileReader();
    //   reader.addEventListener("load", async (event: any) => {
    //     const buff = event.target.result;
    //     var wordArray = CryptoJS.lib.WordArray.create(buff);
    //     var encrypted = CryptoJS.AES.encrypt(
    //       wordArray,
    //       "1234567887654321"
    //     ).toString();
    //     const file = new File([encrypted], "fileName");
    //     console.log(file);
    //   });
    //   reader.readAsArrayBuffer(fullTrackFile as File);
    // });
  };
  const onTxDialogClose = () => {
    setIsTxDialogOpen(false);
    navigate("/");
  };

  const testTx = async () => {
    const aliceSigner: OfflineDirectSigner = await getAliceSignerFromMnemonic();
    const alice = (await aliceSigner.getAccounts())[0].address;
    console.log("Alice's address from signer", alice);
    const { creator, signingClient } = await getSigningStargateClient();
    const { msgCreateSection } = await txClient(aliceSigner);
    const fromJson = MsgCreateSection.fromJSON({
      creator: alice,
      fullTrackID: 0, //TODO
      sectionName: "testTx",
      sectionStartTimeMs: 1000,
      sectionEndTimeMs: 2000,
    });
    const msgEncoded = msgCreateSection(fromJson);
    const tx = await signingClient.signAndBroadcast(
      creator,
      [msgEncoded],
      "auto"
    );
    debugger;
  };

  return (
    <Box sx={{ bgcolor: "background.paper", minHeight: "100vh" }}>
      <Box p={{ xs: 4, md: 10 }}>
        <Typography variant="h4" fontWeight="600" align="left">
          Music Metadata Information
        </Typography>
        <Button onClick={testTx}>Test</Button>
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
                  {/* <TextField
                    variant="outlined"
                    onChange={(e: any) => setKey(e.target.value)}
                  ></TextField> */}
                  <Select
                    variant="outlined"
                    onChange={(e: any) => setKey(e.target.value)}
                  >
                    {musicKeys.map(({ key, id }) => {
                      return (
                        <MenuItem value={id}>{key.toUpperCase()}</MenuItem>
                      );
                    })}
                    {/* 
                    <MenuItem value={"Vocal"}>C Minor</MenuItem>
                    <MenuItem value={"Instrumental"}>Instrumental</MenuItem>
                    <MenuItem value={"Bass"}>Bass</MenuItem>
                    <MenuItem value={"Drums"}>Drums</MenuItem> */}
                  </Select>
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
              <Grid item xs={10} md={4}>
                <Box>
                  <Typography>Encrypt Assets</Typography>
                  <Checkbox
                    value={isEncryptFiles}
                    onChange={(e) => setIsEncryptFiles(e.target.checked)}
                    sx={{ "& .MuiSvgIcon-root": { fontSize: 28 } }}
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
          sectionsObj={sectionsObj}
          setSectionsObj={setSectionsObj}
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
            {Object.values(stemsObj).map(({ file, name, type }, i) => (
              <Box>
                <Box display="flex" justifyContent="center">
                  <Select
                    size="small"
                    value={type}
                    onChange={(e) => {
                      const newObject = { ...stemsObj };
                      newObject[i].type = String(e.target.value);
                      setStemsObj(newObject);
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
                      const newObject = { ...stemsObj };
                      newObject[i].name = e.target.value;
                      setStemsObj(newObject);
                    }}
                  ></TextField>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
        <Box mt={8} display="flex" justifyContent="center">
          <Button variant="contained" color="primary" onClick={onTxClick}>
            Send To Blockchain
          </Button>
        </Box>
      </Box>
      <TransactionDialog
        isTxDialogOpen={isTxDialogOpen}
        activeTxStep={activeTxStep}
        onTxDialogClose={onTxDialogClose}
        fullTrackHash={fullTrackHash}
        stemsHash={stemsHash}
        sectionsHash={sectionsHash}
        isEncryptFiles={isEncryptFiles}
      />
    </Box>
  );
}

export default App;
