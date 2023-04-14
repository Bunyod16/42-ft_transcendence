import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { Controls, ISize } from "./types";
import { boxGeometry, playerMaterial } from "./resource";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import React, { useRef } from "react";
import { socket } from "../socket/socket";
import useGameStore from "@/store/gameStore";
import { Mesh } from "three";

interface IPlayerProps {
  tableSize: ISize;
  playerLR: number;
  isPlayer: boolean;
}

function Player({ tableSize, playerLR, isPlayer }: IPlayerProps) {
  const [, getKeys] = useKeyboardControls<Controls>();
  // const body = useRef<RapierRigidBody>(null);
  const body = useRef<Mesh>(null);
  console.log(isPlayer);
  const { matchInfo, gameState } = useGameStore();

  React.useEffect(() => {
    console.log("player rendered");
  });

  useFrame((state, delta) => {
    if (body.current) {
      const keys = getKeys();
      // if (keys.up) console.log("up");
      // if (keys.down) console.log("down");
      // const steps = 2 * delta;
      // const bodyPosition = body.current.translation();
      if (isPlayer) {
        if (keys.up) {
          console.log("emit [playerUp] : ", matchInfo.gameId);
          socket.emit("playerUp", { gameId: matchInfo.gameId });
          // body.current.setNextKinematicTranslation({
          //   x: bodyPosition.x,
          //   y: bodyPosition.y + steps,
          //   z: bodyPosition.z,
          // });
        }
        if (keys.down) {
          console.log("emit [playerDown] : ", matchInfo.gameId);
          socket.emit("playerDown", { gameId: matchInfo.gameId });
          // body.current.setNextKinematicTranslation({
          //   x: bodyPosition.x,
          //   y: bodyPosition.y - steps,
          //   z: bodyPosition.z,
          // });
        }
      }
      const targetPosition =
        playerLR == 1 ? gameState.playerOneState.y : gameState.playerTwoState.y;
      body.current.position.y = targetPosition;
    }
  });

  return (
    // <RigidBody
    //   type="kinematicPosition"
    //   ref={body}
    //   position={[playerLR * (tableSize.x / 2 - 0.1), 0, tableSize.y + 0.02]}
    //   rotation={[Math.PI / 2, 0, 0]}
    //   restitution={1}
    // >
    <mesh
      ref={body}
      geometry={boxGeometry}
      material={playerMaterial}
      scale={[tableSize.y / 2, tableSize.y, tableSize.z / 5]}
      position={[playerLR * (tableSize.x / 2 - 10), 0, tableSize.y + 2]}
      rotation={[Math.PI / 2, 0, 0]}
      castShadow
    />
    // </RigidBody>
  );
}

export default Player;
