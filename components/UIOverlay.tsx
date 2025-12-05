import React from 'react';
import { TreeState } from '../types';

interface UIOverlayProps {
  currentState: TreeState;
  onToggle: () => void;
}

export const UIOverlay: React.FC<UIOverlayProps> = ({ currentState, onToggle }) => {
  const isTree = currentState === TreeState.TREE_SHAPE;

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-8 md:p-12 z-10">
      
      {/* Header */}
      <header className="flex flex-col items-center md:items-start text-center md:text-left">
        <h1 className="font-serif text-3xl md:text-5xl text-yellow-500 tracking-widest uppercase drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]">
          Arix Signature
        </h1>
        <h2 className="text-emerald-400 font-light tracking-[0.2em] text-sm md:text-base mt-2">
          Interactive Holiday Experience
        </h2>
      </header>

      {/* Center Action (Hidden on very small screens if needed, but sticky is better) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
         {/* Optional center interaction hint if needed */}
      </div>

      {/* Footer / Controls */}
      <footer className="flex flex-col md:flex-row items-center justify-between w-full pointer-events-auto gap-6">
        
        <div className="text-emerald-800/60 text-xs font-mono tracking-widest order-2 md:order-1">
          EST. 2024 • LUXURY COLLECTION
        </div>

        <button
          onClick={onToggle}
          className={`
            order-1 md:order-2
            group relative px-8 py-3 bg-black/40 backdrop-blur-md border border-yellow-600/50 
            text-yellow-100 font-serif tracking-widest text-lg transition-all duration-700
            hover:bg-yellow-900/20 hover:border-yellow-400 hover:shadow-[0_0_30px_rgba(255,215,0,0.3)]
          `}
        >
          <span className="relative z-10 flex items-center gap-3">
             {isTree ? "SCATTER ESSENCE" : "ASSEMBLE FORM"}
          </span>
          {/* Animated underline */}
          <div className={`absolute bottom-0 left-0 h-[1px] bg-yellow-400 transition-all duration-700 ${isTree ? 'w-full' : 'w-0 group-hover:w-full'}`} />
        </button>

        <div className="text-yellow-600/60 text-xs tracking-widest order-3 flex gap-4">
          <span>SOUND: OFF</span>
          <span>QUALITY: HIGH</span>
        </div>
      </footer>
    </div>
  );
};
