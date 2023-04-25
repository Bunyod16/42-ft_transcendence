import useGameStore from "@/store/gameStore";
import { Textures } from "@/types/game-types";
import { Center, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Flex, Box } from "@react-three/flex";
import { useState, useRef } from "react";
import { Mesh } from "three";
import * as THREE from "three";

interface PlayerSkinProp {
  size: number[];
  material: Textures;
  index: number;
}
const PlayerSkin = ({ size, material, index }: PlayerSkinProp) => {
  const prop = useTexture({ ...material });
  const ref = useRef<Mesh>(null);
  const selectedSkin = useGameStore((state) => state.selectedSkin);
  const setSelectedSkin = useGameStore((state) => state.setSelectedSkin);

  useFrame(() => {
    if (ref.current) {
      ref.current.position.z = THREE.MathUtils.lerp(
        ref.current.position.z,
        selectedSkin === index ? 0.2 : 0,
        0.075 - Math.abs(1) / 2000,
      );
    }
  });
  return (
    <Box centerAnchor margin={0.1}>
      <mesh
        rotation={[0, 0, 0]}
        ref={ref}
        onClick={() => {
          setSelectedSkin(index);
          console.log(index);
        }}
      >
        <boxGeometry args={[size[2], size[0], size[1]]} />
        <meshStandardMaterial {...prop} />
      </mesh>
    </Box>
  );
};

const CustomizeStep = () => {
  const material = useGameStore((state) => state.material);
  const gameStatus = useGameStore((state) => state.gameStatus);
  const size = [0.1, 0.2, 0.6];

  return (
    <group visible={gameStatus == "Customize"}>
      <Center>
        <Flex justifyContent="center" alignItems="center" flexDirection={"row"}>
          {material.map((mat, index) => (
            <PlayerSkin key={index} size={size} material={mat} index={index} />
          ))}
        </Flex>
      </Center>
    </group>
  );
};

export default CustomizeStep;
