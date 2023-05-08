import { GameState, GameStatus, MatchInfo, Textures } from "@/types/game-type";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
// import { produce } from "immer";

interface GameStore {
  material: Textures[];
  selectedSkin: number;
  gameStatus: GameStatus;
  matchInfo: MatchInfo;
  gameState: GameState;
  setSelectedSkin: (selectedSkin: number) => void;
  updateGameSkin: (skinOne: number, skinTwo: number) => void;
  setGameState: (state: GameState) => void;
  setMatchInfo: (matchInfo: MatchInfo) => void;
  updateGameStatus: (gameStatus: GameStatus) => void;
}

const useGameStore = create<GameStore>()(
  immer((set) => ({
    material: [
      {
        map: "/asset/material/Quartz-001/Quartz_003_COLOR.jpg",
        // displacementMap:
        //   "/asset/material/Quartz-001/Quartz_003_DISP.jpg",
        normalMap: "/asset/material/Quartz-001/Quartz_003_NORM.jpg",
        roughnessMap: "/asset/material/Quartz-001/Quartz_003_ROUGH.jpg",
        aoMap: "/asset/material/Quartz-001/Quartz_003_OCC.jpg",
      },
      {
        map: "/asset/material/Agate_001_SD/Agate_001_COLOR.jpg",
        // displacementMap: "/asset/material/Agate_001_SD/Agate_001_DISP.",
        normalMap: "/asset/material/Agate_001_SD/Agate_001_NORM.jpg",
        roughnessMap: "/asset/material/Agate_001_SD/Agate_001_ROUGH.jpg",
        aoMap: "/asset/material/Agate_001_SD/Agate_001_OCC.jpg",
      },
      {
        map: "/asset/material/Lapis_Lazuli_001_SD/Lapis_Lazuli_001_COLOR.jpg",
        // displacementMap:
        //   "/asset/material/Lapis_Lazuli_001_SD/Lapis_Lazuli_001_DISP.jpg",
        normalMap:
          "/asset/material/Lapis_Lazuli_001_SD/Lapis_Lazuli_001_NORM.jpg",
        roughnessMap:
          "/asset/material/Lapis_Lazuli_001_SD/Lapis_Lazuli_001_ROUGH.jpg",
        aoMap: "/asset/material/Lapis_Lazuli_001_SD/Lapis_Lazuli_001_OCC.jpg",
      },
      {
        map: "/asset/material/Metal-001/Metal_006_COLOR.jpg",
        // displacementMap:
        //   "/asset/material/Metal-001/Metal_006_DISP.jpg",
        normalMap: "/asset/material/Metal-001/Metal_006_NORM.jpg",
        roughnessMap: "/asset/material/Metal-001/Metal_006_ROUGH.jpg",
        aoMap: "/asset/material/Metal-001/Metal_006_OCC.jpg",
      },
    ],
    matchInfo: {
      id: "",
      playerOne: { id: "", nickName: "", skin: 0 },
      playerTwo: { id: "", nickName: "", skin: 0 },
      isWinner: false,
    },
    setMatchInfo: (matchInfo: MatchInfo) =>
      set(() => ({
        matchInfo,
      })),
    updateGameSkin: (skinOne, skinTwo) => {
      set((state) => {
        state.matchInfo.playerOne.skin = skinOne;
        state.matchInfo.playerTwo.skin = skinTwo;
      });
    },
    gameStatus: "InGame",
    updateGameStatus: (gameStatus: GameStatus) => set(() => ({ gameStatus })),
    gameState: {
      playerOne: { y: 0, isConnected: false, score: 0, skin: 0 },
      playerTwo: { y: 0, isConnected: false, score: 0, skin: 0 },
      ballProperties: { dx: 0, dy: 0, x: 0, y: 0 },
    },
    setGameState: (state: GameState) =>
      set(() => ({
        gameState: state,
      })),
    selectedSkin: 0,
    setSelectedSkin: (selectedSkin: number) => set(() => ({ selectedSkin })),
  })),
);

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
