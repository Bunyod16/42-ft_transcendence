import { UserProfile } from "@/types/user-profile-type";
import { Box, Avatar, Typography } from "@mui/material";
import { useEffect } from "react";

export default function ProfileIconBox(user: UserProfile) {
  useEffect(() => {
    console.log(`Profile Page of in iconbox:${user.nickName}`);
  }, [user]);

  return (
    <Box
      component="div"
      sx={{ padding: "10px 50px", backgroundColor: "primary.100" }}
    >
      <Typography
        variant="h2"
        sx={{
          color: "text.secondary",
          fontSize: "1.5em",
          fontWeight: "500",
          marginBottom: "10px",
          textTransform: "uppercase",
        }}
      >
        PLAYER PROFILE
      </Typography>
      <Box component="div" sx={{ display: "flex", flexDirection: "row" }}>
        <Avatar
          sx={{ width: "120px", height: "120px", borderRadius: "8px" }}
          src="/jakoh_smol.jpg"
        ></Avatar>
        <Box
          component="div"
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            margin: "0px 20px",
            padding: "0px",
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontSize: "3em",
              fontWeight: "800",
              margin: "0px",
              lineHeight: "0.8em",
              color: "text.primary",
              textTransform: "uppercase",
            }}
          >
            {user.nickName}
          </Typography>
          <Typography
            sx={{
              textTransform: "uppercase",
              textAlign: "center",
              lineHeight: "50px",
              backgroundColor: "primary.200",
              borderRadius: "8px",
              padding: "5px 5px",
              width: "150px",
              fontWeight: "700",
              fontSize: "1.5em",
              margin: "0px",
            }}
          >
            Lvl 9.23
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
