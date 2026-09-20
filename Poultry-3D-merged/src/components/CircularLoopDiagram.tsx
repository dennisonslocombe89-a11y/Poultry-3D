import React, { useState } from 'react';
import { HOTSPOTS_DATA, FLOW_CONNECTIONS } from '../data/poultryData';
import { HotspotData } from '../types';
import { ArrowRight, RotateCw, ExternalLink } from 'lucide-react';

interface CircularLoopDiagramProps {
  selectedId: string | null;
  onSelectHotspot: (id: string) => void;
}

export const CircularLoopDiagram: React.FC<CircularLoopDiagramProps> = ({
  selectedId,
  onSelectHotspot,
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Define circular positions around a circle of radius R
  const size = 680;
  const center = size / 2;
  const radius = 240;

  // Compute node coordinates around the circle
  const nodePositions = HOTSPOTS_DATA.map((item, index) => {
    // Offset by -90 deg so item 0 is at top
    const angle = ((index / HOTSPOTS_DATA.length) * 2 * Math.PI) - (Math.PI / 2);
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    return {
      ...item,
      x,
      y,
      angle
    };
  });

  const getPosById = (id: string) => nodePositions.find((n) => n.id === id);

  return (
    <div 
      id="circular-loop-diagram-container"
      className="relative w-full h-full min-h-[480px] flex items-center justify-center p-4 bg-[#0c1e17] overflow-hidden select-none"
    >
      {/* Background ambient radial aura */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#1c3c2d]/40 via-[#122a20]/20 to-transparent pointer-events-none" />

      <div className="relative w-full max-w-[680px] aspect-square flex items-center justify-center">
        <svg 
          viewBox={`0 0 ${size} ${size}`} 
          className="w-full h-full overflow-visible"
        >
          <defs>
            {/* Gradients for flow lines */}
            <linearGradient id="loopGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4fa697" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#e3a93a" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#8bbf6f" stopOpacity="0.8" />
            </linearGradient>

            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Outer ring guides */}
          <circle
            cx={center}
            cy={center}
            r={radius + 35}
            fill="none"
            stroke="#1c3c2d"
            strokeWidth="1"
            strokeDasharray="4 6"
          />
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="#2a4636"
            strokeWidth="2"
          />
          <circle
            cx={center}
            cy={center}
            r={radius - 60}
            fill="none"
            stroke="#163327"
            strokeWidth="1"
            strokeDasharray="2 4"
          />

          {/* Center Circular Economy Branding */}
          <g transform={`translate(${center}, ${center})`} className="cursor-default">
            <circle
              cx="0"
              cy="0"
              r="72"
              fill="#122a20"
              stroke="#2a4636"
              strokeWidth="2"
              className="transition-transform duration-500"
            />
            <circle
              cx="0"
              cy="0"
              r="62"
              fill="none"
              stroke="#4fa697"
              strokeWidth="1.5"
              strokeDasharray="6 4"
              className="animate-spin-slow origin-center"
            />
            <text
              x="0"
              y="-14"
              textAnchor="middle"
              className="fill-[#e3a93a] text-[10px] font-mono tracking-widest uppercase font-semibold"
            >
              Closed Loop
            </text>
            <text
              x="0"
              y="6"
              textAnchor="middle"
              className="fill-[#f1ecda] text-[15px] font-['Bricolage_Grotesque',sans-serif] font-bold"
            >
              Circular Model
            </text>
            <text
              x="0"
              y="22"
              textAnchor="middle"
              className="fill-[#c9c3ab] text-[9.5px] font-mono"
            >
              15 Installations
            </text>
          </g>

          {/* Flow Connection Lines across the circle */}
          {FLOW_CONNECTIONS.map((conn, idx) => {
            const fromNode = getPosById(conn.fromId);
            const toNode = getPosById(conn.toId);
            if (!fromNode || !toNode) return null;

            const isHighlighted =
              selectedId === conn.fromId ||
              selectedId === conn.toId ||
              hoveredId === conn.fromId ||
              hoveredId === conn.toId;

            // Curve toward the center
            const midX = (fromNode.x + toNode.x) / 2 + (center - (fromNode.x + toNode.x) / 2) * 0.45;
            const midY = (fromNode.y + toNode.y) / 2 + (center - (fromNode.y + toNode.y) / 2) * 0.45;
            const pathD = `M ${fromNode.x} ${fromNode.y} Q ${midX} ${midY} ${toNode.x} ${toNode.y}`;

            return (
              <g key={idx} className="transition-opacity duration-300">
                <path
                  d={pathD}
                  fill="none"
                  stroke={conn.colorHex}
                  strokeWidth={isHighlighted ? 3 : 1.5}
                  strokeOpacity={isHighlighted ? 0.9 : 0.25}
                  strokeDasharray={isHighlighted ? 'none' : '4 3'}
                  filter={isHighlighted ? 'url(#glow)' : undefined}
                />
              </g>
            );
          })}

          {/* Circular Nodes */}
          {nodePositions.map((node) => {
            const isSelected = selectedId === node.id;
            const isHovered = hoveredId === node.id;

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                onClick={() => onSelectHotspot(node.id)}
                onMouseEnter={() => setHoveredId(node.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="cursor-pointer group"
              >
                {/* Selection / Hover Aura */}
                {(isSelected || isHovered) && (
                  <circle
                    cx="0"
                    cy="0"
                    r="34"
                    fill={node.colorHex}
                    fillOpacity="0.2"
                    className="animate-pulse"
                  />
                )}

                {/* Node Body */}
                <circle
                  cx="0"
                  cy="0"
                  r={isSelected ? 26 : 22}
                  fill="#122a20"
                  stroke={isSelected ? node.colorHex : '#2a4636'}
                  strokeWidth={isSelected ? 3 : 2}
                  className="transition-all duration-200 group-hover:stroke-[#4fa697] group-hover:scale-110"
                />

                {/* Node Center Dot */}
                <circle
                  cx="0"
                  cy="0"
                  r="7"
                  fill={node.colorHex}
                />

                {/* Text Label Positioning */}
                {(() => {
                  const isRightSide = node.x >= center;
                  const isTop = node.y < center;
                  const textOffset = 34;

                  return (
                    <g
                      transform={`translate(${isRightSide ? textOffset : -textOffset}, ${
                        isTop ? -4 : 8
                      })`}
                      className="pointer-events-none"
                    >
                      <text
                        textAnchor={isRightSide ? 'start' : 'end'}
                        className={`text-xs font-['Bricolage_Grotesque',sans-serif] font-bold transition-colors ${
                          isSelected
                            ? 'fill-[#f1ecda]'
                            : 'fill-[#c9c3ab] group-hover:fill-[#f1ecda]'
                        }`}
                      >
                        {node.title}
                      </text>
                      <text
                        y="12"
                        textAnchor={isRightSide ? 'start' : 'end'}
                        className="text-[10px] font-mono uppercase tracking-wider fill-[#e3a93a]/80"
                      >
                        {node.tag}
                      </text>
                    </g>
                  );
                })()}
              </g>
            );
          })}
        </svg>

        {/* Legend / Flow Helper floating at bottom */}
        <div className="absolute bottom-1 inset-x-4 flex items-center justify-between text-[11px] font-mono text-[#c9c3ab]/70 bg-[#122a20]/90 backdrop-blur-sm border border-[#2a4636] rounded-xl px-3 py-2">
          <span>Click a station to inspect confirmed facts, proposed concepts and reference images</span>
          <span className="text-[#8bbf6f] font-semibold">10 Synchronized Nodes</span>
        </div>
      </div>
    </div>
  );
};
