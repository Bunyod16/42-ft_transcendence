import { UserProfile } from "@/types/user-profile-type";
import { Box, Typography } from "@mui/material";

export default function WinLossProfile(user: UserProfile) {
  return (
    <Box
      component="div"
      sx={{
        backgroundColor: "primary.200",
        padding: "10px 20px",
        borderRadius: "8px",
        marginBottom: "20px",
      }}
    >
      <Box component="div" sx={{ display: "flex", flexDirection: "row" }}>
        <Typography
          sx={{ fontSize: "1.2em", fontWeight: "600", width: "70px" }}
        >
          Wins
        </Typography>
        <Typography
          sx={{ fontSize: "1.2em", fontWeight: "600", marginLeft: "10px" }}
        >
          {user.wins}
        </Typography>
      </Box>
      <Box component="div" sx={{ display: "flex", flexDirection: "row" }}>
        <Typography
          sx={{ fontSize: "1.2em", fontWeight: "600", width: "70px" }}
        >
          Loses
        </Typography>
        <Typography
          sx={{ fontSize: "1.2em", fontWeight: "600", marginLeft: "10px" }}
        >
          {user.losses}
        </Typography>
      </Box>
    </Box>
  );
}
