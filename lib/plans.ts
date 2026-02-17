
import { PlanTier, PlanLimits, UserUsage, AccessStatus } from '../types';

export const PLANS_CONFIG: Record<PlanTier, PlanLimits> = {
  [PlanTier.FREE]: {
    maxSessions: 1,
    monthlyCredits: 250,
    maxPulseSources: 2,
    allowAdvancedInsights: false,
    allowAllFrameworks: false, // Access to basic frameworks only
    supportLevel: 'community'
  },
  [PlanTier.GROWTH]: {
    maxSessions: 3,
    monthlyCredits: 1000,
    maxPulseSources: 10,
    allowAdvancedInsights: true,
    allowAllFrameworks: true,
    supportLevel: 'email'
  },
  [PlanTier.PRO]: {
    maxSessions: 100, // Unlimited effectively
    monthlyCredits: 5000,
    maxPulseSources: 50,
    allowAdvancedInsights: true,
    allowAllFrameworks: true,
    supportLevel: 'priority'
  }
};

export const CREDIT_PACKAGES = [
  { id: 'pack_s', credits: 100, price: 49, label: 'Starter Pack' },
  { id: 'pack_m', credits: 500, price: 199, label: 'Creator Pack' },
  { id: 'pack_l', credits: 1500, price: 499, label: 'Agency Pack' },
];

export const COST_TABLE = {
  AI_GENERATION: 20,
  PULSE_TRACKING: 50,
  FRAMEWORK_ACCESS: 0 // Structural only
};

export const checkAccess = (
  tier: PlanTier, 
  usage: UserUsage,
  feature: keyof PlanLimits, 
  cost: number = 0
): AccessStatus => {
  const limit = PLANS_CONFIG[tier][feature];
  
  // 1. Structural Limits (Boolean or Hard Cap)
  if (typeof limit === 'boolean') {
    return limit ? 'GRANTED_MONTHLY' : 'DENIED_STRUCTURAL';
  }
  
  if (feature === 'maxSessions' || feature === 'maxPulseSources') {
    // Current usage comes from the usage object mapping (active sessions, pulse sources count)
    // For 'maxSessions', we check usage.currentSessions
    // For 'maxPulseSources', we check usage.pulseSources
    const currentMetric = feature === 'maxSessions' ? usage.currentSessions : usage.pulseSources;
    if (currentMetric < (limit as number)) {
      return 'GRANTED_MONTHLY';
    } else {
      return 'DENIED_STRUCTURAL';
    }
  }

  // 2. Consumption Limits (Credits)
  if (feature === 'monthlyCredits') {
    // First, check monthly balance
    if (usage.monthlyUsageCount + cost <= usage.monthlyLimit) {
      return 'GRANTED_MONTHLY';
    }
    
    // Second, check extra credits
    if (usage.extraCreditsBalance >= cost) {
      return 'GRANTED_EXTRA';
    }

    return 'DENIED_LIMIT';
  }
  
  return 'GRANTED_MONTHLY'; // Fallback
};

export const GATE_MESSAGES = {
  SESSIONS: {
    headline: "Escale sua operação",
    subheadline: "Você atingiu o limite de Sessions ativas no seu plano atual.",
    benefit: "Gerencie múltiplos ciclos de conteúdo simultâneos.",
    current: "Limite de 1 Session ativa",
    next: "Até 3 Sessions simultâneas"
  },
  CREDITS: {
    headline: "Sem limites para criar",
    subheadline: "Seus créditos mensais acabaram. Escolha como continuar.",
    benefit: "Gere mais diagnósticos e conteúdos com IA.",
    current: "Créditos esgotados",
    next: "Recarga imediata ou upgrade"
  },
  INSIGHTS: {
    headline: "Inteligência Avançada",
    subheadline: "Desbloqueie o cérebro estratégico da IA.",
    benefit: "Acesse recomendações preditivas baseadas no seu histórico.",
    current: "Insights básicos",
    next: "Recomendações estratégicas de IA"
  },
  FRAMEWORKS: {
    headline: "Frameworks Premium",
    subheadline: "Acesse a biblioteca completa de estruturas.",
    benefit: "Desbloqueie estruturas validadas de alta conversão.",
    current: "Acesso limitado",
    next: "Biblioteca completa de frameworks"
  },
  PULSE: {
    headline: "Radar de Mercado Completo",
    subheadline: "Monitore mais fontes e não perca nenhuma oportunidade.",
    benefit: "Acompanhe todos os seus concorrentes e inspirações.",
    current: "2 fontes monitoradas",
    next: "10 fontes de monitoramento"
  }
};
