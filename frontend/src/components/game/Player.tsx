import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { Controls, ISize } from "./types";
import { boxGeometry, playerMaterial } from "./resource";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import React, { useRef } from "react";
import { socket } from "../socket/socket";

interface IPlayerProps {
  tableSize: ISize;
  playerLR: number;
  isPlayer: boolean;
}

function Player({ tableSize, playerLR, isPlayer }: IPlayerProps) {
  const [, getKeys] = useKeyboardControls<Controls>();
  const body = useRef<RapierRigidBody>(null);
  console.log(isPlayer);

  useFrame((state, delta) => {
    if (body.current) {
      const keys = getKeys();
      // if (keys.up) console.log("up");
      // if (keys.down) console.log("down");
      const steps = 2 * delta;
      const bodyPosition = body.current.translation();
      if (isPlayer) {
        if (keys.up) {
          socket.emit("playerUp");
          body.current.setNextKinematicTranslation({
            x: bodyPosition.x,
            y: bodyPosition.y + steps,
            z: bodyPosition.z,
          });
        }
        if (keys.down) {
          socket.emit("playerDown");
          body.current.setNextKinematicTranslation({
            x: bodyPosition.x,
            y: bodyPosition.y - steps,
            z: bodyPosition.z,
          });
        }
      }
    }
  });

  return (
    <RigidBody
      type="kinematicPosition"
      ref={body}
      position={[playerLR * (tableSize.x / 2 - 0.1), 0, tableSize.y + 0.02]}
      rotation={[Math.PI / 2, 0, 0]}
      restitution={1}
    >
      <mesh
        geometry={boxGeometry}
        material={playerMaterial}
        scale={[tableSize.y / 2, tableSize.y, tableSize.z / 5]}
        castShadow
      />
    </RigidBody>
  );
}

export default Player;
