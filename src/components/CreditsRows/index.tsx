import {
  Grid,
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
} from "@mui/material";

type Props = { rowsObj: any; setCredits: (o: any) => void };

const CreditsRows = ({ rowsObj, setCredits }: Props) => {
  return (
    <>
      {Object.keys(rowsObj).map((key) => (
        <>
          <Grid item xs={10} md={4}>
            <Box>
              <Typography>Credits (Optional)</Typography>
              <TextField
                fullWidth
                size="small"
                value={rowsObj[key].credits}
                onChange={(e) => {
                  const obj = { ...rowsObj };
                  obj[key].credits = e.target.value;
                  setCredits(obj);
                }}
              ></TextField>
            </Box>
          </Grid>
          <Grid item xs={6} md={2}>
            <Box>
              <Typography>Role</Typography>
              <Select
                value={rowsObj[key].role}
                onChange={(e) => {
                  const obj = { ...rowsObj };
                  obj[key].role = e.target.value;
                  setCredits(obj);
                }}
                size="small"
                fullWidth
              >
                <MenuItem value="Singer">Singer</MenuItem>
                <MenuItem value="Composer">Composer</MenuItem>
                <MenuItem value="Producer">Producer</MenuItem>
                <MenuItem value="Musician">Musician</MenuItem>
                <MenuItem value="Session Musician">Session Musician</MenuItem>
                <MenuItem value="Recording Engineer">
                  Recording Engineer
                </MenuItem>
                <MenuItem value="Mix Engineer">Mix Engineer</MenuItem>
                <MenuItem value="Mastering Engineer">
                  Mastering Engineer
                </MenuItem>
                <MenuItem value="Assistant Engineer">
                  Assistant Engineer
                </MenuItem>
              </Select>
            </Box>
          </Grid>
          <Grid item md={4}></Grid>
          <Grid item xs={4} md={1}>
            <Box>
              <Typography>
                <br />
              </Typography>
              {Object.keys(rowsObj).length === Number(key) && (
                <Button
                  variant="outlined"
                  onClick={() =>
                    setCredits({
                      ...rowsObj,
                      [Object.keys(rowsObj).length + 1]: {},
                    })
                  }
                >
                  Add
                </Button>
              )}
            </Box>
          </Grid>
        </>
      ))}
    </>
  );
};

export default CreditsRows;
