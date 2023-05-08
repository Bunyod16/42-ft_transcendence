import { Controls, ISize } from "./types";
import { boxGeometry } from "./resource";
import { Mesh, MeshStandardMaterial } from "three";
import { socket } from "../socket/socket";
import { useFrame, useThree } from "@react-three/fiber";
import useGameState from "@/hooks/useGameState";
import useGameStore from "@/store/gameStore";
import { Center, useKeyboardControls, useTexture } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { Flex } from "@react-three/flex";
import CustomizeStep from "./CustomizeStep";

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
  // const relativeCameraOffset = new THREE.Vector3(0, 50, 200);
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
    if (!body.current) return null;

    if (gameStatus === "Customize" && playerLR === 1) {
      const cameraPosition = new THREE.Vector3();
      cameraPosition.copy(body.current.position);
      cameraPosition.x -= 1;
      // // cameraPosition.y -= 1;
      // // cameraPosition.z += 1;

      const deg2rad = (degrees: number) => degrees * (Math.PI / 180);

      state.camera.position.lerp(cameraPosition, 0.01);
      // // state.camera.quaternion.lerp(deg2rad(30), 0, 0);
      state.camera.lookAt(body.current.position);
      // state.camera.rotation.set(1.5, 0, 0);
      state.camera.rotateZ(-1.55);
      // // state.camera.position.lerp(body.current.position, 0.05);
      // // state.camera.updateProjectionMatrix();
      // 1;
      // return null;
      // camera.rotation.set(deg2rad(20), 0, 0);
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
