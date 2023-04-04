import * as THREE from "three";

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

function Experience() {
  return (
    <>
      <mesh geometry={boxGeometry} />
    </>
  );
}

export default Experience;
