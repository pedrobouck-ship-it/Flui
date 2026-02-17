
import React from 'react';

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = 'h-8' }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        width="32"
        height="32"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto"
      >
        <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" strokeDasharray="1 4" />
        <path d="M30 50C30 38.9543 38.9543 30 50 30C61.0457 30 70 38.9543 70 50V70H50C38.9543 70 30 61.0457 30 50Z" fill="currentColor" fillOpacity="0.1" />
        <path d="M50 30L70 50L50 70L30 50L50 30Z" fill="currentColor" />
        <circle cx="50" cy="50" r="8" fill="white" />
      </svg>
      <span className="font-bold text-xl tracking-tight font-sans">Flui</span>
    </div>
  );
};
