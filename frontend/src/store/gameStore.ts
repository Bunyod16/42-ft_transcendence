import { GameState, GameStatus, MatchInfo } from "@/types/game-types";
import { create } from "zustand";

interface GameStore {
  matchInfo: MatchInfo;
  gameState: GameState;
  setGameState: (state: GameState) => void;
  setMatchInfo: (matchInfo: MatchInfo) => void;
  updateGameStatus: (gameStatus: GameStatus) => void;
}

const useGameStore = create<GameStore>()((set, get) => ({
  matchInfo: {
    playerOne: undefined,
    playerTwo: undefined,
    id: "",
    gameStatus: "NoGame",
    isWinner: false,
  },
  setMatchInfo: (matchInfo: MatchInfo) =>
    set(() => ({
      matchInfo,
    })),
  updateGameStatus: (gameStatus: GameStatus) =>
    set(() => ({
      matchInfo: { ...get().matchInfo, gameStatus },
    })),
  gameState: {
    playerOne: { y: 0, isConnected: false, score: 0 },
    playerTwo: { y: 0, isConnected: false, score: 0 },
    ballProperties: { dx: 0, dy: 0, x: 0, y: 0 },
  },
  setGameState: (state: GameState) =>
    set(() => ({
      gameState: state,
    })),
}));

// Persist state changes to localStorage
// This will ensure that any changes made to the user state are saved
// and can be restored when the user returns to the site
// useUserStore.subscribe(
//   (state) => {
//     localStorage.setItem("user", JSON.stringify(state));
//   },
//   (state) => state.isLoggedIn && typeof window !== "undefined",
// );

export default useGameStore;
