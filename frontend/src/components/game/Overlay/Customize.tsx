import useGameStore from "@/store/gameStore";
import { Box, Button } from "@mui/material";

const Customize = () => {
  const gameStatus = useGameStore((state) => state.gameStatus);
  const updateGameStatus = useGameStore((state) => state.updateGameStatus);

  if (gameStatus != "Customize") return <></>;
  return (
    <Box
      component={"div"}
      sx={{
        position: "absolute",
        top: "60%",
        left: "50%",
        translate: "transformX(-50%)",
      }}
    >
      <Button
        variant="contained"
        sx={{ pointerEvents: "all", fontSize: 40, width: "max-content" }}
        onClick={() => updateGameStatus("InGame")}
      >
        Ready
      </Button>
    </Box>
  );
};

export default Customize;
