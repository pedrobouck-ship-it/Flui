
import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

export interface OnboardingStep {
  id: string;
  title: string;
  estimatedTime: string;
  isCompleted: boolean;
  actionId: string;
}

const INITIAL_STEPS: OnboardingStep[] = [
  {
    id: 'profile',
    title: 'Complete seu perfil',
    estimatedTime: '2 min',
    isCompleted: false,
    actionId: 'GO_PROFILE'
  },
  {
    id: 'linkedin',
    title: 'Conecte sua conta LinkedIn',
    estimatedTime: '1 min',
    isCompleted: false,
    actionId: 'CONNECT_LINKEDIN'
  },
  {
    id: 'diagnostic',
    title: 'Gere seu primeiro diagnóstico',
    estimatedTime: '5 min',
    isCompleted: false,
    actionId: 'GO_STRATEGY'
  },
  {
    id: 'content',
    title: 'Crie seu primeiro conteúdo',
    estimatedTime: '10 min',
    isCompleted: false,
    actionId: 'GO_SESSIONS'
  },
  {
    id: 'schedule',
    title: 'Agende sua primeira publicação',
    estimatedTime: '2 min',
    isCompleted: false,
    actionId: 'GO_CALENDAR'
  }
];

export const useOnboarding = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [steps, setSteps] = useState<OnboardingStep[]>(INITIAL_STEPS);

  // Computed Progress
  const completedCount = steps.filter(s => s.isCompleted).length;
  const totalSteps = steps.length;
  const progress = Math.round((completedCount / totalSteps) * 100);

  // Check for completion
  useEffect(() => {
    if (progress === 100) {
      triggerCelebration();
      // Auto collapse after 3 seconds
      const timer = setTimeout(() => {
        setIsOpen(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [progress]);

  const triggerCelebration = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#6366F1', '#A855F7', '#EC4899'],
      disableForReducedMotion: true
    });
  };

  const togglePanel = () => setIsOpen(!isOpen);
  const closePanel = () => setIsOpen(false);
  const openPanel = () => setIsOpen(true);
  
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  const completeStep = (stepId: string) => {
    setSteps(prev => prev.map(s => 
      s.id === stepId ? { ...s, isCompleted: true } : s
    ));
  };

  const updateSteps = (newSteps: OnboardingStep[]) => {
    setSteps(newSteps);
  };

  return {
    isOpen,
    isCollapsed,
    steps,
    progress,
    completedCount,
    totalSteps,
    togglePanel,
    closePanel,
    openPanel,
    toggleCollapse,
    completeStep,
    updateSteps
  };
};
