/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  CircularProgress,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import { motion, Variants } from "framer-motion";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import HamburgerMenu from "./components/HamburgerMenu";
import useAuth from "./hooks/useAuth";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
// import dayjs from "dayjs";
import BidConfigDialog from "./components/BidConfigDialog";
import {
  approveNftForAuction,
  approveWeth,
  bid,
  getAuctionId,
  // getBidEvents,
  getHighestBid,
  getOwnerOfNft,
  getWethAllowance,
  registerAuction,
} from "./utils/helper";
import AlertSnackBar from "./components/AlertSnackBar";
import { BigNumber, ethers } from "ethers";
import {
  createAuction,
  getAucitonFromTokenId,
  updateAuction,
} from "./services/db/auction.servics";
import { AuctionTokenDoc, BidDoc } from "./models/BidAuction";
// import "./auction.css";

const bidColors: [number, number][] = [
  [340, 200],
  [340, 220],
  [360, 240],
  [300, 220],
  [310, 240],
  [305, 245],
  [330, 210],
  [340, 220],
  [300, 220],
  [310, 240],
  [305, 245],
  [330, 210],
  [340, 220],
  [300, 220],
  [310, 240],
  [305, 245],
  [330, 210],
  [340, 220],
  [300, 220],
  [310, 240],
  [305, 245],
  [330, 210],
  [340, 220],
];
export const sections = [
  "",
  "Intro",
  "Verse",
  "Pre-Chorus",
  "Chorus",
  "Post-Chorus",
  "Verse",
  "Pre-Chorus",
  "Hook",
  "Post-Chorus",
  "Bridge",
  "Bridge",
  "Breakdown",
  "Breakdown",
  "Post-Chorus",
];

const selectionRange = {
  startDate: new Date(new Date().setDate(new Date().getDate() + 1)),
  endDate: new Date(new Date().setDate(new Date().getDate() + 15)),
  key: "selection",
};

const Auction = () => {
  const { id } = useParams();
  const tokenId = id || "1";

  const { login } = useAuth();
  const { account, library } = useWeb3React();
  const [isLoading, setIsLoading] = useState(false);
  const [auctionObj, setAuctionObj] = useState<null | AuctionTokenDoc>();
  const [openAuction, setOpenAuction] = useState(false);
  const [showAlertMessage, setShowAlertMessage] = useState<boolean | string>(
    false
  );
  const [selection, setSelection] = useState(selectionRange);
  const [highestBid, setHighestBid] = useState<BigNumber>(BigNumber.from("0"));
  const [isNftOwner, setIsNftOwner] = useState<boolean>(false);

  const handleSelect = (ranges: any) => {
    console.log(ranges);
    setSelection(ranges.selection);
  };
  const setHighesBid = async (auctionId: string) => {
    const highestBid = await getHighestBid(auctionId);
    setHighestBid(highestBid);
  };
  const fetchAuctionDetails = async () => {
    setIsLoading(true);
    const auction = await getAucitonFromTokenId(tokenId);
    setAuctionObj(auction);
    setIsLoading(false);
    if (!!auction) {
      setHighesBid(auction.auctionId);
    }
    // await getBidEvents();
  };
  useEffect(() => {
    fetchAuctionDetails();
  }, [tokenId]);

  const fetchNftOwner = async () => {
    if (account) {
      const owner = await getOwnerOfNft(tokenId);
      if (owner === account) setIsNftOwner(true);
    }
  };
  useEffect(() => {
    if (account) {
      fetchNftOwner();
    }
  }, [account]);

  const onListAuction = async () => {
    if (isLoading) {
      setShowAlertMessage(
        `Previous tx is still pending, try again after later`
      );
      return;
    }
    if (!account) {
      setShowAlertMessage(`Connect your wallet and try again`);
      return;
    }
    try {
      setIsLoading(true);
      setShowAlertMessage(`Kindly approve the NFT for Auction`);
      const approveHash = await approveNftForAuction(
        tokenId,
        library.getSigner()
      );
      setShowAlertMessage(`NFT has been Approved`);
      console.log(approveHash);
      const provider = new ethers.providers.AlchemyProvider(
        process.env.REACT_APP_CHAIN_NAME as string,
        process.env.REACT_APP_ALCHEMY as string
      );
      let blockNumberWithMethod = await provider.getBlockNumber();
      const block = await provider.getBlock(blockNumberWithMethod);
      // console.log("blockNumberWithMethod = ", blockNumberWithMethod);
      // console.log("block.timestamp = ", block.timestamp);
      // console.log("block.number = ", block.number);

      const startTime = new Date(block.timestamp);
      console.log("startTime = ", startTime);
      const endTime = new Date(block.timestamp);
      //let twoDays = 2 * 24 * 60 * 60 * 1000;
      let twoDays = 2 * 24 * 60 * 60 * 1000;
      endTime.setTime(endTime.getTime() + twoDays);
      // selection.startDate.setHours(0, 0, 0, 0);
      // selection.endDate.setHours(23, 59, 59, 999);
      const hash = await registerAuction(library.getSigner(), tokenId, {
        // auction_startTime: Math.round(selection.startDate.getTime() / 1000),
        // auction_endTime: Math.round(selection.endDate.getTime() / 1000),
        auction_startTime: startTime.getTime(),
        auction_endTime: endTime.getTime(),
        auction_hammerTimeDuration: 5,
        auction_stepMin: 10000,
        auction_incMin: 1000,
        auction_incMax: 1000,
        auction_bidMultiplier: 11120,
        auction_bidDecimals: 100000,
      });
      console.log(`Hash: ${hash}`);
      setShowAlertMessage(`Your auction is successfully registered`);
      const auctionId = await getAuctionId(tokenId);
      await createAuction(tokenId, {
        // startTime: selection.startDate.toUTCString(),
        // endTime: selection.endDate.toUTCString(),
        startTime: startTime.toUTCString(),
        endTime: endTime.toUTCString(),
        auctionId,
        createdAt: new Date().toUTCString(),
        ownerAddress: account,
        // auction_startTime: selection.startDate.getTime(),
        // auction_endTime: selection.endDate.getTime(),
        auction_startTime: startTime.getTime(),
        auction_endTime: endTime.getTime(),
        auction_hammerTimeDuration: 5,
        auction_stepMin: 10000,
        auction_incMin: 1000,
        auction_incMax: 1000,
      });
      setOpenAuction(false);
      fetchAuctionDetails();
    } catch (e: any) {
      console.log(e);
      setShowAlertMessage(e.message);
    } finally {
      setIsLoading(false);
    }
  };
  const onBidNow = async () => {
    if (isLoading) {
      setShowAlertMessage(
        `Previous tx is still pending, try again after later`
      );
      return;
    }
    if (!account) {
      setShowAlertMessage(`Connect your wallet and try again`);
      return;
    }
    try {
      if (auctionObj) {
        setIsLoading(true);
        const highestBid = await getHighestBid(auctionObj?.auctionId);
        setHighestBid(highestBid);
        const newBid = highestBid.add(ethers.utils.parseEther("1"));
        const allowance = await getWethAllowance(
          library,
          account,
          process.env.REACT_APP_AUCTION_CONTROLLER as string
        );
        if (allowance.lt(newBid)) {
          setShowAlertMessage(`Kindly approve the bid amount`);
          await approveWeth(
            library.getSigner(),
            newBid,
            process.env.REACT_APP_AUCTION_CONTROLLER as string
          );
        }
        const hash = await bid(
          library.getSigner(),
          auctionObj.auctionId,
          newBid,
          highestBid
        );
        console.log(`Hash: ${hash}`);
        await updateAuction(tokenId, {
          bidderAddress: account,
          amount: ethers.utils.formatEther(newBid),
          time: new Date().getTime(),
        });
        setShowAlertMessage(`You bid has been successfully added: ${hash}`);
        fetchAuctionDetails();
      }
    } catch (e: any) {
      setShowAlertMessage(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box p={2} sx={{ bgcolor: "background.paper" }}>
      <HamburgerMenu />
      <Grid container>
        <Grid item xs={12} md={10}>
          <Box display="flex" alignItems="center" ml={9} mt={1}>
            <Typography variant="h6">Bid to Earn Auction</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={2}>
          <Box
            mt={{ xs: 2, md: 0 }}
            display={"flex"}
            justifyContent={{ xs: "center", md: "end" }}
          >
            <motion.div
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.8 }}
              style={{
                background: `linear-gradient(225deg, #FF3CAC 0%, #784BA0 50%, #2B86C5 100%)`,
                borderRadius: "6px",
                // width: "160px",
                // height: "40px",
                padding: "8px 20px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
                userSelect: "none",
                MozUserSelect: "none",
                msUserSelect: "none",
              }}
              onClick={login}
            >
              <Typography variant="body1" color={"White"}>
                {account
                  ? `${account.slice(0, 6)}...${account.slice(
                      account.length - 4
                    )}`
                  : "CONNECT"}
              </Typography>
            </motion.div>
          </Box>
        </Grid>
      </Grid>
      <Grid
        container
        sx={{ py: 20 }}
        alignItems={"center"}
        //   mheight="100vh"
        rowSpacing={10}
      >
        <Grid item md={3}></Grid>
        <Grid container item xs={12} md={2} justifyContent="center">
          <motion.div
            style={{
              width: "256px",
              height: "256px",
              background: "rgba(255, 255, 255, 0.13)",
            }}
            animate={{
              scale: [1, 1.3, 1.3, 1, 1],
              rotate: [0, 0, 270, 270, 0],
              borderRadius: ["20%", "20%", "50%", "50%", "20%"],
            }}
            transition={{
              duration: 2,
              ease: "easeInOut",
              times: [0, 0.2, 0.5, 0.8, 1],
              repeat: 0,
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 2,
                duration: 0.5,
                ease: "easeInOut",
              }}
            >
              <img
                src={`/cherry/cats/${id}.png`}
                alt="test"
                style={{ borderRadius: "6px" }}
              ></img>
            </motion.div>
          </motion.div>
        </Grid>
        <Grid item md={1}></Grid>
        <Grid item xs={12} md={6} alignItems="center">
          <Box mb={5}>
            <Typography variant="h4">The Point of No Return</Typography>
            <Typography variant="h5">
              #{Number(tokenId) < 10 ? `0${tokenId}` : tokenId}
            </Typography>
          </Box>
          <Box mb={4}>
            <Typography>#{sections[Number(tokenId)]}</Typography>
            <Typography>mmmcherry.xyz</Typography>
            <Typography>{auctionObj?.startTime}</Typography>
            <Typography>{auctionObj?.endTime}</Typography>
            <Typography>{ethers.utils.formatEther(highestBid)} WETH</Typography>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box display={"flex"} justifyContent="center">
            <motion.div
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.8 }}
              style={{
                background: `linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)`,
                borderRadius: "6px",
                // width: "150px",
                padding: "8px 20px",
                // height: "80px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
                userSelect: "none",
                MozUserSelect: "none",
                msUserSelect: "none",
              }}
              onClick={() => {
                if (!!auctionObj) {
                  onBidNow();
                } else {
                  if (isNftOwner === false) {
                    return;
                  }
                  setOpenAuction(true);
                }
              }}
            >
              {isLoading ? (
                <CircularProgress size={36} color="secondary" />
              ) : (
                <Typography variant="h6" align="center">
                  {!!auctionObj
                    ? "BID NOW"
                    : isNftOwner
                    ? "List for Auction"
                    : "Not Available for Auction"}
                </Typography>
              )}
            </motion.div>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12} md={6}>
          <Box display={"flex"} alignItems="center" justifyContent={"center"}>
            <Typography variant="h4">Bids</Typography>
          </Box>
        </Grid>
        <Grid item md={6}></Grid>
        <Grid item xs={12} md={12}>
          {!!auctionObj && auctionObj.bids && auctionObj.bids.length > 0 ? (
            auctionObj.bids
              .sort((a, b) => b.time - a.time)
              .map((bid, i) => (
                <Card
                  hueA={bidColors[i][0]}
                  hueB={bidColors[i][1]}
                  key={i}
                  bid={bid}
                />
              ))
          ) : (
            <Typography align="center">No Bids available</Typography>
          )}
        </Grid>
      </Grid>
      <BidConfigDialog
        onClose={() => {
          if (isLoading === false) setOpenAuction(false);
        }}
        isOpen={openAuction}
        handleSelect={handleSelect}
        selection={selection}
        onSave={onListAuction}
        isLoading={isLoading}
      />
      <AlertSnackBar
        isOpen={!!showAlertMessage}
        message={showAlertMessage as string}
        onClose={() => {
          setShowAlertMessage(false);
        }}
      />
    </Box>
  );
};

const cardVariants: Variants = {
  offscreen: {
    y: 300,
  },
  onscreen: {
    y: 50,
    rotate: -10,
    transition: {
      type: "spring",
      bounce: 0.4,
      duration: 0.8,
    },
  },
};

interface Props {
  hueA: number;
  hueB: number;
  bid: BidDoc;
}
const hue = (h: number) => `hsl(${h}, 40%, 30%)`;
function Card({ hueA, hueB, bid }: Props) {
  const background = `linear-gradient(306deg, ${hue(hueA)}, ${hue(hueB)})`;

  return (
    <Box maxWidth={"500px"} mx="auto">
      <motion.div
        className="card-container"
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ once: true, amount: 0.8 }}
        style={{
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          paddingTop: "20px",
          marginBottom: "-120px",
        }}
      >
        <div
          className="splash"
          style={{
            background: "rgba(255, 255, 255, 0.13)",
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            top: 0,
            clipPath: `path(
            "M 0 303.5 C 0 292.454 8.995 285.101 20 283.5 L 460 219.5 C 470.085 218.033 480 228.454 480 239.5 L 500 430 C 500 441.046 491.046 450 480 450 L 20 450 C 8.954 450 0 441.046 0 430 Z"
          )`,
          }}
        />
        <motion.div
          className="card"
          variants={cardVariants}
          style={{
            fontSize: "80px",
            width: "300px",
            height: "430px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background,
            borderRadius: "20px",
            boxShadow: `0 0 1px hsl(0deg 0% 0% / 0.075), 0 0 2px hsl(0deg 0% 0% / 0.075),
    0 0 4px hsl(0deg 0% 0% / 0.075), 0 0 8px hsl(0deg 0% 0% / 0.075),
    0 0 16px hsl(0deg 0% 0% / 0.075)`,
            transformOrigin: "10% 60%",
          }}
        >
          <Box>
            {/* <Typography variant="h3">
            {(Math.random() * 10).toFixed(1)} ETH
          </Typography> */}
            <Typography variant="h3">{bid.amount} WETH</Typography>
            <Typography variant="body2" align="center">
              {bid.bidderAddress.slice(0, 6)}...
              {bid.bidderAddress.slice(bid.bidderAddress.length - 4)}
            </Typography>
          </Box>
        </motion.div>
      </motion.div>
    </Box>
  );
}

export default Auction;
