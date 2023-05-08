import useGameStore from "@/store/gameStore";
import { socket } from "../socket/socket";
import CustomizeStep from "./CustomizeStep";
import Pong from "./Pong";
import VictoryDefeat from "./VictoryDefeat";
import * as THREE from "three";

import { button, useControls } from "leva";
import { useFrame, useThree } from "@react-three/fiber";
import { GizmoHelper, GizmoViewport } from "@react-three/drei";

function Lights() {
  return (
    <>
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
    </>
  );
}

function CameraRig() {
  const gameStatus = useGameStore((state) => state.gameStatus);
  const vec = new THREE.Vector3();
  useFrame((state) => {
    // Three.easing.damp3(
    //   state.camera.position,
    //   [gameStatus === "InGame" ? -state.viewport.width / 4 : 0, 0, 2],
    //   0.25,
    //   delta,
    // );
    if (gameStatus === "Customize") return null;
    state.camera.lookAt(0, 0, 0);
    state.camera.position.lerp(vec.set(0, -4, 2), 0.01);
    state.camera.updateProjectionMatrix();
    return null;
  });
  return <></>;
}

function Experience() {
  const updateGameStatus = useGameStore((state) => state.updateGameStatus);

  // useControls({
  //   InGame: button(() => updateGameStatus("InGame")),
  //   Ended: button(() => {
  //     updateGameStatus("Ended");
  //     socket.emit("userDisconnected");
  //   }),
  //   NoGame: button(() => updateGameStatus("NoGame")),
  //   Customize: button(() => updateGameStatus("Customize")),
  // });
  return (
    <>
      <color args={["#26333A"]} attach="background" />

      {/* <Physics gravity={[0, 0, 0]}> */}
      {/* <Debug /> */}
      <CameraRig />
      <Lights />
      {/* <CustomizeStep /> */}
      <Pong />
      <VictoryDefeat />
      {/* <GizmoHelper
        alignment="bottom-right" // widget alignment within scene
        margin={[80, 80]} // widget margins (X, Y)
        onUpdate={() => console.log(camera)}
      >
        <GizmoViewport
          axisColors={["red", "green", "blue"]}
          labelColor="black"
        />
      </GizmoHelper> */}
    </>
  );
}

// ! wip: show different stuffs on different game state

export default Experience;
