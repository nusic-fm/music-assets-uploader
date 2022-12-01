import { motion } from "framer-motion";
import { MenuItem } from "./MenuItem";

const variants = {
  open: {
    transition: { staggerChildren: 0.07, delayChildren: 0.2 },
  },
  closed: {
    transition: { staggerChildren: 0, staggerDirection: -1 },
  },
};

const itemIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
export const Navigation = ({ toggleOpen }: { toggleOpen: () => void }) => (
  <motion.ul
    variants={variants}
    style={{
      margin: 0,
      padding: "20px",
      position: "absolute",
      top: "100px",
      width: "230px",
    }}
  >
    {itemIds.map((i) => (
      <MenuItem i={i} key={i} toggleOpen={toggleOpen} />
    ))}
  </motion.ul>
);
