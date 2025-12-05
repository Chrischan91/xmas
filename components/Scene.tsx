import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Stars } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import { TreeParticles } from './TreeParticles';
import { TreeState } from '../types';

interface SceneProps {
  treeState: TreeState;
}

export const Scene: React.FC<SceneProps> = ({ treeState }) => {
  return (
    <Canvas shadows dpr={[1, 2]} gl={{ antialias: false, toneMappingExposure: 1.5 }}>
      <PerspectiveCamera makeDefault position={[0, 2, 18]} fov={45} />
      
      <color attach="background" args={['#010b05']} />
      
      {/* Cinematic Lighting */}
      <ambientLight intensity={0.2} />
      <spotLight 
        position={[10, 20, 10]} 
        angle={0.5} 
        penumbra={1} 
        intensity={2} 
        color="#ffeebb" 
        castShadow 
      />
      <spotLight 
        position={[-10, 15, -5]} 
        angle={0.5} 
        penumbra={1} 
        intensity={1.5} 
        color="#ffcc00" 
      />
      <pointLight position={[0, -5, 5]} intensity={0.5} color="#00ff44" />

      <Suspense fallback={null}>
        {/* The Emerald Needles */}
        <TreeParticles 
          count={2500} 
          state={treeState} 
          type="LEAF" 
          color="#034d31" 
        />
        
        {/* The Gold Ornaments */}
        <TreeParticles 
          count={150} 
          state={treeState} 
          type="ORNAMENT" 
          color="#FFD700" 
        />

        {/* The Platinum/Diamond Ornaments */}
        <TreeParticles 
            count={50}
            state={treeState}
            type="ORNAMENT"
            color="#E0F7FA"
        />
        
        <Environment preset="city" />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      </Suspense>

      <OrbitControls 
        enablePan={false} 
        maxPolarAngle={Math.PI / 1.5} 
        minDistance={5} 
        maxDistance={30}
        autoRotate={treeState === TreeState.TREE_SHAPE}
        autoRotateSpeed={0.5}
      />

      {/* Post Processing for the "Arix" Signature Look */}
      <EffectComposer disableNormalPass>
        <Bloom 
          luminanceThreshold={0.5} 
          mipmapBlur 
          intensity={1.5} 
          radius={0.6} 
        />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
        <Noise opacity={0.02} />
      </EffectComposer>
    </Canvas>
  );
};
