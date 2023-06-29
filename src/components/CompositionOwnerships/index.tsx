import {
  Grid,
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
} from "@mui/material";
import React from "react";
import { useState } from "react";

type Props = { rowsObj: any; setOwnerships: (o: any) => void };

function CompositionOwnerships({ rowsObj, setOwnerships }: Props) {
  const [nextId, setNextId] = useState(2);
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
          <Grid item xs={10} md={2}>
            <Box>
              <Typography>IPI</Typography>
              <TextField
                size="small"
                value={rowsObj[key].ipi}
                onChange={(e) => {
                  const obj = { ...rowsObj };
                  obj[key].ipi = e.target.value;
                  setOwnerships(obj);
                }}
                fullWidth
              ></TextField>
            </Box>
          </Grid>
          <Grid item xs={10} md={2}>
            <Box>
              <Typography>PRO</Typography>
              <Select
                size="small"
                value={rowsObj[key].pro}
                fullWidth
                onChange={(e) => {
                  const obj = { ...rowsObj };
                  obj[key].pro = e.target.value;
                  setOwnerships(obj);
                }}
              >
                {[
                  "ASCAP",
                  "BMI",
                  "SESAC",
                  "GMR",
                  "SoundExchange",
                  "PRS for Music",
                  "PPL",
                  "MCPS",
                  "SACEM",
                  "SABAM",
                  "GEMA",
                  "SUISA",
                  "STIM",
                  "SACM",
                  "APRA",
                  "AMCOS",
                  "JASRAC",
                  "KOMCA",
                  "CASH",
                  "COMPASS",
                  "AKM",
                  "ZAIKOS",
                  "BUMA",
                  "SIAE",
                  "SPA",
                  "SACD",
                  "SGAE",
                  "SAYCO",
                  "ACAM",
                  "ACAM-DRM",
                  "ACINPRO",
                  "SAYCE",
                  "AIE",
                  "SAYCE/ACINPO",
                  "SOKOJ",
                  "BUMA/STEMRA",
                  "KODA",
                  "TEOSTO",
                  "SPADEM",
                  "BPRS",
                  "HDS",
                  "OSA",
                  "ZAIKOS-Autorzy",
                  "ZAIKOS-PRO",
                  "UCMR-ADA",
                  "AKKA/LAA",
                  "SOKAN",
                  "COTT",
                  "APDAYC",
                  "AGADU",
                  "SADAIC",
                  "SAYCE",
                  "SCD",
                  "ACEMLA",
                ].map((p) => (
                  <MenuItem value={p}>{p}</MenuItem>
                ))}
              </Select>
            </Box>
          </Grid>
          <Grid item xs={6} md={2}>
            <Box>
              <Typography noWrap>% of ownership</Typography>
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
          <Grid item xs={4} md={1}>
            <Box>
              <Typography>
                <br />
              </Typography>
              {Object.keys(rowsObj).length - 1 === i ? (
                <Button
                  variant="outlined"
                  disabled={Object.keys(rowsObj).length === 8}
                  onClick={() => {
                    setOwnerships({
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
}

export default CompositionOwnerships;
