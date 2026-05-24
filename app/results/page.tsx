'use client';

import { useEffect, useState } from 'react';
import { AdResult, PerformanceCategory } from '@/lib/types';
import { formatCurrency, formatNumber, CATEGORY_CONFIG } from '@/lib/utils';
import CategoryBadge from '@/components/CategoryBadge';

const CATEGORIES: PerformanceCategory[] = ['HELL YES', 'YES', 'MAYBE', 'NOT REALLY', 'WE WASTED MONEY', 'INSUFFICIENT DATA/SPEND'];

export default function ResultsPage() {
  const [results, setResults] = useState<AdResult[]>([]);
  const [filter, setFilter] = useState<PerformanceCategory | 'ALL'>('ALL');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/results').then((r) => r.json()).then(setResults);
  }, []);

  const filtered = results.filter((r) => {
    if (filter !== 'ALL' && r.performanceCategory !== filter) return false;
    if (search && !r.adName.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalSpend = filtered.reduce((s, r) => s + r.totalSpend, 0);
  const totalRevenue = filtered.reduce((s, r) => s + r.totalPurchaseValue, 0);

  return (
    <div className="p-8">
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#f1f5f9' }}>Analysis Results</h1>
        <p style={{ fontSize: '14px', color: '#64748b', marginTop: '2px' }}>AI-generated performance analysis for all ad creatives</p>
      </div>

      <div style={{ display: 'flex', gap: '24px', padding: '14px 20px', backgroundColor: '#161b27', border: '1px solid #1e293b', borderRadius: '10px', marginBottom: '16px', fontSize: '13px', alignItems: 'center' }}>
        <span style={{ color: '#64748b' }}>Showing {filtered.length} of {results.length} ads</span>
        <span style={{ color: '#334155' }}>|</span>
        <span>Spend: <strong style={{ color: '#3b82f6' }}>{formatCurrency(totalSpend)}</strong></span>
        <span>Revenue: <strong style={{ color: '#22c55e' }}>{formatCurrency(totalRevenue)}</strong></span>
        <span>ROAS: <strong style={{ color: '#f59e0b' }}>{totalSpend > 0 ? (totalRevenue / totalSpend).toFixed(2) : '0.00'}x</strong></span>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        <input placeholder="Search ad name..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ padding: '7px 14px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#161b27', color: '#e2e8f0', fontSize: '13px', width: '220px', outline: 'none' }} />
        <button onClick={() => setFilter('ALL')} style={{ padding: '6px 14px', borderRadius: '20px', border: '1px solid #334155', backgroundColor: filter === 'ALL' ? '#2563eb' : 'transparent', color: filter === 'ALL' ? '#fff' : '#94a3b8', fontSize: '12px', cursor: 'pointer', fontWeight: 600 }}>All ({results.length})</button>
        {CATEGORIES.map((cat) => {
          const cfg = CATEGORY_CONFIG[cat];
          const count = results.filter((r) => r.performanceCategory === cat).length;
          return (
            <button key={cat} onClick={() => setFilter(cat)} style={{ padding: '6px 12px', borderRadius: '20px', border: `1px solid ${filter === cat ? cfg.color : '#334155'}`, backgroundColor: filter === cat ? cfg.color + '22' : 'transparent', color: filter === cat ? cfg.color : '#64748b', fontSize: '11px', cursor: 'pointer', fontWeight: 600, whiteSpace: 'nowrap' }}>
              {cfg.emoji} {cat} ({count})
            </button>
          );
        })}
      </div>

      <div style={{ backgroundColor: '#161b27', border: '1px solid #1e293b', borderRadius: '12px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #1e293b', backgroundColor: '#0f1723' }}>
              {['Ad Creative', 'Spend', 'ROAS', 'Purchases', 'Revenue', 'CVR', 'CPP', 'Category', ''].map((h) => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '11px', color: '#64748b', fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <>
                <tr key={r.id} onClick={() => setExpanded(expanded === r.id ? null : r.id)} style={{ borderBottom: '1px solid #0f172a', cursor: 'pointer', backgroundColor: expanded === r.id ? '#1e293b' : 'transparent' }}>
                  <td style={{ padding: '12px 14px', maxWidth: '200px' }}>
                    <div style={{ fontWeight: 500, color: '#e2e8f0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.adName}</div>
                    <div style={{ fontSize: '11px', color: '#475569', marginTop: '2px' }}>{r.campaignName}</div>
                  </td>
                  <td style={{ padding: '12px 14px', color: '#94a3b8' }}>{formatCurrency(r.totalSpend)}</td>
                  <td style={{ padding: '12px 14px', fontWeight: 600, color: r.roas >= 3 ? '#22c55e' : r.roas >= 1 ? '#f59e0b' : '#ef4444' }}>{r.roas}x</td>
                  <td style={{ padding: '12px 14px', color: '#94a3b8' }}>{formatNumber(r.totalPurchases)}</td>
                  <td style={{ padding: '12px 14px', color: '#94a3b8' }}>{formatCurrency(r.totalPurchaseValue)}</td>
                  <td style={{ padding: '12px 14px', color: '#94a3b8' }}>{r.conversionRate}</td>
                  <td style={{ padding: '12px 14px', color: '#94a3b8' }}>{formatCurrency(r.costPerPurchase)}</td>
                  <td style={{ padding: '12px 14px' }}><CategoryBadge category={r.performanceCategory} /></td>
                  <td style={{ padding: '12px 14px', color: '#475569', fontSize: '12px' }}>{expanded === r.id ? '▲' : '▼'}</td>
                </tr>
                {expanded === r.id && (
                  <tr key={r.id + '-detail'}>
                    <td colSpan={9} style={{ padding: '0' }}>
                      <div style={{ backgroundColor: '#0f1723', borderBottom: '1px solid #1e293b', padding: '20px 24px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                          <div>
                            <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, marginBottom: '8px' }}>AI JUSTIFICATION</div>
                            <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: 1.6 }}>{r.justification}</p>
                            <div style={{ marginTop: '12px', padding: '10px 14px', borderRadius: '8px', backgroundColor: '#1e293b' }}>
                              <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>RECOMMENDATION</div>
                              <div style={{ fontSize: '13px', color: '#f1f5f9', fontWeight: 600 }}>→ {r.recommendation}</div>
                            </div>
                          </div>
                          <div>
                            <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, marginBottom: '8px' }}>DETAILED METRICS</div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                              {[
                                ['Impressions', formatNumber(r.totalImpressions)],
                                ['Clicks', formatNumber(r.totalClicks)],
                                ['CTR', `${(r.ctr * 100).toFixed(2)}%`],
                                ['CPC', formatCurrency(r.cpc)],
                                ['CPM', formatCurrency(r.cpm)],
                                ['Add to Carts', formatNumber(r.totalAddToCarts)],
                                ['Checkouts', formatNumber(r.totalCheckoutsInitiated)],
                                ['Avg Order Value', formatCurrency(r.averageOrderValue)],
                              ].map(([label, value]) => (
                                <div key={label} style={{ padding: '8px', backgroundColor: '#161b27', borderRadius: '6px' }}>
                                  <div style={{ fontSize: '10px', color: '#475569' }}>{label}</div>
                                  <div style={{ fontSize: '13px', color: '#e2e8f0', fontWeight: 500 }}>{value}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px', color: '#475569' }}>
            <div style={{ fontSize: '36px', marginBottom: '12px' }}>🎯</div>
            <div style={{ fontSize: '14px' }}>No results match your filters.</div>
          </div>
        )}
      </div>
    </div>
  );
}
