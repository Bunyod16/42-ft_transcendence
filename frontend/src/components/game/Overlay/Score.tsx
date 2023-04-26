import { socket } from "@/components/socket/socket";
import useGameStore from "@/store/gameStore";
import { GameState } from "@/types/game-types";
import { Box, Typography, Avatar } from "@mui/material";
import { useState, useEffect } from "react";

const Score = () => {
  const [score, setScore] = useState({ p1Score: 0, p2Score: 0 });
  const matchInfo = useGameStore((state) => state.matchInfo);
  const gameStatus = useGameStore((state) => state.gameStatus);
  useEffect(() => {
    function onUpdateGame(data: GameState) {
      if (
        data.playerOne.score != score.p1Score ||
        data.playerTwo.score != score.p2Score
      )
        setScore({
          p1Score: data.playerOne.score,
          p2Score: data.playerTwo.score,
        });
    }

    socket.on("updateGame", onUpdateGame);

    return () => {
      socket.off("updateGame", onUpdateGame);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (gameStatus != "InGame") return <></>;

  return (
    <Box
      component={"div"}
      sx={{
        // zIndex: 100,
        display: "flex",
        // gap: 20,
        // justifyContent: "center",
        position: "absolute",
        // bgColor: "transparent",
        top: 0,
        width: "100%",
        height: 60,
      }}
    >
      <Box
        component={"div"}
        sx={{
          flex: 1,
          backgroundColor: "accent.main",
          position: "relative",
          display: "flex",
          flexDirection: "row-reverse",
          alignItems: "center",
          px: 2,
          gap: 2,
        }}
      >
        <Typography variant="h3" sx={{}}>
          {score.p2Score}
        </Typography>
        <Typography>{matchInfo.playerTwo?.nickName || "noname"}</Typography>
        <Avatar
          src={`https://source.boringavatars.com/beam/80/${matchInfo.playerTwo?.nickName}`}
          sx={{
            width: 80,
            height: 80,
            position: "absolute",
            left: 20,
            top: 10,
          }}
        />
      </Box>

      <Box
        component={"div"}
        sx={{
          flex: 1,
          backgroundColor: "secondary.main",
          position: "relative",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          px: 2,
          gap: 2,
        }}
      >
        <Typography variant="h3" sx={{}}>
          {score.p1Score}
        </Typography>
        <Typography>{matchInfo.playerOne?.nickName || "noname"}</Typography>
        <Avatar
          src={`https://source.boringavatars.com/beam/80/${matchInfo.playerOne?.nickName}`}
          sx={{
            width: 80,
            height: 80,
            position: "absolute",
            right: 20,
            top: 10,
          }}
        />
      </Box>
    </Box>
  );
};

export default Score;
