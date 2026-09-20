import React, { useState } from 'react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Volume2, 
  VolumeX, 
  ArrowRight, 
  CheckCircle2, 
  Maximize2,
  Sparkles,
  RefreshCw,
  Award
} from 'lucide-react';
import { HotspotData, StationImage } from '../types';

interface ElementDrawerProps {
  element: HotspotData | null;
  onClose: () => void;
  onSelectImage: (image: StationImage) => void;
  onNext?: () => void;
  onPrev?: () => void;
  isTourMode?: boolean;
}

export const ElementDrawer: React.FC<ElementDrawerProps> = ({
  element,
  onClose,
  onSelectImage,
  onNext,
  onPrev,
  isTourMode = false,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'walkthrough' | 'flows' | 'specs'>('overview');
  const [isSpeaking, setIsSpeaking] = useState(false);

  if (!element) return null;

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const narrationText = `${element.title}. ${element.shortDesc} Operational walkthrough: ${element.walkthroughSteps.map(s => `${s.title}: ${s.description}`).join('. ')}`;
    const utterance = new SpeechSynthesisUtterance(narrationText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  return (
    <aside 
      id="element-detail-drawer"
      aria-labelledby="element-drawer-title"
      className="absolute inset-x-3 bottom-3 max-h-[78%] sm:inset-x-auto sm:right-3 sm:top-3 sm:max-h-none sm:w-[460px] lg:static lg:w-[440px] lg:max-w-[38vw] lg:h-full lg:max-h-full lg:shrink-0 bg-[#122a20]/95 backdrop-blur-xl border border-[#2a4636] rounded-2xl shadow-2xl flex flex-col z-30 overflow-hidden animate-in slide-in-from-right-4 duration-300"
    >
      {/* Drawer Header */}
      <div className="p-4 sm:p-5 border-b border-[#2a4636] bg-[#0c1e17]/60 shrink-0">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span 
              className="inline-block px-2.5 py-1 rounded-full text-xs font-mono font-medium uppercase tracking-wider"
              style={{
                backgroundColor: `${element.colorHex}22`,
                color: element.colorHex,
                border: `1px solid ${element.colorHex}44`
              }}
            >
              {element.tag}
            </span>
            {isTourMode && (
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#e3a93a] bg-[#e3a93a]/15 px-2 py-0.5 rounded-full">
                <Sparkles size={11} /> Guided Tour
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-1">
            <button
              id="voice-narration-btn"
              onClick={handleSpeak}
              title={isSpeaking ? "Stop voice narration" : "Listen to walkthrough narration"}
              aria-label="Toggle voice narration"
              className={`p-1.5 rounded-lg border transition-colors ${
                isSpeaking 
                  ? 'bg-[#4fa697] text-[#0c1e17] border-[#4fa697]' 
                  : 'bg-[#1c3c2d] text-[#c9c3ab] border-[#2a4636] hover:text-[#f1ecda] hover:border-[#4fa697]'
              }`}
            >
              {isSpeaking ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            <button
              id="close-drawer-btn"
              onClick={() => {
                if (isSpeaking && 'speechSynthesis' in window) {
                  window.speechSynthesis.cancel();
                  setIsSpeaking(false);
                }
                onClose();
              }}
              aria-label="Close details"
              className="p-1.5 rounded-lg bg-[#1c3c2d] text-[#c9c3ab] border border-[#2a4636] hover:text-[#f1ecda] hover:border-[#c0603a] transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <h2 id="element-drawer-title" className="font-['Bricolage_Grotesque',sans-serif] text-xl sm:text-2xl font-bold text-[#f1ecda] leading-tight">
          {element.title}
        </h2>
        <p className="text-xs sm:text-sm text-[#4fa697] font-mono mt-0.5">
          {element.subtitle}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#2a4636] bg-[#0c1e17]/40 px-2 shrink-0 overflow-x-auto text-xs sm:text-sm">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-2.5 px-3 font-medium transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'overview'
              ? 'text-[#f1ecda] border-[#e3a93a]'
              : 'text-[#c9c3ab]/70 border-transparent hover:text-[#f1ecda]'
          }`}
        >
          Photos & Info
        </button>
        <button
          onClick={() => setActiveTab('walkthrough')}
          className={`py-2.5 px-3 font-medium transition-colors border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'walkthrough'
              ? 'text-[#f1ecda] border-[#e3a93a]'
              : 'text-[#c9c3ab]/70 border-transparent hover:text-[#f1ecda]'
          }`}
        >
          <span>Walkthrough</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#8bbf6f]" />
        </button>
        <button
          onClick={() => setActiveTab('flows')}
          className={`py-2.5 px-3 font-medium transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'flows'
              ? 'text-[#f1ecda] border-[#e3a93a]'
              : 'text-[#c9c3ab]/70 border-transparent hover:text-[#f1ecda]'
          }`}
        >
          Circular Flows
        </button>
        <button
          onClick={() => setActiveTab('specs')}
          className={`py-2.5 px-3 font-medium transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'specs'
              ? 'text-[#f1ecda] border-[#e3a93a]'
              : 'text-[#c9c3ab]/70 border-transparent hover:text-[#f1ecda]'
          }`}
        >
          Impact & Grant
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 text-sm">
        {/* TAB 1: OVERVIEW & REAL IMAGES POPUP */}
        {activeTab === 'overview' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Real Photos Pop-Up Grid */}
            {element.images.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono uppercase tracking-wider text-[#e3a93a] flex items-center gap-1.5">
                  <span>Illustrative Reference Images</span>
                </span>
                <span className="text-[11px] text-[#c9c3ab]/60 font-mono">Tap image to enlarge</span>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {element.images.map((img, i) => (
                  <div
                    key={i}
                    onClick={() => onSelectImage(img)}
                    className="group relative rounded-xl overflow-hidden border border-[#2a4636] aspect-4/3 bg-[#0c1e17] cursor-pointer hover:border-[#4fa697] transition-all shadow-md"
                  >
                    <img
                      src={img.url}
                      alt={img.caption}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                    <div className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <Maximize2 size={12} />
                    </div>
                    <p className="absolute bottom-2 left-2 right-2 text-[11px] text-[#f1ecda] line-clamp-2 leading-tight font-medium">
                      {img.caption}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            )}

            {/* Description */}
            <div className="bg-[#0c1e17]/70 rounded-xl p-3.5 border border-[#2a4636]/70">
              <p className="text-[#f1ecda] leading-relaxed text-sm">
                {element.fullDesc}
              </p>
            </div>

            {/* Why It Matters Callout */}
            <div className="bg-[#1c3c2d]/60 rounded-xl p-3.5 border-l-3 border-[#e3a93a]">
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#e3a93a] font-semibold mb-1">
                Strategic Importance in Grenada
              </h4>
              <p className="text-xs text-[#c9c3ab] leading-normal">
                {element.whyItMatters}
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              {element.impactMetrics.map((metric, idx) => (
                <div key={idx} className="bg-[#0c1e17]/80 rounded-xl p-2.5 border border-[#2a4636] text-center">
                  <span className="block text-xs text-[#c9c3ab]/80 truncate">{metric.label}</span>
                  <span className="block font-mono text-sm font-bold text-[#8bbf6f] mt-0.5">{metric.value}</span>
                  {metric.change && (
                    <span className="inline-block text-[10px] font-mono text-[#e3a93a] mt-0.5">
                      {metric.change}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: WALKTHROUGH STEPS */}
        {activeTab === 'walkthrough' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <p className="text-xs font-mono text-[#c9c3ab]">
                Operational Walkthrough Procedure
              </p>
              <button
                onClick={handleSpeak}
                className="text-xs text-[#4fa697] hover:underline font-mono flex items-center gap-1"
              >
                <Volume2 size={13} />
                <span>{isSpeaking ? 'Stop narration' : 'Listen aloud'}</span>
              </button>
            </div>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#2a4636]">
              {element.walkthroughSteps.map((step) => (
                <div key={step.step} className="relative group">
                  <div 
                    className="absolute -left-6 top-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold"
                    style={{
                      backgroundColor: element.colorHex,
                      color: '#0c1e17'
                    }}
                  >
                    {step.step}
                  </div>
                  <div className="bg-[#0c1e17]/70 rounded-xl p-3.5 border border-[#2a4636] hover:border-[#4fa697] transition-colors">
                    <h4 className="font-['Bricolage_Grotesque',sans-serif] font-bold text-sm text-[#f1ecda] mb-1">
                      {step.title}
                    </h4>
                    <p className="text-xs text-[#c9c3ab] leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-[#163327]/60 rounded-xl border border-[#4fa697]/30 flex items-start gap-2.5 text-xs text-[#c9c3ab]">
              <CheckCircle2 size={16} className="text-[#8bbf6f] shrink-0 mt-0.5" />
              <span>
                Illustrative operating sequence. Final procedures require project and technical approval.
              </span>
            </div>
          </div>
        )}

        {/* TAB 3: CIRCULAR FLOWS (INPUTS & OUTPUTS) */}
        {activeTab === 'flows' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="bg-[#0c1e17]/60 rounded-xl p-3 border border-[#2a4636] text-xs text-[#c9c3ab] flex items-center gap-2">
              <RefreshCw size={15} className="text-[#4fa697] shrink-0 animate-spin-slow" />
              <span>
                Closed-loop resource balancing: how waste becomes an input for the next cycle.
              </span>
            </div>

            {/* Inflows */}
            <div className="bg-[#0c1e17]/80 rounded-xl p-3.5 border border-[#2a4636]">
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#4fa697] font-semibold flex items-center gap-1.5 mb-2.5">
                <ArrowRight size={13} className="rotate-90 text-[#4fa697]" />
                Resource Inputs & Supplies
              </h4>
              <ul className="space-y-2">
                {element.inputs.map((inp, idx) => (
                  <li key={idx} className="text-xs text-[#f1ecda] flex items-start gap-2 bg-[#122a20] p-2 rounded-lg border border-[#2a4636]/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4fa697] mt-1.5 shrink-0" />
                    <span>{inp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Outflows */}
            <div className="bg-[#0c1e17]/80 rounded-xl p-3.5 border border-[#2a4636]">
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#e3a93a] font-semibold flex items-center gap-1.5 mb-2.5">
                <ArrowRight size={13} className="text-[#e3a93a]" />
                Outputs & Recovered Coproducts
              </h4>
              <ul className="space-y-2">
                {element.outputs.map((outp, idx) => (
                  <li key={idx} className="text-xs text-[#f1ecda] flex items-start gap-2 bg-[#122a20] p-2 rounded-lg border border-[#2a4636]/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#e3a93a] mt-1.5 shrink-0" />
                    <span>{outp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* TAB 4: SPECS & GRANT ALIGNMENT */}
        {activeTab === 'specs' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* EU Grant alignment */}
            <div className="bg-[#1c3c2d]/70 rounded-xl p-3.5 border border-[#2a4636]">
              <div className="flex items-center gap-2 mb-1.5">
                <Award size={16} className="text-[#e3a93a]" />
                <span className="text-xs font-mono text-[#e3a93a] font-semibold uppercase">
                  Grant Alignment
                </span>
              </div>
              <p className="text-xs font-mono text-[#f1ecda]">
                {element.grantAlignment}
              </p>
            </div>

            {/* Technical specs table */}
            <div className="bg-[#0c1e17]/80 rounded-xl border border-[#2a4636] overflow-hidden">
              <div className="px-3.5 py-2.5 border-b border-[#2a4636] bg-[#122a20]">
                <span className="text-xs font-mono uppercase text-[#c9c3ab] tracking-wider">
                  Confirmed Details and Open Items
                </span>
              </div>
              <dl className="divide-y divide-[#2a4636]">
                {element.keySpecs.map((spec, i) => (
                  <div key={i} className="px-3.5 py-2.5 flex justify-between gap-3 text-xs">
                    <dt className="text-[#c9c3ab] font-medium">{spec.label}</dt>
                    <dd className="text-[#f1ecda] font-mono text-right">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        )}
      </div>

      {/* Drawer Footer Navigation */}
      {(onPrev || onNext) && (
        <div className="p-3 bg-[#0c1e17] border-t border-[#2a4636] flex items-center justify-between shrink-0">
          <button
            onClick={onPrev}
            className="inline-flex items-center gap-1 text-xs text-[#c9c3ab] hover:text-[#f1ecda] px-3 py-1.5 rounded-lg bg-[#1c3c2d] border border-[#2a4636] transition-colors"
          >
            <ChevronLeft size={14} />
            <span>Previous Station</span>
          </button>
          <span className="text-[11px] font-mono text-[#c9c3ab]/60">
            Loop Cycle
          </span>
          <button
            onClick={onNext}
            className="inline-flex items-center gap-1 text-xs text-[#0c1e17] font-semibold px-3 py-1.5 rounded-lg bg-[#e3a93a] hover:bg-[#e3a93a]/90 transition-colors"
          >
            <span>Next Station</span>
            <ChevronRight size={14} />
          </button>
        </div>
      )}
    </aside>
  );
};
