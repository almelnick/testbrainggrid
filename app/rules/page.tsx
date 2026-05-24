'use client';

import { useEffect, useState } from 'react';
import { PerformanceRule } from '@/lib/types';
import { CATEGORY_CONFIG } from '@/lib/utils';

export default function RulesPage() {
  const [rules, setRules] = useState<PerformanceRule[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<PerformanceRule>>({});

  useEffect(() => {
    fetch('/api/rules').then((r) => r.json()).then(setRules);
  }, []);

  const handleEdit = (rule: PerformanceRule) => { setEditing(rule.category); setEditData({ ...rule }); };

  const handleSave = async (category: string) => {
    setSaving(category);
    await fetch('/api/rules', { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify(editData) });
    const updated = await fetch('/api/rules').then((r) => r.json());
    setRules(updated);
    setEditing(null);
    setSaving(null);
  };

  return (
    <div className="p-8">
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#f1f5f9' }}>Rules Editor</h1>
        <p style={{ fontSize: '14px', color: '#64748b', marginTop: '2px' }}>Configure performance category thresholds used in AI analysis</p>
      </div>
      <div style={{ backgroundColor: '#1e3a5f22', border: '1px solid #1e40af55', borderRadius: '10px', padding: '14px 18px', marginBottom: '24px', fontSize: '13px', color: '#93c5fd' }}>
        <strong>How rules work:</strong> These thresholds inform the AI prompt. Min Spend is the minimum required to qualify. ROAS vs Benchmark is the multiplier vs account average.
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {rules.map((rule) => {
          const cfg = CATEGORY_CONFIG[rule.category];
          const isEditing = editing === rule.category;
          return (
            <div key={rule.category} style={{ backgroundColor: '#161b27', borderRadius: '12px', border: `1px solid ${isEditing ? cfg.color + '55' : '#1e293b'}`, overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: isEditing ? `1px solid ${cfg.color}33` : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', backgroundColor: cfg.color + '22', border: `1px solid ${cfg.color}44` }}>{cfg.emoji}</div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: cfg.color }}>{rule.category}</div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>{rule.description}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                  {!isEditing && (
                    <>
                      <div style={{ textAlign: 'right' }}><div style={{ fontSize: '10px', color: '#475569' }}>MIN SPEND</div><div style={{ fontSize: '14px', fontWeight: 600, color: '#e2e8f0' }}>${rule.minSpend}</div></div>
                      <div style={{ textAlign: 'right' }}><div style={{ fontSize: '10px', color: '#475569' }}>ROAS MULTIPLIER</div><div style={{ fontSize: '14px', fontWeight: 600, color: '#e2e8f0' }}>{rule.roasVsBenchmark}×</div></div>
                    </>
                  )}
                  <button onClick={() => isEditing ? setEditing(null) : handleEdit(rule)} style={{ padding: '6px 14px', borderRadius: '6px', border: `1px solid ${isEditing ? '#334155' : cfg.color + '55'}`, backgroundColor: 'transparent', color: isEditing ? '#64748b' : cfg.color, fontSize: '12px', cursor: 'pointer', fontWeight: 600 }}>
                    {isEditing ? 'Cancel' : 'Edit'}
                  </button>
                </div>
              </div>
              {isEditing && (
                <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '11px', color: '#64748b', display: 'block', marginBottom: '6px', fontWeight: 600 }}>MINIMUM SPEND ($)</label>
                    <input type="number" value={editData.minSpend ?? 0} onChange={(e) => setEditData((d) => ({ ...d, minSpend: Number(e.target.value) }))} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0f1723', color: '#e2e8f0', fontSize: '13px' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', color: '#64748b', display: 'block', marginBottom: '6px', fontWeight: 600 }}>ROAS VS BENCHMARK (×)</label>
                    <input type="number" step="0.1" value={editData.roasVsBenchmark ?? 0} onChange={(e) => setEditData((d) => ({ ...d, roasVsBenchmark: Number(e.target.value) }))} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0f1723', color: '#e2e8f0', fontSize: '13px' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', color: '#64748b', display: 'block', marginBottom: '6px', fontWeight: 600 }}>DESCRIPTION</label>
                    <input type="text" value={editData.description ?? ''} onChange={(e) => setEditData((d) => ({ ...d, description: e.target.value }))} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0f1723', color: '#e2e8f0', fontSize: '13px' }} />
                  </div>
                  <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end' }}>
                    <button onClick={() => handleSave(rule.category)} disabled={saving === rule.category} style={{ padding: '8px 24px', borderRadius: '8px', border: 'none', backgroundColor: cfg.color, color: '#fff', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                      {saving === rule.category ? 'Saving…' : 'Save Rule'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
