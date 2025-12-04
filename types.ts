export interface Recommendation {
  issue: string;
  fix: string;
  impact: 'High' | 'Medium' | 'Low';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  keywords?: string[];
}

export interface AuditSection {
  id: string;
  title: string;
  score: number;
  summary: string;
  weaknesses: string[];
  recommendations: Recommendation[];
}

export interface AuditReport {
  targetUrl: string;
  overallScore: number;
  executiveSummary: string;
  quickWins: string[];
  businessImpact: string;
  keywords: string[]; // Top 10 niche keywords
  keyPhrases: string[]; // Top 10 niche phrases
  keywordStrategy: string; // Strategic advice on how to use these keywords
  sections: AuditSection[];
  scanDate: string;
}

// Changed from enum to const object to avoid potential syntax errors during runtime parsing
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