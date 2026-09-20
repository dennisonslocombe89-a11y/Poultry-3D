import React from 'react';
import { BookOpen, Bus, GraduationCap, Handshake, MapPin, Sprout } from 'lucide-react';

interface GrenadaNetworkProps {
  onSelectHotspot: (id: string) => void;
}

const nodes = [
  { id: 'poultry', label: 'Participating poultry farms', x: 45, y: 64, color: '#8bbf6f' },
  { id: 'market', label: 'Cooperative market link', x: 58, y: 48, color: '#f1ecda' },
  { id: 'school', label: 'School learning site', x: 37, y: 38, color: '#e3a93a' },
  { id: 'poultry', label: 'Carriacou farm cluster', x: 70, y: 22, color: '#8bbf6f' },
  { id: 'school', label: 'Petite Martinique learning link', x: 84, y: 12, color: '#e3a93a' },
];

export const GrenadaNetwork: React.FC<GrenadaNetworkProps> = ({ onSelectHotspot }) => (
  <section className="relative h-full overflow-auto bg-[radial-gradient(circle_at_30%_20%,#173d33_0%,#0d251d_48%,#081812_100%)] p-4 sm:p-6">
    <div className="mx-auto grid min-h-full max-w-6xl gap-5 xl:grid-cols-[1.35fr_.65fr]">
      <div className="relative min-h-[520px] overflow-hidden rounded-3xl border border-[#335744] bg-[#0f2a21]/90 shadow-2xl">
        <div className="absolute left-5 top-5 z-10 max-w-md">
          <p className="font-mono text-[10px] uppercase tracking-[.2em] text-[#e3a93a]">Illustrative network — exact sites to be confirmed</p>
          <h2 className="mt-1 font-['Bricolage_Grotesque',sans-serif] text-2xl font-bold text-[#f1ecda]">Connected poultry learning network</h2>
          <p className="mt-1 text-sm text-[#c9c3ab]">Farms, cooperatives, schools and support partners exchange knowledge, production data and market opportunities across the tri-island state.</p>
        </div>

        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-label="Illustrative map of the Grenada poultry network">
          <defs>
            <filter id="networkGlow"><feGaussianBlur stdDeviation="1.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
            <linearGradient id="islandFill" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#537b51"/><stop offset="1" stopColor="#294b37"/></linearGradient>
          </defs>
          <path d="M27 83 C21 76 23 66 29 59 C31 54 29 47 34 41 C39 35 45 38 49 44 C54 51 51 61 55 69 C57 77 48 88 38 90 C33 91 29 88 27 83Z" fill="url(#islandFill)" stroke="#8bbf6f" strokeWidth=".6"/>
          <path d="M64 30 C61 27 62 21 66 18 C70 16 74 19 74 23 C73 27 69 32 64 30Z" fill="url(#islandFill)" stroke="#8bbf6f" strokeWidth=".6"/>
          <path d="M80 18 C78 15 80 10 84 9 C88 10 89 14 86 17 C84 19 82 19 80 18Z" fill="url(#islandFill)" stroke="#8bbf6f" strokeWidth=".6"/>
          <text x="31" y="95" fill="#c9c3ab" fontSize="2.5">GRENADA</text>
          <text x="62" y="35" fill="#c9c3ab" fontSize="2.5">CARRIACOU</text>
          <text x="78" y="23" fill="#c9c3ab" fontSize="2.2">PETITE MARTINIQUE</text>

          <g fill="none" strokeLinecap="round" filter="url(#networkGlow)">
            <path d="M45 64 Q49 55 58 48" stroke="#4fa697" strokeWidth=".8" strokeDasharray="2 2" className="network-path"/>
            <path d="M37 38 Q48 40 58 48" stroke="#e3a93a" strokeWidth=".8" strokeDasharray="2 2" className="network-path network-delay-1"/>
            <path d="M58 48 Q65 35 70 22" stroke="#8bbf6f" strokeWidth=".8" strokeDasharray="2 2" className="network-path network-delay-2"/>
            <path d="M70 22 Q77 17 84 12" stroke="#e3a93a" strokeWidth=".8" strokeDasharray="2 2" className="network-path network-delay-3"/>
            <path d="M45 64 Q54 41 70 22" stroke="#f1ecda" strokeOpacity=".45" strokeWidth=".45" strokeDasharray="1.2 2.2"/>
          </g>
          {nodes.map((node, index) => (
            <g key={`${node.label}-${index}`} className="cursor-pointer" onClick={() => onSelectHotspot(node.id)}>
              <circle cx={node.x} cy={node.y} r="3.3" fill="#0c1e17" stroke={node.color} strokeWidth=".7"/>
              <circle cx={node.x} cy={node.y} r="1.35" fill={node.color} className="network-pulse"/>
              <text x={node.x + 4.5} y={node.y + .8} fill="#f1ecda" fontSize="2.3" fontWeight="600">{node.label}</text>
            </g>
          ))}
        </svg>

        <div className="absolute bottom-5 left-5 right-5 grid grid-cols-3 gap-2 rounded-2xl border border-[#335744] bg-[#081812]/80 p-3 backdrop-blur-md">
          <div><strong className="block text-lg text-[#8bbf6f]">3</strong><span className="text-[11px] text-[#c9c3ab]">cooperatives</span></div>
          <div><strong className="block text-lg text-[#e3a93a]">15</strong><span className="text-[11px] text-[#c9c3ab]">planned installations</span></div>
          <div><strong className="block text-lg text-[#4fa697]">120</strong><span className="text-[11px] text-[#c9c3ab]">direct participants</span></div>
        </div>
      </div>

      <aside className="flex flex-col gap-3">
        <div className="rounded-2xl border border-[#335744] bg-[#122a20] p-5">
          <div className="flex items-center gap-3"><div className="rounded-xl bg-[#e3a93a]/15 p-2 text-[#e3a93a]"><GraduationCap/></div><div><p className="font-mono text-[10px] uppercase tracking-wider text-[#e3a93a]">Training & learning</p><h3 className="font-bold text-[#f1ecda]">Practical skills pathway</h3></div></div>
          <ol className="mt-4 space-y-3 text-sm text-[#c9c3ab]">
            <li className="flex gap-3"><BookOpen className="mt-0.5 shrink-0 text-[#4fa697]" size={17}/><span><strong className="text-[#f1ecda]">Learn:</strong> husbandry, records, feed, biosecurity and cooperative operations.</span></li>
            <li className="flex gap-3"><Sprout className="mt-0.5 shrink-0 text-[#8bbf6f]" size={17}/><span><strong className="text-[#f1ecda]">Demonstrate:</strong> observe circular technologies at approved learning sites.</span></li>
            <li className="flex gap-3"><Bus className="mt-0.5 shrink-0 text-[#e3a93a]" size={17}/><span><strong className="text-[#f1ecda]">Study tour:</strong> farmers and students visit peer sites and exchange lessons.</span></li>
            <li className="flex gap-3"><Handshake className="mt-0.5 shrink-0 text-[#f1ecda]" size={17}/><span><strong className="text-[#f1ecda]">Apply:</strong> cooperatives share improvements and connect farms to buyers.</span></li>
          </ol>
        </div>
        <button onClick={() => onSelectHotspot('school')} className="group flex items-center gap-3 rounded-2xl border border-[#e3a93a]/40 bg-[#e3a93a]/10 p-4 text-left transition hover:bg-[#e3a93a]/15">
          <MapPin className="text-[#e3a93a]"/><span><strong className="block text-sm text-[#f1ecda]">Open learning-site details</strong><span className="text-xs text-[#c9c3ab]">Training and study-tour component</span></span>
        </button>
        <p className="px-2 text-[11px] leading-relaxed text-[#c9c3ab]/70">The network positions are conceptual. Final farm, school and institutional locations must be confirmed by the project team.</p>
      </aside>
    </div>
  </section>
);
