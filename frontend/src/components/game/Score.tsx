import { Box, Typography } from "@mui/material";
import { useEffect, useState, useRef } from "react";
import { socket } from "../socket/socket";
import { GameState } from "@/types/game-types";

const Score = () => {
  const prevScore = useRef({ p1Score: 0, p2Score: 0 });
  const [score, setScore] = useState({ p1Score: 0, p2Score: 0 });

  useEffect(() => {
    function onUpdateGame(data: GameState) {
      if (
        data.playerOne.score != prevScore.current.p1Score ||
        data.playerTwo.score != prevScore.current.p2Score
      )
        setScore({
          p1Score: data.playerOne.score,
          p2Score: data.playerTwo.score,
        });
    }

    socket.on("updateGame", onUpdateGame);
  }, []);

  return (
    <Box
      component={"div"}
      sx={{
        zIndex: 100,
        display: "flex",
        gap: 20,
        justifyContent: "center",
        position: "absolute",
        bgColor: "transparent",
        left: "50%",
        top: 10,
        transform: "translateX(-50%)",
      }}
    >
      <Typography variant="h3">{score.p1Score}</Typography>
      <Typography variant="h3">{score.p2Score}</Typography>
    </Box>
  );
};

export default Score;
