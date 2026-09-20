import React from 'react';
import { X, ExternalLink } from 'lucide-react';
import { StationImage } from '../types';

interface ImageLightboxProps {
  image: StationImage | null;
  onClose: () => void;
}

export const ImageLightbox: React.FC<ImageLightboxProps> = ({ image, onClose }) => {
  if (!image) return null;

  return (
    <div 
      id="image-lightbox-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        id="image-lightbox-content"
        className="relative max-w-4xl w-full bg-[#122a20] border border-[#2a4636] rounded-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          id="close-lightbox-btn"
          onClick={onClose}
          aria-label="Close image popup"
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/60 hover:bg-black/80 text-[#f1ecda] transition-colors"
        >
          <X size={20} />
        </button>

        <div className="relative aspect-video sm:aspect-16/10 bg-[#0c1e17] overflow-hidden flex items-center justify-center">
          <img
            src={image.url}
            alt={image.caption}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover sm:object-contain"
          />
        </div>

        <div className="p-4 sm:p-5 bg-[#122a20] border-t border-[#2a4636] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-[#f1ecda] font-medium text-sm sm:text-base leading-snug">
              {image.caption}
            </p>
            {image.credit && (
              <span className="text-xs text-[#c9c3ab]/70 font-mono mt-1 inline-block">
                Source: {image.credit}
              </span>
            )}
          </div>
          <a
            href={image.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-[#4fa697] hover:text-[#8bbf6f] font-mono transition-colors shrink-0"
          >
            <span>Open full-res</span>
            <ExternalLink size={13} />
          </a>
        </div>
      </div>
    </div>
  );
};
