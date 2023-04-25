import { Controls, ISize } from "./types";
import { boxGeometry, playerMaterial } from "./resource";
import { Mesh } from "three";
import { socket } from "../socket/socket";
import { useFrame } from "@react-three/fiber";
import useGameState from "@/hooks/useGameState";
import useGameStore from "@/store/gameStore";
import { useKeyboardControls } from "@react-three/drei";
import { useEffect, useRef } from "react";

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
  const matchInfo = useGameStore((state) => state.matchInfo);
  const gameStatus = useGameStore((state) => state.gameStatus);
  const lastEmit = useRef<number>(0);
  const gameState = useGameState();

  useEffect(() => {
    console.log("player rendered");
  }, []);

  useFrame((state, delta) => {
    if (body.current && gameStatus == "InGame") {
      if (isPlayer) {
        const keys = getKeys();
        lastEmit.current += delta;
        if ((keys.up || keys.down) && lastEmit.current >= 1 / 60) {
          lastEmit.current = 0;
          const event = keys.up ? "playerUp" : "playerDown";
          // console.log(`emit [${event}]: `, matchInfo);
          socket.emit(event, { gameId: matchInfo.id });
        }
      }
      const targetPosition =
        playerLR == 1
          ? gameState.current.playerOne.y
          : gameState.current.playerTwo.y;
      body.current.position.y = targetPosition / 100;
    }
  });

  return (
    <mesh
      ref={body}
      geometry={boxGeometry}
      material={playerMaterial}
      scale={[tableSize.y / 2, tableSize.y, tableSize.z / 5]}
      position={[playerLR * (tableSize.x / 2 - 0.1), 0, tableSize.y + 0.02]}
      rotation={[Math.PI / 2, 0, 0]}
      castShadow
    />
  );
}

export default Player;
