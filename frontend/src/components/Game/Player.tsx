import { RigidBody } from "@react-three/rapier";
import { ISize } from "./types";
import { boxGeometry, playerMaterial } from "./resource";

interface IPlayerProps {
  tableSize: ISize;
  playerLR: number;
}

function Player({ tableSize, playerLR }: IPlayerProps) {
  return (
    <RigidBody type="kinematicPosition">
      <mesh
        geometry={boxGeometry}
        material={playerMaterial}
        scale={[tableSize.y / 2, tableSize.y, tableSize.z / 5]}
        position={[playerLR * (tableSize.x / 2 - 0.1), tableSize.y + 0.02, 0]}
        castShadow
      />
    </RigidBody>
  );
}

export default Player;
