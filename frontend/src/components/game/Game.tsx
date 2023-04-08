import { Canvas } from "@react-three/fiber";
import Experience from "./Experience";
import { Perf } from "r3f-perf";
import { KeyboardControls } from "@react-three/drei";

function Game() {
  return (
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
          position: [0, -6, 3],
          // zoom: 200,
          fov: 45,
          near: 0.1,
          far: 200,
        }}
      >
        <Perf position="top-left" />

        <Experience />
      </Canvas>
    </KeyboardControls>
  );
}

export default Game;
