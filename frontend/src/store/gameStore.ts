import { GameState, MatchInfo } from "@/types/game-types";
import { create } from "zustand";

interface GameStore {
  matchInfo: MatchInfo;
  gameState: GameState;
  setGameState: (state: GameState) => void;
  setMatchInfo: (matchInfo: MatchInfo) => void;
}

const useGameStore = create<GameStore>()((set) => ({
  matchInfo: {
    playerOne: undefined,
    playerTwo: undefined,
  },
  setMatchInfo: (matchInfo: MatchInfo) =>
    set(() => ({
      matchInfo,
    })),
  gameState: {
    playerOneState: { y: 0, isConnected: false },
    playerTwoState: { y: 0, isConnected: false },
    ballProperties: { dx: 0, dy: 0, x: 0, y: 0 },
    gameId: "",
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
