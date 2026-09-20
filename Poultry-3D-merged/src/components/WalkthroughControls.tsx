import React, { useEffect, useState } from 'react';
import { 
  Play, 
  Pause, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  Volume2, 
  VolumeX,
  Compass
} from 'lucide-react';
import { HotspotData } from '../types';

interface WalkthroughControlsProps {
  currentIndex: number;
  totalSteps: number;
  currentStation: HotspotData;
  onNext: () => void;
  onPrev: () => void;
  onExit: () => void;
}

export const WalkthroughControls: React.FC<WalkthroughControlsProps> = ({
  currentIndex,
  totalSteps,
  currentStation,
  onNext,
  onPrev,
  onExit,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Auto-play timer
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      onNext();
    }, 7500);

    return () => clearInterval(timer);
  }, [isPlaying, onNext]);

  const toggleSpeech = () => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const narrationText = `Station ${currentIndex + 1}: ${currentStation.title}. ${currentStation.shortDesc} Strategic impact: ${currentStation.whyItMatters}`;
    const utterance = new SpeechSynthesisUtterance(narrationText);
    utterance.rate = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const progressPercent = ((currentIndex + 1) / totalSteps) * 100;

  return (
    <div 
      id="walkthrough-bar"
      className="absolute top-4 left-4 right-4 sm:left-1/2 sm:-translate-x-1/2 sm:w-[560px] sm:max-w-[calc(100vw-32px)] z-40 bg-[#122a20]/95 backdrop-blur-md border border-[#2a4636] rounded-2xl shadow-2xl p-3 sm:px-4 sm:py-3 animate-in slide-in-from-top-3 duration-300"
    >
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="p-1 rounded-md bg-[#e3a93a]/20 text-[#e3a93a] shrink-0">
            <Compass size={16} />
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-[#e3a93a] uppercase font-bold tracking-wider">
                Guided Tour &middot; {currentIndex + 1} of {totalSteps}
              </span>
              <span 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: currentStation.colorHex }}
              />
            </div>
            <h3 className="font-['Bricolage_Grotesque',sans-serif] text-sm sm:text-base font-bold text-[#f1ecda] truncate">
              {currentStation.title}
            </h3>
          </div>
        </div>

        {/* Controls action group */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={toggleSpeech}
            title={isSpeaking ? "Mute narration" : "Read aloud station guide"}
            className={`p-2 rounded-lg border transition-colors ${
              isSpeaking
                ? 'bg-[#4fa697] text-[#0c1e17] border-[#4fa697]'
                : 'bg-[#1c3c2d] text-[#c9c3ab] border-[#2a4636] hover:text-[#f1ecda]'
            }`}
          >
            {isSpeaking ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            title={isPlaying ? "Pause auto tour" : "Play auto tour"}
            className={`p-2 rounded-lg border transition-colors ${
              isPlaying
                ? 'bg-[#e3a93a] text-[#0c1e17] border-[#e3a93a]'
                : 'bg-[#1c3c2d] text-[#c9c3ab] border-[#2a4636] hover:text-[#f1ecda]'
            }`}
          >
            {isPlaying ? <Pause size={15} /> : <Play size={15} />}
          </button>

          <button
            onClick={onPrev}
            title="Previous station"
            className="p-2 rounded-lg bg-[#1c3c2d] text-[#c9c3ab] border border-[#2a4636] hover:text-[#f1ecda] transition-colors"
          >
            <ChevronLeft size={16} />
          </button>

          <button
            onClick={onNext}
            title="Next station"
            className="p-2 rounded-lg bg-[#e3a93a] text-[#0c1e17] hover:bg-[#e3a93a]/90 font-bold transition-colors"
          >
            <ChevronRight size={16} />
          </button>

          <div className="w-px h-5 bg-[#2a4636] mx-0.5" />

          <button
            onClick={() => {
              if (isSpeaking && 'speechSynthesis' in window) {
                window.speechSynthesis.cancel();
              }
              onExit();
            }}
            title="Exit tour"
            aria-label="Exit tour"
            className="p-2 rounded-lg bg-[#1c3c2d] text-[#c9c3ab] border border-[#2a4636] hover:text-[#f1ecda] hover:border-[#c0603a] transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-[#0c1e17] h-1.5 rounded-full overflow-hidden border border-[#2a4636]/60">
        <div 
          className="h-full bg-gradient-to-r from-[#4fa697] via-[#e3a93a] to-[#8bbf6f] transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
};
