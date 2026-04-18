'use client';

import React, { useState, useRef, useEffect, MouseEvent, TouchEvent } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface BeforeAfterRevealProps {
  beforeImage: string;
  afterImage: string;
  beforeAlt?: string;
  afterAlt?: string;
}

export default function BeforeAfterReveal({
  beforeImage,
  afterImage,
  beforeAlt = 'Before impact',
  afterAlt = 'After impact',
}: BeforeAfterRevealProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
    setSliderPosition(percent);
  };

  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const onTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  const onMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    handleMove(e.clientX);
  };

  const onTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    setIsDragging(true);
    handleMove(e.touches[0].clientX);
  };

  const stopDragging = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    window.addEventListener('mouseup', stopDragging);
    window.addEventListener('touchend', stopDragging);
    return () => {
      window.removeEventListener('mouseup', stopDragging);
      window.removeEventListener('touchend', stopDragging);
    };
  }, []);

  return (
    <div className="section-container pb-24">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto"
      >
        <div className="text-center mb-10">
          <h2 className="font-heading text-3xl font-bold tracking-tight mb-3">
            See the <span className="text-neon-green">Real Impact</span>
          </h2>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            Small individual actions compound into massive environmental restoration. Drag the slider to see how the circular economy transforms communities.
          </p>
        </div>

        <div 
          ref={containerRef}
          className="relative w-full aspect-[4/3] sm:aspect-[16/9] rounded-2xl overflow-hidden cursor-ew-resize select-none border border-white/10 shadow-2xl group touch-none"
          onMouseMove={onMouseMove}
          onTouchMove={onTouchMove}
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
        >
          {/* Base: AFTER Image (Right side) */}
          <div className="absolute inset-0">
            <Image 
              src={afterImage} 
              alt={afterAlt} 
              fill 
              className="object-cover" 
              sizes="(max-width: 768px) 100vw, 1024px"
              priority
            />
            {/* After Label */}
            <div className="absolute top-4 right-4 z-10 pointer-events-none">
              <span className="glass px-3 py-1.5 rounded-lg text-xs font-heading font-bold tracking-widest text-white shadow-lg backdrop-blur-md opacity-80 group-hover:opacity-100 transition-opacity">
                AFTER
              </span>
            </div>
          </div>

          {/* Overlay: BEFORE Image (Left side controlled by clip-path) */}
          <div 
            className="absolute inset-0 z-10 pointer-events-none"
            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
          >
            <Image 
              src={beforeImage} 
              alt={beforeAlt} 
              fill 
              className="object-cover relative z-0"
              sizes="(max-width: 768px) 100vw, 1024px"
              priority
            />
            <div className="absolute inset-0 bg-black/10 z-10" />
            
            {/* Before Label */}
            <div className="absolute top-4 left-4 z-20 pointer-events-none">
              <span className="glass px-3 py-1.5 rounded-lg text-xs font-heading font-bold tracking-widest text-white shadow-lg backdrop-blur-md opacity-80 group-hover:opacity-100 transition-opacity">
                BEFORE
              </span>
            </div>
          </div>

          {/* Draggable Slider Handle */}
          <div 
            className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-[0_0_10px_rgba(0,0,0,0.5)] hover:bg-neon-green transition-colors duration-200 z-20"
            style={{ left: `calc(${sliderPosition}% - 2px)` }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-[0_0_20px_rgba(0,0,0,0.3)] flex items-center justify-center pointer-events-none group-hover:scale-110 group-hover:border-2 group-hover:border-neon-green transition-transform duration-200">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
                <polyline points="9 18 15 12 9 6" style={{ transform: "rotate(180deg)", transformOrigin: "center" }}></polyline>
              </svg>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
