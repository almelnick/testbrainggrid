'use client';

import { useEffect, useState } from 'react';
import { ExecutionLog, Client } from '@/lib/types';
import { formatCurrency, timeAgo } from '@/lib/utils';
import Link from 'next/link';

export default function LogsPage() {
  const [logs, setLogs] = useState<ExecutionLog[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [running, setRunning] = useState(false);
  const [selectedClient, setSelectedClient] = useState('');

  const load = async () => {
    const [l, c] = await Promise.all([
      fetch('/api/logs').then((r) => r.json()),
      fetch('/api/clients').then((r) => r.json()),
    ]);
    setLogs(l);
    setClients(c);
    if (!selectedClient && c.length > 0) setSelectedClient(c[0].id);
  };

  useEffect(() => { load(); }, []);

  const handleRun = async () => {
    if (!selectedClient) return alert('Select a client first');
    setRunning(true);
    const res = await fetch('/api/analysis/run', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ clientId: selectedClient, demoMode: true }),
    });
    const data = await res.json();
    const poll = setInterval(async () => {
      await load();
      const updated = await fetch('/api/logs').then((r) => r.json());
      const log = updated.find((l: ExecutionLog) => l.id === data.executionId);
      if (log && log.status !== 'running') {
        clearInterval(poll);
        setRunning(false);
      }
    }, 2000);
  };

  const statusColor = (s: string) => s === 'completed' ? '#22c55e' : s === 'running' ? '#3b82f6' : '#ef4444';
  const statusBg = (s: string) => s === 'completed' ? '#16a34a22' : s === 'running' ? '#2563eb22' : '#dc262622';
  const statusIcon = (s: string) => s === 'completed' ? '✓' : s === 'running' ? '⏳' : '✕';

  return (
    <div className="p-8">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#f1f5f9' }}>Execution Logs</h1>
          <p style={{ fontSize: '14px', color: '#64748b', marginTop: '2px' }}>History of all workflow runs and their status</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <select value={selectedClient} onChange={(e) => setSelectedClient(e.target.value)} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#161b27', color: '#e2e8f0', fontSize: '13px' }}>
            {clients.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
          </select>
          <button onClick={load} style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: 'transparent', color: '#94a3b8', fontSize: '13px', cursor: 'pointer' }}>Refresh</button>
          <button onClick={handleRun} disabled={running} style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', backgroundColor: running ? '#1e40af' : '#2563eb', color: '#fff', fontSize: '13px', fontWeight: 600, cursor: running ? 'not-allowed' : 'pointer' }}>
            {running ? '⏳ Running…' : '▶ Run Now'}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {logs.map((log) => {
          const duration = log.completedAt ? Math.round((new Date(log.completedAt).getTime() - new Date(log.startedAt).getTime()) / 1000) : null;
          return (
            <div key={log.id} style={{ backgroundColor: '#161b27', border: '1px solid #1e293b', borderRadius: '12px', padding: '18px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <span style={{ fontSize: '18px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', backgroundColor: statusBg(log.status), color: statusColor(log.status) }}>
                    {statusIcon(log.status)}
                  </span>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: '#f1f5f9' }}>{log.clientName}</span>
                      <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '9999px', backgroundColor: statusBg(log.status), color: statusColor(log.status), fontWeight: 600 }}>{log.status}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#475569', marginTop: '3px' }}>
                      ID: <code style={{ color: '#64748b', fontSize: '11px' }}>{log.id}</code>{' · '}Started {timeAgo(log.startedAt)}
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '13px', color: '#94a3b8' }}>{log.adsProcessed} ads · {formatCurrency(log.totalSpend)} spend</div>
                  {duration !== null && <div style={{ fontSize: '11px', color: '#475569', marginTop: '2px' }}>Completed in {duration}s</div>}
                  {log.status === 'completed' && (
                    <Link href={`/results?executionId=${log.id}`} style={{ fontSize: '12px', color: '#3b82f6', textDecoration: 'none', marginTop: '4px', display: 'block' }}>View results →</Link>
                  )}
                </div>
              </div>
              {log.error && (
                <div style={{ marginTop: '12px', padding: '10px 14px', borderRadius: '8px', backgroundColor: '#7f1d1d22', border: '1px solid #7f1d1d' }}>
                  <div style={{ fontSize: '11px', color: '#ef4444', fontWeight: 600, marginBottom: '2px' }}>ERROR</div>
                  <div style={{ fontSize: '12px', color: '#fca5a5', fontFamily: 'monospace' }}>{log.error}</div>
                </div>
              )}
            </div>
          );
        })}
        {logs.length === 0 && (
          <div style={{ backgroundColor: '#161b27', border: '1px dashed #1e293b', borderRadius: '12px', padding: '60px', textAlign: 'center' }}>
            <div style={{ fontSize: '36px', marginBottom: '12px' }}>📋</div>
            <div style={{ fontSize: '14px', color: '#64748b' }}>No executions yet. Run your first analysis above.</div>
          </div>
        )}
      </div>
    </div>
  );
}
