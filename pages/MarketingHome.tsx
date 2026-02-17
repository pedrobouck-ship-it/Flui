
import React from 'react';
import { Button, Card } from '../components/UI';
import { Logo } from '../components/Logo';
import { ArrowRight, Compass, Layers, Zap, CheckCircle2, LayoutTemplate } from 'lucide-react';

interface MarketingHomeProps {
  onLogin: () => void;
  onSignup: () => void;
}

export const MarketingHome: React.FC<MarketingHomeProps> = ({ onLogin, onSignup }) => {
  return (
    <div className="min-h-screen bg-brand-bg font-sans text-brand-dark overflow-x-hidden">
      
      {/* 1.1 Header / Nav */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-md border-b border-brand-border z-50">
        <div className="max-w-[1200px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo className="h-8 w-auto text-brand-dark" />
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-brand-muted">
            <a href="#how-it-works" className="hover:text-brand-blue transition-colors">Como Funciona</a>
            <a href="#benefits" className="hover:text-brand-blue transition-colors">Benefícios</a>
            <a href="#methodology" className="hover:text-brand-blue transition-colors">Metodologia</a>
            <a href="#pricing" className="hover:text-brand-blue transition-colors">Preços</a>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onLogin}>Entrar</Button>
            <Button variant="gradient" onClick={onSignup}>Começar Agora</Button>
          </div>
        </div>
      </nav>

      {/* 1.1 Hero Section */}
      <section className="pt-40 pb-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-glow z-0 pointer-events-none"></div>
        <div className="max-w-[1200px] mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/5 border border-brand-blue/10 text-brand-blue text-xs font-bold tracking-wide uppercase mb-8">
            <Zap className="h-3 w-3" />
            AI-Orchestrated Strategy
          </div>
          
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-brand-dark leading-[1.1] tracking-tight mb-8">
            Transforme expertise em<br />
            <span className="bg-clip-text text-transparent bg-primary-gradient">autoridade sistemática.</span>
          </h1>
          
          <p className="text-xl text-brand-muted max-w-2xl mx-auto leading-relaxed mb-10">
            O Flui estrutura seu posicionamento, define seu arquétipo e organiza ciclos de conteúdo 
            executáveis. Pare de postar aleatoriamente. Comece a construir um ativo.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="gradient" size="lg" onClick={onSignup} className="w-full sm:w-auto">
              Criar Conta Gratuita <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg" onClick={() => {
              const el = document.getElementById('how-it-works');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }} className="w-full sm:w-auto">
              Ver Como Funciona
            </Button>
          </div>
        </div>
      </section>

      {/* 1.2 Produto / Features */}
      <section id="how-it-works" className="py-24 bg-white border-y border-brand-border">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-brand-dark mb-4">Um sistema operacional de conteúdo</h2>
            <p className="text-brand-muted max-w-xl mx-auto">
              Do caos criativo à execução estratégica em quatro módulos integrados.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="hover:shadow-hover transition-all duration-300" context="trust">
              <div className="h-12 w-12 rounded-xl bg-indigo-50 flex items-center justify-center mb-6">
                <Compass className="h-6 w-6 text-trust-primary" />
              </div>
              <h3 className="text-xl font-bold font-serif mb-3">Studio Estratégico</h3>
              <p className="text-brand-muted leading-relaxed">
                Nossa IA analisa suas respostas e define seu arquétipo, tom de voz e pilares narrativos automaticamente.
              </p>
            </Card>

            {/* Feature 2 */}
            <Card className="hover:shadow-hover transition-all duration-300" context="energy">
              <div className="h-12 w-12 rounded-xl bg-fuchsia-50 flex items-center justify-center mb-6">
                <Layers className="h-6 w-6 text-energy-primary" />
              </div>
              <h3 className="text-xl font-bold font-serif mb-3">Blueprints</h3>
              <p className="text-brand-muted leading-relaxed">
                Esqueça calendários vazios. Gere ciclos de conteúdo baseados em intenção estratégica, não em datas.
              </p>
            </Card>

            {/* Feature 3 */}
            <Card className="hover:shadow-hover transition-all duration-300" context="neutral">
              <div className="h-12 w-12 rounded-xl bg-gray-100 flex items-center justify-center mb-6">
                <LayoutTemplate className="h-6 w-6 text-gray-700" />
              </div>
              <h3 className="text-xl font-bold font-serif mb-3">Sessions & Editor</h3>
              <p className="text-brand-muted leading-relaxed">
                Ambiente de foco total para execução. A IA atua como orquestradora invisível, sugerindo estruturas.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* 1.3 Metodologia */}
      <section id="methodology" className="py-24 px-6 bg-brand-bg">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 space-y-8">
            <h2 className="text-4xl font-serif font-bold text-brand-dark">Decision-First,<br />Text-Last.</h2>
            <p className="text-lg text-brand-muted leading-relaxed">
              A maioria das ferramentas foca na digitação. O Flui foca na decisão. 
              Nossa metodologia inverte a pirâmide: primeiro garantimos que a estratégia está sólida, 
              depois orquestramos a execução.
            </p>
            <ul className="space-y-4">
              {[
                'Diagnóstico de Arquétipo Automático',
                'Estratégia Orientada a Sistema',
                'Redução de Fricção Cognitiva',
                'Framework Proprietário'
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-brand-dark font-medium">
                  <CheckCircle2 className="h-5 w-5 text-trust-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1">
             <div className="bg-white p-8 rounded-card shadow-lg border border-brand-border relative">
                <div className="absolute -top-4 -right-4 h-24 w-24 bg-primary-gradient rounded-full opacity-10 blur-xl"></div>
                <div className="space-y-4">
                   <div className="h-2 w-1/3 bg-gray-200 rounded"></div>
                   <div className="h-2 w-2/3 bg-gray-200 rounded"></div>
                   <div className="h-32 w-full bg-gray-50 rounded-xl border border-dashed border-gray-200 flex flex-col items-center justify-center p-4">
                      <div className="h-8 w-8 rounded-full bg-indigo-50 flex items-center justify-center mb-2">
                         <Zap className="h-4 w-4 text-trust-primary" />
                      </div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Orquestração Estratégica</span>
                   </div>
                   <div className="h-2 w-full bg-gray-200 rounded"></div>
                   <div className="h-2 w-5/6 bg-gray-200 rounded"></div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* 1.8 Footer Simple */}
      <footer className="bg-white border-t border-brand-border py-12 px-6">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Logo className="h-6 w-auto text-brand-muted" />
            <span className="text-brand-muted text-sm">© 2024 Flui System.</span>
          </div>
          <div className="flex gap-8 text-sm text-brand-muted">
             <a href="#" className="hover:text-brand-dark">Termos</a>
             <a href="#" className="hover:text-brand-dark">Privacidade</a>
             <a href="#" className="hover:text-brand-dark">Sobre</a>
             <a href="#" className="hover:text-brand-dark">LinkedIn</a>
          </div>
        </div>
      </footer>

    </div>
  );
};
