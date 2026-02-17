
export enum View {
  // Auth
  AUTH = 'AUTH',
  
  // Application (Logged In)
  DASHBOARD = 'DASHBOARD',
  STRATEGY = 'STRATEGY',
  ONBOARDING = 'ONBOARDING',
  SESSIONS = 'SESSIONS',
  SESSION_DETAIL = 'SESSION_DETAIL',
  FRAMEWORKS = 'FRAMEWORKS',
  VISUAL_STUDIO = 'VISUAL_STUDIO', // New module
  EDITOR_DETAIL = 'EDITOR_DETAIL',
  SETTINGS = 'SETTINGS', // Can be used as alias or separate
  PROFILE = 'PROFILE',   // New Simple Profile View
  PRICING = 'PRICING',   // New Pricing Page
  NOTIFICATIONS = 'NOTIFICATIONS',
  PULSE = 'PULSE'
}

// --- PLANS & GATING ---
export enum PlanTier {
  FREE = 'FREE',
  GROWTH = 'GROWTH',
  PRO = 'PRO'
}

export interface PlanLimits {
  maxSessions: number;
  monthlyCredits: number;
  maxPulseSources: number;
  allowAdvancedInsights: boolean;
  allowAllFrameworks: boolean;
  supportLevel: 'community' | 'email' | 'priority';
}

export interface UserUsage {
  currentSessions: number;
  
  // Monthly Recurring
  monthlyUsageCount: number; // Credits used this month
  monthlyLimit: number;      // Snapshot of plan limit
  
  // Non-Expiring
  extraCreditsBalance: number; // Purchased credits
  
  // Other limits
  pulseSources: number;
}

export type AccessStatus = 'GRANTED_MONTHLY' | 'GRANTED_EXTRA' | 'DENIED_LIMIT' | 'DENIED_STRUCTURAL';

export interface GateContext {
  feature: string;
  triggerType: 'LIMIT' | 'FEATURE' | 'SCALE';
  currentPlan: PlanTier;
  requiredCredits?: number; // Cost of the action if applicable
}

// ... existing interfaces ...

export interface VisualPalette {
  id: string;
  name: string;
  bg: string; // Tailwind class
  text: string; // Tailwind class
  accent: string; // Tailwind class
  surface: string; // Tailwind class for cards/boxes inside slide
  overlayColor: string; // Hex for overlay calculation
}

export interface VisualTypography {
  id: string;
  name: string;
  headingFont: string; // Tailwind class
  bodyFont: string; // Tailwind class
  weight: string;
}

export type VisualTitleSize = 'SMALL' | 'MEDIUM' | 'LARGE' | 'IMPACT';
export type VisualAspectRatio = '16:9' | '4:5' | '1:1';
export type VisualVerticalAlign = 'TOP' | 'CENTER' | 'BOTTOM';
export type VisualTextAlign = 'LEFT' | 'CENTER' | 'RIGHT';
export type VisualBlockType = 'TEXT' | 'LIST' | 'HIGHLIGHT' | 'COMPARISON' | 'QUOTE' | 'CTA';

export interface VisualSlide {
  id: string;
  type: 'COVER' | 'CONTENT' | 'CTA';
  title: string;
  titleSize: VisualTitleSize; 
  titleIcon?: string; // New: Icon name
  content: string;
  density: 'LOW' | 'MEDIUM' | 'HIGH';
  
  // Per-slide Styling
  verticalAlign: VisualVerticalAlign; // Alignment
  textAlign: VisualTextAlign; // New: Text Alignment
  bgType: 'SOLID' | 'GRADIENT' | 'IMAGE'; // New: Per slide BG
  backgroundImage?: string; // New: Per slide BG
  bgOverlayOpacity?: number; // New: Per slide BG
  
  // Extended properties for VisualStudio
  layoutId?: string;
  bgImageFocus?: number;
  bgOverlayEnabled?: boolean;
  blockType?: VisualBlockType; // New: Modular Block Type
}

export interface VisualProject {
  id: string;
  type: 'CAROUSEL' | 'ONEPAGE';
  status: 'DRAFT' | 'SCHEDULED' | 'PUBLISHED';
  scheduledDate?: string;
  currentStep: 'IMPORT' | 'STRUCTURE' | 'STYLE' | 'EXPORT';
  
  // Layout Config
  aspectRatio: VisualAspectRatio; 

  // Style Config
  paletteId: string;
  typographyId: string;
  textColorMode: 'PRIMARY' | 'ACCENT' | 'WHITE' | 'BLACK'; 
  titleColorMode: 'PRIMARY' | 'ACCENT' | 'WHITE' | 'BLACK'; 
  
  // Content
  slides: VisualSlide[];
  
  // Signature
  showSignature: boolean;
  signatureName: string;
  signatureHandle: string;
  signaturePosition: 'CENTER' | 'RIGHT';
  avatarUrl?: string;
}

// ... rest of file (AssessmentData, StrategyCore, etc.)
export interface AssessmentData {
  mode: 'quick' | 'complete';
  niche: string;
  audience: string;
  primaryGoal: string;
  secondaryGoal?: string;
  perception: string[];
  name?: string;
  businessModel?: 'Personal' | 'B2B' | 'B2C';
  offerType?: 'Services' | 'Products' | 'None';
  offerDescription?: string;
  audiencePains?: string[];
  impactStatement?: string;
  contentPillars?: string[];
  maturityLevel: string;
  frequency: number;
  contentFormats: string[];
  strategicPriorities: string[];
  communicationTone: string[];
}

export interface ContentPillar {
  id: string; 
  name: string;
  description: string;
  objective: string;
  funnelRole?: string;
  contentTypes?: string[];
  angleExamples?: string[];
}

export interface BrandArchetype {
  name: string;
  traits: string[];
  description: string;
  strengths?: string[]; 
  risks?: string[];     
  confidenceScore?: number; 
}

export interface ValueProposition {
  headline: string;
  subheadline: string;
  promises: Array<{
    title: string;
    description: string;
    icon?: string;
  }>;
}

export interface StrategyCore {
  version: string; 
  lastUpdated: string;
  isActive: boolean;
  archetype: BrandArchetype;
  strategicPositioning: {
    statement: string;
    segment: string;
    result: string;
    mechanism: string; 
    differentiation: string;
    marketClarityScore: number; 
    differentiationScore: number; 
  };
  coreNarrative: string;
  valueProposition: ValueProposition;
  pillars: ContentPillar[];
  voiceTone: {
    style: string;
    keywords: string[];
  };
}

export enum SessionStatus {
  PLANNING = 'PLANNING',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  ARCHIVED = 'ARCHIVED'
}

export enum ContentStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  REVIEW = 'REVIEW',
  DONE = 'DONE',
  SCHEDULED = 'SCHEDULED', // Added for new flow
  PUBLISHED = 'PUBLISHED'  // Added for new flow
}

export interface SessionItem {
  id: string;
  title: string;
  format: string;
  status: ContentStatus;
  publishDate?: string;
  viralScore?: number;
  maturity?: 'Rascunho' | 'Estruturado' | 'Pronto' | 'Publicado';
  contentSnippet?: string;
  pillar?: string; 
  framework?: string;
}

export interface SessionSeries {
  id: string;
  title: string;
  items: SessionItem[];
  angle?: string;
  frequency?: string;
  format?: string;
}

export interface SessionTheme {
  id: string;
  title: string;
  focus: string;
  series: SessionSeries[];
}

export interface Session {
  id: string;
  name: string;
  objective: string; 
  pillars: string[]; 
  status: SessionStatus;
  startDate: string;
  endDate: string;
  progress: number;
  themes: SessionTheme[];
  stats: {
    totalContents: number;
    completedContents: number;
  };
}

export enum BlueprintStatus {
  ACTIVE = 'ACTIVE',
  DRAFT = 'DRAFT',
  ARCHIVED = 'ARCHIVED'
}

export interface Blueprint {
  id: string;
  name: string;
  status: BlueprintStatus;
  objective: string;
  intensity: number;
  duration: string;
  pillars: string[];
  createdAt: string;
  themes: SessionTheme[];
}

export interface ContentBlock {
  id: string;
  title: string;
  description: string;
  content: string;
}

export interface EditorDocument {
  id: string;
  title: string;
  status: ContentStatus;
  format: string;
  lastUpdated: string;
  theme: string;
  series: string;
  pillar: string;
  objective: string;
  angle: string;
  sessionName: string;
  frameworkId?: string; 
  headline: string;
  contentBlocks: ContentBlock[]; 
  aiSettings: {
    depth: 'Superficial' | 'Estratégico' | 'Técnico';
    tone: 'Provocativo' | 'Didático' | 'Analítico' | 'Inspiracional' | 'Autoridade';
    instructions: string;
  };
  references: {
    links: string[];
    files: string[]; 
  };
  ctaType: 'Authority' | 'Engagement' | 'Conversion';
  ctaText: string;
  
  // New Fields for Enhanced Editor
  coverImageUrl?: string;
  imageAltText?: string;
  scheduledAt?: string;
  scheduleSuggested?: boolean;
}

export interface AppNotification {
  id: string;
  type: 'STRATEGY' | 'PRODUCTION' | 'SYSTEM' | 'ACHIEVEMENT';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  actionLabel?: string;
  targetView?: View;
}

export interface Recommendation {
  id: string;
  type: 'STRATEGY_DRIFT' | 'PRODUCTION_PACE' | 'QUALITY_CHECK';
  message: string;
  actionLabel: string;
  targetView: View;
}

export interface AppState {
  view: View;
  hasOnboarded: boolean;
  assessment: AssessmentData;
  strategy: StrategyCore | null;
  sessions: Session[]; 
  notifications: AppNotification[];
  recommendations: Recommendation[];
  momentumScore: number;
  activeSessionId: string | null; 
  activeEditorId: string | null; 
  isLoggedIn: boolean;
  credits: number; // Display only
  
  // Plan & Usage
  planTier: PlanTier;
  usage: UserUsage;
}

// --- GLOBAL SEARCH ---
export interface SearchResult {
  id: string;
  workspace_id: string;
  entity_type: 'MODULE' | 'STRATEGY' | 'CONTENT' | 'USER' | 'ACTION';
  entity_id?: string;
  title: string;
  subtitle: string;
  keywords: string[];
  url?: string; // Logic path or external URL
  targetView?: View; // For internal navigation
  created_at?: string;
  updated_at?: string;
}
