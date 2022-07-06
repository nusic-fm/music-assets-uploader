import { Box, Button, ButtonGroup, IconButton } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import LoopIcon from "@mui/icons-material/Loop";

const CanvasSectionBox = (props: {
  sectionLocation: { left: number; width: number };
  onPlayOrPause: () => void;
}) => {
  const {
    sectionLocation: { left, width },
    onPlayOrPause,
  } = props;

  return (
    <Box
      position={"absolute"}
      top={0}
      zIndex={3}
      height="100%"
      border="1px solid white"
      style={{
        transition: "all 0.2s",
        // background: "rgba(196, 196, 196, 0.1)",
      }}
      left={left}
      width={width}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <ButtonGroup size="small">
        <IconButton onClick={onPlayOrPause} size="small">
          <PlayArrowIcon sx={{ height: 38, width: 38 }} />
        </IconButton>
        <IconButton size="small">
          <LoopIcon sx={{ height: 38, width: 38 }} />
        </IconButton>
      </ButtonGroup>
    </Box>
  );
};

export default CanvasSectionBox;
