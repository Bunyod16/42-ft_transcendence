import * as THREE from "three";
import { ISize } from "./types";
import { boxGeometry, tableMaterial } from "./resource";
import Player from "./Player";
import Ball from "./Ball";
import React, { useState } from "react";
import { socket } from "../socket/socket";
import useGameStore from "@/store/gameStore";
import useUserStore from "@/store/userStore";

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
  const tableSize = { x: 600, y: 20, z: 300 };
  const LEFT = -1;
  const RIGHT = 1;
  const { setGameState, matchInfo } = useGameStore();
  const { name } = useUserStore();

  React.useEffect(() => {
    socket.emit("userConnected");

    function onUpdateGame(data: any) {
      console.log("Update game...");
      console.log(data);
      setGameState({
        playerOneState: data.playerOne,
        playerTwoState: data.playerTwo,
        ballProperties: data.ballProperties,
        gameId: data.id,
      });
    }

    socket.on("updateGame", onUpdateGame);

    return () => {
      socket.off("updateGame", onUpdateGame);
    };
  }, []);

  return (
    <>
      <Table tableSize={tableSize} />

      <Player
        tableSize={tableSize}
        playerLR={LEFT}
        isPlayer={matchInfo.playerOne?.nickName == name}
      />

      <Player
        tableSize={tableSize}
        playerLR={RIGHT}
        isPlayer={matchInfo.playerTwo?.nickName == name}
      />

      <Ball tableSize={tableSize} />
    </>
  );
}

export default Pong;
