import * as THREE from "three";

THREE.ColorManagement.enabled = true;

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const sphereGeometry = new THREE.SphereGeometry(1, 1, 1);

const tableMaterial = new THREE.MeshStandardMaterial({ color: "darkgreen" });
const playerMaterial = new THREE.MeshStandardMaterial({ color: "yellow" });
const ballMaterial = new THREE.MeshStandardMaterial({ color: "white" });

interface ISize {
  x: number;
  y: number;
  z: number;
}

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

interface IPlayerProps {
  tableSize: ISize;
  playerLR: number;
}
function Player({ tableSize, playerLR }: IPlayerProps) {
  return (
    <mesh
      geometry={boxGeometry}
      material={playerMaterial}
      scale={[tableSize.y / 2, tableSize.y, tableSize.z / 5]}
      position={[playerLR * (tableSize.x / 2 - 0.1), tableSize.y + 0.02, 0]}
      castShadow
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
