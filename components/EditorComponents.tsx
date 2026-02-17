
import React, { useState, useRef } from 'react';
import { Card, Button, Badge, TextArea, Input } from './UI';
import { 
  Target, Layers, Zap, CheckSquare, Wand2, ChevronDown, ChevronUp, Sparkles, MessageSquare,
  UploadCloud, Link as LinkIcon, Plus, X, FileText, Settings2, PlayCircle, AlertCircle,
  Image as ImageIcon, Calendar, Clock, RotateCw, Trash2
} from 'lucide-react';

// --- 1. STRATEGY CONTEXT CARD (Left Column) ---
interface StrategyContextCardProps {
  theme: string;
  series: string;
  pillar: string;
  objective: string;
  angle: string;
  frameworkName?: string;
}

export const StrategyContextCard: React.FC<StrategyContextCardProps> = ({
  theme, series, pillar, objective, angle, frameworkName
}) => {
  return (
    <div className="space-y-4">
      <Card className="bg-gray-50 border-gray-200">
        <div className="flex items-center gap-2 mb-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
          <Target className="h-4 w-4" /> Contexto Estratégico
        </div>
        
        <div className="space-y-4">
          <div>
            <span className="text-xs text-gray-500 block mb-1">Tema Macro</span>
            <div className="font-medium text-gray-900 text-sm bg-white px-3 py-2 rounded border border-gray-100 shadow-sm">
              {theme}
            </div>
          </div>

          <div>
            <span className="text-xs text-gray-500 block mb-1">Série & Ângulo</span>
            <div className="bg-white px-3 py-2 rounded border border-gray-100 shadow-sm space-y-2">
              <div className="font-medium text-gray-900 text-sm flex items-center gap-2">
                <Layers className="h-3 w-3 text-trust-primary" /> {series}
              </div>
              <div className="text-xs text-gray-600 pl-5 border-l-2 border-trust-primary/20">
                "{angle}"
              </div>
            </div>
          </div>
          
          {frameworkName && (
             <div>
                <span className="text-xs text-gray-500 block mb-1">Framework Aplicado</span>
                <Badge variant="trust" className="w-full justify-center py-1">{frameworkName}</Badge>
             </div>
          )}

          <div className="grid grid-cols-2 gap-2">
             <div>
                <span className="text-xs text-gray-500 block mb-1">Pilar</span>
                <Badge variant="secondary" className="w-full justify-center">{pillar}</Badge>
             </div>
             <div>
                <span className="text-xs text-gray-500 block mb-1">Objetivo</span>
                <Badge variant="outline" className="w-full justify-center bg-white">{objective}</Badge>
             </div>
          </div>
        </div>
      </Card>

      <Card className="border-gray-200">
         <div className="flex items-center gap-2 mb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
          <CheckSquare className="h-4 w-4" /> Checklist de Qualidade
        </div>
        <ul className="space-y-2">
           {['Headline conecta com a dor?', 'Estrutura lógica clara?', 'Tom de voz consistente?', 'CTA único e direto?'].map((item, i) => (
             <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <input type="checkbox" className="mt-1 rounded border-gray-300 text-trust-primary focus:ring-trust-primary" />
                <span>{item}</span>
             </li>
           ))}
        </ul>
      </Card>
    </div>
  );
};

// --- 2. AI INPUTS MODULE (Refactored for Sidebar) ---
interface AIInputsModuleProps {
  files: string[];
  links: string[];
  instructions: string;
  onAddFile: () => void; // Mock trigger
  onRemoveFile: (idx: number) => void;
  onAddLink: (link: string) => void;
  onRemoveLink: (idx: number) => void;
  onInstructionsChange: (val: string) => void;
}

export const AIInputsModule: React.FC<AIInputsModuleProps> = ({
  files, links, instructions, onAddFile, onRemoveFile, onAddLink, onRemoveLink, onInstructionsChange
}) => {
  const [tempLink, setTempLink] = useState('');

  const handleLinkSubmit = () => {
    if (tempLink.trim()) {
      onAddLink(tempLink);
      setTempLink('');
    }
  };

  return (
    <Card className="border-indigo-100 bg-indigo-50/30">
       <div className="flex items-center gap-2 mb-4 text-xs font-bold text-trust-primary uppercase tracking-wider">
          <Sparkles className="h-4 w-4" /> Insumos Estratégicos (IA)
       </div>

       <div className="space-y-6">
          {/* Files & Links */}
          <div className="space-y-4">
             {/* Upload Mock */}
             <div 
               className="border-2 border-dashed border-gray-300 rounded-lg p-3 flex flex-col items-center justify-center text-center hover:bg-white hover:border-trust-primary/50 transition-all cursor-pointer bg-white/50"
               onClick={onAddFile}
             >
                <UploadCloud className="h-5 w-5 text-gray-400 mb-1" />
                <p className="text-xs text-gray-600 font-medium">Arquivos de Referência</p>
                <p className="text-[10px] text-gray-400">PDF, DOCX, TXT</p>
             </div>
             
             {/* File List */}
             {files.length > 0 && (
                <div className="space-y-2">
                   {files.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-white px-2 py-1.5 rounded border border-gray-200 text-xs">
                         <div className="flex items-center gap-2 truncate">
                            <FileText className="h-3 w-3 text-gray-400" />
                            <span className="text-gray-700 truncate max-w-[120px]">{file}</span>
                         </div>
                         <button onClick={() => onRemoveFile(idx)} className="text-gray-400 hover:text-red-500">
                            <X className="h-3 w-3" />
                         </button>
                      </div>
                   ))}
                </div>
             )}

             {/* Link Input */}
             <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Links de Referência</label>
                <div className="flex gap-2 mb-2">
                   <Input 
                      placeholder="https://..." 
                      className="h-8 text-xs bg-white"
                      value={tempLink}
                      onChange={(e) => setTempLink(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleLinkSubmit()}
                   />
                   <Button variant="outline" size="sm" className="h-8 px-2" onClick={handleLinkSubmit}>
                      <Plus className="h-3 w-3" />
                   </Button>
                </div>
                {/* Link List */}
                <div className="space-y-1">
                   {links.map((link, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs bg-white/50 px-2 py-1 rounded text-gray-600">
                         <div className="flex items-center gap-2 truncate max-w-[90%]">
                            <LinkIcon className="h-3 w-3 text-gray-400" />
                            <span className="truncate">{link}</span>
                         </div>
                         <button onClick={() => onRemoveLink(idx)} className="text-gray-400 hover:text-red-500">
                            <X className="h-3 w-3" />
                         </button>
                      </div>
                   ))}
                </div>
             </div>
          </div>

          {/* Instructions */}
          <div className="flex flex-col">
             <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Orientações à IA</label>
             <TextArea 
                className="min-h-[100px] text-xs bg-white resize-y"
                placeholder="Ex: Use tom provocativo, evite clichês..."
                value={instructions}
                onChange={(e) => onInstructionsChange(e.target.value)}
             />
          </div>
       </div>
    </Card>
  );
};

// --- 3. GENERATION CONTROLS ---
interface GenerationControlsProps {
  depth: string;
  tone: string;
  onDepthChange: (val: any) => void;
  onToneChange: (val: any) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export const GenerationControls: React.FC<GenerationControlsProps> = ({
  depth, tone, onDepthChange, onToneChange, onGenerate, isGenerating
}) => {
  return (
    <div className="bg-gray-900 p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg mb-8">
       <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-white/80">
             <Settings2 className="h-4 w-4" />
             <span className="text-sm font-bold uppercase tracking-wider">Configuração de IA</span>
          </div>
          
          <div className="flex gap-4">
             {/* Depth Selector */}
             <select 
               className="bg-gray-800 text-white text-xs rounded border-none py-1.5 px-3 focus:ring-1 focus:ring-trust-primary"
               value={depth}
               onChange={(e) => onDepthChange(e.target.value)}
             >
                <option value="Superficial">Nível: Rápido</option>
                <option value="Estratégico">Nível: Estratégico</option>
                <option value="Técnico">Nível: Técnico/Profundo</option>
             </select>

             {/* Tone Selector */}
             <select 
               className="bg-gray-800 text-white text-xs rounded border-none py-1.5 px-3 focus:ring-1 focus:ring-trust-primary"
               value={tone}
               onChange={(e) => onToneChange(e.target.value)}
             >
                <option value="Provocativo">Tom: Provocativo</option>
                <option value="Didático">Tom: Didático</option>
                <option value="Analítico">Tom: Analítico</option>
                <option value="Inspiracional">Tom: Inspiracional</option>
                <option value="Autoridade">Tom: Autoridade</option>
             </select>
          </div>
       </div>

       <Button 
         variant="gradient" 
         className="w-full md:w-auto shadow-none hover:brightness-110"
         onClick={onGenerate}
         disabled={isGenerating}
       >
          {isGenerating ? (
            <>
               <Sparkles className="h-4 w-4 mr-2 animate-spin" /> Gerando Estrutura...
            </>
          ) : (
            <>
               <PlayCircle className="h-4 w-4 mr-2" /> Gerar Estrutura Completa
            </>
          )}
       </Button>
    </div>
  );
};


// --- 4. HEADLINE BLOCK ---
interface HeadlineBlockProps {
  value: string;
  onChange: (val: string) => void;
  onOptimize: () => void;
  isLoading: boolean;
  coherenceWarning?: boolean;
}

export const HeadlineBlock: React.FC<HeadlineBlockProps> = ({ value, onChange, onOptimize, isLoading, coherenceWarning }) => {
  return (
    <Card className={`mb-6 shadow-sm ${coherenceWarning ? 'border-amber-300' : 'border-trust-primary/20'}`}>
       <div className="flex justify-between items-center mb-3">
          <label className="text-sm font-bold text-gray-900 flex items-center gap-2">
             <Sparkles className="h-4 w-4 text-energy-primary" /> Headline (Gancho)
          </label>
          <div className="flex gap-2 items-center">
             {coherenceWarning && (
                <span className="text-xs text-amber-600 flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded mr-2">
                   <AlertCircle className="h-3 w-3" /> Baixa coerência
                </span>
             )}
             <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={onOptimize} disabled={isLoading}>
                {isLoading ? 'Gerando...' : 'Gerar Variações (AI)'}
             </Button>
          </div>
       </div>
       <input 
         className="w-full text-xl font-serif font-bold text-gray-900 placeholder:text-gray-300 border-0 border-b border-gray-200 pb-2 focus:ring-0 focus:border-trust-primary transition-colors bg-transparent"
         placeholder="Escreva um gancho impossível de ignorar..."
         value={value}
         onChange={(e) => onChange(e.target.value)}
         disabled={isLoading}
       />
       <p className="text-xs text-gray-400 mt-2 text-right">
         {value.length} caracteres
       </p>
    </Card>
  );
};

// --- NEW COMPONENT: MEDIA UPLOAD CARD ---
interface MediaUploadCardProps {
  coverImage?: string;
  altText?: string;
  onUpload: (file: File) => void;
  onRemove: () => void;
  onAltTextChange: (text: string) => void;
}

export const MediaUploadCard: React.FC<MediaUploadCardProps> = ({ 
  coverImage, altText, onUpload, onRemove, onAltTextChange 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) validateAndUpload(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) validateAndUpload(file);
  };

  const validateAndUpload = (file: File) => {
    // 5MB Limit
    if (file.size > 5 * 1024 * 1024) {
      alert("Arquivo muito grande. Máximo de 5MB.");
      return;
    }
    // PNG/JPG Check
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      alert("Formato inválido. Apenas PNG ou JPG.");
      return;
    }
    onUpload(file);
  };

  return (
    <Card className="mb-6 shadow-sm border-gray-200">
      <div className="flex items-center gap-2 mb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
        <ImageIcon className="h-4 w-4" /> Mídia de Capa
      </div>

      {!coverImage ? (
        <div 
          className={`
            border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all
            ${isDragging ? 'border-trust-primary bg-indigo-50' : 'border-gray-200 hover:border-trust-primary/50 hover:bg-gray-50'}
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="h-10 w-10 bg-white rounded-full shadow-sm flex items-center justify-center mb-3">
            <UploadCloud className="h-5 w-5 text-trust-primary" />
          </div>
          <p className="text-sm font-medium text-gray-700">Adicionar imagem à publicação</p>
          <p className="text-xs text-gray-400 mt-1">PNG, JPG até 5MB</p>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/png, image/jpeg" 
            onChange={handleFileSelect} 
          />
        </div>
      ) : (
        <div className="flex gap-4 items-start animate-in fade-in zoom-in-95 duration-200">
          <div className="relative group w-32 h-32 rounded-lg overflow-hidden border border-gray-200 shrink-0">
            <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button onClick={onRemove} className="text-white hover:text-red-400 p-2">
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <div className="flex-1 space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase">Texto Alternativo (Acessibilidade)</label>
            <Input 
              value={altText || ''} 
              onChange={(e) => onAltTextChange(e.target.value)} 
              placeholder="Descreva a imagem para leitores de tela..."
              className="text-sm"
            />
            <p className="text-[10px] text-gray-400">Importante para SEO e inclusão.</p>
          </div>
        </div>
      )}
    </Card>
  );
};

// --- NEW COMPONENT: SCHEDULING CARD ---
interface SchedulingCardProps {
  scheduledAt?: string;
  scheduleSuggested?: boolean;
  onDateChange: (date: string) => void;
  onApplySuggestion: () => void;
  suggestionText: string;
}

export const SchedulingCard: React.FC<SchedulingCardProps> = ({ 
  scheduledAt, scheduleSuggested, onDateChange, onApplySuggestion, suggestionText 
}) => {
  return (
    <Card className="mt-8 shadow-sm border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
          <Calendar className="h-4 w-4" /> Publicação
        </div>
        {scheduleSuggested && (
          <Badge variant="energy" className="flex items-center gap-1">
            <Sparkles className="h-3 w-3" /> Sugestão Inteligente Aplicada
          </Badge>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Data e Hora</label>
            <Input 
              type="datetime-local" 
              value={scheduledAt || ''} 
              onChange={(e) => onDateChange(e.target.value)}
              className="w-full"
            />
          </div>
          
          {/* Suggestion Box */}
          <div className="flex-1 bg-indigo-50 border border-indigo-100 rounded-lg p-3 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wide">Melhor Horário (IA)</p>
              <p className="text-xs font-medium text-indigo-900 mt-0.5">{suggestionText}</p>
            </div>
            <Button variant="ghost" size="sm" className="h-7 text-xs bg-white text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700" onClick={onApplySuggestion}>
              Aplicar
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

// --- 5. STRUCTURE BLOCK (Generic) ---
interface StructureBlockProps {
  title: string;
  description?: string;
  value: string;
  onChange: (val: string) => void;
  onRefine: () => void;
  placeholder?: string;
  isLoading: boolean;
  defaultExpanded?: boolean;
}

export const StructureBlock: React.FC<StructureBlockProps> = ({ 
  title, description, value, onChange, onRefine, placeholder, isLoading, defaultExpanded = true 
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className={`bg-white rounded-lg border transition-all duration-300 ${isExpanded ? 'border-gray-300 shadow-sm mb-4' : 'border-gray-100 mb-2'}`}>
      {/* Header */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer select-none"
        onClick={() => setIsExpanded(!isExpanded)}
      >
         <div>
            <h4 className="font-medium text-gray-900 flex items-center gap-2">
              {isExpanded ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
              {title}
            </h4>
            {description && isExpanded && (
               <p className="text-xs text-gray-400 mt-1 ml-6">{description}</p>
            )}
         </div>
         {!isExpanded && (
            <span className="text-xs text-gray-400 truncate max-w-[300px]">
               {value || "Vazio..."}
            </span>
         )}
      </div>

      {/* Content */}
      {isExpanded && (
         <div className="px-4 pb-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <TextArea 
               className="min-h-[150px] resize-y text-base text-gray-700 leading-relaxed border-gray-100 bg-gray-50/30 focus:bg-white"
               placeholder={placeholder}
               value={value}
               onChange={(e) => onChange(e.target.value)}
               disabled={isLoading}
            />
            <div className="flex justify-end mt-2">
               <Button variant="ghost" size="sm" className="text-trust-primary hover:bg-trust-primary/5" onClick={onRefine} disabled={isLoading}>
                  <Wand2 className="h-3 w-3 mr-2" />
                  {isLoading ? 'Refinando...' : 'Refinar este Bloco'}
               </Button>
            </div>
         </div>
      )}
    </div>
  );
};

// --- 6. CTA BLOCK ---
interface CTABlockProps {
  type: 'Authority' | 'Engagement' | 'Conversion';
  text: string;
  onTypeChange: (t: any) => void;
  onTextChange: (t: string) => void;
  coherenceWarning?: boolean;
}

export const CTABlock: React.FC<CTABlockProps> = ({ type, text, onTypeChange, onTextChange, coherenceWarning }) => {
  return (
    <Card className="mt-8 bg-gray-50/50 border-dashed border-gray-300">
       <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
             <MessageSquare className="h-4 w-4" /> Chamada para Ação (CTA)
          </div>
          {coherenceWarning && (
            <span className="text-xs text-amber-600 flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded">
               <AlertCircle className="h-3 w-3" /> Tipo desalinhado com objetivo
            </span>
          )}
       </div>
       
       <div className="grid grid-cols-3 gap-2 mb-4">
          {['Authority', 'Engagement', 'Conversion'].map((t) => (
             <button
               key={t}
               onClick={() => onTypeChange(t)}
               className={`py-2 px-1 rounded text-xs font-medium transition-colors ${
                 type === t 
                 ? 'bg-gray-900 text-white shadow-sm' 
                 : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
               }`}
             >
               {t === 'Authority' ? 'Autoridade' : (t === 'Engagement' ? 'Engajamento' : 'Conversão')}
             </button>
          ))}
       </div>

       <input 
         className="w-full p-3 rounded border border-gray-200 text-sm focus:ring-2 focus:ring-trust-primary focus:outline-none"
         placeholder="Ex: Salve este post para consultar depois..."
         value={text}
         onChange={(e) => onTextChange(e.target.value)}
       />
    </Card>
  );
};
