import React, { useMemo, useState } from 'react';
import { GraduationCap, MapPin, X } from 'lucide-react';
import {
  LEARNING_STEPS, NET_ISLANDS, NET_LAYERS, NET_LINKS, NET_NODES, NET_PARISHES, NET_VIEWBOX,
  NetLayer, NetNode, netProj,
} from '../data/networkData';

interface GrenadaNetworkProps {
  onSelectHotspot: (id: string) => void;
}

type Pt = { x: number; y: number };

const smoothClosed = (pts: Pt[]) => {
  const n = pts.length;
  const mid = (a: Pt, b: Pt) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
  const start = mid(pts[n - 1], pts[0]);
  let d = `M ${start.x} ${start.y}`;
  for (let i = 0; i < n; i++) {
    const m = mid(pts[i], pts[(i + 1) % n]);
    d += ` Q ${pts[i].x} ${pts[i].y} ${m.x} ${m.y}`;
  }
  return d + ' Z';
};

const LINK_STYLE = {
  value: { stroke: '#a9d58a', dash: '7 7' },
  learning: { stroke: '#a99be6', dash: '3 7' },
  partner: { stroke: '#e3a93a', dash: '1 6' },
  study: { stroke: '#a99be6', dash: '10 8' },
};

export const GrenadaNetwork: React.FC<GrenadaNetworkProps> = ({ onSelectHotspot }) => {
  const [layer, setLayer] = useState<'all' | NetLayer>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const nodes = useMemo(() => NET_NODES.map((n) => ({ ...n, p: n.pos ?? netProj(n.ll!) })), []);
  const byId = useMemo(() => Object.fromEntries(nodes.map((n) => [n.id, n])), [nodes]);
  const selected = selectedId ? byId[selectedId] : null;

  const inLayer = (layers: NetLayer[]) => layer === 'all' || layers.includes(layer);
  const choose = (id: string | null) => setSelectedId(id);

  const renderShape = (n: NetNode & { p: Pt }, isSel: boolean) => {
    const common = {
      stroke: isSel ? '#f1ecda' : n.color,
      strokeWidth: isSel ? 3.5 : 2.5,
      strokeDasharray: n.illustrative ? '4 3' : undefined,
    };
    if (n.type === 'hq') return <polygon points="0,-17 17,0 0,17 -17,0" fill="#122a20" {...common} />;
    if (n.type === 'school') return <rect x={-7} y={-7} width={14} height={14} rx={2} fill={n.color} fillOpacity={0.25} {...common} />;
    if (n.type === 'hub') return <rect x={-12} y={-12} width={24} height={24} rx={5} fill="#122a20" {...common} />;
    if (n.type === 'outreach') return <circle r={17} fill={n.color} fillOpacity={0.08} {...common} />;
    if (n.type === 'farm') return <circle r={6.5} fill={n.color} fillOpacity={0.3} {...common} />;
    return <circle r={n.type === 'coop' ? 14 : 12} fill="#122a20" {...common} />;
  };

  return (
    <section className="relative h-full overflow-auto bg-[radial-gradient(circle_at_30%_20%,#173d33_0%,#0d251d_48%,#081812_100%)] p-3 sm:p-5">
      <div className="mx-auto grid max-w-7xl items-start gap-4 xl:grid-cols-[1.45fr_.55fr]">
        <div className="flex flex-col gap-2.5">
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Network layers">
            {NET_LAYERS.map((l) => (
              <button
                key={l.id}
                type="button"
                aria-pressed={layer === l.id}
                onClick={() => {
                  setLayer(l.id);
                  if (selected && l.id !== 'all' && !selected.layers.includes(l.id)) choose(null);
                }}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                  layer === l.id
                    ? 'border-[#e3a93a] bg-[#284a38] text-[#f1ecda]'
                    : 'border-[#2a4636] bg-[#122a20] text-[#c9c3ab] hover:border-[#4fa697] hover:text-[#f1ecda]'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>

        <div className="relative aspect-[860/720] w-full overflow-hidden rounded-3xl border border-[#335744] bg-[#0f2f37]/90 shadow-2xl">
          <svg
            viewBox={`0 0 ${NET_VIEWBOX.w} ${NET_VIEWBOX.h}`}
            preserveAspectRatio="xMidYMid meet"
            className="absolute inset-0 h-full w-full"
            role="group"
            aria-label="Schematic map of Grenada, Carriacou and Petite Martinique showing cooperative, farm, school, market and learning connections"
          >
            <defs>
              <marker id="net-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#8f7fd1" />
              </marker>
            </defs>

            {NET_ISLANDS.map((isl) => {
              const lp = netProj(isl.label);
              return (
                <g key={isl.name}>
                  <path d={smoothClosed(isl.pts.map(netProj))} fill="#2f5b3a" stroke="#8fc5a0" strokeWidth={2} strokeOpacity={0.55} strokeLinejoin="round" />
                  <text x={lp.x} y={lp.y} fill="#f1ecda" fillOpacity={0.4} fontSize={isl.big ? 20 : 13} fontWeight={700} letterSpacing="0.16em" textAnchor={isl.anchor}>{isl.name}</text>
                </g>
              );
            })}
            {NET_PARISHES.map(([name, ll]) => {
              const p = netProj(ll);
              return <text key={name} x={p.x} y={p.y} fill="#f1ecda" fillOpacity={0.22} fontSize={8} letterSpacing="0.12em" textAnchor="middle">{name}</text>;
            })}

            <g fill="none" strokeLinecap="round">
              {NET_LINKS.map((l, i) => {
                const a = byId[l.a].p, b = byId[l.b].p;
                const dx = b.x - a.x, dy = b.y - a.y, len = Math.sqrt(dx * dx + dy * dy) || 1;
                const cx = (a.x + b.x) / 2 + (-dy / len) * l.curv * len;
                const cy = (a.y + b.y) / 2 + (dx / len) * l.curv * len;
                const st = LINK_STYLE[l.kind];
                const on = inLayer(l.layers);
                return (
                  <g key={i} opacity={on ? 1 : 0.07}>
                    <path
                      d={`M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`}
                      stroke={st.stroke}
                      strokeWidth={l.kind === 'study' ? 3.2 : 1.8}
                      strokeOpacity={l.kind === 'study' ? 0.95 : 0.75}
                      strokeDasharray={st.dash}
                      markerEnd={l.kind === 'study' ? 'url(#net-arrow)' : undefined}
                      className="network-path"
                    />
                    {l.label && <text x={cx} y={cy - 6} fill="#d9d0ff" fontSize={11} fontWeight={700} textAnchor="middle" stroke="none">{l.label}</text>}
                  </g>
                );
              })}
            </g>

            {nodes.map((n) => {
              const on = inLayer(n.layers);
              const isSel = selectedId === n.id;
              return (
                <g
                  key={n.id}
                  transform={`translate(${n.p.x},${n.p.y})`}
                  className="cursor-pointer outline-none"
                  opacity={on ? 1 : 0.1}
                  style={{ pointerEvents: on ? 'auto' : 'none' }}
                  tabIndex={on ? 0 : -1}
                  role="button"
                  aria-label={n.title}
                  onClick={() => choose(n.id)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose(n.id); } }}
                >
                  <title>{n.title}</title>
                  {renderShape(n, isSel)}
                  {['coop', 'hq', 'partner', 'buyer', 'inst'].includes(n.type) && <circle r={4.5} fill={n.color} />}
                  {n.type === 'hub' && <rect x={-5} y={-5} width={10} height={10} rx={1.5} fill={n.color} />}
                </g>
              );
            })}

            {nodes.filter((n) => n.label).map((n) => {
              const right = n.side !== 'left';
              const off = n.type === 'coop' ? 22 : 20;
              return (
                <text
                  key={`lab-${n.id}`}
                  x={n.p.x + (right ? off : -off)}
                  y={n.p.y + 4}
                  fill="#f1ecda"
                  fontSize={11.5}
                  fontWeight={700}
                  textAnchor={right ? 'start' : 'end'}
                  opacity={inLayer(n.layers) ? 1 : 0.1}
                  pointerEvents="none"
                >
                  {n.label}
                </text>
              );
            })}

            <g transform="translate(612,318)">
              <rect x={-14} y={-22} width={240} height={218} rx={10} fill="#08181d" fillOpacity={0.6} />
              {[
                ['coop', 'Cooperative (3)'], ['farm', 'Demonstration farm (10)'], ['school', 'School installation (5)'],
                ['hq', 'GCLL, national hub'], ['hub', 'Processing & market hub'], ['outreach', 'Smallholder farms nearby'],
              ].map(([k, text], i) => (
                <g key={k} transform={`translate(0,${i * 22})`}>
                  {k === 'school' && <rect x={-5} y={-5} width={10} height={10} rx={1.5} fill="#d98a3d" fillOpacity={0.3} stroke="#d98a3d" strokeWidth={1.6} />}
                  {k === 'hq' && <polygon points="0,-7 7,0 0,7 -7,0" fill="none" stroke="#e3a93a" strokeWidth={1.8} />}
                  {k === 'hub' && <rect x={-6} y={-6} width={12} height={12} rx={3} fill="none" stroke="#f1ecda" strokeWidth={1.8} />}
                  {k === 'outreach' && <circle r={7} fill="none" stroke="#f1ecda" strokeWidth={1.4} strokeDasharray="3 2" />}
                  {k === 'coop' && <circle r={7} fill="none" stroke="#8bbf6f" strokeWidth={1.8} />}
                  {k === 'farm' && <circle r={5} fill="none" stroke="#4fa697" strokeWidth={1.8} />}
                  <text x={18} y={4} fill="#f1ecda" fillOpacity={0.85} fontSize={10.5}>{text}</text>
                </g>
              ))}
              {[['#a9d58a', '7 7', 'Products and produce'], ['#a99be6', '3 7', 'Training and learning'], ['#e3a93a', '1 6', 'MoUs, supply agreements']].map(([c, d, text], i) => (
                <g key={text} transform={`translate(0,${6 * 22 + i * 20})`}>
                  <line x1={-8} y1={0} x2={10} y2={0} stroke={c} strokeWidth={2} strokeDasharray={d} strokeLinecap="round" />
                  <text x={18} y={4} fill="#f1ecda" fillOpacity={0.85} fontSize={10.5}>{text}</text>
                </g>
              ))}
            </g>
          </svg>

          <p className="pointer-events-none absolute bottom-3 right-3 max-w-[330px] rounded-xl bg-[#08181d]/75 px-3 py-2 font-mono text-[10px] leading-snug text-[#c9c3ab]">
            Schematic map, not to scale · solid ring = named in the contract · dashed ring = illustrative location, to be confirmed by GCLL
          </p>

          <div className="absolute bottom-3 left-4 hidden grid-cols-3 gap-4 rounded-2xl border border-[#335744] bg-[#081812]/80 px-4 py-2 backdrop-blur-md sm:grid">
            <div><strong className="block text-lg text-[#8bbf6f]">3</strong><span className="text-[11px] text-[#c9c3ab]">cooperatives</span></div>
            <div><strong className="block text-lg text-[#e3a93a]">10 + 5</strong><span className="text-[11px] text-[#c9c3ab]">farms + schools</span></div>
            <div><strong className="block text-lg text-[#4fa697]">120</strong><span className="text-[11px] text-[#c9c3ab]">people trained</span></div>
          </div>
        </div>
        </div>

        <aside className="flex flex-col gap-3">
          {selected && (
            <div className="rounded-2xl border border-[#335744] bg-[#122a20] p-5" aria-live="polite">
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider" style={{ backgroundColor: `${selected.color}33`, color: selected.color }}>{selected.tag}</span>
                  <span className="rounded-full border border-[#8bbf6f]/50 bg-[#8bbf6f]/15 px-2 py-0.5 font-mono text-[10px] uppercase text-[#8bbf6f]">Confirmed</span>
                </div>
                <button type="button" onClick={() => choose(null)} aria-label="Close details" className="rounded-lg border border-[#2a4636] bg-[#1c3c2d] p-1.5 text-[#c9c3ab] hover:text-[#f1ecda]"><X size={15} /></button>
              </div>
              <p className="mt-2 font-mono text-[10px] text-[#c9c3ab]">Activity {selected.activity}{selected.illustrative ? ' · illustrative location' : ''}</p>
              <h3 className="mt-1 font-['Bricolage_Grotesque',sans-serif] text-lg font-bold leading-tight text-[#f1ecda]">{selected.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#c9c3ab]">{selected.desc}</p>
              <dl className="mt-3 space-y-2 text-xs">
                {[['Role', selected.role], ['Connects to', selected.connects], ['Source', selected.source]].map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[76px_1fr] gap-2"><dt className="font-mono uppercase tracking-wide text-[#c9c3ab]/80">{k}</dt><dd className="text-[#f1ecda]">{v}</dd></div>
                ))}
              </dl>
              {selected.stationId && (
                <button type="button" onClick={() => onSelectHotspot(selected.stationId!)} className="mt-4 inline-flex items-center gap-2 rounded-xl border border-[#e3a93a]/40 bg-[#e3a93a]/10 px-3 py-2 text-xs font-semibold text-[#f1ecda] hover:bg-[#e3a93a]/15">
                  <MapPin size={14} className="text-[#e3a93a]" /> Open the matching 3D station
                </button>
              )}
            </div>
          )}

          <div className="rounded-2xl border border-[#335744] bg-[#122a20] p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-[#8f7fd1]/20 p-2 text-[#b9adf0]"><GraduationCap /></div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-wider text-[#e3a93a]">Training &amp; learning · Activity A2</p>
                <h3 className="font-bold text-[#f1ecda]">Learning pathway</h3>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-[#c9c3ab]">
              {[['10', 'trainings'], ['45', 'demonstration sessions'], ['10', 'coaching visits'], ['1', 'international study visit']].map(([n, t]) => (
                <div key={t} className="border-t border-[#2a4636] pt-2"><b className="block font-mono text-lg text-[#8bbf6f]">{n}</b><span className="text-[11px]">{t}</span></div>
              ))}
            </div>
            <ol className="mt-4 space-y-2.5 text-sm text-[#c9c3ab]">
              {LEARNING_STEPS.map((s, i) => (
                <li key={s.title} className="flex gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#8f7fd1] font-mono text-[10px] font-bold text-[#0c1e17]">{i + 1}</span>
                  <span><strong className="text-[#f1ecda]">{s.title}</strong> — {s.text}</span>
                </li>
              ))}
            </ol>
            <p className="mt-3 text-[11px] leading-snug text-[#e3a93a]">The contract says six participants in one place and lists eight in another — GCLL to confirm. The Dec 2025 study-tour report belongs to a separate grant.</p>
          </div>

          <button type="button" onClick={() => onSelectHotspot('training')} className="group flex items-center gap-3 rounded-2xl border border-[#8f7fd1]/40 bg-[#8f7fd1]/10 p-4 text-left transition hover:bg-[#8f7fd1]/15">
            <MapPin className="text-[#b9adf0]" />
            <span><strong className="block text-sm text-[#f1ecda]">Open the Training &amp; Learning Hub</strong><span className="text-xs text-[#c9c3ab]">Workshops, coaching and the Panama study visit</span></span>
          </button>
          <p className="px-2 text-[11px] leading-relaxed text-[#c9c3ab]/70">All site positions are conceptual. Final farm, school and institutional locations must be confirmed by the project team.</p>
        </aside>
      </div>
    </section>
  );
};
