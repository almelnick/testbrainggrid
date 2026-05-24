'use client';

import { useEffect, useState } from 'react';
import { Settings } from '@/lib/types';

export default function SettingsPage() {
  const [settings, setSettings] = useState<Partial<Settings>>({});
  const [apiKey, setApiKey] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { fetch('/api/settings').then((r) => r.json()).then(setSettings); }, []);

  const handleSave = async () => {
    setSaving(true);
    const payload: Partial<Settings> = { defaultDatePreset: settings.defaultDatePreset, maxAdsPerRun: settings.maxAdsPerRun, autoRefreshTokens: settings.autoRefreshTokens };
    if (apiKey && !apiKey.startsWith('•')) payload.anthropicApiKey = apiKey;
    await fetch('/api/settings', { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 3000);
    setSettings(await fetch('/api/settings').then((r) => r.json())); setApiKey('');
  };

  const Sec = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div style={{ backgroundColor: '#161b27', border: '1px solid #1e293b', borderRadius: '12px', padding: '24px', marginBottom: '16px' }}>
      <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#f1f5f9', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid #1e293b' }}>{title}</h2>
      {children}
    </div>
  );

  const Row = ({ label, help, children }: { label: string; help?: string; children: React.ReactNode }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '13px', fontWeight: 500, color: '#e2e8f0' }}>{label}</div>
        {help && <div style={{ fontSize: '12px', color: '#475569', marginTop: '2px' }}>{help}</div>}
      </div>
      <div style={{ width: '300px' }}>{children}</div>
    </div>
  );

  return (
    <div className="p-8">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#f1f5f9' }}>Settings</h1>
          <p style={{ fontSize: '14px', color: '#64748b', marginTop: '2px' }}>Configure API credentials and workflow behavior</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {saved && <span style={{ fontSize: '13px', color: '#22c55e' }}>✓ Settings saved</span>}
          <button onClick={handleSave} disabled={saving} style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', backgroundColor: '#2563eb', color: '#fff', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>{saving ? 'Saving…' : 'Save Settings'}</button>
        </div>
      </div>
      <Sec title="🤖 AI Configuration">
        <Row label="Anthropic API Key" help="Powers the Claude AI media buyer analysis. Get yours at console.anthropic.com">
          <input type="password" placeholder={settings.anthropicApiKey || 'sk-ant-...'} value={apiKey} onChange={(e) => setApiKey(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0f1723', color: '#e2e8f0', fontSize: '13px' }} />
          {settings.anthropicApiKey && <div style={{ fontSize: '11px', color: '#475569', marginTop: '4px' }}>Current: {settings.anthropicApiKey}</div>}
        </Row>
      </Sec>
      <Sec title="📊 Facebook Ads Configuration">
        <Row label="Date Range" help="Default lookback period for fetching Facebook ad data">
          <select value={settings.defaultDatePreset ?? 'last_28d'} onChange={(e) => setSettings((s) => ({ ...s, defaultDatePreset: e.target.value }))} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0f1723', color: '#e2e8f0', fontSize: '13px' }}>
            {[['last_7d','Last 7 days'],['last_14d','Last 14 days'],['last_28d','Last 28 days'],['last_30d','Last 30 days'],['last_90d','Last 90 days']].map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </Row>
        <Row label="Max Ads per Run" help="Maximum number of ads fetched per analysis run">
          <input type="number" min={1} max={500} value={settings.maxAdsPerRun ?? 500} onChange={(e) => setSettings((s) => ({ ...s, maxAdsPerRun: Number(e.target.value) }))} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0f1723', color: '#e2e8f0', fontSize: '13px' }} />
        </Row>
        <Row label="Auto-Refresh Tokens" help="Automatically refresh Facebook tokens 3 days before expiry">
          <div onClick={() => setSettings((s) => ({ ...s, autoRefreshTokens: !s.autoRefreshTokens }))} style={{ width: '44px', height: '24px', borderRadius: '12px', cursor: 'pointer', backgroundColor: settings.autoRefreshTokens ? '#2563eb' : '#334155', position: 'relative', transition: 'background 0.2s' }}>
            <div style={{ position: 'absolute', top: '2px', left: settings.autoRefreshTokens ? '22px' : '2px', width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#fff', transition: 'left 0.2s' }} />
          </div>
        </Row>
      </Sec>
      <Sec title="📋 Workflow Info">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
          {[['Original Workflow','n8n JSON v1'],['AI Model','Claude Sonnet 4.6'],['Data Source','Facebook Graph API v22.0'],['Output','Google Sheets + In-App'],['Converted by','Claude Code'],['Framework','Next.js 16 (App Router)']].map(([label, value]) => (
            <div key={label} style={{ padding: '12px', backgroundColor: '#0f1723', borderRadius: '8px', border: '1px solid #1e293b' }}>
              <div style={{ fontSize: '11px', color: '#475569', marginBottom: '3px' }}>{label}</div>
              <div style={{ color: '#94a3b8' }}>{value}</div>
            </div>
          ))}
        </div>
      </Sec>
    </div>
  );
}
