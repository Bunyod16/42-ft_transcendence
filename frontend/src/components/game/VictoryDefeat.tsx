import { Center, Text3D } from "@react-three/drei";
import useGameStore from "@/store/gameStore";

const VictoryDefeat = () => {
  const matchInfo = useGameStore((state) => state.matchInfo);

  return (
    <group visible={matchInfo.gameStatus === "Ended"}>
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
          {`${matchInfo.isWinner ? "Victory" : "Defeat"}`}
          <meshNormalMaterial />
        </Text3D>
      </Center>
    </group>
  );
};

export default VictoryDefeat;
