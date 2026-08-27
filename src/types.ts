export type Language = 'en' | 'te' | 'hi';

export type SourceType = 
  | 'Official BIS Portal'
  | 'Indian Standard (IS)'
  | 'Gazette Notification / QCO'
  | 'Product Manual / STI'
  | 'Laboratory Directory'
  | 'Certification Scheme'
  | 'Demo Knowledge Base';

export type VerificationStatus = 
  | 'VERIFIED_OFFICIAL' 
  | 'VERIFIED_DRAFT' 
  | 'UNVERIFIED_DEMO' 
  | 'Verified Official BIS' 
  | 'Demonstration Record';

export type UserType = 'public' | 'developer';

export type NavigationTab = 
  | 'welcome' 
  | 'chat' 
  | 'catalog' 
  | 'comparator'
  | 'fee-estimator'
  | 'about' 
  | 'private-tools' 
  | 'rag' 
  | 'test' 
  | 'guide';

export type StandardTopic =
  | 'Standards Discovery'
  | 'Drinking Water & Beverages'
  | 'Electrical & Electronics'
  | 'Construction & Steel'
  | 'Chemicals & Plastics'
  | 'Consumer Safety & Toys'
  | 'Gold & Silver Hallmarking'
  | 'Certification & Licences'
  | 'Laboratories & Testing'
  | 'General BIS Services';

export interface KnowledgeRecord {
  id: string;
  isNumber?: string; // e.g. "IS 14543:2024" or undefined
  title: string;
  category?: string; // sector/industry e.g. "Food & Agriculture", "Construction", "Electronics"
  scopeAndSummary?: string; // Plain language summary of scope
  content: string;
  keyHighlights: string[];
  certificationScheme?: string; // e.g., "Scheme I (ISI Mark) - Compulsory"
  testingAndLabRequirements?: string; // Key testing parameters & lab lookup advice
  officialPortalUrl?: string; // Direct official URL
  sourceUrl: string;
  sourceType: SourceType;
  topic: StandardTopic;
  lastVerified: string; // e.g. "2026-08-25"
  citationLabel: string;
  productKeywords: string[];
  mandatoryQCO?: boolean; // Is it under mandatory Quality Control Order?
  scheme?: string; // e.g., "Scheme-I (ISI Mark)", "CRS (Compulsory Registration)", "Hallmarking"
  verificationStatus?: VerificationStatus;
  pageNumber?: string | number;
  isDemoSample?: boolean;
}

export type ConfidenceLevel = 'high' | 'medium' | 'low' | 'none';

export interface ChatCitation {
  id: string;
  title: string;
  citationLabel: string;
  sourceUrl: string;
  sourceType: SourceType;
  lastVerified: string;
  topic: string;
  isNumber?: string;
  excerpt?: string;
  pageNumber?: string | number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  text: string;
  citations?: ChatCitation[];
  confidenceLevel?: ConfidenceLevel;
  requiresLegalDisclaimer?: boolean;
  modelUsed?: string;
  isFallback?: boolean;
  matchedSourcesCount?: number;
  retrievalScore?: number;
  timestamp: number;
}

export interface RetrievalResult {
  record: KnowledgeRecord;
  score: number;
  matchReasons: string[];
}

export interface ChatApiResponse {
  answer: string;
  citations: ChatCitation[];
  confidence: ConfidenceLevel;
  requiresLegalDisclaimer: boolean;
  modelUsed: string;
  isFallback: boolean;
  retrievedCount: number;
  debugInfo?: {
    queryTokens: string[];
    detectedIsNumbers: string[];
    topMatchScores: { id: string; title: string; score: number }[];
  };
}

export interface TestCase {
  id: string;
  title: string;
  category: string;
  prompt: string;
  expectedOutcome: string;
  expectedBehaviorNotes: string;
}
