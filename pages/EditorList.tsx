
import React, { useState } from 'react';
import { ContentStatus } from '../types';
import { Button, Card, Badge, Modal, Progress } from '../components/UI';
import { 
  FileEdit, Calendar, ArrowRight, Filter, Search, Layers, CheckCircle2, Clock, Circle,
  LayoutGrid, List as ListIcon, MoreHorizontal, Zap, Eye, Rocket, BrainCircuit, 
  TrendingUp, AlertTriangle, Send, Share2, MessageSquare, ThumbsUp, Sparkles
} from 'lucide-react';

// --- TYPES & MOCK DATA ---

type MaturityLevel = 'Rascunho' | 'Estruturado' | 'Pronto' | 'Publicado';

interface ContentItem {
  id: string;
  title: string;
  format: string;
  status: ContentStatus;
  pillar: string;
  cycle: string;
  updatedAt: string;
  viralScore: number;
  maturity: MaturityLevel;
  contentSnippet?: string; // For preview simulation
}

const MOCK_CONTENTS: ContentItem[] = [
  {
    id: 'doc-1',
    title: 'A Verdade sobre Escala em 2024: O fim do Growth Hacking?',
    format: 'Artigo',
    status: ContentStatus.IN_PROGRESS,
    pillar: 'Autoridade Técnica',
    cycle: 'Ciclo Fevereiro #1',
    updatedAt: 'Há 2 horas',
    viralScore: 82,
    maturity: 'Estruturado',
    contentSnippet: "O mercado mudou. Aquelas táticas de 2020 não funcionam mais. Se você ainda está focado em hacks de aquisição e ignorando retenção, você está construindo um balde furado..."
  },
  {
    id: 'doc-2',
    title: '3 Erros que matam seu LTV silenciosamente',
    format: 'Carrossel',
    status: ContentStatus.REVIEW,
    pillar: 'Prova Social',
    cycle: 'Ciclo Fevereiro #1',
    updatedAt: 'Há 5 horas',
    viralScore: 64,
    maturity: 'Pronto',
    contentSnippet: "Erro 1: Ignorar o onboarding. Erro 2: Suporte reativo. Erro 3: Falta de upsell contextual. Deslize para ver como corrigir cada um..."
  },
  {
    id: 'doc-3',
    title: 'Bastidores: Nosso churn rate abriu (e como fechamos)',
    format: 'Stories',
    status: ContentStatus.TODO,
    pillar: 'Transparência Radical',
    cycle: 'Ciclo Fevereiro #2',
    updatedAt: 'Ontem',
    viralScore: 91,
    maturity: 'Rascunho',
    contentSnippet: "Vou abrir os números. Janeiro foi difícil. Perdemos 5% da base. Mas a lição foi valiosa..."
  },
  {
    id: 'doc-4',
    title: 'Por que demitimos um cliente de R$ 10k/mês',
    format: 'Video Longo',
    status: ContentStatus.DONE,
    pillar: 'Cultura Forte',
    cycle: 'Ciclo Janeiro #4',
    updatedAt: '2 dias atrás',
    viralScore: 45,
    maturity: 'Publicado',
    contentSnippet: "Nem todo dinheiro é bom dinheiro. Ontem tomamos uma decisão difícil mas necessária para manter nossa cultura intacta."
  }
];

interface EditorListProps {
  onOpenDocument: (id: string) => void;
}

export const EditorList: React.FC<EditorListProps> = ({ onOpenDocument }) => {
  const [viewMode, setViewMode] = useState<'GRID' | 'LIST'>('LIST');
  const [activeTab, setActiveTab] = useState<'ALL' | 'DRAFT' | 'READY'>('ALL');
  
  // Modals State
  const [selectedDoc, setSelectedDoc] = useState<ContentItem | null>(null);
  const [modalType, setModalType] = useState<'PREVIEW' | 'AI' | 'PUBLISH' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // --- HELPERS ---

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    if (score >= 50) return 'bg-amber-100 text-amber-700 border-amber-200';
    return 'bg-red-50 text-red-700 border-red-200';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Alto Potencial';
    if (score >= 50) return 'Médio Potencial';
    return 'Baixo Potencial';
  };

  const getStatusColor = (status: ContentStatus) => {
    switch (status) {
      case ContentStatus.DONE: return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case ContentStatus.IN_PROGRESS: return 'bg-blue-50 text-blue-700 border-blue-200';
      case ContentStatus.REVIEW: return 'bg-purple-50 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-500 border-gray-200';
    }
  };

  const getStatusIcon = (status: ContentStatus) => {
    switch (status) {
      case ContentStatus.DONE: return <CheckCircle2 className="h-3 w-3" />;
      case ContentStatus.IN_PROGRESS: return <FileEdit className="h-3 w-3" />;
      case ContentStatus.REVIEW: return <Eye className="h-3 w-3" />;
      default: return <Circle className="h-3 w-3" />;
    }
  };

  // --- ACTIONS ---

  const handleAction = (doc: ContentItem, type: 'PREVIEW' | 'AI' | 'PUBLISH') => {
    setSelectedDoc(doc);
    setModalType(type);
  };

  const executeAI = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setModalType(null);
      // In real app, trigger update here
    }, 2000);
  };

  const executePublish = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setModalType(null);
      // In real app, trigger update here
    }, 1500);
  };

  // --- RENDERERS ---

  const renderDashboard = () => {
    const totalProduction = MOCK_CONTENTS.filter(c => c.status === ContentStatus.IN_PROGRESS || c.status === ContentStatus.REVIEW).length;
    const readyCount = MOCK_CONTENTS.filter(c => c.maturity === 'Pronto').length;
    const avgScore = Math.round(MOCK_CONTENTS.reduce((acc, curr) => acc + curr.viralScore, 0) / MOCK_CONTENTS.length);
    const topContent = MOCK_CONTENTS.reduce((prev, current) => (prev.viralScore > current.viralScore) ? prev : current);

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-4 border-l-4 border-l-trust-primary">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Em Produção</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-serif font-bold text-gray-900">{totalProduction}</span>
            <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">Ativos</span>
          </div>
        </Card>
        <Card className="p-4 border-l-4 border-l-emerald-500">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Prontos</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-serif font-bold text-gray-900">{readyCount}</span>
            <span className="text-xs bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded">Publicar</span>
          </div>
        </Card>
        <Card className="p-4 border-l-4 border-l-energy-primary">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Score Médio</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-serif font-bold text-gray-900">{avgScore}</span>
            <Progress value={avgScore} className="w-16 h-1.5" indicatorColor="bg-energy-primary" />
          </div>
        </Card>
        <Card className="p-4 border-l-4 border-l-amber-400 relative overflow-hidden">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Top Potencial</p>
          <div className="truncate pr-4">
             <span className="text-sm font-bold text-gray-900 block truncate">{topContent.title}</span>
             <span className="text-xs text-amber-600 font-medium">Score: {topContent.viralScore}</span>
          </div>
          <TrendingUp className="absolute right-2 top-2 h-12 w-12 text-amber-500/10" />
        </Card>
      </div>
    );
  };

  const renderCard = (content: ContentItem) => (
    <div 
      key={content.id}
      className="group bg-white rounded-xl border border-gray-200 p-0 hover:shadow-hover hover:border-trust-primary/30 transition-all duration-300 flex flex-col justify-between min-h-[260px] relative overflow-hidden"
    >
       {/* Top Bar */}
       <div className="p-5 pb-0">
          <div className="flex justify-between items-start mb-3">
             <div className="flex gap-2">
               <Badge variant="outline" className="text-[10px] font-normal px-1.5 h-5">
                  {content.format}
               </Badge>
               <span className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${getStatusColor(content.status)}`}>
                  {getStatusIcon(content.status)}
                  {content.status.replace('_', ' ')}
               </span>
             </div>
             
             {/* Viral Score Badge */}
             <div className="group/score relative cursor-help">
                <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold border ${getScoreColor(content.viralScore)}`}>
                   <Zap className="h-3 w-3" /> {content.viralScore}
                </span>
                {/* Tooltip */}
                <div className="absolute right-0 top-full mt-2 w-48 bg-gray-900 text-white text-[10px] p-2 rounded shadow-xl opacity-0 group-hover/score:opacity-100 transition-opacity z-10 pointer-events-none">
                   Potencial baseado em headline, structure and pilar. {getScoreLabel(content.viralScore)}.
                </div>
             </div>
          </div>

          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-trust-primary transition-colors line-clamp-2">
             {content.title}
          </h3>

          <div className="space-y-1 mb-4">
             <p className="text-xs text-gray-500 flex items-center gap-2">
                <Layers className="h-3 w-3" />
                {content.pillar}
             </p>
             <p className="text-xs text-gray-400 flex items-center gap-2">
                <Calendar className="h-3 w-3" />
                {content.cycle}
             </p>
          </div>
       </div>

       {/* Action Footer (Always visible or hover) */}
       <div className="mt-auto bg-gray-50 border-t border-gray-100 p-2 flex items-center justify-between gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
          <div className="flex gap-1">
             <Button 
               variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-500 hover:text-trust-primary hover:bg-white"
               title="Editar" onClick={() => onOpenDocument(content.id)}
             >
                <FileEdit className="h-4 w-4" />
             </Button>
             <Button 
               variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-500 hover:text-blue-600 hover:bg-white"
               title="Prévia" onClick={() => handleAction(content, 'PREVIEW')}
             >
                <Eye className="h-4 w-4" />
             </Button>
             <Button 
               variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-500 hover:text-energy-primary hover:bg-white"
               title="Gerar com IA" onClick={() => handleAction(content, 'AI')}
             >
                <BrainCircuit className="h-4 w-4" />
             </Button>
          </div>
          <Button 
            variant="ghost" size="sm" className="h-8 text-[10px] px-2 text-gray-600 hover:text-white hover:bg-[#0077b5]"
            onClick={() => handleAction(content, 'PUBLISH')}
          >
             <Rocket className="h-3 w-3 mr-1" /> Publicar
          </Button>
       </div>
    </div>
  );

  const renderListRow = (content: ContentItem) => (
    <tr key={content.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
       <td className="py-3 px-4">
          <p className="font-bold text-gray-900 text-sm truncate max-w-[240px]" title={content.title}>{content.title}</p>
       </td>
       <td className="py-3 px-4 text-xs text-gray-500">{content.format}</td>
       <td className="py-3 px-4 text-xs text-gray-500">{content.pillar}</td>
       <td className="py-3 px-4">
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusColor(content.status)}`}>
             {content.status.replace('_', ' ')}
          </span>
       </td>
       <td className="py-3 px-4">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold border ${getScoreColor(content.viralScore)}`}>
             {content.viralScore}
          </span>
       </td>
       <td className="py-3 px-4 text-xs text-gray-400">{content.updatedAt}</td>
       <td className="py-3 px-4 text-right">
          <div className="flex justify-end gap-2">
             <button className="p-1 hover:bg-gray-200 rounded text-gray-400 hover:text-trust-primary" onClick={() => onOpenDocument(content.id)}><FileEdit className="h-4 w-4" /></button>
             <button className="p-1 hover:bg-gray-200 rounded text-gray-400 hover:text-energy-primary" onClick={() => handleAction(content, 'AI')}><BrainCircuit className="h-4 w-4" /></button>
          </div>
       </td>
    </tr>
  );

  return (
    <div className="max-w-7xl mx-auto px-8 py-8 animate-fade-in pb-24">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900 tracking-tight">Painel Editorial</h1>
          <p className="text-gray-500 mt-1">Gerencie a produção e performance do seu conteúdo.</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input 
                placeholder="Buscar..." 
                className="pl-9 pr-4 py-2 text-sm bg-transparent outline-none w-48"
              />
           </div>
           <div className="h-6 w-px bg-gray-200" />
           <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setViewMode('GRID')}>
              <LayoutGrid className={`h-4 w-4 ${viewMode === 'GRID' ? 'text-trust-primary' : 'text-gray-400'}`} />
           </Button>
           <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setViewMode('LIST')}>
              <ListIcon className={`h-4 w-4 ${viewMode === 'LIST' ? 'text-trust-primary' : 'text-gray-400'}`} />
           </Button>
           <Button variant="outline" size="sm" className="ml-2">
              <Filter className="h-4 w-4 mr-2" /> Filtros
           </Button>
        </div>
      </div>

      {/* MINI DASHBOARD */}
      {renderDashboard()}

      {/* MAIN CONTENT AREA */}
      {viewMode === 'GRID' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
           {MOCK_CONTENTS.map(renderCard)}
        </div>
      ) : (
        <Card className="overflow-hidden p-0">
           <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                 <tr>
                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Título</th>
                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Formato</th>
                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Pilar</th>
                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Score</th>
                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Atualizado</th>
                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase text-right">Ações</th>
                 </tr>
              </thead>
              <tbody>
                 {MOCK_CONTENTS.map(renderListRow)}
              </tbody>
           </table>
        </Card>
      )}

      {/* --- MODALS --- */}

      {/* 1. PREVIEW MODAL */}
      <Modal
        isOpen={modalType === 'PREVIEW'}
        onClose={() => setModalType(null)}
        title="Prévia do Post (Simulação)"
        maxWidth="max-w-xl"
      >
         {selectedDoc && (
            <div className="space-y-6 mt-4">
               {/* LinkedIn Simulator */}
               <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                     <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                     <div>
                        <div className="h-3 w-32 bg-gray-200 rounded mb-1"></div>
                        <div className="h-2 w-20 bg-gray-100 rounded"></div>
                     </div>
                  </div>
                  <div className="space-y-2 mb-4">
                     <p className="text-sm font-bold text-gray-900">{selectedDoc.title}</p>
                     <p className="text-sm text-gray-700 whitespace-pre-line">{selectedDoc.contentSnippet}</p>
                     <p className="text-sm text-trust-primary cursor-pointer">#growth #marketing #strategy</p>
                  </div>
                  {/* Fake Actions */}
                  <div className="border-t border-gray-100 pt-2 flex justify-between text-gray-500">
                     <div className="flex gap-4 text-xs font-bold">
                        <span className="flex items-center gap-1"><ThumbsUp className="h-4 w-4" /> Gostei</span>
                        <span className="flex items-center gap-1"><MessageSquare className="h-4 w-4" /> Comentar</span>
                     </div>
                     <span className="flex items-center gap-1 text-xs"><Share2 className="h-4 w-4" /> Compartilhar</span>
                  </div>
               </div>

               <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <Button variant="ghost" onClick={() => onOpenDocument(selectedDoc.id)}>Editar Conteúdo</Button>
                  <Button variant="trust" onClick={() => { setModalType(null); handleAction(selectedDoc, 'PUBLISH'); }}>
                     <Rocket className="h-4 w-4 mr-2" /> Preparar Publicação
                  </Button>
               </div>
            </div>
         )}
      </Modal>

      {/* 2. AI GENERATION MODAL */}
      <Modal
         isOpen={modalType === 'AI'}
         onClose={() => setModalType(null)}
         title="Assistente de Conteúdo IA"
      >
         {selectedDoc && (
            <div className="mt-4">
               <div className="bg-indigo-50 p-4 rounded-lg mb-6 flex gap-4">
                  <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center shrink-0 text-energy-primary shadow-sm">
                     <BrainCircuit className="h-6 w-6" />
                  </div>
                  <div>
                     <h4 className="font-bold text-gray-900 text-sm">Otimização Estratégica</h4>
                     <p className="text-xs text-gray-600 mt-1">
                        A IA detectou que este conteúdo tem Score {selectedDoc.viralScore}. Podemos melhorar a headline e a estrutura para atingir 90+.
                     </p>
                  </div>
               </div>

               <div className="space-y-3 mb-8">
                  <p className="text-sm font-bold text-gray-700">O que você deseja fazer?</p>
                  <button className="w-full text-left p-3 rounded border border-gray-200 hover:border-trust-primary hover:bg-indigo-50 transition-colors text-sm flex items-center justify-between group">
                     <span>Reescrever Headline para mais impacto</span>
                     <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-trust-primary" />
                  </button>
                  <button className="w-full text-left p-3 rounded border border-gray-200 hover:border-trust-primary hover:bg-indigo-50 transition-colors text-sm flex items-center justify-between group">
                     <span>Expandir estrutura baseada no framework</span>
                     <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-trust-primary" />
                  </button>
                  <button className="w-full text-left p-3 rounded border border-gray-200 hover:border-trust-primary hover:bg-indigo-50 transition-colors text-sm flex items-center justify-between group">
                     <span>Gerar variação para outro formato</span>
                     <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-trust-primary" />
                  </button>
               </div>

               <div className="flex justify-end gap-3">
                  <Button variant="ghost" onClick={() => setModalType(null)}>Cancelar</Button>
                  <Button variant="gradient" onClick={executeAI} loading={isProcessing}>
                     <Sparkles className="h-4 w-4 mr-2" /> Executar IA
                  </Button>
               </div>
            </div>
         )}
      </Modal>

      {/* 3. PUBLISH MODAL */}
      <Modal
         isOpen={modalType === 'PUBLISH'}
         onClose={() => setModalType(null)}
         title="Publicar no LinkedIn"
      >
         {selectedDoc && (
            <div className="mt-4">
               <p className="text-sm text-gray-600 mb-6">
                  Você está prestes a publicar <strong>"{selectedDoc.title}"</strong>.
               </p>

               <div className="space-y-4 mb-8">
                  <div>
                     <label className="text-xs font-bold text-gray-500 uppercase">Conta</label>
                     <div className="flex items-center gap-2 mt-1 p-2 border border-gray-200 rounded bg-gray-50">
                        <div className="h-6 w-6 bg-blue-600 rounded-full"></div>
                        <span className="text-sm font-medium">Perfil Pessoal</span>
                     </div>
                  </div>
                  <div>
                     <label className="text-xs font-bold text-gray-500 uppercase">Agendamento</label>
                     <div className="flex gap-2 mt-1">
                        <Button variant="outline" size="sm" className="flex-1 border-trust-primary bg-indigo-50 text-trust-primary">Publicar Agora</Button>
                        <Button variant="outline" size="sm" className="flex-1">Agendar</Button>
                     </div>
                  </div>
               </div>

               <div className="flex justify-end gap-3">
                  <Button variant="ghost" onClick={() => setModalType(null)}>Cancelar</Button>
                  <Button className="bg-[#0077b5] hover:bg-[#006097] text-white" onClick={executePublish} loading={isProcessing}>
                     <Rocket className="h-4 w-4 mr-2" /> Confirmar Publicação
                  </Button>
               </div>
            </div>
         )}
      </Modal>

    </div>
  );
};
