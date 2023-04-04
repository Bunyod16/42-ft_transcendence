import * as THREE from "three";

function Experience() {
  return (
    <>
      <color args={["#252731"]} attach="background" />

      {/* player 1 */}
      <mesh>
        <boxGeometry />
        <meshStandardMaterial color="orange" />
      </mesh>

      {/* player 2 */}
      <mesh>
        <boxGeometry />
        <meshStandardMaterial color="orange" />
      </mesh>

      {/* table */}
      <mesh>
        <boxGeometry />
        <meshStandardMaterial color="darkgreen" />
      </mesh>

      {/* Pong */}
      <mesh>
        <sphereGeometry />
        <meshStandardMaterial color="gray" />
      </mesh>
    </>
  );
}

export default Experience;
