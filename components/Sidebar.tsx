
import React, { useState } from 'react';
import { View } from '../types';
import { 
  LayoutDashboard, Compass, Zap, LogOut, Grid, Activity, 
  User, CreditCard, ChevronLeft, ChevronRight, Command,
  Menu, X, Sparkles, Settings
} from 'lucide-react';
import { Logo } from './Logo';

interface SidebarProps {
  currentView: View;
  onChangeView: (view: View) => void;
  strategyExists: boolean;
  onLogout: () => void;
  credits: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentView, 
  onChangeView, 
  strategyExists, 
  onLogout,
  credits
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleNavigation = (view: View) => {
    onChangeView(view);
    setIsMobileOpen(false); // Close mobile menu on navigation
  };

  const NavItem = ({ view, icon: Icon, label, disabled }: { view: View, icon: any, label: string, disabled?: boolean }) => {
    const isActive = currentView === view;
    return (
      <button
        onClick={() => !disabled && handleNavigation(view)}
        disabled={disabled}
        title={isCollapsed ? label : ""}
        className={`
          group relative w-full flex items-center gap-3 px-3 py-2.5 my-0.5 rounded-lg transition-all duration-200
          ${isActive ? 'bg-trust-primary text-white shadow-lg shadow-trust-primary/20' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-100'}
          ${disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
          ${isCollapsed ? 'lg:justify-center lg:px-0 lg:mx-auto lg:w-10' : ''}
        `}
      >
        <Icon className={`shrink-0 transition-transform duration-200 ${isCollapsed ? 'lg:h-5 lg:w-5' : 'h-4 w-4'} ${!isActive && 'group-hover:scale-110'}`} strokeWidth={isActive ? 2.5 : 1.8} />
        <span className={`text-sm font-medium transition-opacity duration-300 ${isCollapsed ? 'lg:hidden' : 'block'} ${isActive ? 'opacity-100' : 'opacity-90'}`}>
          {label}
        </span>
        
        {isActive && <div className={`absolute left-0 w-1 h-4 bg-white rounded-r-full block`} />}
        
        {/* Tooltip for collapsed state */}
        {isCollapsed && (
          <div className="hidden lg:block absolute left-full ml-4 px-2 py-1 bg-slate-900 text-white text-[11px] font-bold rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-xl border border-slate-700">
            {label}
          </div>
        )}
      </button>
    );
  };

  return (
    <>
      {/* Mobile Trigger Header */}
      <div className="lg:hidden fixed top-0 left-0 p-4 z-40 w-full bg-white/80 backdrop-blur-sm border-b border-gray-200 flex items-center justify-between">
        <button 
          onClick={() => setIsMobileOpen(true)}
          className="p-2 rounded-md text-gray-600 hover:bg-gray-100 border border-gray-200 shadow-sm"
        >
          <Menu className="h-6 w-6" />
        </button>
        <Logo className="h-6 w-auto text-slate-900" />
        <div className="w-10"></div> {/* Spacer */}
      </div>

      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 lg:hidden animate-in fade-in duration-200"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div className={`
        flex flex-col bg-slate-950 h-full fixed inset-y-0 left-0 z-[60] border-r border-slate-900 shadow-2xl transition-[width,transform] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        w-[280px] ${isCollapsed ? 'lg:w-[72px]' : 'lg:w-[260px]'}
      `}>
        
        {/* Mobile Close Header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-slate-900">
           <Logo className="h-6 w-auto text-white" />
           <button onClick={() => setIsMobileOpen(false)} className="text-slate-400 hover:text-white p-2">
              <X className="h-6 w-6" />
           </button>
        </div>

        {/* Desktop Brand Header */}
        <div className={`hidden lg:flex items-center px-6 h-20 shrink-0 ${isCollapsed ? 'justify-center px-0' : 'justify-between'}`}>
           {!isCollapsed && <Logo className="h-8 w-auto text-white" />}
           <button 
             onClick={() => setIsCollapsed(!isCollapsed)}
             className={`p-1.5 rounded-lg border border-slate-800 text-slate-500 hover:bg-slate-900 hover:text-white transition-all`}
           >
             {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
           </button>
        </div>

        {/* Navigation Area */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6 no-scrollbar">
           
           {/* Main Section */}
           <div>
              {!isCollapsed && <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 pl-3">Navegação</p>}
              <div className="space-y-1">
                 <NavItem icon={LayoutDashboard} label="Dashboard" view={View.DASHBOARD} />
                 <NavItem icon={Compass} label="Pulse Trends" view={View.PULSE} />
              </div>
           </div>

           {/* Production Section */}
           <div>
              {!isCollapsed && (
                 <div className="flex items-center justify-between mb-3 pl-3">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Estúdio</p>
                    <Badge variant="trust" className="h-4 px-1 text-[8px] animate-pulse">PRO</Badge>
                 </div>
              )}
              <div className="space-y-1">
                 <NavItem icon={Zap} label="Strategy Studio" view={View.STRATEGY} />
                 <NavItem icon={Grid} label="Blueprints" view={View.BLUEPRINTS} disabled={!strategyExists} />
                 <NavItem icon={Activity} label="Sessions" view={View.SESSIONS} disabled={!strategyExists} />
                 <NavItem icon={Sparkles} label="Visual Studio" view={View.VISUAL_STUDIO} disabled={!strategyExists} />
              </div>
           </div>

           {/* Account Section */}
           <div>
              {!isCollapsed && <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 pl-3">Sistema</p>}
              <div className="space-y-1">
                 <NavItem icon={User} label="Perfil de Marca" view={View.PROFILE} />
                 <NavItem icon={CreditCard} label="Plano & Créditos" view={View.PRICING} />
              </div>
           </div>
        </div>

        {/* Footer Area */}
        <div className="p-4 border-t border-slate-900 space-y-2">
           
           {/* Credits Quick View */}
           {!isCollapsed && (
              <div className="mb-4 p-4 bg-slate-900/50 rounded-xl border border-slate-800/50">
                 <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold text-slate-500">CRÉDITOS</span>
                    <span className="text-[10px] font-bold text-indigo-400">{credits}</span>
                 </div>
                 <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 w-[65%]" />
                 </div>
              </div>
           )}

           <button 
             onClick={onLogout}
             className={`
               w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all
               ${isCollapsed ? 'lg:justify-center lg:px-0' : ''}
             `}
           >
             <LogOut className="h-4 w-4" />
             {!isCollapsed && <span className="text-sm font-medium">Sair da conta</span>}
           </button>
        </div>

      </div>
    </>
  );
};
