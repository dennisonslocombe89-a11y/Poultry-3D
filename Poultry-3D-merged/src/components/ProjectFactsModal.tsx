import React, { useState } from 'react';
import { X, Sliders, TrendingUp, DollarSign, Leaf, Zap, Award, CheckCircle2 } from 'lucide-react';
import { PROJECT_METRICS } from '../data/poultryData';

interface ProjectFactsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectFactsModal: React.FC<ProjectFactsModalProps> = ({ isOpen, onClose }) => {
  const [flockSize, setFlockSize] = useState<number>(150);

  if (!isOpen) return null;

  // Circular calculations based on smallholder field benchmarks:
  // Avg hen produces ~0.12 kg manure / day
  const dailyManureKg = (flockSize * 0.12).toFixed(1);
  const monthlyManureKg = (parseFloat(dailyManureKg) * 30).toFixed(0);
  
  // Biogas yield: ~0.25 m³ per kg manure input (diluted)
  // ~40% of manure routed to digester, 60% to composting & BSF
  const monthlyBiogasM3 = (parseFloat(monthlyManureKg) * 0.4 * 0.22).toFixed(1);
  const lpgBottlesSaved = (parseFloat(monthlyBiogasM3) / 14).toFixed(1); // 1 LPG bottle ~ 14 m³ biogas equiv.
  
  // BSF production: 1 kg organic waste yields ~0.18 kg fresh BSF larvae
  const monthlyBsfProteinKg = (parseFloat(monthlyManureKg) * 0.3 * 0.18).toFixed(1);
  
  // Financial savings: Commercial feed is ~$1.10 USD / kg, BSF & cassava displaces ~30%
  // Average bird consumes 110g feed/day = 3.3 kg/month
  const totalMonthlyFeedKg = flockSize * 3.3;
  const feedSavedKg = (totalMonthlyFeedKg * 0.28).toFixed(0);
  const feedSavingsUSD = (parseFloat(feedSavedKg) * 1.15).toFixed(0);
  const feedSavingsXCD = (parseFloat(feedSavingsUSD) * 2.7).toFixed(0);

  // Compost yield
  const monthlyCompostKg = (parseFloat(monthlyManureKg) * 0.65).toFixed(0);

  return (
    <div 
      id="project-facts-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-5 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        id="project-facts-modal-content"
        className="relative max-w-2xl w-full max-h-[90vh] bg-[#122a20] border border-[#2a4636] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#2a4636] bg-[#0c1e17]/80 flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1 rounded bg-[#e3a93a]/20 text-[#e3a93a]">
                <Award size={16} />
              </span>
              <p className="text-xs font-mono uppercase tracking-wider text-[#e3a93a] font-bold">
                GCLL &middot; EUCaN Grant No. 700001756-01-04
              </p>
            </div>
            <h2 className="font-['Bricolage_Grotesque',sans-serif] text-xl sm:text-2xl font-bold text-[#f1ecda]">
              Scaling Circular Poultry Cooperatives
            </h2>
            <p className="text-xs text-[#c9c3ab] mt-1 font-mono">
              &euro;144,450 &middot; 100% EU-funded &middot; 12-Month Pilot Program
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close project facts"
            className="p-1.5 rounded-lg bg-[#1c3c2d] text-[#c9c3ab] hover:text-[#f1ecda] border border-[#2a4636] hover:border-[#c0603a] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-sm">
          {/* Key Grant Stats Grid (matching user uploaded image exactly) */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#4fa697] mb-3 flex items-center gap-1.5">
              <span>Action at a Glance</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
              <div className="bg-[#0c1e17] p-3 rounded-xl border border-[#2a4636]">
                <b className="block font-mono text-xl text-[#8bbf6f]">3</b>
                <span className="text-xs text-[#c9c3ab]">cooperatives strengthened</span>
              </div>
              <div className="bg-[#0c1e17] p-3 rounded-xl border border-[#2a4636]">
                <b className="block font-mono text-xl text-[#8bbf6f]">15</b>
                <span className="text-xs text-[#c9c3ab]">circular installations</span>
              </div>
              <div className="bg-[#0c1e17] p-3 rounded-xl border border-[#2a4636]">
                <b className="block font-mono text-xl text-[#8bbf6f]">10 + 5</b>
                <span className="text-xs text-[#c9c3ab]">farm sites + school sites</span>
              </div>
              <div className="bg-[#0c1e17] p-3 rounded-xl border border-[#2a4636]">
                <b className="block font-mono text-xl text-[#8bbf6f]">120</b>
                <span className="text-xs text-[#c9c3ab]">trained (48 women &middot; 24 youth)</span>
              </div>
              <div className="bg-[#0c1e17] p-3 rounded-xl border border-[#2a4636]">
                <b className="block font-mono text-xl text-[#8bbf6f]">12&ndash;15%</b>
                <span className="text-xs text-[#c9c3ab]">baseline flock mortality</span>
              </div>
              <div className="bg-[#0c1e17] p-3 rounded-xl border border-[#2a4636]">
                <b className="block font-mono text-xl text-[#8bbf6f]">70%</b>
                <span className="text-xs text-[#c9c3ab]">target circular adoption</span>
              </div>
            </div>
          </div>

          {/* Interactive Circular Economy Farm Calculator */}
          <div className="bg-[#0c1e17]/90 rounded-2xl p-4 sm:p-5 border border-[#2a4636]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h4 className="font-['Bricolage_Grotesque',sans-serif] text-base font-bold text-[#f1ecda] flex items-center gap-2">
                  <Sliders size={16} className="text-[#e3a93a]" />
                  <span>Circular Yield & Savings Calculator</span>
                </h4>
                <p className="text-xs text-[#c9c3ab]">
                  Simulate circular resource returns based on your flock size
                </p>
              </div>

              <div className="flex items-center gap-2 bg-[#122a20] px-3 py-1.5 rounded-xl border border-[#2a4636] self-start sm:self-auto">
                <span className="text-xs text-[#c9c3ab]">Flock Size:</span>
                <span className="font-mono text-sm font-bold text-[#e3a93a]">{flockSize} birds</span>
              </div>
            </div>

            {/* Slider */}
            <div className="space-y-2 mb-5">
              <input
                type="range"
                min="50"
                max="600"
                step="25"
                value={flockSize}
                onChange={(e) => setFlockSize(parseInt(e.target.value))}
                className="w-full h-2 bg-[#1c3c2d] rounded-lg appearance-none cursor-pointer accent-[#e3a93a]"
              />
              <div className="flex justify-between text-[11px] font-mono text-[#c9c3ab]/60">
                <span>50 birds (Smallholder)</span>
                <span>300 birds (Co-op Avg)</span>
                <span>600 birds (Anchor Demo)</span>
              </div>
            </div>

            {/* Calculated Yields */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="bg-[#122a20] p-2.5 rounded-xl border border-[#2a4636]">
                <div className="flex items-center gap-1 text-[11px] font-mono text-[#4fa697] mb-1">
                  <Zap size={12} /> Biogas Methane
                </div>
                <span className="block font-mono text-base font-bold text-[#f1ecda]">
                  {monthlyBiogasM3} m³
                </span>
                <span className="text-[10px] text-[#c9c3ab]/70">
                  ≈ {lpgBottlesSaved} LPG cylinders/mo
                </span>
              </div>

              <div className="bg-[#122a20] p-2.5 rounded-xl border border-[#2a4636]">
                <div className="flex items-center gap-1 text-[11px] font-mono text-[#8bbf6f] mb-1">
                  <Leaf size={12} /> BSF Protein
                </div>
                <span className="block font-mono text-base font-bold text-[#f1ecda]">
                  {monthlyBsfProteinKg} kg
                </span>
                <span className="text-[10px] text-[#c9c3ab]/70">
                  42% crude live protein/mo
                </span>
              </div>

              <div className="bg-[#122a20] p-2.5 rounded-xl border border-[#2a4636]">
                <div className="flex items-center gap-1 text-[11px] font-mono text-[#e3a93a] mb-1">
                  <DollarSign size={12} /> Feed Saved
                </div>
                <span className="block font-mono text-base font-bold text-[#8bbf6f]">
                  ${feedSavingsUSD} <span className="text-xs font-normal text-[#c9c3ab]">USD</span>
                </span>
                <span className="text-[10px] text-[#c9c3ab]/70">
                  ≈ ${feedSavingsXCD} XCD / month
                </span>
              </div>

              <div className="bg-[#122a20] p-2.5 rounded-xl border border-[#2a4636]">
                <div className="flex items-center gap-1 text-[11px] font-mono text-[#4fa697] mb-1">
                  <TrendingUp size={12} /> Organic Compost
                </div>
                <span className="block font-mono text-base font-bold text-[#f1ecda]">
                  {monthlyCompostKg} kg
                </span>
                <span className="text-[10px] text-[#c9c3ab]/70">
                  For cassava & food plots
                </span>
              </div>
            </div>
          </div>

          {/* Pilot Locations & Partners */}
          <div className="bg-[#122a20] p-4 rounded-xl border border-[#2a4636] space-y-2">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#e3a93a] font-semibold">
              Geographic Scope & Implementation
            </h4>
            <p className="text-xs text-[#c9c3ab] leading-relaxed">
              Operating across three sister islands: <b>Grenada mainland</b>, <b>Carriacou</b>, and <b>Petite Martinique</b>. The initiative is executed in partnership between the Grenada Community Leadership Lab (GCLL), registered agricultural cooperatives, the Ministry of Agriculture, and the European Union Caribbean Network (EUCaN).
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-[#0c1e17] border-t border-[#2a4636] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[#e3a93a] hover:bg-[#e3a93a]/90 text-[#0c1e17] font-semibold text-xs transition-colors"
          >
            Back to Model
          </button>
        </div>
      </div>
    </div>
  );
};
