import { UserProfile } from "@/types/user-profile-type";
import BannerProfile from "./BannerProfile";
import { Box } from "@mui/material";
import WinLossProfile from "./WinLossProfile";
import AchievementBoxProfile from "./AchievementBoxProfile";
import RecentGamesProfile from "./RecentGamesProfile";

export default function Profile(user: UserProfile) {
  return (
    <>
      <BannerProfile {...user}></BannerProfile>
      <Box
        component="div"
        sx={{
          padding: "20px 50px",
          backgroundColor: "primary.100",
          display: "flex",
          flexDirection: "row",
          height: "calc(100vh - 243px)",
        }}
      >
        <Box
          component="div"
          sx={{
            width: "30%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <WinLossProfile {...user} />
          <AchievementBoxProfile {...user} />
        </Box>
        <RecentGamesProfile {...user} />
      </Box>
    </>
  );
}
