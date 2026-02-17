
import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Input, Modal, Separator } from '../components/UI';
import { 
  Activity, Radio, TrendingUp, Zap, Plus, Trash2, Globe, 
  ArrowRight, CheckCircle2, AlertCircle, RefreshCw, MoreHorizontal,
  Layout, Target, Layers, FileText, Loader2, PlayCircle, X, ShieldAlert,
  Link, Sparkles, ScanLine
} from 'lucide-react';
import { View } from '../types';

// --- TYPES ---

interface PulseSource {
  id: string;
  url: string;
  status: 'valid' | 'error' | 'pending';
}

interface PulseTopic {
  id: string;
  title: string;
  summary: string;
  source_domain: string;
  source_url: string;
  published_at: string;
  strategic_score: number;
  status: 'NEW' | 'SELECTED' | 'DISCARDED';
  ai_payload: {
    suggested_format: string;
    suggested_pillar: string;
    recommended_framework: string;
  };
}

interface PreviewData {
  title: string;
  hook: string;
  structure: string[];
  cta: string;
  session_objective: string;
}

interface PulseProps {
  niche?: string;
  onNavigate: (view: View) => void;
  onCreateContent: (topicId: string) => void;
}

// --- MOCK DATA FOR DEMO ---
const MOCK_TOPICS: PulseTopic[] = [
  {
    id: 't1',
    title: 'The Rise of "Boring" Marketing in SaaS',
    summary: 'Why technical founders are winning by focusing on unsexy, problem-aware content instead of viral trends.',
    source_domain: 'techcrunch.com',
    source_url: 'https://techcrunch.com',
    published_at: 'Hoje, 09:00',
    strategic_score: 92,
    status: 'NEW',
    ai_payload: {
      suggested_format: 'Artigo',
      suggested_pillar: 'Autoridade Técnica',
      recommended_framework: 'Insight Proprietário'
    }
  },
  {
    id: 't2',
    title: 'AI Regulation: What EU Act means for Solo Creators',
    summary: 'New transparency rules might force creators to disclose AI usage. Opportunity to pivot to "Human-Only" branding.',
    source_domain: 'theverge.com',
    source_url: 'https://theverge.com',
    published_at: 'Ontem',
    strategic_score: 85,
    status: 'NEW',
    ai_payload: {
      suggested_format: 'Carrossel',
      suggested_pillar: 'Opinião Forte',
      recommended_framework: 'Prob-Causa-Solução'
    }
  },
  {
    id: 't3',
    title: 'LinkedIn Algorithm Update: Dwell Time is Back',
    summary: 'Comments are less important than time spent reading. Long-form posts are seeing a 40% reach increase.',
    source_domain: 'socialmediatoday.com',
    source_url: 'https://socialmediatoday.com',
    published_at: 'Há 4 horas',
    strategic_score: 78,
    status: 'NEW',
    ai_payload: {
      suggested_format: 'Post Texto',
      suggested_pillar: 'Estratégia',
      recommended_framework: 'AIDA'
    }
  }
];

export const Pulse: React.FC<PulseProps> = ({ niche, onNavigate, onCreateContent }) => {
  // --- STATE ---
  const [viewState, setViewState] = useState<'ONBOARDING' | 'SETUP' | 'RADAR'>('ONBOARDING');
  const [sources, setSources] = useState<PulseSource[]>([
    { id: 's1', url: '', status: 'pending' },
    { id: 's2', url: '', status: 'pending' },
    { id: 's3', url: '', status: 'pending' }
  ]);
  const [isActivating, setIsActivating] = useState(false);
  const [activationError, setActivationError] = useState<string | null>(null);
  
  // Radar State
  const [topics, setTopics] = useState<PulseTopic[]>([]);
  const [isLoadingTopics, setIsLoadingTopics] = useState(false);
  
  // Preview State
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);

  // Check initial sources to decide view
  useEffect(() => {
    const validSources = sources.filter(s => s.status === 'valid').length;
    if (validSources >= 3) {
      setViewState('RADAR');
    }
  }, []);

  // --- HELPERS ---

  const normalizeUrl = (url: string) => {
    if (!url) return '';
    if (!/^https?:\/\//i.test(url)) {
      return `https://${url}`;
    }
    return url;
  };

  const validateUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    if (score >= 70) return 'bg-trust-bg text-trust-primary border-trust-primary/20';
    return 'bg-amber-100 text-amber-700 border-amber-200';
  };

  // --- HANDLERS: SOURCES ---

  const handleUrlChange = (id: string, value: string) => {
    setActivationError(null);
    setSources(prev => prev.map(s => {
      if (s.id === id) {
        // Optimistic validation with auto-correction logic visualization
        const normalized = normalizeUrl(value);
        const isValid = validateUrl(normalized);
        return { ...s, url: value, status: isValid ? 'valid' : (value.length > 3 ? 'error' : 'pending') };
      }
      return s;
    }));
  };

  const handleBlurUrl = (id: string) => {
    setSources(prev => prev.map(s => {
      if (s.id === id && s.url.trim()) {
        const normalized = normalizeUrl(s.url);
        return { ...s, url: normalized, status: validateUrl(normalized) ? 'valid' : 'error' };
      }
      return s;
    }));
  };

  const addSourceSlot = () => {
    if (sources.length < 5) {
      setSources([...sources, { id: `s${Date.now()}`, url: '', status: 'pending' }]);
    }
  };

  const removeSourceSlot = (id: string) => {
    if (sources.length > 3) {
      setSources(sources.filter(s => s.id !== id));
    } else {
      // If min 3, just clear the value
      setSources(sources.map(s => s.id === id ? { ...s, url: '', status: 'pending' } : s));
    }
  };

  const handleActivateMonitoring = () => {
    setActivationError(null);
    setIsActivating(true);
    
    // 1. Normalize all inputs first
    const normalizedSources = sources.map(s => {
      const normalized = normalizeUrl(s.url);
      return { ...s, url: normalized, status: validateUrl(normalized) ? 'valid' : 'error' };
    }) as PulseSource[]; 

    setSources(normalizedSources);

    // 2. Validate
    const validSources = normalizedSources.filter(s => s.status === 'valid');
    const validUrls = validSources.map(s => s.url);
    const uniqueUrls = new Set(validUrls);
    
    if (validSources.length < 3) {
      setIsActivating(false);
      setActivationError(`Precisamos de no mínimo 3 fontes válidas para iniciar. Você forneceu ${validSources.length}.`);
      return;
    }

    if (uniqueUrls.size !== validUrls.length) {
      setIsActivating(false);
      setActivationError("Existem URLs duplicadas. Por favor, diversifique suas fontes.");
      return;
    }

    // SIMULATE EXTERNAL SERVICE CALL
    console.log("POST /api/external/pulse/track", {
      workspace_id: 'current-workspace',
      sources: validUrls
    });

    setTimeout(() => {
      setIsActivating(false);
      setViewState('RADAR');
      loadTopics(); // Simulate webhook arrival
    }, 1500);
  };

  // --- HANDLERS: RADAR ---

  const loadTopics = () => {
    setIsLoadingTopics(true);
    // Simulate Daily Process Fetch
    setTimeout(() => {
      setTopics(MOCK_TOPICS);
      setIsLoadingTopics(false);
    }, 1000);
  };

  const handleDiscard = (id: string) => {
    setTopics(prev => prev.filter(t => t.id !== id));
  };

  const handleGeneratePreview = (topic: PulseTopic) => {
    setSelectedTopicId(topic.id);
    setIsPreviewLoading(true);

    // SIMULATE EXTERNAL PREVIEW GENERATION
    console.log("POST /api/external/pulse/preview", {
      workspace_id: 'current-workspace',
      topic_id: topic.id,
      format: topic.ai_payload.suggested_format
    });

    setTimeout(() => {
      setPreviewData({
        title: topic.title,
        hook: `Você está ignorando o ${topic.title.split(':')[0]}? Grande erro.`,
        structure: [
          "Contexto: O mercado mudou drasticamente.",
          "Problema: Quem ignora isso perde relevância.",
          "Insight: " + topic.summary,
          "Aplicação: Como aplicar isso no seu negócio hoje."
        ],
        cta: "Comente 'TREND' para receber o relatório completo.",
        session_objective: "Autoridade de Mercado"
      });
      setIsPreviewLoading(false);
    }, 2000);
  };

  const confirmContentCreation = () => {
    if (selectedTopicId) {
      onCreateContent(selectedTopicId);
      setPreviewData(null); // Close modal
    }
  };

  // --- RENDERERS ---

  if (viewState === 'ONBOARDING') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8 animate-fade-in relative overflow-hidden">
        {/* Decorative BG */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-trust-primary/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-energy-primary/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-5xl w-full text-center space-y-12 relative z-10">
          
          {/* Header */}
          <div className="space-y-6">
             <Badge variant="trust" className="mb-2 px-4 py-1 text-xs">Novo Módulo</Badge>
             <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 leading-tight">
               Seu radar estratégico de oportunidades
             </h1>
             <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
               Monitore o mercado e transforme sinais em conteúdo de autoridade sem esforço.
             </p>
          </div>
  
          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
             <Card className="p-8 border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                <div className="h-12 w-12 bg-indigo-50 rounded-xl flex items-center justify-center text-trust-primary mb-6">
                   <Link className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Conecte suas fontes</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                   Adicione de 3 a 5 portais estratégicos, blogs ou newsletters que você deseja monitorar.
                </p>
             </Card>

             <Card className="p-8 border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                <div className="h-12 w-12 bg-purple-50 rounded-xl flex items-center justify-center text-energy-primary mb-6">
                   <ScanLine className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Monitoramento automático</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                   O sistema acompanha novidades diariamente e identifica padrões antes que virem tendência.
                </p>
             </Card>

             <Card className="p-8 border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                <div className="h-12 w-12 bg-pink-50 rounded-xl flex items-center justify-center text-pink-500 mb-6">
                   <Sparkles className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Sinais em conteúdo</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                   Selecione um tema quente e gere posts ou carrosséis alinhados à sua estratégia em segundos.
                </p>
             </Card>
          </div>
  
          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
             <Button variant="gradient" size="lg" className="h-14 px-8 text-base shadow-xl hover:shadow-2xl" onClick={() => setViewState('SETUP')}>
                Configurar minhas fontes <ArrowRight className="ml-2 h-5 w-5"/>
             </Button>
             <Button variant="ghost" size="lg" className="h-14 px-8 text-gray-500 hover:text-gray-900" onClick={() => setViewState('RADAR')}>
                Entendi como funciona
             </Button>
          </div>
        </div>
      </div>
    );
  }

  if (viewState === 'SETUP') {
    return (
      <div className="max-w-7xl mx-auto px-8 py-8 animate-fade-in">
        <div className="text-center mb-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center p-4 bg-indigo-50 rounded-2xl mb-6">
             <Radio className="h-8 w-8 text-trust-primary" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Configurar Radar de Sinais</h1>
          <p className="text-gray-500 max-w-lg mx-auto">
            O Pulse monitora fontes estratégicas e identifica padrões antes que virem tendência.
            Adicione de 3 a 5 fontes de autoridade do seu nicho {niche ? `(${niche})` : ''}.
          </p>
        </div>

        <Card className="max-w-3xl mx-auto p-8 border-trust-primary/20 shadow-lg">
           <div className="space-y-4">
              {sources.map((source, index) => (
                <div key={source.id} className="flex gap-3 items-center group">
                   <div className={`h-10 w-10 flex items-center justify-center rounded-lg font-mono text-sm border transition-colors ${source.status === 'valid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-gray-50 text-gray-400 border-gray-200'}`}>
                      {index + 1}
                   </div>
                   <div className="flex-1 relative">
                      <Input 
                        placeholder="exemplo.com/blog"
                        value={source.url}
                        onChange={(e) => handleUrlChange(source.id, e.target.value)}
                        onBlur={() => handleBlurUrl(source.id)}
                        className={`transition-all ${
                          source.status === 'error' ? 'border-red-300 bg-red-50 focus:ring-red-200' : 
                          source.status === 'valid' ? 'border-emerald-300 focus:ring-emerald-200' : ''
                        }`}
                      />
                      <div className="absolute right-3 top-2.5 pointer-events-none">
                        {source.status === 'valid' && <CheckCircle2 className="h-5 w-5 text-emerald-500 animate-in zoom-in" />}
                        {source.status === 'error' && <AlertCircle className="h-5 w-5 text-red-500 animate-in zoom-in" />}
                      </div>
                   </div>
                   {/* Remove Button */}
                   <button 
                     onClick={() => removeSourceSlot(source.id)} 
                     className="p-2 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                     title="Remover fonte"
                   >
                      <Trash2 className="h-5 w-5" />
                   </button>
                </div>
              ))}
           </div>

           <div className="mt-6 flex items-center justify-between">
              <Button 
                variant="ghost" 
                onClick={addSourceSlot} 
                disabled={sources.length >= 5}
                className="text-gray-500 hover:text-trust-primary"
              >
                 <Plus className="h-4 w-4 mr-2" /> Adicionar Fonte
              </Button>
              <div className={`text-xs font-medium ${sources.filter(s => s.status === 'valid').length >= 3 ? 'text-emerald-600' : 'text-gray-400'}`}>
                 {sources.filter(s => s.status === 'valid').length}/3 Fontes Válidas
              </div>
           </div>

           {activationError && (
             <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3 animate-in slide-in-from-top-2">
               <ShieldAlert className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
               <p className="text-sm text-red-800 font-medium">{activationError}</p>
             </div>
           )}

           <Separator className="my-6" />

           <Button 
             variant="gradient" 
             className="w-full h-12 text-lg shadow-xl hover:shadow-2xl transition-all hover:-translate-y-0.5"
             onClick={handleActivateMonitoring}
             loading={isActivating}
           >
              {isActivating ? 'Conectando Satélites...' : 'Ativar Monitoramento'}
           </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-8 py-8 animate-fade-in">
       
       {/* HEADER */}
       <div className="flex items-center justify-between mb-8">
         <div className="flex items-center gap-4">
           <div className="h-12 w-12 bg-indigo-50 rounded-xl flex items-center justify-center text-trust-primary border border-indigo-100 relative">
              <Activity className="h-6 w-6" />
              <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
           </div>
           <div>
             <h1 className="text-2xl font-serif font-bold text-gray-900">Radar de Sinais</h1>
             <p className="text-gray-500 text-sm flex items-center gap-2 mt-1">
                <CheckCircle2 className="h-3 w-3 text-emerald-500" /> Monitoramento Ativo em {sources.length} fontes.
             </p>
           </div>
         </div>
         
         <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={() => setViewState('SETUP')}>
               Configurar Fontes
            </Button>
            <Button variant="ghost" size="icon" onClick={loadTopics}>
               <RefreshCw className={`h-5 w-5 text-gray-400 ${isLoadingTopics ? 'animate-spin' : ''}`} />
            </Button>
         </div>
       </div>

       {/* EMPTY STATE */}
       {!isLoadingTopics && topics.length === 0 && (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
             <Radio className="h-12 w-12 text-gray-300 mx-auto mb-4" />
             <h3 className="text-lg font-bold text-gray-900">Aguardando Sinais</h3>
             <p className="text-gray-500 max-w-md mx-auto mb-6">
               Nosso processo de tracking roda diariamente. Novos tópicos aparecerão aqui quando detectados.
             </p>
             <Button variant="outline" onClick={() => setViewState('SETUP')}>
                Revisar Fontes
             </Button>
          </div>
       )}

       {/* RADAR GRID */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map(topic => (
             <Card key={topic.id} className="flex flex-col h-full hover:shadow-hover hover:border-trust-primary/30 transition-all duration-300 group relative">
                
                {/* Score Badge */}
                <div className="absolute top-4 right-4">
                   <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold border ${getScoreColor(topic.strategic_score)}`}>
                      <Zap className="h-3 w-3" /> {topic.strategic_score}
                   </div>
                </div>

                {/* Header */}
                <div className="mb-4">
                   <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                      <Globe className="h-3 w-3" />
                      <span className="uppercase tracking-wider font-bold">{topic.source_domain}</span>
                      <span>•</span>
                      <span>{topic.published_at}</span>
                   </div>
                   <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-trust-primary transition-colors">
                      {topic.title}
                   </h3>
                </div>

                {/* Body */}
                <div className="flex-1">
                   <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                      {topic.summary}
                   </p>
                </div>

                {/* AI Suggestions */}
                <div className="mt-6 pt-4 border-t border-gray-100 space-y-3">
                   <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="bg-gray-100 text-gray-600 border-gray-200">
                         {topic.ai_payload.suggested_format}
                      </Badge>
                      <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 border-indigo-100">
                         {topic.ai_payload.suggested_pillar}
                      </Badge>
                   </div>
                   <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Layout className="h-3 w-3" />
                      Framework: <span className="font-medium text-gray-900">{topic.ai_payload.recommended_framework}</span>
                   </div>
                </div>

                {/* Actions */}
                <div className="mt-6 grid grid-cols-2 gap-3">
                   <Button variant="outline" size="sm" onClick={() => handleDiscard(topic.id)} className="text-gray-500 hover:text-red-600 hover:border-red-200">
                      Descartar
                   </Button>
                   <Button variant="trust" size="sm" onClick={() => handleGeneratePreview(topic)}>
                      Gerar Conteúdo
                   </Button>
                </div>
             </Card>
          ))}
       </div>

       {/* PREVIEW MODAL */}
       <Modal
         isOpen={!!previewData || isPreviewLoading}
         onClose={() => { if(!isPreviewLoading) setPreviewData(null); }}
         title="Prévia de Conversão (IA)"
         maxWidth="max-w-2xl"
       >
          {isPreviewLoading ? (
             <div className="py-16 text-center">
                <Loader2 className="h-10 w-10 text-trust-primary animate-spin mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900">Transformando Tendência em Estratégia</h3>
                <p className="text-gray-500">Consultando núcleo estratégico e gerando estrutura...</p>
             </div>
          ) : previewData ? (
             <div className="mt-4 space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <Target className="h-5 w-5 text-trust-primary" />
                      <div>
                         <p className="text-xs font-bold text-indigo-800 uppercase">Objetivo da Session</p>
                         <p className="text-sm font-medium text-indigo-900">{previewData.session_objective}</p>
                      </div>
                   </div>
                   <Badge variant="trust">Rascunho</Badge>
                </div>

                <div className="space-y-4">
                   <div>
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Sugestão de Título</label>
                      <div className="text-lg font-bold text-gray-900 p-3 bg-gray-50 rounded border border-gray-200 shadow-sm">
                         {previewData.title}
                      </div>
                   </div>

                   <div>
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Hook (Gancho)</label>
                      <div className="text-sm text-gray-700 italic p-3 bg-gray-50 rounded border border-gray-200">
                         "{previewData.hook}"
                      </div>
                   </div>

                   <div>
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Estrutura Lógica</label>
                      <ul className="space-y-2">
                         {previewData.structure.map((step, i) => (
                            <li key={i} className="flex gap-3 text-sm text-gray-600 bg-white p-3 rounded border border-gray-100 shadow-sm">
                               <span className="font-bold text-trust-primary min-w-[1.5rem]">{i+1}.</span>
                               <span>{step}</span>
                            </li>
                         ))}
                      </ul>
                   </div>

                   <div>
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Chamada para Ação (CTA)</label>
                      <div className="text-sm font-medium text-gray-900 flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-100 rounded text-emerald-800">
                         <ArrowRight className="h-4 w-4" /> {previewData.cta}
                      </div>
                   </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                   <Button variant="ghost" onClick={() => setPreviewData(null)}>Cancelar</Button>
                   <Button variant="gradient" onClick={confirmContentCreation}>
                      <PlayCircle className="h-4 w-4 mr-2" /> Criar Session no Editor
                   </Button>
                </div>
             </div>
          ) : null}
       </Modal>

    </div>
  );
};
