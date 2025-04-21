"use client";

import { useState, useEffect, useRef } from "react";

interface SliderProps {
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
}

export function Slider({ min, max, step, value, onChange }: SliderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const percentage = ((value - min) / (max - min)) * 100;

  const calculateValue = (clientX: number) => {
    if (!trackRef.current) return;

    const rect = trackRef.current.getBoundingClientRect();
    const position = (clientX - rect.left) / rect.width;
    const rawValue = min + position * (max - min);
    const steppedValue = Math.round(rawValue / step) * step;
    const clampedValue = Math.max(min, Math.min(max, steppedValue));

    onChange(clampedValue);
  };

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    console.log(e.clientX)
    calculateValue(e.clientX);
  };

  const startDragging = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    if ("touches" in e) {
      calculateValue(e.touches[0].clientX);
    } else {
      calculateValue(e.clientX);
    }
  };

  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      calculateValue(clientX);
    };

    const stopDragging = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMove);
      window.addEventListener("touchmove", handleMove);
      window.addEventListener("mouseup", stopDragging);
      window.addEventListener("touchend", stopDragging);
    }

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("mouseup", stopDragging);
      window.removeEventListener("touchend", stopDragging);
    };
  }, [isDragging]);

  return (
    <div className="relative w-full px-2 touch-none">
      {/* Track */}
      <div
        ref={trackRef}
        className="relative w-full h-5 bg-gray-300 dark:bg-gray-700 rounded-full cursor-pointer"
        onClick={handleTrackClick}
      >
        {/* Filled portion */}
        <div
          className="absolute top-0 left-0 h-5 bg-primary rounded-full transition-all duration-200"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Thumb */}
      <div
        className="absolute top-3 w-8 h-8 -translate-y-1/2 rounded-full bg-white border-2 border-primary shadow-md transition-transform duration-150 ease-out touch-none
          hover:ring-4 hover:ring-primary/20 active:ring-4 active:ring-primary/30"
        style={{
          left: `calc(${percentage}% - 18px)`,
          cursor: isDragging ? "grabbing" : "grab",
        }}
        onMouseDown={startDragging}
        onTouchStart={startDragging}
      >
        {/* Tooltip */}
        <div className="hidden sm:block absolute top-[-36px] left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-semibold px-2 py-1 rounded shadow-sm whitespace-nowrap">
          {value}
        </div>
      </div>
    </div>
  );
}
