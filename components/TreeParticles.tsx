import React, { useMemo, useRef, useLayoutEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TreeState } from '../types';
import { getRandomSpherePoint, getTreeSpiralPoint } from '../utils/math';

interface TreeParticlesProps {
  count: number;
  state: TreeState;
  color: string;
  type: 'LEAF' | 'ORNAMENT';
}

const tempObject = new THREE.Object3D();
const tempVec3 = new THREE.Vector3();

export const TreeParticles: React.FC<TreeParticlesProps> = ({ count, state, color, type }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  // Configuration based on type
  const config = useMemo(() => ({
    spreadRadius: type === 'LEAF' ? 15 : 20,
    treeHeight: 12,
    treeRadius: 5,
    scaleBase: type === 'LEAF' ? 0.15 : 0.25,
    lerpSpeed: type === 'LEAF' ? 2.5 : 2.0, // Ornaments move slightly slower for depth
  }), [type]);

  // Generate static data once
  const particles = useMemo(() => {
    const data = [];
    for (let i = 0; i < count; i++) {
      const scatterPos = getRandomSpherePoint(config.spreadRadius);
      const treePos = getTreeSpiralPoint(i, count, config.treeHeight, config.treeRadius);
      
      // Add some randomness to tree pos so it's not perfectly smooth
      if (type === 'LEAF') {
        treePos.x += (Math.random() - 0.5) * 0.5;
        treePos.z += (Math.random() - 0.5) * 0.5;
        treePos.y += (Math.random() - 0.5) * 0.5;
      }

      data.push({
        scatterPosition: scatterPos,
        treePosition: treePos,
        // Random rotation
        rotation: new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, 0),
        // Random scale variance
        scale: config.scaleBase * (0.5 + Math.random() * 1.0),
        // Animation phase
        phase: Math.random() * Math.PI * 2,
        speed: 0.5 + Math.random() * 0.5
      });
    }
    return data;
  }, [count, config, type]);

  // Current animation progress (0 = Scattered, 1 = Tree)
  const progress = useRef(0);

  useFrame((stateThree, delta) => {
    if (!meshRef.current) return;

    // 1. Update global progress based on target state
    const targetProgress = state === TreeState.TREE_SHAPE ? 1 : 0;
    
    // Smooth transition
    const smoothing = 3.0 * delta;
    if (Math.abs(progress.current - targetProgress) > 0.001) {
        progress.current = THREE.MathUtils.lerp(progress.current, targetProgress, smoothing);
    } else {
        progress.current = targetProgress;
    }

    const t = progress.current;
    // Easing for visual flair
    const easeT = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; 

    // 2. Update every instance
    let i = 0;
    const time = stateThree.clock.getElapsedTime();

    for (const particle of particles) {
      // Current base position interpolation
      tempVec3.lerpVectors(particle.scatterPosition, particle.treePosition, easeT);

      // Add floating noise when scattered (diminishes as t approaches 1)
      const floatIntensity = (1 - t) * 0.5;
      const floatY = Math.sin(time * particle.speed + particle.phase) * floatIntensity;
      const floatX = Math.cos(time * particle.speed * 0.5 + particle.phase) * floatIntensity;
      
      tempObject.position.set(
        tempVec3.x + floatX, 
        tempVec3.y + floatY, 
        tempVec3.z
      );

      // Rotation logic: Spin when scattered, orient when tree
      // For simplicity, we keep constant rotation but maybe slow it down
      tempObject.rotation.copy(particle.rotation);
      if (t < 1) {
        tempObject.rotation.x += delta * 0.2 * (1 - t);
        tempObject.rotation.y += delta * 0.5 * (1 - t);
      }
      
      tempObject.scale.setScalar(particle.scale);

      tempObject.updateMatrix();
      meshRef.current.setMatrixAt(i, tempObject.matrix);
      i++;
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  // Geometry & Material Selection
  const Geometry = type === 'LEAF' ? THREE.ConeGeometry : THREE.IcosahedronGeometry;
  const args = type === 'LEAF' ? [1, 2, 4] : [1, 1]; // Low poly cone vs Icosahedron

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} castShadow receiveShadow>
      <primitive object={new Geometry(...args)} attach="geometry" />
      <meshStandardMaterial 
        color={color} 
        roughness={type === 'LEAF' ? 0.7 : 0.1}
        metalness={type === 'LEAF' ? 0.1 : 1.0}
        emissive={color}
        emissiveIntensity={type === 'LEAF' ? 0 : 0.5}
      />
    </instancedMesh>
  );
};
