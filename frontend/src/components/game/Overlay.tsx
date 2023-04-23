import { Avatar, Box, Button, Typography } from "@mui/material";
import useGameStore from "@/store/gameStore";
import { GameState } from "@/types/game-types";
import { useState, useEffect } from "react";
import { socket } from "../socket/socket";
import useUserStore from "@/store/userStore";

interface BgColorBox {
  color: string;
}
const BgColorBox = ({ color }: BgColorBox) => {
  return (
    <Box
      component={"div"}
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: color,
        opacity: 0.8,
      }}
    />
  );
};

interface Player {
  name: string;
  score: number;
  color: string;
  position: "left" | "right";
}

const PlayerResult = ({ name, score, color, position }: Player) => {
  return (
    <Box
      component={"div"}
      sx={{
        width: "100%",
        height: 200,
        position: "relative",
      }}
    >
      <BgColorBox color={color} />
      <Typography
        variant="h2"
        sx={{
          position: "absolute",
          top: 10,
          ...(position == "left" ? { right: 20 } : { left: 20 }),
        }}
      >
        {score}
      </Typography>
      <Box
        component={"div"}
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: position == "left" ? "row" : "row-reverse",
          gap: 2,
          px: 5,
        }}
      >
        <Box
          component={"div"}
          sx={{
            backgroundImage: `url(https://source.boringavatars.com/beam/200/${name})`,
            width: 200,
            height: 200,
            position: "relative",
            top: -100,
          }}
        />
        <Typography variant="h4">{name}</Typography>
      </Box>
    </Box>
  );
};

const GameResult = () => {
  const matchInfo = useGameStore((store) => store.matchInfo);
  const players = {
    p1: {
      name: matchInfo.playerOne?.nickName || "",
      score: matchInfo.playerOneScore || 0,
      color: "secondary.main",
    },
    p2: {
      name: matchInfo.playerTwo?.nickName || "",
      score: matchInfo.playerTwoScore || 0,
      color: "accent.main",
    },
  };
  const updateGameStatus = useGameStore((state) => state.updateGameStatus);
  const updateView = useUserStore((state) => state.updateView);

  if (matchInfo.gameStatus != "Ended") return <></>;
  return (
    <Box
      component={"div"}
      sx={{
        position: "absolute",
        top: "40%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box
        component={"div"}
        sx={{
          display: "flex",
          width: "100%",
        }}
      >
        <PlayerResult {...players.p1} position={"left"} />
        <PlayerResult {...players.p2} position="right" />
      </Box>

      <Button
        variant="contained"
        fullWidth={false}
        color="accent"
        sx={{ pointerEvents: "all", fontSize: 40, width: "max-content", mt: 5 }}
        onClick={() => {
          updateGameStatus("NoGame");
          updateView("Lobby");
        }}
      >
        Continue
      </Button>
    </Box>
  );
};

const Score = () => {
  const [score, setScore] = useState({ p1Score: 0, p2Score: 0 });
  const matchInfo = useGameStore((state) => state.matchInfo);
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

  if (matchInfo.gameStatus != "InGame") return <></>;

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
          {score.p1Score}
        </Typography>
        <Typography>{matchInfo.playerTwo?.nickName || "noname"}</Typography>
        <Avatar
          src={`https://source.boringavatars.com/beam/80/${matchInfo.playerOne?.nickName}`}
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
          {score.p2Score}
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

const Overlay = () => {
  const gameStatus = useGameStore((state) => state.matchInfo.gameStatus);

  if (gameStatus == "NoGame") return <></>;
  return (
    <Box
      component={"div"}
      sx={{
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        pointerEvents: "none",
      }}
    >
      <Score />
      <GameResult />
    </Box>
  );
};

export default Overlay;
