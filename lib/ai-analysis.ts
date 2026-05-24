import Anthropic from '@anthropic-ai/sdk';
import { PerformanceCategory, AdResult } from './types';

interface AnalysisInput {
  adData: object[];
  benchmarkData: object;
  promptTemplate: string;
  apiKey: string;
  executionId: string;
  clientId: string;
}

interface AIAdResult {
  ad_id: string;
  ad_name: string;
  total_spend_creative: number;
  performance_category: PerformanceCategory;
  justification: string;
  key_performance_indicators: Record<string, number | string>;
  recommendation: string;
}

export async function analyzeAdsWithAI(input: AnalysisInput): Promise<Partial<AdResult>[]> {
  const client = new Anthropic({ apiKey: input.apiKey });

  const prompt = input.promptTemplate
    .replace('{{AD_DATA}}', JSON.stringify(input.adData, null, 2))
    .replace('{{BENCHMARK_DATA}}', JSON.stringify(input.benchmarkData, null, 2));

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 8000,
    messages: [
      {
        role: 'user',
        content: prompt + '\n\nIMPORTANT: Respond ONLY with a valid JSON array. No markdown, no explanation. Start with [ and end with ].',
      },
    ],
  });

  const textContent = message.content.find((c) => c.type === 'text');
  if (!textContent || textContent.type !== 'text') throw new Error('No text response from AI');

  let jsonText = textContent.text.trim();
  jsonText = jsonText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');

  const aiResults: AIAdResult[] = JSON.parse(jsonText);

  return aiResults.map((r) => ({
    id: `result-${Date.now()}-${r.ad_id}`,
    executionId: input.executionId,
    clientId: input.clientId,
    adId: r.ad_id,
    adName: r.ad_name,
    performanceCategory: r.performance_category,
    justification: r.justification,
    recommendation: r.recommendation,
    analyzedAt: new Date().toISOString(),
  }));
}

interface ParsedAd {
  adId: string;
  adName: string;
  campaignName: string;
  adsetName: string;
  objective: string;
  spend: number;
  impressions: number;
  clicks: number;
  dateStart: string;
  dateStop: string;
  addToCarts: number;
  checkoutsInitiated: number;
  purchases: number;
  purchaseValue: number;
}

export function buildAdDataForLLM(ads: ParsedAd[]) {
  return ads.map((ad) => {
    const roas = ad.spend > 0 ? ad.purchaseValue / ad.spend : 0;
    const ctr = ad.impressions > 0 ? ad.clicks / ad.impressions : 0;
    const convRate = ad.clicks > 0 ? ad.purchases / ad.clicks : 0;
    const cpp = ad.purchases > 0 ? ad.spend / ad.purchases : 0;

    return {
      ad_id: ad.adId,
      ad_name: ad.adName,
      campaign_name: ad.campaignName,
      adset_name: ad.adsetName,
      total_spend: parseFloat(ad.spend.toFixed(2)),
      total_impressions: ad.impressions,
      total_clicks: ad.clicks,
      total_purchases: ad.purchases,
      total_purchase_value: parseFloat(ad.purchaseValue.toFixed(2)),
      roas: parseFloat(roas.toFixed(2)),
      ctr: parseFloat((ctr * 100).toFixed(2)) + '%',
      cpc: ad.clicks > 0 ? parseFloat((ad.spend / ad.clicks).toFixed(2)) : 0,
      conversion_rate: parseFloat((convRate * 100).toFixed(2)) + '%',
      cost_per_purchase: parseFloat(cpp.toFixed(2)),
      average_order_value: ad.purchases > 0 ? parseFloat((ad.purchaseValue / ad.purchases).toFixed(2)) : 0,
    };
  });
}
