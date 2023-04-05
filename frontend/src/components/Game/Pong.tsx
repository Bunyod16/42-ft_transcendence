import * as THREE from "three";
import { ISize } from "./types";
import {
  ballMaterial,
  boxGeometry,
  sphereGeometry,
  tableMaterial,
} from "./resource";
import Player from "./Player";

THREE.ColorManagement.enabled = true;

interface ITableProps {
  tableSize: ISize;
}
function Table({ tableSize }: ITableProps) {
  return (
    <mesh
      geometry={boxGeometry}
      scale={[tableSize.x, tableSize.y, tableSize.z]}
      material={tableMaterial}
      receiveShadow
    />
  );
}

interface IBallProps {
  tableSize: ISize;
}
function Ball({ tableSize }: IBallProps) {
  return (
    <mesh
      geometry={sphereGeometry}
      material={ballMaterial}
      scale={tableSize.y / 2}
      position={[0, tableSize.y + 0.02, 0]}
      castShadow
    >
      <sphereGeometry />
      <meshStandardMaterial color="gray" />
    </mesh>
  );
}

// -(tableSize.x / 2 - 0.03), tableSize.y + 0.02, 0

function Pong() {
  const tableSize = { x: 6, y: 0.2, z: 3 };
  const LEFT = -1;
  const RIGHT = 1;

  return (
    <>
      <Table tableSize={tableSize} />

      <Player tableSize={tableSize} playerLR={LEFT} />

      <Player tableSize={tableSize} playerLR={RIGHT} />

      <Ball tableSize={tableSize} />
    </>
  );
}

export default Pong;
