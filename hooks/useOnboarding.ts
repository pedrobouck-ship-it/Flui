
import { useState, useEffect } from 'react';
import { OnboardingStep, View } from '../types';
import { 
  Rocket, Lightbulb, User, Target, CheckCircle2, 
  Layout, Settings, Users, Compass
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const useOnboarding = (onComplete: () => void) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Bem-vindo ao Flui',
      description: 'Sua jornada para escala eficiente começa aqui. Vamos configurar seu ambiente em 30 segundos.',
      icon: Rocket,
      required: true,
      actions: [{ label: 'Conhecer a interface', type: 'INFO' }]
    },
    {
      id: 'strategy',
      title: 'Defina sua Estratégia',
      description: 'Crie seu primeiro Strategy Core para dar contexto à IA e garantir coerência em cada post.',
      icon: Target,
      required: true,
      actions: [{ label: 'Abrir Strategy Studio', type: 'NAVIGATE', targetView: View.STRATEGY }]
    },
    {
      id: 'blueprint',
      title: 'Escolha um Blueprint',
      description: 'Estruturas de conteúdo validadas pelo mercado. Carrosséis, vídeos ou landing pages em segundos.',
      icon: Lightbulb,
      required: true,
      actions: [{ label: 'Explorar Blueprints', type: 'NAVIGATE', targetView: View.BLUEPRINTS }]
    },
    {
      id: 'pulse',
      title: 'Pulse Trends',
      description: 'Conecte sua estratégia com o que está em alta agora. A IA filtra o ruído para você.',
      icon: Compass,
      required: false,
      actions: [{ label: 'Ver tendências', type: 'NAVIGATE', targetView: View.PULSE }]
    },
    {
      id: 'profile',
      title: 'Seu Perfil de Marca',
      description: 'Configure seu tom de voz e arquétipos para que a IA escreva exatamente como você.',
      icon: User,
      required: true,
      actions: [{ label: 'Configurar Marca', type: 'NAVIGATE', targetView: View.PROFILE }]
    }
  ];

  const completeStep = (stepId: string) => {
    if (!completedSteps.includes(stepId)) {
      const newCompleted = [...completedSteps, stepId];
      setCompletedSteps(newCompleted);
      
      // Trigger confetti if it was the last required step or last step overall
      if (newCompleted.length === steps.length) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#6366f1', '#ea580c', '#ffffff']
        });
        setTimeout(onComplete, 3000);
      }
    }
  };

  const nextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const setStep = (index: number) => {
    if (index >= 0 && index < steps.length) {
      setCurrentStepIndex(index);
    }
  };

  const openOnboarding = () => setIsOpen(true);
  const closeOnboarding = () => setIsOpen(false);

  // Return logic
  return {
    steps,
    currentStepIndex,
    completedSteps,
    isOpen,
    progress: (completedSteps.length / steps.length) * 100,
    nextStep,
    prevStep,
    setStep,
    completeStep,
    openOnboarding,
    closeOnboarding,
    incompleteRequiredCount: steps.filter(s => s.required && !completedSteps.includes(s.id)).length
  };
};
