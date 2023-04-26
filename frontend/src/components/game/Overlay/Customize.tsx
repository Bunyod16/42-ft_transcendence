import { socket } from "@/components/socket/socket";
import useGameStore from "@/store/gameStore";
import { Box, Button } from "@mui/material";

const Customize = () => {
  const gameStatus = useGameStore((state) => state.gameStatus);
  const selectedSkin = useGameStore((state) => state.selectedSkin);

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
        onClick={() => socket.emit("userConnected", { skin: selectedSkin })}
      >
        Ready
      </Button>
    </Box>
  );
};

export default Customize;
