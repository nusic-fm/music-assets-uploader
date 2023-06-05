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
  Chip,
  Tooltip,
  Skeleton,
  FormControlLabel,
  styled,
  SwitchProps,
  Switch,
  Autocomplete,
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
// import {
//   DirectSecp256k1HdWallet,
//   OfflineDirectSigner,
//   OfflineSigner,
// } from "@cosmjs/proto-signing";
import { getSigningStargateClient, txClient } from "./module";
// import {
//   MsgCreateFullTrack,
//   MsgCreateSection,
//   MsgCreateStem,
// } from "./module/types/metadatalayercosmos/tx";
import { ChainInfo } from "@keplr-wallet/types";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { songMoodsOptions } from "./utils/songMoods";
import CreditsRows from "./components/CreditsRows";
import MasterRecordingOwnerships from "./components/MasterRecordingOwnerships";
import CompositionOwnerships from "./components/CompositionOwnerships";

export const rpc = process.env.REACT_APP_RPC as string;
export const rest = process.env.REACT_APP_REST as string;
// export const cosmosChainId = "metadatalayercosmos";
export const cosmosChainId = process.env.REACT_APP_COSMOS_CHAINID as string;
const chainName = process.env.REACT_APP_COSMOS_CHAIN_NAME as string;

export const getCheckersChainInfo = (): ChainInfo => ({
  chainId: cosmosChainId,
  chainName,
  rpc,
  rest,
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
      coinDenom: "NUSIC",
      coinMinimalDenom: "nusic",
      coinDecimals: 0,
      coinGeckoId: "nusic",
    },
  ],
  feeCurrencies: [
    {
      coinDenom: "NUSIC",
      coinMinimalDenom: "nusic",
      coinDecimals: 0,
      coinGeckoId: "nusic",
    },
  ],
  stakeCurrency: {
    coinDenom: "NUSIC",
    coinMinimalDenom: "nusic",
    coinDecimals: 0,
    coinGeckoId: "nusic",
  },
  coinType: 118,
  gasPriceStep: {
    low: 1,
    average: 1,
    high: 1,
  },
  features: ["stargate", "ibc-transfer", "no-legacy-stdTx"],
});

// const getAliceSignerFromMnemonic = async (): Promise<OfflineDirectSigner> => {
//   return DirectSecp256k1HdWallet.fromMnemonic(aliceMnemonic, {
//     prefix: "nusic",
//   });
//   // return new Promise((resolve) => {
//   //     readFile("./testnet.alice.mnemonic.key", (err, data) => {
//   //         const wallet = DirectSecp256k1HdWallet.fromMnemonic(data.toString(), {
//   //             prefix: "cosmos",
//   //         })
//   //         resolve(wallet);
//   //     })
//   // })
// };

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

const IOSSwitch = styled((props: SwitchProps) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: theme.palette.mode === "dark" ? "#2ECA45" : "#573FC8",
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color:
        theme.palette.mode === "light"
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 22,
    height: 22,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === "light" ? "#c4c4c4" : "#39393D",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));

const getWithoutSpace = (str: string) => str?.split(" ").join("");
// const aliceMnemonic =
//   "cost hello lounge proof dinner ask degree spoil donor brown diary midnight cargo fog enroll across cupboard zero chief gate decade toss pretty profit";

function App() {
  const [fullTrackFile, setFullTrackFile] = useState<File>();
  const [cid, setCid] = useState<string>();
  const [artist, setArtist] = useState<string>();
  const [featureArtists, setFeatureArtists] = useState<string[]>([]);
  const [title, setTitle] = useState<string>();
  const [album, setAlbum] = useState<string>();
  const [projectType, setProjectType] = useState<string>();
  const [genrePrimary, setGenrePrimary] = useState<string>();
  const [genreSecondary, setGenreSecondary] = useState<string>();
  const [songMoods, setSongMoods] = useState<string[]>([]);
  const [songType, setSongType] = useState<string>();
  const [key, setKey] = useState<string>();
  const [duration, setDuration] = useState<number>();
  const [bpm, setBpm] = useState<number>();
  const [timeSignature, setTimeSignature] = useState<string>();
  const [noOfBeatsPerBar, setNoOfBeatsPerBar] = useState<number>(0);
  const [noOfBars, setNoOfBars] = useState<number>();
  const [noOfBeats, setNoOfBeats] = useState<number>();

  const [isrcCode, setIsrcCode] = useState<string>();
  const [upcCode, setUpcCode] = useState<string>();
  const [recordLabel, setRecordLabel] = useState<string>();
  const [distributor, setDistributor] = useState<string>();
  const [dateCreated, setDateCreated] = useState<string>();

  const [credits, setCredits] = useState({ 1: {} });
  const [masterOwnerships, setMasterOwnerships] = useState({ 1: {} });
  const [compositionOwnerships, setCompositionOwnerships] = useState({ 1: {} });
  const [lyrics, setLyrics] = useState<string>();
  const [language, setLanguage] = useState<string>();
  const [explicitLyrics, setExplicitLyrics] = useState<boolean>();

  const [additionalCreationRow, setAdditionalCreationRow] = useState(false);
  const [locations, setLocations] = useState([]);

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

  const [userAddress, setUserAddress] = useState<string>();
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

  const processTx = async () => {
    const titleWithoutSpace = getWithoutSpace(title as string)?.slice(0, 10);
    const genrePrimaryWithoutSpace = getWithoutSpace(genrePrimary as string);
    const fullTrackContent = {
      id: `fulltrack${titleWithoutSpace}${genrePrimaryWithoutSpace}${key}${bpm}`,
      cid,
      artist,
      featureArtists,
      title,
      album,
      projectType,
      genrePrimary,
      genreSecondary,
      songMoods,
      songType,
      key,
      duration,
      startBeatOffsetMs: startBeatOffsetMs.toString(),
      bpm,
      timeSignature,
      noOfBars,
      noOfBeats,
      isrcCode,
      upcCode,
      recordLabel,
      distributor,
      dateCreated,
      credits,
      masterOwnerships,
      compositionOwnerships,
      lyrics,
      language,
      explicitLyrics,
      sections: Object.keys(sectionsObj).length,
      stems: Object.keys(stemsObj).length,
    };

    // const { creator, signingClient } = await getSigningStargateClient();
    // const { keplr } = window;
    // if (!keplr) {
    //   alert("You need to install Keplr");
    //   return;
    // }
    // const offlineSigner: OfflineSigner = keplr.getOfflineSigner!(cosmosChainId);
    // const { msgCreateFullTrack, msgCreateSection, msgCreateStem } =
    //   await txClient(offlineSigner);

    // let parentFullTrackId;
    // try {
    //   const fromJson = MsgCreateFullTrack.fromJSON({
    //     creator,
    //     cid,
    //     artistName: artist,
    //     featureArtists,
    //     trackTitle: title,
    //     album,
    //     genrePrimary,
    //     genreSecondary,
    //     songMoods,
    //     songType,
    //     key,
    //     bpm,
    //     timeSignature,
    //     bars: noOfBars,
    //     beats: noOfBeats,
    //     durationMs: (duration || 0) * 1000,
    //     startBeatOffsetMs: startBeatOffsetMs.toString(),
    //     sectionsCount: Object.keys(sectionsObj).length,
    //     stemsCount: Object.keys(stemsObj).length,
    //     isrcCode,
    //     upcCode,
    //     recordLabel,
    //     distributor,
    //     dateCreated,
    //   });
    //   const msgEncoded = msgCreateFullTrack(fromJson);
    //   // // const broadCast = await signAndBroadcast([msgEncoded]);
    //   const broadCast = await signingClient.signAndBroadcast(
    //     creator,
    //     [msgEncoded],
    //     "auto"
    //   );
    //   const id = JSON.parse(
    //     JSON.parse(broadCast.rawLog || "")[0].events[1].attributes[0].value
    //   );
    //   const creatorAddress = JSON.parse(
    //     JSON.parse(broadCast.rawLog || "")[0].events[1].attributes[1].value
    //   );
    //   parentFullTrackId = id;
    //   console.log(broadCast, id, creatorAddress);
    // } catch (err) {
    //   console.log("error: ", err);
    //   alert("Error creating fulltrack tx.");
    //   return;
    // }

    setActiveTxStep(2);
    // Stems
    const stems = Object.values(stemsObj);
    const stemsContent = [];
    // const broadCastStemsMsgs = [];
    if (stems.length) {
      for (let i = 0; i < stems.length; i++) {
        const stemObj = stems[i];
        stemsContent.push({
          id: `stem${
            i + 1
          }${titleWithoutSpace}${genrePrimaryWithoutSpace}${key}${bpm}`,
          cid,
          name: stemObj.name,
          type: stemObj.type,
        });
        // const fromJson = MsgCreateStem.fromJSON({
        //   creator,
        //   fullTrackID: parentFullTrackId,
        //   stemCid: cid, //TODO
        //   stemName: stemObj.name,
        //   stemType: stemObj.type,
        // });
        // const msgEncoded = msgCreateStem(fromJson);
        // broadCastStemsMsgs.push(msgEncoded);
      }
      //   try {
      //     //// const broadCastedStems = await signAndBroadcast(broadCastStemsMsgs);
      //     // const broadCastedStems = await signingClient.signAndBroadcast(
      //     //   creator,
      //     //   broadCastStemsMsgs,
      //     //   "auto"
      //     // );
      //     // console.log({ broadCastStemsMsgs });
      //     // console.log({ broadCastedStems });
      //   } catch (err) {
      //     console.log("error: ", err);
      //     alert("Error creating stems tx.");
      //   }
    }
    // setActiveTxStep(3);

    // Section
    const sections = Object.values(sectionsObj);
    const sectionsContent = [];
    if (sections.length) {
      const broadCastSectionsMsgs = [];
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        // const fromJson = MsgCreateSection.fromJSON({
        //   creator,
        //   fullTrackID: parentFullTrackId,
        //   sectionName: section.name,
        //   sectionStartTimeMs: section.start * 1000,
        //   sectionEndTimeMs: section.end * 1000,
        // });
        //     const msgEncoded = msgCreateSection(fromJson);
        //     broadCastSectionsMsgs.push(msgEncoded);
        sectionsContent.push({
          id: `section${
            i + 1
          }${titleWithoutSpace}${genrePrimaryWithoutSpace}${key}${bpm}`,
          name: section.name,
          startMs: section.start * 1000,
          endMs: section.end * 1000,
          bars: section.bars,
          beats: section.bars * noOfBeatsPerBar,
        });
        //     // const sectionHash = await new Promise<string>((res) => {
        //     //   api.tx.uploadModule
        //     //     .createSection(
        //     //       `section${
        //     //         i + 1
        //     //       }${titleWithoutSpace}${genreWithoutSpace}${key}${bpm}`,
        //     //       section.name,
        //     //       section.start * 1000,
        //     //       section.end * 1000,
        //     //       section.bars,
        //     //       section.bars * noOfBeatsPerBar
        //     //     )
        //     //     .signAndSend(account, ({ events = [], status }) => {
        //     //       if (status.isFinalized) {
        //     //         console.log(
        //     //           `Transaction included at blockHash ${status.asFinalized}`
        //     //         );

        //     //         // Loop through Vec<EventRecord> to display all events
        //     //         events.forEach(({ phase, event: { data, method, section } }) => {
        //     //           console.log(`\t' ${phase}: ${section}.${method}:: ${data}`);
        //     //         });
        //     //         res(status.hash.toString());
        //     //       }
        //     //     });
        //     // });
        //     // setSectionsHash([...sectionsHash, sectionHash]);
      }
      //   try {
      //     // const broadCastedStems = await signAndBroadcast(broadCastSectionsMsgs);
      //     console.log({ broadCastSectionsMsgs });
      //     const broadCastedStems = await signingClient.signAndBroadcast(
      //       creator,
      //       [...broadCastSectionsMsgs, ...broadCastStemsMsgs],
      //       "auto"
      //     );
      //     console.log(broadCastedStems);
      //   } catch (err) {
      //     console.log("error: ", err);
      //     alert("Error creating sections tx.");
      //   }
    }
    download(
      JSON.stringify({
        fullTrackContent,
        stemsContent,
        sectionsContent,
        // fullTrackId: parentFullTrackId,
      }),
      `NUSIC-${titleWithoutSpace}-metadata.json`,
      "text/plain"
    );
    setActiveTxStep(4);
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
    const storeFiles = !process.env.REACT_APP_IGNORE_STORAGE;
    if (storeFiles) {
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
    } else {
      setCid("test_cid_here");
    }
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
      processTx();
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
    // navigate("/");
    window.location.reload();
  };

  const login = async () => {
    // const aliceSigner: OfflineDirectSigner = await getAliceSignerFromMnemonic();
    // const alice = (await aliceSigner.getAccounts())[0].address;
    // console.log("Alice's address from signer", alice);
    const { creator } = await getSigningStargateClient();
    setUserAddress(creator);
    // const chainId = await signingClient.getChainId();
    // console.log({ creator, chainId });
    // const { keplr } = window;
    // if (!keplr) {
    //   alert("You need to install Keplr");
    //   return;
    // }
    // const offlineSigner: OfflineSigner =
    //   keplr.getOfflineSigner!(cosmosChainId);
    // const { msgCreateFullTrack, signAndBroadcast } = await txClient(
    //   offlineSigner
    // );
    // const fromJson = MsgCreateFullTrack.fromJSON({
    //   creator,
    //   cid: "cid",
    //   artistName: "artist",
    //   trackTitle: "title",
    //   album: "album",
    // });
    // const msgEncoded = msgCreateFullTrack(fromJson);
    // const tx = await signingClient.signAndBroadcast(
    //   creator,
    //   [msgEncoded],
    //   "auto"
    // );
    // // const tx = await signAndBroadcast([msgEncoded]);
    // console.log(tx);
  };

  return (
    <Box sx={{ bgcolor: "background.paper", minHeight: "100vh" }}>
      <Box
        sx={{ bgcolor: "#fff" }}
        display="flex"
        justifyContent="space-between"
        px={{ xs: 4 }}
        py={3}
      >
        <img src="/diaspora.png" alt="" width={"200px"} />
        {/* {userAddress ? (
          <Tooltip title={userAddress}>
            <Chip
              clickable
              label={`${userAddress.slice(0, 8)}...${userAddress.slice(
                userAddress.length - 4
              )}`}
            />
          </Tooltip>
        ) : (
          <Button variant="contained" onClick={login}>
            Login
          </Button>
        )} */}
      </Box>
      <Box p={{ xs: 4 }}>
        <Box display={"flex"} alignItems="center" gap={{ xs: 1, md: 4 }}>
          <Typography
            variant="h5"
            fontWeight="600"
            // align="left"
            fontFamily={"Roboto"}
          >
            Music Metadata Information
          </Typography>
          <MusicUploader
            fullTrackFile={fullTrackFile}
            setFullTrackFile={setFullTrackFile}
            setFileUrl={setFileUrl}
            setDuration={setDuration}
          />
        </Box>
        <Grid container mt={8} gap={{ xs: 2 }}>
          <Grid item xs={12} md={7}>
            <Grid container gap={2}>
              <Grid item xs={10} md={4}>
                <Box>
                  <Typography>Artist</Typography>
                  <TextField
                    variant="outlined"
                    onChange={(e: any) => setArtist(e.target.value)}
                    fullWidth
                    size="small"
                  ></TextField>
                </Box>
              </Grid>
              <Grid item xs={10} md={4}>
                <Box>
                  <Typography>Feature Artists</Typography>
                  <Autocomplete
                    multiple
                    options={[]}
                    value={featureArtists}
                    onChange={(e, values: string[]) =>
                      setFeatureArtists(values)
                    }
                    // defaultValue={[top100Films[13].title]}
                    freeSolo
                    renderTags={(value: readonly string[], getTagProps) =>
                      value.map((option: string, index: number) => (
                        <Chip
                          variant="outlined"
                          label={option}
                          size="small"
                          {...getTagProps({ index })}
                        />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        helperText="Press Enter to add"
                        // variant="filled"
                        // label="freeSolo"
                        // placeholder="Favorites"
                      />
                    )}
                    size="small"
                  />
                </Box>
              </Grid>
              <Grid item xs={10} md={4}>
                <Box>
                  <Typography>Track Title</Typography>
                  <TextField
                    variant="outlined"
                    fullWidth
                    onChange={(e: any) => setTitle(e.target.value)}
                    size="small"
                  ></TextField>
                </Box>
              </Grid>
              <Grid item xs={6} md={4}>
                <Box>
                  <Typography>Album Name</Typography>
                  <TextField
                    variant="outlined"
                    onChange={(e: any) => setAlbum(e.target.value)}
                    fullWidth
                    size="small"
                  ></TextField>
                </Box>
              </Grid>
              {/* <Grid item md={1}></Grid> */}
              <Grid item xs={2} md={2}>
                <Box>
                  <Typography>Project Type</Typography>
                  <Select
                    onChange={(e) => setProjectType(e.target.value as string)}
                    fullWidth
                    size="small"
                  >
                    <MenuItem value="Single">Single</MenuItem>
                    <MenuItem value="Ep">Ep</MenuItem>
                    <MenuItem value="Album">Album</MenuItem>
                    <MenuItem value="Single">Single</MenuItem>
                    <MenuItem value="Playlist">Playlist</MenuItem>
                  </Select>
                </Box>
              </Grid>
              <Grid item xs={10} md={4}>
                <Box>
                  <Typography>Genre Primary</Typography>
                  <TextField
                    variant="outlined"
                    onChange={(e: any) => setGenrePrimary(e.target.value)}
                    fullWidth
                    size="small"
                  ></TextField>
                </Box>
              </Grid>
              <Grid item xs={10} md={4}>
                <Box>
                  <Typography>Genre Secondary</Typography>
                  <TextField
                    variant="outlined"
                    onChange={(e: any) => setGenreSecondary(e.target.value)}
                    fullWidth
                    size="small"
                  ></TextField>
                </Box>
              </Grid>
              <Grid item xs={10} md={4}>
                <Box>
                  <Typography>Song Mood (Up to 3 Optional)</Typography>
                  <Autocomplete
                    multiple
                    options={songMoodsOptions}
                    // defaultValue={[top100Films[13].title]}
                    freeSolo
                    value={songMoods}
                    onChange={(e, values: string[]) => setSongMoods(values)}
                    renderTags={(value: readonly string[], getTagProps) =>
                      value.map((option: string, index: number) => (
                        <Chip
                          variant="outlined"
                          label={option}
                          {...getTagProps({ index })}
                        />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        helperText="Press Enter to add"
                        // variant="filled"
                        // label="freeSolo"
                        // placeholder="Favorites"
                      />
                    )}
                    size="small"
                  />
                </Box>
              </Grid>
              <Grid item xs={10} md={4}>
                <Box>
                  <Typography>Song Type</Typography>
                  <Select
                    fullWidth
                    size="small"
                    value={songType}
                    onChange={(e) => setSongType(e.target.value as string)}
                  >
                    <MenuItem value={"Original"}>Original</MenuItem>
                    <MenuItem value={"Remix"}>Remix</MenuItem>
                    <MenuItem value={"Accapella"}>Accapella</MenuItem>
                    <MenuItem value="Acoustic">Acoustic</MenuItem>
                    <MenuItem value="Cover">Cover</MenuItem>
                    <MenuItem value="Live Recording">Live Recording</MenuItem>
                  </Select>
                  {/* <TextField
                    variant="outlined"
                    onChange={(e: any) => setSongType(e.target.value)}
                    size="small"
                    fullWidth
                  ></TextField> */}
                </Box>
              </Grid>
              <Grid item xs={10} md={2}>
                <Box>
                  <Typography>Song Key</Typography>
                  <Select
                    fullWidth
                    variant="outlined"
                    onChange={(e: any) => setKey(e.target.value)}
                    size="small"
                  >
                    {musicKeys.map(({ key, id }) => {
                      return (
                        <MenuItem value={id} key={id}>
                          {key.toUpperCase()}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </Box>
              </Grid>
              {/* <Grid item xs={10} md={4}>
                <Box>
                  <MusicUploader
                    fullTrackFile={fullTrackFile}
                    setFullTrackFile={setFullTrackFile}
                    setFileUrl={setFileUrl}
                    setDuration={setDuration}
                  />
                </Box>
              </Grid> */}
              <Grid item xs={10} md={4}>
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
                    size="small"
                    endAdornment={
                      <Tooltip title="Auto fetch from the Uploaded Track">
                        <InputAdornment position="end">
                          <IconButton
                            onClick={onFetchStartBeatOffet}
                            edge="end"
                          >
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
                    onChange={(e: any) => setBpm(parseInt(e.target.value))}
                    size="small"
                    fullWidth
                  ></TextField>
                </Box>
              </Grid>
              <Grid item xs={10} md={4}>
                <Box>
                  <Typography>Time Signature</Typography>
                  <TextField
                    required
                    variant="outlined"
                    onChange={(e: any) => setTimeSignature(e.target.value)}
                    size="small"
                    fullWidth
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
              {/* <Grid item xs={12}>
                <Divider />
              </Grid> */}
              <Grid item xs={10} md={4}>
                <Box>
                  <Typography>ISRC Code</Typography>
                  <TextField
                    fullWidth
                    size="small"
                    onChange={(e) => setIsrcCode(e.target.value)}
                  ></TextField>
                </Box>
              </Grid>
              <Grid item xs={10} md={4}>
                <Box>
                  <Typography>UPC Code</Typography>
                  <TextField
                    fullWidth
                    size="small"
                    onChange={(e) => setUpcCode(e.target.value)}
                  ></TextField>
                </Box>
              </Grid>
              <Grid item xs={10} md={4}>
                <Box>
                  <Typography>Record Label</Typography>
                  <TextField
                    fullWidth
                    size="small"
                    onChange={(e) => setRecordLabel(e.target.value)}
                  ></TextField>
                </Box>
              </Grid>
              <Grid item xs={10} md={4}>
                <Box>
                  <Typography>Distributor</Typography>
                  <TextField
                    fullWidth
                    size="small"
                    onChange={(e) => setDistributor(e.target.value)}
                  ></TextField>
                </Box>
              </Grid>
              <Grid item xs={10} md={4}>
                <Box>
                  <Typography>Date Created</Typography>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      onChange={(value, cotext) => {
                        setDateCreated((value as Date).toJSON());
                      }}
                    />
                  </LocalizationProvider>
                </Box>
              </Grid>
              <Grid item md={8}></Grid>
              <CreditsRows rowsObj={credits} setCredits={setCredits} />

              <Grid item xs={12}>
                <Typography variant="body1" fontWeight={700}>
                  Location of Creation (max 2)
                </Typography>
              </Grid>
              <Grid item xs={10} md={4}>
                <Box>
                  <Typography>Studio Name</Typography>
                  <TextField fullWidth size="small" />
                </Box>
              </Grid>
              <Grid item xs={10} md={4}>
                <Box display={"flex"} justifyContent="space-between" gap={2}>
                  <Box>
                    <Typography>City</Typography>
                    <TextField fullWidth size="small"></TextField>
                  </Box>
                  <Box>
                    <Typography>State</Typography>
                    <TextField fullWidth size="small" />
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={6} md={2}>
                <Box>
                  <Typography>Country</Typography>
                  <TextField fullWidth size="small"></TextField>
                </Box>
              </Grid>
              <Grid item xs={6} md={1}>
                <Box>
                  <Typography>
                    <br />
                  </Typography>
                  <Button
                    variant="outlined"
                    disabled={additionalCreationRow}
                    onClick={() => setAdditionalCreationRow(true)}
                  >
                    Add
                  </Button>
                </Box>
              </Grid>
              {additionalCreationRow && (
                <>
                  <Grid item xs={10} md={4}>
                    <Box>
                      <Typography>Studio Name</Typography>
                      <TextField fullWidth size="small" />
                    </Box>
                  </Grid>
                  <Grid item xs={10} md={4}>
                    <Box
                      display={"flex"}
                      justifyContent="space-between"
                      gap={2}
                    >
                      <Box>
                        <Typography>City</Typography>
                        <TextField fullWidth size="small"></TextField>
                      </Box>
                      <Box>
                        <Typography>State</Typography>
                        <TextField fullWidth size="small" />
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={6} md={2}>
                    <Box>
                      <Typography>Country</Typography>
                      <TextField fullWidth size="small"></TextField>
                    </Box>
                  </Grid>
                  <Grid item xs={6} md={1}></Grid>
                </>
              )}
              <Grid item xs={12}>
                <Typography variant="body1" fontWeight={700}>
                  Master Recording Ownership (up to 4)
                </Typography>
              </Grid>
              <MasterRecordingOwnerships
                rowsObj={masterOwnerships}
                setOwnerships={setMasterOwnerships}
              />
              <Grid item xs={12}>
                <Typography variant="body1" fontWeight={700}>
                  Composition Ownership (up to 8)
                </Typography>
              </Grid>
              <CompositionOwnerships
                rowsObj={compositionOwnerships}
                setOwnerships={setCompositionOwnerships}
              />
              <Grid xs={12}>
                <Box>
                  <Typography>Lyrics</Typography>
                  <TextField
                    multiline
                    minRows={4}
                    maxRows={10}
                    fullWidth
                    sx={{ mt: 0.5 }}
                    onChange={(e) => setLyrics(e.target.value)}
                  ></TextField>
                </Box>
              </Grid>
              <Grid xs={8} md={4}>
                <Box>
                  <Typography>Language</Typography>
                  <TextField
                    fullWidth
                    size="small"
                    onChange={(e) => setLanguage(e.target.value)}
                  ></TextField>
                </Box>
              </Grid>
              <Grid xs={2} md={2}>
                <Box>
                  <Typography>Explicit Lyrics</Typography>
                  <Checkbox
                    onChange={(e, checked) => setExplicitLyrics(checked)}
                  ></Checkbox>
                </Box>
              </Grid>
              {/* <Grid item xs={10} md={4}>
                <Box>
                  <Typography>Encrypt Assets</Typography>
                  <Checkbox
                    value={isEncryptFiles}
                    onChange={(e) => setIsEncryptFiles(e.target.checked)}
                    sx={{ "& .MuiSvgIcon-root": { fontSize: 28 } }}
                  />
                </Box>
              </Grid> */}
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
                  variant="h6"
                  p={1}
                  color={"black"}
                  textAlign="center"
                  fontFamily={"Roboto"}
                >
                  Overview
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
                        <Typography color="black">{genrePrimary}</Typography>
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
      <Box mt={20} pb={8}>
        <Typography variant="h5" align="center" fontFamily="monospace">
          Powered By
        </Typography>
        {/* <Typography variant="h3" align="center">
          NUSIC
        </Typography> */}
        <Box display="flex" justifyContent="center" p={2} my={2}>
          <Button href="//nusic.fm" target="_blank">
            <img src="/nusic_black.png" alt="nusic" width="250px"></img>
          </Button>
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="h5" fontFamily="Roboto" align="center">
            The Decentralized Financial Rails for Music
          </Typography>
          <Box maxWidth={{ md: "33%" }} mt={2} px={2}>
            <Typography align="center" fontFamily="Open Sans" variant="body1">
              NUSIC empowers you to release music into Web 3 on your own terms,
              under your own brand, for your own community. Our solutions have
              won multiple awards from top Web 3 infrastructure providers & our
              distributed team is ready to plug your music into the
              decentralized financial rails that power music on the next
              generation of the internet.
            </Typography>
          </Box>
          {/* <Box my={2}>
            <TextField
              placeholder="Spotify Artist ID"
              onChange={(e) => setSpotifyArtistId(e.target.value)}
            />
          </Box> */}
          {/* <Button
            variant="contained"
            onClick={onSpotifyId}
            // size="small"
            sx={{
              fontFamily: "BenchNine",
              borderRadius: "18px",
              // textTransform: "unset",
              // fontWeight: "900",
            }}
          >
            Plug in your music now
          </Button> */}
        </Box>
      </Box>
    </Box>
  );
}

export default App;

// OLD

// const aliceSigner: OfflineDirectSigner = await getAliceSignerFromMnemonic();
// const alice = (await aliceSigner.getAccounts())[0].address;
// console.log("Alice's address from signer", alice);
// const {
//   signAndBroadcast,
//   msgCreateFullTrack,
//   msgCreateSection,
//   msgCreateStem,
// } = await txClient(aliceSigner);

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
// const sectionTxs = await Promise.all(sectionsTxPromises);
// console.log({ sectionTxs });
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
