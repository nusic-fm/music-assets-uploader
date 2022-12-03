import { Box, Button, Popover, Typography } from "@mui/material";
import { useRef, useState } from "react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";

type Props = {
  handleSelect: (ranges: any) => void;
  selection: any;
};

const DateTimeRangePicker = ({ handleSelect, selection }: Props) => {
  const [show, setShow] = useState(false);
  const anchorEl = useRef(null);

  return (
    <>
      <Box>
        <Button
          ref={anchorEl}
          onClick={() => setShow(true)}
          variant="outlined"
          color="info"
          sx={{ textTransform: "capitalize" }}
          endIcon={<EditTwoToneIcon />}
        >
          <Typography variant="body2">
            {selection.startDate.toDateString()} -{" "}
            {selection.endDate.toDateString()}
          </Typography>
        </Button>
      </Box>
      <Popover
        open={show}
        anchorEl={anchorEl.current}
        onClose={() => setShow(false)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <DateRange
          ranges={[selection]}
          onChange={handleSelect}
          showMonthAndYearPickers={false}
          minDate={new Date(new Date().setDate(new Date().getDate() + 1))}
          // showMeridian
          // format="yyyy-MM-dd HH:mm:ss"
        />
      </Popover>
    </>
  );
};

export default DateTimeRangePicker;
