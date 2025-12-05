import * as THREE from 'three';

/**
 * Generates a random point inside a sphere of radius R
 */
export const getRandomSpherePoint = (radius: number): THREE.Vector3 => {
  const u = Math.random();
  const v = Math.random();
  const theta = 2 * Math.PI * u;
  const phi = Math.acos(2 * v - 1);
  const r = Math.cbrt(Math.random()) * radius;
  const sinPhi = Math.sin(phi);
  return new THREE.Vector3(
    r * sinPhi * Math.cos(theta),
    r * sinPhi * Math.sin(theta),
    r * Math.cos(phi)
  );
};

/**
 * Generates points on a cone surface using spiral phyllotaxis
 */
export const getTreeSpiralPoint = (
  index: number,
  total: number,
  height: number,
  maxRadius: number
): THREE.Vector3 => {
  const y = (index / total) * height; // Height from 0 to max
  const radiusAtHeight = maxRadius * (1 - y / height); // Cone shape: wider at bottom
  
  // Golden Angle for natural distribution
  const angle = index * 2.39996; 
  
  const x = Math.cos(angle) * radiusAtHeight;
  const z = Math.sin(angle) * radiusAtHeight;
  
  // Center the tree vertically
  return new THREE.Vector3(x, y - height / 2, z);
};
