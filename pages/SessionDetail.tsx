
import React, { useState } from 'react';
import { Session, SessionStatus, ContentStatus, SessionItem } from '../types';
import { Button, Card, Badge, Separator, Progress, Modal } from '../components/UI';
import { 
  ArrowLeft, Calendar, Target, PlayCircle, Archive, 
  RotateCcw, CheckCircle2, Circle, Clock, FileEdit, Layout,
  LayoutGrid, List as ListIcon, Search, Filter, Zap, Eye, BrainCircuit, Rocket,
  TrendingUp, ThumbsUp, MessageSquare, Share2, ArrowRight, Sparkles, Layers,
  Grid
} from 'lucide-react';

interface SessionDetailProps {
  session: Session;
  onBack: () => void;
  onOpenDocument: (id: string) => void;
  onOpenVisual: (item: SessionItem) => void;
}

export const SessionDetail: React.FC<SessionDetailProps> = ({ session, onBack, onOpenDocument, onOpenVisual }) => {
  const [viewMode, setViewMode] = useState<'GRID' | 'LIST'>('LIST'); 
  const [activeTab, setActiveTab] = useState<'ALL' | 'DRAFT' | 'READY'>('ALL');
  
  // Modals State
  const [selectedItem, setSelectedItem] = useState<SessionItem | null>(null);
  const [modalType, setModalType] = useState<'PREVIEW' | 'AI' | 'PUBLISH' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!session) return <div>Session not found</div>;

  // Flatten items for display and inject mock framework if missing
  const allItems: SessionItem[] = session.themes.flatMap(t => 
    t.series.flatMap(s => s.items.map(i => ({
       ...i,
       pillar: t.title, // Inherit pillar/theme name
       contentSnippet: i.contentSnippet || "Conteúdo em desenvolvimento...",
       viralScore: i.viralScore || Math.floor(Math.random() * 40) + 50, // Mock score if missing
       maturity: i.maturity || (i.status === ContentStatus.DONE ? 'Pronto' : 'Rascunho'),
       framework: i.framework || (i.format === 'Carrossel' ? 'AIDA' : i.format === 'Artigo' ? 'Pirâmide Invertida' : 'PAS')
    })))
  );

  // --- HELPERS ---

  const getScoreColor = (score?: number) => {
    if (!score) return 'bg-gray-50 text-gray-500 border-gray-200';
    if (score >= 80) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    if (score >= 50) return 'bg-amber-100 text-amber-700 border-amber-200';
    return 'bg-red-50 text-red-700 border-red-200';
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

  const handleEdit = (item: SessionItem) => {
    // Logic to distinguish Visual vs Textual Editor
    const visualFormats = ['Carrossel', 'OnePage'];
    if (visualFormats.includes(item.format)) {
      onOpenVisual(item);
    } else {
      onOpenDocument(item.id);
    }
  };

  const handleAction = (item: SessionItem, type: 'PREVIEW' | 'AI' | 'PUBLISH') => {
    setSelectedItem(item);
    setModalType(type);
  };

  const executeAI = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setModalType(null);
    }, 2000);
  };

  const executePublish = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setModalType(null);
    }, 1500);
  };

  // --- RENDERERS ---

  const renderDashboard = () => {
    const total = allItems.length;
    const completed = allItems.filter(i => i.status === ContentStatus.DONE).length;
    const avgScore = total > 0 ? Math.round(allItems.reduce((acc, curr) => acc + (curr.viralScore || 0), 0) / total) : 0;
    
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-4 border-l-4 border-l-trust-primary">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total de Peças</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-serif font-bold text-gray-900">{total}</span>
            <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">Volume</span>
          </div>
        </Card>
        <Card className="p-4 border-l-4 border-l-emerald-500">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Prontos</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-serif font-bold text-gray-900">{completed}</span>
            <span className="text-xs bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded">Publicar</span>
          </div>
        </Card>
        <Card className="p-4 border-l-4 border-l-energy-primary">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Score da Session</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-serif font-bold text-gray-900">{avgScore}</span>
            <Progress value={avgScore} className="w-16 h-1.5" indicatorColor="bg-energy-primary" />
          </div>
        </Card>
        <Card className="p-4 border-l-4 border-l-amber-400 relative overflow-hidden">
           <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Prazo</p>
           <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-900">{session.endDate}</span>
              <span className="text-xs text-amber-600 font-medium">Ativo</span>
           </div>
        </Card>
      </div>
    );
  };

  const renderListRow = (item: SessionItem) => (
    <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
       <td className="py-3 px-4">
          <p className="font-bold text-gray-900 text-sm truncate max-w-[240px]" title={item.title}>
            {item.title || "Sem título"}
          </p>
       </td>
       <td className="py-3 px-4 text-xs text-gray-500">{item.format}</td>
       <td className="py-3 px-4 text-xs text-gray-500">{item.pillar}</td>
       <td className="py-3 px-4 text-xs text-trust-primary font-medium">{item.framework}</td>
       <td className="py-3 px-4">
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusColor(item.status)}`}>
             {item.status.replace('_', ' ')}
          </span>
       </td>
       <td className="py-3 px-4">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold border ${getScoreColor(item.viralScore)}`}>
             {item.viralScore}
          </span>
       </td>
       <td className="py-3 px-4 text-right">
          <div className="flex justify-end gap-2">
             <button className="p-1 hover:bg-gray-200 rounded text-gray-400 hover:text-trust-primary" title="Editar" onClick={() => handleEdit(item)}><FileEdit className="h-4 w-4" /></button>
             <button className="p-1 hover:bg-gray-200 rounded text-gray-400 hover:text-blue-600" title="Prévia" onClick={() => handleAction(item, 'PREVIEW')}><Eye className="h-4 w-4" /></button>
             <button className="p-1 hover:bg-gray-200 rounded text-gray-400 hover:text-energy-primary" title="IA" onClick={() => handleAction(item, 'AI')}><BrainCircuit className="h-4 w-4" /></button>
          </div>
       </td>
    </tr>
  );

  const renderCard = (item: SessionItem) => (
    <div key={item.id} className="group bg-white rounded-xl border border-gray-200 p-0 hover:shadow-hover hover:border-trust-primary/30 transition-all duration-300 flex flex-col justify-between min-h-[260px] relative overflow-hidden">
       <div className="p-5 pb-0">
          <div className="flex justify-between items-start mb-3">
             <div className="flex gap-2">
               <Badge variant="outline" className="text-[10px] font-normal px-1.5 h-5">{item.format}</Badge>
               <span className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${getStatusColor(item.status)}`}>
                  {getStatusIcon(item.status)}
               </span>
             </div>
             <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold border ${getScoreColor(item.viralScore)}`}>
                <Zap className="h-3 w-3" /> {item.viralScore}
             </span>
          </div>
          <h3 className="text-base font-bold text-gray-900 mb-2 group-hover:text-trust-primary transition-colors line-clamp-2">
             {item.title || "Sem Título"}
          </h3>
          <div className="flex flex-col gap-1 mb-4">
            <p className="text-xs text-gray-500 flex items-center gap-2">
               <Layers className="h-3 w-3" /> {item.pillar}
            </p>
            <p className="text-xs text-gray-500 flex items-center gap-2">
               <Grid className="h-3 w-3" /> {item.framework}
            </p>
          </div>
       </div>
       <div className="mt-auto bg-gray-50 border-t border-gray-100 p-3 grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" className="justify-center text-xs h-8 px-2 border-gray-200 text-gray-600 hover:text-trust-primary hover:bg-white" onClick={() => handleEdit(item)}>
             <FileEdit className="h-3 w-3 mr-2" /> Editar
          </Button>
          <Button variant="outline" size="sm" className="justify-center text-xs h-8 px-2 border-gray-200 text-gray-600 hover:text-blue-600 hover:bg-white" onClick={() => handleAction(item, 'PREVIEW')}>
             <Eye className="h-3 w-3 mr-2" /> Prévia
          </Button>
          <Button variant="outline" size="sm" className="justify-center text-xs h-8 px-2 border-gray-200 text-gray-600 hover:text-energy-primary hover:bg-white" onClick={() => handleAction(item, 'AI')}>
             <BrainCircuit className="h-3 w-3 mr-2" /> Otimizar
          </Button>
          <Button variant="trust" size="sm" className="justify-center text-xs h-8 px-2 text-white hover:bg-[#0077b5]" onClick={() => handleAction(item, 'PUBLISH')}>
             <Rocket className="h-3 w-3 mr-2" /> Publicar
          </Button>
       </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-8 py-8 animate-fade-in pb-24">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-4">
           <Button variant="ghost" size="icon" onClick={onBack} className="-ml-2">
              <ArrowLeft className="h-5 w-5 text-gray-600" />
           </Button>
           <div>
              <div className="flex items-center gap-3">
                 <h1 className="text-2xl font-serif font-bold text-gray-900">{session.name}</h1>
                 <Badge variant="trust">{session.status}</Badge>
              </div>
              <p className="text-gray-500 text-sm mt-1 flex items-center gap-2">
                 <Target className="h-3 w-3" /> {session.objective}
              </p>
           </div>
        </div>

        <div className="flex items-center gap-3 bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input placeholder="Buscar peças..." className="pl-9 pr-4 py-2 text-sm bg-transparent outline-none w-48" />
           </div>
           <div className="h-6 w-px bg-gray-200" />
           <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setViewMode('GRID')}>
              <LayoutGrid className={`h-4 w-4 ${viewMode === 'GRID' ? 'text-trust-primary' : 'text-gray-400'}`} />
           </Button>
           <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setViewMode('LIST')}>
              <ListIcon className={`h-4 w-4 ${viewMode === 'LIST' ? 'text-trust-primary' : 'text-gray-400'}`} />
           </Button>
        </div>
      </div>

      {/* DASHBOARD */}
      {renderDashboard()}

      {/* CONTENT AREA */}
      {viewMode === 'GRID' ? (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {allItems.map(renderCard)}
            {allItems.length === 0 && <p className="text-gray-500 col-span-full text-center py-12">Nenhum conteúdo nesta session.</p>}
         </div>
      ) : (
         <Card className="overflow-hidden p-0">
            <table className="w-full text-left">
               <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                     <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Título</th>
                     <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Formato</th>
                     <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Pilar</th>
                     <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Framework</th>
                     <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                     <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Score</th>
                     <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase text-right">Ações</th>
                  </tr>
               </thead>
               <tbody>
                  {allItems.map(renderListRow)}
                  {allItems.length === 0 && (
                     <tr><td colSpan={7} className="text-center py-8 text-gray-500">Nenhum conteúdo encontrado.</td></tr>
                  )}
               </tbody>
            </table>
         </Card>
      )}

      {/* --- MODALS --- */}

      {/* Preview Modal */}
      <Modal isOpen={modalType === 'PREVIEW'} onClose={() => setModalType(null)} title="Simulação de Feed">
         {selectedItem && (
            <div className="mt-4">
               <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                     <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                     <div>
                        <div className="h-3 w-32 bg-gray-200 rounded mb-1"></div>
                        <div className="h-2 w-20 bg-gray-100 rounded"></div>
                     </div>
                  </div>
                  <div className="space-y-2 mb-4">
                     <p className="text-sm font-bold text-gray-900">{selectedItem.title}</p>
                     <p className="text-sm text-gray-700 whitespace-pre-line">{selectedItem.contentSnippet}</p>
                     <p className="text-sm text-trust-primary">#{selectedItem.pillar?.replace(/\s/g,'').toLowerCase()} #{selectedItem.framework?.toLowerCase()}</p>
                  </div>
                  <div className="border-t border-gray-100 pt-2 flex justify-between text-gray-500 text-xs font-bold">
                     <span className="flex items-center gap-1"><ThumbsUp className="h-4 w-4"/> Gostei</span>
                     <span className="flex items-center gap-1"><MessageSquare className="h-4 w-4"/> Comentar</span>
                     <span className="flex items-center gap-1"><Share2 className="h-4 w-4"/> Compartilhar</span>
                  </div>
               </div>
               <div className="flex justify-end gap-3 pt-4">
                   <Button variant="ghost" onClick={() => setModalType(null)}>Fechar</Button>
               </div>
            </div>
         )}
      </Modal>

      {/* AI Modal */}
      <Modal isOpen={modalType === 'AI'} onClose={() => setModalType(null)} title="Assistente IA">
         {selectedItem && (
            <div className="mt-4">
               <div className="bg-indigo-50 p-4 rounded-lg mb-6">
                  <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                     <BrainCircuit className="h-4 w-4 text-trust-primary"/> Análise de Performance
                  </h4>
                  <p className="text-xs text-gray-600 mt-1">Score atual: {selectedItem.viralScore}. Potencial de melhoria na headline detectado.</p>
               </div>
               <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-between" onClick={executeAI}>
                     Melhorar Headline <ArrowRight className="h-4 w-4"/>
                  </Button>
                  <Button variant="outline" className="w-full justify-between" onClick={executeAI}>
                     Expandir Tópicos <ArrowRight className="h-4 w-4"/>
                  </Button>
               </div>
               <div className="flex justify-end gap-3 pt-4">
                  <Button variant="ghost" onClick={() => setModalType(null)}>Cancelar</Button>
               </div>
            </div>
         )}
      </Modal>

      {/* Publish Modal */}
      <Modal isOpen={modalType === 'PUBLISH'} onClose={() => setModalType(null)} title="Publicar Conteúdo">
         {selectedItem && (
            <div className="mt-4">
               <p className="text-sm text-gray-600 mb-6">Confirmar publicação de <strong>"{selectedItem.title}"</strong>?</p>
               <div className="flex justify-end gap-3">
                  <Button variant="ghost" onClick={() => setModalType(null)}>Cancelar</Button>
                  <Button variant="trust" onClick={executePublish} loading={isProcessing}>
                     <Rocket className="h-4 w-4 mr-2"/> Publicar Agora
                  </Button>
               </div>
            </div>
         )}
      </Modal>

    </div>
  );
};
