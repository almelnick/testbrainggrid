'use client';

import { useEffect, useState } from 'react';
import { AdResult, ExecutionLog, Client } from '@/lib/types';
import { formatCurrency, formatNumber, CATEGORY_CONFIG } from '@/lib/utils';
import CategoryBadge from '@/components/CategoryBadge';
import Link from 'next/link';

export default function Dashboard() {
  const [results, setResults] = useState<AdResult[]>([]);
  const [logs, setLogs] = useState<ExecutionLog[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [running, setRunning] = useState(false);

  const load = async () => {
    const [r, l, c] = await Promise.all([
      fetch('/api/results').then((x) => x.json()),
      fetch('/api/logs').then((x) => x.json()),
      fetch('/api/clients').then((x) => x.json()),
    ]);
    setResults(r);
    setLogs(l);
    setClients(c);
  };

  useEffect(() => { load(); }, []);

  const handleRun = async () => {
    const activeClient = clients.find((c) => c.status === 'active');
    if (!activeClient) return alert('No active client found.');
    setRunning(true);
    await fetch('/api/analysis/run', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ clientId: activeClient.id, demoMode: true }),
    });
    setTimeout(() => { load(); setRunning(false); }, 3000);
  };

  const totalSpend = results.reduce((s, r) => s + r.totalSpend, 0);
  const totalRevenue = results.reduce((s, r) => s + r.totalPurchaseValue, 0);
  const totalPurchases = results.reduce((s, r) => s + r.totalPurchases, 0);
  const avgRoas = totalSpend > 0 ? totalRevenue / totalSpend : 0;
  const hellYesCount = results.filter((r) => r.performanceCategory === 'HELL YES').length;
  const wastedCount = results.filter((r) => r.performanceCategory === 'WE WASTED MONEY').length;

  const kpis = [
    { label: 'Total Ad Spend', value: formatCurrency(totalSpend), icon: '💰', color: '#3b82f6', sub: `${results.length} ads analyzed` },
    { label: 'Total Revenue', value: formatCurrency(totalRevenue), icon: '📈', color: '#22c55e', sub: `${totalPurchases} purchases` },
    { label: 'Blended ROAS', value: avgRoas.toFixed(2) + 'x', icon: '⚡', color: '#f59e0b', sub: 'Return on ad spend' },
    { label: 'HELL YES Ads', value: String(hellYesCount), icon: '🔥', color: '#22c55e', sub: `${wastedCount} ads wasted money` },
  ];

  const categoryCounts = results.reduce<Record<string, number>>((acc, r) => {
    acc[r.performanceCategory] = (acc[r.performanceCategory] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#f1f5f9' }}>Dashboard</h1>
          <p style={{ fontSize: '14px', color: '#64748b', marginTop: '2px' }}>AI-powered Facebook Ad performance overview</p>
        </div>
        <div className="flex gap-3">
          <button onClick={load} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: 'transparent', color: '#94a3b8', fontSize: '13px', cursor: 'pointer' }}>Refresh</button>
          <button onClick={handleRun} disabled={running} style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', backgroundColor: running ? '#1e40af' : '#2563eb', color: '#fff', fontSize: '13px', fontWeight: 600, cursor: running ? 'not-allowed' : 'pointer' }}>
            {running ? '⏳ Analyzing...' : '▶ Run Analysis'}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {kpis.map((kpi) => (
          <div key={kpi.label} style={{ backgroundColor: '#161b27', border: '1px solid #1e293b', borderRadius: '12px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px' }}>{kpi.label}</div>
                <div style={{ fontSize: '26px', fontWeight: 700, color: kpi.color }}>{kpi.value}</div>
                {kpi.sub && <div style={{ fontSize: '11px', color: '#475569', marginTop: '4px' }}>{kpi.sub}</div>}
              </div>
              <span style={{ fontSize: '28px', opacity: 0.7 }}>{kpi.icon}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        <div style={{ backgroundColor: '#161b27', border: '1px solid #1e293b', borderRadius: '12px', padding: '20px' }}>
          <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#f1f5f9', marginBottom: '16px' }}>Performance Breakdown</h2>
          {Object.entries(CATEGORY_CONFIG).map(([cat, cfg]) => {
            const count = categoryCounts[cat] ?? 0;
            const pct = results.length > 0 ? (count / results.length) * 100 : 0;
            return (
              <div key={cat} style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '12px', color: cfg.color }}>{cfg.emoji} {cat}</span>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>{count} ads ({pct.toFixed(0)}%)</span>
                </div>
                <div style={{ height: '4px', borderRadius: '2px', backgroundColor: '#1e293b' }}>
                  <div style={{ height: '100%', borderRadius: '2px', backgroundColor: cfg.color, width: `${pct}%`, transition: 'width 0.5s ease' }} />
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ backgroundColor: '#161b27', border: '1px solid #1e293b', borderRadius: '12px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#f1f5f9' }}>Recent Executions</h2>
            <Link href="/logs" style={{ fontSize: '12px', color: '#3b82f6', textDecoration: 'none' }}>View all →</Link>
          </div>
          {logs.slice(0, 4).map((log) => (
            <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #1e293b' }}>
              <div>
                <div style={{ fontSize: '12px', color: '#f1f5f9' }}>{log.clientName}</div>
                <div style={{ fontSize: '11px', color: '#475569' }}>{new Date(log.startedAt).toLocaleString()} · {log.adsProcessed} ads</div>
              </div>
              <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '9999px', backgroundColor: log.status === 'completed' ? '#16a34a22' : log.status === 'running' ? '#2563eb22' : '#dc262622', color: log.status === 'completed' ? '#22c55e' : log.status === 'running' ? '#3b82f6' : '#ef4444' }}>
                {log.status === 'running' ? '⏳' : log.status === 'completed' ? '✓' : '✕'} {log.status}
              </span>
            </div>
          ))}
          {logs.length === 0 && <p style={{ fontSize: '13px', color: '#475569', textAlign: 'center', padding: '20px 0' }}>No executions yet.</p>}
        </div>
      </div>

      <div style={{ backgroundColor: '#161b27', border: '1px solid #1e293b', borderRadius: '12px', padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#f1f5f9' }}>Top Performing Ads</h2>
          <Link href="/results" style={{ fontSize: '12px', color: '#3b82f6', textDecoration: 'none' }}>View all results →</Link>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #1e293b' }}>
                {['Ad Name', 'Spend', 'ROAS', 'Purchases', 'Revenue', 'Category', 'Recommendation'].map((h) => (
                  <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: '11px', color: '#64748b', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {results.slice(0, 5).map((r) => (
                <tr key={r.id} style={{ borderBottom: '1px solid #0f172a' }}>
                  <td style={{ padding: '10px 12px', color: '#e2e8f0', maxWidth: '200px' }}><div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.adName}</div></td>
                  <td style={{ padding: '10px 12px', color: '#94a3b8' }}>{formatCurrency(r.totalSpend)}</td>
                  <td style={{ padding: '10px 12px', color: r.roas >= 3 ? '#22c55e' : r.roas >= 1 ? '#f59e0b' : '#ef4444', fontWeight: 600 }}>{r.roas}x</td>
                  <td style={{ padding: '10px 12px', color: '#94a3b8' }}>{formatNumber(r.totalPurchases)}</td>
                  <td style={{ padding: '10px 12px', color: '#94a3b8' }}>{formatCurrency(r.totalPurchaseValue)}</td>
                  <td style={{ padding: '10px 12px' }}><CategoryBadge category={r.performanceCategory} /></td>
                  <td style={{ padding: '10px 12px', color: '#64748b', fontSize: '12px' }}>{r.recommendation}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {results.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#475569' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>📊</div>
              <div style={{ fontSize: '14px' }}>No results yet. Click &quot;Run Analysis&quot; to get started.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
