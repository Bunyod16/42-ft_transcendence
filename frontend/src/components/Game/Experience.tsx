import { Debug, Physics } from "@react-three/rapier";
import Pong from "./Pong";
import { OrbitControls } from "@react-three/drei";

function Experience() {
  return (
    <>
      <color args={["#252731"]} attach="background" />

      <OrbitControls />

      <Physics>
        <Debug />
        <directionalLight
          castShadow
          position={[3, 3, 1]}
          intensity={1.5}
          shadow-mapSize={[1024, 1024]}
          shadow-camera-near={1}
          shadow-camera-far={10}
          shadow-camera-top={10}
          shadow-camera-right={10}
          shadow-camera-bottom={-10}
          shadow-camera-left={-10}
        />
        <ambientLight intensity={0.5} />
        <Pong />
      </Physics>
    </>
  );
}

export default Experience;
