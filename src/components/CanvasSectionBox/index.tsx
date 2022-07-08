import { Box, ButtonGroup, IconButton } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
// import LoopIcon from "@mui/icons-material/Loop";
import PauseIcon from "@mui/icons-material/Pause";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import QueueMusicIcon from "@mui/icons-material/QueueMusic";
import ShopIcon from "@mui/icons-material/Shop";

const CanvasSectionBox = (props: {
  sectionLocation: { left: number; width: number };
  onPlayOrPause: () => void;
  toggleSongOrStemMode: () => void;
  isPlaying: boolean;
  isLoopOn: boolean;
  isSongModeState: boolean;
}) => {
  const {
    sectionLocation: { left, width },
    onPlayOrPause,
    toggleSongOrStemMode,
    isPlaying,
    // isLoopOn,
    isSongModeState,
  } = props;

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
        <IconButton size="small" onClick={toggleSongOrStemMode}>
          {isSongModeState ? (
            <QueueMusicIcon sx={{ height: 25, width: 25 }} />
          ) : (
            <MusicNoteIcon sx={{ height: 25, width: 25 }} />
          )}
        </IconButton>
        <IconButton size="small">
          <ShopIcon />
        </IconButton>
      </ButtonGroup>
    </Box>
  );
};

export default CanvasSectionBox;
