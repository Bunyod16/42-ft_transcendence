import { Canvas } from "@react-three/fiber";
import Experience from "./Experience";
import { Perf } from "r3f-perf";
import { KeyboardControls, OrbitControls } from "@react-three/drei";
import { Box } from "@mui/material";
import Overlay from "./Overlay";
import useUserStore from "@/store/userStore";

function GameComponent() {
  const view = useUserStore((state) => state.view);
  return (
    <Box
      component={"div"}
      sx={{
        width: "100vw",
        height: "100vh",
        position: "absolute",
        top: 0,
        left: 0,
        display: "block",
        // zIndex: -100,
      }}
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
