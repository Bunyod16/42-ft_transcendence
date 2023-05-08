import { Controls, ISize } from "./types";
import { boxGeometry } from "./resource";
import { Mesh, MeshStandardMaterial } from "three";
import { socket } from "../socket/socket";
import { useFrame } from "@react-three/fiber";
import useGameState from "@/hooks/useGameState";
import useGameStore from "@/store/gameStore";
import { useKeyboardControls, useTexture } from "@react-three/drei";
import { useEffect, useState, useRef } from "react";
import * as THREE from "three";

interface IPlayerProps {
  tableSize: ISize;
  playerLR: number;
  isPlayer: boolean;
}

function Player({ tableSize, playerLR, isPlayer }: IPlayerProps) {
  const [, getKeys] = useKeyboardControls<Controls>();
  const body = useRef<Mesh>(null);
  const mat = useRef<MeshStandardMaterial>(null);
  const matchInfo = useGameStore((state) => state.matchInfo);
  const gameStatus = useGameStore((state) => state.gameStatus);
  const lastEmit = useRef<number>(0);
  const gameState = useGameState();
  const [material, selectedSkin] = useGameStore((state) => [
    state.material,
    state.selectedSkin,
  ]);
  const playerSkin = useTexture({
    ...material[
      playerLR == 1 ? matchInfo.playerOne.skin : matchInfo.playerTwo.skin
    ],
  });
  const tmpSkin = useTexture({
    ...material[selectedSkin],
  });
  const [updatedCamera, setUpdatedCamera] = useState(false);
  const cameraPosition = new THREE.Vector3();

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

  useEffect(() => {
    setUpdatedCamera(false);
  }, [gameStatus]);

  useFrame((state, delta) => {
    if (!body.current) return null;

    if (gameStatus === "Customize" && isPlayer && !updatedCamera) {
      cameraPosition.copy(body.current.position);
      cameraPosition.x -= playerLR === -1 ? -1 : 1;

      state.camera.position.lerp(cameraPosition, 0.01);
      state.camera.lookAt(body.current.position);
      state.camera.rotateZ(-1.55 * playerLR);

      if (state.camera.position.equals(cameraPosition)) {
        setUpdatedCamera(true);
        // console.log("posistion dao");
      }
    }

    if (gameStatus === "InGame") {
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
    return null;
  });

  return (
    <mesh
      ref={body}
      geometry={boxGeometry}
      // material={playerMaterial}
      scale={[tableSize.y / 2, tableSize.y, tableSize.z / 5]}
      position={[playerLR * (tableSize.x / 2 - 0.1), 0, tableSize.y + 0.02]}
      rotation={[Math.PI / 2, 0, 0]}
      castShadow
    >
      <meshStandardMaterial
        {...(gameStatus === "Customize" ? { ...tmpSkin } : { ...playerSkin })}
        ref={mat}
      />
    </mesh>
  );
}

export default Player;
