import * as THREE from "three";

export const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
export const sphereGeometry = new THREE.SphereGeometry(1, 1, 1);

export const tableMaterial = new THREE.MeshStandardMaterial({
  color: "darkgreen",
});
export const playerMaterial = new THREE.MeshStandardMaterial({
  color: "yellow",
});
export const ballMaterial = new THREE.MeshStandardMaterial({ color: "white" });
