import { Avatar, Box, Typography } from "@mui/material";
import { UserProfile } from "@/types/user-profile-type";

export default function StatsBox(user: UserProfile) {
  function parseISOString(date: Date): string {
    date = new Date(date);
    const dateAsString = `${date.getUTCDay()}/${date.getUTCMonth()}/${date.getUTCFullYear()} ${date.getUTCHours()}:${date.getUTCMinutes()}`;
    return dateAsString;
  }

  return (
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
        <Box
          component="div"
          sx={{
            backgroundColor: "primary.200",
            height: "100%",
            padding: "10px 20px",
            borderRadius: "8px",
            overflow: "scroll",
          }}
        >
          <Typography sx={{ fontSize: "1.5em", fontWeight: "600" }}>
            Achievements
          </Typography>
          <Box
            component="div"
            sx={{
              width: "100%",
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
      </Box>
      <Box
        component="div"
        sx={{
          backgroundColor: "primary.200",
          width: "70%",
          marginLeft: "20px",
          height: "100%",
          overflow: "scroll",
        }}
      >
        <Typography
          sx={{ fontSize: "1.5em", fontWeight: "600", padding: "5px 20px" }}
        >
          Recent Games
        </Typography>
        <Box
          component="div"
          sx={{
            width: "100%",
            padding: "0px 20px",
          }}
        >
          {user.matches.map((match) => {
            //DELETE THIS LATER PLS
            match.playerOneScore = Math.floor(Math.random() * 5);
            match.playerTwoScore = Math.floor(Math.random() * 5);

            const isPlayerOne =
              match.playerOne.nickName === user.nickName ? true : false;
            const wonMatch =
              match.playerOneScore > match.playerTwoScore && isPlayerOne;

            const dateAsString = parseISOString(match.createdAt);
            return (
              <Box
                key={match.id}
                component="div"
                sx={{
                  backgroundColor: "primary.100",
                  border: "2px solid",
                  borderColor: wonMatch ? "accent.light" : "accent.main",
                  borderRadius: "8px",
                  height: "130px",
                  margin: "10px 0px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Box component="div" sx={{}}>
                  <Typography
                    sx={{
                      fontSize: "1.4em",
                      textTransform: "uppercase",
                      color: wonMatch ? "accent.light" : "accent.main",
                      fontWeight: "800",
                      letterSpacing: "2px",
                    }}
                  >
                    {wonMatch ? "Victory" : "Defeat"}
                  </Typography>
                </Box>
                <Box
                  component="div"
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: "100%",
                    padding: "0px 20px",
                  }}
                >
                  <Box
                    component="div"
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      width: "250px",
                    }}
                  >
                    <Avatar
                      sx={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "8px",
                      }}
                      src="/jakoh_smol.jpg"
                    ></Avatar>
                    <Typography
                      sx={{
                        margin: "0px 10px",
                        color: "text.secondary",
                        fontSize: "1.1em",
                        fontWeight: "600",
                      }}
                    >
                      {match.playerTwo.nickName}
                    </Typography>
                  </Box>
                  <Box
                    component="div"
                    sx={{
                      textAlign: "center",
                      margin: "auto",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "1.6em",
                        fontWeight: "600",
                        color: "text.primary",
                      }}
                    >
                      {match.playerTwoScore} - {match.playerOneScore}
                    </Typography>
                  </Box>
                  <Box
                    component="div"
                    sx={{
                      display: "flex",
                      flexDirection: "row-reverse",
                      alignItems: "center",
                      width: "250px",
                    }}
                  >
                    <Avatar
                      sx={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "8px",
                      }}
                      src="/jakoh_smol.jpg"
                    ></Avatar>
                    <Typography
                      sx={{
                        margin: "0px 10px",
                        color: "text.secondary",
                        fontSize: "1.1em",
                        fontWeight: "600",
                      }}
                    >
                      {match.playerOne.nickName}
                    </Typography>
                  </Box>
                </Box>
                <Box
                  component="div"
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    width: "100%",
                    marginTop: "10px",
                    padding: "0 20px",
                  }}
                >
                  <Typography
                    sx={{ color: "text.secondary", fontSize: "1.0em" }}
                  >
                    {dateAsString}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}
