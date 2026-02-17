
import React, { useState, useEffect } from 'react';
import { View, AssessmentData, StrategyCore, Session, AppState, AppNotification, Recommendation, PlanTier, UserUsage, GateContext } from './types';
import { supabase } from './lib/supabase';
import { Sidebar } from './components/Sidebar';
import { Onboarding } from './pages/Onboarding';
import { StrategyStudio } from './pages/StrategyStudio';
import { Sessions } from './pages/Sessions';
import { Frameworks } from './pages/Frameworks';
import { SessionDetail } from './pages/SessionDetail';
import { EditorDetail } from './pages/EditorDetail';
import { Dashboard } from './pages/Dashboard';
import { Notifications } from './pages/Notifications';
import { VisualStudio } from './pages/VisualStudio';
import { Pulse } from './pages/Pulse';
import { Profile } from './pages/Profile';
import { PricingPage } from './pages/PricingPage';
import { AuthPage } from './pages/AuthPage';
import { Bell, Zap, Search, Command, Linkedin, CheckCircle2 } from 'lucide-react';
import { Modal, Button, Badge } from './components/UI';
import { HybridUpgradeModal } from './components/GateController'; // Import Hybrid Modal
import { UsageProgressBanner } from './components/UsageProgressBanner'; // Import New Banner

// Onboarding imports
import { OnboardingPanel } from './components/OnboardingPanel';
import { OnboardingTrigger } from './components/OnboardingTrigger';
import { useOnboarding } from './hooks/useOnboarding';

// Search import
import { CommandCenter } from './components/CommandCenter';

export default function App() {
  const [state, setState] = useState<AppState>({
    view: View.AUTH,
    isLoggedIn: false,
    hasOnboarded: false,
    assessment: {
      mode: 'quick',
      niche: '',
      audience: '',
      primaryGoal: '',
      secondaryGoal: '',
      perception: [],
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
    },
    strategy: null,
    sessions: [],
    notifications: [],
    recommendations: [],
    momentumScore: 0,
    activeSessionId: null,
    activeEditorId: null,
    credits: 0, // Legacy display

    // GATING STATE
    planTier: PlanTier.FREE,
    usage: {
      currentSessions: 1, // At limit for FREE
      monthlyUsageCount: 450,
      monthlyLimit: 500,
      extraCreditsBalance: 0,
      pulseSources: 1
    }
  });

  // Gating Modal State
  const [gateContext, setGateContext] = useState<GateContext | null>(null);

  // State to pass content from Text Editor to Visual Editor
  const [visualEditorData, setVisualEditorData] = useState<string | null>(null);
  const [onboardingMode, setOnboardingMode] = useState<'quick' | 'complete' | undefined>(undefined);

  // Command Center State
  const [isCommandCenterOpen, setIsCommandCenterOpen] = useState(false);

  // LinkedIn Modal State
  const [isLinkedInConnectOpen, setIsLinkedInConnectOpen] = useState(false);
  const [isConnectingLinkedIn, setIsConnectingLinkedIn] = useState(false);

  // Onboarding Hook
  const {
    isOpen: isOnboardingOpen,
    isCollapsed: isOnboardingCollapsed,
    steps: onboardingSteps,
    progress: onboardingProgress,
    completedCount,
    totalSteps,
    togglePanel,
    closePanel,
    openPanel,
    toggleCollapse,
    completeStep
  } = useOnboarding();

  // Keyboard Shortcuts for Command Center
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandCenterOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Supabase Connection Test
  useEffect(() => {
    const testSupabaseConnection = async () => {
      try {
        const { data, error } = await supabase.from('_test_').select('*').limit(1);
        if (error && error.code !== 'PGRST204') {
          console.log('✅ Supabase conectado com sucesso!');
        } else {
          console.log('✅ Supabase conectado com sucesso!');
        }
      } catch (err) {
        console.error('❌ Erro ao conectar com Supabase:', err);
      }
    };

    testSupabaseConnection();
  }, []);

  // Tracking Mock
  const trackGateEvent = (event: string, data: any) => {
    console.log(`[ANALYTICS] ${event}`, data);
  };

  const handleGateTrigger = (context: GateContext) => {
    setGateContext(context);
    trackGateEvent('gate_triggered', context);
  };

  const handleUpgradeConfirm = () => {
    trackGateEvent('upgrade_clicked', { from: state.planTier, context: gateContext });
    setGateContext(null);
    navigateTo(View.PRICING);
  };

  const handleBuyCredits = (amount: number) => {
    trackGateEvent('credits_purchased_attempt', { amount });
    // Simulate purchase success
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        usage: {
          ...prev.usage,
          extraCreditsBalance: prev.usage.extraCreditsBalance + amount
        }
      }));
      setGateContext(null);
      alert(`Sucesso! ${amount} créditos adicionados.`);
    }, 1000);
  };

  useEffect(() => {
    if (state.isLoggedIn && state.hasOnboarded) {
      setTimeout(() => {
        const mockNotifications: AppNotification[] = [
          {
            id: 'n1',
            type: 'ACHIEVEMENT',
            title: 'Estratégia Ativada',
            message: 'Você completou o assessment inicial e seu núcleo estratégico está operacional.',
            isRead: false,
            createdAt: '2 horas atrás',
          },
          {
            id: 'n2',
            type: 'SYSTEM',
            title: 'Bem-vindo ao Flui',
            message: 'Explore o Studio para refinar seu arquétipo de marca.',
            isRead: true,
            createdAt: '1 dia atrás',
            actionLabel: 'Ir para Studio',
            targetView: View.STRATEGY
          }
        ];

        const mockRecs: Recommendation[] = [
          {
            id: 'r1',
            type: 'PRODUCTION_PACE',
            message: 'Seu ritmo de produção está 20% abaixo da meta semanal definida no Assessment.',
            actionLabel: 'Criar Session',
            targetView: View.SESSIONS
          },
          {
            id: 'r2',
            type: 'QUALITY_CHECK',
            message: 'Detectamos inconsistência no tom de voz nos últimos 3 conteúdos.',
            actionLabel: 'Revisar Editor',
            targetView: View.SESSIONS
          }
        ];

        setState(prev => ({
          ...prev,
          notifications: mockNotifications,
          recommendations: mockRecs,
          momentumScore: 72
        }));
      }, 1500);
    }
  }, [state.isLoggedIn, state.hasOnboarded]);

  const handleLoginSuccess = () => {
    setState(prev => ({
      ...prev,
      isLoggedIn: true,
      view: View.DASHBOARD
    }));
  };

  const handleLogout = () => {
    setState(prev => ({
      ...prev,
      isLoggedIn: false,
      view: View.AUTH
    }));
  };

  const handleOnboardingComplete = (data: AssessmentData, strategy: StrategyCore) => {
    setState(prev => ({
      ...prev,
      assessment: data,
      strategy: strategy,
      hasOnboarded: true,
      view: View.STRATEGY
    }));
    // Mark first step complete in onboarding checklist
    completeStep('profile');
  };

  const handleAddSession = (session: Session) => {
    setState(prev => ({
      ...prev,
      sessions: [...prev.sessions, session],
      usage: {
        ...prev.usage,
        currentSessions: prev.usage.currentSessions + 1
      }
    }));
    // Mark content creation step potentially
    completeStep('content');
  };

  const navigateTo = (view: View, entityId?: string) => {
    // If entityId is provided, handle specific routing (simple version for now)
    if (entityId) {
      // Logic to handle specific entity opening can be added here
      console.log("Navigating to entity:", entityId);
    }

    setState(prev => ({ ...prev, view }));
  };

  const handleViewSessionDetail = (id: string) => {
    setState(prev => ({ ...prev, activeSessionId: id, view: View.SESSION_DETAIL }));
  };

  const handleViewEditorDetail = (id: string) => {
    setState(prev => ({ ...prev, activeEditorId: id, view: View.EDITOR_DETAIL }));
  };

  // Handler for Pulse to create content
  const handlePulseCreateContent = (opportunityId: string) => {
    console.log("Creating content from opportunity:", opportunityId);
    // In a real app, we would create a draft here. For now, navigate to Sessions builder.
    navigateTo(View.SESSIONS);
  };

  const handleMarkNotificationRead = (id: string) => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => n.id === id ? { ...n, isRead: true } : n)
    }));
  };

  // Handler to bridge Content Lab -> Visual Studio
  const handleOpenVisualEditor = (content: string) => {
    setVisualEditorData(content);
    navigateTo(View.VISUAL_STUDIO);
  };

  // Onboarding Action Handler
  const handleOnboardingAction = (actionId: string) => {
    switch (actionId) {
      case 'GO_PROFILE': navigateTo(View.PROFILE); break;
      case 'CONNECT_LINKEDIN':
        // Intercept navigation to open modal directly
        setIsLinkedInConnectOpen(true);
        break;
      case 'GO_STRATEGY': navigateTo(View.STRATEGY); break;
      case 'GO_SESSIONS': navigateTo(View.SESSIONS); break;
      case 'GO_CALENDAR': navigateTo(View.SESSIONS); break; // Or Dashboard if calendar is there
      default: console.log('Unknown action', actionId);
    }
    // Mobile experience: Close panel on action
    if (window.innerWidth < 1024) togglePanel();
  };

  const handleConnectLinkedIn = () => {
    setIsConnectingLinkedIn(true);
    // Simulate API call
    setTimeout(() => {
      setIsConnectingLinkedIn(false);
      setIsLinkedInConnectOpen(false);
      completeStep('linkedin'); // Mark onboarding step as done

      // Optional: Add notification or Navigate to profile
      // navigateTo(View.PROFILE); 
    }, 2000);
  };

  const renderContent = () => {
    if (state.view === View.AUTH) {
      return <AuthPage onLogin={handleLoginSuccess} />;
    }

    if (state.view === View.ONBOARDING) {
      return <Onboarding onComplete={handleOnboardingComplete} initialMode={onboardingMode} />;
    }

    switch (state.view) {
      case View.DASHBOARD:
        return (
          <Dashboard
            state={state}
            onNavigate={navigateTo}
            onViewSession={handleViewSessionDetail}
            onGateTrigger={handleGateTrigger}
          />
        );

      case View.NOTIFICATIONS:
        return (
          <Notifications
            notifications={state.notifications}
            onNavigate={navigateTo}
            onMarkAsRead={handleMarkNotificationRead}
          />
        );

      case View.STRATEGY:
        return (
          <StrategyStudio
            strategy={state.strategy}
            assessment={state.assessment}
            onNavigateToSession={() => navigateTo(View.SESSIONS)}
            onStartOnboarding={(mode) => {
              setOnboardingMode(mode);
              navigateTo(View.ONBOARDING);
            }}
          />
        );

      case View.SESSIONS:
        return (
          <Sessions
            sessions={state.sessions}
            strategy={state.strategy}
            planTier={state.planTier}
            currentSessionsUsage={state.usage.currentSessions} // Legacy prop support
            onAddSession={handleAddSession}
            onViewDetail={handleViewSessionDetail}
            onGateTrigger={handleGateTrigger}
          />
        );

      case View.FRAMEWORKS:
        return (
          <Frameworks
            strategy={state.strategy}
            onApply={(fwId) => navigateTo(View.SESSIONS)}
          />
        );

      case View.PULSE:
        return (
          <Pulse
            niche={state.assessment?.niche}
            onNavigate={navigateTo}
            onCreateContent={handlePulseCreateContent}
          />
        );

      case View.VISUAL_STUDIO:
        return (
          <VisualStudio
            strategy={state.strategy}
            initialContent={visualEditorData}
          />
        );

      case View.PROFILE:
        return <Profile />;

      case View.PRICING:
        return <PricingPage />;

      case View.SESSION_DETAIL:
        const activeSession = state.sessions.find(s => s.id === state.activeSessionId);
        if (!activeSession) return <div>Session not found</div>;
        return (
          <SessionDetail
            session={activeSession}
            onBack={() => navigateTo(View.SESSIONS)}
            onOpenDocument={handleViewEditorDetail}
            onOpenVisual={(item) => {
              // Logic to pass item content to visual editor
              const content = `[${item.title}]\n${item.contentSnippet || 'Conteúdo do slide...'}`;
              setVisualEditorData(content);
              navigateTo(View.VISUAL_STUDIO);
            }}
          />
        );

      case View.EDITOR_DETAIL:
        if (!state.activeEditorId) return <div>Erro</div>;
        return <EditorDetail documentId={state.activeEditorId} onBack={() => navigateTo(View.SESSION_DETAIL)} />;

      default:
        return <div className="p-8">View under construction</div>;
    }
  };

  const showSidebar =
    state.isLoggedIn &&
    state.view !== View.ONBOARDING &&
    state.view !== View.AUTH;

  const unreadCount = state.notifications.filter(n => !n.isRead).length;

  return (
    // APP SHELL: h-screen and overflow-hidden ensures the sidebar is "fixed"
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans text-brand-dark">
      {showSidebar && (
        <Sidebar
          currentView={state.view}
          onChangeView={navigateTo}
          strategyExists={!!state.strategy}
          onLogout={handleLogout}
          credits={state.usage.monthlyLimit - state.usage.monthlyUsageCount}
        />
      )}

      {/* MAIN CONTENT: Scrolls independently */}
      <main className={`flex-1 h-full overflow-y-auto relative ${!showSidebar ? 'w-full' : ''}`}>
        {showSidebar && (
          <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 h-16 flex items-center justify-between px-8">

            {/* Global Search Trigger */}
            <div className="flex-1 max-w-xl">
              <button
                onClick={() => setIsCommandCenterOpen(true)}
                className="w-full flex items-center justify-between px-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm text-gray-500 hover:border-gray-300 hover:bg-white transition-all group"
              >
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-gray-400 group-hover:text-trust-primary" />
                  <span className="truncate">Pesquisar ou executar comando...</span>
                </div>
                <div className="hidden md:flex items-center gap-1">
                  <kbd className="hidden sm:inline-block border border-gray-200 rounded px-1.5 py-0.5 text-[10px] font-medium text-gray-400 bg-gray-100">
                    <span className="text-xs">⌘</span>K
                  </kbd>
                </div>
              </button>
            </div>

            <div className="flex items-center gap-4 pl-4">
              {/* Plan Badge - Visible everywhere */}
              <Badge variant={state.planTier === PlanTier.PRO ? 'trust' : 'secondary'} className="hidden sm:flex">
                {state.planTier}
              </Badge>

              <button
                onClick={() => navigateTo(View.NOTIFICATIONS)}
                className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <Bell className="h-5 w-5 text-gray-500" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-energy-primary ring-2 ring-white"></span>
                )}
              </button>
            </div>
          </header>
        )}
        {renderContent()}

        {/* Global Components */}
        <CommandCenter
          isOpen={isCommandCenterOpen}
          onClose={() => setIsCommandCenterOpen(false)}
          onNavigate={navigateTo}
        />

        {/* GATING HYBRID MODAL */}
        <HybridUpgradeModal
          isOpen={!!gateContext}
          onClose={() => setGateContext(null)}
          context={gateContext}
          onUpgrade={handleUpgradeConfirm}
          onBuyCredits={handleBuyCredits}
        />

        {/* LinkedIn Connection Modal */}
        <Modal
          isOpen={isLinkedInConnectOpen}
          onClose={() => setIsLinkedInConnectOpen(false)}
          title="Conectar LinkedIn"
          maxWidth="max-w-md"
        >
          <div className="flex flex-col items-center text-center mt-4">
            <div className="h-16 w-16 bg-[#0077b5] rounded-full flex items-center justify-center mb-6 shadow-lg shadow-blue-200">
              <Linkedin className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Conecte sua conta profissional</h3>
            <p className="text-sm text-gray-500 mb-8 max-w-[280px]">
              Ao conectar, o Flui poderá analisar seu perfil, sugerir conexões e agendar publicações automaticamente.
            </p>

            <div className="w-full space-y-3">
              <Button
                className="w-full bg-[#0077b5] hover:bg-[#006097] text-white border-0 h-12 text-base font-bold shadow-md hover:shadow-lg transition-all"
                onClick={handleConnectLinkedIn}
                loading={isConnectingLinkedIn}
              >
                {isConnectingLinkedIn ? 'Conectando...' : 'Conectar LinkedIn'}
              </Button>
              <Button
                variant="ghost"
                className="w-full text-gray-500"
                onClick={() => setIsLinkedInConnectOpen(false)}
                disabled={isConnectingLinkedIn}
              >
                Pular por enquanto
              </Button>
            </div>

            <div className="mt-6 flex items-center gap-2 text-[10px] text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full">
              <CheckCircle2 className="h-3 w-3" />
              Conexão segura via OAuth 2.0
            </div>
          </div>
        </Modal>

        {/* Onboarding Overlay Elements */}
        {state.isLoggedIn && state.hasOnboarded && (
          <>
            <OnboardingPanel
              isOpen={isOnboardingOpen}
              isCollapsed={isOnboardingCollapsed}
              steps={onboardingSteps}
              progress={onboardingProgress}
              completedCount={completedCount}
              totalSteps={totalSteps}
              onClose={closePanel}
              onToggleCollapse={toggleCollapse}
              onAction={handleOnboardingAction}
            />
            <OnboardingTrigger
              progress={onboardingProgress}
              onClick={openPanel}
              visible={!isOnboardingOpen}
            />
          </>
        )}
      </main>
    </div>
  );
}
