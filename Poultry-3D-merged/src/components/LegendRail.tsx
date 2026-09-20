import React from 'react';
import { HOTSPOTS_DATA } from '../data/poultryData';
import { HotspotData } from '../types';

interface LegendRailProps {
  selectedId: string | null;
  onSelectHotspot: (id: string) => void;
}

export const LegendRail: React.FC<LegendRailProps> = ({
  selectedId,
  onSelectHotspot,
}) => {
  return (
    <nav 
      id="legend-rail"
      aria-label="Model components"
      className="w-full lg:w-[260px] shrink-0 flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto lg:max-h-full py-1 pr-1 select-none"
    >
      {HOTSPOTS_DATA.map((item) => {
        const isSelected = selectedId === item.id;
        return (
          <button
            key={item.id}
            id={`legend-item-${item.id}`}
            onClick={() => onSelectHotspot(item.id)}
            className={`flex items-center gap-2.5 w-full text-left p-2.5 sm:px-3 sm:py-2.5 rounded-xl border transition-all duration-150 shrink-0 lg:shrink ${
              isSelected
                ? 'bg-[#284a38] text-[#f1ecda] border-[#e3a93a] shadow-md'
                : 'bg-[#122a20] text-[#c9c3ab] border-[#2a4636] hover:border-[#4fa697] hover:text-[#f1ecda]'
            }`}
          >
            {/* Color dot */}
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
              style={{ backgroundColor: item.colorHex }}
            />

            {/* Title */}
            <span className="font-['Bricolage_Grotesque',sans-serif] text-xs sm:text-sm font-semibold truncate">
              {item.title}
            </span>

            {/* Category Tag (Right aligned) */}
            <span className="ml-auto font-mono text-[9px] uppercase tracking-wider text-[#c9c3ab]/70 hidden sm:inline-block shrink-0">
              {item.tag}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
