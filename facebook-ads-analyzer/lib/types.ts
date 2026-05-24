export type PerformanceCategory =
  | 'HELL YES'
  | 'YES'
  | 'MAYBE'
  | 'NOT REALLY'
  | 'WE WASTED MONEY'
  | 'INSUFFICIENT DATA/SPEND';

export interface Client {
  id: string;
  name: string;
  adAccountId: string;
  facebookToken: string;
  tokenExpiry: string;
  googleSheetId: string;
  geminiApiKey: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface PerformanceRule {
  category: PerformanceCategory;
  minSpend: number;
  roasVsBenchmark: number;
  color: string;
  description: string;
  emoji: string;
}

export interface Prompt {
  id: string;
  name: string;
  content: string;
  updatedAt: string;
}

export interface ExecutionLog {
  id: string;
  clientId: string;
  clientName: string;
  startedAt: string;
  completedAt: string | null;
  status: 'running' | 'completed' | 'failed';
  adsProcessed: number;
  totalSpend: number;
  error?: string;
}

export interface AdResult {
  id: string;
  executionId: string;
  clientId: string;
  adId: string;
  adName: string;
  campaignName: string;
  adsetName: string;
  objective: string;
  dateStart: string;
  dateStop: string;
  totalSpend: number;
  totalImpressions: number;
  totalClicks: number;
  totalAddToCarts: number;
  totalCheckoutsInitiated: number;
  totalPurchases: number;
  totalPurchaseValue: number;
  ctr: number;
  cpc: number;
  cpm: number;
  costPerAddToCart: number;
  costPerCheckout: number;
  costPerPurchase: number;
  roas: number;
  averageOrderValue: number;
  conversionRate: string;
  performanceCategory: PerformanceCategory;
  justification: string;
  recommendation: string;
  analyzedAt: string;
}

export interface BenchmarkData {
  totalSpend: number;
  totalImpressions: number;
  totalClicks: number;
  totalPurchases: number;
  totalPurchaseValue: number;
  ctr: number;
  cpc: number;
  cpm: number;
  costPerPurchase: number;
  roas: number;
  conversionRate: string;
  averageOrderValue: number;
}

export interface Settings {
  anthropicApiKey: string;
  defaultDatePreset: string;
  maxAdsPerRun: number;
  autoRefreshTokens: boolean;
}
