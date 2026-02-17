
import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, X, Command, ArrowRight, Loader2, 
  Layout, Compass, FileText, User, Zap, Plus, Layers
} from 'lucide-react';
import { SearchResult, View } from '../types';

interface CommandCenterProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: View, entityId?: string) => void;
}

// --- MOCK DATA SERVICE (Simulating Supabase) ---
const MOCK_DB: SearchResult[] = [
  // Ações Rápidas (Always available in logic, but searchable too)
  { id: 'act-1', workspace_id: 'ws-1', entity_type: 'ACTION', title: 'Criar novo módulo', subtitle: 'Ação rápida', keywords: ['novo', 'criar', 'modulo'], targetView: View.SESSIONS },
  { id: 'act-2', workspace_id: 'ws-1', entity_type: 'ACTION', title: 'Criar nova estratégia', subtitle: 'Ação rápida', keywords: ['novo', 'criar', 'estrategia'], targetView: View.STRATEGY },
  { id: 'act-3', workspace_id: 'ws-1', entity_type: 'ACTION', title: 'Gerar conteúdo', subtitle: 'Ir para Sessions', keywords: ['gerar', 'post', 'conteudo'], targetView: View.SESSIONS },
  { id: 'act-4', workspace_id: 'ws-1', entity_type: 'ACTION', title: 'Ir para Dashboard', subtitle: 'Visão geral', keywords: ['dash', 'home', 'inicio'], targetView: View.DASHBOARD },
  
  // Conteúdos
  { id: 'cnt-1', workspace_id: 'ws-1', entity_type: 'CONTENT', title: '5 Erros de Escala', subtitle: 'Carrossel • Em Produção', keywords: ['escala', 'erros', 'carrossel'], targetView: View.SESSIONS },
  { id: 'cnt-2', workspace_id: 'ws-1', entity_type: 'CONTENT', title: 'Manifesto da Marca', subtitle: 'Artigo • Publicado', keywords: ['manifesto', 'branding', 'texto'], targetView: View.SESSIONS },
  { id: 'cnt-3', workspace_id: 'ws-1', entity_type: 'CONTENT', title: 'Lançamento Q3', subtitle: 'Vídeo • Planejado', keywords: ['lancamento', 'video'], targetView: View.SESSIONS },

  // Estratégias
  { id: 'str-1', workspace_id: 'ws-1', entity_type: 'STRATEGY', title: 'Posicionamento Tech', subtitle: 'Arquétipo: Criador', keywords: ['tech', 'posicionamento'], targetView: View.STRATEGY },
  { id: 'str-2', workspace_id: 'ws-1', entity_type: 'STRATEGY', title: 'Expansão B2B', subtitle: 'Blueprint Ativo', keywords: ['b2b', 'vendas'], targetView: View.STRATEGY },

  // Módulos
  { id: 'mod-1', workspace_id: 'ws-1', entity_type: 'MODULE', title: 'Pulse Trends', subtitle: 'Inteligência de Mercado', keywords: ['pulse', 'trends'], targetView: View.PULSE },
  { id: 'mod-2', workspace_id: 'ws-1', entity_type: 'MODULE', title: 'Visual Studio', subtitle: 'Editor Gráfico', keywords: ['visual', 'editor', 'design'], targetView: View.VISUAL_STUDIO },
];

const QUICK_ACTIONS = MOCK_DB.filter(i => i.entity_type === 'ACTION');

export const CommandCenter: React.FC<CommandCenterProps> = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>(QUICK_ACTIONS);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setResults(QUICK_ACTIONS);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Search Logic (Debounced)
  useEffect(() => {
    if (!isOpen) return;

    const performSearch = () => {
      if (query.length < 2) {
        setResults(QUICK_ACTIONS);
        setLoading(false);
        return;
      }

      setLoading(true);
      
      // Simulate API latency
      setTimeout(() => {
        const lowerQuery = query.toLowerCase();
        const filtered = MOCK_DB.filter(item => 
          item.title.toLowerCase().includes(lowerQuery) || 
          item.keywords.some(k => k.includes(lowerQuery)) ||
          item.subtitle.toLowerCase().includes(lowerQuery)
        );
        
        // Group and Limit logic would happen in SQL, simulated here:
        // We just take the flat filtered list for simplicity in V1, but sorted by type priority
        const sorted = filtered.sort((a, b) => a.entity_type.localeCompare(b.entity_type));
        
        setResults(sorted);
        setLoading(false);
        setSelectedIndex(0);
      }, 300);
    };

    const debounce = setTimeout(performSearch, 300);
    return () => clearTimeout(debounce);
  }, [query, isOpen]);

  // Keyboard Navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % results.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (results[selectedIndex]) {
          handleSelect(results[selectedIndex]);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex]);

  const handleSelect = (item: SearchResult) => {
    if (item.targetView) {
      onNavigate(item.targetView, item.entity_id);
    }
    onClose();
  };

  // Grouping for Display
  const groupedResults = results.reduce((acc, item) => {
    if (!acc[item.entity_type]) acc[item.entity_type] = [];
    if (acc[item.entity_type].length < 5) { // Max 5 per category
      acc[item.entity_type].push(item);
    }
    return acc;
  }, {} as Record<string, SearchResult[]>);

  // Helper to map flat index to grouped item for highlighting
  const flatList: SearchResult[] = Object.values(groupedResults).reduce((acc, val) => [...acc, ...val], [] as SearchResult[]);

  // Icons Map
  const getIcon = (type: string) => {
    switch (type) {
      case 'ACTION': return <Zap className="h-4 w-4" />;
      case 'CONTENT': return <FileText className="h-4 w-4" />;
      case 'STRATEGY': return <Compass className="h-4 w-4" />;
      case 'MODULE': return <Layout className="h-4 w-4" />;
      case 'USER': return <User className="h-4 w-4" />;
      default: return <Search className="h-4 w-4" />;
    }
  };

  const getLabel = (type: string) => {
    switch (type) {
      case 'ACTION': return 'Ações Rápidas';
      case 'CONTENT': return 'Conteúdos';
      case 'STRATEGY': return 'Estratégias';
      case 'MODULE': return 'Módulos';
      case 'USER': return 'Usuários';
      default: return 'Outros';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[70vh]">
        
        {/* Header / Input */}
        <div className="flex items-center px-4 py-3 border-b border-gray-100 gap-3">
          <Search className="h-5 w-5 text-gray-400 shrink-0" />
          <input 
            ref={inputRef}
            className="flex-1 bg-transparent text-lg text-gray-900 placeholder:text-gray-400 focus:outline-none h-10"
            placeholder="Pesquisar ou executar comando..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="flex items-center gap-2">
            {loading && <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />}
            <kbd className="hidden md:inline-flex h-5 select-none items-center gap-1 rounded border bg-gray-50 px-1.5 font-mono text-[10px] font-medium text-gray-500 opacity-100">
              <span className="text-xs">ESC</span>
            </kbd>
          </div>
        </div>

        {/* Results Body */}
        <div className="flex-1 overflow-y-auto p-2 scroll-py-2">
          {flatList.length === 0 && !loading ? (
            <div className="py-12 text-center text-sm text-gray-500">
              <p>Nenhum resultado encontrado para "{query}"</p>
            </div>
          ) : (
            Object.entries(groupedResults).map(([type, items]) => (
              <div key={type} className="mb-2">
                <div className="px-2 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  {getLabel(type)}
                </div>
                {items.map((item) => {
                  // Find the true index in the flat list to compare with selectedIndex
                  // This is a simplified lookup for visual state
                  const isSelected = flatList[selectedIndex]?.id === item.id;

                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelect(item)}
                      className={`
                        group flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-sm transition-colors
                        ${isSelected ? 'bg-trust-primary text-white' : 'text-gray-700 hover:bg-gray-100'}
                      `}
                    >
                      <div className={`p-1.5 rounded-md ${isSelected ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-white group-hover:text-gray-700'}`}>
                        {getIcon(item.entity_type)}
                      </div>
                      
                      <div className="flex-1 flex flex-col">
                        <span className={`font-medium ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                          {item.title}
                        </span>
                        <span className={`text-xs ${isSelected ? 'text-indigo-100' : 'text-gray-400'}`}>
                          {item.subtitle}
                        </span>
                      </div>

                      {item.entity_type === 'ACTION' && (
                        <div className={`opacity-0 group-hover:opacity-100 transition-opacity ${isSelected ? 'opacity-100 text-indigo-100' : 'text-gray-400'}`}>
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t border-gray-100 px-4 py-2 flex items-center justify-between text-[10px] text-gray-400">
          <div className="flex gap-4">
            <span className="flex items-center gap-1">
              <Command className="h-3 w-3" /> <span className="font-bold">K</span> para abrir
            </span>
            <span className="flex items-center gap-1">
              <ArrowRight className="h-3 w-3 rotate-90" /> <span className="font-bold">Enter</span> para selecionar
            </span>
          </div>
          <div>
            Flui Command Center v1.0
          </div>
        </div>

      </div>
    </div>
  );
};
