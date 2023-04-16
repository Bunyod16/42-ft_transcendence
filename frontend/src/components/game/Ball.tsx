import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { ballMaterial, boxGeometry } from "./resource";
import { ISize } from "./types";
import { useEffect, useRef } from "react";
import { button, useControls } from "leva";
import { useFrame } from "@react-three/fiber";
import { Mesh } from "three";
import useGameStore from "@/store/gameStore";

interface IBallProps {
  tableSize: ISize;
}

function Ball({ tableSize }: IBallProps) {
  // const body = useRef<RapierRigidBody>(null);
  const body = useRef<Mesh>(null);
  const { gameState } = useGameStore();

  useFrame(() => {
    const x = gameState.ballProperties.x;
    const y = gameState.ballProperties.y;

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
