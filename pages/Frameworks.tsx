
import React, { useState, useEffect } from 'react';
import { StrategyCore } from '../types';
import { Button, Card, Badge, Modal } from '../components/UI';
import { 
  Zap, BrainCircuit, Shield, BookOpen, Layers, Target, 
  ArrowRight, Check, Star, X, LayoutTemplate, Sparkles, Filter, 
  Lightbulb, AlertCircle, PenTool, TrendingUp, Grid
} from 'lucide-react';

interface Framework {
  id: string;
  name: string;
  category: 'Conversão' | 'Educação' | 'Autoridade' | 'Storytelling' | 'Estrutura Modular';
  indication: string;
  structure: string[];
  recommendedGoals: string[]; // Goals from StrategyCore (e.g. 'Vender', 'Autoridade')
  description: string;
  whenToUse: string;
  example: string;
}

const ALL_FRAMEWORKS: Framework[] = [
  // CONVERSÃO
  {
    id: 'aida',
    name: 'AIDA',
    category: 'Conversão',
    indication: 'Ideal para conteúdos com foco em conversão direta.',
    structure: ['A - Atenção', 'I - Interesse', 'D - Desejo', 'A - Ação'],
    recommendedGoals: ['Vender', 'Gerar Leads', 'Sales', 'Leads'],
    description: 'O framework clássico. Primeiro capture a Atenção, segure o Interesse com novidade, crie Desejo pela transformação e finalize com uma Ação clara.',
    whenToUse: 'Use em páginas de vendas, e-mails de oferta ou posts de fundo de funil.',
    example: 'Atenção: "Você está perdendo dinheiro." -> Interesse: "A inflação corroeu 10% da sua renda." -> Desejo: "Imagine blindar seu patrimônio." -> Ação: "Clique aqui."'
  },
  {
    id: 'pas',
    name: 'PAS',
    category: 'Conversão',
    indication: 'Foca na dor para gerar alívio imediato com sua solução.',
    structure: ['P - Problema', 'A - Agitação', 'S - Solução'],
    recommendedGoals: ['Vender', 'Gerar Leads'],
    description: 'Fórmula de conversão baseada em dor. Defina o Problema, Agite as consequências de não resolvê-lo e apresente sua oferta como a Solução definitiva.',
    whenToUse: 'Ótimo para anúncios e e-mails frios onde a dor é latente.',
    example: 'Problema: "Cansado de dietas que falham?" -> Agitação: "Cada falha diminui seu metabolismo." -> Solução: "Conheça o método metabólico."'
  },
  {
    id: '4u',
    name: '4 U\'s',
    category: 'Conversão',
    indication: 'Para headlines e assuntos de e-mail irresistíveis.',
    structure: ['U - Urgente', 'U - Único', 'U - Útil', 'U - Ultra-específico'],
    recommendedGoals: ['Vender', 'Atrair', 'Leads'],
    description: 'Os 4 pilares de uma headline magnética. Sua promessa deve ser Urgente, Única, Útil e Ultra-específica para ser impossível de ignorar.',
    whenToUse: 'Sempre que precisar escrever um título ou assunto de email.',
    example: 'Urgente: "Hoje", Único: "Método X", Útil: "Ganhe tempo", Específico: "Em 15 minutos".'
  },
  {
    id: 'bab',
    name: 'Before-After-Bridge',
    category: 'Conversão',
    indication: 'Mostra a transformação clara do estado atual para o desejado.',
    structure: ['Before (Antes)', 'After (Depois)', 'Bridge (Ponte)'],
    recommendedGoals: ['Vender', 'Autoridade'],
    description: 'Pinta o cenário de dor atual, vislumbra o paraíso futuro e apresenta seu produto como a ponte.',
    whenToUse: 'Testimonials e estudos de caso curtos.',
    example: 'Antes: "Estava falido." -> Depois: "Hoje faturo 10k." -> Ponte: "O curso de finanças."'
  },

  // EDUCAÇÃO
  {
    id: 'inverted-pyramid',
    name: 'Pirâmide Invertida',
    category: 'Educação',
    indication: 'Entrega valor rápido para reter a atenção.',
    structure: ['Conclusão Primeiro', 'Detalhes Importantes', 'Contexto/Background'],
    recommendedGoals: ['Educar Mercado', 'Education', 'Atrair'],
    description: 'Começa com a informação mais vital. Respeita o tempo do leitor e garante que a mensagem principal seja entregue mesmo em leituras rápidas.',
    whenToUse: 'Notícias, atualizações de produto e posts técnicos.',
    example: 'Conclusão: "Lançamos a nova feature." -> Detalhes: "Ela permite X e Y." -> Contexto: "Ouvimos o feedback de..."'
  },
  {
    id: 'feynman',
    name: 'Método Feynman',
    category: 'Educação',
    indication: 'Simplifica conceitos complexos para leigos.',
    structure: ['Conceito', 'Explicação Simples', 'Analogia', 'Refinamento'],
    recommendedGoals: ['Educar Mercado', 'Autoridade'],
    description: 'Baseado na técnica do físico Richard Feynman. Se você não consegue explicar simples, você não entendeu.',
    whenToUse: 'Ao explicar termos técnicos, leis ou tecnologias novas.',
    example: 'Conceito: "Blockchain" -> Explicação: "Livro razão público" -> Analogia: "Como um grupo de WhatsApp onde ninguém apaga mensagem."'
  },
  {
    id: 'pcs',
    name: 'Prob-Causa-Solução',
    category: 'Educação',
    indication: 'Diagnóstico lógico de uma situação.',
    structure: ['Problema', 'Causa Raiz', 'Solução Lógica'],
    recommendedGoals: ['Educar Mercado', 'Autoridade'],
    description: 'Diferente do PAS (emocional), este é analítico. Explica tecnicamente por que algo acontece.',
    whenToUse: 'Artigos de blog, tutoriais técnicos.',
    example: 'Problema: "Site lento." -> Causa: "Imagens pesadas." -> Solução: "Compressão WebP."'
  },

  // AUTORIDADE
  {
    id: 'case-study',
    name: 'Estudo de Caso',
    category: 'Autoridade',
    indication: 'Prova sua competência através de resultados reais.',
    structure: ['Desafio', 'Abordagem', 'Resultado (Métrica)', 'Lição'],
    recommendedGoals: ['Autoridade', 'Vender', 'Authority'],
    description: 'A prova social definitiva. Não diz que é bom, mostra o que fez.',
    whenToUse: 'Fundo de funil, portfólio, posts de LinkedIn.',
    example: 'Desafio: "Lead caro." -> Abordagem: "Mudei o criativo." -> Resultado: "-50% CPC." -> Lição: "Teste A/B é vida."'
  },
  {
    id: 'insight',
    name: 'Insight Proprietário',
    category: 'Autoridade',
    indication: 'Posiciona você como pensador original.',
    structure: ['Status Quo', 'Minha Observação', 'Nova Tese', 'Implicação'],
    recommendedGoals: ['Autoridade', 'Disruptivo'],
    description: 'Desafia o senso comum do mercado com uma visão única sua.',
    whenToUse: 'Conteúdos de liderança de pensamento (Thought Leadership).',
    example: 'Status Quo: "Poste todo dia." -> Obs: "Isso gera burnout." -> Tese: "Poste menos e melhor." -> Implicação: "Qualidade > Quantidade."'
  },

  // STORYTELLING
  {
    id: 'hero-journey',
    name: 'Jornada do Herói',
    category: 'Storytelling',
    indication: 'Cria conexão emocional profunda.',
    structure: ['Mundo Comum', 'Chamado', 'Provação', 'Retorno Transformado'],
    recommendedGoals: ['Atrair', 'Branding', 'Audience'],
    description: 'A estrutura clássica de mitos e filmes. Humaniza a marca.',
    whenToUse: 'Página "Sobre", vídeos longos, histórias de fundação.',
    example: 'Mundo Comum: "Era CLT." -> Chamado: "Fui demitido." -> Provação: "Quase fali a empresa." -> Retorno: "Hoje ensino outros."'
  },
  {
    id: 'story-lesson',
    name: 'Story-Lesson-CTA',
    category: 'Storytelling',
    indication: 'Formato nativo de redes sociais (LinkedIn/Insta).',
    structure: ['Micro-história', 'Lição Moral/Técnica', 'Aplicação (CTA)'],
    recommendedGoals: ['Atrair', 'Engajamento'],
    description: 'Usa uma anedota rápida para ensinar algo valioso.',
    whenToUse: 'Posts diários de engajamento.',
    example: 'História: "Ontem o cliente gritou comigo." -> Lição: "Mantenha a calma." -> CTA: "Como você lida com crise?"'
  }
];

interface FrameworksProps {
  strategy: StrategyCore | null;
  onApply: (frameworkId: string) => void;
}

export const Frameworks: React.FC<FrameworksProps> = ({ strategy, onApply }) => {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [selectedFramework, setSelectedFramework] = useState<Framework | null>(null);
  
  // Intro State
  const [showIntro, setShowIntro] = useState(() => {
    // Check local storage for persistence
    try {
      return localStorage.getItem('flui_frameworks_intro') !== 'true';
    } catch (e) {
      return true;
    }
  });

  const handleDismissIntro = () => {
    try {
      localStorage.setItem('flui_frameworks_intro', 'true');
    } catch (e) {}
    setShowIntro(false);
  };

  // --- FILTERS LOGIC ---
  const FILTERS = [
    { label: 'Atrair Atenção', category: 'Storytelling' },
    { label: 'Educar Mercado', category: 'Educação' },
    { label: 'Construir Autoridade', category: 'Autoridade' },
    { label: 'Gerar Conversão', category: 'Conversão' },
  ];

  const toggleFilter = (category: string) => {
    setActiveFilters(prev => 
      prev.includes(category) 
      ? prev.filter(c => c !== category) 
      : [...prev, category]
    );
  };

  const filteredFrameworks = activeFilters.length === 0 
    ? ALL_FRAMEWORKS 
    : ALL_FRAMEWORKS.filter(fw => activeFilters.includes(fw.category));

  // --- STRATEGY ALIGNMENT CHECK ---
  const isRecommended = (fw: Framework) => {
    if (!strategy) return false;
    const goalMatch = fw.recommendedGoals.some(g => strategy.strategicPositioning.result.includes(g));
    return goalMatch;
  };

  const getCategoryIcon = (cat: string) => {
    switch(cat) {
      case 'Conversão': return <Zap className="h-4 w-4" />;
      case 'Educação': return <BrainCircuit className="h-4 w-4" />;
      case 'Autoridade': return <Shield className="h-4 w-4" />;
      case 'Storytelling': return <BookOpen className="h-4 w-4" />;
      default: return <Layers className="h-4 w-4" />;
    }
  };

  const getCategoryStyles = (cat: string) => {
    switch(cat) {
      case 'Conversão': 
        return { 
          bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'hover:border-emerald-300', 
          badge: 'bg-emerald-100 text-emerald-800', iconBg: 'bg-emerald-100', activeFilter: 'bg-emerald-600 text-white border-emerald-600',
          accent: 'border-emerald-200'
        };
      case 'Educação': 
        return { 
          bg: 'bg-blue-50', text: 'text-blue-700', border: 'hover:border-blue-300', 
          badge: 'bg-blue-100 text-blue-800', iconBg: 'bg-blue-100', activeFilter: 'bg-blue-600 text-white border-blue-600',
          accent: 'border-blue-200'
        };
      case 'Autoridade': 
        return { 
          bg: 'bg-purple-50', text: 'text-purple-700', border: 'hover:border-purple-300', 
          badge: 'bg-purple-100 text-purple-800', iconBg: 'bg-purple-100', activeFilter: 'bg-purple-600 text-white border-purple-600',
          accent: 'border-purple-200'
        };
      case 'Storytelling': 
        return { 
          bg: 'bg-amber-50', text: 'text-amber-700', border: 'hover:border-amber-300', 
          badge: 'bg-amber-100 text-amber-800', iconBg: 'bg-amber-100', activeFilter: 'bg-amber-500 text-white border-amber-500',
          accent: 'border-amber-200'
        };
      default: 
        return { 
          bg: 'bg-gray-50', text: 'text-gray-700', border: 'hover:border-gray-300', 
          badge: 'bg-gray-100 text-gray-800', iconBg: 'bg-gray-100', activeFilter: 'bg-gray-900 text-white border-gray-900',
          accent: 'border-gray-200'
        };
    }
  };

  // --- INTRO SCREEN RENDERER ---
  if (showIntro) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8 animate-fade-in relative overflow-hidden">
        {/* Decorative BG */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-trust-primary/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-energy-primary/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-5xl w-full text-center space-y-12 relative z-10">
          
          {/* Header */}
          <div className="space-y-6">
             <div className="inline-flex items-center justify-center p-3 bg-white rounded-2xl shadow-sm border border-gray-100 mb-2">
                <Grid className="h-8 w-8 text-trust-primary" />
             </div>
             <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 leading-tight max-w-3xl mx-auto">
               Estrutura é o que transforma ideias em autoridade.
             </h1>
             <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
               Frameworks organizam sua mensagem para gerar clareza, retenção e ação.
             </p>
          </div>
  
          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
             <Card className="p-8 border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                <div className="h-12 w-12 bg-indigo-50 rounded-xl flex items-center justify-center text-trust-primary mb-6">
                   <Layers className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Clareza antes da criatividade</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                   Estruturas organizam sua mensagem antes da escrita começar.
                </p>
             </Card>

             <Card className="p-8 border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                <div className="h-12 w-12 bg-purple-50 rounded-xl flex items-center justify-center text-energy-primary mb-6">
                   <PenTool className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Menos bloqueio, mais fluidez</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                   Com uma base definida, você evita a página em branco.
                </p>
             </Card>

             <Card className="p-8 border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                <div className="h-12 w-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 mb-6">
                   <TrendingUp className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Mais retenção e impacto</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                   Conteúdos estruturados geram mais compreensão e ação.
                </p>
             </Card>
          </div>
  
          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
             <Button variant="gradient" size="lg" className="h-14 px-8 text-base shadow-xl hover:shadow-2xl" onClick={handleDismissIntro}>
                Explorar Frameworks <ArrowRight className="ml-2 h-5 w-5"/>
             </Button>
             <Button variant="ghost" size="lg" className="h-14 px-8 text-gray-500 hover:text-gray-900" onClick={handleDismissIntro}>
                Entendi
             </Button>
          </div>
        </div>
      </div>
    );
  }

  // --- MAIN RENDERER ---
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 animate-fade-in relative">
      
      {/* MAIN CONTENT */}
      <div className="flex-1 overflow-y-auto p-8">
        
        {/* 1. HEADER */}
        <div className="mb-10 max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
             <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-100">
                <LayoutTemplate className="h-6 w-6 text-trust-primary" />
             </div>
             <h1 className="text-3xl font-serif font-bold text-gray-900">Frameworks</h1>
             {strategy && (
               <Badge variant="trust" className="flex items-center gap-1 ml-2">
                 <Check className="h-3 w-3" /> Estratégia v{strategy.version}
               </Badge>
             )}
          </div>
          <p className="text-gray-500 max-w-2xl text-lg">
            Estruturas técnicas para construir conteúdos com intenção estratégica.
            Não comece do zero, comece com um plano.
          </p>
        </div>

        {/* 2. FILTERS */}
        <div className="mb-10 max-w-7xl mx-auto">
           <div className="flex flex-wrap gap-3">
              {FILTERS.map((f) => {
                 const isActive = activeFilters.includes(f.category);
                 const styles = getCategoryStyles(f.category);
                 return (
                   <button
                     key={f.label}
                     onClick={() => toggleFilter(f.category)}
                     className={`px-5 py-2.5 rounded-full border text-sm font-bold transition-all shadow-sm flex items-center gap-2 ${
                       isActive
                       ? `${styles.activeFilter} shadow-md scale-105`
                       : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                     }`}
                   >
                     {isActive && <Check className="h-3.5 w-3.5" />}
                     {f.label}
                   </button>
                 );
              })}
           </div>
        </div>

        {/* 3. GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-20 max-w-7xl mx-auto">
           {filteredFrameworks.map((fw) => {
             const recommended = isRecommended(fw);
             const styles = getCategoryStyles(fw.category);
             const isActive = selectedFramework?.id === fw.id;

             return (
               <div 
                 key={fw.id}
                 className={`group bg-white rounded-2xl border p-6 cursor-pointer transition-all duration-300 flex flex-col justify-between h-[340px] relative overflow-hidden ${
                   isActive 
                   ? `ring-2 ring-trust-primary shadow-lg scale-[1.02]` 
                   : `border-gray-200 hover:shadow-xl ${styles.border}`
                 }`}
                 onClick={() => setSelectedFramework(fw)}
               >
                  <div>
                     <div className="flex justify-between items-start mb-5">
                        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${styles.iconBg} ${styles.text}`}>
                           {getCategoryIcon(fw.category)}
                        </div>
                        {recommended && (
                           <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-1 rounded-full text-[10px] font-bold border border-yellow-100">
                              <Star className="h-3 w-3 fill-current" /> Sugerido
                           </div>
                        )}
                     </div>

                     <div className="mb-2">
                        <span className={`text-[10px] uppercase font-bold tracking-wider ${styles.text}`}>
                           {fw.category}
                        </span>
                     </div>

                     <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-trust-primary transition-colors">
                        {fw.name}
                     </h3>
                     <p className="text-sm text-gray-500 leading-relaxed mb-6">
                        {fw.indication}
                     </p>
                  </div>

                  <div className="pt-6 mt-auto border-t border-gray-50 flex items-center justify-between text-sm font-bold text-gray-400 group-hover:text-trust-primary transition-colors">
                     Ver estrutura completa
                     <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
               </div>
             );
           })}
        </div>
      </div>

      {/* 4. DETAIL MODAL */}
      <Modal
        isOpen={!!selectedFramework}
        onClose={() => setSelectedFramework(null)}
        title={selectedFramework?.name}
        maxWidth="max-w-3xl"
      >
         {selectedFramework && (
            <div className="mt-2 space-y-8">
               {/* 1. Header Info */}
               <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                     <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border bg-white ${getCategoryStyles(selectedFramework.category).accent} ${getCategoryStyles(selectedFramework.category).text}`}>
                        {selectedFramework.category}
                     </span>
                     {isRecommended(selectedFramework) && (
                        <span className="flex items-center gap-1 text-xs font-bold text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full border border-yellow-100">
                           <Star className="h-3 w-3 fill-current" /> Recomendado para sua estratégia
                        </span>
                     )}
                  </div>
                  
                  <p className="text-lg text-gray-700 leading-relaxed font-medium">
                     {selectedFramework.description}
                  </p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* 2. Structure */}
                  <div className={`p-6 rounded-2xl border bg-white ${getCategoryStyles(selectedFramework.category).accent}`}>
                     <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Layers className="h-4 w-4" /> Passo a Passo
                     </h3>
                     <div className="space-y-4 relative">
                        {/* Connecting Line */}
                        <div className="absolute left-[11px] top-2 bottom-4 w-0.5 bg-gray-100 -z-10"></div>
                        
                        {selectedFramework.structure.map((step, idx) => (
                           <div key={idx} className="flex items-start gap-4">
                              <div className={`mt-0.5 h-6 w-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 bg-white border-2 ${getCategoryStyles(selectedFramework.category).text.replace('text-', 'border-')}`}>
                                 {idx + 1}
                              </div>
                              <div className="flex-1 pt-0.5 bg-white">
                                 <span className="font-bold text-gray-900 block mb-1">{step}</span>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>

                  {/* 3. Context & Example */}
                  <div className="space-y-6">
                     <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                           <Target className="h-4 w-4" /> Quando usar
                        </h3>
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm text-gray-600 leading-relaxed flex gap-3">
                           <Lightbulb className="h-5 w-5 text-gray-400 shrink-0 mt-0.5" />
                           {selectedFramework.whenToUse}
                        </div>
                     </div>

                     <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                           <BookOpen className="h-4 w-4" /> Exemplo Prático
                        </h3>
                        <div className={`p-5 rounded-xl border-l-4 italic text-gray-700 text-sm shadow-sm bg-white ${getCategoryStyles(selectedFramework.category).border}`}>
                           "{selectedFramework.example}"
                        </div>
                     </div>
                  </div>
               </div>

               {/* Footer Action */}
               <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
                  <Button variant="ghost" onClick={() => setSelectedFramework(null)}>
                     Cancelar
                  </Button>
                  <Button 
                     className={`text-white border-0 shadow-lg ${getCategoryStyles(selectedFramework.category).activeFilter.replace('border-', 'border-transparent bg-')}`} 
                     onClick={() => onApply(selectedFramework.id)}
                  >
                     <Sparkles className="h-4 w-4 mr-2" />
                     Aplicar Framework
                  </Button>
               </div>
            </div>
         )}
      </Modal>

      {/* 5. GLOBAL CTA (If no strategy) */}
      {!strategy && (
         <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-4 z-40 animate-slide-up">
            <span className="text-sm font-medium">Defina sua estratégia no Studio para recomendações precisas.</span>
            <Button variant="secondary" size="sm" className="h-8 text-xs">Ir para Studio</Button>
         </div>
      )}

    </div>
  );
};
