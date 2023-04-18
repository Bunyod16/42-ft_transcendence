import { Controls, ISize } from "./types";
import { boxGeometry, playerMaterial } from "./resource";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import React, { useRef } from "react";
import { socket } from "../socket/socket";
import useGameStore from "@/store/gameStore";
import { Mesh } from "three";
import useGameState from "@/hooks/useGameState";

interface IPlayerProps {
  tableSize: ISize;
  playerLR: number;
  isPlayer: boolean;
}

function Player({ tableSize, playerLR, isPlayer }: IPlayerProps) {
  const [, getKeys] = useKeyboardControls<Controls>();
  // const body = useRef<RapierRigidBody>(null);
  console.log("player render");
  const body = useRef<Mesh>(null);
  const { matchInfo } = useGameStore();
  const lastEmit = useRef<number>(0);
  const gameState = useGameState();

  React.useEffect(() => {
    console.log("player rendered");
  }, []);

  useFrame((state, delta) => {
    if (body.current) {
      if (isPlayer) {
        const keys = getKeys();
        lastEmit.current += delta;
        if ((keys.up || keys.down) && lastEmit.current >= 1 / 60) {
          lastEmit.current = 0;
          const event = keys.up ? "playerUp" : "playerDown";
          console.log(`emit [${event}]: `, gameState);
          socket.emit(event, { gameId: matchInfo.gameId });
        }
      }
      const targetPosition =
        playerLR == 1
          ? gameState.current.playerOne.y
          : gameState.current.playerTwo.y;
      body.current.position.y = targetPosition;
    }
  });

  return (
    <mesh
      ref={body}
      geometry={boxGeometry}
      material={playerMaterial}
      scale={[tableSize.y / 2, tableSize.y, tableSize.z / 5]}
      position={[playerLR * (tableSize.x / 2 - 10), 0, tableSize.y + 2]}
      rotation={[Math.PI / 2, 0, 0]}
      castShadow
    />
  );
}

export default Player;
