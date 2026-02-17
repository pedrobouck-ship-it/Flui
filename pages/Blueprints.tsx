
import React, { useState } from 'react';
import { Blueprint, BlueprintStatus, StrategyCore, ContentPillar } from '../types';
import { Button, Card, Badge, Modal, Input, Label, Slider } from '../components/UI';
import { 
  Plus, LayoutTemplate, Target, Layers, Zap, Calendar, 
  ArrowRight, Check, Wand2, MoreHorizontal 
} from 'lucide-react';

interface BlueprintsProps {
  strategy: StrategyCore | null;
  blueprints: Blueprint[];
  onAddBlueprint: (bp: Blueprint) => void;
  onViewDetail: (id: string) => void;
}

export const Blueprints: React.FC<BlueprintsProps> = ({ strategy, blueprints, onAddBlueprint, onViewDetail }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Modal State
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    objective: '',
    pillars: [] as string[],
    intensity: 50,
    duration: '30 Dias'
  });

  // --- Handlers ---
  const handleCreate = async () => {
    setLoading(true);
    
    // Simulate Webhook Call
    console.log("POST /api/webhooks/generate-blueprint", {
       strategyId: strategy?.version,
       inputs: formData
    });

    setTimeout(() => {
       const newBlueprint: Blueprint = {
         id: `bp-${Date.now()}`,
         name: `${formData.objective} - Ciclo Tático`,
         status: BlueprintStatus.ACTIVE,
         objective: formData.objective,
         intensity: formData.intensity,
         duration: formData.duration,
         pillars: formData.pillars,
         createdAt: new Date().toISOString(),
         themes: [
           {
             id: 't1',
             title: 'Autoridade Técnica',
             focus: 'Educacional',
             series: [
               { id: 's1', title: 'Deep Dive de Produto', angle: 'Engenharia Reversa', frequency: 'Semanal', format: 'Carrossel', items: [] },
               { id: 's2', title: 'Erros de Mercado', angle: 'Contraintuitivo', frequency: 'Quinzenal', format: 'Vídeo Longo', items: [] }
             ]
           },
           {
             id: 't2',
             title: 'Prova Social',
             focus: 'Conversão',
             series: [
               { id: 's3', title: 'Bastidores da Operação', angle: 'Transparência Radical', frequency: 'Semanal', format: 'Stories', items: [] }
             ]
           }
         ]
       };
       
       onAddBlueprint(newBlueprint);
       setLoading(false);
       setIsModalOpen(false);
       setStep(1);
       setFormData({ objective: '', pillars: [], intensity: 50, duration: '30 Dias' });
       onViewDetail(newBlueprint.id); // Auto redirect to detail
    }, 2500);
  };

  const togglePillar = (name: string) => {
    if (formData.pillars.includes(name)) {
      setFormData({...formData, pillars: formData.pillars.filter(p => p !== name)});
    } else {
      if (formData.pillars.length < 3) {
        setFormData({...formData, pillars: [...formData.pillars, name]});
      }
    }
  };

  // --- Render ---
  return (
    <div className="max-w-7xl mx-auto px-8 py-8 h-full flex flex-col">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold font-serif text-gray-900 tracking-tight">Blueprints</h1>
          <p className="text-gray-500 mt-1">Estrutura macro do seu sistema de conteúdo.</p>
        </div>
        <Button variant="trust" onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Criar Blueprint
        </Button>
      </div>

      {/* Content */}
      {blueprints.length === 0 ? (
        // Empty State
        <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
           <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
             <LayoutTemplate className="h-8 w-8 text-gray-400" />
           </div>
           <h3 className="text-xl font-bold text-gray-900 mb-2 font-serif">Você ainda não criou seu primeiro Blueprint.</h3>
           <p className="text-gray-500 max-w-md text-center mb-8">
             Blueprints são planos estratégicos de conteúdo gerados via IA baseados nos seus pilares e objetivos de negócio.
           </p>
           <Button variant="trust" onClick={() => setIsModalOpen(true)}>
             Criar meu primeiro Blueprint
           </Button>
        </div>
      ) : (
        // Grid State
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blueprints.map(bp => (
            <div 
              key={bp.id}
              onClick={() => onViewDetail(bp.id)}
              className="group bg-white rounded-xl border border-gray-200 p-6 cursor-pointer hover:shadow-hover hover:border-trust-primary/30 transition-all duration-300 relative overflow-hidden"
            >
               {/* Status Line */}
               <div className={`absolute top-0 left-0 w-full h-1 ${bp.status === BlueprintStatus.ACTIVE ? 'bg-energy-primary' : 'bg-gray-300'}`} />
               
               <div className="flex justify-between items-start mb-4">
                 <Badge variant={bp.status === BlueprintStatus.ACTIVE ? 'trust' : 'secondary'}>
                    {bp.status}
                 </Badge>
                 <button className="text-gray-300 hover:text-gray-600">
                    <MoreHorizontal className="h-5 w-5" />
                 </button>
               </div>

               <h3 className="text-xl font-bold font-serif text-gray-900 mb-2 group-hover:text-trust-primary transition-colors">
                 {bp.name}
               </h3>
               
               <p className="text-sm text-gray-500 mb-6 flex items-center gap-2">
                 <Target className="h-4 w-4" /> {bp.objective}
               </p>

               <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs text-gray-500 font-medium uppercase tracking-wider">
                     <Layers className="h-3 w-3" /> Pilares
                  </div>
                  <div className="flex flex-wrap gap-2">
                     {bp.pillars.map(p => (
                       <span key={p} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                         {p}
                       </span>
                     ))}
                  </div>
               </div>

               <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
                  <div className="flex gap-4">
                     <span>{bp.themes.length} Temas</span>
                     <span>{bp.themes.reduce((acc, t) => acc + t.series.length, 0)} Séries</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-trust-primary group-hover:translate-x-1 transition-all" />
               </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => !loading && setIsModalOpen(false)}
        title="Novo Blueprint Estratégico"
        maxWidth="max-w-2xl"
      >
        {!loading ? (
          <div className="mt-4">
             {/* Stepper */}
             <div className="flex justify-between items-center mb-8 px-4">
                {[1, 2, 3, 4, 5].map((s) => (
                  <div key={s} className="flex flex-col items-center gap-1">
                     <div className={`h-2 w-12 rounded-full transition-colors ${step >= s ? 'bg-trust-primary' : 'bg-gray-200'}`} />
                  </div>
                ))}
             </div>

             <div className="min-h-[320px]">
                {/* Step 1: Objective */}
                {step === 1 && (
                   <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                      <Label className="text-lg">Qual o objetivo principal deste ciclo?</Label>
                      <div className="grid grid-cols-2 gap-4">
                         {['Autoridade Máxima', 'Geração de Leads', 'Lançamento', 'Retenção'].map(obj => (
                           <div 
                             key={obj}
                             onClick={() => setFormData({...formData, objective: obj})}
                             className={`p-4 border rounded-xl cursor-pointer transition-all ${
                               formData.objective === obj ? 'border-trust-primary bg-indigo-50 ring-1 ring-trust-primary' : 'border-gray-200 hover:bg-gray-50'
                             }`}
                           >
                             <span className="font-medium text-gray-900">{obj}</span>
                           </div>
                         ))}
                      </div>
                   </div>
                )}

                {/* Step 2: Pillars */}
                {step === 2 && (
                   <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                      <Label className="text-lg">Selecione os pilares ativos (Máx 3)</Label>
                      <div className="flex flex-wrap gap-3">
                         {strategy?.pillars.map(p => (
                           <button 
                             key={p.id}
                             onClick={() => togglePillar(p.name)}
                             className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                               formData.pillars.includes(p.name) 
                               ? 'bg-trust-primary text-white border-trust-primary' 
                               : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                             }`}
                           >
                             {p.name}
                           </button>
                         )) || <p className="text-gray-500">Nenhum pilar encontrado na estratégia.</p>}
                      </div>
                   </div>
                )}

                {/* Step 3: Intensity */}
                {step === 3 && (
                   <div className="space-y-8 animate-in fade-in slide-in-from-right-4 px-2">
                      <Label className="text-lg">Intensidade de Produção</Label>
                      <div className="pt-8">
                        <Slider 
                          value={formData.intensity} 
                          onValueChange={(val) => setFormData({...formData, intensity: val})}
                        />
                        <div className="flex justify-between mt-4 text-sm text-gray-500">
                           <span>Baixa (MVP)</span>
                           <span>Moderada</span>
                           <span>Alta (Blitz)</span>
                        </div>
                        <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
                           {formData.intensity < 30 && "Foco na qualidade extrema de poucas peças."}
                           {formData.intensity >= 30 && formData.intensity < 70 && "Equilíbrio ideal entre volume e profundidade."}
                           {formData.intensity >= 70 && "Dominação de canais com alto volume de assets."}
                        </div>
                      </div>
                   </div>
                )}

                {/* Step 4: Duration */}
                {step === 4 && (
                   <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                      <Label className="text-lg">Duração do Ciclo</Label>
                      <div className="grid grid-cols-3 gap-4">
                         {['15 Dias', '30 Dias', 'Trimestral'].map(dur => (
                           <button
                             key={dur}
                             onClick={() => setFormData({...formData, duration: dur})}
                             className={`py-3 px-4 rounded-lg border font-medium transition-all ${
                               formData.duration === dur ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                             }`}
                           >
                             {dur}
                           </button>
                         ))}
                      </div>
                   </div>
                )}

                {/* Step 5: Review */}
                {step === 5 && (
                   <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                      <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
                         <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                           <Rocket className="h-5 w-5 text-trust-primary" /> Resumo do Blueprint
                         </h3>
                         <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                               <span className="text-gray-500">Objetivo</span>
                               <span className="font-medium text-gray-900">{formData.objective}</span>
                            </div>
                            <div className="flex justify-between">
                               <span className="text-gray-500">Duração</span>
                               <span className="font-medium text-gray-900">{formData.duration}</span>
                            </div>
                            <div className="flex justify-between">
                               <span className="text-gray-500">Intensidade</span>
                               <span className="font-medium text-gray-900">{formData.intensity}%</span>
                            </div>
                            <div className="pt-3 border-t border-indigo-200">
                               <span className="text-gray-500 block mb-2">Pilares Selecionados:</span>
                               <div className="flex flex-wrap gap-2">
                                  {formData.pillars.map(p => (
                                    <span key={p} className="bg-white text-indigo-800 px-2 py-1 rounded border border-indigo-100 text-xs font-semibold">
                                      {p}
                                    </span>
                                  ))}
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>
                )}
             </div>

             {/* Footer */}
             <div className="flex justify-between pt-6 border-t border-gray-100 mt-4">
                <Button 
                   variant="ghost" 
                   onClick={() => setStep(s => Math.max(1, s - 1))}
                   disabled={step === 1}
                 >
                   Voltar
                </Button>
                {step < 5 ? (
                  <Button onClick={() => setStep(s => Math.min(5, s + 1))}>
                     Próximo
                  </Button>
                ) : (
                  <Button variant="trust" onClick={handleCreate}>
                     <Wand2 className="h-4 w-4 mr-2" />
                     Gerar Blueprint
                  </Button>
                )}
             </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 animate-in fade-in">
             <div className="h-16 w-16 bg-indigo-50 rounded-full flex items-center justify-center mb-6 relative">
                <div className="absolute inset-0 rounded-full border-4 border-trust-primary/20"></div>
                <div className="absolute inset-0 rounded-full border-4 border-trust-primary border-t-transparent animate-spin"></div>
                <Wand2 className="h-6 w-6 text-trust-primary" />
             </div>
             <h3 className="text-xl font-bold text-gray-900 mb-2">Gerando arquitetura estratégica...</h3>
             <p className="text-gray-500 max-w-xs text-center">
               A IA está cruzando seus pilares com o objetivo de {formData.objective} para criar temas e séries.
             </p>
          </div>
        )}
      </Modal>

    </div>
  );
};
