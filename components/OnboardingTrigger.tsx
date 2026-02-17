
import React from 'react';
import { Rocket, Sparkles, AlertCircle } from 'lucide-react';

interface OnboardingTriggerProps {
  progress: number;
  onClick: () => void;
  pulse?: boolean;
  incompleteStepsCount?: number;
}

export const OnboardingTrigger: React.FC<OnboardingTriggerProps> = ({ 
  progress, 
  onClick, 
  pulse = true,
  incompleteStepsCount = 0
}) => {
  // SVG Progress calculation
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <button 
      onClick={onClick}
      className={`
        fixed bottom-6 right-6 z-[90] h-14 w-14 rounded-full bg-slate-950 shadow-2xl flex items-center justify-center group transition-all duration-300 hover:scale-110 active:scale-95 border-2 border-white/10
        ${pulse && progress < 100 ? 'ring-4 ring-trust-primary/20' : ''}
      `}
    >
      {/* Inner Icon */}
      <Rocket className="h-6 w-6 text-white group-hover:text-trust-primary transition-colors duration-300" />

      {/* Outer Progress Ring */}
      <svg className="absolute inset-0 h-full w-full -rotate-90">
        <circle
          cx="28"
          cy="28"
          r={radius}
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="3"
          fill="transparent"
          className="translate-x-[0px] translate-y-[0px]"
        />
        <circle
          cx="28"
          cy="28"
          r={radius}
          stroke="url(#gradient)"
          strokeWidth="3"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-1000 ease-out translate-x-[0px] translate-y-[0px]"
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#ea580c" />
          </linearGradient>
        </defs>
      </svg>

      {/* Alert Badge for incomplete required items */}
      {incompleteStepsCount > 0 && (
        <div className="absolute -top-1 -right-1 h-5 w-5 bg-energy-primary rounded-full border-2 border-white flex items-center justify-center shadow-lg animate-bounce">
           <Sparkles className="h-2.5 w-2.5 text-white" />
        </div>
      )}
    </button>
  );
};
