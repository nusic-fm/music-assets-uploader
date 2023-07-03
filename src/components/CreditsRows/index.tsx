import {
  Grid,
  Box,
  Typography,
  TextField,
  Button,
  Autocomplete,
  Chip,
  Tooltip,
} from "@mui/material";
import React, { useState } from "react";

type Props = { rowsObj: any; setCredits: (o: any) => void };

const CreditsRows = ({ rowsObj, setCredits }: Props) => {
  const [nextId, setNextId] = useState(2);
  return (
    <>
      {Object.keys(rowsObj).map((key, i) => (
        <React.Fragment key={key}>
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
          <Grid item xs={6} md={4}>
            <Box>
              <Typography>Role</Typography>
              <Autocomplete
                multiple
                fullWidth
                options={[
                  "Singer",
                  "Composer",
                  "Producer",
                  "Musician",
                  "Session Musician",
                  "Recording Engineer",
                  "Mix Engineer",
                  "Mastering Engineer",
                  "Assistant Engineer",
                ]}
                value={rowsObj[key].role}
                onChange={(e, values: string[]) => {
                  const obj = { ...rowsObj };
                  obj[key].role = values;
                  setCredits(obj);
                }}
                // defaultValue={[top100Films[13].title]}
                freeSolo
                renderTags={(value: readonly string[], getTagProps) =>
                  value.map((option: string, index: number) => (
                    <Chip
                      variant="outlined"
                      label={option}
                      size="small"
                      {...getTagProps({ index })}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    // variant="filled"
                    // label="freeSolo"
                    // placeholder="Favorites"
                  />
                )}
                size="small"
              />
            </Box>
          </Grid>
          <Grid item md={2}>
            <Typography>Other Info</Typography>
            <Tooltip title="Instrument Played">
              <TextField
                fullWidth
                size="small"
                value={rowsObj[key].otherInfo}
                onChange={(e) => {
                  const obj = { ...rowsObj };
                  obj[key].otherInfo = e.target.value;
                  setCredits(obj);
                }}
              />
            </Tooltip>
          </Grid>
          <Grid item xs={4} md={1}>
            <Box>
              <Typography>
                <br />
              </Typography>
              {Object.keys(rowsObj).length - 1 === i ? (
                <Button
                  variant="outlined"
                  onClick={() => {
                    setCredits({
                      ...rowsObj,
                      [nextId]: {},
                    });
                    setNextId(nextId + 1);
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
                    setCredits(obj);
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

export default CreditsRows;
