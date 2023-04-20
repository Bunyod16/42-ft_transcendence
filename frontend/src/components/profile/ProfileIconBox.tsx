import { UserProfile } from "@/types/user-profile-type";
import { Box, Avatar, Typography } from "@mui/material";
import { useEffect } from "react";

export default function ProfileIconBox(user: UserProfile) {
  useEffect(() => {
    console.log(`Profile Page of in iconbox:${user.name}`);
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
          sx={{ width: "140px", height: "140px", borderRadius: "8px" }}
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
              lineHeight: "0.7em",
              color: "text.primary",
              textTransform: "uppercase",
            }}
          >
            jakoh
          </Typography>
          <Typography
            variant="h3"
            sx={{
              textTransform: "uppercase",
              textAlign: "center",
              lineHeight: "50px",
              backgroundColor: "primary.200",
              borderRadius: "8px",
              padding: "5px 20px",
              fontWeight: "500",
              fontSize: "1.5em",
            }}
          >
            Lvl 99
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
