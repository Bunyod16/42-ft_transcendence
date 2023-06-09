import useGameStore from "@/store/gameStore";
import { Textures } from "@/types/game-type";
import { Center, useTexture } from "@react-three/drei";
import { Vector3, useFrame } from "@react-three/fiber";
import { Flex, Box } from "@react-three/flex";
import { Mesh } from "three";
import * as THREE from "three";
import { useRef } from "react";

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

  // useFrame((state, delta) => {
  //   if (ref.current) {
  //     ref.current.position.z = THREE.MathUtils.lerp(
  //       ref.current.position.z,
  //       selectedSkin === index ? 0.2 : 0,
  //       delta * 0.5,
  //     );
  //   }
  // });
  return (
    <Box centerAnchor margin={0.1}>
      <mesh
        // rotation={[0, 0, 0]}
        ref={ref}
        onClick={() => {
          setSelectedSkin(index);
          console.log(index);
        }}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <boxGeometry args={[size[2], size[0], size[1]]} />
        <meshStandardMaterial {...prop} />
      </mesh>
    </Box>
  );
};

const CustomizeStep = ({ position }: { position: Vector3 }) => {
  const material = useGameStore((state) => state.material);
  const gameStatus = useGameStore((state) => state.gameStatus);
  const size = [0.1, 0.2, 0.6];

  return (
    <group visible={gameStatus == "Customize"} position={position}>
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
