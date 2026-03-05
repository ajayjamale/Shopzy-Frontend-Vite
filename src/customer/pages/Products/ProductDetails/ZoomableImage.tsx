import React, { useState, useRef, useEffect, MouseEvent } from 'react';

interface ZoomableImageProps {
  src: string | undefined;
  alt: string;
}

interface Offset {
  x: number;
  y: number;
}

const ZoomableImage: React.FC<ZoomableImageProps> = ({ src, alt }) => {
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [offset, setOffset] = useState<Offset>({ x: 0, y: 0 });
  const [start, setStart] = useState<Offset>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (e.button === 0) {
      setStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
      setIsDragging(true);
      e.preventDefault();
    }
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      setOffset({
        x: e.clientX - start.x,
        y: e.clientY - start.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleContextMenu = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const toggleZoom = () => {
    setIsZoomed(prev => !prev);
    setOffset({ x: 0, y: 0 });
  };

  useEffect(() => {
    if (imgRef.current) {
      imgRef.current.style.cursor = isDragging ? 'grabbing' : 'grab';
    }
  }, [isDragging]);

  return (
    <div
      style={{
        overflow: 'hidden',
        cursor: isZoomed ? (isDragging ? 'grabbing' : 'zoom-out') : 'zoom-in',
        width: '100%',
        height: '100%',
        position: 'relative',
        background: '#f5f5f5',
        borderRadius: '8px',
      }}
      onClick={!isDragging ? toggleZoom : undefined}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onContextMenu={handleContextMenu}
    >
      {/* Zoom hint badge */}
      {!isZoomed && (
        <div style={{
          position: 'absolute',
          bottom: 12,
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0,0,0,0.55)',
          color: '#fff',
          fontSize: 11,
          padding: '4px 10px',
          borderRadius: 20,
          pointerEvents: 'none',
          zIndex: 10,
          letterSpacing: 0.3,
        }}>
          🔍 Click to zoom
        </div>
      )}

      <img
        ref={imgRef}
        src={src}
        alt={alt}
        draggable={false}
        style={{
          width: isZoomed ? '220%' : '100%',
          height: isZoomed ? '220%' : 'auto',
          transform: `translate(${offset.x}px, ${offset.y}px)`,
          transition: isDragging ? 'none' : 'width 0.3s ease, height 0.3s ease, transform 0.3s ease',
          userSelect: 'none',
          display: 'block',
        }}
      />
    </div>
  );
};

export default ZoomableImage;