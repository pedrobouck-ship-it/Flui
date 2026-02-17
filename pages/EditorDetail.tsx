
import React, { useState, useEffect, useRef } from 'react';
import { EditorDocument, ContentStatus, ContentBlock } from '../types';
import { Button, Badge, ToggleGroup, Separator } from '../components/UI';
import { StrategyContextCard, HeadlineBlock, StructureBlock, CTABlock, AIInputsModule, GenerationControls, MediaUploadCard, SchedulingCard } from '../components/EditorComponents';
import { ArrowLeft, Save, Loader2, Check, Eye, Edit3, Send, AlertTriangle, Zap } from 'lucide-react';

// --- MOCK FRAMEWORK STRUCTURES ---
const FRAMEWORK_STRUCTURES: Record<string, { blocks: Omit<ContentBlock, 'id' | 'content'>[] }> = {
  'pas': {
    blocks: [
      { title: 'Problema (P)', description: 'Identifique a dor latente do leitor de forma visceral.' },
      { title: 'Agitação (A)', description: 'Intensifique o problema. Mostre as consequências de não agir.' },
      { title: 'Solução (S)', description: 'Apresente sua oferta/método como o alívio imediato e definitivo.' }
    ]
  },
  'aida': {
    blocks: [
      { title: 'Atenção', description: 'Quebre o padrão de rolagem com algo surpreendente.' },
      { title: 'Interesse', description: 'Mantenha a leitura com fatos ou curiosidades relevantes.' },
      { title: 'Desejo', description: 'Faça o leitor querer a transformação que você oferece.' },
      { title: 'Ação', description: 'Diga exatamente o que fazer agora.' }
    ]
  },
  'hero-journey': {
    blocks: [
      { title: 'O Mundo Comum', description: 'Estabeleça a situação atual e o status quo.' },
      { title: 'O Chamado & Provação', description: 'O incidente incitante e os desafios enfrentados.' },
      { title: 'A Transformação', description: 'A lição aprendida e o novo estado de ser.' }
    ]
  }
};

// --- MOCK DATA LOAD ---
const fetchDocument = (id: string): Promise<EditorDocument> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate a document using the PAS framework
      const frameworkId = 'pas'; 
      const template = FRAMEWORK_STRUCTURES[frameworkId];
      
      resolve({
        id,
        title: 'Como parar de perder tempo com leads ruins',
        status: ContentStatus.IN_PROGRESS,
        format: 'Post LinkedIn',
        lastUpdated: new Date().toISOString(),
        theme: 'Gestão de Vendas',
        series: 'Eficiência Comercial',
        pillar: 'Processos',
        objective: 'Gerar Leads Qualificados',
        angle: 'Qualidade > Quantidade',
        sessionName: 'Ciclo Março #1',
        frameworkId: frameworkId,
        headline: 'Pare de tratar todo lead como cliente (você está perdendo dinheiro)',
        
        contentBlocks: template.blocks.map((b, i) => ({
          id: `blk-${i}`,
          title: b.title,
          description: b.description,
          content: '' 
        })),

        aiSettings: {
          depth: 'Estratégico',
          tone: 'Provocativo',
          instructions: ''
        },
        references: {
          links: [],
          files: []
        },

        ctaType: 'Conversion',
        ctaText: 'Comente "PROCESSO" para receber nosso guia de qualificação.',
        
        // New Fields Init
        coverImageUrl: undefined,
        imageAltText: '',
        scheduledAt: '',
        scheduleSuggested: false
      });
    }, 600);
  });
};

interface EditorDetailProps {
  documentId: string;
  onBack: () => void;
}

export const EditorDetail: React.FC<EditorDetailProps> = ({ documentId, onBack }) => {
  // State
  const [doc, setDoc] = useState<EditorDocument | null>(null);
  const [viewMode, setViewMode] = useState<'EDIT' | 'PREVIEW'>('EDIT');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generatingAll, setGeneratingAll] = useState(false);
  const [activeBlockLoading, setActiveBlockLoading] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{headline?: boolean, blocks?: boolean, schedule?: boolean}>({});
  
  // Autosave Timer
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetchDocument(documentId).then(data => {
      setDoc(data);
      setLoading(false);
    });
  }, [documentId]);

  // --- LOGIC: SCORE ---
  const calculateScore = () => {
    if (!doc) return 0;
    let score = 0;
    // Rule 1: Headline > 40 chars
    if (doc.headline.length > 40) score += 2;
    // Rule 2: CTA Present
    if (doc.ctaText.trim().length > 5) score += 2;
    // Rule 3: Structure Complete (simple check: all blocks > 10 chars)
    if (doc.contentBlocks.every(b => b.content.length > 10)) score += 2;
    // Rule 4: Image Added
    if (doc.coverImageUrl) score += 2;
    // Rule 5: Scheduled
    if (doc.scheduledAt) score += 2;
    
    return score;
  };

  const currentScore = calculateScore();

  // --- LOGIC: SCHEDULING ---
  const getSuggestedSchedule = () => {
    const today = new Date();
    const day = today.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
    let nextDate = new Date(today);
    
    // Logic: 
    // Mon(1)-Thu(4) -> Next Day 09:00
    // Fri(5) -> Next Mon (add 3 days) 09:00
    // Sat(6) -> Next Mon (add 2 days) 09:00
    // Sun(0) -> Next Mon (add 1 day) 09:00
    
    if (day >= 1 && day <= 4) {
       nextDate.setDate(today.getDate() + 1);
    } else if (day === 5) {
       nextDate.setDate(today.getDate() + 3);
    } else if (day === 6) {
       nextDate.setDate(today.getDate() + 2);
    } else if (day === 0) {
       nextDate.setDate(today.getDate() + 1);
    }
    
    nextDate.setHours(9, 0, 0, 0);
    return nextDate;
  };

  const handleApplyScheduleSuggestion = () => {
    const suggestedDate = getSuggestedSchedule();
    // Format to datetime-local string: YYYY-MM-DDTHH:mm
    const formatted = suggestedDate.toISOString().slice(0, 16);
    updateDoc({ scheduledAt: formatted, scheduleSuggested: true });
  };

  // --- LOGIC: HANDLERS ---

  const updateDoc = (updates: Partial<EditorDocument>) => {
    if (!doc) return;
    setDoc(prev => prev ? ({ ...prev, ...updates }) : null);
    
    // Clear validation error if field is updated
    if (updates.headline) setValidationErrors(prev => ({ ...prev, headline: false }));
    if (updates.scheduledAt) setValidationErrors(prev => ({ ...prev, schedule: false }));
    
    triggerAutosave();
  };

  const updateBlock = (blockId: string, content: string) => {
    if (!doc) return;
    const newBlocks = doc.contentBlocks.map(b => b.id === blockId ? { ...b, content } : b);
    setDoc(prev => prev ? ({ ...prev, contentBlocks: newBlocks }) : null);
    
    // Clear block validation if somewhat filled
    if (content.length > 5) setValidationErrors(prev => ({ ...prev, blocks: false }));
    
    triggerAutosave();
  };

  const updateAISettings = (updates: Partial<EditorDocument['aiSettings']>) => {
    if (!doc) return;
    setDoc(prev => prev ? ({ ...prev, aiSettings: { ...prev.aiSettings, ...updates } }) : null);
  };

  const triggerAutosave = () => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    setSaving(true);
    saveTimeoutRef.current = setTimeout(() => {
      setSaving(false);
    }, 1500);
  };

  // --- LOGIC: IMAGE ---
  const handleImageUpload = (file: File) => {
    // Mock Supabase Upload
    const reader = new FileReader();
    reader.onload = (e) => {
       // Simulate network delay
       setTimeout(() => {
          updateDoc({ coverImageUrl: e.target?.result as string });
       }, 1000);
    };
    reader.readAsDataURL(file);
  };

  // --- LOGIC: FINALIZATION ---
  const handleFinalize = () => {
    if (!doc) return;
    
    const errors = {
       headline: !doc.headline.trim(),
       blocks: doc.contentBlocks.some(b => b.content.trim().length < 10),
       schedule: !doc.scheduledAt
    };

    setValidationErrors(errors);

    if (Object.values(errors).some(Boolean)) {
       // Stop if invalid
       return;
    }

    // Determine status
    const scheduleDate = new Date(doc.scheduledAt!);
    const now = new Date();
    const newStatus = scheduleDate > now ? ContentStatus.SCHEDULED : ContentStatus.PUBLISHED;

    setSaving(true);
    setTimeout(() => {
       setDoc(prev => prev ? ({ ...prev, status: newStatus }) : null);
       setSaving(false);
       onBack(); // Return to list
    }, 1500);
  };

  // --- LOGIC: AI GENERATION ---
  const handleFullGeneration = async () => {
    if (!doc) return;
    setGeneratingAll(true);
    setTimeout(() => {
      const generatedBlocks = doc.contentBlocks.map(block => {
        let text = `[IA: Gerando ${block.title} com tom ${doc.aiSettings.tone} e profundidade ${doc.aiSettings.depth}]...\n\n`;
        text += `Baseado nos ${doc.references.files.length} arquivos e ${doc.references.links.length} links fornecidos, aqui está a estrutura ideal.`;
        return { ...block, content: text };
      });
      setDoc(prev => prev ? ({ ...prev, contentBlocks: generatedBlocks }) : null);
      setGeneratingAll(false);
    }, 2500);
  };

  const handleBlockRefine = (blockId: string) => {
    setActiveBlockLoading(blockId);
    setTimeout(() => {
       if (doc) {
          const block = doc.contentBlocks.find(b => b.id === blockId);
          if (block) {
             const refined = block.content + "\n\n[IA: Trecho refinado para maior clareza e impacto]";
             updateBlock(blockId, refined);
          }
       }
       setActiveBlockLoading(null);
    }, 1500);
  };

  const handleHeadlineOptimize = () => {
     setActiveBlockLoading('headline');
     setTimeout(() => {
        updateDoc({ headline: "5 Sinais de que você está queimando dinheiro com Leads (e como parar)" });
        setActiveBlockLoading(null);
     }, 1000);
  };

  // --- HELPERS ---
  const isHeadlineCoherent = doc ? doc.headline.length > 10 && doc.headline.length < 100 : true;
  const isCTACoherent = doc ? (doc.objective.includes('Vendas') && doc.ctaType === 'Conversion') || (doc.objective.includes('Autoridade') && doc.ctaType === 'Authority') : true;

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-trust-primary" /></div>;
  if (!doc) return <div>Erro ao carregar documento.</div>;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      
      {/* 1. TOP BAR */}
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-gray-200 px-6 h-16 flex items-center justify-between">
         <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
               <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div>
               <h2 className="text-base font-bold text-gray-900 leading-none truncate max-w-[200px] lg:max-w-md" title={doc.title}>{doc.title}</h2>
               <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{doc.format}</span>
                  {saving ? (
                    <span className="flex items-center text-amber-500 gap-1 text-[10px]"><Loader2 className="h-3 w-3 animate-spin"/> Salvando...</span>
                  ) : (
                    <span className="flex items-center text-emerald-500 gap-1 text-[10px]"><Check className="h-3 w-3"/> Salvo</span>
                  )}
               </div>
            </div>
         </div>

         {/* CENTER: VIEW TOGGLE & SCORE */}
         <div className="flex items-center gap-6">
            <ToggleGroup 
               value={viewMode} 
               onValueChange={(val) => setViewMode(val as any)}
               options={[
                  { value: 'EDIT', label: 'Editar', icon: Edit3 },
                  { value: 'PREVIEW', label: 'Visualizar', icon: Eye }
               ]}
            />
            
            <div className="hidden lg:flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200" title="Potencial estratégico do conteúdo">
               <Zap className={`h-4 w-4 ${currentScore >= 8 ? 'text-emerald-500' : (currentScore >= 5 ? 'text-amber-500' : 'text-gray-400')}`} />
               <span className="text-xs font-bold text-gray-700">Potencial: <span className={`${currentScore >= 8 ? 'text-emerald-600' : 'text-gray-900'}`}>{currentScore}/10</span></span>
            </div>
         </div>

         {/* RIGHT: ACTIONS */}
         <div className="flex items-center gap-3">
            <Button variant="trust" size="sm" onClick={handleFinalize}>
               <Send className="h-4 w-4 mr-2" />
               Finalizar
            </Button>
         </div>
      </div>

      {/* 2. MAIN LAYOUT */}
      <div className="flex-1 max-w-[1600px] mx-auto w-full px-6 py-8">
         <div className="grid grid-cols-12 gap-8">
            
            {/* LEFT COLUMN: CONTEXT (Hidden in Preview if wanted, but kept for context) */}
            <div className="hidden lg:block lg:col-span-3 space-y-6">
               <StrategyContextCard 
                  theme={doc.theme}
                  series={doc.series}
                  pillar={doc.pillar}
                  objective={doc.objective}
                  angle={doc.angle}
                  frameworkName={doc.frameworkId?.toUpperCase()}
               />
               
               {viewMode === 'EDIT' && (
                  <AIInputsModule 
                     files={doc.references.files}
                     links={doc.references.links}
                     instructions={doc.aiSettings.instructions}
                     onAddFile={() => {
                        const newFile = `Briefing_${doc.references.files.length + 1}.pdf`;
                        setDoc(prev => prev ? ({ ...prev, references: { ...prev.references, files: [...prev.references.files, newFile] } }) : null);
                     }}
                     onRemoveFile={(idx) => {
                        setDoc(prev => prev ? ({ ...prev, references: { ...prev.references, files: prev.references.files.filter((_, i) => i !== idx) } }) : null);
                     }}
                     onAddLink={(link) => {
                        setDoc(prev => prev ? ({ ...prev, references: { ...prev.references, links: [...prev.references.links, link] } }) : null);
                     }}
                     onRemoveLink={(idx) => {
                        setDoc(prev => prev ? ({ ...prev, references: { ...prev.references, links: prev.references.links.filter((_, i) => i !== idx) } }) : null);
                     }}
                     onInstructionsChange={(val) => updateAISettings({ instructions: val })}
                  />
               )}
            </div>

            {/* RIGHT COLUMN: EDITOR OR PREVIEW (9 Cols) */}
            <div className="col-span-12 lg:col-span-9 max-w-4xl mx-auto w-full">
               
               {viewMode === 'EDIT' ? (
                  <>
                     {/* 2.1 GENERATION CONTROLS */}
                     <GenerationControls 
                        depth={doc.aiSettings.depth}
                        tone={doc.aiSettings.tone}
                        onDepthChange={(val) => updateAISettings({ depth: val })}
                        onToneChange={(val) => updateAISettings({ tone: val })}
                        onGenerate={handleFullGeneration}
                        isGenerating={generatingAll}
                     />
                     
                     {/* 2.2 EDITABLE CONTENT BLOCKS */}
                     
                     {/* Headline */}
                     <div className={validationErrors.headline ? "ring-2 ring-red-300 rounded-lg" : ""}>
                        <HeadlineBlock 
                           value={doc.headline}
                           onChange={(val) => updateDoc({ headline: val })}
                           onOptimize={handleHeadlineOptimize}
                           isLoading={activeBlockLoading === 'headline'}
                           coherenceWarning={!isHeadlineCoherent}
                        />
                        {validationErrors.headline && <p className="text-xs text-red-500 mt-1 ml-1 font-medium">A headline é obrigatória.</p>}
                     </div>

                     {/* Media Upload */}
                     <MediaUploadCard 
                        coverImage={doc.coverImageUrl}
                        altText={doc.imageAltText}
                        onUpload={handleImageUpload}
                        onRemove={() => updateDoc({ coverImageUrl: undefined })}
                        onAltTextChange={(val) => updateDoc({ imageAltText: val })}
                     />

                     {/* Structure Blocks */}
                     <div className={`space-y-4 ${validationErrors.blocks ? "p-2 border border-red-200 bg-red-50/30 rounded-xl" : ""}`}>
                        {doc.contentBlocks.map((block) => (
                           <StructureBlock 
                              key={block.id}
                              title={block.title}
                              description={block.description}
                              placeholder={`Escreva o conteúdo para a etapa "${block.title}"...`}
                              value={block.content}
                              onChange={(val) => updateBlock(block.id, val)}
                              onRefine={() => handleBlockRefine(block.id)}
                              isLoading={activeBlockLoading === block.id || generatingAll}
                              defaultExpanded={true}
                           />
                        ))}
                        {validationErrors.blocks && <p className="text-xs text-red-500 font-medium px-2">Preencha todos os blocos de conteúdo.</p>}
                     </div>

                     {/* CTA */}
                     <CTABlock 
                        type={doc.ctaType}
                        text={doc.ctaText}
                        onTypeChange={(t) => updateDoc({ ctaType: t as any })}
                        onTextChange={(val) => updateDoc({ ctaText: val })}
                        coherenceWarning={!isCTACoherent}
                     />

                     {/* Scheduling */}
                     <div className={validationErrors.schedule ? "ring-2 ring-red-300 rounded-lg" : ""}>
                        <SchedulingCard 
                           scheduledAt={doc.scheduledAt}
                           scheduleSuggested={doc.scheduleSuggested}
                           onDateChange={(val) => updateDoc({ scheduledAt: val })}
                           onApplySuggestion={handleApplyScheduleSuggestion}
                           suggestionText={getSuggestedSchedule().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        />
                        {validationErrors.schedule && <p className="text-xs text-red-500 mt-1 ml-1 font-medium">Defina a data de publicação.</p>}
                     </div>
                  </>
               ) : (
                  // --- PREVIEW MODE ---
                  <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden max-w-2xl mx-auto">
                     {/* Preview Header / Metadata */}
                     <div className="bg-gray-50 border-b border-gray-100 p-4 flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                        <div>
                           <div className="h-3 w-32 bg-gray-200 rounded mb-1.5"></div>
                           <div className="h-2 w-20 bg-gray-200 rounded"></div>
                        </div>
                     </div>

                     {/* Content Body */}
                     <div className="p-8">
                        {/* Cover Image */}
                        {doc.coverImageUrl && (
                           <div className="mb-8 rounded-lg overflow-hidden border border-gray-100">
                              <img src={doc.coverImageUrl} alt={doc.imageAltText || "Cover"} className="w-full h-auto" />
                           </div>
                        )}

                        {/* Headline */}
                        <h1 className="text-2xl font-bold text-gray-900 mb-6 leading-tight font-serif">{doc.headline}</h1>

                        {/* Blocks */}
                        <div className="space-y-6 text-gray-800 leading-relaxed whitespace-pre-wrap font-sans text-base">
                           {doc.contentBlocks.map((block) => (
                              <div key={block.id}>
                                 {/* Hidden label, just text */}
                                 {block.content || <span className="text-gray-300 italic">[Bloco vazio]</span>}
                              </div>
                           ))}
                        </div>

                        {/* CTA */}
                        <div className="mt-10 p-6 bg-indigo-50 rounded-xl text-center border border-indigo-100">
                           <p className="font-bold text-indigo-900">{doc.ctaText || "CTA não definido"}</p>
                        </div>
                     </div>

                     {/* Schedule Info Footer */}
                     {doc.scheduledAt && (
                        <div className="bg-gray-50 p-3 text-center text-xs text-gray-500 border-t border-gray-100">
                           Agendado para: <strong>{new Date(doc.scheduledAt).toLocaleString('pt-BR')}</strong>
                        </div>
                     )}
                  </div>
               )}

            </div>
         </div>
      </div>

      {/* Validation Toast (Mock) */}
      {Object.values(validationErrors).some(Boolean) && (
         <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 z-50 animate-in slide-in-from-bottom-4">
            <AlertTriangle className="h-5 w-5" />
            <span className="font-bold">Atenção:</span> Preencha todos os campos obrigatórios para finalizar.
         </div>
      )}

    </div>
  );
};
