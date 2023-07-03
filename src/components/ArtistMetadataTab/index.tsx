import {
  Grid,
  Box,
  Typography,
  TextField,
  Autocomplete,
  Chip,
} from "@mui/material";
import CompositionOwnerships from "../CompositionOwnerships";
import CreditsRows from "../CreditsRows";
import MasterRecordingOwnerships from "../MasterRecordingOwnerships";

export type ArtistMetadataObj = {
  artist: string;
  featuredArtists: never[];
  credits: {
    1: {};
  };
  masterOwnerships: {
    1: {};
  };
  compositionOwnerships: {
    1: {};
  };
};
type Props = {
  artistMetadataObj: ArtistMetadataObj;
  setArtistMetadataObj: (obj: any) => void;
};

const ArtistMetadataTab = ({
  artistMetadataObj,
  setArtistMetadataObj,
}: Props) => {
  const {
    artist,
    compositionOwnerships,
    credits,
    featuredArtists,
    masterOwnerships,
  } = artistMetadataObj;
  return (
    <Grid container mt={8} gap={{ xs: 2 }}>
      <Grid item xs={12} md={12}>
        <Grid container gap={2}>
          <Grid item xs={10} md={4}>
            <Box>
              <Typography>Artist</Typography>
              <TextField
                variant="outlined"
                value={artist}
                onChange={(e) => {
                  //   setArtist(e.target.value);
                  setArtistMetadataObj({
                    ...artistMetadataObj,
                    artist: e.target.value,
                  });
                }}
                fullWidth
                size="small"
              ></TextField>
            </Box>
          </Grid>
          <Grid item xs={10} md={4}>
            <Box>
              <Typography>Featured Artists</Typography>
              <Autocomplete
                multiple
                options={[]}
                value={featuredArtists}
                onChange={(e, values: string[]) => {
                  //   setFeaturedArtists(values);
                  setArtistMetadataObj({
                    ...artistMetadataObj,
                    featuredArtists: values,
                  });
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
                    placeholder="Press Enter to add"
                    // variant="filled"
                    // label="freeSolo"
                    // placeholder="Favorites"
                  />
                )}
                size="small"
              />
            </Box>
          </Grid>
          <CreditsRows
            rowsObj={credits}
            setCredits={(_credits: any) => {
              setArtistMetadataObj({ ...artistMetadataObj, credits: _credits });
            }}
          />
          <Grid item xs={12}>
            <Typography variant="body1" fontWeight={700}>
              Master Recording Ownership (up to 4)
            </Typography>
          </Grid>
          <MasterRecordingOwnerships
            rowsObj={masterOwnerships}
            setOwnerships={(_masterOwnerships: any) => {
              setArtistMetadataObj({
                ...artistMetadataObj,
                masterOwnerships: _masterOwnerships,
              });
            }}
          />
          <Grid item xs={12}>
            <Typography variant="body1" fontWeight={700}>
              Composition Ownership (up to 8)
            </Typography>
          </Grid>
          <CompositionOwnerships
            rowsObj={compositionOwnerships}
            setOwnerships={(_compositionOwnerships: any) => {
              setArtistMetadataObj({
                ...artistMetadataObj,
                compositionOwnerships: _compositionOwnerships,
              });
            }}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ArtistMetadataTab;
