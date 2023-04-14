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
  // useControls({
  //   push: button(() => {
  //     if (body.current) {
  //       body.current.applyImpulse({ x: 0.05, y: 0, z: 0 }, true);
  //       console.log("apply impulse");
  //     }
  //   }),
  //   reset: button(() => {
  //     if (body.current) {
  //       body.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
  //       body.current.setTranslation(
  //         { x: 0, y: 0, z: tableSize.y + 0.02 },
  //         true,
  //       );
  //     }
  //   }),
  // });

  useEffect(() => {
    console.log("ball rendered");
  });

  useFrame(() => {
    const x = gameState.ballProperties.x;
    const y = gameState.ballProperties.y;

    body.current?.position.set(x, y, body.current?.position.z);
  });

  return (
    // <RigidBody
    //   ref={body}
    // colliders="ball"
    // mass={5}
    // position={[0, 0, tableSize.y + 0.02]}
    // linearDamping={0.5}
    // restitution={1}
    // lockRotations={true}
    // >
    <mesh
      ref={body}
      geometry={boxGeometry}
      material={ballMaterial}
      scale={tableSize.y}
      castShadow
      position={[0, 0, tableSize.y + 0.02]}
    >
      {/* <sphereGeometry />
        <meshStandardMaterial color="gray" /> */}
    </mesh>
    // </RigidBody>
  );
}
export default Ball;
