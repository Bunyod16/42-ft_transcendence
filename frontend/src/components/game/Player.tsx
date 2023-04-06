import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { Controls, ISize } from "./types";
import { boxGeometry, playerMaterial } from "./resource";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { useRef } from "react";

interface IPlayerProps {
  tableSize: ISize;
  playerLR: number;
}

function Player({ tableSize, playerLR }: IPlayerProps) {
  const [sub, getKeys] = useKeyboardControls<Controls>();
  const body = useRef<RapierRigidBody>(null);

  useFrame((state, delta) => {
    if (body.current) {
      const keys = getKeys();
      // if (keys.up) console.log("up");
      // if (keys.down) console.log("down");
      const steps = 2 * delta;

      const bodyPosition = body.current.translation();

      if (keys.up) {
        body.current.setNextKinematicTranslation({
          x: 0,
          y: bodyPosition.y + steps,
          z: 0,
        });
      }

      if (keys.down) {
        body.current.setNextKinematicTranslation({
          x: 0,
          y: bodyPosition.y - steps,
          z: 0,
        });
      }
    }
  });

  return (
    <RigidBody type="kinematicPosition" ref={body}>
      <mesh
        geometry={boxGeometry}
        material={playerMaterial}
        scale={[tableSize.y / 2, tableSize.y, tableSize.z / 5]}
        position={[playerLR * (tableSize.x / 2 - 0.1), 0, tableSize.y + 0.02]}
        castShadow
        rotation={[Math.PI / 2, 0, 0]}
      />
    </RigidBody>
  );
}

export default Player;
