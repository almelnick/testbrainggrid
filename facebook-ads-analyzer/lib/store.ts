import { Client, PerformanceRule, Prompt, ExecutionLog, AdResult, Settings, PerformanceCategory } from './types';

const store = {
  clients: new Map<string, Client>(),
  logs: new Map<string, ExecutionLog>(),
  results: new Map<string, AdResult>(),
  rules: new Map<string, PerformanceRule>(),
  prompt: null as Prompt | null,
  settings: {
    anthropicApiKey: process.env.ANTHROPIC_API_KEY || '',
    defaultDatePreset: 'last_28d',
    maxAdsPerRun: 500,
    autoRefreshTokens: true,
  } as Settings,
};

const defaultRules: PerformanceRule[] = [
  { category: 'HELL YES', minSpend: 100, roasVsBenchmark: 1.5, color: '#22c55e', emoji: '🔥', description: 'Dramatically outperforms benchmarks. Clear 80/20 driver.' },
  { category: 'YES', minSpend: 100, roasVsBenchmark: 1.15, color: '#84cc16', emoji: '✅', description: 'Clearly outperforms benchmarks. Reliably contributing.' },
  { category: 'MAYBE', minSpend: 50, roasVsBenchmark: 0.9, color: '#f59e0b', emoji: '🤔', description: 'Marginal results. Requires observation and optimization.' },
  { category: 'NOT REALLY', minSpend: 0, roasVsBenchmark: 0, color: '#f97316', emoji: '👎', description: 'Metrics at or below benchmarks. Not a clear winner.' },
  { category: 'WE WASTED MONEY', minSpend: 30, roasVsBenchmark: 0, color: '#ef4444', emoji: '💸', description: 'Significantly underperforming. Pause candidate.' },
  { category: 'INSUFFICIENT DATA/SPEND', minSpend: 0, roasVsBenchmark: 0, color: '#6b7280', emoji: '📊', description: 'Spend < $50. Not enough data for confident categorization.' },
];
defaultRules.forEach((r) => store.rules.set(r.category, r));

store.prompt = {
  id: 'default',
  name: 'Senior Facebook Ads Media Buyer',
  content: `**Role:** You are a Senior Facebook Ads Media Buyer with extensive experience in e-commerce campaign optimization.

**Task:** Evaluate each ad creative against account benchmarks and categorize its performance.

**Categories:**
- **"HELL YES"**: Spend >= $100 AND dramatically outperforms benchmarks (ROAS >= 1.5x benchmark)
- **"YES"**: Spend >= $100 AND clearly outperforms benchmarks
- **"MAYBE"**: Spend >= $50. Marginal or mixed results
- **"NOT REALLY"**: Underperforming. Metrics at/below benchmarks
- **"WE WASTED MONEY"**: Performing very poorly with significant spend
- **"INSUFFICIENT DATA/SPEND"**: Spend < $50

**Ad Creative Performance Data:**
{{AD_DATA}}

**Account Benchmark Data:**
{{BENCHMARK_DATA}}

**Output:** Return a JSON array where each element has: ad_id, ad_name, total_spend_creative, performance_category, justification, key_performance_indicators, recommendation.`,
  updatedAt: new Date().toISOString(),
};

const demoClientId = 'demo-client-1';
store.clients.set(demoClientId, {
  id: demoClientId, name: 'Demo E-commerce Store', adAccountId: 'act_123456789',
  facebookToken: 'demo-token', tokenExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  googleSheetId: '1_9fnWQm3ipnWg3DvP6XD-EnT2e5vZRvVlQyVA0rbNMQ', geminiApiKey: '',
  status: 'active', createdAt: new Date().toISOString(),
});

const seedCategories: PerformanceCategory[] = ['HELL YES','YES','YES','MAYBE','NOT REALLY','WE WASTED MONEY','INSUFFICIENT DATA/SPEND','MAYBE'];
const adNames = ['UGC Video - Happy Customer Testimonial','Static Image - Product Hero Shot','Carousel - Top 5 Products','Video - Before & After Demo','Static Image - Lifestyle Shot','Video - Founder Story','UGC - Unboxing Experience','Static - Sale Promotion 30% OFF'];
const spendMap: Record<string, number> = { 'HELL YES': 490, YES: 320, MAYBE: 85, 'NOT REALLY': 210, 'WE WASTED MONEY': 150, 'INSUFFICIENT DATA/SPEND': 30 };

const demoLogId = 'log-demo-1';
store.logs.set(demoLogId, { id: demoLogId, clientId: demoClientId, clientName: 'Demo E-commerce Store', startedAt: new Date(Date.now() - 3600000).toISOString(), completedAt: new Date(Date.now() - 3540000).toISOString(), status: 'completed', adsProcessed: 8, totalSpend: 4820.5 });

adNames.forEach((name, i) => {
  const cat = seedCategories[i];
  const spend = spendMap[cat] ?? 100;
  const purchases = cat === 'HELL YES' ? 93 : cat === 'YES' ? 48 : cat === 'WE WASTED MONEY' ? 5 : 15;
  const purchaseValue = purchases * (cat === 'HELL YES' ? 104 : 80);
  const impressions = Math.floor(spend * 80);
  const clicks = Math.floor(impressions * 0.025);
  const result: AdResult = {
    id: `result-${i}`, executionId: demoLogId, clientId: demoClientId,
    adId: `ad_${100000 + i}`, adName: name, campaignName: 'Summer Sale 2024', adsetName: 'Broad Audience',
    objective: 'OUTCOME_SALES', dateStart: '2024-05-01', dateStop: '2024-05-28',
    totalSpend: spend, totalImpressions: impressions, totalClicks: clicks,
    totalAddToCarts: Math.floor(purchases * 3.5), totalCheckoutsInitiated: Math.floor(purchases * 1.8),
    totalPurchases: purchases, totalPurchaseValue: purchaseValue,
    ctr: parseFloat((clicks / impressions).toFixed(4)), cpc: parseFloat((spend / clicks).toFixed(2)),
    cpm: parseFloat(((spend / impressions) * 1000).toFixed(2)),
    costPerAddToCart: parseFloat((spend / Math.max(1, Math.floor(purchases * 3.5))).toFixed(2)),
    costPerCheckout: parseFloat((spend / Math.max(1, Math.floor(purchases * 1.8))).toFixed(2)),
    costPerPurchase: parseFloat((spend / Math.max(1, purchases)).toFixed(2)),
    roas: parseFloat((purchaseValue / spend).toFixed(2)),
    averageOrderValue: parseFloat((purchaseValue / Math.max(1, purchases)).toFixed(2)),
    conversionRate: ((purchases / Math.max(1, clicks)) * 100).toFixed(2) + '%',
    performanceCategory: cat,
    justification: cat === 'HELL YES' ? `With $${spend} spend driving ${purchases} purchases at a ROAS of ${(purchaseValue/spend).toFixed(2)}x, this ad dramatically outperforms the account benchmark.` : cat === 'WE WASTED MONEY' ? `Despite $${spend} in spend, only ${purchases} purchases at ${(purchaseValue/spend).toFixed(2)}x ROAS. Pause immediately.` : `This ad shows ${cat === 'YES' ? 'solid' : 'mixed'} performance with a ROAS of ${(purchaseValue/spend).toFixed(2)}x.`,
    recommendation: cat === 'HELL YES' ? 'Aggressively Scale Budget' : cat === 'YES' ? 'Scale Gradually 20%' : cat === 'MAYBE' ? 'Monitor & Test Variations' : cat === 'WE WASTED MONEY' ? 'Pause Immediately' : cat === 'INSUFFICIENT DATA/SPEND' ? 'Wait for More Data' : 'Reduce Budget or Pause',
    analyzedAt: new Date().toISOString(),
  };
  store.results.set(result.id, result);
});

export const Store = {
  getClients: () => Array.from(store.clients.values()),
  getClient: (id: string) => store.clients.get(id),
  setClient: (client: Client) => store.clients.set(client.id, client),
  deleteClient: (id: string) => store.clients.delete(id),
  getLogs: () => Array.from(store.logs.values()).sort((a, b) => b.startedAt.localeCompare(a.startedAt)),
  getLog: (id: string) => store.logs.get(id),
  setLog: (log: ExecutionLog) => store.logs.set(log.id, log),
  getResults: (filter?: { executionId?: string; clientId?: string }) => {
    let all = Array.from(store.results.values());
    if (filter?.executionId) all = all.filter((r) => r.executionId === filter.executionId);
    if (filter?.clientId) all = all.filter((r) => r.clientId === filter.clientId);
    return all.sort((a, b) => b.totalSpend - a.totalSpend);
  },
  setResult: (result: AdResult) => store.results.set(result.id, result),
  getRules: () => Array.from(store.rules.values()),
  setRule: (rule: PerformanceRule) => store.rules.set(rule.category, rule),
  getPrompt: () => store.prompt,
  setPrompt: (p: Prompt) => { store.prompt = p; },
  getSettings: () => store.settings,
  setSettings: (s: Partial<Settings>) => { store.settings = { ...store.settings, ...s }; },
};
