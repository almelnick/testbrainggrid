import { NextRequest, NextResponse } from 'next/server';
import { Store } from '@/lib/store';
import { generateId } from '@/lib/utils';
import { ExecutionLog, AdResult } from '@/lib/types';
import { fetchFacebookAds, generateMockAds, parseAdInsights, calculateBenchmarks } from '@/lib/facebook-api';
import { analyzeAdsWithAI, buildAdDataForLLM } from '@/lib/ai-analysis';

export async function POST(req: NextRequest) {
  const { clientId, demoMode } = await req.json();

  const client = Store.getClient(clientId);
  if (!client) return NextResponse.json({ error: 'Client not found' }, { status: 404 });

  const settings = Store.getSettings();
  const prompt = Store.getPrompt();
  if (!prompt) return NextResponse.json({ error: 'No prompt configured' }, { status: 400 });

  const executionId = generateId();
  const log: ExecutionLog = {
    id: executionId,
    clientId,
    clientName: client.name,
    startedAt: new Date().toISOString(),
    completedAt: null,
    status: 'running',
    adsProcessed: 0,
    totalSpend: 0,
  };
  Store.setLog(log);

  (async () => {
    try {
      const rawAds = demoMode
        ? generateMockAds()
        : await fetchFacebookAds(client.adAccountId, client.facebookToken);

      const parsed = parseAdInsights(rawAds).filter((a) => a.objective === 'OUTCOME_SALES');
      const aggregated = aggregateByAdName(parsed);
      const benchmarks = calculateBenchmarks(aggregated);
      const adDataForLLM = buildAdDataForLLM(aggregated);

      const apiKey = settings.anthropicApiKey || process.env.ANTHROPIC_API_KEY || '';
      const aiResults = await analyzeAdsWithAI({
        adData: adDataForLLM,
        benchmarkData: benchmarks,
        promptTemplate: prompt.content,
        apiKey,
        executionId,
        clientId,
      });

      const totalSpend = aggregated.reduce((s, a) => s + a.spend, 0);

      aggregated.forEach((ad) => {
        const aiResult = aiResults.find((r) => r.adId === ad.adId || r.adName === ad.adName);
        const roas = ad.spend > 0 ? ad.purchaseValue / ad.spend : 0;
        const ctr = ad.impressions > 0 ? ad.clicks / ad.impressions : 0;
        const convRate = ad.clicks > 0 ? ad.purchases / ad.clicks : 0;

        const result: AdResult = {
          id: `result-${executionId}-${ad.adId}`,
          executionId,
          clientId,
          adId: ad.adId,
          adName: ad.adName,
          campaignName: ad.campaignName,
          adsetName: ad.adsetName,
          objective: ad.objective,
          dateStart: ad.dateStart,
          dateStop: ad.dateStop,
          totalSpend: parseFloat(ad.spend.toFixed(2)),
          totalImpressions: ad.impressions,
          totalClicks: ad.clicks,
          totalAddToCarts: ad.addToCarts,
          totalCheckoutsInitiated: ad.checkoutsInitiated,
          totalPurchases: ad.purchases,
          totalPurchaseValue: parseFloat(ad.purchaseValue.toFixed(2)),
          ctr: parseFloat((ctr * 100).toFixed(4)),
          cpc: ad.clicks > 0 ? parseFloat((ad.spend / ad.clicks).toFixed(2)) : 0,
          cpm: ad.impressions > 0 ? parseFloat(((ad.spend / ad.impressions) * 1000).toFixed(2)) : 0,
          costPerAddToCart: ad.addToCarts > 0 ? parseFloat((ad.spend / ad.addToCarts).toFixed(2)) : 0,
          costPerCheckout: ad.checkoutsInitiated > 0 ? parseFloat((ad.spend / ad.checkoutsInitiated).toFixed(2)) : 0,
          costPerPurchase: ad.purchases > 0 ? parseFloat((ad.spend / ad.purchases).toFixed(2)) : 0,
          roas: parseFloat(roas.toFixed(2)),
          averageOrderValue: ad.purchases > 0 ? parseFloat((ad.purchaseValue / ad.purchases).toFixed(2)) : 0,
          conversionRate: parseFloat((convRate * 100).toFixed(2)) + '%',
          performanceCategory: aiResult?.performanceCategory ?? 'INSUFFICIENT DATA/SPEND',
          justification: aiResult?.justification ?? 'AI analysis unavailable.',
          recommendation: aiResult?.recommendation ?? 'Review manually.',
          analyzedAt: new Date().toISOString(),
        };
        Store.setResult(result);
      });

      Store.setLog({
        ...log,
        completedAt: new Date().toISOString(),
        status: 'completed',
        adsProcessed: aggregated.length,
        totalSpend: parseFloat(totalSpend.toFixed(2)),
      });
    } catch (err: unknown) {
      Store.setLog({
        ...log,
        completedAt: new Date().toISOString(),
        status: 'failed',
        error: err instanceof Error ? err.message : String(err),
      });
    }
  })();

  return NextResponse.json({ executionId, status: 'running' });
}

function aggregateByAdName(ads: ReturnType<typeof parseAdInsights>) {
  const map = new Map<string, ReturnType<typeof parseAdInsights>[number]>();
  for (const ad of ads) {
    const existing = map.get(ad.adName);
    if (!existing) {
      map.set(ad.adName, { ...ad });
    } else {
      existing.spend += ad.spend;
      existing.impressions += ad.impressions;
      existing.clicks += ad.clicks;
      existing.addToCarts += ad.addToCarts;
      existing.checkoutsInitiated += ad.checkoutsInitiated;
      existing.purchases += ad.purchases;
      existing.purchaseValue += ad.purchaseValue;
    }
  }
  return Array.from(map.values()).sort((a, b) => b.spend - a.spend);
}
