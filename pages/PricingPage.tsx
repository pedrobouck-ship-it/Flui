
import React, { useState } from 'react';
import { Card, Button, Badge, Slider } from '../components/UI';
import { 
  Check, HelpCircle, AlertCircle, ChevronDown, ChevronUp, 
  CreditCard, Zap, Layout, BrainCircuit, Users, Rocket,
  Sparkles, Mail
} from 'lucide-react';

// --- CONSTANTS & DATA ---

const CREDIT_COSTS = {
  DIAGNOSIS: 50,
  POST: 20,
  CAROUSEL: 15
};

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    credits: 500,
    priceMonthly: 297,
    priceAnnual: 2970,
    target: 'Criador solo, 10-15 posts/mês',
    features: [
      '500 créditos/mês',
      'Suite completa de IA',
      'Publicação automática LinkedIn',
      'Editor de carrossel e one-page',
      'Suporte por email'
    ],
    cta: 'Começar com Starter',
    emphasized: false
  },
  {
    id: 'professional',
    name: 'Professional',
    credits: 1500,
    priceMonthly: 697,
    priceAnnual: 6970,
    target: 'Profissional ativo, 30-40 posts/mês',
    badge: 'Mais popular',
    features: [
      '1.500 créditos/mês',
      'Tudo do Starter',
      'Processamento prioritário',
      'Analytics avançado (em breve)',
      'Suporte prioritário'
    ],
    cta: 'Começar com Professional',
    emphasized: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    credits: 'Custom',
    priceMonthly: null, // "Sob consulta"
    priceAnnual: null,
    target: 'Times e agências, alto volume',
    features: [
      'Créditos personalizados',
      'Tudo do Professional',
      'Account manager dedicado',
      'Integrações customizadas',
      'SLA e suporte premium'
    ],
    cta: 'Falar com vendas',
    emphasized: false
  }
];

const FAQ_ITEMS = [
  {
    question: "Como funcionam os créditos?",
    answer: "Os créditos são a moeda do Flui. Cada ação consome uma quantidade específica: um diagnóstico de estratégia custa 50 créditos, gerar um post custa 20 e criar um carrossel custa 15. Você usa como quiser."
  },
  {
    question: "O que acontece quando os créditos acabam?",
    answer: "Você pode comprar pacotes de créditos avulsos a qualquer momento ou aguardar a renovação mensal do seu plano. Não há interrupção do serviço, apenas limitação de novas gerações."
  },
  {
    question: "Créditos não usados acumulam?",
    answer: "Para manter a infraestrutura de IA otimizada, os créditos do plano resetam mensalmente. Apenas créditos comprados em pacotes avulsos (top-ups) não expiram."
  },
  {
    question: "Posso mudar de plano?",
    answer: "Sim, a qualquer momento. Se fizer upgrade, a diferença de créditos é adicionada imediatamente. No downgrade, a mudança vale para o próximo ciclo de faturamento."
  },
  {
    question: "Qual a política de reembolso?",
    answer: "Oferecemos garantia de 7 dias. Se você não usar mais de 10% dos créditos do primeiro mês e não estiver satisfeito, devolvemos seu dinheiro."
  },
  {
    question: "Como funciona o plano Enterprise?",
    answer: "O plano Enterprise é desenhado para times. Oferecemos faturamento corporativo, gestão de múltiplos usuários, créditos compartilhados e suporte dedicado via Slack/WhatsApp."
  }
];

const COMPARISON_DATA = {
  categories: [
    {
      name: 'Estratégia e Diagnósticos',
      rows: [
        { feature: 'Studio Estratégico (IA)', starter: true, pro: true, ent: true },
        { feature: 'Definição de Arquétipo', starter: true, pro: true, ent: true },
        { feature: 'Análise de Coerência', starter: 'Básico', pro: 'Avançado', ent: 'Custom' },
      ]
    },
    {
      name: 'Criação de Conteúdo',
      rows: [
        { feature: 'Editor Textual', starter: true, pro: true, ent: true },
        { feature: 'Visual Studio (Carrosséis)', starter: true, pro: true, ent: true },
        { feature: 'Templates Premium', starter: '10/mês', pro: 'Ilimitado', ent: 'Ilimitado' },
      ]
    },
    {
      name: 'Capacidades de IA',
      rows: [
        { feature: 'Modelo de IA', starter: 'Standard', pro: 'Premium (Gemini 2.5)', ent: 'Premium (Gemini 2.5)' },
        { feature: 'Contexto de Memória', starter: 'Limitado', pro: 'Estendido', ent: 'Ilimitado' },
        { feature: 'Upload de Arquivos', starter: 'PDF/TXT', pro: 'Todos formatos', ent: 'Todos formatos' },
      ]
    }
  ]
};

// --- COMPONENTS ---

export const PricingPage: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [showComparison, setShowComparison] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Calculator State
  const [calcValues, setCalcValues] = useState({
    diagnosis: 1,
    posts: 12,
    carousels: 4
  });

  // Calculation Logic
  const totalCreditsNeeded = 
    (calcValues.diagnosis * CREDIT_COSTS.DIAGNOSIS) + 
    (calcValues.posts * CREDIT_COSTS.POST) + 
    (calcValues.carousels * CREDIT_COSTS.CAROUSEL);

  let recommendedPlanId = 'starter';
  if (totalCreditsNeeded > 1500) recommendedPlanId = 'enterprise';
  else if (totalCreditsNeeded > 500) recommendedPlanId = 'professional';

  // Handlers
  const handlePlanSelect = (planId: string) => {
    console.log(`Selected plan: ${planId} (${billingCycle})`);
    // Redirect to signup logic would go here
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="pt-16 pb-12 px-6 text-center max-w-4xl mx-auto">
        <Badge variant="energy" className="mb-6 px-3 py-1 text-xs uppercase tracking-widest font-bold bg-indigo-50 text-trust-primary border-indigo-100">
          Planos Flexíveis
        </Badge>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6 leading-tight">
          Inteligência para criadores que levam LinkedIn a sério
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-8 leading-relaxed">
          Pague por créditos. Use onde importa. Sem desperdício. 
          <br />Escale sua autoridade com um sistema previsível.
        </p>
        
        {/* Visual Credit Indicator */}
        <div className="flex items-center justify-center gap-3 animate-fade-in">
           <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-sm font-medium text-gray-600">Saldo Ativo: <span className="font-bold text-gray-900">∞</span></span>
           </div>
        </div>
      </section>

      {/* 2. TOGGLE */}
      <div className="flex justify-center mb-16 px-4">
        <div className="bg-gray-200 p-1 rounded-lg flex relative">
          <button 
            className={`px-6 py-2 rounded-md text-sm font-bold transition-all duration-200 ${billingCycle === 'monthly' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
            onClick={() => setBillingCycle('monthly')}
          >
            Mensal
          </button>
          <button 
            className={`px-6 py-2 rounded-md text-sm font-bold transition-all duration-200 flex items-center gap-2 ${billingCycle === 'annual' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
            onClick={() => setBillingCycle('annual')}
          >
            Anual
            <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-bold uppercase">-2 meses</span>
          </button>
        </div>
      </div>

      {/* 3. PRICING CARDS */}
      <div className="max-w-7xl mx-auto px-6 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {PLANS.map((plan) => {
            const isRecommended = plan.id === recommendedPlanId;
            const isPro = plan.emphasized;
            
            return (
              <div 
                key={plan.id}
                onClick={() => handlePlanSelect(plan.id)}
                className={`
                  relative bg-white rounded-2xl border transition-all duration-300 cursor-pointer group flex flex-col h-full
                  ${isRecommended ? 'ring-2 ring-offset-2 ring-trust-primary shadow-xl scale-105 z-10' : 'border-gray-200 hover:border-trust-primary/30 hover:shadow-lg hover:-translate-y-1'}
                  ${isPro ? 'md:-mt-4 md:mb-4 bg-gradient-to-b from-white to-indigo-50/20' : ''}
                `}
              >
                {/* Badges */}
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-trust-primary text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-sm tracking-wide uppercase">
                    {plan.badge}
                  </div>
                )}
                {isRecommended && !plan.badge && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-emerald-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-sm tracking-wide uppercase flex items-center gap-1">
                    <Sparkles className="h-3 w-3" /> Recomendado
                  </div>
                )}

                <div className="p-8 flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-sm text-gray-500 mb-6 h-10">{plan.target}</p>
                  
                  <div className="mb-8">
                    {plan.priceMonthly ? (
                      <>
                        <span className="text-4xl font-bold text-gray-900 tracking-tight">
                          R$ {billingCycle === 'monthly' ? plan.priceMonthly : Math.round(plan.priceAnnual! / 12)}
                        </span>
                        <span className="text-gray-500 font-medium">/mês</span>
                        {billingCycle === 'annual' && (
                          <p className="text-xs text-green-600 font-bold mt-1">
                            Faturado R$ {plan.priceAnnual} anualmente
                          </p>
                        )}
                      </>
                    ) : (
                      <span className="text-3xl font-bold text-gray-900">Sob Consulta</span>
                    )}
                  </div>

                  {/* Credits Highlight */}
                  <div className="bg-gray-50 rounded-lg p-3 mb-8 border border-gray-100 flex items-center gap-3">
                    <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center shadow-sm text-trust-primary">
                      <Zap className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="block font-bold text-gray-900 text-sm">
                        {plan.credits === 'Custom' ? 'Volume Customizado' : `${plan.credits} créditos`}
                      </span>
                      <span className="text-xs text-gray-500">Renova mensalmente</span>
                    </div>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-gray-600">
                        <Check className={`h-5 w-5 shrink-0 ${isPro ? 'text-trust-primary' : 'text-gray-400'}`} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-8 pt-0 mt-auto">
                  <Button 
                    className={`w-full py-6 font-bold text-base shadow-none transition-all ${
                      isPro 
                      ? 'bg-trust-primary hover:bg-trust-hover text-white shadow-lg shadow-trust-primary/20' 
                      : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-gray-900 hover:text-gray-900'
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. INTERACTIVE CALCULATOR */}
      <section className="bg-white border-y border-gray-200 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">Quantos créditos você precisa?</h2>
            <p className="text-gray-500">Simule seu uso mensal para encontrar o plano ideal.</p>
          </div>

          <div className="bg-gray-50 rounded-2xl border border-gray-200 p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              
              {/* Sliders */}
              <div className="space-y-8">
                <div>
                  <div className="flex justify-between mb-4">
                    <label className="font-bold text-gray-900 flex items-center gap-2">
                      <BrainCircuit className="h-4 w-4 text-trust-primary" /> Diagnósticos
                    </label>
                    <span className="text-sm font-bold bg-white px-2 py-1 rounded border border-gray-200">{calcValues.diagnosis}/mês</span>
                  </div>
                  <Slider 
                    value={calcValues.diagnosis} 
                    onValueChange={(v) => setCalcValues({...calcValues, diagnosis: v})} 
                    max={10} step={1}
                  />
                  <p className="text-xs text-gray-400 mt-2">50 créditos cada • Estratégia profunda</p>
                </div>

                <div>
                  <div className="flex justify-between mb-4">
                    <label className="font-bold text-gray-900 flex items-center gap-2">
                      <Layout className="h-4 w-4 text-trust-primary" /> Posts de Conteúdo
                    </label>
                    <span className="text-sm font-bold bg-white px-2 py-1 rounded border border-gray-200">{calcValues.posts}/mês</span>
                  </div>
                  <Slider 
                    value={calcValues.posts} 
                    onValueChange={(v) => setCalcValues({...calcValues, posts: v})} 
                    max={50} step={5}
                  />
                  <p className="text-xs text-gray-400 mt-2">20 créditos cada • Textos e legendas</p>
                </div>

                <div>
                  <div className="flex justify-between mb-4">
                    <label className="font-bold text-gray-900 flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-trust-primary" /> Carrosséis
                    </label>
                    <span className="text-sm font-bold bg-white px-2 py-1 rounded border border-gray-200">{calcValues.carousels}/mês</span>
                  </div>
                  <Slider 
                    value={calcValues.carousels} 
                    onValueChange={(v) => setCalcValues({...calcValues, carousels: v})} 
                    max={20} step={2}
                  />
                  <p className="text-xs text-gray-400 mt-2">15 créditos cada • Visual Studio</p>
                </div>
              </div>

              {/* Result */}
              <div className="flex flex-col justify-center items-center text-center bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
                 <div className="h-16 w-16 bg-indigo-50 rounded-full flex items-center justify-center text-trust-primary mb-4">
                    <Rocket className="h-8 w-8" />
                 </div>
                 <p className="text-gray-500 font-medium mb-1">Você precisará de aproximadamente</p>
                 <div className="text-5xl font-bold text-gray-900 mb-2">{totalCreditsNeeded}</div>
                 <p className="text-sm text-gray-400 mb-6">créditos mensais</p>
                 
                 <div className="w-full pt-6 border-t border-gray-100">
                    <p className="text-sm font-bold text-gray-600 mb-2 uppercase tracking-wide">Plano Recomendado</p>
                    <div className="text-2xl font-bold text-trust-primary mb-4">
                       {PLANS.find(p => p.id === recommendedPlanId)?.name}
                    </div>
                    <Button variant="trust" className="w-full" onClick={() => handlePlanSelect(recommendedPlanId)}>
                       Escolher este plano
                    </Button>
                 </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 5. COMPARISON MATRIX */}
      <section className="max-w-5xl mx-auto px-6 py-20">
         <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900">Comparação Detalhada</h2>
         </div>
         
         <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
            <button 
              className="w-full p-4 flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 transition-colors text-sm font-bold text-gray-600"
              onClick={() => setShowComparison(!showComparison)}
            >
               {showComparison ? 'Ocultar comparação' : 'Ver comparação completa'}
               {showComparison ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>

            {showComparison && (
               <div className="animate-in slide-in-from-top-4 fade-in duration-300">
                  <div className="grid grid-cols-4 bg-gray-50 p-4 border-b border-gray-200 text-sm font-bold text-gray-700">
                     <div className="col-span-1">Recurso</div>
                     <div className="text-center">Starter</div>
                     <div className="text-center text-trust-primary">Professional</div>
                     <div className="text-center">Enterprise</div>
                  </div>
                  
                  {COMPARISON_DATA.categories.map((cat, i) => (
                     <div key={i}>
                        <div className="bg-gray-50/50 px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                           {cat.name}
                        </div>
                        {cat.rows.map((row, r) => (
                           <div key={r} className="grid grid-cols-4 p-4 border-b border-gray-100 text-sm items-center hover:bg-gray-50 transition-colors">
                              <div className="font-medium text-gray-900">{row.feature}</div>
                              <div className="text-center text-gray-600 flex justify-center">
                                 {row.starter === true ? <Check className="h-4 w-4 text-green-500"/> : row.starter}
                              </div>
                              <div className="text-center text-gray-900 font-medium flex justify-center bg-indigo-50/30 -my-4 py-4">
                                 {row.pro === true ? <Check className="h-4 w-4 text-trust-primary"/> : row.pro}
                              </div>
                              <div className="text-center text-gray-600 flex justify-center">
                                 {row.ent === true ? <Check className="h-4 w-4 text-gray-400"/> : row.ent}
                              </div>
                           </div>
                        ))}
                     </div>
                  ))}
               </div>
            )}
         </div>
      </section>

      {/* 6. FAQ */}
      <section className="max-w-3xl mx-auto px-6 py-12 mb-12">
         <h2 className="text-3xl font-serif font-bold text-gray-900 mb-8 text-center">Perguntas Frequentes</h2>
         <div className="space-y-4">
            {FAQ_ITEMS.map((item, index) => (
               <div key={index} className="border border-gray-200 rounded-lg bg-white overflow-hidden">
                  <button 
                    className="w-full flex items-center justify-between p-5 text-left font-bold text-gray-900 hover:bg-gray-50 transition-colors focus:outline-none"
                    onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                  >
                     <span className="flex items-center gap-3">
                        <HelpCircle className="h-5 w-5 text-trust-primary" />
                        {item.question}
                     </span>
                     {openFaqIndex === index ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
                  </button>
                  {openFaqIndex === index && (
                     <div className="p-5 pt-0 text-gray-600 leading-relaxed text-sm animate-in slide-in-from-top-2 fade-in">
                        {item.answer}
                     </div>
                  )}
               </div>
            ))}
         </div>
      </section>

      {/* 7. FINAL CTA */}
      <section className="bg-indigo-900 py-24 px-6 text-center">
         <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">
               Pronto para escalar sua presença no LinkedIn?
            </h2>
            <p className="text-indigo-200 text-lg mb-10">
               Junte-se a centenas de profissionais que transformaram sua produção de conteúdo com inteligência estratégica.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
               <Button className="bg-white text-indigo-900 hover:bg-indigo-50 border-0 h-14 px-8 text-lg font-bold">
                  Começar com Professional
               </Button>
               <Button variant="outline" className="border-indigo-700 text-indigo-100 hover:bg-indigo-800 hover:text-white h-14 px-8 text-lg">
                  Falar com vendas
               </Button>
            </div>
            <p className="mt-6 text-xs text-indigo-400">
               Sem cartão de crédito para testar. Garantia de 7 dias.
            </p>
         </div>
      </section>

    </div>
  );
};
