import { motion, useCycle } from "framer-motion";
import { useRef } from "react";
import { MenuToggle } from "./MenuToggle";
import { Navigation } from "./Navigation";
import { useDimensions } from "./use-dimensions";

const sidebar = {
  open: (height = 1000) => ({
    clipPath: `circle(${height * 2 + 200}px at 40px 40px)`,
    transition: {
      type: "spring",
      stiffness: 20,
      restDelta: 2,
    },
  }),
  closed: {
    clipPath: "circle(30px at 40px 40px)",
    transition: {
      delay: 0.5,
      type: "spring",
      stiffness: 400,
      damping: 40,
    },
  },
};

const HamburgerMenu = () => {
  const [isOpen, toggleOpen] = useCycle(false, true);
  const containerRef = useRef(null);
  const { height } = useDimensions(containerRef);

  return (
    <motion.nav
      initial={false}
      animate={isOpen ? "open" : "closed"}
      custom={height}
      ref={containerRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        bottom: -320,
        width: "280px",
      }}
    >
      <motion.div
        className="background"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          width: "280px",
          background: "#fff",
        }}
        variants={sidebar}
      />
      <Navigation toggleOpen={toggleOpen} />
      <MenuToggle toggle={() => toggleOpen()} />
    </motion.nav>
  );
};

export default HamburgerMenu;
