import { socket } from "@/components/socket/socket";
import useGameStore from "@/store/gameStore";
import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";

const Customize = () => {
  const gameStatus = useGameStore((state) => state.gameStatus);
  const [selectedSkin, setSelectedSkin] = useGameStore((state) => [
    state.selectedSkin,
    state.setSelectedSkin,
  ]);
  const [selected, setSelected] = useState(false);

  if (gameStatus != "Customize") return <></>;
  return (
    <Box
      component={"div"}
      sx={{
        position: "absolute",
        top: "60%",
        left: "50%",
        transform: "translateX(-50%)",
      }}
    >
      {!selected ? (
        <>
          <Button
            variant="outlined"
            sx={{ pointerEvents: "all", mr: 2 }}
            onClick={() => setSelectedSkin(selectedSkin ? selectedSkin - 1 : 4)}
          >
            {"<"}
          </Button>

          <Button
            variant="outlined"
            sx={{ pointerEvents: "all" }}
            onClick={() => setSelectedSkin((selectedSkin + 1) % 4)}
          >
            {">"}
          </Button>
          <Button
            variant="contained"
            sx={{
              pointerEvents: "all",
              fontSize: 40,
              width: "max-content",
              display: "block",
              mt: 2,
            }}
            onClick={() => {
              socket.emit("userConnected", { skin: selectedSkin });
              setSelected(true);
            }}
          >
            Ready
          </Button>
        </>
      ) : (
        <Typography variant="h3">Waiting for game to start...</Typography>
      )}
    </Box>
  );
};

export default Customize;
