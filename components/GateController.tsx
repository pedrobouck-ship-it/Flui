
import React, { useState } from 'react';
import { Modal, Button, Badge, Progress } from './UI';
import { 
  Lock, Zap, CheckCircle2, ChevronRight, X, AlertCircle, 
  Sparkles, ShieldCheck, CreditCard, Rocket, Target, Star
} from 'lucide-react';
import { PlanTier, UserUsage, GateContext } from '../types';
import { CREDIT_PACKAGES, PLAN_DETAILS } from '../lib/plans';

// --- HYBRID UPGRADE / CREDIT MODAL ---
interface HybridUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  context: GateContext | null;
  usage: UserUsage;
  onUpgrade: (tier: PlanTier) => void;
  onPurchaseCredits: (amount: number) => void;
}

export const HybridUpgradeModal: React.FC<HybridUpgradeModalProps> = ({
  isOpen, onClose, context, usage, onUpgrade, onPurchaseCredits
}) => {
  if (!context) return null;

  const isFreePlan = usage.planTier === PlanTier.FREE;
  const showCreditPackages = usage.planTier !== PlanTier.FREE; // Only Growth/Pro can buy top-ups in this logic

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Expansion Required" maxWidth="3xl">
      <div className="flex flex-col lg:flex-row gap-8 py-2">
        
        {/* Left: Message & Feature context */}
        <div className="flex-1 space-y-6">
           <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100">
              <div className="h-10 w-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 shrink-0">
                 <Lock className="h-5 w-5" />
              </div>
              <div>
                 <h4 className="font-bold text-amber-900 text-sm">{context.title}</h4>
                 <p className="text-amber-700 text-xs mt-0.5">{context.message}</p>
              </div>
           </div>

           <div className="space-y-4">
              <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Available in Higher Tiers:</h5>
              <ul className="space-y-3">
                 {[
                   { icon: Sparkles, text: 'Geração profunda via Gemini 1.5 Pro', color: 'text-indigo-500' },
                   { icon: ShieldCheck, text: 'Análise de coerência estratégica em tempo real', color: 'text-emerald-500' },
                   { icon: Target, text: 'Custom blueprints (Unlimited)', color: 'text-amber-500' },
                   { icon: Rocket, text: 'Priority Processing', color: 'text-blue-500' },
                 ].map((feat, i) => (
                   <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                      <feat.icon className={`h-4 w-4 mt-0.5 ${feat.color}`} />
                      <span>{feat.text}</span>
                   </li>
                 ))}
              </ul>
           </div>

           {/* Current Usage Status */}
           <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex justify-between items-center mb-2">
                 <span className="text-xs font-bold text-gray-500 uppercase">Monthly Usage</span>
                 <span className="text-xs font-bold text-gray-700">{usage.monthlyUsageCount} / {usage.monthlyLimit}</span>
              </div>
              <Progress value={(usage.monthlyUsageCount / usage.monthlyLimit) * 100} className="h-1.5 bg-gray-200" />
              {usage.extraCreditsBalance > 0 && (
                <p className="text-[10px] text-emerald-600 font-medium mt-2 flex items-center gap-1">
                   <Zap className="h-3 w-3" /> {usage.extraCreditsBalance} extra credits available
                </p>
              )}
           </div>
        </div>

        {/* Right: Path Selection */}
        <div className="w-full lg:w-80 space-y-6">
           
           {/* Tier Upgrade Option */}
           <div className="space-y-3">
              <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Upgrade Your Plan</h5>
              <Card className="hover:border-trust-primary cursor-pointer transition-all border-2 border-gray-100 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 bg-trust-primary text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">
                    RECOMMENDED
                 </div>
                 <h6 className="font-bold text-gray-900">Growth Tier</h6>
                 <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-black text-gray-900">R$ 147</span>
                    <span className="text-xs text-gray-500">/mês</span>
                 </div>
                 <p className="text-xs text-gray-500 mt-2 mb-4">50 créditos mensais + Blueprints avançados + Pulse Trends.</p>
                 <Button className="w-full" onClick={() => onUpgrade(PlanTier.GROWTH)}>Ativar Agora</Button>
              </Card>
           </div>

           {/* One-time Top-ups (Only for paid plans) */}
           {showCreditPackages && (
              <div className="space-y-3">
                 <div className="flex items-center gap-2">
                    <div className="h-px flex-1 bg-gray-200" />
                    <span className="text-[10px] font-bold text-gray-400 uppercase">or buy top-ups</span>
                    <div className="h-px flex-1 bg-gray-200" />
                 </div>
                 <div className="space-y-2">
                    {CREDIT_PACKAGES.map((pkg) => (
                       <div 
                         key={pkg.id}
                         onClick={() => onPurchaseCredits(pkg.credits)}
                         className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-trust-primary hover:bg-trust-primary/5 cursor-pointer transition-all bg-white shadow-sm"
                       >
                          <div className="flex items-center gap-3">
                             <div className="h-2 w-2 rounded-full bg-energy-primary animate-pulse" />
                             <div>
                                <p className="text-xs font-bold text-gray-900">{pkg.credits} Créditos</p>
                                <p className="text-[10px] text-gray-500">Saldo vitalício</p>
                             </div>
                          </div>
                          <span className="text-sm font-bold text-trust-primary">R$ {pkg.price}</span>
                       </div>
                    ))}
                 </div>
              </div>
           )}

        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
         <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Compra segura via Stripe
         </div>
         <div className="flex gap-4 underline">
            <a href="#" className="hover:text-gray-600">Privacy Policy</a>
            <a href="#" className="hover:text-gray-600">Terms of Service</a>
         </div>
      </div>
    </Modal>
  );
};

// --- GATE WRAPPER (HOC Pattern) ---
interface GateWrapperProps {
  children: React.ReactNode;
  isLocked: boolean;
  featureName: string;
  onTrigger: () => void;
  variant?: 'blur' | 'overlay' | 'silent';
}

export const GateWrapper: React.FC<GateWrapperProps> = ({ children, isLocked, featureName, onTrigger, variant = 'blur' }) => {
  if (!isLocked) return <>{children}</>;

  if (variant === 'silent') {
    return (
      <div className="relative group/gate cursor-not-allowed">
        <div className="opacity-40 pointer-events-none grayscale">
          {children}
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/gate:opacity-100 transition-opacity">
           <Button variant="outline" size="sm" className="bg-white/90 backdrop-blur-sm shadow-xl" onClick={onTrigger}>
              <Lock className="h-3 w-3 mr-2 text-amber-500" /> Liberar {featureName}
           </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-xl overflow-hidden group/gate">
      {/* Blurred Content */}
      <div className="filter blur-sm grayscale opacity-30 select-none pointer-events-none transition-all duration-500 group-hover/gate:blur-md">
        {children}
      </div>
      
      {/* Overlay UI */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-slate-900/5 backdrop-blur-[1px]">
        <div className="scale-110 mb-2">
           <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center text-trust-primary shadow-lg border border-gray-100 ring-4 ring-trust-primary/5">
              <Lock className="h-5 w-5" />
           </div>
        </div>
        <h4 className="text-sm font-bold text-slate-800 text-center mb-1">{featureName} Bloqueado</h4>
        <p className="text-[11px] text-gray-500 text-center mb-4 max-w-[200px]">
          Seu plano atual não inclui este recurso avançado.
        </p>
        <Button 
          variant="gradient" 
          size="sm" 
          className="shadow-xl"
          onClick={onTrigger}
        >
           Fazer Upgrade <Sparkles className="h-3 w-3 ml-2" />
        </Button>
      </div>
    </div>
  );
};
