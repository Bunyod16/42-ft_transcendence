import { Canvas } from "@react-three/fiber";
import Experience from "./Experience";
import { Perf } from "r3f-perf";
import { KeyboardControls, OrbitControls } from "@react-three/drei";
import { Box, Button } from "@mui/material";
import useUserStore from "@/store/userStore";
import { socket } from "../socket/socket";
import Overlay from "./Overlay";

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
            position: [0, -4, 2],
            // zoom: 200,
            // fov: 45,
            near: 0.1,
            far: 1000,
          }}
        >
          <Perf position="bottom-left" />

          <Experience />
          <OrbitControls />
        </Canvas>
        <Overlay />
      </KeyboardControls>
    </Box>
  );
}

export default GameComponent;
