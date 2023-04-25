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
}
const PlayerSkin = ({ size, material }: PlayerSkinProp) => {
  const prop = useTexture({ ...material });
  const [hover, setHover] = useState(false);
  const ref = useRef<Mesh>(null);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.position.z = THREE.MathUtils.lerp(
        ref.current.position.z,
        hover ? 15 : 0,
        0.075 - Math.abs(50) / 2000,
      );
    }
  });
  return (
    <Box centerAnchor margin={0.1}>
      <mesh
        rotation={[0, 0, 0]}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
        ref={ref}
      >
        <boxGeometry args={[size[2], size[0], size[1]]} />
        <meshStandardMaterial {...prop} />
      </mesh>
    </Box>
  );
};

const CustomizeStep = () => {
  const material = useGameStore((state) => state.material);
  const gameStatus = useGameStore((state) => state.matchInfo.gameStatus);
  const size = [0.1, 0.2, 0.6];
  return (
    <group visible={gameStatus == "Customize"}>
      <Center>
        <Flex justifyContent="center" alignItems="center" flexDirection={"row"}>
          <PlayerSkin size={size} material={material[0]} />
          <PlayerSkin size={size} material={material[1]} />
          <PlayerSkin size={size} material={material[2]} />
          <PlayerSkin size={size} material={material[3]} />
        </Flex>
      </Center>
    </group>
  );
};

export default CustomizeStep;
