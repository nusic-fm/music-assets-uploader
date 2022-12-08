import { Box, Chip, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { sections } from "../../Auction";

const variants = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    y: 50,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 },
    },
  },
};

const colors = [
  "",
  "#FF008C",
  "#D309E1",
  "#9C1AFF",
  "#7700FF",
  "#4400FF",
  "#FF008C",
  "#D309E1",
  "#9C1AFF",
  "#7700FF",
  "#4400FF",
  "#FF008C",
  "#D309E1",
  "#9C1AFF",
  "#7700FF",
  "#4400FF",
];
export const MenuItem = ({
  i,
  toggleOpen,
}: {
  i: number;
  toggleOpen: () => void;
}) => {
  const style = { border: `2px solid ${colors[i]}` };
  const navigate = useNavigate();

  return (
    <motion.li
      variants={variants}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      style={{
        margin: 0,
        padding: 0,
        listStyle: "none",
        marginBottom: "20px",
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
        position: "relative",
      }}
      onClick={() => {
        toggleOpen();
        navigate(`/8`);
      }}
    >
      {i === 8 && (
        <Box position={"absolute"} right={0} top={-10}>
          <Chip label="live" color="success" variant="filled" size="small" />
        </Box>
      )}
      <div
        className="icon-placeholder"
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          flex: "40px 0",
          marginRight: "20px",
          background: `url(/cherry/cats/${i}.png`,
          backgroundSize: "contain",
        }}
      />
      <Box
        className="text-placeholder"
        style={{
          ...style,
          borderRadius: "5px",
          width: "200px",
          height: "20px",
          flex: 1,
          userSelect: "none",
          MozUserSelect: "none",
          msUserSelect: "none",
        }}
        py={1}
        pl={3}
        display="flex"
        alignItems={"center"}
      >
        <Typography color={colors[i]}>{sections[i]}</Typography>
      </Box>
    </motion.li>
  );
};
