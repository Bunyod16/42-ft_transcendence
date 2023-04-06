import * as THREE from "three";
import { ISize } from "./types";
import { useControls } from "leva";
import { boxGeometry, tableMaterial } from "./resource";
import Player from "./Player";
import Ball from "./Ball";
import { useState } from "react";

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
      rotation={[Math.PI / 2, 0, 0]}
      receiveShadow
    />
  );
}

// -(tableSize.x / 2 - 0.03), tableSize.y + 0.02, 0

// ! zustand save playerNumber
function Pong() {
  const tableSize = { x: 6, y: 0.2, z: 3 };
  const LEFT = -1;
  const RIGHT = 1;
  const [player] = useState(() => Math.round(Math.random()));

  console.log(player);
  return (
    <>
      <Table tableSize={tableSize} />

      <Player tableSize={tableSize} playerLR={LEFT} isPlayer={player == 1} />

      <Player tableSize={tableSize} playerLR={RIGHT} isPlayer={player == 0} />

      <Ball tableSize={tableSize} />
    </>
  );
}

export default Pong;
