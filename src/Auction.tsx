/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  CircularProgress,
  Divider,
  Grid,
  Link,
  Tooltip,
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
  claimAuction,
  getAuctionId,
  getEnsName,
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
import BidTextField from "./components/BidTextField";
import { getIncentivesAmount } from "./services/graphql";
// import "./auction.css";
const moment = require("moment");

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
  const [earnedEth, setEarnedEth] = useState<string>("0.00");
  const [isAuctionEnded, setIsAuctionEnded] = useState(false);

  const handleSelect = (ranges: any) => {
    console.log(ranges);
    setSelection(ranges.selection);
  };
  const setHighesBid = async (auctionId: string) => {
    const highestBid = await getHighestBid(auctionId);
    setHighestBid(highestBid);
  };
  const fetchAuctionDetails = async (ignore: boolean = false) => {
    setIsLoading(true);
    const auction = await getAucitonFromTokenId(tokenId);
    setAuctionObj(auction);
    // const endDateObj = moment(auctionObj?.endTime);
    // const isEnded = endDateObj.isBefore(Date.now());
    setIsAuctionEnded(true);
    setIsLoading(false);
    if (!!auction && !ignore) {
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
  const fetchIncentives = async () => {
    if (account) {
      const earned = await getIncentivesAmount(account);
      setEarnedEth(earned);
    }
  };
  useEffect(() => {
    if (account) {
      fetchNftOwner();
      fetchIncentives();
    }
  }, [account]);

  const onListAuction = async (ignoreApproval: boolean) => {
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
      if (ignoreApproval === false) {
        setShowAlertMessage(`Kindly approve the NFT for Auction`);
        const approveHash = await approveNftForAuction(
          tokenId,
          library.getSigner()
        );
        setShowAlertMessage(`NFT has been Approved`);
        console.log(approveHash);
      }
      const provider = new ethers.providers.AlchemyProvider(
        process.env.REACT_APP_CHAIN_NAME as string,
        process.env.REACT_APP_ALCHEMY as string
      );
      let blockNumberWithMethod = await provider.getBlockNumber();
      const block = await provider.getBlock(blockNumberWithMethod);

      const startTime = moment.unix(block.timestamp);
      const endTime = moment.unix(block.timestamp).add(7, "days");

      const startTimeStamp = startTime.unix();
      const endTimeStamp = endTime.unix();
      const hash = await registerAuction(library.getSigner(), tokenId, {
        // auction_startTime: Math.round(selection.startDate.getTime() / 1000),
        // auction_endTime: Math.round(selection.endDate.getTime() / 1000),
        auction_startTime: startTimeStamp,
        auction_endTime: endTimeStamp,
        auction_hammerTimeDuration: 2 * 1000 * 60,
        auction_stepMin: 10000,
        auction_incMin: 10000,
        auction_incMax: 10000,
        auction_bidMultiplier: 11120,
        auction_bidDecimals: 100000,
      });
      console.log(`Hash: ${hash}`);
      setShowAlertMessage(`Your auction is successfully registered`);
      const auctionId = await getAuctionId(tokenId);
      await createAuction(tokenId, {
        // startTime: selection.startDate.toUTCString(),
        // endTime: selection.endDate.toUTCString(),
        startTime: startTime.utc().format(),
        endTime: endTime.utc().format(),
        auctionId,
        createdAt: new Date().toUTCString(),
        ownerAddress: account,
        // auction_startTime: selection.startDate.getTime(),
        // auction_endTime: selection.endDate.getTime(),
        auction_startTime: startTime.utc().format(),
        auction_endTime: endTime.utc().format(),
        auction_hammerTimeDuration: 5,
        auction_stepMin: 10000,
        auction_incMin: 1000,
        auction_incMax: 1000,
      });
      setOpenAuction(false);
      fetchAuctionDetails(true);
    } catch (e: any) {
      console.log(e);
      setShowAlertMessage(e.message);
    } finally {
      setIsLoading(false);
    }
  };
  const onBidNow = async (newBid: BigNumber) => {
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
        const _nexStepBid = highestBid.add(highestBid.mul(10).div(100));
        if (newBid.lte(_nexStepBid)) {
          setShowAlertMessage(
            `Oops new bid is just added, please enter a higher bid than ${_nexStepBid} WETH`
          );
          fetchAuctionDetails(true);
          return;
        }
        // const newBid = highestBid.add(ethers.utils.parseEther("1"));
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
          <Box mb={2}>
            <Typography sx={{ mb: 1 }}>#{sections[Number(tokenId)]}</Typography>
            <Link href="//mmmcherry.xyz" target={"_blank"} color="secondary">
              mmmcherry.xyz
            </Link>
            {/* <Typography sx={{ mt: 1 }}>Bidding Incentive: 10%</Typography>
            <Box mt={2} display="flex" alignItems={"end"}>
              <Typography variant="h4">
                {ethers.utils.formatEther(highestBid)} WETH
              </Typography>
              <Typography sx={{ ml: 1 }} variant="caption">
                Highest Bid
              </Typography>
            </Box> */}
          </Box>
          <Grid container columnGap={4} rowGap={2}>
            <Grid item>
              <Box display={"flex"} flexDirection="column">
                <Typography>Highest Bid</Typography>
                <Tooltip
                  title={
                    auctionObj?.bids?.length
                      ? auctionObj?.bids[0].bidderAddress !== account
                        ? auctionObj?.bids[0].bidderAddress
                        : "Me"
                      : "..."
                  }
                  arrow
                >
                  <Box display={"flex"} alignItems="center">
                    <Typography
                      variant="h4"
                      sx={{
                        background:
                          "linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        fontWeight: "bold",
                      }}
                    >
                      {ethers.utils.formatEther(highestBid)}
                    </Typography>
                    <img src="/eth.svg" alt="" width={26} />
                  </Box>
                </Tooltip>
              </Box>
            </Grid>
            <Grid item>
              <Tooltip
                title="You will earn a 10% incentive when your bid is outbid by other bidders"
                arrow
              >
                <Box
                  display={"flex"}
                  flexDirection="column"
                  justifyContent={"space-between"}
                  height="100%"
                >
                  <Typography>Incentive</Typography>
                  <Typography variant="h6">10%</Typography>
                </Box>
              </Tooltip>
            </Grid>
            <Grid item>
              <Box
                display={"flex"}
                flexDirection="column"
                justifyContent={"space-between"}
                height="100%"
              >
                <Typography>Ends at</Typography>
                <Typography variant="h6">
                  {moment(auctionObj?.endTime).format("MMMM Do, h:mm a")}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Box display={"flex"} justifyContent="center">
            {!!auctionObj ? (
              isAuctionEnded ? (
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
                  onClick={async () => {
                    if (isNftOwner === false) {
                      return;
                    }
                    try {
                      setIsLoading(true);
                      await claimAuction(
                        auctionObj.auctionId,
                        library.getSigner()
                      );
                    } catch (e: any) {
                      alert(e.data?.message || e.message);
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                >
                  {isLoading ? (
                    <CircularProgress size={36} color="secondary" />
                  ) : (
                    <Typography variant="h6" align="center">
                      {isNftOwner ? "Claim" : "Auction has Ended"}
                    </Typography>
                  )}
                </motion.div>
              ) : (
                <BidTextField
                  previousBid={highestBid}
                  auctionObj={auctionObj}
                  isLoading={isLoading}
                  onBidNow={onBidNow}
                  setShowAlertMessage={setShowAlertMessage}
                />
              )
            ) : (
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
                  if (isNftOwner === false) {
                    return;
                  }
                  setOpenAuction(true);
                }}
              >
                {isLoading ? (
                  <CircularProgress size={36} color="secondary" />
                ) : (
                  <Typography variant="h6" align="center">
                    {isNftOwner
                      ? "List for Auction"
                      : "Not Available for Auction"}
                  </Typography>
                )}
              </motion.div>
            )}
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12} md={6}>
          <Box display={"flex"} alignItems="center" justifyContent={"center"}>
            <Typography variant="h4">Bids</Typography>
            {auctionObj?.bids?.length && (
              <Typography variant="caption">{` (${auctionObj.bids.length})`}</Typography>
            )}
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box display={"flex"} alignItems="center" justifyContent={"center"}>
            <Tooltip title="Place a Bid to Earn Incentives">
              <Typography
                variant="h6"
                sx={{
                  background:
                    "linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontWeight: "bold",
                }}
              >
                EARNINGS: {account ? `${earnedEth}` : `--CONNECT WALLET--`}
              </Typography>
            </Tooltip>
            {account && <img src="/eth.svg" alt="" width={26} />}
          </Box>
        </Grid>
        <Grid item xs={12} md={12}>
          {!!auctionObj && auctionObj.bids && auctionObj.bids.length > 0 ? (
            auctionObj.bids
              .sort((a, b) => b.time - a.time)
              .map((bid, i) => (
                <BidCard
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
        tokenId={tokenId}
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
function BidCard({ hueA, hueB, bid }: Props) {
  const background = `linear-gradient(306deg, ${hue(hueA)}, ${hue(hueB)})`;
  const [ensName, setEnsName] = useState<string | null>();
  useEffect(() => {
    if (bid) {
      getEnsName(bid.bidderAddress).then((name) => {
        if (name) {
          setEnsName(name);
        }
      });
    }
  }, [bid]);

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
            <Typography variant="h3" align="center">
              {Number(bid.amount).toFixed(2)} WETH
            </Typography>
            {ensName ? (
              <Typography variant="body2" align="center">
                {ensName}
              </Typography>
            ) : (
              <Typography variant="body2" align="center">
                {bid.bidderAddress.slice(0, 6)}...
                {bid.bidderAddress.slice(bid.bidderAddress.length - 4)}
              </Typography>
            )}
          </Box>
        </motion.div>
      </motion.div>
    </Box>
  );
}

export default Auction;
