'use client';

import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut, X } from 'lucide-react';
import styles from './ZoomableImage.module.css';

interface ZoomableImageProps {
  src: string;
  alt: string;
  className?: string;
}

export default function ZoomableImage({ src, alt, className = '' }: ZoomableImageProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!imageRef.current || !isZoomed) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    setPosition({ x: x * 100, y: y * 100 });
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.5, 1));
  };

  const resetZoom = () => {
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
  };

  const toggleZoom = () => {
    if (isZoomed) {
      setIsZoomed(false);
      resetZoom();
    } else {
      setIsZoomed(true);
    }
  };

  // Close zoom on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isZoomed) {
        setIsZoomed(false);
        resetZoom();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isZoomed]);

  // Set CSS custom properties for dynamic styles
  const imageStyle = {
    '--transform-origin-x': `${position.x}%`,
    '--transform-origin-y': `${position.y}%`,
    '--zoom-level': isZoomed ? zoomLevel : 1,
  } as React.CSSProperties;

  const modalImageStyle = {
    '--transform-origin-x': `${position.x}%`,
    '--transform-origin-y': `${position.y}%`,
    '--zoom-level': zoomLevel,
  } as React.CSSProperties;

  return (
    <>
      {/* Main Image Container */}
      <div 
        ref={containerRef}
        className={`relative group cursor-zoom-in ${className}`}
        onClick={toggleZoom}
      >
        <div 
          ref={imageRef}
          className="relative h-[500px] rounded-lg overflow-hidden"
          onMouseMove={handleMouseMove}
        >
          <Image
            src={src}
            alt={alt}
            fill
            className={`object-cover transition-transform duration-300 ${styles.zoomableImage} ${
              isZoomed ? 'scale-110' : 'group-hover:scale-105'
            }`}
            style={imageStyle}
          />
          
          {/* Zoom Overlay */}
          <div className={`absolute inset-0 bg-black bg-opacity-0 transition-all duration-300 flex items-center justify-center ${
            isZoomed ? 'bg-opacity-20' : 'group-hover:bg-opacity-10'
          }`}>
            <ZoomIn className={`h-8 w-8 text-white transition-opacity duration-300 ${
              isZoomed ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'
            }`} />
          </div>
        </div>

        {/* Zoom Controls */}
        {isZoomed && (
          <div className="absolute top-4 right-4 flex gap-2 z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleZoomOut();
              }}
              className="bg-white bg-opacity-90 hover:bg-opacity-100 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
              title="Zoom Out"
            >
              <ZoomOut className="h-4 w-4 text-gray-700" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleZoomIn();
              }}
              className="bg-white bg-opacity-90 hover:bg-opacity-100 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
              title="Zoom In"
            >
              <ZoomIn className="h-4 w-4 text-gray-700" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleZoom();
              }}
              className="bg-white bg-opacity-90 hover:bg-opacity-100 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
              title="Close Zoom"
            >
              <X className="h-4 w-4 text-gray-700" />
            </button>
          </div>
        )}

        {/* Zoom Level Indicator */}
        {isZoomed && (
          <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 px-3 py-1 rounded-full text-sm font-medium text-gray-700">
            {Math.round(zoomLevel * 100)}%
          </div>
        )}
      </div>

      {/* Full Screen Zoom Modal */}
      {isZoomed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
          onClick={toggleZoom}
        >
          <div 
            className="relative max-w-4xl max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={src}
              alt={alt}
              width={800}
              height={600}
              className={`object-contain max-h-[90vh] rounded-lg ${styles.modalImage}`}
              style={modalImageStyle}
            />
            
            {/* Modal Controls */}
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={handleZoomOut}
                className="bg-white bg-opacity-90 hover:bg-opacity-100 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                title="Zoom Out"
              >
                <ZoomOut className="h-4 w-4 text-gray-700" />
              </button>
              <button
                onClick={handleZoomIn}
                className="bg-white bg-opacity-90 hover:bg-opacity-100 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                title="Zoom In"
              >
                <ZoomIn className="h-4 w-4 text-gray-700" />
              </button>
              <button
                onClick={toggleZoom}
                className="bg-white bg-opacity-90 hover:bg-opacity-100 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                title="Close"
              >
                <X className="h-4 w-4 text-gray-700" />
              </button>
            </div>

            {/* Zoom Level Indicator */}
            <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 px-3 py-1 rounded-full text-sm font-medium text-gray-700">
              {Math.round(zoomLevel * 100)}%
            </div>
          </div>
        </div>
      )}
    </>
  );
} 