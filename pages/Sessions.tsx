
import React, { useState, useEffect } from 'react';
import { Session, SessionStatus, ContentStatus, StrategyCore, SessionItem, ContentPillar, PlanTier, GateContext } from '../types';
import { Button, Card, Badge, Progress, Slider, Input } from '../components/UI';
import { GateWrapper } from '../components/GateController';
import { 
  Plus, Calendar, Target, Zap, ArrowRight, Layout, 
  PlayCircle, Wand2, Layers, CheckCircle2, AlertTriangle, 
  ChevronRight, X, GripVertical, Sparkles, Clock, ArrowLeft,
  MoreHorizontal, Filter, Grid, Monitor, FileText, ChevronDown, ChevronUp, Copy, Trash2,
  BarChart3, Rocket
} from 'lucide-react';

interface SessionsProps {
  sessions: Session[];
  strategy: StrategyCore | null;
  planTier?: PlanTier;
  currentSessionsUsage?: number;
  onAddSession: (session: Session) => void;
  onViewDetail: (id: string) => void;
  onGateTrigger?: (ctx: GateContext) => void;
}

// --- TYPES FOR BUILDER ---
type BuilderStep = 'STRATEGY' | 'CALIBRATION' | 'MODULES';

type ProductionFlow = 'VISUAL' | 'TEXTUAL';

interface DraftModule {
  id: string;
  title: string;
  format: string;
  role: 'Atrair' | 'Educar' | 'Converter';
  framework?: string;
  flow: ProductionFlow;
  dateOffset: number;
  estimatedSlides?: number; // Only for VISUAL
  complexity: 'Baixa' | 'Média' | 'Alta';
}

// --- FRAMEWORK MAPPING ---
const FRAMEWORK_OPTIONS: Record<string, { id: string; name: string }[]> = {
  'Atrair': [
    { id: '4u', name: "4 U's (Headlines)" },
    { id: 'hero-journey', name: "Jornada do Herói" },
    { id: 'story-lesson', name: "Story-Lesson-CTA" },
    { id: 'inverted-pyramid', name: "Pirâmide Invertida" }
  ],
  'Educar': [
    { id: 'feynman', name: "Método Feynman" },
    { id: 'pcs', name: "Prob-Causa-Solução" },
    { id: 'insight', name: "Insight Proprietário" },
    { id: 'inverted-pyramid', name: "Pirâmide Invertida" }
  ],
  'Converter': [
    { id: 'aida', name: "AIDA" },
    { id: 'pas', name: "PAS (Prob-Agit-Sol)" },
    { id: 'bab', name: "Before-After-Bridge" },
    { id: 'case-study', name: "Estudo de Caso" }
  ]
};

// Fallback pillars if strategy is missing
const GENERIC_PILLARS: ContentPillar[] = [
  { id: 'gp1', name: 'Educacional', description: 'Ensine algo valioso para sua audiência.', objective: 'Autoridade', funnelRole: 'Meio' },
  { id: 'gp2', name: 'Inspiracional', description: 'Compartilhe bastidores e histórias.', objective: 'Conexão', funnelRole: 'Topo' },
  { id: 'gp3', name: 'Vendas', description: 'Oferta direta do seu produto ou serviço.', objective: 'Conversão', funnelRole: 'Fundo' },
];

export const Sessions: React.FC<SessionsProps> = ({ 
  sessions, strategy, planTier = PlanTier.FREE, currentSessionsUsage = 0, 
  onAddSession, onViewDetail, onGateTrigger 
}) => {
  const [viewMode, setViewMode] = useState<'LIST' | 'BUILDER'>('LIST');
  
  // Intro State
  const [showIntro, setShowIntro] = useState(() => {
    // Check local storage for persistence
    return typeof window !== 'undefined' ? localStorage.getItem('flui_sessions_intro') !== 'true' : true;
  });

  // Builder State
  const [step, setStep] = useState<BuilderStep>('STRATEGY');
  const [selectedPillar, setSelectedPillar] = useState<ContentPillar | null>(null);
  const [duration, setDuration] = useState<string>('15 Dias');
  const [intensity, setIntensity] = useState<'LEVE' | 'MODERADA' | 'INTENSIVA'>('MODERADA');
  const [draftModules, setDraftModules] = useState<DraftModule[]>([]);
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDismissIntro = (action: 'CREATE' | 'EXPLORE') => {
    localStorage.setItem('flui_sessions_intro', 'true');
    setShowIntro(false);
    if (action === 'CREATE') {
      setViewMode('BUILDER');
    }
  };

  // --- HELPERS ---
  const getProductionFlow = (format: string): ProductionFlow => {
    if (['Carrossel', 'OnePage'].includes(format)) return 'VISUAL';
    return 'TEXTUAL';
  };

  const getObjectiveColor = (role: string) => {
    switch(role) {
      case 'Atrair': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Educar': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Converter': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // --- LOGIC: COHERENCE ENGINE ---
  const getCoherenceStatus = () => {
    if (!selectedPillar || draftModules.length === 0) return { score: 0, status: 'NEUTRO', message: 'Aguardando definição.' };

    let score = 100;
    const roles = draftModules.map(m => m.role);
    const hasConversion = roles.includes('Converter');
    const hasAttraction = roles.includes('Atrair');
    
    // Check Goal Alignment
    if (strategy?.strategicPositioning.result.includes('Vendas') && !hasConversion) {
      score -= 30;
      return { score, status: 'ATENÇÃO', message: 'Seu objetivo é Vendas, mas não há peças de Conversão.' };
    }

    // Check Balance
    if (intensity === 'INTENSIVA' && draftModules.length < 5) {
      score -= 20;
      return { score, status: 'BAIXO', message: 'Intensidade alta requer mais volume de peças.' };
    }

    if (hasConversion && hasAttraction) {
      return { score: 95, status: 'FORTE', message: 'Plano bem equilibrado entre atração e conversão.' };
    }

    return { score: 80, status: 'BOM', message: 'Plano consistente com o pilar selecionado.' };
  };

  const coherence = getCoherenceStatus();

  // --- LOGIC: MOCK GENERATOR ---
  const generateDraftModules = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const baseCount = intensity === 'LEVE' ? 3 : (intensity === 'MODERADA' ? 6 : 10);
      const newModules: DraftModule[] = [];

      // Generate items based on selected pillar
      const topic = selectedPillar?.name || "Estratégia";
      
      for (let i = 0; i < baseCount; i++) {
        // Determine role logic
        const role = i === 0 ? 'Atrair' : (i === baseCount - 1 ? 'Converter' : 'Educar');
        const format = i % 2 === 0 ? 'Carrossel' : (i % 3 === 0 ? 'Reels' : 'Post');
        
        // Auto-assign appropriate framework based on role
        let suggestedFramework = '';
        if (role === 'Atrair') suggestedFramework = "4 U's (Headlines)";
        else if (role === 'Educar') suggestedFramework = "Insight Proprietário";
        else if (role === 'Converter') suggestedFramework = "AIDA";

        newModules.push({
          id: `draft-${i}`,
          title: i === 0 ? `Introdução a ${topic}` : (i === baseCount - 1 ? `Oferta Especial: ${topic}` : `Dica prática sobre ${topic} #${i}`),
          format: format,
          role: role,
          framework: suggestedFramework,
          flow: getProductionFlow(format),
          dateOffset: i * 2,
          estimatedSlides: getProductionFlow(format) === 'VISUAL' ? Math.floor(Math.random() * 5) + 5 : undefined,
          complexity: 'Média'
        });
      }
      setDraftModules(newModules);
      setIsGenerating(false);
      setStep('MODULES');
    }, 1500);
  };

  const handleFinish = () => {
    if (!selectedPillar) return;

    const newSession: Session = {
      id: `sess-${Date.now()}`,
      name: `${selectedPillar.name} [${duration}]`,
      objective: selectedPillar.objective,
      pillars: [selectedPillar.name],
      status: SessionStatus.ACTIVE,
      startDate: new Date().toLocaleDateString('pt-BR'),
      endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
      progress: 0,
      stats: {
        totalContents: draftModules.length,
        completedContents: 0
      },
      themes: [
        {
          id: 't-main',
          title: selectedPillar.name,
          focus: 'Principal',
          series: [{
            id: 's-main',
            title: 'Execução do Plano',
            items: draftModules.map(m => ({
              id: m.id,
              title: m.title,
              format: m.format,
              status: ContentStatus.TODO,
              pillar: selectedPillar.name,
              framework: m.framework
            }))
          }]
        }
      ]
    };

    onAddSession(newSession);
    setViewMode('LIST');
    // Reset
    setStep('STRATEGY');
    setDraftModules([]);
    onViewDetail(newSession.id);
  };

  // Intro Screen component for reuse
  const IntroScreen = () => (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8 animate-fade-in relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-trust-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-energy-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="max-w-5xl w-full text-center space-y-12 relative z-10">
        <div className="space-y-6">
           <div className="inline-flex items-center justify-center p-3 bg-white rounded-2xl shadow-sm border border-gray-100 mb-2">
              <Rocket className="h-8 w-8 text-trust-primary" />
           </div>
           <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 leading-tight max-w-4xl mx-auto">
             Autoridade não se constrói postando.<br/> Se constrói executando ciclos.
           </h1>
           <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
             Sessions organizam sua produção em ciclos estratégicos alinhados a um pilar.
           </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
           <Card className="p-8 border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
              <div className="h-14 w-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-trust-primary mb-6 group-hover:scale-110 transition-transform">
                 <Target className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Comece por um Pilar</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                 Cada Session nasce de um objetivo estratégico claro, não de uma "ideia aleatória".
              </p>
           </Card>
           <Card className="p-8 border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
              <div className="h-14 w-14 bg-purple-50 rounded-2xl flex items-center justify-center text-energy-primary mb-6 group-hover:scale-110 transition-transform">
                 <Calendar className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Defina um Ciclo</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                 Organize conteúdos em blocos de 7, 15 ou 30 dias para manter a consistência sem burnout.
              </p>
           </Card>
           <Card className="p-8 border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
              <div className="h-14 w-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform">
                 <BarChart3 className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Execute com Foco</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                 Produza, acompanhe e evolua dentro do mesmo ciclo. Foco gera momentum.
              </p>
           </Card>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
           <Button variant="gradient" size="lg" className="h-14 px-10 text-base shadow-xl hover:shadow-2xl font-bold" onClick={() => handleDismissIntro('CREATE')}>
              Criar minha primeira Session <ArrowRight className="ml-2 h-5 w-5"/>
           </Button>
           <Button variant="ghost" size="lg" className="h-14 px-8 text-gray-500 hover:text-gray-900" onClick={() => handleDismissIntro('EXPLORE')}>
              Explorar depois
           </Button>
        </div>
      </div>
    </div>
  );

  if (showIntro) return <IntroScreen />;

  // --- VIEW: LIST MODE ---
  if (viewMode === 'LIST') {
    return (
      <div className="max-w-7xl mx-auto px-8 py-8 h-full flex flex-col animate-fade-in">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight font-serif">Sessions</h1>
            <p className="text-gray-500 mt-1">Ciclos operacionais baseados na sua estratégia.</p>
          </div>
          <GateWrapper feature="maxSessions" currentPlan={planTier} usageMap={{ currentSessions: currentSessionsUsage || 0 }} showLock={true} onTrigger={onGateTrigger || console.log}>
            <Button variant="trust" onClick={() => setViewMode('BUILDER')}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Session
            </Button>
          </GateWrapper>
        </div>
        {sessions.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
             <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-6"><PlayCircle className="h-8 w-8 text-gray-400" /></div>
             <h3 className="text-xl font-bold text-gray-900 mb-2">Você ainda não iniciou nenhuma Session.</h3>
             <p className="text-gray-500 max-w-md text-center mb-8">Sessions são ciclos de execução onde sua estratégia se transforma em tarefas e conteúdo real.</p>
             <Button variant="trust" onClick={() => setViewMode('BUILDER')}>Criar minha primeira Session</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {sessions.map(session => (
               <div key={session.id} onClick={() => onViewDetail(session.id)} className="group bg-white rounded-xl border border-gray-200 p-6 cursor-pointer hover:shadow-hover hover:border-trust-primary/30 transition-all duration-300">
                  <div className="flex justify-between items-start mb-4">
                     <Badge variant={session.status === SessionStatus.ACTIVE ? 'trust' : 'secondary'}>{session.status}</Badge>
                     <span className="text-xs font-medium text-gray-400 flex items-center gap-1"><Calendar className="h-3 w-3" /> {session.endDate}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-trust-primary transition-colors line-clamp-1">{session.name}</h3>
                  <p className="text-xs text-gray-500 mb-6 flex items-center gap-1"><Target className="h-3 w-3" /> {session.objective}</p>
                  <div className="space-y-4">
                     <div>
                        <div className="flex justify-between text-xs mb-2">
                           <span className="text-gray-500 font-medium">Progresso</span>
                           <span className="text-gray-900 font-bold">{session.progress}%</span>
                        </div>
                        <Progress value={session.progress} className="h-1.5" indicatorColor="bg-trust-primary" />
                     </div>
                     <div className="flex justify-between items-center pt-4 border-t border-gray-100 text-sm">
                        <div className="flex gap-4"><span className="text-gray-600"><span className="font-bold text-gray-900">{session.stats.completedContents}</span>/{session.stats.totalContents} Feitos</span></div>
                        <div className="h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-trust-primary group-hover:text-white transition-colors text-gray-400"><ArrowRight className="h-4 w-4" /></div>
                     </div>
                  </div>
               </div>
             ))}
          </div>
        )}
      </div>
    );
  }

  // --- VIEW: BUILDER MODE ---
  const activePillars = strategy?.pillars && strategy.pillars.length > 0 ? strategy.pillars : GENERIC_PILLARS;
  const visualCount = draftModules.filter(m => m.flow === 'VISUAL').length;
  const textualCount = draftModules.filter(m => m.flow === 'TEXTUAL').length;
  const totalSlides = draftModules.reduce((acc, m) => acc + (m.estimatedSlides || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col animate-fade-in">
      <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setViewMode('LIST')}><X className="h-5 w-5 text-gray-500" /></Button>
          <div>
            <h2 className="text-lg font-bold text-gray-900 font-serif">Construtor de Session</h2>
            <div className="flex items-center gap-2 text-xs text-gray-500">
               <span className={step === 'STRATEGY' ? 'text-trust-primary font-bold' : ''}>1. Estratégia</span>
               <ChevronRight className="h-3 w-3" />
               <span className={step === 'CALIBRATION' ? 'text-trust-primary font-bold' : ''}>2. Calibragem</span>
               <ChevronRight className="h-3 w-3" />
               <span className={step === 'MODULES' ? 'text-trust-primary font-bold' : ''}>3. Módulos</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {step !== 'STRATEGY' && <Button variant="ghost" onClick={() => setStep(step === 'MODULES' ? 'CALIBRATION' : 'STRATEGY')}>Voltar</Button>}
          {step === 'MODULES' && <Button variant="trust" onClick={handleFinish}><CheckCircle2 className="h-4 w-4 mr-2" /> Confirmar e Criar</Button>}
        </div>
      </div>

      <div className="flex-1 max-w-6xl mx-auto w-full p-8">
        {step === 'STRATEGY' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-8">
            <div className="text-center mb-10">
              <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Qual frente estratégica ativar?</h1>
              <p className="text-gray-500">{strategy ? "Escolha um foco baseado nos seus pilares definidos no Studio." : "Selecione um foco para sua produção."}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {activePillars.map((pillar) => (
                <div key={pillar.id} onClick={() => { setSelectedPillar(pillar); setStep('CALIBRATION'); }} className="group bg-white p-6 rounded-xl border border-gray-200 cursor-pointer hover:border-trust-primary hover:shadow-lg transition-all relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-200 to-gray-300 group-hover:from-trust-primary group-hover:to-energy-primary transition-all" />
                  <Badge variant="secondary" className="mb-4">{pillar.funnelRole}</Badge>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{pillar.name}</h3>
                  <p className="text-sm text-gray-500 mb-6 line-clamp-3">{pillar.description}</p>
                  <div className="flex items-center text-trust-primary font-medium text-sm group-hover:translate-x-1 transition-transform">Ativar Frente <ArrowRight className="ml-2 h-4 w-4" /></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 'CALIBRATION' && selectedPillar && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-8">
             <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-lg flex items-center justify-between mb-8">
                <div className="flex items-center gap-3"><Badge variant="trust">{selectedPillar.name}</Badge><span className="text-sm text-indigo-900">Frente Estratégica Selecionada</span></div>
                <Button variant="ghost" size="sm" className="h-8 text-xs text-indigo-700" onClick={() => setStep('STRATEGY')}>Alterar</Button>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                   <h3 className="text-xl font-serif font-bold text-gray-900 mb-1">Janela de Tempo</h3>
                   <div className="space-y-3 mt-6">
                      {['7 Dias (Sprint)', '15 Dias (Ciclo)', '30 Dias (Campanha)'].map(d => (
                         <div key={d} onClick={() => setDuration(d)} className={`p-4 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${duration === d ? 'bg-white border-trust-primary ring-1 ring-trust-primary shadow-sm' : 'bg-white border-gray-200 hover:bg-gray-50'}`}><span className="font-medium text-gray-900">{d}</span>{duration === d && <CheckCircle2 className="h-5 w-5 text-trust-primary" />}</div>
                      ))}
                   </div>
                </div>
                <div>
                   <h3 className="text-xl font-serif font-bold text-gray-900 mb-1">Intensidade</h3>
                   <div className="grid grid-cols-3 gap-3 mt-6">
                      {[{ id: 'LEVE', label: 'Leve', count: '2-4 peças' }, { id: 'MODERADA', label: 'Moderada', count: '5-8 peças' }, { id: 'INTENSIVA', label: 'Intensiva', count: '9+ peças' }].map((lvl) => (
                         <div key={lvl.id} onClick={() => setIntensity(lvl.id as any)} className={`p-4 rounded-lg border cursor-pointer transition-all text-center flex flex-col items-center justify-center h-32 ${intensity === lvl.id ? 'bg-white border-energy-primary ring-1 ring-energy-primary shadow-sm' : 'bg-white border-gray-200 hover:bg-gray-50'}`}><Zap className={`h-6 w-6 mb-2 ${intensity === lvl.id ? 'text-energy-primary' : 'text-gray-300'}`} /><span className="font-bold text-gray-900 block">{lvl.label}</span><span className="text-xs text-gray-500 mt-1">{lvl.count}</span></div>
                      ))}
                   </div>
                </div>
             </div>
             <div className="pt-8 flex justify-end">
                <Button variant="gradient" size="lg" onClick={generateDraftModules} disabled={isGenerating}>
                  {isGenerating ? <><Sparkles className="h-4 w-4 mr-2 animate-pulse" /> Gerando Plano...</> : <>Gerar Sugestão de Plano <ArrowRight className="ml-2 h-4 w-4" /></>}
                </Button>
             </div>
          </div>
        )}

        {step === 'MODULES' && (
           <div className="animate-in fade-in slide-in-from-right-8 space-y-8">
              <div className="flex items-center justify-between">
                 <div><h3 className="text-xl font-bold text-gray-900 font-serif">Conteúdos que serão produzidos nesta Session</h3><p className="text-sm text-gray-500">Cada Session nasce de um objetivo estratégico claro.</p></div>
                 <div className="flex gap-4">
                    <div className="bg-blue-50 border border-blue-100 px-4 py-2 rounded-lg flex items-center gap-3"><div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600"><Monitor className="h-4 w-4" /></div><div><span className="block text-xs font-bold text-blue-800 uppercase tracking-wide">Produção Visual</span><span className="text-sm font-medium text-blue-900">{visualCount} Peças</span></div></div>
                    <div className="bg-gray-100 border border-gray-200 px-4 py-2 rounded-lg flex items-center gap-3"><div className="h-8 w-8 bg-white rounded-full flex items-center justify-center text-gray-600 border border-gray-200"><FileText className="h-4 w-4" /></div><div><span className="block text-xs font-bold text-gray-600 uppercase tracking-wide">Produção Textual</span><span className="text-sm font-medium text-gray-800">{textualCount} Peças</span></div></div>
                 </div>
              </div>
              <div className="grid grid-cols-12 gap-8">
                 <div className="col-span-12 lg:col-span-8 space-y-6">
                    <div className="space-y-4">
                       {draftModules.map((module, index) => {
                          const isExpanded = expandedModuleId === module.id;
                          const availableFrameworks = FRAMEWORK_OPTIONS[module.role] || [];
                          return (
                             <div key={module.id} className={`bg-white rounded-xl border transition-all duration-300 ${isExpanded ? 'border-trust-primary shadow-lg ring-1 ring-trust-primary/20' : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'}`}>
                                <div className="p-4 flex items-center gap-4 cursor-pointer" onClick={() => setExpandedModuleId(isExpanded ? null : module.id)}><div className="text-gray-300 cursor-move"><GripVertical className="h-5 w-5" /></div><div className="flex-1"><div className="flex items-center gap-2 mb-2"><span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${module.flow === 'VISUAL' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>{module.flow === 'VISUAL' ? <Monitor className="h-3 w-3" /> : <FileText className="h-3 w-3" />}{module.format}</span><span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${getObjectiveColor(module.role)}`}>{module.role}</span></div><div className="flex items-center justify-between"><h4 className="font-bold text-gray-900 text-sm">{module.title}</h4><div className="flex items-center gap-3 text-xs text-gray-500">{module.framework && <span className="flex items-center gap-1"><Layout className="h-3 w-3" /> {module.framework}</span>}{isExpanded ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}</div></div></div></div>
                                {isExpanded && (
                                   <div className="px-4 pb-4 pt-0 border-t border-gray-100 animate-in fade-in slide-in-from-top-2">
                                      <div className="space-y-4 mt-4 mb-4">
                                         <div><label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Título do Módulo</label><Input value={module.title} onChange={(e) => { const updated = [...draftModules]; updated[index].title = e.target.value; setDraftModules(updated); }} className="text-sm h-9" /></div>
                                         <div className="grid grid-cols-3 gap-2">
                                            <div><label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Formato</label><select className="w-full text-sm bg-white border border-gray-200 rounded px-2 h-9 text-gray-700 focus:ring-trust-primary" value={module.format} onChange={(e) => { const updated = [...draftModules]; updated[index].format = e.target.value; updated[index].flow = getProductionFlow(e.target.value); setDraftModules(updated); }}>{['Carrossel', 'OnePage', 'Reels', 'Post', 'Script'].map(f => <option key={f} value={f}>{f}</option>)}</select></div>
                                            <div><label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Objetivo</label><select className="w-full text-sm bg-white border border-gray-200 rounded px-2 h-9 text-gray-700 focus:ring-trust-primary" value={module.role} onChange={(e) => { const newRole = e.target.value as any; const updated = [...draftModules]; updated[index].role = newRole; updated[index].framework = FRAMEWORK_OPTIONS[newRole]?.[0]?.name || ''; setDraftModules(updated); }}>{['Atrair', 'Educar', 'Converter'].map(r => <option key={r} value={r}>{r}</option>)}</select></div>
                                            <div><label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Estrutura (Framework)</label><select className="w-full text-sm bg-white border border-gray-200 rounded px-2 h-9 text-gray-700 focus:ring-trust-primary" value={module.framework} onChange={(e) => { const updated = [...draftModules]; updated[index].framework = e.target.value; setDraftModules(updated); }}>{availableFrameworks.map(fw => <option key={fw.id} value={fw.name}>{fw.name}</option>)}</select></div>
                                         </div>
                                      </div>
                                      <div className="flex items-center justify-end gap-2 pt-2"><Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-900" onClick={() => { const newId = `dup-${Date.now()}`; const newModule = { ...module, id: newId, title: `${module.title} (Cópia)` }; const newModules = [...draftModules]; newModules.splice(index + 1, 0, newModule); setDraftModules(newModules); }}><Copy className="h-3 w-3 mr-2" /> Duplicar</Button><Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => setDraftModules(draftModules.filter(m => m.id !== module.id))}><Trash2 className="h-3 w-3 mr-2" /> Remover</Button></div>
                                   </div>
                                )}
                             </div>
                          );
                       })}
                    </div>
                 </div>
                 <div className="col-span-12 lg:col-span-4 space-y-6">
                    <div className={`rounded-xl border p-5 ${coherence.score > 80 ? 'bg-emerald-50/50 border-emerald-100' : 'bg-amber-50/50 border-amber-100'}`}><div className="flex items-center justify-between mb-2"><h4 className="font-bold text-gray-900 text-sm">Alinhamento Estratégico</h4><span className={`text-xs font-bold px-2 py-1 rounded ${coherence.score > 80 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{coherence.status}</span></div><p className="text-sm text-gray-600 mb-4">{coherence.message}</p><div className="w-full bg-white rounded-full h-1.5 overflow-hidden"><div className={`h-full transition-all duration-500 ${coherence.score > 80 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${coherence.score}%` }} /></div></div>
                    <Card><h4 className="font-bold text-gray-900 text-sm mb-4 uppercase tracking-wider text-xs text-gray-400">Resumo do Ciclo</h4><ul className="space-y-3 text-sm"><li className="flex justify-between border-b border-gray-100 pb-2"><span className="text-gray-500">Pilar Ativado</span><span className="font-medium text-gray-900 text-right max-w-[150px] truncate">{selectedPillar?.name}</span></li><li className="flex justify-between border-b border-gray-100 pb-2"><span className="text-gray-500">Janela</span><span className="font-medium text-gray-900">{duration}</span></li></ul><div className="mt-6"><Button variant="trust" className="w-full" onClick={handleFinish}>Confirmar e Criar Session</Button></div></Card>
                 </div>
              </div>
           </div>
        )}
      </div>
    </div>
  );
};
