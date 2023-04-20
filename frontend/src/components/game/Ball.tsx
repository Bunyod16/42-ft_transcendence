import { ballMaterial, boxGeometry } from "./resource";
import { ISize } from "./types";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh } from "three";
import useGameState from "@/hooks/useGameState";

interface IBallProps {
  tableSize: ISize;
}

function Ball({ tableSize }: IBallProps) {
  const body = useRef<Mesh>(null);

  const gameState = useGameState();

  useFrame(() => {
    const x = gameState.current.ballProperties.x / 100;
    const y = gameState.current.ballProperties.y / 100;

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
