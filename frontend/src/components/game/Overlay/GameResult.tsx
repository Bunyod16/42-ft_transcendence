import useGameStore from "@/store/gameStore";
import useUserStore from "@/store/userStore";
import { Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/router";

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
  const router = useRouter();
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
  const gameStatus = useGameStore((state) => state.gameStatus);

  if (gameStatus != "Ended") return <></>;
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
        <PlayerResult {...players.p2} position="left" />
        <PlayerResult {...players.p1} position="right" />
      </Box>

      <Button
        variant="contained"
        fullWidth={false}
        color="accent"
        sx={{ pointerEvents: "all", fontSize: 40, width: "max-content", mt: 5 }}
        onClick={() => {
          updateGameStatus("NoGame");
          updateView("Lobby");
          router.push("/");
        }}
      >
        Continue
      </Button>
    </Box>
  );
};

export default GameResult;
