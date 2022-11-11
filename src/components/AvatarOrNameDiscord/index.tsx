import { Box, Typography } from "@mui/material";
import React from "react";
import { User } from "../../models/User";

type Props = {
  user: Partial<User>;
  width?: number;
  onlyAvatar?: boolean;
};

const AvatarOrNameDicord = (props: Props) => {
  const { user, width, onlyAvatar } = props;
  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={0.5}>
      {user.avatar && (
        <img
          src={`https://cdn.discordapp.com/avatars/${user.uid}/${user.avatar}.png`}
          alt="profile"
          width={width || 45}
          style={{ borderRadius: "50%" }}
        />
      )}
      {!onlyAvatar && (
        <Typography fontFamily="BenchNine">{user.name}</Typography>
      )}
    </Box>
  );
};

export default AvatarOrNameDicord;
