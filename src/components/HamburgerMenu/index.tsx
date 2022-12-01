import { motion, useCycle } from "framer-motion";
import { useEffect, useRef, useState } from "react";
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
      // delay: 0.01,
      type: "spring",
      stiffness: 400,
      damping: 40,
    },
  },
};

const HamburgerMenu = () => {
  const [isOpen, toggleOpen] = useCycle(false, true);
  const [renderNav, setRenderNav] = useState(false);

  const containerRef = useRef(null);
  const { height } = useDimensions(containerRef);

  useEffect(() => {
    setRenderNav(isOpen);
  }, [isOpen]);

  return (
    <motion.nav
      initial={false}
      animate={renderNav ? "open" : "closed"}
      custom={height}
      ref={containerRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        bottom: isOpen ? -320 : "88vh",
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
      {isOpen && <Navigation toggleOpen={toggleOpen} />}
      <MenuToggle toggle={() => toggleOpen()} />
    </motion.nav>
  );
};

export default HamburgerMenu;
