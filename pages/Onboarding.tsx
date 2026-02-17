
import React, { useState, useEffect } from 'react';
import { AssessmentData } from '../types';
import { Button, Card, Progress, Input, TextArea } from '../components/UI';
import { 
  ArrowRight, ArrowLeft, Check, Sparkles, Zap, Layers, 
  Target, Rocket, BrainCircuit, Lightbulb, Users, Briefcase, 
  GraduationCap, HeartPulse, Code2, LineChart, Star, Fingerprint, Shield,
  MessageSquare, UserCircle, Building2, Store
} from 'lucide-react';
import { generateStrategy } from '../services/geminiService';

interface OnboardingProps {
  onComplete: (data: AssessmentData, strategy: any) => void;
  initialMode?: 'quick' | 'complete';
}

type OnboardingMode = 'quick' | 'complete' | null;

// --- STATIC DATA OPTIONS ---

const NICHES = [
  { id: 'Marketing', icon: MegaphoneIcon, label: 'Marketing' },
  { id: 'Technology', icon: Code2, label: 'Tecnologia' },
  { id: 'Education', icon: GraduationCap, label: 'Educação' },
  { id: 'Health', icon: HeartPulse, label: 'Saúde' },
  { id: 'Finance', icon: LineChart, label: 'Finanças' },
  { id: 'PersonalDev', icon: Star, label: 'Desenv. Pessoal' },
  { id: 'Services', icon: Briefcase, label: 'Serviços Prof.' },
  { id: 'Ecommerce', icon: Store, label: 'Ecommerce' },
];

const AUDIENCES = [
  { id: 'Founders', label: 'Fundadores & CEOs', icon: Building2 },
  { id: 'Managers', label: 'Gerentes & Líderes', icon: Briefcase },
  { id: 'Freelancers', label: 'Freelancers', icon: UserCircle },
  { id: 'Students', label: 'Estudantes', icon: GraduationCap },
  { id: 'Developers', label: 'Desenvolvedores', icon: Code2 },
  { id: 'Investors', label: 'Investidores', icon: LineChart },
  { id: 'Parents', label: 'Pais & Mães', icon: Users },
  { id: 'Creators', label: 'Criadores', icon: Lightbulb },
];

const OBJECTIVES = [
  { id: 'Leads', label: 'Gerar Leads', icon: Zap },
  { id: 'Authority', label: 'Construir Autoridade', icon: Shield },
  { id: 'Sales', label: 'Vender', icon: Rocket },
  { id: 'Audience', label: 'Crescer Audiência', icon: Users },
  { id: 'Education', label: 'Educar Mercado', icon: BrainCircuit },
];

const PERCEPTIONS = [
  { id: 'Innovative', label: 'Inovador' },
  { id: 'Reliable', label: 'Confiável' },
  { id: 'Provocative', label: 'Provocativo' },
  { id: 'Welcoming', label: 'Acolhedor' },
  { id: 'Technical', label: 'Técnico' },
  { id: 'Inspiring', label: 'Inspirador' },
  { id: 'Disruptive', label: 'Disruptivo' },
  { id: 'Expert', label: 'Especialista' },
];

const PAINS = [
  "Falta de tempo", "Baixo orçamento", "Complexidade técnica", 
  "Insegurança", "Falta de clareza", "Processos manuais", 
  "Baixa performance", "Estagnação", "Falta de suporte"
];

const IMPACT_STATEMENTS = [
  "Que eu sou a maior referência no assunto",
  "Que finalmente entenderam o problema raiz",
  "Que existe um caminho mais inteligente e rápido",
  "Que podem confiar na minha metodologia"
];

// Helper Icon Wrapper
function MegaphoneIcon(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete, initialMode }) => {
  const [mode, setMode] = useState<OnboardingMode>(initialMode || null);
  const [step, setStep] = useState(initialMode ? 1 : 0); // 0 = Mode Selection
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Data State
  const [data, setData] = useState<AssessmentData>({
    mode: initialMode || 'quick',
    niche: '',
    audience: '',
    primaryGoal: '',
    secondaryGoal: '',
    perception: [],
    // Defaults for interface compatibility
    name: '',
    businessModel: undefined,
    offerType: undefined,
    offerDescription: '',
    audiencePains: [],
    impactStatement: '',
    contentPillars: [],
    maturityLevel: 'Estruturando',
    frequency: 3,
    contentFormats: ['Carrossel', 'Artigos'],
    strategicPriorities: [],
    communicationTone: []
  });

  // --- Logic Helpers ---

  const handleUpdate = (key: keyof AssessmentData, value: any) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  const toggleSelection = (key: keyof AssessmentData, value: string, max: number = 1) => {
    const current = (data[key] as string[]) || [];
    if (current.includes(value)) {
      handleUpdate(key, current.filter(i => i !== value));
    } else {
      if (current.length < max) {
        handleUpdate(key, [...current, value]);
      }
    }
  };

  const handleNext = () => {
    const totalSteps = mode === 'quick' ? 5 : 12; // +1 for preview
    if (step < totalSteps) setStep(s => s + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(s => s - 1);
    if (step === 1 && !initialMode) setMode(null); // Only allow going back to mode selection if not forced
  };

  const handleFinish = async () => {
    setIsGenerating(true);
    
    // Simulate generation time for "Premium Feel"
    setTimeout(async () => {
      try {
        // Here we would call the actual AI service
        // For now, we mock the strategy generation based on inputs
        const strategy = await generateStrategy(data);
        onComplete(data, strategy);
      } catch (e) {
        console.error(e);
        setIsGenerating(false);
      }
    }, 2500);
  };

  // --- RENDERERS ---

  // 1. Step 0: Mode Selection
  if (!mode) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 animate-fade-in">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-12">
             <div className="inline-flex items-center justify-center p-3 bg-white rounded-xl shadow-sm mb-6 border border-gray-100">
               <Sparkles className="h-6 w-6 text-trust-primary" />
             </div>
             <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">Escolha sua jornada</h1>
             <p className="text-xl text-gray-500 max-w-2xl mx-auto">
               O Flui se adapta ao seu momento. Você precisa de direção rápida ou profundidade estratégica?
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Quick Card */}
            <button 
              onClick={() => { setMode('quick'); setStep(1); }}
              className="group relative bg-white p-8 rounded-2xl border-2 border-transparent hover:border-trust-primary shadow-sm hover:shadow-xl transition-all duration-300 text-left"
            >
              <div className="absolute top-6 right-6 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wide">
                ~3 Minutos
              </div>
              <div className="h-14 w-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 font-serif">Configuração Rápida</h3>
              <p className="text-gray-500 leading-relaxed mb-8">
                Ideal para começar agora. Responda poucas perguntas essenciais e receba um direcionamento tático imediato.
              </p>
              <div className="flex items-center text-blue-600 font-semibold group-hover:translate-x-2 transition-transform">
                Começar Rápido <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </button>

            {/* Complete Card */}
            <button 
              onClick={() => { setMode('complete'); setStep(1); }}
              className="group relative bg-white p-8 rounded-2xl border-2 border-transparent hover:border-energy-primary shadow-sm hover:shadow-xl transition-all duration-300 text-left"
            >
              <div className="absolute top-6 right-6 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold uppercase tracking-wide">
                ~7 Minutos
              </div>
              <div className="h-14 w-14 bg-purple-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BrainCircuit className="h-7 w-7 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 font-serif">Estratégia Profunda</h3>
              <p className="text-gray-500 leading-relaxed mb-8">
                Um diagnóstico completo do seu negócio. Ideal para quem busca posicionamento único e pilares robustos.
              </p>
              <div className="flex items-center text-purple-600 font-semibold group-hover:translate-x-2 transition-transform">
                Iniciar Deep Dive <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Common Layout for Steps
  const renderStepContainer = (
    title: string, 
    subtitle: string, 
    content: React.ReactNode, 
    isValid: boolean,
    totalSteps: number
  ) => (
    <div className="min-h-screen bg-gray-50 flex flex-col animate-fade-in">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <div 
          className="h-full bg-gradient-to-r from-trust-primary to-energy-primary transition-all duration-500 ease-out"
          style={{ width: `${(step / totalSteps) * 100}%` }}
        />
      </div>

      <div className="flex-1 flex flex-col justify-center max-w-3xl mx-auto w-full px-6 py-12">
        <div className="mb-10 text-center">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">
            Passo {step} de {totalSteps}
          </span>
          <h2 className="text-4xl font-serif font-bold text-gray-900 mb-3">{title}</h2>
          <p className="text-xl text-gray-500">{subtitle}</p>
        </div>

        <div className="mb-12">
          {content}
        </div>

        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={handleBack} className="text-gray-400 hover:text-gray-600">
            <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
          </Button>
          <Button 
            variant="trust" 
            size="lg" 
            onClick={handleNext} 
            disabled={!isValid}
            className="px-8"
          >
            Continuar <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  // --- QUICK MODE STEPS ---
  if (mode === 'quick') {
    switch (step) {
      case 1: // Niche
        return renderStepContainer(
          "Qual sua área de atuação?",
          "Selecione o nicho que melhor descreve seu negócio.",
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {NICHES.map(niche => (
              <button
                key={niche.id}
                onClick={() => handleUpdate('niche', niche.label)}
                className={`p-6 rounded-xl border-2 transition-all flex flex-col items-center gap-3 text-center hover:shadow-md ${
                  data.niche === niche.label 
                  ? 'border-trust-primary bg-indigo-50/50 text-trust-primary' 
                  : 'border-white bg-white text-gray-500 hover:border-gray-200'
                }`}
              >
                <niche.icon className="h-8 w-8" />
                <span className="font-medium">{niche.label}</span>
              </button>
            ))}
          </div>,
          !!data.niche,
          5
        );

      case 2: // Audience
        return renderStepContainer(
          "Quem você quer atrair?",
          "Para quem seu conteúdo será desenhado?",
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {AUDIENCES.map(aud => (
              <button
                key={aud.id}
                onClick={() => handleUpdate('audience', aud.label)}
                className={`p-6 rounded-xl border-2 transition-all flex flex-col items-center gap-3 text-center hover:shadow-md ${
                  data.audience === aud.label 
                  ? 'border-trust-primary bg-indigo-50/50 text-trust-primary' 
                  : 'border-white bg-white text-gray-500 hover:border-gray-200'
                }`}
              >
                <aud.icon className="h-8 w-8" />
                <span className="font-medium">{aud.label}</span>
              </button>
            ))}
          </div>,
          !!data.audience,
          5
        );

      case 3: // Objective
        return renderStepContainer(
          "Qual seu objetivo principal?",
          "Selecione até 2 prioridades para este ciclo.",
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {OBJECTIVES.map(obj => {
              const isSelected = data.primaryGoal === obj.label || data.secondaryGoal === obj.label;
              const isPrimary = data.primaryGoal === obj.label;
              return (
                <button
                  key={obj.id}
                  onClick={() => {
                     if (isSelected) {
                        if (isPrimary) {
                           handleUpdate('primaryGoal', data.secondaryGoal);
                           handleUpdate('secondaryGoal', '');
                        } else {
                           handleUpdate('secondaryGoal', '');
                        }
                     } else {
                        if (!data.primaryGoal) handleUpdate('primaryGoal', obj.label);
                        else if (!data.secondaryGoal) handleUpdate('secondaryGoal', obj.label);
                     }
                  }}
                  className={`p-6 rounded-xl border-2 transition-all flex items-center justify-between text-left hover:shadow-md ${
                    isSelected 
                    ? 'border-trust-primary bg-indigo-50/50' 
                    : 'border-white bg-white hover:border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-white text-trust-primary' : 'bg-gray-100 text-gray-400'}`}>
                      <obj.icon className="h-6 w-6" />
                    </div>
                    <span className={`font-medium text-lg ${isSelected ? 'text-gray-900' : 'text-gray-500'}`}>{obj.label}</span>
                  </div>
                  {isPrimary && <span className="text-xs font-bold bg-trust-primary text-white px-2 py-1 rounded">1º</span>}
                  {data.secondaryGoal === obj.label && <span className="text-xs font-bold bg-indigo-200 text-indigo-800 px-2 py-1 rounded">2º</span>}
                </button>
              );
            })}
          </div>,
          !!data.primaryGoal,
          5
        );
      
      case 4: // Perception
        return renderStepContainer(
          "Como você quer ser percebido?",
          "Selecione 2 adjetivos que definirão sua marca.",
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {PERCEPTIONS.map(perc => {
               const isSelected = data.perception.includes(perc.label);
               return (
                  <button
                    key={perc.id}
                    onClick={() => toggleSelection('perception', perc.label, 2)}
                    className={`h-24 rounded-xl border-2 transition-all flex items-center justify-center font-medium text-lg hover:shadow-md ${
                       isSelected 
                       ? 'border-energy-primary bg-pink-50 text-energy-primary' 
                       : 'border-white bg-white text-gray-500 hover:border-gray-200'
                    }`}
                  >
                     {perc.label}
                  </button>
               )
            })}
          </div>,
          data.perception.length > 0,
          5
        );
    }
  }

  // --- COMPLETE MODE STEPS ---
  if (mode === 'complete') {
    switch (step) {
       case 1: // Name
          return renderStepContainer("Começando pelo básico", "Qual o nome da sua marca ou projeto?", 
             <Input 
                autoFocus
                placeholder="Ex: Flui System ou João Silva" 
                value={data.name} 
                onChange={e => handleUpdate('name', e.target.value)} 
                className="text-2xl p-6 h-auto"
             />, 
             !!data.name, 12);
       
       case 2: // Business Model
          return renderStepContainer("Qual seu modelo de atuação?", "Como você se posiciona no mercado?", 
             <div className="grid grid-cols-3 gap-4">
                {['Marca Pessoal', 'B2B (Empresas)', 'B2C (Consumo)'].map(m => (
                   <button
                     key={m}
                     onClick={() => handleUpdate('businessModel', m.split(' ')[0])} // Simple logic
                     className={`p-8 rounded-xl border-2 transition-all font-bold text-lg ${
                        data.businessModel === m.split(' ')[0]
                        ? 'border-trust-primary bg-indigo-50 text-trust-primary'
                        : 'border-white bg-white text-gray-500'
                     }`}
                   >
                     {m}
                   </button>
                ))}
             </div>, 
             !!data.businessModel, 12);
       
       case 3: // Niche (Same as Quick)
          return renderStepContainer("Qual sua área de atuação?", "Selecione o nicho principal.", 
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               {NICHES.map(niche => (
                 <button key={niche.id} onClick={() => handleUpdate('niche', niche.label)} className={`p-6 rounded-xl border-2 transition-all flex flex-col items-center gap-3 text-center ${data.niche === niche.label ? 'border-trust-primary bg-indigo-50/50 text-trust-primary' : 'border-white bg-white text-gray-500'}`}>
                   <niche.icon className="h-8 w-8" />
                   <span className="font-medium">{niche.label}</span>
                 </button>
               ))}
             </div>, !!data.niche, 12);

       case 4: // Offer
          return renderStepContainer("O que você oferece?", "Defina o core da sua entrega de valor.", 
             <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                   {['Serviços', 'Produtos', 'Não monetizo'].map(o => (
                      <button key={o} onClick={() => handleUpdate('offerType', o === 'Não monetizo' ? 'None' : o)} className={`p-4 rounded-xl border-2 transition-all font-medium ${data.offerType === (o === 'Não monetizo' ? 'None' : o) ? 'border-trust-primary bg-indigo-50 text-trust-primary' : 'border-white bg-white text-gray-500'}`}>{o}</button>
                   ))}
                </div>
                <TextArea 
                   placeholder="Descreva brevemente sua oferta (Ex: Consultoria de gestão para pequenas empresas...)"
                   value={data.offerDescription}
                   onChange={e => handleUpdate('offerDescription', e.target.value)}
                   className="min-h-[100px]"
                />
             </div>, !!data.offerType, 12);

       case 5: // Audience (Same as Quick)
          return renderStepContainer("Quem você quer atrair?", "Público-alvo principal.", 
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               {AUDIENCES.map(aud => (
                 <button key={aud.id} onClick={() => handleUpdate('audience', aud.label)} className={`p-6 rounded-xl border-2 transition-all flex flex-col items-center gap-3 text-center ${data.audience === aud.label ? 'border-trust-primary bg-indigo-50/50 text-trust-primary' : 'border-white bg-white text-gray-500'}`}>
                   <aud.icon className="h-8 w-8" />
                   <span className="font-medium">{aud.label}</span>
                 </button>
               ))}
             </div>, !!data.audience, 12);

       case 6: // Pains (New)
          return renderStepContainer("Quais as dores do seu público?", "Selecione até 3 desafios que eles enfrentam.", 
             <div className="grid grid-cols-3 gap-3">
                {PAINS.map(pain => (
                   <button
                     key={pain}
                     onClick={() => toggleSelection('audiencePains', pain, 3)}
                     className={`p-4 rounded-xl border-2 transition-all text-sm font-medium ${
                        data.audiencePains?.includes(pain)
                        ? 'border-energy-primary bg-pink-50 text-energy-primary'
                        : 'border-white bg-white text-gray-500'
                     }`}
                   >
                     {pain}
                   </button>
                ))}
             </div>, (data.audiencePains?.length || 0) > 0, 12);

       case 7: // Objectives (Same as Quick)
          return renderStepContainer("Objetivo com Conteúdo", "Selecione até 2 prioridades.", 
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {OBJECTIVES.map(obj => {
                 const isSelected = data.primaryGoal === obj.label || data.secondaryGoal === obj.label;
                 return (
                   <button key={obj.id} onClick={() => {
                        if (isSelected) {
                           if (data.primaryGoal === obj.label) { handleUpdate('primaryGoal', data.secondaryGoal); handleUpdate('secondaryGoal', ''); } 
                           else { handleUpdate('secondaryGoal', ''); }
                        } else {
                           if (!data.primaryGoal) handleUpdate('primaryGoal', obj.label);
                           else if (!data.secondaryGoal) handleUpdate('secondaryGoal', obj.label);
                        }
                     }} 
                     className={`p-6 rounded-xl border-2 transition-all flex items-center justify-between text-left ${isSelected ? 'border-trust-primary bg-indigo-50/50' : 'border-white bg-white'}`}>
                     <div className="flex items-center gap-4"><obj.icon className="h-6 w-6" /><span className="font-medium">{obj.label}</span></div>
                     {data.primaryGoal === obj.label && <span className="text-xs font-bold bg-trust-primary text-white px-2 py-1 rounded">1º</span>}
                     {data.secondaryGoal === obj.label && <span className="text-xs font-bold bg-indigo-200 text-indigo-800 px-2 py-1 rounded">2º</span>}
                   </button>
                 );
               })}
             </div>, !!data.primaryGoal, 12);

       case 8: // Perception (Same as Quick)
          return renderStepContainer("Como quer ser percebido?", "Selecione 2 adjetivos.", 
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               {PERCEPTIONS.map(perc => (
                  <button key={perc.id} onClick={() => toggleSelection('perception', perc.label, 2)} className={`h-24 rounded-xl border-2 transition-all font-medium text-lg ${data.perception.includes(perc.label) ? 'border-energy-primary bg-pink-50 text-energy-primary' : 'border-white bg-white text-gray-500'}`}>
                     {perc.label}
                  </button>
               ))}
             </div>, data.perception.length > 0, 12);
         
       case 9: // Impact Statement (New)
          return renderStepContainer("Frase de Impacto", "O que você quer que sintam ao consumir seu conteúdo?", 
             <div className="space-y-3">
                {IMPACT_STATEMENTS.map(stmt => (
                   <button
                     key={stmt}
                     onClick={() => handleUpdate('impactStatement', stmt)}
                     className={`w-full p-5 rounded-xl border-2 transition-all text-left text-lg ${
                        data.impactStatement === stmt
                        ? 'border-trust-primary bg-indigo-50 text-trust-primary font-medium'
                        : 'border-white bg-white text-gray-500 hover:border-gray-200'
                     }`}
                   >
                     "{stmt}"
                   </button>
                ))}
             </div>, !!data.impactStatement, 12);
       
       case 10: // Pillars (Mocked for UI)
          return renderStepContainer("Pilares de Conteúdo", "Selecione até 3 temas que você domina.", 
             <div className="grid grid-cols-2 gap-3">
                {['Estratégia', 'Técnica/Hard Skills', 'Bastidores', 'Opinião Forte', 'Tutoriais', 'Lifestyle', 'Estudos de Caso', 'Notícias'].map(p => (
                   <button key={p} onClick={() => toggleSelection('contentPillars', p, 3)} className={`p-4 rounded-xl border-2 transition-all font-medium ${data.contentPillars?.includes(p) ? 'border-energy-primary bg-pink-50 text-energy-primary' : 'border-white bg-white text-gray-500'}`}>{p}</button>
                ))}
             </div>, (data.contentPillars?.length || 0) > 0, 12);

       case 11: // Voice & Tone
          return renderStepContainer("Voz & Tom", "Como sua marca fala?", 
             <div className="grid grid-cols-3 gap-4">
                {['Analítico', 'Provocativo', 'Didático', 'Inspiracional', 'Técnico', 'Amigável'].map(t => (
                   <button key={t} onClick={() => toggleSelection('communicationTone', t, 2)} className={`h-20 rounded-xl border-2 transition-all font-medium ${data.communicationTone.includes(t) ? 'border-trust-primary bg-indigo-50 text-trust-primary' : 'border-white bg-white text-gray-500'}`}>{t}</button>
                ))}
             </div>, data.communicationTone.length > 0, 12);
    }
  }

  // --- PREVIEW & LOADING STATES ---

  if (isGenerating) {
     return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 animate-fade-in">
           <div className="max-w-md w-full text-center space-y-8">
              <div className="relative h-24 w-24 mx-auto">
                 <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
                 <div className="absolute inset-0 border-4 border-trust-primary rounded-full border-t-transparent animate-spin"></div>
                 <Sparkles className="absolute inset-0 m-auto h-8 w-8 text-trust-primary animate-pulse" />
              </div>
              <div>
                 <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">Gerando Direção Estratégica</h2>
                 <p className="text-gray-500">Estamos analisando {data.audience} no nicho de {data.niche}...</p>
              </div>
              <div className="space-y-3">
                 <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-trust-primary animate-progress-indeterminate"></div>
                 </div>
                 <div className="flex justify-between text-xs text-gray-400 font-medium">
                    <span>Definindo Arquétipo</span>
                    <span>Estruturando Pilares</span>
                 </div>
              </div>
           </div>
        </div>
     );
  }

  // The last step for both modes acts as a "Preview" before hitting "Finish"
  if ((mode === 'quick' && step === 5) || (mode === 'complete' && step === 12)) {
     return (
        <div className="min-h-screen bg-gray-50 py-12 px-6 animate-fade-in">
           <div className="max-w-2xl mx-auto">
              <div className="text-center mb-10">
                 <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2">Quase lá</h2>
                 <p className="text-gray-500">Confira o resumo do seu perfil antes de gerarmos a estratégia.</p>
              </div>

              <Card className="bg-white shadow-xl border-0 mb-8 overflow-hidden">
                 <div className="h-2 w-full bg-gradient-to-r from-trust-primary to-energy-primary"></div>
                 <div className="p-8 space-y-8">
                    
                    {/* Header Summary */}
                    <div className="flex items-start gap-4 pb-8 border-b border-gray-100">
                       <div className="h-12 w-12 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
                          <Fingerprint className="h-6 w-6 text-trust-primary" />
                       </div>
                       <div>
                          <h3 className="text-lg font-bold text-gray-900 font-serif">{data.niche}</h3>
                          <p className="text-gray-500">Focado em {data.audience}</p>
                       </div>
                       <div className="ml-auto">
                          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                             {mode === 'quick' ? 'Quick Mode' : 'Deep Dive'}
                          </span>
                       </div>
                    </div>

                    {/* Grid Summary */}
                    <div className="grid grid-cols-2 gap-6">
                       <div>
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Objetivo</label>
                          <div className="font-serif text-xl text-gray-900 font-bold">{data.primaryGoal}</div>
                          {data.secondaryGoal && <div className="text-sm text-gray-500 mt-1">+ {data.secondaryGoal}</div>}
                       </div>
                       <div>
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Percepção</label>
                          <div className="flex flex-wrap gap-2">
                             {data.perception.map(p => (
                                <span key={p} className="bg-pink-50 text-energy-primary px-2 py-1 rounded text-sm font-medium">{p}</span>
                             ))}
                          </div>
                       </div>
                       
                       {mode === 'complete' && (
                          <>
                             <div className="col-span-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Dores do Público</label>
                                <div className="flex flex-wrap gap-2">
                                   {data.audiencePains?.map(p => (
                                      <span key={p} className="bg-gray-50 text-gray-600 border border-gray-100 px-2 py-1 rounded text-sm">{p}</span>
                                   ))}
                                </div>
                             </div>
                             <div className="col-span-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Declaração de Impacto</label>
                                <p className="italic text-gray-600 border-l-4 border-trust-primary pl-4 py-1">
                                   "{data.impactStatement}"
                                </p>
                             </div>
                          </>
                       )}
                    </div>
                 </div>
              </Card>

              <div className="flex flex-col gap-4">
                 <Button 
                   variant="gradient" 
                   size="lg" 
                   className="w-full h-14 text-lg shadow-lg hover:shadow-xl transition-all"
                   onClick={handleFinish}
                 >
                    <Sparkles className="mr-2 h-5 w-5" />
                    Gerar Minha Estratégia
                 </Button>
                 <Button variant="ghost" onClick={() => setStep(mode === 'quick' ? 4 : 11)} className="text-gray-400">
                    Voltar e editar
                 </Button>
              </div>
           </div>
        </div>
     );
  }

  return null;
};
