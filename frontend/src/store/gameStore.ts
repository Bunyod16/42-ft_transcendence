import { GameState } from "@/types/game";
import { create } from "zustand";

interface GameStore {
  gameState: GameState;
  setGameState: (state: GameState) => void;
}

const useGameStore = create<GameStore>()((set) => ({
  gameState: {
    playerOne: undefined,
    playerTwo: undefined,
    state: undefined,
    gameId: undefined,
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
