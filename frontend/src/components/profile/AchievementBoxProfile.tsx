import { UserProfile } from "@/types/user-profile-type";
import { Box, Typography } from "@mui/material";

export default function AchievementBoxProfile(user: UserProfile) {
  return (
    <Box
      component="div"
      sx={{
        backgroundColor: "primary.200",
        height: "100%",
        padding: "10px 10px 30px 20px",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      <Typography sx={{ fontSize: "1.5em", fontWeight: "600" }}>
        Achievements
      </Typography>
      <Box
        component="div"
        sx={{
          width: "100%",
          overflow: "auto",
          height: "92%",
        }}
      >
        {user.achievements.map((userAchievement) => {
          const achievement = userAchievement.achievement;
          return (
            <Box
              key={userAchievement.id}
              component="div"
              sx={{
                backgroundColor: "primary.100",
                borderRadius: "8px",
                margin: "10px 0px",
                padding: "7px 10px",
                width: "calc(100% - 10px)",
              }}
            >
              <Typography
                sx={{
                  color: "text.primary",
                  fontSize: "1.2em",
                  textTransform: "capitalize",
                }}
              >
                {achievement.name}
              </Typography>
              <Typography
                sx={{
                  color: "text.secondary",
                  fontSize: "1.0em",
                  textTransform: "capitalize",
                }}
              >
                {achievement.description}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
