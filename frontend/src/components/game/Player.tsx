import { Controls, ISize } from "./types";
import { boxGeometry } from "./resource";
import { Mesh, MeshStandardMaterial } from "three";
import { socket } from "../socket/socket";
import { useFrame } from "@react-three/fiber";
import useGameState from "@/hooks/useGameState";
import useGameStore from "@/store/gameStore";
import { useKeyboardControls, useTexture } from "@react-three/drei";
import { useEffect, useRef } from "react";

interface IPlayerProps {
  tableSize: ISize;
  playerLR: number;
  isPlayer: boolean;
}

function Player({ tableSize, playerLR, isPlayer }: IPlayerProps) {
  const [, getKeys] = useKeyboardControls<Controls>();
  // const body = useRef<RapierRigidBody>(null);
  console.log("player render");
  const body = useRef<Mesh>(null);
  const mat = useRef<MeshStandardMaterial>(null);
  const matchInfo = useGameStore((state) => state.matchInfo);
  const gameStatus = useGameStore((state) => state.gameStatus);
  const lastEmit = useRef<number>(0);
  const gameState = useGameState();
  const material = useGameStore((state) => state.material);
  const playerSkin = useTexture({
    ...material[
      playerLR == 1 ? matchInfo.playerOne.skin : matchInfo.playerTwo.skin
    ],
  });
  // const [playerSkin, setPlayerSkin] = useState<any>();

  useEffect(() => {
    console.log("player rendered");
  }, []);

  useEffect(() => {
    if (gameStatus === "InGame" && mat.current) {
      mat.current.map = playerSkin.map;
      mat.current.normalMap = playerSkin.normalMap;
      mat.current.roughnessMap = playerSkin.roughnessMap;
      mat.current.aoMap = playerSkin.aoMap;
      mat.current.needsUpdate = true;
    }
  }, [gameStatus, playerSkin]);

  useFrame((state, delta) => {
    if (body.current && gameStatus == "InGame") {
      if (isPlayer) {
        const keys = getKeys();
        lastEmit.current += delta;
        if ((keys.up || keys.down) && lastEmit.current >= 1 / 60) {
          lastEmit.current = 0;
          const event = keys.up ? "playerUp" : "playerDown";
          socket.emit(event, { gameId: matchInfo.id });
        }
      }
      const targetPosition =
        playerLR == 1
          ? gameState.current.playerOne.y
          : gameState.current.playerTwo.y;
      body.current.position.y = targetPosition / 100;
    }
  });

  return (
    <mesh
      ref={body}
      geometry={boxGeometry}
      // material={playerMaterial}
      scale={[tableSize.y / 2, tableSize.y, tableSize.z / 5]}
      position={[playerLR * (tableSize.x / 2 - 0.1), 0, tableSize.y + 0.02]}
      rotation={[Math.PI / 2, 0, 0]}
      // castShadow
    >
      <meshStandardMaterial {...playerSkin} ref={mat} />
    </mesh>
  );
}

export default Player;
