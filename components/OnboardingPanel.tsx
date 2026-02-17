
import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Progress } from './UI';
import { 
  Rocket, Lightbulb, User, Target, CheckCircle2, 
  ChevronRight, X, Sparkles, MessageSquare, Plus,
  Layout, Settings, Users, Compass, ExternalLink,
  ChevronLeft
} from 'lucide-react';
import { OnboardingStep } from '../hooks/useOnboarding';

interface OnboardingPanelProps {
  isOpen: boolean;
  onClose: () => void;
  steps: OnboardingStep[];
  currentStepIndex: number;
  onSelectStep: (index: number) => void;
  completedSteps: string[];
}

export const OnboardingPanel: React.FC<OnboardingPanelProps> = ({
  isOpen, onClose, steps, currentStepIndex, onSelectStep, completedSteps
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  
  if (!isOpen) return null;

  const progress = (completedSteps.length / steps.length) * 100;
  const currentStep = steps[currentStepIndex];

  return (
    <div className={`
      fixed bottom-6 right-6 z-[100] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
      ${isMinimized ? 'w-16 h-16 rounded-full' : 'w-[400px] h-[600px] md:h-[680px] rounded-3xl'}
      bg-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] border border-gray-100 flex flex-col overflow-hidden
    `}>
      {/* Header */}
      <div className="p-6 pb-4 border-b border-gray-50 bg-gradient-to-br from-trust-primary/5 to-transparent relative">
         <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
               <div className="h-2 w-2 rounded-full bg-trust-primary animate-pulse" />
               <h3 className="font-black text-slate-900 text-sm uppercase tracking-widest">Mastering Flui</h3>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white hover:shadow-sm text-gray-400 hover:text-gray-600 transition-all border border-transparent hover:border-gray-100"
            >
               <X className="h-4 w-4" />
            </button>
         </div>
         
         {!isMinimized && (
           <div className="animate-in fade-in slide-in-from-top-1 duration-300">
              <div className="flex justify-between items-end mb-1.5">
                 <span className="text-[10px] font-bold text-trust-primary uppercase">{progress.toFixed(0)}% Concluído</span>
                 <span className="text-[10px] text-gray-400 font-medium">{completedSteps.length} de {steps.length} passos</span>
              </div>
              <Progress value={progress} className="h-1.5 bg-gray-100" />
           </div>
         )}
      </div>

      {/* Steps List (Horizontal Mini) */}
      <div className="flex px-4 py-3 gap-1.5 border-b border-gray-50 overflow-x-auto no-scrollbar">
         {steps.map((step, i) => {
            const isCompleted = completedSteps.includes(step.id);
            const isCurrent = i === currentStepIndex;
            return (
               <button 
                 key={step.id}
                 onClick={() => onSelectStep(i)}
                 className={`
                    h-2 rounded-full transition-all duration-300 shrink-0
                    ${isCurrent ? 'w-8 bg-trust-primary' : isCompleted ? 'w-4 bg-emerald-400' : 'w-4 bg-gray-200'}
                 `}
               />
            );
         })}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar bg-slate-50/50">
         
         {/* Step Details */}
         <div className="p-6 space-y-6">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="h-12 w-12 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-trust-primary mb-4 ring-4 ring-trust-primary/5">
                  {React.createElement(currentStep.icon, { className: "h-6 w-6" })}
               </div>
               <h2 className="text-xl font-black text-slate-900 leading-tight mb-2">{currentStep.title}</h2>
               <p className="text-sm text-slate-600 leading-relaxed">{currentStep.description}</p>
            </div>

            {/* Actions / Tasks for this step */}
            <div className="space-y-3">
               <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Próximas Ações</h4>
               {currentStep.actions.map((action, i) => (
                  <div 
                    key={i}
                    className="group flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 hover:border-trust-primary/30 hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
                  >
                     <div className="flex items-center gap-3">
                        <div className="h-6 w-6 rounded-full border-2 border-slate-100 flex items-center justify-center group-hover:border-trust-primary/30 group-hover:bg-trust-primary/5 transition-all">
                           <div className="h-2 w-2 rounded-full bg-slate-100 group-hover:bg-trust-primary/40" />
                        </div>
                        <span className="text-sm font-bold text-slate-800">{action.label}</span>
                     </div>
                     <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-trust-primary group-hover:translate-x-1 transition-all" />
                  </div>
               ))}
            </div>

            {/* AI Insight Box for the step */}
            <div className="bg-indigo-950 rounded-2xl p-5 text-white relative overflow-hidden group shadow-xl">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Sparkles className="h-12 w-12" />
               </div>
               <div className="flex items-center gap-2 mb-2">
                  <Badge variant="energy" className="h-5 px-1.5 text-[8px] uppercase">Flui AI Insight</Badge>
               </div>
               <p className="text-xs text-indigo-100 leading-relaxed font-medium">
                  “Dominar este passo reduz seu tempo de iteração em até 40% usando nossos novos blueprints de Gemini Flash.”
               </p>
            </div>
         </div>
      </div>

      {/* Footer / Navigation */}
      <div className="p-6 border-t border-gray-50 bg-white flex items-center justify-between gap-4">
         <Button 
            variant="ghost" 
            size="sm" 
            className="text-gray-400 hover:text-slate-900"
            disabled={currentStepIndex === 0}
            onClick={() => onSelectStep(currentStepIndex - 1)}
         >
            <ChevronLeft className="h-4 w-4 mr-1" /> Voltar
         </Button>

         {currentStepIndex < steps.length - 1 ? (
            <Button 
               variant="gradient" 
               className="flex-1 shadow-lg shadow-trust-primary/20"
               onClick={() => onSelectStep(currentStepIndex + 1)}
            >
               Próximo Passo <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
         ) : (
            <Button 
               variant="trust" 
               className="flex-1 shadow-lg shadow-emerald-500/20 bg-emerald-500 hover:bg-emerald-600 border-none"
               onClick={onClose}
            >
               Concluir Tour <CheckCircle2 className="h-4 w-4 ml-1" />
            </Button>
         )}
      </div>

      {/* Mobile Backdrop for when open on small screens */}
      {/* (In a real app, logic would adjust this box for mobile, here we just keep it beautiful) */}
    </div>
  );
};
