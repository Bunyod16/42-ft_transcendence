import { Canvas } from "@react-three/fiber";
import Experience from "./Experience";
import { Perf } from "r3f-perf";

function Game() {
  return (
    <Canvas
      // orthographic
      shadows
      camera={{
        position: [0, 2, 4],
        // zoom: 200,
        fov: 45,
        near: 0.1,
        far: 200,
      }}
    >
      <Perf position="top-left" />

      <Experience />
    </Canvas>
  );
}

export default Game;
