import { Text3D } from "@react-three/drei";

const GameEnd = () => {
  return (
    <group>
      <Text3D
        curveSegments={32}
        bevelEnabled
        bevelSize={0.04}
        bevelThickness={0.1}
        height={0.5}
        lineHeight={0.5}
        letterSpacing={-0.06}
        size={1.5}
        font="/Inter_Bold.json"
      >
        {text.current}
        <meshNormalMaterial />
      </Text3D>
    </group>
  );
};

export default GameEnd;
