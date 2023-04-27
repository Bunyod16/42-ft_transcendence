import { socket } from "@/components/socket/socket";
import { GameState } from "@/types/game-types";
import { useEffect, useRef } from "react";

function useGameState() {
  const gameState = useRef<GameState>({
    playerOne: { y: 0, isConnected: false, score: 0, skin: 0 },
    playerTwo: { y: 0, isConnected: false, score: 0, skin: 0 },
    ballProperties: { dx: 0, dy: 0, x: 0, y: 0 },
  });

  useEffect(() => {
    function onUpdateGame(data: GameState) {
      gameState.current = {
        playerOne: data.playerOne,
        playerTwo: data.playerTwo,
        ballProperties: data.ballProperties,
      };
    }

    socket.on("updateGame", onUpdateGame);

    return () => {
      socket.off("updateGame", onUpdateGame);
    };
  }, []);

  return gameState;
}

export default useGameState;
