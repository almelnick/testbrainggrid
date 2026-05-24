import { BenchmarkData } from './types';

export interface FacebookAdInsight {
  ad_id: string;
  ad_name: string;
  campaign_name: string;
  adset_name: string;
  objective: string;
  spend: string;
  impressions: string;
  clicks: string;
  date_start: string;
  date_stop: string;
  actions?: Array<{ action_type: string; value: string }>;
  action_values?: Array<{ action_type: string; value: string }>;
}

const PREFERRED_ATC = ['omni_add_to_cart', 'offsite_conversion.fb_pixel_add_to_cart', 'add_to_cart'];
const PREFERRED_CHECKOUT = ['omni_initiated_checkout', 'offsite_conversion.fb_pixel_initiate_checkout', 'initiate_checkout'];
const PREFERRED_PURCHASE = ['omni_purchase', 'offsite_conversion.fb_pixel_purchase', 'purchase'];

function getActionCount(actions: FacebookAdInsight['actions'], types: string[]): number {
  if (!actions) return 0;
  for (const t of types) {
    const a = actions.find((x) => x.action_type === t);
    if (a) return parseInt(a.value || '0');
  }
  return 0;
}

function getPurchaseValue(actionValues: FacebookAdInsight['action_values']): number {
  if (!actionValues) return 0;
  for (const t of PREFERRED_PURCHASE) {
    const a = actionValues.find((x) => x.action_type === t);
    if (a) return parseFloat(a.value || '0');
  }
  return 0;
}

export function parseAdInsights(raw: FacebookAdInsight[]) {
  return raw.map((fb) => ({
    adId: fb.ad_id,
    adName: fb.ad_name,
    campaignName: fb.campaign_name,
    adsetName: fb.adset_name,
    objective: fb.objective,
    spend: parseFloat(fb.spend || '0'),
    impressions: parseInt(fb.impressions || '0'),
    clicks: parseInt(fb.clicks || '0'),
    dateStart: fb.date_start,
    dateStop: fb.date_stop,
    addToCarts: getActionCount(fb.actions, PREFERRED_ATC),
    checkoutsInitiated: getActionCount(fb.actions, PREFERRED_CHECKOUT),
    purchases: getActionCount(fb.actions, PREFERRED_PURCHASE),
    purchaseValue: getPurchaseValue(fb.action_values),
  }));
}

export async function fetchFacebookAds(
  adAccountId: string,
  accessToken: string,
  datePreset = 'last_28d'
): Promise<FacebookAdInsight[]> {
  const fields = 'campaign_name,adset_name,ad_name,ad_id,objective,spend,impressions,clicks,actions,action_values,date_start,date_stop';
  const url = new URL(`https://graph.facebook.com/v22.0/${adAccountId}/insights`);
  url.searchParams.set('level', 'ad');
  url.searchParams.set('fields', fields);
  url.searchParams.set('date_preset', datePreset);
  url.searchParams.set('limit', '500');

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`Facebook API error: ${res.status} - ${JSON.stringify(err)}`);
  }

  const data = await res.json();
  return data.data ?? [];
}

export function calculateBenchmarks(
  ads: ReturnType<typeof parseAdInsights>
): BenchmarkData {
  const totals = ads.reduce(
    (acc, ad) => ({
      spend: acc.spend + ad.spend,
      impressions: acc.impressions + ad.impressions,
      clicks: acc.clicks + ad.clicks,
      purchases: acc.purchases + ad.purchases,
      purchaseValue: acc.purchaseValue + ad.purchaseValue,
    }),
    { spend: 0, impressions: 0, clicks: 0, purchases: 0, purchaseValue: 0 }
  );

  return {
    totalSpend: parseFloat(totals.spend.toFixed(2)),
    totalImpressions: totals.impressions,
    totalClicks: totals.clicks,
    totalPurchases: totals.purchases,
    totalPurchaseValue: parseFloat(totals.purchaseValue.toFixed(2)),
    ctr: totals.impressions > 0 ? parseFloat((totals.clicks / totals.impressions).toFixed(4)) : 0,
    cpc: totals.clicks > 0 ? parseFloat((totals.spend / totals.clicks).toFixed(2)) : 0,
    cpm: totals.impressions > 0 ? parseFloat(((totals.spend / totals.impressions) * 1000).toFixed(2)) : 0,
    costPerPurchase: totals.purchases > 0 ? parseFloat((totals.spend / totals.purchases).toFixed(2)) : 0,
    roas: totals.spend > 0 ? parseFloat((totals.purchaseValue / totals.spend).toFixed(2)) : 0,
    conversionRate: totals.clicks > 0 ? ((totals.purchases / totals.clicks) * 100).toFixed(2) + '%' : '0.00%',
    averageOrderValue: totals.purchases > 0 ? parseFloat((totals.purchaseValue / totals.purchases).toFixed(2)) : 0,
  };
}

export function generateMockAds(): FacebookAdInsight[] {
  const mockAds = [
    { name: 'UGC Video - Happy Customer', spend: '490', impressions: '39200', clicks: '980', purchases: 93, value: 9709.6 },
    { name: 'Static - Product Hero Shot', spend: '320', impressions: '25600', clicks: '640', purchases: 48, value: 3840 },
    { name: 'Carousel - Top 5 Products', spend: '85', impressions: '6800', clicks: '170', purchases: 12, value: 960 },
    { name: 'Video - Before & After', spend: '210', impressions: '16800', clicks: '420', purchases: 15, value: 1050 },
    { name: 'Static - Lifestyle Shot', spend: '150', impressions: '12000', clicks: '300', purchases: 5, value: 300 },
    { name: 'Video - Founder Story', spend: '30', impressions: '2400', clicks: '60', purchases: 8, value: 640 },
    { name: 'UGC - Unboxing Experience', spend: '75', impressions: '6000', clicks: '150', purchases: 9, value: 720 },
    { name: 'Static - Sale 30% OFF', spend: '190', impressions: '15200', clicks: '380', purchases: 22, value: 1760 },
  ];

  return mockAds.map((ad, i) => ({
    ad_id: `act_${100000 + i}`,
    ad_name: ad.name,
    campaign_name: 'Summer Sale 2024',
    adset_name: 'Broad Audience -- 25-54',
    objective: 'OUTCOME_SALES',
    spend: ad.spend,
    impressions: ad.impressions,
    clicks: ad.clicks,
    date_start: '2024-05-01',
    date_stop: '2024-05-28',
    actions: [
      { action_type: 'omni_purchase', value: String(ad.purchases) },
      { action_type: 'omni_add_to_cart', value: String(Math.floor(ad.purchases * 3.5)) },
      { action_type: 'omni_initiated_checkout', value: String(Math.floor(ad.purchases * 1.8)) },
    ],
    action_values: [{ action_type: 'omni_purchase', value: String(ad.value) }],
  }));
}
