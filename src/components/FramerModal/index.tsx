import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import styled from "@emotion/styled";
import { Box, TextField } from "@mui/material";

// Modal component with 'showModal' prop only
// to manage its state of visibility and
// animated using framer-motion

export const ModalBox = styled(motion.div)`
  position: relative;
  z-index: 2;
  width: 400px;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fff;
`;

export const ModalContent = styled(motion.div)`
  padding: 5px;
`;

export const ModalContainer = styled.div`
  height: 100vh;
  background: #111;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const ToggleBtn = styled(motion.button)`
  cursor: pointer;
  font-size: 20px;
  color: #fff;
  padding: 0.5rem 0.8rem;
  margin-top: 3rem;
  background: #3bb75e;
  text-decoration: none;
  border: none;
  border-radius: 50px;
`;

const FramerModal = ({ showModal }: { showModal: boolean }) => {
  return (
    <ModalContainer>
      <AnimatePresence>
        {showModal && (
          <ModalBox
            initial={{ opacity: 0, y: 60, scale: 0.5 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              // making use of framer-motion spring animation
              // with stiffness = 300
              transition: { type: "spring", stiffness: 300 },
            }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 1 } }}
          >
            <ModalContent
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1, transition: { delay: 0.8 } }}
            >
              <Box>
                <TextField label="Token ID"></TextField>
              </Box>
            </ModalContent>
          </ModalBox>
        )}
      </AnimatePresence>
    </ModalContainer>
  );
};

export default FramerModal;
