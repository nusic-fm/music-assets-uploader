import {
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Tooltip,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
// import { ethers } from "ethers";
import { useState } from "react";
import useAuth from "./hooks/useAuth";
import { useWeb3React } from "@web3-react/core";
import { BigNumber, ethers } from "ethers";
import { CrossmintPayButton } from "@crossmint/client-sdk-react-ui";

const getEthValue = (price: number): BigNumber => {
  return ethers.utils.parseEther(price.toString());
};

const getEtherForQuantity = (price: number, quantity: number): string => {
  return ethers.utils.formatEther(
    getEthValue(price).mul(BigNumber.from(quantity))
  );
};

const App = () => {
  const { login } = useAuth();
  const { account, library } = useWeb3React();
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<number>();
  const [showPaymentMode, setShowPaymentMode] = useState(false);

  const onMint = async () => {
    if (!account) {
      alert("Please connect your wallet and continue.");
      return;
    }
    try {
      let methodName, price;
      switch (mode) {
        case 0:
          methodName = "platinumTokenNativeMint";
          price = 0.0001;
          break;
        case 1:
          methodName = "goldTokenNativeMint";
          price = 0.00001;
          break;
        case 2:
          methodName = "basicTokenNativeMint";
          price = 0;
          break;
        default:
          return;
      }
      setIsLoading(true);
      const nftContract = new ethers.Contract(
        "0x012a288853BfD03aC74EBbF139975D0A1E51A3Ff",
        [
          {
            inputs: [
              {
                internalType: "address",
                name: "_to",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "tokenQuantity",
                type: "uint256",
              },
            ],
            name: methodName,
            outputs: [],
            stateMutability: "payable",
            type: "function",
          },
        ],
        library.getSigner()
      );
      const options = {
        value: getEthValue(price).mul(BigNumber.from(1)),
      };
      console.log(ethers.utils.formatEther(options.value.toString()));
      const tx = await nftContract[methodName](account, 1, options);
      await tx.wait();
      alert("You have successfully minted the NFT");
      setShowPaymentMode(false);
    } catch (e: any) {
      console.log(e.message);
      alert(e.data?.message || e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ bgcolor: "background.paper", minHeight: "100vh" }}>
      <Box
        p={2}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexWrap={"wrap"}
        gap={2}
      >
        <Box>
          <Typography variant="h4">Access Pass</Typography>
        </Box>
        {account ? (
          <Chip
            label={`${account.slice(0, 6)}...${account.slice(
              account.length - 4
            )}`}
          />
        ) : (
          <Button
            color="info"
            variant="outlined"
            onClick={() => {
              login();
            }}
          >
            Connect
          </Button>
        )}
      </Box>
      <Box mt={"2rem"} pb={6} display="flex" justifyContent={"center"}>
        <Box
          width={500}
          style={
            {
              // background: 'linear-gradient(to right, #c6ffdd, #fbd786, #f7797d)'
            }
          }
        >
          <Tooltip title="Platinum Pass Info" placement="bottom">
            <Box
              width={"33%"}
              style={{
                clipPath: "polygon(50% 0%,100% 100%, 0% 100%)",
                cursor: "pointer",
                backgroundColor:
                  mode === 0 ? "#573FC8" : "rgba(255,255,255,0.2)",
                // backgroundImage: "url('/platinum.png')",
                // backgroundPosition: "top",
                // backgroundRepeat: "no-repeat",
              }}
              // sx={{ backgroundSize: { xs: "cover", md: "contain" } }}
              py={1}
              height="100px"
              mx="auto"
              display={"flex"}
              flexDirection="column"
              alignItems="center"
              justifyContent={"end"}
              onClick={() => setMode(0)}
            >
              <Box position={"relative"}>
                <img src="/platinum.png" alt="" width={"35px"} />
                {mode === 0 && (
                  <Box
                    position={"absolute"}
                    top={0}
                    width="100%"
                    height="100%"
                    sx={{ background: "rgba(0,0,0,0.8)" }}
                    display="flex"
                    alignItems={"center"}
                    justifyContent="center"
                  >
                    <Typography fontWeight={"bold"} align="center">
                      $50k
                    </Typography>
                  </Box>
                )}
              </Box>
              <Typography
                textAlign={"center"}
                variant="caption"
                justifySelf={"end"}
              >
                Platinum
              </Typography>
            </Box>
          </Tooltip>
          <Tooltip title="Gold Pass Info" placement="bottom">
            <Box
              width={"66%"}
              style={{
                clipPath: "polygon(25% 0%,75% 0, 100% 100%,0% 100%)",
                backgroundColor:
                  mode === 1 ? "#573FC8" : "rgba(255,255,255,0.2)",
                cursor: "pointer",
                // backgroundImage: "url('/gold.png')",
                // backgroundPosition: "top",
                // backgroundSize: "contain",
                // backgroundRepeat: "no-repeat",
              }}
              mx="auto"
              display={"flex"}
              alignItems="center"
              flexDirection={"column"}
              justifyContent={"end"}
              py={1}
              height="100px"
              onClick={() => setMode(1)}
            >
              <Box position={"relative"}>
                <img src="/gold.png" alt="" width={"55px"} />
                {mode === 1 && (
                  <Box
                    position={"absolute"}
                    top={0}
                    width="100%"
                    height="100%"
                    sx={{ background: "rgba(0,0,0,0.8)" }}
                    display="flex"
                    alignItems={"center"}
                    justifyContent="center"
                  >
                    <Typography fontWeight={"bold"} align="center">
                      $10k
                    </Typography>
                  </Box>
                )}
              </Box>
              <Typography textAlign={"center"} variant="caption">
                Gold
              </Typography>
            </Box>
          </Tooltip>
          <Tooltip title="Vip Pass Info" placement="bottom">
            <Box
              width={"99%"}
              style={{
                clipPath: "polygon(16.5% 0, 83% 0, 100% 100%,0% 100%)",
                backgroundColor:
                  mode === 2 ? "#573FC8" : "rgba(255,255,255,0.2)",
                cursor: "pointer",
                // backgroundImage: "url('/vip.png')",
                // backgroundPosition: "top",
                // backgroundSize: "contain",
                // backgroundRepeat: "no-repeat",
              }}
              mx="auto"
              display={"flex"}
              alignItems="center"
              flexDirection={"column"}
              justifyContent={"end"}
              py={1}
              height="100px"
              onClick={() => setMode(2)}
            >
              <Box position={"relative"}>
                <img src="/vip.png" alt="" width={"75px"} />
                {mode === 2 && (
                  <Box
                    position={"absolute"}
                    top={0}
                    width="100%"
                    height="100%"
                    sx={{ background: "rgba(0,0,0,0.8)" }}
                    display="flex"
                    alignItems={"center"}
                    justifyContent="center"
                  >
                    <Typography fontWeight={"bold"} align="center">
                      $100
                    </Typography>
                  </Box>
                )}
              </Box>
              <Typography textAlign={"center"} variant="caption">
                VIP
              </Typography>
            </Box>
          </Tooltip>
        </Box>
      </Box>
      <Box p={2} display="flex" justifyContent={"center"}>
        {mode !== undefined && (
          <Box width={500}>
            <Grid container alignItems="center" rowSpacing={2}>
              <Grid item xs={5}>
                <Typography textAlign={"center"}>Pass</Typography>
              </Grid>
              <Grid item xs={2}></Grid>
              <Grid item xs={5}>
                <Typography textAlign={"left"} variant="h5">
                  {mode === 0 ? "Platinum" : mode === 1 ? "Gold" : "Vip"}
                </Typography>
              </Grid>
              {/* <Grid item xs={5}>
                <Typography textAlign={"center"}>Min Price</Typography>
              </Grid>
              <Grid item xs={2}></Grid>
              <Grid item xs={5}>
                <Typography textAlign={"left"} variant="h6">
                  {mode === 0 ? 0.0001 : mode === 1 ? 0.001 : 0.000001} ETH
                </Typography>
              </Grid> */}
              {mode === 0 && (
                <>
                  <Grid item xs={5}>
                    <Typography textAlign={"center"}>Perks</Typography>
                  </Grid>
                  <Grid item xs={2}></Grid>
                  <Grid item xs={5}>
                    <img
                      src="mystery-box.jpg"
                      alt=""
                      width={50}
                      height={50}
                      style={{ borderRadius: "50%", objectFit: "cover" }}
                    />
                  </Grid>
                </>
              )}
              {mode > 0 && (
                <>
                  <Grid item xs={5}>
                    <Typography textAlign={"center"}>Perks</Typography>
                  </Grid>
                  <Grid item xs={2}></Grid>
                  <Grid item xs={5}>
                    <Typography textAlign={"left"} variant="h6">
                      {mode === 1
                        ? "Named Sponsor"
                        : "Name of Guest list & Unlimited Plus 1's"}
                    </Typography>
                  </Grid>
                </>
              )}
            </Grid>
          </Box>
        )}
      </Box>
      <Box p={2} display="flex" justifyContent={"center"}>
        <Box width={{ md: "300px" }}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => {
              setShowPaymentMode(true);
            }}
          >
            {isLoading ? <CircularProgress /> : "Access"}
          </Button>
        </Box>
      </Box>
      <Box mt={"10rem"} pb={8}>
        <Typography variant="h5" align="center" fontFamily="monospace">
          Powered By
        </Typography>
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
          {/* <Box my={2}>
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
          </Button> */}
        </Box>
      </Box>
      <Dialog open={showPaymentMode} onClose={() => setShowPaymentMode(false)}>
        <DialogTitle>Payment Mode</DialogTitle>
        <DialogContent>
          <Box
            display={"flex"}
            alignItems="center"
            gap={2}
            flexWrap="wrap"
            justifyContent={"center"}
            py={2}
          >
            <Button variant="contained" color="info" onClick={() => onMint()}>
              Crypto
            </Button>
            <CrossmintPayButton
              showOverlay
              clientId={
                mode === 0
                  ? "17d8c866-4638-4688-860b-4d80e9fd781d"
                  : mode === 1
                  ? "a0726572-57a3-4448-b8bd-97d662065eb4"
                  : "842f0784-64ab-4b84-91b3-fbadf0a90e5d"
              }
              mintConfig={{
                type: "erc-721",
                totalPrice:
                  mode === 0
                    ? getEtherForQuantity(0.0001, 1)
                    : mode === 1
                    ? getEtherForQuantity(0.00001, 1)
                    : getEtherForQuantity(0, 1),
                tokenQuantity: "1",
              }}
              environment="staging"
            />
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default App;

// <Box
//   width={"100%"}
//   display="flex"
//   justifyContent={"center"}
//   alignItems="center"
//   height="100%"
// ></Box>;
// <Box width={{ sx: "100%", md: "80%" }} position={"relative"}>
//   <img
//     src="/captain-mint.png"
//     alt=""
//     width={"100%"}
//     style={{ objectFit: "cover" }}
//   />
//   <Box position={"absolute"} top={0} width={"100%"}>
//     <Box display={"flex"} justifyContent="center" width={"100%"}>
//       <Box
//         sx={{ background: "rgba(0,0,0,60%)" }}
//         width={"100%"}
//         p={2}
//       >
//         <Box
//           display={"flex"}
//           justifyContent="center"
//           alignItems={"center"}
//           gap={2}
//         >
//           <Box>
//             <Typography
//               sx={{
//                 background:
//                   "linear-gradient(43deg, #90D5EC 10%, #F907FC 100%)",
//                 WebkitBackgroundClip: "text",
//                 WebkitTextFillColor: "transparent",
//                 fontWeight: "bolder",
//               }}
//             >
//               Whole Song
//             </Typography>
//             <Typography variant="h6">180.4 MATIC</Typography>
//           </Box>
//           <Box
//             width="80px"
//             // height="80px"
//             display={"flex"}
//             justifyContent={
//               price === 180.4 ? "flex-start" : "flex-end"
//             }
//             borderRadius={"25px"}
//             p={1}
//             sx={{
//               cursor: "pointer",
//               // backgroundColor: "rgba(255,255,255,0.4)",
//               background:
//                 "linear-gradient(225deg, rgb(255, 60, 172) 0%, rgb(120, 75, 160) 50%, rgb(43, 134, 197) 100%)",
//             }}
//             onClick={() => {
//               if (price === 18.04) {
//                 setPrice(180.4);
//               } else {
//                 setPrice(18.04);
//               }
//             }}
//           >
//             <motion.div
//               style={{
//                 width: "40px",
//                 height: "40px",
//                 backgroundColor: "#fff",
//                 borderRadius: "40px",
//               }}
//               layout
//               transition={spring}
//             />
//           </Box>

//           <Box>
//             <Typography
//               sx={{
//                 background:
//                   "linear-gradient(43deg, #90D5EC 10%, #F907FC 100%)",
//                 WebkitBackgroundClip: "text",
//                 WebkitTextFillColor: "transparent",
//                 fontWeight: "bolder",
//               }}
//             >
//               Breakdown Only
//             </Typography>
//             <Typography variant="h6">18.04 MATIC</Typography>
//           </Box>
//         </Box>
//       </Box>
//     </Box>
//   </Box>
//   <Box position={"absolute"} bottom={0} width={"100%"}>
//     <Box
//       display={"flex"}
//       justifyContent="space-around"
//       alignItems={"center"}
//       flexWrap={"wrap"}
//       sx={{ background: "rgba(0,0,0,40%)" }}
//       gap={1}
//       p={2}
//     >
//       <CrossmintPayButton
//         showOverlay
//         clientId={
//           mode === 1
//             ? "a0726572-57a3-4448-b8bd-97d662065eb4"
//             : ""
//         }
//         mintConfig={{"type":"erc-721","totalPrice":"<SELECTED_PRICE_IN_MATIC>","tokenQuantity":"<NUMBER_OF_NFTS>"}}
//         environment="staging"
//       />
//       <Box>
//         <Badge
//           badgeContent={
//             quantity > 1
//               ? parseFloat(getEtherForQuantity(price, quantity))
//               : null
//           }
//           color="success"
//           max={999999999999999999999999}
//         >
//           <TextField
//             value={quantity}
//             onChange={(e) => {
//               setQuantity(parseInt(e.target.value));
//             }}
//             inputProps={{ step: 1, min: 1 }}
//             type="number"
//             // variant="filled"
//             sx={{
//               width: "70px",
//               background: "rgb(30, 30, 30)",
//               borderRadius: "6px",
//             }}
//             disabled={isLoading}
//           />
//         </Badge>
//       </Box>
//       <LoadingButton
//         loading={isLoading}
//         variant="contained"
//         sx={{
//           // fontFamily: "monospace",
//           textTransform: "unset",
//         }}
//         onClick={onMint}
//       >
//         Mint with MATIC
//       </LoadingButton>
//     </Box>
//   </Box>
// </Box>;
