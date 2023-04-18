import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { Controls, ISize } from "./types";
import { boxGeometry, playerMaterial } from "./resource";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import React, { use, useEffect, useRef } from "react";
import { socket } from "../socket/socket";
import useGameStore from "@/store/gameStore";
import { Mesh } from "three";
import { GameState } from "@/types/game-types";

interface IPlayerProps {
  tableSize: ISize;
  playerLR: number;
  isPlayer: boolean;
  gameState: GameState;
}

function Player({ tableSize, playerLR, isPlayer }: IPlayerProps) {
  const [, getKeys] = useKeyboardControls<Controls>();
  // const body = useRef<RapierRigidBody>(null);
  console.log("player render");
  const body = useRef<Mesh>(null);
  const { matchInfo } = useGameStore();
  const lastEmit = useRef<number>(0);
  const gameState = useRef<GameState>({
    playerOneState: { y: 0, isConnected: false },
    playerTwoState: { y: 0, isConnected: false },
    ballProperties: { dx: 0, dy: 0, x: 0, y: 0 },
    gameId: "",
  });

  React.useEffect(() => {
    console.log("player rendered");
  }, []);

  useEffect(() => {
    function onUpdateGame(data: any) {
      gameState.current = {
        playerOneState: data.playerOne,
        playerTwoState: data.playerTwo,
        ballProperties: data.ballProperties,
        gameId: data.id,
      };
      console.log("update game...");
    }

    socket.on("updateGame", onUpdateGame);

    return () => {
      socket.off("updateGame", onUpdateGame);
    };
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
          ? gameState.current.playerOneState.y
          : gameState.current.playerTwoState.y;
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
