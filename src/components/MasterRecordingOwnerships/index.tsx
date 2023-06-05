import { Grid, Box, Typography, TextField, Button } from "@mui/material";

type Props = { rowsObj: any; setOwnerships: (o: any) => void };

const MasterRecordingOwnerships = ({ rowsObj, setOwnerships }: Props) => {
  return (
    <>
      {Object.keys(rowsObj).map((key) => (
        <>
          <Grid item xs={10} md={4}>
            <Box>
              <Typography>Name</Typography>
              <TextField
                fullWidth
                size="small"
                value={rowsObj[key].name}
                onChange={(e) => {
                  const obj = { ...rowsObj };
                  obj[key].name = e.target.value;
                  setOwnerships(obj);
                }}
              />
            </Box>
          </Grid>
          <Grid item xs={6} md={4}>
            <Box>
              <Typography>% of ownership</Typography>
              <TextField
                fullWidth
                size="small"
                value={rowsObj[key].ownershipPercentage}
                onChange={(e) => {
                  const obj = { ...rowsObj };
                  obj[key].ownershipPercentage = e.target.value;
                  setOwnerships(obj);
                }}
              ></TextField>
            </Box>
          </Grid>
          <Grid item xs={false} md={2}></Grid>
          <Grid item xs={4} md={1}>
            <Box>
              <Typography>
                <br />
              </Typography>
              {Object.keys(rowsObj).length === Number(key) && (
                <Button
                  variant="outlined"
                  disabled={Object.keys(rowsObj).length === 4}
                  onClick={() =>
                    setOwnerships({
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

export default MasterRecordingOwnerships;
