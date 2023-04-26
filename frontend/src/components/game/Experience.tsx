import { socket } from "../socket/socket";
import CustomizeStep from "./CustomizeStep";
import Pong from "./Pong";
import VictoryDefeat from "./VictoryDefeat";
import useGameStore from "@/store/gameStore";
import { button, useControls } from "leva";

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
function Experience() {
  // const updateGameStatus = useGameStore((state) => state.updateGameStatus);

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
      <Lights />
      <CustomizeStep />
      <Pong />
      <VictoryDefeat />
      {/* </Physics> */}
    </>
  );
}

// ! wip: show different stuffs on different game state

export default Experience;
