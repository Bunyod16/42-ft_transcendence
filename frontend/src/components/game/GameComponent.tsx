import { Canvas } from "@react-three/fiber";
import Experience from "./Experience";
import { Perf } from "r3f-perf";
import { KeyboardControls, OrbitControls } from "@react-three/drei";
import { Box, Button } from "@mui/material";
import useUserStore from "@/store/userStore";
import { socket } from "../socket/socket";

function GameComponent() {
  const { updateState } = useUserStore();

  const handleQuit = () => {
    socket.emit("leaveGame");
    updateState("Idle");
  };

  return (
    <Box
      component={"div"}
      sx={{ width: "100vw", height: "100vh", position: "relative" }}
    >
      <Button
        variant="contained"
        sx={{ position: "absolute", bottom: 0, zIndex: 100 }}
        onClick={handleQuit}
      >
        Quit
      </Button>
      <KeyboardControls
        map={[
          { name: "up", keys: ["ArrowUp", "KeyW"] },
          { name: "down", keys: ["ArrowDown", "KeyS"] },
        ]}
      >
        <Canvas
          // orthographic
          shadows
          camera={{
            position: [0, -6, 300],
            // zoom: 200,
            // fov: 45,
            near: 100,
            far: 1000,
          }}
        >
          <Perf position="top-left" />

          <Experience />
          <OrbitControls />
        </Canvas>
      </KeyboardControls>
    </Box>
  );
}

export default GameComponent;
