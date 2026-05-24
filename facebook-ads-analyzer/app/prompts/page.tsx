'use client';

import { useEffect, useState } from 'react';
import { Prompt } from '@/lib/types';

export default function PromptsPage() {
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { fetch('/api/prompts').then((r) => r.json()).then((p) => { setPrompt(p); setDraft(p?.content ?? ''); }); }, []);

  const handleSave = async () => {
    setSaving(true);
    await fetch('/api/prompts', { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ content: draft }) });
    const updated = await fetch('/api/prompts').then((r) => r.json());
    setPrompt(updated); setSaving(false); setEditing(false); setSaved(true); setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-8">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#f1f5f9' }}>Prompt Configuration</h1>
          <p style={{ fontSize: '14px', color: '#64748b', marginTop: '2px' }}>Edit the AI media buyer system prompt</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {saved && <span style={{ fontSize: '13px', color: '#22c55e' }}>✓ Saved</span>}
          {!editing ? (
            <button onClick={() => setEditing(true)} style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', backgroundColor: '#2563eb', color: '#fff', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Edit Prompt</button>
          ) : (<>
            <button onClick={() => { if (prompt) setDraft(prompt.content); setEditing(false); }} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: 'transparent', color: '#94a3b8', fontSize: '13px', cursor: 'pointer' }}>Cancel</button>
            <button onClick={handleSave} disabled={saving} style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', backgroundColor: '#16a34a', color: '#fff', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>{saving ? 'Saving…' : '✓ Save Prompt'}</button>
          </>)}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '20px' }}>
        <div>
          <div style={{ backgroundColor: '#161b27', border: '1px solid #1e293b', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid #1e293b', backgroundColor: '#0f1723' }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                {['#ef4444','#f59e0b','#22c55e'].map((c) => <div key={c} style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: c }} />)}
              </div>
              <span style={{ fontSize: '11px', color: '#475569' }}>{prompt?.name} · Updated: {prompt ? new Date(prompt.updatedAt).toLocaleString() : '—'}</span>
              <span style={{ fontSize: '11px', color: '#334155' }}>{draft.length} chars</span>
            </div>
            {editing ? (
              <textarea value={draft} onChange={(e) => setDraft(e.target.value)} style={{ width: '100%', height: '560px', padding: '20px', backgroundColor: '#0c1118', color: '#e2e8f0', fontSize: '13px', lineHeight: '1.7', fontFamily: 'monospace', border: 'none', outline: 'none', resize: 'vertical' }} />
            ) : (
              <pre style={{ padding: '20px', margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: '13px', lineHeight: '1.7', color: '#94a3b8', maxHeight: '560px', overflowY: 'auto', fontFamily: 'monospace' }}>
                {draft.split(/({{[A-Z_]+}})/).map((part, i) => /^{{[A-Z_]+}}$/.test(part) ? <span key={i} style={{ color: '#f59e0b', fontWeight: 700 }}>{part}</span> : <span key={i}>{part}</span>)}
              </pre>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ backgroundColor: '#161b27', border: '1px solid #1e293b', borderRadius: '12px', padding: '18px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#f1f5f9', marginBottom: '12px' }}>Available Variables</h3>
            {['{{AD_DATA}}','{{BENCHMARK_DATA}}'].map((v) => (
              <div key={v} style={{ padding: '8px 12px', borderRadius: '6px', backgroundColor: '#0f1723', border: '1px solid #1e293b', marginBottom: '8px' }}>
                <code style={{ fontSize: '12px', color: '#f59e0b', fontWeight: 700 }}>{v}</code>
                <div style={{ fontSize: '11px', color: '#475569', marginTop: '3px' }}>{v === '{{AD_DATA}}' ? 'JSON array of all ad creative metrics' : 'JSON object with account benchmark KPIs'}</div>
              </div>
            ))}
          </div>
          <div style={{ backgroundColor: '#161b27', border: '1px solid #1e293b', borderRadius: '12px', padding: '18px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#f1f5f9', marginBottom: '10px' }}>Tips</h3>
            <ul style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.7', paddingLeft: '14px', margin: 0 }}>
              <li>Always include spend thresholds</li>
              <li>Be specific about category criteria</li>
              <li>Keep JSON output instructions at the end</li>
              <li>Model: Claude Sonnet 4.6</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
