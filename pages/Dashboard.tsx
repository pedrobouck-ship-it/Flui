
import React from 'react';
import { AppState, View, SessionStatus, GateContext } from '../types';
import { Button, Card, Badge, Progress } from '../components/UI';
import { UsageProgressBanner } from '../components/UsageProgressBanner';
import { 
  Sparkles, ArrowRight, Zap, TrendingUp, AlertCircle, 
  Bell, CheckCircle2, Layout, Calendar, Target 
} from 'lucide-react';

interface DashboardProps {
  state: AppState;
  onNavigate: (view: View) => void;
  onViewSession: (id: string) => void;
  onGateTrigger: (ctx: GateContext) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ state, onNavigate, onViewSession, onGateTrigger }) => {
  
  const activeSession = state.sessions.find(s => s.status === SessionStatus.ACTIVE);

  // Helpers for Momentum Color
  const getMomentumColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 50) return 'text-trust-primary';
    return 'text-amber-600';
  };

  const getMomentumGradient = (score: number) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 50) return 'bg-trust-primary';
    return 'bg-amber-500';
  };

  return (
    <div className="max-w-7xl mx-auto px-8 py-8 animate-fade-in">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
              <h1 className="text-4xl font-serif font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-500 mt-2 text-lg">Visão sistêmica da sua operação de conteúdo.</p>
          </div>
          <Button variant="gradient" onClick={() => onNavigate(View.SESSIONS)}>
              <Sparkles className="h-4 w-4 mr-2" />
              Novo Ciclo
          </Button>
      </div>

      {/* USAGE BANNER (Hybrid Logic) */}
      <UsageProgressBanner 
        currentPlan={state.planTier}
        monthlyUsed={state.usage.monthlyUsageCount}
        extraBalance={state.usage.extraCreditsBalance}
        onUpgrade={() => onGateTrigger({ 
           feature: 'monthlyCredits', 
           triggerType: 'LIMIT', 
           currentPlan: state.planTier 
         })}
      />

      {/* STRATEGY NUDGE (If missing) */}
      {!state.strategy && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center text-trust-primary shadow-sm">
                  <Sparkles className="h-5 w-5" />
               </div>
               <div>
                  <h3 className="font-bold text-gray-900 font-serif">Estratégia não configurada</h3>
                  <p className="text-sm text-gray-600">Para obter recomendações precisas da IA, defina seu arquétipo.</p>
               </div>
            </div>
            <Button variant="trust" size="sm" onClick={() => onNavigate(View.ONBOARDING)}>
               Configurar Agora <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
        </div>
      )}

      <div className="space-y-8">
        
        {/* ROW 1: MOMENTUM & ACTIVE SESSION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Momentum Card (Col 4) */}
          <Card className="lg:col-span-4 flex flex-col justify-between h-full relative overflow-hidden border-gray-200 shadow-sm">
             <div className="absolute top-0 right-0 p-4 opacity-5">
                <Zap className="h-32 w-32" />
             </div>
             
             <div>
               <div className="flex items-center gap-2 mb-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                 <TrendingUp className="h-4 w-4" /> Momentum Estratégico
               </div>
               <div className="flex items-baseline gap-2 mb-2">
                  <span className={`text-5xl font-serif font-bold ${getMomentumColor(state.momentumScore)}`}>
                     {state.momentumScore}
                  </span>
                  <span className="text-sm text-gray-400">/100</span>
               </div>
               <Progress 
                  value={state.momentumScore} 
                  className="h-2 mb-4" 
                  indicatorColor={getMomentumGradient(state.momentumScore)} 
               />
               <p className="text-sm text-gray-600 leading-relaxed">
                 {state.momentumScore > 70 
                   ? "Ritmo excelente. Sua consistência está gerando compounding effect na autoridade." 
                   : "Você está ganhando tração, mas precisa aumentar a frequência de entregas."}
               </p>
             </div>

             <div className="mt-8 pt-6 border-t border-gray-100">
                <h4 className="text-xs font-bold text-gray-900 mb-3 uppercase tracking-wide">Próximo Movimento</h4>
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => onNavigate(View.SESSIONS)}>
                   <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-energy-primary">
                         <Layout className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">Finalizar conteúdos pendentes</span>
                   </div>
                   <ArrowRight className="h-4 w-4 text-gray-400" />
                </div>
             </div>
          </Card>

          {/* Active Session Snapshot (Col 8) */}
          <div className="lg:col-span-8">
             <Card className="h-full border-gray-200 shadow-sm flex flex-col">
                <div className="flex items-center justify-between mb-6">
                   <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                      <Zap className="h-4 w-4 text-energy-primary" /> Session Ativa
                   </div>
                   {activeSession && (
                      <Badge variant="trust">Em Andamento</Badge>
                   )}
                </div>

                {activeSession ? (
                  <div className="flex-1 flex flex-col justify-between">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                        <div>
                           <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2">{activeSession.name}</h3>
                           <p className="text-gray-500 flex items-center gap-2 text-sm">
                             <Target className="h-4 w-4" /> Objetivo: {activeSession.objective}
                           </p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                           <div className="flex justify-between items-end mb-2">
                              <span className="text-sm text-gray-500 font-medium">Progresso Atual</span>
                              <span className="text-xl font-bold text-gray-900">{activeSession.progress}%</span>
                           </div>
                           <Progress value={activeSession.progress} indicatorColor="bg-energy-primary" />
                           <div className="mt-3 flex justify-between text-xs text-gray-500">
                              <span>{activeSession.stats.completedContents} finalizados</span>
                              <span>{activeSession.stats.totalContents} total</span>
                           </div>
                        </div>
                     </div>

                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-3 border border-gray-100 rounded-lg text-center">
                           <div className="text-xs text-gray-400 mb-1 font-bold uppercase">Fim do Ciclo</div>
                           <div className="font-bold text-gray-900">{activeSession.endDate}</div>
                        </div>
                        <div className="p-3 border border-gray-100 rounded-lg text-center">
                           <div className="text-xs text-gray-400 mb-1 font-bold uppercase">Status</div>
                           <div className="font-bold text-emerald-600">No Prazo</div>
                        </div>
                        <div className="col-span-2">
                           <Button className="w-full h-full" variant="trust" onClick={() => onViewSession(activeSession.id)}>
                              Continuar Produção <ArrowRight className="ml-2 h-4 w-4" />
                           </Button>
                        </div>
                     </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
                     <div className="h-12 w-12 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-400">
                        <Layout className="h-6 w-6" />
                     </div>
                     <h3 className="text-lg font-bold text-gray-900 mb-2 font-serif">Nenhuma session ativa</h3>
                     <p className="text-gray-500 max-w-sm mb-6">
                       Inicie um ciclo operacional para transformar estratégia em execução.
                     </p>
                     <Button variant="outline" onClick={() => onNavigate(View.SESSIONS)}>
                        Iniciar Nova Session
                     </Button>
                  </div>
                )}
             </Card>
          </div>
        </div>

        {/* ROW 2: RECOMMENDATIONS & NOTIFICATIONS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           
           {/* Recommendations (AI Loop) */}
           <Card>
              <div className="flex items-center gap-2 mb-6">
                 <Sparkles className="h-4 w-4 text-energy-primary" />
                 <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Recomendações da IA</h3>
              </div>

              <div className="space-y-4">
                 {state.recommendations.length > 0 ? (
                   state.recommendations.map(rec => (
                     <div key={rec.id} className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-lg flex items-start gap-4 hover:bg-indigo-50 transition-colors">
                        <div className="mt-1">
                           {rec.type === 'STRATEGY_DRIFT' && <AlertCircle className="h-5 w-5 text-amber-500" />}
                           {rec.type === 'PRODUCTION_PACE' && <Zap className="h-5 w-5 text-energy-primary" />}
                           {rec.type === 'QUALITY_CHECK' && <CheckCircle2 className="h-5 w-5 text-emerald-500" />}
                        </div>
                        <div className="flex-1">
                           <p className="text-sm text-gray-800 font-medium mb-3 leading-relaxed">
                             {rec.message}
                           </p>
                           <Button 
                             variant="ghost" 
                             size="sm" 
                             className="h-8 text-xs bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-100"
                             onClick={() => onNavigate(rec.targetView)}
                           >
                             {rec.actionLabel}
                           </Button>
                        </div>
                     </div>
                   ))
                 ) : (
                   <p className="text-gray-500 text-sm text-center py-8">
                     Tudo alinhado por enquanto. Continue produzindo.
                   </p>
                 )}
              </div>
           </Card>

           {/* Recent Notifications */}
           <Card>
              <div className="flex items-center justify-between mb-6">
                 <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-gray-400" />
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Atividade Recente</h3>
                 </div>
                 <Button variant="link" size="sm" onClick={() => onNavigate(View.NOTIFICATIONS)}>
                    Ver todas
                 </Button>
              </div>

              <div className="space-y-0 divide-y divide-gray-100">
                 {state.notifications.slice(0, 4).map(notif => (
                   <div key={notif.id} className="py-3 flex items-start gap-3">
                      <div className={`h-2 w-2 mt-2 rounded-full ${notif.isRead ? 'bg-gray-200' : 'bg-trust-primary'}`} />
                      <div>
                         <p className="text-sm text-gray-900 font-medium">{notif.title}</p>
                         <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{notif.message}</p>
                         <p className="text-[10px] text-gray-400 mt-1">{notif.createdAt}</p>
                      </div>
                   </div>
                 ))}
                 {state.notifications.length === 0 && (
                   <p className="text-gray-500 text-sm text-center py-8">
                     Nenhuma notificação recente.
                   </p>
                 )}
              </div>
           </Card>
        </div>

      </div>
    </div>
  );
};
