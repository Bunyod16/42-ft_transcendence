import * as THREE from "three";
import { ISize } from "./types";
import { boxGeometry, tableMaterial } from "./resource";
import Player from "./Player";
import Ball from "./Ball";
import { useEffect } from "react";
import { socket } from "../socket/socket";
import useGameStore from "@/store/gameStore";
import useUserStore from "@/store/userStore";
import { GameState } from "@/types/game-type";

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
  const gameStatus = useGameStore((state) => state.gameStatus);
  const setMatchInfo = useGameStore((state) => state.setMatchInfo);
  const updateGameStatus = useGameStore((state) => state.updateGameStatus);
  const name = useUserStore((state) => state.name);
  const updateGameSkin = useGameStore((state) => state.updateGameSkin);

  const checkIsWinner = (data: GameState) => {
    if (
      name === matchInfo.playerOne.nickName &&
      data.playerOne.score > data.playerTwo.score
    )
      return true;
    if (
      name === matchInfo.playerTwo.nickName &&
      data.playerTwo.score > data.playerOne.score
    )
      return true;
    return false;
  };
  useEffect(() => {
    function onMatchBegin(data: GameState) {
      updateGameSkin(data.playerOne.skin, data.playerTwo.skin);
      updateGameStatus("InGame");
    }
    function onGameEnded(data: GameState) {
      console.log("gameEnded");
      setMatchInfo({
        ...matchInfo,
        playerOneScore: data.playerOne.score,
        playerTwoScore: data.playerTwo.score,
        isWinner: checkIsWinner(data),
      });
      updateGameStatus("Ended");
    }

    // socket.on("updateGame", onUpdateGame);
    socket.on("gameEnded", onGameEnded);
    socket.on("matchBegin", onMatchBegin);

    return () => {
      // socket.off("updateGame", onUpdateGame);
      socket.off("gameEnded", onGameEnded);
      socket.off("matchBegin", onMatchBegin);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <group visible={gameStatus == "InGame" || gameStatus == "Ended"}>
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
