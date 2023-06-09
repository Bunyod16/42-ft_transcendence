import Experience from "./Experience";
import { Perf } from "r3f-perf";
import { OrbitControls } from "@react-three/drei";
import { Box } from "@mui/material";
import Overlay from "./Overlay";
import { useRouter } from "next/router";
import { socket } from "../socket/socket";
import { Three } from "@/helpers/Three";
import { Suspense, useEffect } from "react";

function GameComponent() {
  const router = useRouter();

  useEffect(() => {
    router.beforePopState(() => {
      socket.disconnect();
      return true;
    });
    console.log("game loaded?");
  }, []);

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
      {/* <Canvas
          // orthographic
          shadows
          camera={{
            position: [0, -4, 2],
            // zoom: 200,
            // fov: 45,
            near: 0.1,
            far: 1000,
          }}
        > */}
      <Overlay />
      <Three>
        <Suspense fallback={null}>
          <Perf position="bottom-left" />

          <Experience />
          <OrbitControls />
        </Suspense>
      </Three>
      {/* </Canvas> */}
    </Box>
  );
}

export default GameComponent;
