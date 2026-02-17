
import React from 'react';
import { Progress, Button } from './UI';
import { Zap, Sparkles, TrendingUp, ArrowUpRight } from 'lucide-react';
import { UserUsage } from '../types';

interface UsageProgressBannerProps {
  usage: UserUsage;
  onUpgrade: () => void;
}

export const UsageProgressBanner: React.FC<UsageProgressBannerProps> = ({ usage, onUpgrade }) => {
  const percentage = (usage.monthlyUsageCount / usage.monthlyLimit) * 100;
  const isHighUsage = percentage > 80;
  
  return (
    <div className={`p-5 rounded-2xl border transition-all duration-500 overflow-hidden relative group
      ${isHighUsage 
        ? 'bg-amber-50 border-amber-100 shadow-amber-900/5' 
        : 'bg-white border-slate-100 shadow-sm hover:shadow-md hover:border-trust-primary/20'}
    `}>
      {/* Background Micro-pattern */}
      <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
        <TrendingUp className="h-20 w-20" />
      </div>

      <div className="relative z-10">
        <div className="flex justify-between items-center mb-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase flex items-center gap-1.5">
              Uso Mensal de Créditos
              {isHighUsage && <Sparkles className="h-3 w-3 text-energy-primary animate-pulse" />}
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl font-black text-slate-900">{usage.monthlyUsageCount}</span>
              <span className="text-xs font-bold text-slate-400">/ {usage.monthlyLimit}</span>
            </div>
          </div>
          
          <Button 
            variant={isHighUsage ? "energy" : "ghost"} 
            size="sm" 
            className={`h-8 text-[11px] font-bold ${!isHighUsage && 'text-trust-primary bg-indigo-50 hover:bg-indigo-100'}`}
            onClick={onUpgrade}
          >
            {isHighUsage ? 'Adquirir Mais' : 'Upgrade Plan'}
            <ArrowUpRight className="ml-1.5 h-3 w-3" />
          </Button>
        </div>

        <Progress 
          value={percentage} 
          className={`h-2 !bg-slate-100 rounded-full`}
        />

        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center gap-2">
            <div className={`h-1.5 w-1.5 rounded-full ${isHighUsage ? 'bg-energy-primary animate-ping' : 'bg-trust-primary'}`} />
            <p className="text-[11px] font-medium text-slate-500">
              {isHighUsage ? 'Uso intenso detectado' : 'Consumo sob controle'}
            </p>
          </div>
          
          {usage.extraCreditsBalance > 0 && (
            <div className="bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 flex items-center gap-1.5 shadow-sm">
              <Zap className="h-3 w-3 text-emerald-500" />
              <span className="text-[10px] font-bold text-emerald-700">+{usage.extraCreditsBalance} Extras</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
