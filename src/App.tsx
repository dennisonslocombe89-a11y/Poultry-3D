import React, { useState } from 'react';
import { HOTSPOTS_DATA } from './data/poultryData';
import { StationImage, HotspotData } from './types';
import { Header } from './components/Header';
import { ThreeStage } from './components/ThreeStage';
import { CircularLoopDiagram } from './components/CircularLoopDiagram';
import { LegendRail } from './components/LegendRail';
import { ElementDrawer } from './components/ElementDrawer';
import { WalkthroughControls } from './components/WalkthroughControls';
import { ImageLightbox } from './components/ImageLightbox';
import { ProjectFactsModal } from './components/ProjectFactsModal';
import { GrenadaNetwork } from './components/GrenadaNetwork';

type ViewMode = '3d' | 'diagram' | 'network';

export default function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('3d');
  const [isTourMode, setIsTourMode] = useState(false);
  const [activeImage, setActiveImage] = useState<StationImage | null>(null);
  const [isFactsModalOpen, setIsFactsModalOpen] = useState(false);

  // Find currently selected hotspot data
  const selectedElement = HOTSPOTS_DATA.find((item) => item.id === selectedId) || null;

  // Find index of current station in loop
  const currentIndex = HOTSPOTS_DATA.findIndex((item) => item.id === selectedId);

  // Handlers for selection
  const handleSelectHotspot = (id: string) => {
    setSelectedId(id);
  };

  const handleCloseDrawer = () => {
    setSelectedId(null);
    if (isTourMode) {
      setIsTourMode(false);
    }
  };

  // Tour navigation
  const handleStartTour = () => {
    setIsTourMode(true);
    setSelectedId(HOTSPOTS_DATA[0].id);
  };

  const handleNextStation = () => {
    const nextIdx = (currentIndex + 1) % HOTSPOTS_DATA.length;
    setSelectedId(HOTSPOTS_DATA[nextIdx].id);
  };

  const handlePrevStation = () => {
    const prevIdx = (currentIndex - 1 + HOTSPOTS_DATA.length) % HOTSPOTS_DATA.length;
    setSelectedId(HOTSPOTS_DATA[prevIdx].id);
  };

  const handleExitTour = () => {
    setIsTourMode(false);
  };

  return (
    <div className="h-screen w-screen flex flex-col p-2.5 sm:p-4 gap-3 bg-[#0c1e17] text-[#f1ecda] overflow-hidden font-['Work_Sans',sans-serif]">
      {/* Top Navigation & App Header */}
      <Header
        viewMode={viewMode}
        onToggleViewMode={(mode) => setViewMode(mode)}
        onStartWalkthrough={handleStartTour}
        onOpenFacts={() => setIsFactsModalOpen(true)}
        isTourMode={isTourMode}
      />

      {/* Main Interactive Stage & Side Rail */}
      <main className="relative flex-1 min-h-0 flex flex-col lg:flex-row gap-3 overflow-hidden">
        {/* Stage Container (3D or 2D Diagram) */}
        <div className="relative flex-1 min-w-0 h-full rounded-2xl overflow-hidden border border-[#2a4636] bg-[#122a20]">
          {viewMode === '3d' ? (
            <ThreeStage
              selectedId={selectedId}
              onSelectHotspot={handleSelectHotspot}
              isTourMode={isTourMode}
            />
          ) : viewMode === 'diagram' ? (
            <CircularLoopDiagram
              selectedId={selectedId}
              onSelectHotspot={handleSelectHotspot}
            />
          ) : (
            <GrenadaNetwork onSelectHotspot={handleSelectHotspot} />
          )}

          {/* Floating Guided Tour Bar */}
          {isTourMode && selectedElement && (
            <WalkthroughControls
              currentIndex={currentIndex >= 0 ? currentIndex : 0}
              totalSteps={HOTSPOTS_DATA.length}
              currentStation={selectedElement}
              onNext={handleNextStation}
              onPrev={handlePrevStation}
              onExit={handleExitTour}
            />
          )}

        </div>

        {/* On desktop, details use a true side column instead of covering the model. */}
        {selectedElement ? (
          <ElementDrawer
            element={selectedElement}
            onClose={handleCloseDrawer}
            onSelectImage={(img) => setActiveImage(img)}
            onNext={handleNextStation}
            onPrev={handlePrevStation}
            isTourMode={isTourMode}
          />
        ) : viewMode !== 'network' ? (
          <LegendRail
            selectedId={selectedId}
            onSelectHotspot={handleSelectHotspot}
          />
        ) : null}
      </main>

      {/* Real Image Lightbox Pop-up */}
      <ImageLightbox
        image={activeImage}
        onClose={() => setActiveImage(null)}
      />

      {/* Project Facts & Circular Impact Simulator Modal */}
      <ProjectFactsModal
        isOpen={isFactsModalOpen}
        onClose={() => setIsFactsModalOpen(false)}
      />
    </div>
  );
}
