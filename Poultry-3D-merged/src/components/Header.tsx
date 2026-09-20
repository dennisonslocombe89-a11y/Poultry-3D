import React from 'react';
import { Box, RefreshCw, Compass, Info, Map } from 'lucide-react';

type ViewMode = '3d' | 'diagram' | 'network';

interface HeaderProps {
  viewMode: ViewMode;
  onToggleViewMode: (mode: ViewMode) => void;
  onStartWalkthrough: () => void;
  onOpenFacts: () => void;
  isTourMode: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  viewMode,
  onToggleViewMode,
  onStartWalkthrough,
  onOpenFacts,
  isTourMode,
}) => {
  return (
    <header 
      id="app-topbar"
      className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 shrink-0"
    >
      <div className="min-w-0">
        <p className="font-mono text-[11px] tracking-[0.08em] uppercase text-[#e3a93a] mb-1 font-semibold flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#e3a93a]" />
          <span>GCLL &middot; EUCaN GRANT NO. 700001756-01-04</span>
        </p>
        <h1 className="font-['Bricolage_Grotesque',sans-serif] font-bold text-xl sm:text-2xl lg:text-3xl text-[#f1ecda] leading-tight text-balance">
          Scaling Circular Poultry Cooperatives
        </h1>
        <p className="text-xs sm:text-sm text-[#c9c3ab] max-w-3xl mt-1 leading-snug hidden sm:block">
          An interactive model of the circular-economy system planned across Grenada, Carriacou &amp; Petite Martinique &mdash; tap any station to open web-sourced reference photos and walkthroughs.
        </p>
      </div>

      {/* Action buttons bar */}
      <div className="flex items-center gap-2 flex-wrap shrink-0">
        {/* View Mode Toggle */}
        <div className="flex items-center p-1 bg-[#122a20] border border-[#2a4636] rounded-full">
          <button
            onClick={() => onToggleViewMode('3d')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              viewMode === '3d'
                ? 'bg-[#4fa697] text-[#0c1e17] shadow-sm'
                : 'text-[#c9c3ab] hover:text-[#f1ecda]'
            }`}
          >
            <Box size={14} />
            <span>3D Stage</span>
          </button>
          <button
            onClick={() => onToggleViewMode('diagram')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              viewMode === 'diagram'
                ? 'bg-[#4fa697] text-[#0c1e17] shadow-sm'
                : 'text-[#c9c3ab] hover:text-[#f1ecda]'
            }`}
          >
            <RefreshCw size={14} />
            <span>Circular Loop</span>
          </button>
          <button
            onClick={() => onToggleViewMode('network')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              viewMode === 'network'
                ? 'bg-[#4fa697] text-[#0c1e17] shadow-sm'
                : 'text-[#c9c3ab] hover:text-[#f1ecda]'
            }`}
          >
            <Map size={14} />
            <span>Grenada Network</span>
          </button>
        </div>

        {/* Start Walkthrough Tour */}
        <button
          id="start-walkthrough-btn"
          onClick={onStartWalkthrough}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold border transition-all ${
            isTourMode
              ? 'bg-[#e3a93a] text-[#0c1e17] border-[#e3a93a]'
              : 'bg-[#1c3c2d] text-[#f1ecda] border-[#2a4636] hover:border-[#e3a93a] hover:bg-[#284a38]'
          }`}
        >
          <Compass size={14} className={isTourMode ? 'animate-spin-slow' : ''} />
          <span>{isTourMode ? 'Tour Active' : 'Start Tour'}</span>
        </button>

        {/* Project Facts Button */}
        <button
          id="project-facts-btn"
          onClick={onOpenFacts}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold bg-[#1c3c2d] text-[#f1ecda] border border-[#2a4636] hover:border-[#4fa697] hover:bg-[#284a38] transition-all whitespace-nowrap"
        >
          <Info size={14} className="text-[#4fa697]" />
          <span>Project facts</span>
        </button>
      </div>
    </header>
  );
};
