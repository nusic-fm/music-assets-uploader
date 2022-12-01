import { Box, Divider, Grid, Typography } from "@mui/material";
import { motion, Variants } from "framer-motion";
import { useParams } from "react-router-dom";
import HamburgerMenu from "./components/HamburgerMenu";

const food: [string, number, number][] = [
  ["2.2 ETH", 340, 200],
  ["2.1 ETH", 340, 220],
  ["1.8 ETH", 360, 240],
  ["1.6 ETH", 300, 220],
  ["1.5 ETH", 310, 240],
  ["1.4 ETH", 305, 245],
  ["1.2 ETH", 330, 210],
  ["1 ETH", 340, 220],
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

const Auction = () => {
  const { id } = useParams();
  const tokenId = id ? Number(id) : 1;

  return (
    <Box p={2} sx={{ bgcolor: "background.paper" }}>
      <HamburgerMenu />
      <Grid container>
        <Grid item xs={12} md={11}>
          <Box display="flex" alignItems="center" ml={9} mt={1}>
            <Typography variant="h6">Bid to Earn Auction</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={1} mt={1}>
          <Box>
            <Typography align="center">Login</Typography>
          </Box>
        </Grid>
      </Grid>
      <Grid
        container
        sx={{ py: 30 }}
        alignItems={"center"}
        //   mheight="100vh"
        rowSpacing={10}
      >
        <Grid md={2}></Grid>
        <Grid container xs={12} md={3} justifyContent="center">
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
              #{tokenId < 10 ? `0${tokenId}` : tokenId}
            </Typography>
          </Box>
          <Box mb={4}>
            <Typography>#{sections[tokenId]}</Typography>
            <Typography>mmmcherry.xyz</Typography>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box display={"flex"} justifyContent="center">
            <motion.div
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.8 }}
              style={{
                background: `linear-gradient(
                                60deg,
                                #c4c4c4 10%,
                                #d6cbf6 60%,
                                #c4c4c4 90%
                            )`,
                borderRadius: "30px",
                width: "150px",
                height: "80px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
                userSelect: "none",
                MozUserSelect: "none",
                msUserSelect: "none",
              }}
            >
              <Typography
                variant="h6"
                align="center"
                color={"black"}
                fontWeight="bolder"
              >
                BID NOW
              </Typography>
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
          {food.map(([emoji, hueA, hueB]) => (
            <Card emoji={emoji} hueA={hueA} hueB={hueB} key={emoji} />
          ))}
        </Grid>
      </Grid>
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
  emoji: string;
  hueA: number;
  hueB: number;
}
const hue = (h: number) => `hsl(${h}, 40%, 30%)`;
function Card({ emoji, hueA, hueB }: Props) {
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
            <Typography variant="h3">{emoji}</Typography>
            <Typography variant="body2" align="center">
              0x07C9...272B
            </Typography>
          </Box>
        </motion.div>
      </motion.div>
    </Box>
  );
}

export default Auction;
