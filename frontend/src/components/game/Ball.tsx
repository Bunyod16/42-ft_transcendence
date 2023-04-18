import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { ballMaterial, boxGeometry } from "./resource";
import { ISize } from "./types";
import { useEffect, useRef } from "react";
import { button, useControls } from "leva";
import { useFrame } from "@react-three/fiber";
import { Mesh } from "three";
import useGameStore from "@/store/gameStore";
import { GameState } from "@/types/game-types";
import { socket } from "../socket/socket";
import useGameState from "@/hooks/useGameState";

interface IBallProps {
  tableSize: ISize;
}

function Ball({ tableSize }: IBallProps) {
  const body = useRef<Mesh>(null);

  const gameState = useGameState();

  useFrame(() => {
    const x = gameState.current.ballProperties.x;
    const y = gameState.current.ballProperties.y;

    body.current?.position.set(x, y, body.current?.position.z);
  });

  return (
    <mesh
      ref={body}
      geometry={boxGeometry}
      material={ballMaterial}
      scale={tableSize.y}
      castShadow
      position={[0, 0, tableSize.y + 0.02]}
    ></mesh>
  );
}
export default Ball;
