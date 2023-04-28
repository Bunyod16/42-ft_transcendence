import { Box } from "@mui/material";
import useGameStore from "@/store/gameStore";

import GameResult from "./GameResult";
import Score from "./Score";
import Customize from "./Customize";

const Overlay = () => {
  const gameStatus = useGameStore((state) => state.gameStatus);

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
      <Customize />
      <Score />
      <GameResult />
    </Box>
  );
};

export default Overlay;
