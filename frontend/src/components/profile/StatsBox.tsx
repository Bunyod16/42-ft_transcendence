import { Avatar, Box, Typography, Button } from "@mui/material";
import { UserProfile } from "@/types/user-profile-type";
import { useRouter } from "next/router";
import useUserStore from "@/store/userStore";

export default function StatsBox(user: UserProfile) {
  const router = useRouter();
  const [nickName, avatar] = useUserStore((state) => [
    state.nickName,
    state.avatar,
  ]);
  const { username } = router.query;

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
      </Box>
      <Box
        component="div"
        sx={{
          backgroundColor: "primary.200",
          width: "70%",
          marginLeft: "20px",
          height: "100%",
          overflow: "hidden",
          borderRadius: "8px",
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
            overflow: "auto",
            height: "87%",
          }}
        >
          {user.matches.map((match) => {
            console.log(match.id);

            // console.log("match.id", match.id);

            const isPlayerOne =
              match.playerOne.nickName === user.nickName ? true : false;
            const playerOneWonMatch =
              match.playerOneScore > match.playerTwoScore;

            console.log(
              match.playerTwo.nickName,
              match.playerTwoScore,
              ":",
              match.playerOneScore,
              match.playerOne.nickName,
            );

            console.log("isPlayerOne = ", isPlayerOne);
            console.log("playerOneWonMatch = ", playerOneWonMatch);

            const dateAsString = parseISOString(match.createdAt);
            return (
              <Box
                key={match.id}
                component="div"
                sx={{
                  backgroundColor: "primary.100",
                  border: "2px solid",
                  borderColor:
                    playerOneWonMatch && isPlayerOne
                      ? "accent.light"
                      : "accent.main",
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
                      color:
                        playerOneWonMatch && isPlayerOne
                          ? "accent.light"
                          : "accent.main",
                      fontWeight: "800",
                      letterSpacing: "2px",
                    }}
                  >
                    {playerOneWonMatch && isPlayerOne ? "Victory" : "Defeat"}
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
                      src={match.playerTwo.avatar}
                    ></Avatar>
                    <Button
                      sx={{
                        margin: "0px 10px",
                        color: "text.secondary",
                        fontSize: "1.1em",
                        fontWeight: "600",
                        transition: "0.5s",
                        textTransform: "none",
                        "&:hover": {
                          color:
                            playerOneWonMatch && isPlayerOne
                              ? "accent.main"
                              : "accent.light",
                        },
                      }}
                      onClick={() => {
                        const isMe = match.playerTwo.nickName === nickName;
                        const onPageAlready =
                          match.playerTwo.nickName === (username || nickName);
                        if (!onPageAlready) {
                          if (isMe) {
                            router.push(`/profile`);
                          } else {
                            router.push(`/profile/${match.playerTwo.nickName}`);
                          }
                        }
                      }}
                    >
                      {match.playerTwo.nickName}
                    </Button>
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
                      src={match.playerOne.avatar}
                    ></Avatar>
                    <Button
                      sx={{
                        margin: "0px 10px",
                        color: "text.secondary",
                        fontSize: "1.1em",
                        fontWeight: "600",
                        transition: "0.5s",
                        textTransform: "none",
                        "&:hover": {
                          color:
                            !playerOneWonMatch && !isPlayerOne
                              ? "accent.main"
                              : "accent.light",
                        },
                      }}
                      onClick={() => {
                        const isMe = match.playerOne.nickName === nickName;
                        const onPageAlready =
                          match.playerOne.nickName === (username || nickName);
                        if (!onPageAlready) {
                          if (isMe) {
                            router.push(`/profile`);
                          } else {
                            router.push(`/profile/${match.playerOne.nickName}`);
                          }
                        }
                      }}
                    >
                      {match.playerOne.nickName}
                    </Button>
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
