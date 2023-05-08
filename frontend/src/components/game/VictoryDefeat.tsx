import { Center, Text3D } from "@react-three/drei";
import useGameStore from "@/store/gameStore";
import * as THREE from "three";

const VictoryDefeat = () => {
  const isWinner = useGameStore((state) => state.matchInfo.isWinner);
  const gameStatus = useGameStore((state) => state.gameStatus);
  const winColor = new THREE.Color("yellow");
  const loseColor = new THREE.Color("crimson");

  return (
    <group visible={gameStatus === "Ended"}>
      <Center top rotation={[Math.PI / 2, 0.5, 0]} position={[0, 0, 1.2]}>
        <Text3D
          curveSegments={32}
          bevelEnabled
          bevelSize={0.02}
          // bevelThickness={0.1}
          height={0.05}
          lineHeight={0.5}
          // letterSpacing={-0.06}
          size={1}
          font="/Oswald_Bold.json"
        >
          {`${isWinner ? "Victory" : "Defeat"}`}
          <meshStandardMaterial color={isWinner ? winColor : loseColor} />
        </Text3D>
      </Center>
    </group>
  );
};

export default VictoryDefeat;
