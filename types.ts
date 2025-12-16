export interface Recommendation {
  issue: string;
  fix: string;
  impact: 'High' | 'Medium' | 'Low';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  keywords?: string[];
}

export interface RoiEstimate {
  trafficGain: string;
  leadIncrease: string;
  revenueProjection: string;
}

export interface ImplementationStep {
  week: number;
  focus: string;
  tasks: string[];
}

export interface AuditSection {
  id: string;
  title: string;
  score: number;
  summary: string;
  findings: string[]; // Renamed from weaknesses for friendly tone
  recommendations: Recommendation[];
}

export interface AuditReport {
  targetUrl: string;
  overallScore: number;
  executiveSummary: string;
  quickWins: string[];
  roiEstimate: RoiEstimate; // Added per PDF
  implementationPlan: ImplementationStep[]; // Added per PDF
  keywords: string[]; 
  keyPhrases: string[]; 
  keywordStrategy: string; 
  sections: AuditSection[];
  scanDate: string;
}

export interface GoogleAd {
  headlines: string[];
  descriptions: string[];
  keywords: string[];
}

export const AppState = {
  IDLE: 'IDLE',
  SCANNING: 'SCANNING',
  COMPLETE: 'COMPLETE',
  ERROR: 'ERROR',
} as const;

export type AppState = typeof AppState[keyof typeof AppState];

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}