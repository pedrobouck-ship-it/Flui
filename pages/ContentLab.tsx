
import React, { useState, useEffect } from 'react';
import { Session, StrategyCore } from '../types';
import { Button, Badge } from '../components/UI';
import { ArrowLeft, Save, Sparkles, Square, RefreshCw, LayoutTemplate } from 'lucide-react';

interface ContentLabProps {
  session: Session | null;
  strategy: StrategyCore | null;
  onClose: () => void;
  onSave: (id: string, content: string) => void;
  onOpenVisual?: (content: string) => void;
}

export const ContentLab: React.FC<ContentLabProps> = ({ session, strategy, onClose, onSave, onOpenVisual }) => {
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [format, setFormat] = useState('Post'); // Default format

  // Example: Pre-fill based on session objective
  useEffect(() => {
    if (session) {
      setContent(`[Slide 1: Capa]\n${session.name}\n\n[Slide 2: Problema]\nTexto do problema aqui...\n\n[Slide 3: Solução]\nTexto da solução aqui...`);
      setFormat('Carrossel'); // Default to Carousel for demo if session exists
    }
  }, [session]);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      onSave(session?.id || 'temp', content);
      setIsSaving(false);
    }, 800);
  };

  const handleSync = () => {
     // Mock sync functionality
     setIsSaving(true);
     setTimeout(() => {
        setIsSaving(false);
     }, 1000);
  };

  // Determine if Visual Studio is relevant
  const showVisualOption = format === 'Carrossel';

  if (!session || !strategy) return <div>No active session or strategy found.</div>;

  return (
    <div className="absolute inset-0 z-50 bg-white flex flex-col animate-slide-up">
      {/* Header */}
      <div className="h-16 border-b border-gray-200 flex items-center justify-between px-6 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="text-gray-500 hover:text-gray-900">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3">
              Lab: {session.name}
              <Badge variant="energy">Draft</Badge>
            </h2>
          </div>
          
          {/* Format Selector */}
          <div className="flex items-center gap-2 bg-gray-50 px-2 py-1 rounded-md border border-gray-200">
             <LayoutTemplate className="h-4 w-4 text-gray-400" />
             <select 
               value={format} 
               onChange={(e) => setFormat(e.target.value)}
               className="bg-transparent border-none text-sm font-medium text-gray-700 focus:ring-0 cursor-pointer"
             >
                <option value="Post">Post Texto</option>
                <option value="Carrossel">Carrossel</option>
                <option value="Roteiro">Roteiro Vídeo</option>
                <option value="Email">Email</option>
             </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400 flex items-center gap-1 mr-2">
             <div className={`h-2 w-2 rounded-full ${content.length > 20 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
             {content.length > 0 ? 'Escrevendo...' : 'Vazio'}
          </span>
          
          <Button variant="outline" size="sm">
            <Sparkles className="h-4 w-4 mr-2 text-energy-primary" />
            Assistente IA
          </Button>

          <Button onClick={handleSave} variant="ghost" size="sm" disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            Salvar
          </Button>

          <Button onClick={handleSync} variant="ghost" size="sm" disabled={isSaving}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isSaving ? 'animate-spin' : ''}`} />
            Sincronizar
          </Button>

          {showVisualOption && onOpenVisual && (
             <Button onClick={() => onOpenVisual(content)} variant="trust" size="sm" className="ml-2 bg-indigo-600 hover:bg-indigo-700 text-white border-0">
                <Square className="h-4 w-4 mr-2" />
                Editar no Visual
             </Button>
          )}
        </div>
      </div>

      {/* Editor Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Context Sidebar */}
        <div className="w-80 border-r border-gray-200 bg-gray-50 p-6 overflow-y-auto hidden lg:block">
          <div className="space-y-6">
            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Alinhamento Estratégico</h4>
              <div className="bg-white p-3 rounded-md border border-gray-200 shadow-sm">
                <p className="text-sm font-medium text-trust-primary mb-1">Arquétipo: {strategy.archetype.name}</p>
                <p className="text-xs text-gray-500">{strategy.archetype.description}</p>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Objetivo da Session</h4>
              <p className="text-sm text-gray-700 bg-white p-3 rounded-md border border-gray-200">
                {session.objective}
              </p>
            </div>

            <div>
               <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Checagem de Tom</h4>
               <div className="flex flex-wrap gap-2">
                 {strategy.voiceTone.keywords.map(k => (
                   <span key={k} className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">{k}</span>
                 ))}
               </div>
            </div>
          </div>
        </div>

        {/* Main Editor */}
        <div className="flex-1 overflow-y-auto relative bg-white">
          <div className="max-w-3xl mx-auto py-12 px-8 min-h-screen">
            <textarea
              className="w-full h-[calc(100vh-150px)] resize-none outline-none text-lg text-gray-800 leading-relaxed font-serif placeholder:text-gray-300"
              placeholder="Comece a escrever aqui... Separe slides com linha em branco."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              spellCheck={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
