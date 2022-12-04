import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  DialogActions,
  Box,
  Divider,
  Grid,
  CircularProgress,
} from "@mui/material";
import { motion } from "framer-motion";
import DateTimeRangePicker from "../DateTimeRangePicker";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  handleSelect: (ranges: any) => void;
  selection: any;
  isLoading: boolean;
  tokenId: string;
};

const BidConfigDialog = ({
  isOpen,
  onClose,
  onSave,
  handleSelect,
  selection,
  isLoading,
  tokenId,
}: Props) => {
  return (
    <Dialog open={isOpen} onClose={onClose} sx={{ zIndex: 1 }}>
      <DialogTitle>Auction Configuration #{tokenId}</DialogTitle>
      <Divider />
      <DialogContent>
        <Box>
          <Typography variant="h6">Time Frame</Typography>
          <Box my={2}>
            <DateTimeRangePicker
              handleSelect={handleSelect}
              selection={selection}
            />
            <Box mt={2}>
              <Grid container rowSpacing={1}>
                <Grid item xs={5}>
                  <Typography textAlign={"right"}>
                    Start {`&`} End Time:
                  </Typography>
                </Grid>
                <Grid item xs={1}></Grid>
                <Grid item xs={6}>
                  <Typography fontWeight={"bold"}>12 AM</Typography>
                </Grid>
                <Grid item xs={5} textAlign={"right"}>
                  <Typography>Hammer Time:</Typography>
                </Grid>
                <Grid item xs={1}></Grid>
                <Grid item xs={6}>
                  <Typography fontWeight={"bold"}>12:05 AM</Typography>
                </Grid>
              </Grid>
            </Box>
            {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  renderInput={(props) => <TextField {...props} />}
                  label="Start"
                  value={startDay}
                  onChange={(newValue: any) => {
                    setStartDay(newValue);
                  }}
                />
              </LocalizationProvider>
              <TextField
                label="Hammer Time"
                placeholder="Hours + End Time"
                sx={{ order: 3 }}
              ></TextField>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  renderInput={(props) => <TextField {...props} />}
                  label="End"
                  value={endDay}
                  onChange={(newValue: any) => {
                    setEndDay(newValue);
                  }}
                />
              </LocalizationProvider> */}
          </Box>
          {/* <Box>
              <TextField label="Hammer Time"></TextField>
            </Box> */}
        </Box>
        <Box mt={3}>
          <Typography variant="h6">Bid</Typography>
          <Box mt={2}>
            <Grid container rowSpacing={1}>
              <Grid item xs={5}>
                <Typography textAlign={"right"}>Min Difference:</Typography>
              </Grid>
              <Grid item xs={1}></Grid>
              <Grid item xs={6}>
                <Typography fontWeight={"bold"}>10%</Typography>
              </Grid>
              <Grid item xs={5}>
                <Typography textAlign={"right"}>Min Incentive:</Typography>
              </Grid>
              <Grid item xs={1}></Grid>
              <Grid item xs={6}>
                <Typography fontWeight={"bold"}>1%</Typography>
              </Grid>
              <Grid item xs={5}>
                <Typography textAlign={"right"}>Max Incentive:</Typography>
              </Grid>
              <Grid item xs={1}></Grid>
              <Grid item xs={6}>
                <Typography fontWeight={"bold"}>5%</Typography>
              </Grid>
            </Grid>
          </Box>
          {/* <Box mt={2} display="flex" gap={2} flexWrap="wrap">
            <TextField
              size="small"
              label="Min Difference"
              type={"number"}
              InputProps={{
                inputProps: { min: 0.01, step: "0.1" },
                endAdornment: <Typography sx={{ pl: 1 }}>%</Typography>,
              }}
              color="secondary"
              sx={{ width: "200px" }}
              value={10}
              disabled
            ></TextField>
            <Box
              display={"flex"}
              alignItems="center"
              justifyContent={"space-between"}
              flexWrap="wrap"
              gap={1}
            >
              <TextField
                size="small"
                label="Min Incentive"
                type={"number"}
                InputProps={{
                  inputProps: { min: 0.1, step: "0.1" },
                  endAdornment: <Typography sx={{ pl: 1 }}>%</Typography>,
                }}
                color="secondary"
                sx={{ width: "200px" }}
                value={0.1}
                disabled
              ></TextField>

              <TextField
                sx={{ width: "200px" }}
                size="small"
                label="Max Incentive"
                type={"number"}
                InputProps={{
                  inputProps: { min: 0.1, step: "0.1" },
                  endAdornment: <Typography sx={{ pl: 1 }}>%</Typography>,
                }}
                color="secondary"
                value={5}
                disabled
              ></TextField>
            </Box>
          </Box> */}
        </Box>
      </DialogContent>
      <DialogActions>
        <motion.div
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.8 }}
          style={{
            background: `linear-gradient(225deg, #FF3CAC 0%, #784BA0 50%, #2B86C5 100%)`,
            borderRadius: "6px",
            // width: "160px",
            // height: "40px",
            padding: "8px 20px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            userSelect: "none",
            MozUserSelect: "none",
            msUserSelect: "none",
          }}
          onClick={onSave}
        >
          {isLoading ? (
            <CircularProgress size={36} color="secondary" />
          ) : (
            <Typography variant="body1" color={"White"}>
              SAVE
            </Typography>
          )}
        </motion.div>
      </DialogActions>
    </Dialog>
  );
};

export default BidConfigDialog;
