
import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

// --- BUTTON ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'trust' | 'energy' | 'ghost' | 'outline' | 'link' | 'gradient' | 'destructive' | 'secondary';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'trust', 
  size = 'md', 
  className = '', 
  loading,
  disabled,
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-lg font-bold transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none disabled:grayscale';
  
  const variants = {
    trust: 'bg-trust-primary text-white hover:bg-trust-dark shadow-lg shadow-trust-primary/20',
    energy: 'bg-energy-primary text-white hover:bg-energy-dark shadow-lg shadow-energy-primary/20',
    secondary: 'bg-slate-900 text-white hover:bg-slate-800 shadow-md',
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900',
    outline: 'bg-transparent border-2 border-slate-200 text-slate-700 hover:border-trust-primary hover:text-trust-primary',
    gradient: 'bg-gradient-to-r from-trust-primary to-energy-primary text-white hover:brightness-110 shadow-xl shadow-trust-primary/10',
    destructive: 'bg-red-500 text-white hover:bg-red-600',
    link: 'bg-transparent text-trust-primary hover:underline p-0 h-auto'
  };

  const sizes = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-5 text-sm',
    lg: 'h-12 px-8 text-base',
    icon: 'h-10 w-10 p-0',
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
      ) : null}
      {children}
    </button>
  );
};

// --- TOGGLE GROUP (Segmented Control) ---
interface ToggleGroupProps {
  value: string;
  onValueChange: (value: any) => void;
  options: { value: string; label: string; icon?: React.ElementType }[];
  className?: string;
}

export const ToggleGroup: React.FC<ToggleGroupProps> = ({ value, onValueChange, options, className = '' }) => {
  return (
    <div className={`p-1 bg-slate-100 rounded-xl flex gap-1 ${className}`}>
      {options.map((opt) => {
        const isActive = value === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onValueChange(opt.value)}
            className={`
              flex-1 flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all
              ${isActive ? 'bg-white text-slate-900 shadow-md' : 'text-slate-500 hover:text-slate-700'}
            `}
          >
            {opt.icon && <opt.icon className="h-3.5 w-3.5" />}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
};

// --- CARD ---
interface CardProps {
  children: React.ReactNode;
  className?: string;
  context?: 'trust' | 'energy' | 'neutral' | 'none';
  hoverEffect?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', context = 'neutral', hoverEffect = false, onClick }) => {
  const contextStyles = {
    neutral: 'bg-white border-gray-100',
    trust: 'bg-white border-trust-primary/20',
    energy: 'bg-white border-energy-primary/20',
    none: 'bg-transparent border-transparent'
  };

  return (
    <div 
      onClick={onClick}
      className={`
        rounded-2xl border p-6 transition-all duration-300
        ${contextStyles[context]}
        ${hoverEffect ? 'hover:shadow-xl hover:-translate-y-1 cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

// --- BADGE ---
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'trust' | 'energy' | 'success' | 'outline' | 'secondary' | 'destructive';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'secondary', className = '' }) => {
  const variants = {
    trust: 'bg-indigo-50 text-trust-primary border-indigo-100',
    energy: 'bg-orange-50 text-energy-primary border-orange-100',
    success: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    secondary: 'bg-slate-100 text-slate-600 border-slate-200',
    destructive: 'bg-red-50 text-red-600 border-red-100',
    outline: 'bg-transparent border-gray-200 text-gray-500'
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

// --- MODAL (DIALOG) ---
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, description, children, maxWidth = 'max-w-lg' }) => {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
      <div className={`relative w-full ${maxWidth} bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300`}>
        <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
          <div>
            {title && <h3 className="text-lg font-black text-slate-900">{title}</h3>}
            {description && <p className="text-xs text-slate-500">{description}</p>}
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[80vh]">
          {children}
        </div>
      </div>
    </div>
  );
};

// --- PROGRESS ---
interface ProgressProps {
  value: number;
  className?: string;
  indicatorColor?: string;
}

export const Progress: React.FC<ProgressProps> = ({ value, className = '', indicatorColor = 'bg-trust-primary' }) => {
  return (
    <div className={`w-full bg-slate-100 rounded-full overflow-hidden ${className}`}>
      <div 
        className={`h-full transition-all duration-500 ease-out ${indicatorColor}`} 
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }} 
      />
    </div>
  );
};

// --- SLIDER ---
interface SliderProps {
  value: number;
  onValueChange: (val: number) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({ value, onValueChange, min = 0, max = 100, step = 1, className = '' }) => {
  return (
    <input 
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onValueChange(Number(e.target.value))}
      className={`w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-trust-primary ${className}`}
    />
  );
};

// --- SKELETON ---
export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`bg-slate-200 animate-pulse rounded ${className}`} />
);

// --- SEPARATOR ---
export const Separator: React.FC<{ className?: string, orientation?: 'horizontal' | 'vertical' }> = ({ className = '', orientation = 'horizontal' }) => (
  <div className={`${orientation === 'horizontal' ? 'h-px w-full' : 'w-px h-full'} bg-slate-100 ${className}`} />
);

// --- INPUT ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input: React.FC<InputProps> = ({ label, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">{label}</label>}
      <input 
        className={`w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-trust-primary/20 focus:border-trust-primary outline-none transition-all placeholder:text-gray-300 ${className}`} 
        {...props} 
      />
    </div>
  );
};

// --- CHECKBOX ---
export const Checkbox: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className = '', ...props }) => (
  <input 
    type="checkbox" 
    className={`h-4 w-4 rounded border-gray-300 text-trust-primary focus:ring-trust-primary ${className}`} 
    {...props} 
  />
);

// --- TEXTAREA ---
interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({ label, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">{label}</label>}
      <textarea 
        className={`w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-trust-primary/20 focus:border-trust-primary outline-none transition-all placeholder:text-gray-300 ${className}`} 
        {...props} 
      />
    </div>
  );
};

// --- LABEL ---
export const Label: React.FC<React.LabelHTMLAttributes<HTMLLabelElement>> = ({ className = '', children, ...props }) => (
  <label className={`text-xs font-bold text-gray-500 uppercase ${className}`} {...props}>
    {children}
  </label>
);

// --- TABS (Simulated Shadcn) ---
interface TabsContextType {
  value: string;
  onValueChange: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextType | undefined>(undefined);

export const Tabs: React.FC<{ value: string, onValueChange: (value: string) => void, children: React.ReactNode, className?: string }> = ({ value, onValueChange, children, className = '' }) => (
  <TabsContext.Provider value={{ value, onValueChange }}>
    <div className={className}>{children}</div>
  </TabsContext.Provider>
);

export const TabsList: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => (
  <div className={`flex p-1 bg-slate-100 rounded-xl ${className}`}>
    {children}
  </div>
);

export const TabsTrigger: React.FC<{ value: string, children: React.ReactNode, className?: string }> = ({ value, children, className = '' }) => {
  const context = React.useContext(TabsContext);
  const isActive = context?.value === value;
  return (
    <button
      onClick={() => context?.onValueChange(value)}
      className={`
        flex-1 px-4 py-2 rounded-lg text-sm font-bold transition-all
        ${isActive ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export const TabsContent: React.FC<{ value: string, children: React.ReactNode }> = ({ value, children }) => {
  const context = React.useContext(TabsContext);
  if (context?.value !== value) return null;
  return <div className="mt-4 animate-in fade-in duration-200">{children}</div>;
};
