/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { CrossmintPayButton } from "@crossmint/client-sdk-react-ui";
import {
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import SolAbi from "./abis/SolAbi.json";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { logFirebaseEvent } from "./services/firebase.service";
import {
  createUser,
  getUserById,
  getUserDocsFromIds,
  updateUser,
} from "./services/db/users.service";
import SaveIcon from "@mui/icons-material/Save";
import { User } from "./models/User";
import * as cherryMintDataList from "./data/cherry/cherryData.json";
import {
  cancelOffer,
  createOffer,
  getOffersFromId,
  updateOffer,
} from "./services/db/offers.service";
import { Offer, OfferDbDoc } from "./models/Offer";
import MakeOfferDialog from "./components/MakeOfferDialog";
import { useWeb3React } from "@web3-react/core";
import useAuth from "./hooks/useAuth";
import AvatarOrNameDicord from "./components/AvatarOrNameDiscord";
import { getTokens, updateTokenOwner } from "./services/db/tokens.service";
import { Token } from "./models/Token";
import ProfileDialog from "./components/ProfileDialog";
import { LoadingButton } from "@mui/lab";
import AlertSnackBar from "./components/AlertSnackBar";
import AcceptOfferDialog from "./components/AcceptOfferDialog";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckIcon from "@mui/icons-material/Check";
import { getEthPrice, getOwnerOfNft, getWethBalance } from "./utils/helper";
// signInWithFacebook();
const baseUrl = "https://discord.com/api/oauth2/authorize";
const clientId = process.env.REACT_APP_DISCORD_CLIENT_ID as string;
const redirectUri = process.env.REACT_APP_REDIRECT_URL as string;
const responseType = "token";
const scope = "identify";
const localStorageAccessTokenKey = "nusic_discord_access_token";
const localStorageTokenTypeKey = "nusic_discord_token_type";

const sections: string[] = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
  "13",
  "14",
];

interface TrackMetadata {
  artist: string;
  title: string;
  genre: string;
  bpm: number;
  key: string;
  coverUrl: string;
  profileUrl: string;
  tiktokProfileUrl?: string;
  noOfSections: number;
  socials?: {
    tiktok: string;
    twitter: string;
    discord: string;
    instagram: string;
    youtube: string;
    spotify: string;
  };
}
const tracks: TrackMetadata[] = [
  {
    artist: "Mackenzie Sol",
    title: "Happy Ever After All",
    genre: "Pop",
    bpm: 190,
    key: "A",
    coverUrl: "/artist-covers/sol.png",
    profileUrl: "/artist-covers/sol.png",
    tiktokProfileUrl: "",
    noOfSections: 16,
  },
  {
    artist: "mmmCherry",
    title: "The Point of No Return",
    genre: "Alt-Pop",
    bpm: 167,
    key: "G Minor",
    coverUrl: "/cherry/banner.jpeg",
    profileUrl: "/cherry/feral.jpeg",
    socials: {
      tiktok: "tiktok.com/@mmmcherry",
      twitter: "twitter.com/mmmcherry",
      discord: "discord.gg/N8kPyFVavQ",
      instagram: "instagram.com/mmmcherrymusic",
      youtube: "youtube.com/channel/UCcfGu5v511FNCsrcBqwTafw",
      spotify: "open.spotify.com/artist/2pjOLjJD4lElSnRaeYad57",
    },
    noOfSections: 14,
  },
];

// const getTimerObj = () => {
//   const revealDate = "Fri, 14 Oct 2022 07:00:00 GMT";
//   const countDownDate = new Date(revealDate).getTime();
//   const timeleft = countDownDate - Date.now();
//   if (timeleft <= 0) {
//     return { isRevealed: true };
//   }
//   const days = Math.floor(timeleft / (1000 * 60 * 60 * 24));
//   const hours = Math.floor(
//     (timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
//   );
//   const minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
//   var seconds = Math.floor((timeleft % (1000 * 60)) / 1000);
//   return { days, hours, minutes, seconds, isRevealed: false };
// };

const ACCEPT_OFFER_URL = `${process.env.REACT_APP_MARKET_API}/accept-offer`;

const NonVisualizer = (props: { trackIdx: number }) => {
  const { trackIdx } = props;
  // const [firstClick, setFirstClick] = useState(false);
  // const [showDownloadIdx, setShowDownloadIdx] = useState("");
  const [ownTokenIds, setOwnTokenIds] = useState<string[]>([]);
  const [mintedTokenIds, setMintedTokenIds] = useState<string[]>([]);
  const [trackDetails, setTrackDetails] = useState<TrackMetadata>();
  const [, setAccessToken] = useState<string>();
  const [, setTokenType] = useState<string>();
  const [isListening, setIsListening] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [newlyMintedToken, setNewlyMintedToken] = useState<string>();
  const [spotifyArtistId, setSpotifyArtistId] = useState<string>();
  // const [mintedTokenUserDetails, setMintedTokenUserDetails] = useState<{
  //   [key: string]: User;
  // }>({});
  const [isNftRevealed, setIsNftRevealed] = useState(false);
  const [openOfferForTokenId, setOpenOfferForTokenId] = useState(-1);
  const [flipBoxIndex, setFlipBoxIndex] = useState<number[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState<User>();
  const location = useLocation();
  const [offersObj, setOffersObj] = useState<{ [i: number]: OfferDbDoc[] }>({
    // 1: [
    //   {
    //     amount: 0.1,
    //     denom: "weth",
    //     tokenId: 1,
    //     userId: user?.id || "",
    //     duration: new Date().toUTCString(),
    //     id: "1",
    //     isCancelled: false,
    //   },
    //   {
    //     amount: 120,
    //     denom: "usdc",
    //     tokenId: 1,
    //     userId: user?.id || "",
    //     duration: new Date().toUTCString(),
    //     id: "2",
    //     isCancelled: false,
    //   },
    // ],
  });
  const [randamNumber, setRandomNumber] = useState<number>();
  const [showAlertMessage, setShowAlertMessage] = useState<boolean | string>(
    false
  );
  // const timer = useRef<NodeJS.Timer | null>(null);
  // const [timerObj, setTimerObj] = useState(getTimerObj);
  const { account, library } = useWeb3React();
  const { login } = useAuth();
  // const countDown = () => {
  //   const newSeconds = seconds - 1;
  //   console.log({ seconds, newSeconds });
  //   setSeconds(newSeconds);
  // };
  const [acceptOffer, setAcceptOffer] = useState<OfferDbDoc>();

  const [ethUsdPrice, setEthUsdPrice] = useState<number>(0);

  const fetchPrice = async () => {
    const price = await getEthPrice();
    setEthUsdPrice(price);
  };

  // useEffect(() => {
  //   const myInterval = setInterval(() => {
  //     const _newTimerObj = getTimerObj();
  //     if (_newTimerObj.isRevealed) {
  //       setIsNftRevealed(true);
  //     }
  //     setTimerObj(_newTimerObj);
  //   }, 1000);
  //   return () => {
  //     clearInterval(myInterval);
  //   };
  // }, [timerObj]);

  const fetchUser = async (
    _tokenType: string,
    _accessToken: string,
    isAlertOnFail: boolean = true
  ) => {
    const url = "https://discord.com/api/users/@me";
    try {
      const response = await axios.get(url, {
        headers: { Authorization: `${_tokenType} ${_accessToken}` },
      });
      const { username, id, avatar, discriminator } = response.data;
      const userDocDb = await createUser(id, {
        name: username,
        uid: id,
        avatar,
        discriminator,
      });
      if (userDocDb) {
        // https://cdn.discordapp.com/avatars/879400465861869638/5d69e3e90a6d07b3cd15e4cd4e8a1407.png
        setUser(userDocDb);
        window.history.replaceState(null, "", window.location.origin);
      }
    } catch (e) {
      if (isAlertOnFail)
        setShowAlertMessage("Please click Sign In to continue");
    }
  };
  const refreshUser = async () => {
    if (user?.uid) {
      const _user = await getUserById(user?.uid);
      setUser(_user);
    }
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.hash.slice(1));
    const _accessToken = searchParams.get("access_token");
    const _tokenType = searchParams.get("token_type");
    if (_accessToken && _tokenType) {
      window.localStorage.setItem(localStorageAccessTokenKey, _accessToken);
      window.localStorage.setItem(localStorageTokenTypeKey, _tokenType);
      fetchUser(_tokenType, _accessToken);
      setTokenType(_tokenType);
      setAccessToken(_accessToken);
    }
  }, []);

  // useEffect(() => {
  //   if (newlyMintedToken) {
  //     downloadFile(newlyMintedToken);
  //     setListOfMintedTokens(false);
  //   }
  // }, [newlyMintedToken]);

  useEffect(() => {
    setTrackDetails(tracks[trackIdx]);
  }, [trackIdx]);

  const setListOfMintedTokens = async (isAttachListener: boolean = true) => {
    // const provider = new ethers.providers.AlchemyProvider(
    //   process.env.REACT_APP_CHAIN_NAME as string,
    //   process.env.REACT_APP_ALCHEMY as string
    // );
    // const contract = new ethers.Contract(
    //   process.env.REACT_APP_CONTRACT_ADDRESS as string,
    //   SolAbi,
    //   provider
    // );
    // if (isAttachListener) {
    //   console.log("Listening");
    //   contract.on("Minted", (to, id, parentTokenId, tokenId) => {
    //     setIsListening(false);
    //     if (id === user?.id) setNewlyMintedToken(tokenId.toString());
    //   });
    // }
    // const listOfData = await contract.getChildrenMetadata(0);
    // const listOfData = Array.from(cherryMintDataList);
    const listOfTokens = await getTokens();
    setTokens(listOfTokens);
    // const _mintedTokens = listOfData.filter(
    //   (data: any) => data.isMinted
    // ) as any;

    // const userIds = listOfData
    //   .map((data: any) => data.id)
    //   .filter((data: any) => data.length);
    // const _ownTokenIds = _mintedTokens
    //   .filter((data: any) => data.id === user?.id)
    //   .map((data: any) => data.tokenId.toString());
    setOwnTokenIds(
      listOfTokens.filter((t) => t.ownerId === user?.uid).map((t) => t.id)
    );
    // if (userIds.length) {
    // const uniqueArray = userIds.filter((id: any, pos: any) => {
    //   return userIds.indexOf(id) === pos;
    // });
    // let usersDetails = [];
    // if (uniqueArray.length > 10) {
    //   const usersDetailsOne = await getUserDocsFromIds(
    //     uniqueArray.slice(0, 10)
    //   );
    //   const usersDetailsTwo = await getUserDocsFromIds(uniqueArray.slice(10));
    //   usersDetails = [...usersDetailsOne, ...usersDetailsTwo];
    // } else {
    //   usersDetails = await getUserDocsFromIds(uniqueArray);
    // }
    const tokenIds = listOfTokens.map((t) => t.id);
    setMintedTokenIds(tokenIds);
    fetchPrice();
    // const userDetailsObj: { [key: string]: User } = {};
    // usersDetails.map((user) => {
    //   const tokensDetails = _mintedTokens.filter(
    //     (data: any) => data.id === user.uid
    //   );
    //   if (tokensDetails.length)
    //     tokensDetails.map(
    //       (tokenDetails: any) =>
    //         (userDetailsObj[tokenDetails.tokenId.toString()] = user)
    //     );
    //   return "";
    // });
    // userDetailsObj["12"] = { ...userDetailsObj["12"], name: "RandomPumpkin" };
    // setMintedTokenUserDetails(userDetailsObj);
    // }
    // const buyButtons = document.getElementsByClassName("crossmintButton-0-2-1");
    // Array.from(buyButtons).map((btn: any) => {
    //   const icon = btn?.firstChild;
    //   if (icon.tagName === "IMG") {
    //     btn?.removeChild(icon);
    //     if (btn?.children[0]) btn.children[0].innerText = "Buy";
    //   }
    //   return "";
    // });
  };
  useEffect(() => {
    // make it available for all
    setListOfMintedTokens();
    if (user) {
      // setListOfMintedTokens();
    } else {
      const _accessToken = window.localStorage.getItem(
        localStorageAccessTokenKey
      );
      const _tokenType = window.localStorage.getItem(localStorageTokenTypeKey);
      if (_accessToken && _tokenType) {
        fetchUser(_tokenType, _accessToken, false);
      }
    }
  }, [user, isNftRevealed]);

  const downloadFile = (tokenId: string) => {
    setIsDownloading(true);
    const id = (process.env.REACT_APP_FERALS as string).split(",")[
      Number(tokenId) - 1
    ];
    window.open(
      `https://storage.googleapis.com/nusic-data/marketplace/feral-v1/${id}.mov`
    );
    setShowAlertMessage("Download Successful");
    setIsDownloading(false);
    // TODO:
    // fetch("https://storage.googleapis.com/nusic-data/marketplace/feral/2.mov", {
    //   mode: "no-cors",
    // })
    //   .then((resp) => resp.blob())
    //   .then((blob) => {
    //     setIsDownloading(false);
    //     const url = window.URL.createObjectURL(blob);
    //     const a = document.createElement("a");
    //     a.style.display = "none";
    //     a.href = url;
    //     // the filename you want
    //     a.download = `Feral #${tokenId}.mov`;
    //     document.body.appendChild(a);
    //     a.click();
    //     window.URL.revokeObjectURL(url);
    //     alert("your file has downloaded!"); // or you know, something with better UX...
    //   })
    //   .catch(() => alert("Download failed. Please try again"));
  };

  // const onSignInWithFb = async () => {
  //   window.open(
  //     `${baseUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}`
  //   );
  // };
  const isTokenAlreadyMinted = (id: number) =>
    mintedTokenIds.includes(id.toString());
  const isTokenMintedByUser = (id: number) =>
    ownTokenIds.includes(id.toString());

  const onSpotifyId = (e: any) => {
    if (!user?.uid) {
      setShowAlertMessage("Please sign in and try again.");
      return;
    }
    if (!spotifyArtistId?.length) {
      setShowAlertMessage("Please enter valid Spotify Artist ID");
      return;
    }
    updateUser(user.uid, { artistId: spotifyArtistId });
    logFirebaseEvent("select_content", {
      content_type: "spotifyArtistId",
      content_id: spotifyArtistId,
    });
    setShowAlertMessage("Successfully submitted");
  };
  const onSubmitOffer = async (
    amount: number,
    denom: "weth" | "usdc",
    duration: string
  ) => {
    if (!account) {
      setShowAlertMessage("Please connect your wallet and try again.");
      setOpenOfferForTokenId(-1);
      return;
    }
    if (user && user.uid && account) {
      setIsLoading(true);
      let approvedHash: string;
      try {
        const signer = library.getSigner();
        const wethContract = new ethers.Contract(
          process.env.REACT_APP_WETH as string,
          [
            {
              inputs: [
                {
                  internalType: "address",
                  name: "spender",
                  type: "address",
                },
                {
                  internalType: "uint256",
                  name: "amount",
                  type: "uint256",
                },
              ],
              name: "approve",
              outputs: [
                {
                  internalType: "bool",
                  name: "",
                  type: "bool",
                },
              ],
              stateMutability: "nonpayable",
              type: "function",
            },
          ],
          signer
        );
        const tx = await wethContract.approve(
          process.env.REACT_APP_MASTER_CONTRACT_ADDRESS,
          ethers.utils.parseEther(amount.toString())
        );
        await tx.wait();
        approvedHash = tx.hash;
      } catch (e) {
        setShowAlertMessage("Transaction failed, please try again");
        console.log("Error: ", e);
        setIsLoading(false);
        return;
      }

      // signer.signMessage(
      //   `TokenId: ${openOfferForTokenId} Amount: ${amount} ${denom}, EndTime: ${duration}`
      // );
      // setOffersObj({
      //   ...offersObj,
      //   [openOfferForTokenId]: [
      //     ...(offersObj[openOfferForTokenId] || []),
      //     {
      //       amount,
      //       denom,
      //       duration,
      //       tokenId: openOfferForTokenId,
      //       userId: user.id,
      //       id: (Math.random() + 1).toString(36).substring(7),
      //       isCancelled: false,
      //     },
      //   ],
      // });
      try {
        const newOffer: Offer = {
          amount,
          denom,
          duration,
          userId: user.uid,
          userName: user.name,
          discriminator: user.discriminator || "0000",
          tokenId: openOfferForTokenId,
          walletAddress: account,
          isActive: true,
          isSold: false,
          approvedHash,
        };
        if (user.avatar) {
          newOffer.userAvatar = user.avatar;
        }
        await createOffer(newOffer);
      } catch (e) {
        console.log("Create ERROR: ", e);
        setShowAlertMessage("Error Occured: please try again later.");
        return;
      } finally {
        setIsLoading(false);
      }
      setShowAlertMessage("Your offer has been submitted successfully.");
    } else {
      setShowAlertMessage("Plese login and try again.");
    }
    setOpenOfferForTokenId(-1);
  };

  const getAndSetOffers = async (tokenId: number) => {
    const newOffers = await getOffersFromId(tokenId);
    setOffersObj({ ...offersObj, [tokenId]: newOffers });
    setRandomNumber(Math.random() + 1);
  };
  const onFlip = async (i: number) => {
    setFlipBoxIndex([...flipBoxIndex, i]);
    await getAndSetOffers(i + 1);
  };
  const onCancelOffer = async (offer: OfferDbDoc) => {
    // eslint-disable-next-line no-restricted-globals
    const result = confirm("Are you sure to cancel your offer");
    if (!result) return;
    setIsLoading(true);
    try {
      await cancelOffer(offer.id);
      await getAndSetOffers(offer.tokenId);
    } catch (e) {
      console.log("Cancel ERROR: ", e);
      setShowAlertMessage("Error Occured: Please try again later.");
      return;
    } finally {
      setIsLoading(false);
    }
    setShowAlertMessage("Your offer has been removed");
    const idx = offer.tokenId - 1;
    const removeIdx = flipBoxIndex.findIndex((f) => f === idx);
    setFlipBoxIndex([
      ...flipBoxIndex.slice(0, removeIdx),
      ...flipBoxIndex.slice(removeIdx + 1),
    ]);
  };
  const onAcceptOffer = async (offer: OfferDbDoc) => {
    if (ownTokenIds.includes(offer.tokenId.toString())) {
      setIsLoading(true);
      if (!user?.pubkey) {
        setShowAlertMessage(
          "Kindly create your wallet and import NFT before accepting an offer."
        );
        setIsLoading(false);
        return;
      }
      const owner = await getOwnerOfNft(offer.tokenId.toString());
      if (user.pubkey !== owner) {
        setShowAlertMessage(
          `Your wallet does't hold the token id - ${offer.tokenId}. Kindly transfer it to your custodial wallet - ${user.pubkey}`
        );
        setIsLoading(false);
        return;
      }
      const buyerBalanceBn = await getWethBalance(offer.walletAddress);
      if (buyerBalanceBn.lt(ethers.utils.parseEther(offer.amount.toString()))) {
        setShowAlertMessage(
          "Buyer currently has insufficient fund. Please try again later."
        );
        setIsLoading(false);
        return;
      }
      try {
        const response = await axios.post(ACCEPT_OFFER_URL, {
          discordId: user.uid,
          tokenId: offer.tokenId.toString(),
          buyerAddress: offer.walletAddress,
          custodialAddress: user.pubkey,
          amount: offer.amount,
        });
        const acceptedReceiptHash = response.data.acceptedReceiptHash;
        console.log({ acceptedReceiptHash });
        await updateTokenOwner(
          offer.tokenId.toString(),
          {
            name: offer.userName,
            uid: offer.userId,
            avatar: offer.userAvatar,
            discriminator: offer.discriminator,
          },
          user?.uid as string,
          offer.id
        );
        await updateOffer(offer.id, {
          isSold: true,
          acceptedReceiptHash,
        });
        setShowAlertMessage("Successfully accepted the offer");
        window.location.reload();
      } catch (e) {
        setShowAlertMessage("Something went wrong, please try again");
        console.log("ERROR: ", e);
      } finally {
        setIsLoading(false);
      }
    } else {
      setShowAlertMessage(
        "Something went wrong with accepting the offer, please refresh the page and try again."
      );
    }
  };

  const onProfileClose = () => {
    setShowProfile(false);
  };

  const onWithdraw = async () => {};

  return (
    <Box sx={{ bgcolor: "background.paper", minHeight: "100vh" }}>
      <Box
        p={2}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Box
          style={{
            background: `url(/cherry/logo.png)`,
            objectFit: "cover",
            width: "130px",
            height: "50px",
            backgroundSize: "cover",
            backgroundPosition: "center",
            transform: "scale(2)",
          }}
        ></Box>
        <Box display={"flex"} alignItems="center">
          <Box mr={2}>
            {account ? (
              <Tooltip title={account}>
                <Chip
                  clickable
                  label={`${account.slice(0, 6)}...${account.slice(
                    account.length - 4
                  )}`}
                  style={{ marginLeft: "auto" }}
                  variant="outlined"
                />
              </Tooltip>
            ) : (
              <Button variant="outlined" onClick={login} color="info">
                Connect
              </Button>
            )}
          </Box>
          {user ? (
            <Chip
              label={user.name}
              clickable
              onClick={() => setShowProfile(true)}
            />
          ) : (
            <Button
              variant="contained"
              // onClick={onSignInWithFb}
              href={`${baseUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}`}
              startIcon={
                <img src="/social/discord.png" alt="" width={"22px"} />
              }
            >
              Sign In
            </Button>
          )}
        </Box>
      </Box>
      <Box
        display="flex"
        gap={6}
        justifyContent="space-around"
        flexWrap="wrap"
        p={{ xs: 2, sm: 5 }}
        style={{
          backgroundImage: `url('${trackDetails?.coverUrl}')`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "top right",
          boxShadow: "inset 0 0 0 1000px rgba(67,50,152,65%)",
        }}
      >
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          gap={2}
          maxWidth={{ md: "35%" }}
        >
          <Box
            display="flex"
            gap={6}
            alignItems="center"
            justifyContent="center"
            flexWrap="wrap"
          >
            <Box>
              <img
                src={trackDetails?.profileUrl}
                alt=""
                width="150px"
                height="150px"
                style={{ borderRadius: "6px" }}
              ></img>
            </Box>
            <Box>
              <Box>
                <Typography variant="h5" fontWeight="bold">
                  {trackDetails?.title}
                </Typography>
                <Typography variant="body1">{trackDetails?.artist}</Typography>
              </Box>
              <Box mt={3} display="flex" flexWrap="wrap">
                <IconButton
                  sx={{ p: 0 }}
                  href={`//${trackDetails?.socials?.tiktok}`}
                  target="_blank"
                >
                  <img src="/social/tiktok.png" alt="tiktok" />
                </IconButton>
                <IconButton
                  sx={{ p: 0 }}
                  href={`//${trackDetails?.socials?.twitter}`}
                  target="_blank"
                >
                  <img src="/social/twitter.png" alt="twitter" />
                </IconButton>
                <IconButton
                  sx={{ p: 0 }}
                  href={`//${trackDetails?.socials?.discord}`}
                  target="_blank"
                >
                  <img src="/social/discord-icon.png" alt="discord" />
                </IconButton>
                <IconButton
                  sx={{ p: 0 }}
                  href={`//${trackDetails?.socials?.instagram}`}
                  target="_blank"
                >
                  <img src="/social/instagram.png" alt="instagram" />
                </IconButton>
                <IconButton
                  sx={{ p: 0 }}
                  href={`//${trackDetails?.socials?.youtube}`}
                  target="_blank"
                >
                  <img src="/social/youtube.png" alt="youtube" />
                </IconButton>
                <IconButton
                  sx={{ p: 0 }}
                  href={`//${trackDetails?.socials?.spotify}`}
                  target="_blank"
                >
                  <img src="/social/spotify.png" alt="spotify" />
                </IconButton>
              </Box>
              {/* <Box mt={3}>
              <Typography>Genre: {trackDetails?.genre}</Typography>
              <Typography> Bpm: {trackDetails?.bpm} </Typography>
              <Typography>Key: {trackDetails?.key}</Typography>
            </Box> */}
            </Box>
          </Box>
          <Box>
            <Typography
              // variant="caption"
              // fontWeight="bold"
              fontFamily="BenchNine"
            >
              {/* Web-3 Music Developer // Epistemologist // Producer // Engineer //
              Artist */}
              Cherry is a twenty-three year old artist from Pittsburgh,
              Pennsylvania currently based out of Los Angeles. Pushing forward
              the sounds of indie pop, trap & electronic. After an introduction
              to making beats 4 years ago, Cherry started to focus on creating
              music, and has been working. Being around music his whole life,
              becoming a creative was the outlet Cherry needed to find his own
              path. Cherry is a producer, engineer, mix&master,
              singer/songwriter and composes all of his own projects.
            </Typography>
          </Box>
        </Box>

        <Box
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          gap={2}
          maxWidth={{ md: "30%" }}
        >
          <Box>
            {/* <Box>
              {timerObj.isRevealed === false && (
                <Typography fontWeight="bold" variant="h5">
                  nGenesis Begins In...
                </Typography>
              )}
            </Box>
            {timerObj.isRevealed === false ? (
              <Box
                display="flex"
                flexWrap="wrap"
                justifyContent="center"
                gap={4}
              >
                <Box
                  // mr={2}
                  mt={2}
                  p={2}
                  sx={{ border: "2px solid white", borderRadius: "6px" }}
                  width="35px"
                  fontWeight="bold"
                >
                  <Typography fontWeight="bold" variant="h4" align="center">
                    {timerObj.days}
                  </Typography>
                  <Typography
                    variant="body2"
                    align="center"
                    fontFamily="BenchNine"
                  >
                    days
                  </Typography>
                </Box>
                <Box
                  // mr={2}
                  mt={2}
                  p={2}
                  sx={{ border: "2px solid white", borderRadius: "6px" }}
                  width="35px"
                >
                  <Typography fontWeight="bold" variant="h4" align="center">
                    {timerObj.hours}
                  </Typography>
                  <Typography
                    variant="body2"
                    align="center"
                    fontFamily="BenchNine"
                  >
                    hrs
                  </Typography>
                </Box>
                <Box
                  // mr={2}
                  mt={2}
                  p={2}
                  sx={{ border: "2px solid white", borderRadius: "6px" }}
                  width="35px"
                >
                  <Typography fontWeight="bold" variant="h4" align="center">
                    {timerObj.minutes}
                  </Typography>
                  <Typography
                    variant="body2"
                    align="center"
                    fontFamily="BenchNine"
                  >
                    min
                  </Typography>
                </Box>
                <Box
                  mt={2}
                  p={2}
                  sx={{ border: "2px solid white", borderRadius: "6px" }}
                  width="35px"
                >
                  <Typography fontWeight="bold" variant="h4" align="center">
                    {timerObj.seconds}
                  </Typography>
                  <Typography
                    variant="body2"
                    align="center"
                    fontFamily="BenchNine"
                  >
                    sec
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Box
                my={2}
                // mx={4}
                p={2}
                sx={{ border: "2px solid white", borderRadius: "6px" }}
              >
                <Typography variant="h4" align="center" fontWeight="bold">
                  nGenesis Live
                </Typography>
                <Typography variant="body2" align="center">
                  nGenesis went live at Block 15744745 Oct 14th 00:05 hrs PDT
                </Typography>
              </Box>
            )} */}
            <Box
              my={2}
              // mx={4}
              p={2}
              sx={{ border: "2px solid white", borderRadius: "6px" }}
            >
              <Typography variant="h4" align="center" fontWeight="bold">
                nGenesis Live
              </Typography>
              <Typography variant="body2" align="center">
                nGenesis went live at Block 15744745 Oct 14th 00:05 hrs PDT
              </Typography>
            </Box>
          </Box>
          <Box>
            <Typography
              // variant="caption"
              // fontWeight="bold"
              fontFamily="BenchNine"
            >
              {/* nGenesis is the foundational Web3 label, powering the evolution
                of music */}
              Cherry’s alter-ego Feral has become assimilated with the
              prototypical Web 3 label nGenesis, that started on his
              twenty-third birthday. In order to assemble his forces to prepare
              for the flight to Sovereignty, Cherry made 14 early access Kitty
              Kat Gang passes available to be minted, these are now available on
              the secondary market to devotees and collectors alike. Each of
              these passes grants access to Kitty Kat Lodge on Petrichor’s outer
              moon, Feldspar.
            </Typography>
          </Box>
        </Box>

        <Box
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          gap={2}
          maxWidth={{ md: "20%" }}
        >
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/pUxg0zaCa2s"
            title="“The Point of No Return” Music Nft Drop Announcement"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>

          <Box>
            <Typography
              // variant="caption"
              // fontWeight="bold"
              fontFamily="BenchNine"
            >
              'The Point of No Return’ is fractionalized into 14 clips that have
              been synchronized with the Kitty Kat Gang masks. These are
              available right here on Cherry’s site, once you have purchased a
              clip you can download it, share it and co-ordinate with the Kitty
              Kat Gang to unlock the full release.
            </Typography>
          </Box>
        </Box>
        {/* <Box>
          <Typography
            // variant="caption"
            // fontWeight="bold"
            fontFamily="BenchNine"
          >
            Cherry is a twenty-two year old artist from Pittsburgh, Pennsylvania
            currently based out of Los Angeles. Pushing forward the sounds of
            indie pop, trap & electronic. After an introduction to making beats
            4 years ago, Cherry started to focus on creating music, and has been
            working. Being around music his whole life, becoming a creative was
            the outlet Cherry needed to find his own path. Cherry is a producer,
            engineer, mix&master, singer/songwriter and composes all of his own
            projects. Recently dropping his latest EP in l.a. he is set to focus
            on his connection to music, and release new music in 2022.
          </Typography>
        </Box> */}
      </Box>

      <Box
        mt={6}
        pb={6}
        display="flex"
        flexWrap="wrap"
        gap={4}
        justifyContent="center"
      >
        {sections
          .slice(0, trackDetails?.noOfSections)
          .map((section: string, i: number) => (
            <Box
              key={i}
              width={256}
              height={256}
              position="relative"
              borderRadius="6px"
            >
              <Box
                sx={{
                  transition: "0.5s linear",
                  transformStyle: "preserve-3d",
                  transform: flipBoxIndex.includes(i)
                    ? "rotateY(180deg)"
                    : "rotateY(0deg)",
                  width: "100%",
                  height: "100%",
                }}
              >
                <Box
                  sx={{
                    backfaceVisibility: "hidden",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    transform: "rotateY(180deg)",
                    boxShadow: "0 8px 18px -4px lightblue",
                  }}
                  onClick={() => {
                    const removeIdx = flipBoxIndex.findIndex((f) => f === i);
                    setFlipBoxIndex([
                      ...flipBoxIndex.slice(0, removeIdx),
                      ...flipBoxIndex.slice(removeIdx + 1),
                    ]);
                  }}
                >
                  <Box width="100%" height="100%">
                    {!!randamNumber && offersObj[i + 1]?.length > 0 ? (
                      <Box m={1} height="100%">
                        <Typography sx={{ ml: 3 }} fontWeight="bold">
                          Offers
                        </Typography>
                        <Box m={2} sx={{ overflowY: "auto", height: "80%" }}>
                          {offersObj[i + 1].map((offer, j) => (
                            <Tooltip
                              key={j}
                              title={
                                // new Date(offer.duration)
                                //   .toString()
                                //   .split("(")[0]
                                offer.userName
                              }
                              placement="top"
                              disableInteractive
                            >
                              <Box
                                p={1}
                                display={"flex"}
                                justifyContent="space-between"
                                sx={{
                                  ":hover": {
                                    boxShadow: "0px 0px 3px #c4c4c4",
                                  },
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (ownTokenIds.includes((i + 1).toString()))
                                    setAcceptOffer(offer);
                                }}
                              >
                                <Box
                                  display="flex"
                                  alignItems={"center"}
                                  flexBasis="100px"
                                >
                                  <Typography>
                                    ${(offer.amount * ethUsdPrice).toFixed(2)}
                                  </Typography>
                                  {/* <Typography
                                    variant="body2"
                                    sx={{ pl: 1 }}
                                    textTransform="uppercase"
                                  >
                                    {offer.denom}
                                  </Typography> */}
                                </Box>
                                <Box
                                  display="flex"
                                  alignItems={"flex-start"}
                                  // flexBasis="25px"
                                >
                                  <AvatarOrNameDicord
                                    user={{
                                      name: offer.userName,
                                      avatar: offer.userAvatar,
                                      uid: offer.userId,
                                    }}
                                    width={25}
                                    onlyAvatar
                                  />
                                </Box>

                                <Box display="flex" alignItems={"center"}>
                                  {offer.userId === user?.uid ||
                                  ownTokenIds.includes((i + 1).toString()) ? (
                                    <>
                                      {offer.userId === user?.uid && (
                                        <LoadingButton
                                          size="small"
                                          // variant="outlined"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            onCancelOffer(offer);
                                          }}
                                          loading={isLoading}
                                          color="warning"
                                        >
                                          <CancelIcon />
                                        </LoadingButton>
                                      )}
                                      {ownTokenIds.includes(
                                        (i + 1).toString()
                                      ) && (
                                        <LoadingButton
                                          loading={isLoading}
                                          // size="small"
                                          // variant="outlined"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            if (
                                              ownTokenIds.includes(
                                                (i + 1).toString()
                                              )
                                            )
                                              setAcceptOffer(offer);
                                          }}
                                          size="small"
                                          color="success"
                                        >
                                          <CheckIcon />
                                        </LoadingButton>
                                      )}
                                    </>
                                  ) : (
                                    <Button disabled></Button>
                                  )}
                                </Box>
                              </Box>
                            </Tooltip>
                          ))}
                        </Box>
                      </Box>
                    ) : (
                      <Box
                        display={"flex"}
                        justifyContent="center"
                        alignItems="center"
                        width={"100%"}
                        height={"100%"}
                      >
                        <Typography>No offers yet</Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
                <Box
                  sx={{
                    backfaceVisibility: "hidden",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    transform: "rotateY(0deg)",
                  }}
                >
                  <img
                    src={
                      // timerObj.isRevealed &&
                      // mintedTokenIds.includes((i + 1).toString())
                      //   ? `/cherry/cats/${i + 1}.png`
                      //   : `/cherry/assets/${i <= 7 ? i + 1 : i - 7}.png`
                      `/cherry/cats/${i + 1}.png`
                    }
                    alt=""
                    width="100%"
                    height="100%"
                    style={{ borderRadius: "6px" }}
                  ></img>
                  {/* <video
                width="100%"
                height="100%"
                autoPlay
                muted
                loop
                id="15"
                style={{ borderRadius: "6px" }}
              >
                <source src="bg.mp4" type="video/mp4" />
              </video> */}
                  {/* {(timerObj.isRevealed &&
                    mintedTokenIds.includes((i + 1).toString())) === false && (
                    <Box
                      position="absolute"
                      top={0}
                      width="100%"
                      height="100%"
                      sx={{
                        opacity: "0.6",
                        // transition: "opacity 0.2s",
                        background: "rgba(0,0,0,0.8)",
                        borderRadius: "6px",
                        "&:hover": {
                          opacity: "0",
                        },
                      }}
                    />
                  )} */}
                  <Box
                    position="absolute"
                    top={0}
                    width="100%"
                    height="100%"
                    sx={{
                      opacity: "0",
                      transition: "opacity 0.2s",
                      background: "rgba(0,0,0,0.8)",
                      borderRadius: "6px",
                      "&:hover": {
                        opacity: "1",
                        "#makeoffer": {
                          visibility: "visible",
                        },
                      },
                    }}
                  >
                    <Box
                      boxSizing="border-box"
                      width="100%"
                      height="100%"
                      display="flex"
                      flexDirection="column"
                      justifyContent="space-between"
                      p={1}
                    >
                      {/* {isTokenAlreadyMinted(i + 1) === false && ( */}
                      <Box
                        m={1}
                        display="flex"
                        justifyContent={"space-between"}
                      >
                        <Typography variant="h6" fontFamily="BenchNine">
                          Feral #{section}
                        </Typography>
                        <Box
                          display="flex"
                          flexDirection="column"
                          alignItems="start"
                          justifyContent={"end"}
                        >
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => onFlip(i)}
                            color="info"
                          >
                            offers
                          </Button>
                        </Box>
                      </Box>
                      {isTokenMintedByUser(i + 1) && (
                        <Box display="flex" justifyContent="center">
                          <Button
                            variant="contained"
                            onClick={(e) => {
                              e.stopPropagation();
                              downloadFile((i + 1).toString());
                            }}
                          >
                            Download
                          </Button>
                        </Box>
                      )}
                      {/* {timerObj.isRevealed &&
                        isTokenAlreadyMinted(i + 1) &&
                        isTokenMintedByUser(i + 1) && (
                          <Box display="flex" justifyContent="center">
                            <Button
                              variant="contained"
                              onClick={(e) => {
                                e.stopPropagation();
                                downloadFile((i + 1).toString());
                              }}
                            >
                              Download
                            </Button>
                          </Box>
                        )} */}
                      {/* {timerObj.isRevealed === false && (
                        <Button disabled variant="contained">
                          Reveal soon
                        </Button>
                      )} */}
                      {/* {timerObj.isRevealed &&
                        isTokenAlreadyMinted(i + 1) === false &&
                        (user ? (
                          <CrossmintPayButton
                            onClick={() => {
                              setIsListening(true);
                            }}
                            showOverlay={false}
                            clientId="284d3037-de14-4c1e-9e9e-e76c2f120c8a"
                            mintConfig={{
                              type: "erc-721",
                              totalPrice: "0",
                              tokenId: (i + 1).toString(),
                              parentTokenId: "0",
                              _id: user.id,
                              uri: `https://bafybeih55dxz4ooutgdnfsrnovch4s6gs7lt7e3ik4223345ec2ec6to3e.ipfs.nftstorage.link//${
                                i + 1
                              }.json`,
                            }}
                          />
                        ) : (
                          <Button
                            variant="contained"
                            // onClick={onSignInWithFb}
                            href={`${baseUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}`}
                            startIcon={
                              <img
                                src="/social/discord.png"
                                alt=""
                                width={"22px"}
                              />
                            }
                          >
                            Sign in
                          </Button>
                        ))} */}
                      {user ? (
                        isTokenMintedByUser(i + 1) === false && (
                          <Box
                            display={"flex"}
                            justifyContent="center"
                            visibility={"hidden"}
                            id="makeoffer"
                          >
                            <Button
                              // size="small"
                              variant="contained"
                              onClick={(e) => {
                                setOpenOfferForTokenId(i + 1);
                                e.stopPropagation();
                              }}
                            >
                              Make Offer
                            </Button>
                          </Box>
                        )
                      ) : (
                        <Button
                          variant="contained"
                          // onClick={onSignInWithFb}
                          href={`${baseUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}`}
                          startIcon={
                            <img
                              src="/social/discord.png"
                              alt=""
                              width={"22px"}
                            />
                          }
                        >
                          Sign in
                        </Button>
                      )}
                      {/* {isTokenAlreadyMinted(i + 1) === false && ( */}
                      {/* {timerObj.isRevealed && isTokenAlreadyMinted(i + 1) ? (
                        <Box>
                          <Box
                            display="flex"
                            flexDirection="column"
                            alignItems="end"
                            mt={1}
                          >
                            <Typography>Minted by:</Typography>
                            {tokens[i] && (
                              <AvatarOrNameDicord
                                user={{
                                  uid: tokens[i].ownerId,
                                  name: tokens[i].name,
                                  discriminator: tokens[i].discriminator,
                                  avatar: tokens[i].avatar,
                                }}
                              />
                            )}
                          </Box>
                        </Box>
                      ) : (
                        <Box>
                          <Typography variant="subtitle2" align="right">
                            Price
                          </Typography>
                          <Typography variant="h6" align="right">
                            {timerObj.isRevealed && (
                              <Typography variant="caption">only</Typography>
                            )}
                            {timerObj.isRevealed ? " Gas" : "TBA"}
                          </Typography>
                        </Box>
                      )} */}
                      <Box>
                        <Box
                          display="flex"
                          flexDirection="column"
                          alignItems="end"
                          mt={1}
                        >
                          <Typography>
                            {tokens[i] && tokens[i].previousOwnerIds
                              ? "Owned by"
                              : "Minted by"}
                          </Typography>
                          {tokens[i] && (
                            <AvatarOrNameDicord
                              user={{
                                uid: tokens[i].ownerId,
                                name: tokens[i].name,
                                discriminator: tokens[i].discriminator,
                                avatar: tokens[i].avatar,
                              }}
                            />
                          )}
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          ))}
      </Box>
      <Dialog open={isListening || isDownloading}>
        <DialogContent>
          {isListening && (
            <Box>
              <Typography variant="h6">
                Waiting for the tx to complete...
              </Typography>
              <Typography variant="h6">
                Your download will begin once the tx is successful
              </Typography>
            </Box>
          )}
          {isDownloading && (
            <Box>
              {/* <Typography variant="h5">Downloding the file...</Typography> */}
              <CircularProgress />
            </Box>
          )}
        </DialogContent>
      </Dialog>
      <Box mt={4} pb={8}>
        <Typography variant="h5" align="center" fontFamily="monospace">
          Powered By
        </Typography>
        {/* <Typography variant="h3" align="center">
          NUSIC
        </Typography> */}
        <Box display="flex" justifyContent="center" p={2}>
          <Button href="//nusic.fm" target="_blank">
            <img src="/nusic-white.png" alt="nusic" width="250px"></img>
          </Button>
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="h5" fontFamily="monospace" align="center">
            The Decentralized Financial Rails for Music
          </Typography>
          <Box maxWidth={{ md: "33%" }} mt={2} px={2}>
            <Typography align="center" fontFamily="BenchNine" variant="h5">
              NUSIC empowers you to release music into Web 3 on your own terms,
              under your own brand, for your own community. Our solutions have
              won multiple awards from top Web 3 infrastructure providers & our
              distributed team is ready to plug your music into the
              decentralized financial rails that power music on the next
              generation of the internet.
            </Typography>
          </Box>
          <Box my={2}>
            <TextField
              placeholder="Spotify Artist ID"
              onChange={(e) => setSpotifyArtistId(e.target.value)}
            />
          </Box>
          <Button
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
          </Button>
        </Box>
      </Box>
      {/* {openOfferForTokenId >= 0 && ( */}
      <MakeOfferDialog
        isOpen={openOfferForTokenId >= 0}
        onClose={() => {
          if (!isLoading) setOpenOfferForTokenId(-1);
        }}
        onSubmitOffer={onSubmitOffer}
        tokenId={openOfferForTokenId}
        isLoading={isLoading}
      />
      {/* )} */}
      {user && (
        <ProfileDialog
          isOpen={showProfile}
          user={user}
          onClose={onProfileClose}
          refreshUser={refreshUser}
          setShowAlertMessage={setShowAlertMessage}
          ethUsdPrice={ethUsdPrice}
        />
      )}
      <AlertSnackBar
        isOpen={!!showAlertMessage}
        message={showAlertMessage as string}
        onClose={() => {
          setShowAlertMessage(false);
        }}
      />
      {!!acceptOffer && !!user && (
        <AcceptOfferDialog
          offer={acceptOffer}
          onClose={() => {
            setAcceptOffer(undefined);
          }}
          user={user}
          isLoading={isLoading}
          onAcceptOffer={onAcceptOffer}
          ethUsdPrice={ethUsdPrice}
        />
      )}
    </Box>
  );
};

export default NonVisualizer;
