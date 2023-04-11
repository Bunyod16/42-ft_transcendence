import { create } from "zustand";
import { persist } from "zustand/middleware";

interface GameState {
  playerNum: string | undefined;
  opponentName: string | undefined;
  opponentNum: string | undefined;
}

interface GameStore {
  gameState: GameState;
  setGameState: (state: GameState) => void;
}

const useGameStore = create<GameStore>()((set) => ({
  gameState: {
    playerNum: undefined,
    opponentName: undefined,
    opponentNum: undefined,
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
