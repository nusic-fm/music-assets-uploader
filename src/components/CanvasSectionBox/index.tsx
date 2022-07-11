import {
  Box,
  Button,
  ButtonGroup,
  IconButton,
  Popover,
  TextField,
  Typography,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
// import LoopIcon from "@mui/icons-material/Loop";
import PauseIcon from "@mui/icons-material/Pause";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import QueueMusicIcon from "@mui/icons-material/QueueMusic";
import ShopIcon from "@mui/icons-material/Shop";
import { useState } from "react";
import { SectionInfo } from "../../MarketPlace";

const CanvasSectionBox = (props: {
  sectionLocation: SectionInfo;
  onPlayOrPause: () => void;
  toggleSongOrStemMode: () => void;
  isPlaying: boolean;
  isLoopOn: boolean;
  isSongModeState: boolean;
  onMintNft: (price: number, sectionIndex: number) => Promise<void>;
  selectedTrackIndex?: number;
}) => {
  const {
    sectionLocation: { left, width, index },
    onPlayOrPause,
    toggleSongOrStemMode,
    isPlaying,
    // isLoopOn,
    isSongModeState,
    onMintNft,
    selectedTrackIndex,
  } = props;

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [askingPrice, setAskingPrice] = useState(1);
  const minPrice = Number(process.env.REACT_APP_MIN);
  const maxPrice = Number(Number(process.env.REACT_APP_MAX));

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (selectedTrackIndex === 0) {
      onMintNft(askingPrice, index);
      handleClose();
    } else {
      setAnchorEl(event.currentTarget);
    }
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);

  const handleMint = () => {
    if (askingPrice < minPrice) {
      alert(`Investment should be heigher than ${minPrice} USDC`);
      return;
    }
    if (askingPrice > maxPrice) {
      alert(`Investment should be lower than ${maxPrice} USDC`);
      return;
    }
    onMintNft(askingPrice, index);
    handleClose();
  };

  return (
    <Box
      position={"absolute"}
      top={0}
      zIndex={3}
      height="100%"
      // border="1px solid white"
      style={{
        transition: "all 0.2s",
        background: "rgba(0, 0, 0, 0.4)",
        borderWidth: "0 1px",
        borderStyle: "solid",
        borderColor: "hsl(0, 0%, 20%)",
      }}
      left={left}
      width={width}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <ButtonGroup size="small">
        <IconButton onClick={onPlayOrPause} size="small">
          {isPlaying ? (
            <PauseIcon sx={{ height: 25, width: 25 }} />
          ) : (
            <PlayArrowIcon sx={{ height: 25, width: 25 }} />
          )}
        </IconButton>
        {/* <Button
          size="small"
          variant={isLoopOn ? "contained" : "text"}
          color="secondary"
        >
          <LoopIcon sx={{ height: 25, width: 25 }} />
        </Button> */}
        {selectedTrackIndex !== 1 && (
          <IconButton size="small" onClick={toggleSongOrStemMode}>
            {isSongModeState ? (
              <QueueMusicIcon sx={{ height: 25, width: 25 }} />
            ) : (
              <MusicNoteIcon sx={{ height: 25, width: 25 }} />
            )}
          </IconButton>
        )}
        <IconButton size="small" onClick={handleClick} disabled={open}>
          <ShopIcon />
        </IconButton>
      </ButtonGroup>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Box p={2}>
          <Box width="200px">
            <TextField
              type="number"
              fullWidth
              inputProps={{ min: minPrice, max: maxPrice }}
              value={askingPrice}
              onChange={(e) => setAskingPrice(parseFloat(e.target.value))}
              label="USDC"
            ></TextField>
          </Box>
          <Box
            mt={2}
            display="flex"
            justifyContent="space-around"
            alignItems="center"
          >
            <Box>
              <Typography variant="subtitle1">IRR</Typography>
              <Box>
                <Typography variant="caption">Estimate</Typography>
              </Box>
            </Box>
            <Typography variant="h6">--.--%</Typography>
          </Box>
          <Box mt={2} display="flex" justifyContent="center">
            <Button variant="contained" onClick={handleMint}>
              Mint
            </Button>
          </Box>
        </Box>
      </Popover>
    </Box>
  );
};

export default CanvasSectionBox;
