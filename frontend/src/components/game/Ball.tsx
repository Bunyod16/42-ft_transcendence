import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { ballMaterial, boxGeometry } from "./resource";
import { ISize } from "./types";
import { useRef } from "react";
import { button, useControls } from "leva";

interface IBallProps {
  tableSize: ISize;
}

function Ball({ tableSize }: IBallProps) {
  const body = useRef<RapierRigidBody>(null);
  useControls({
    push: button(() => {
      if (body.current) {
        body.current.applyImpulse({ x: 0.05, y: 0, z: 0 }, true);
        console.log("apply impulse");
      }
    }),
    reset: button(() => {
      if (body.current) {
        body.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
        body.current.setTranslation(
          { x: 0, y: 0, z: tableSize.y + 0.02 },
          true,
        );
      }
    }),
  });

  return (
    <RigidBody
      ref={body}
      // colliders="ball"
      mass={5}
      position={[0, 0, tableSize.y + 0.02]}
      // linearDamping={0.5}
      restitution={1}
      lockRotations={true}
    >
      <mesh
        geometry={boxGeometry}
        material={ballMaterial}
        scale={tableSize.y}
        castShadow
      >
        {/* <sphereGeometry />
        <meshStandardMaterial color="gray" /> */}
      </mesh>
    </RigidBody>
  );
}
export default Ball;
