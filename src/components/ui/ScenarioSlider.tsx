'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';

interface ScenarioSliderProps {
  leftScenario: string;
  rightScenario: string;
  onValueChange: (value: number) => void;
  initialValue?: number;
}

export function ScenarioSlider({
  leftScenario,
  rightScenario,
  onValueChange,
  initialValue = 0,
}: ScenarioSliderProps) {
  const t = useTranslations('assessment.slider');
  const [value, setValue] = useState(initialValue);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Reset value when initialValue changes (new question)
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const calculateValue = useCallback((clientX: number) => {
    if (!sliderRef.current) return 0;
    const rect = sliderRef.current.getBoundingClientRect();
    const percentage = (clientX - rect.left) / rect.width;
    const rawValue = percentage * 6 - 3; // Map 0-1 to -3 to 3
    return Math.round(Math.max(-3, Math.min(3, rawValue)));
  }, []);

  const handleStart = useCallback((clientX: number) => {
    setIsDragging(true);
    const newValue = calculateValue(clientX);
    setValue(newValue);
  }, [calculateValue]);

  const handleMove = useCallback((clientX: number) => {
    if (!isDragging) return;
    const newValue = calculateValue(clientX);
    setValue(newValue);
  }, [isDragging, calculateValue]);

  const handleEnd = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      onValueChange(value);
    }
  }, [isDragging, value, onValueChange]);

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX);
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    handleStart(e.touches[0].clientX);
  };

  // Global event listeners for dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX);
    };

    const handleMouseUp = () => {
      handleEnd();
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handleMove(e.touches[0].clientX);
      }
    };

    const handleTouchEnd = () => {
      handleEnd();
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, handleMove, handleEnd]);

  // Calculate visual properties based on value
  const sliderPosition = ((value + 3) / 6) * 100;
  const leftOpacity = value <= 0 ? 1 : 0.5 + (3 - value) / 6;
  const rightOpacity = value >= 0 ? 1 : 0.5 + (3 + value) / 6;
  const leftScale = value < 0 ? 1.02 : 1;
  const rightScale = value > 0 ? 1.02 : 1;

  const getStrengthLabel = (val: number) => {
    const absVal = Math.abs(val);
    if (absVal === 3) return 'Strongly';
    if (absVal === 2) return 'Moderately';
    if (absVal === 1) return 'Slightly';
    return 'Neutral';
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Scenario Cards */}
      <div className="flex gap-4 mb-8">
        {/* Left Scenario */}
        <div
          className={`flex-1 p-5 rounded-xl transition-all duration-300 border ${
            value < 0
              ? 'bg-purple-500/20 border-purple-400/50 shadow-lg shadow-purple-500/20'
              : 'bg-white/5 border-white/10'
          }`}
          style={{
            opacity: leftOpacity,
            transform: `scale(${leftScale})`,
          }}
        >
          <p className="text-white/90 leading-relaxed text-sm md:text-base">{leftScenario}</p>
        </div>

        {/* Right Scenario */}
        <div
          className={`flex-1 p-5 rounded-xl transition-all duration-300 border ${
            value > 0
              ? 'bg-pink-500/20 border-pink-400/50 shadow-lg shadow-pink-500/20'
              : 'bg-white/5 border-white/10'
          }`}
          style={{
            opacity: rightOpacity,
            transform: `scale(${rightScale})`,
          }}
        >
          <p className="text-white/90 leading-relaxed text-sm md:text-base">{rightScenario}</p>
        </div>
      </div>

      {/* Slider */}
      <div className="px-4">
        <div
          ref={sliderRef}
          className={`relative h-4 bg-white/10 rounded-full cursor-pointer select-none ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          {/* Track fill */}
          <div
            className="absolute top-0 h-full rounded-full transition-all duration-75"
            style={{
              left: value < 0 ? `${sliderPosition}%` : '50%',
              right: value > 0 ? `${100 - sliderPosition}%` : '50%',
              background:
                value < 0
                  ? 'linear-gradient(to right, #a855f7, #8b5cf6)'
                  : value > 0
                  ? 'linear-gradient(to right, #ec4899, #f472b6)'
                  : 'transparent',
            }}
          />

          {/* Center marker */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-6 bg-white/30 rounded-full" />

          {/* Slider handle */}
          <div
            className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full shadow-lg transition-transform duration-75 ${
              isDragging ? 'scale-125' : 'hover:scale-110'
            } ${
              value < 0
                ? 'bg-gradient-to-br from-purple-400 to-purple-600'
                : value > 0
                ? 'bg-gradient-to-br from-pink-400 to-pink-600'
                : 'bg-gradient-to-br from-white to-gray-200'
            }`}
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="absolute inset-1 rounded-full bg-white/20" />
            {/* Grip lines */}
            <div className="absolute inset-0 flex items-center justify-center gap-0.5">
              <div className="w-0.5 h-3 bg-white/40 rounded-full" />
              <div className="w-0.5 h-3 bg-white/40 rounded-full" />
              <div className="w-0.5 h-3 bg-white/40 rounded-full" />
            </div>
          </div>

          {/* Tick marks */}
          {[-3, -2, -1, 0, 1, 2, 3].map((tick) => (
            <div
              key={tick}
              className={`absolute top-full mt-3 -translate-x-1/2 text-xs transition-colors ${
                value === tick ? 'text-white font-bold' : 'text-white/30'
              }`}
              style={{ left: `${((tick + 3) / 6) * 100}%` }}
            >
              {tick === 0 ? '•' : '|'}
            </div>
          ))}
        </div>

        {/* Labels */}
        <div className="flex justify-between mt-6 text-xs">
          <div className={`transition-colors ${value < 0 ? 'text-purple-300' : 'text-white/30'}`}>
            {t('leftLabel')}
          </div>
          <div className={`transition-colors ${value === 0 ? 'text-white/60' : 'text-white/30'}`}>
            {t('centerLabel')}
          </div>
          <div className={`transition-colors ${value > 0 ? 'text-pink-300' : 'text-white/30'}`}>
            {t('rightLabel')}
          </div>
        </div>
      </div>
    </div>
  );
}
