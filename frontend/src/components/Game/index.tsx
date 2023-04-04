import { Canvas } from "@react-three/fiber";
import Experience from "./Experience";
import { Box } from "@mui/material";

function Game() {
  return (
    <Canvas>
      <ambientLight intensity={0.1} />
      <Experience />
    </Canvas>
  );
}

export default Game;
