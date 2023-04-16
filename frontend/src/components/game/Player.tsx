import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { Controls, ISize } from "./types";
import { boxGeometry, playerMaterial } from "./resource";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import React, { useRef } from "react";
import { socket } from "../socket/socket";
import useGameStore from "@/store/gameStore";
import { Mesh } from "three";
import { stat } from "fs";

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
  const lastEmit = useRef<number>(0);

  React.useEffect(() => {
    console.log("player rendered");
  }, []);

  useFrame((state, delta) => {
    if (body.current) {
      const keys = getKeys();
      lastEmit.current += delta;
      if (isPlayer && (keys.up || keys.down) && lastEmit.current >= 1 / 60) {
        lastEmit.current = 0;
        const event = keys.up ? "playerUp" : "playerDown";
        console.log(`emit [${event}]: `, matchInfo.gameId);
        socket.emit(event, { gameId: matchInfo.gameId });
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
