import * as THREE from "three";
import { ISize } from "./types";
import { boxGeometry, tableMaterial } from "./resource";
import Player from "./Player";
import Ball from "./Ball";
import { use, useEffect } from "react";
import { socket } from "../socket/socket";
import useGameStore from "@/store/gameStore";
import useUserStore from "@/store/userStore";
import { GameState } from "@/types/game-types";
import { match } from "assert";

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
  const matchInfo = useGameStore((state) => state.matchInfo);
  const setMatchInfo = useGameStore((state) => state.setMatchInfo);
  // const setGameState = useGameStore((state) => state.setGameState);
  const { name } = useUserStore();

  useEffect(() => {
    function onGameEnded(data: GameState) {
      console.log("gameEnded");
      setMatchInfo({
        ...matchInfo,
        playerOneScore: data.playerOne.score,
        playerTwoScore: data.playerTwo.score,
        gameStatus: "Ended",
      });
    }

    // socket.on("updateGame", onUpdateGame);
    socket.on("gameEnded", onGameEnded);

    return () => {
      // socket.off("updateGame", onUpdateGame);
      socket.off("gameEnded", onGameEnded);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (matchInfo.gameStatus == "InGame") socket.emit("userConnected");
  }, [matchInfo]);

  return (
    <group
      visible={
        matchInfo.gameStatus == "InGame" || matchInfo.gameStatus == "Ended"
      }
    >
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
    </group>
  );
}

export default Pong;
