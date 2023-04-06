import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { sphereGeometry, ballMaterial } from "./resource";
import { ISize } from "./types";
import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";

interface IBallProps {
  tableSize: ISize;
}

function Ball({ tableSize }: IBallProps) {
  const body = useRef<RapierRigidBody>(null);

  return (
    <RigidBody type="dynamic" ref={body}>
      <mesh
        geometry={sphereGeometry}
        material={ballMaterial}
        scale={tableSize.y / 2}
        position={[0, 0, tableSize.y + 0.02]}
        castShadow
      >
        <sphereGeometry />
        <meshStandardMaterial color="gray" />
      </mesh>
    </RigidBody>
  );
}
export default Ball;
