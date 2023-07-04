import { Grid, Box, Typography, TextField, Button } from "@mui/material";
import React from "react";
import { MasterOwnershipObj } from "../ArtistMetadataTab";

type Props = { rowsObj: MasterOwnershipObj; setOwnerships: (o: any) => void };

const MasterRecordingOwnerships = ({ rowsObj, setOwnerships }: Props) => {
  const keysLength = Object.keys(rowsObj).length;
  const totalOwnership = Object.values(rowsObj)
    .map((r) => r.ownershipPercentage)
    .reduce((a, b) => (a || 0) + (b || 0));

  return (
    <>
      {Object.keys(rowsObj).map((key, i) => (
        <React.Fragment key={key}>
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
              <Typography noWrap>% of ownership</Typography>
              <TextField
                fullWidth
                error={(totalOwnership || 0) > 100}
                helperText={
                  !!totalOwnership &&
                  i === keysLength - 1 &&
                  `Total: ${totalOwnership || 0}%`
                }
                size="small"
                type={"number"}
                value={rowsObj[key].ownershipPercentage}
                onChange={(e) => {
                  const obj = { ...rowsObj };
                  obj[key].ownershipPercentage = Number(e.target.value) || 0;
                  setOwnerships(obj);
                }}
              ></TextField>
            </Box>
          </Grid>
          <Grid item xs={false} md={2}></Grid>
          <Grid item xs={false}></Grid>
          <Grid item xs={4} md={1}>
            <Box>
              <Typography>
                <br />
              </Typography>
              {keysLength - 1 === i ? (
                <Button
                  variant="outlined"
                  disabled={keysLength === 4}
                  onClick={() => {
                    setOwnerships({
                      ...rowsObj,
                      [keysLength + 1]: {},
                    });
                  }}
                >
                  Add
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  onClick={() => {
                    const obj = { ...rowsObj };
                    delete obj[key];
                    setOwnerships(obj);
                  }}
                >
                  Delete
                </Button>
              )}
            </Box>
          </Grid>
        </React.Fragment>
      ))}
    </>
  );
};

export default MasterRecordingOwnerships;
