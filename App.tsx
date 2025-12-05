import React, { useState } from 'react';
import { Scene } from './components/Scene';
import { UIOverlay } from './components/UIOverlay';
import { TreeState } from './types';

export default function App() {
  const [treeState, setTreeState] = useState<TreeState>(TreeState.SCATTERED);

  const toggleState = () => {
    setTreeState(prev => 
      prev === TreeState.SCATTERED ? TreeState.TREE_SHAPE : TreeState.SCATTERED
    );
  };

  return (
    <div className="w-full h-screen bg-[#010b05] text-white overflow-hidden relative font-serif selection:bg-yellow-500/30">
      
      {/* 3D Scene Layer */}
      <div className="absolute inset-0 z-0">
        <Scene treeState={treeState} />
      </div>

      {/* UI Layer */}
      <UIOverlay currentState={treeState} onToggle={toggleState} />
      
      {/* Vignette Overlay for extra cinematic depth (CSS based) */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)] z-20"></div>
    </div>
  );
}
