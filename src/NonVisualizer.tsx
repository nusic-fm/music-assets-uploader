import { CrossmintPayButton } from "@crossmint/client-sdk-react-ui";
import { Button, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";

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
  "15",
  "16",
];
const NonVisualizer = () => {
  const [firstClick, setFirstClick] = useState(false);
  const [showDownloadIdx, setShowDownloadIdx] = useState("01");

  const downloadFile = () => {
    setFirstClick(false);
    fetch("https://assets.nusic.fm/bg.mp4")
      .then((resp) => resp.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        // the filename you want
        a.download = "Happy Ever After All.mp4";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        alert("your file has downloaded!"); // or you know, something with better UX...
      })
      .catch(() => alert("oh no!"));
  };
  return (
    <Box sx={{ bgcolor: "background.paper", minHeight: "100vh" }}>
      <Box
        display="flex"
        justifyContent="center"
        p={5}
        style={{
          backgroundImage: "url('sol.png')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "10% 60%",
          boxShadow: "inset 0 0 0 1000px rgba(67,50,152,65%)",
        }}
      >
        <Box
          display="flex"
          gap={6}
          alignItems="center"
          justifyContent="center"
          flexWrap="wrap"
        >
          <Box>
            <img src="sol.png" alt=""></img>
          </Box>
          <Box>
            <Box>
              <Typography fontWeight="bold">Mackenzie Sol</Typography>
              <Typography>Happy Ever After All</Typography>
            </Box>
            <Box mt={3}>
              <Typography>Genre: Pop</Typography>
              <Typography> Bpm: 190 </Typography>
              <Typography>Key: A</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box m={6} display="flex" flexWrap="wrap" gap={4} justifyContent="center">
        {sections.map((section: string) => (
          <Box width={200} height={200} position="relative" borderRadius="6px">
            <video
              width="100%"
              height="100%"
              autoPlay
              muted
              loop
              id="15"
              style={{ borderRadius: "6px" }}
            >
              <source src="bg.mp4" type="video/mp4" />
            </video>
            <Box
              position="absolute"
              top={0}
              width="100%"
              height="100%"
              sx={{
                opacity: "0",
                transition: "opacity 0.2s",
                background: "rgba(0,0,0,0.6)",
                "&:hover": {
                  opacity: "1",
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
                onClick={() => {
                  if (!firstClick) {
                    setFirstClick(true);
                  } else {
                    setShowDownloadIdx(section);
                  }
                }}
              >
                <Box m={1}>
                  <Typography variant="body2">Choc #{section}</Typography>
                </Box>
                {section === showDownloadIdx ? (
                  <Box mt={2} display="flex" justifyContent="center">
                    <Button variant="contained" onClick={downloadFile}>
                      Download
                    </Button>
                  </Box>
                ) : (
                  <CrossmintPayButton
                    collectionTitle="DemoMT"
                    collectionDescription="DemoMT"
                    clientId="17780ee7-0d48-463b-8ba7-c06750e404db"
                    mintConfig={{
                      type: "erc-721",
                      totalPrice: "0.01",
                      tokenId: Number(section).toString(),
                      parentTokenId: "0",
                      uri: "https://gateway.pinata.cloud/ipfs/QmbY9oktxxq4Sq4jD4KY3fhsgXQawsLTdWdjrN22jjsGQF/1.json",
                    }}
                    environment="staging"
                  />
                )}
                <Box>
                  <Typography variant="subtitle2" align="right">
                    Price
                  </Typography>
                  <Typography variant="h6" align="right">
                    ~$20
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default NonVisualizer;
