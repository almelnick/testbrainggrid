'use client';

import { useEffect, useState } from 'react';
import { Client } from '@/lib/types';

const empty: Partial<Client> = {
  name: '',
  adAccountId: '',
  facebookToken: '',
  googleSheetId: '',
  geminiApiKey: '',
  status: 'active',
};

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [form, setForm] = useState<Partial<Client>>(empty);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = () => fetch('/api/clients').then((r) => r.json()).then(setClients);
  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    setSaving(true);
    if (editing) {
      await fetch('/api/clients', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...form, id: editing }),
      });
    } else {
      await fetch('/api/clients', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(form),
      });
    }
    setSaving(false);
    setForm(empty);
    setEditing(null);
    setShowForm(false);
    load();
  };

  const handleEdit = (c: Client) => {
    setForm(c);
    setEditing(c.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this client?')) return;
    await fetch(`/api/clients?id=${id}`, { method: 'DELETE' });
    load();
  };

  const Field = ({ label, name, placeholder, type = 'text' }: { label: string; name: keyof Client; placeholder?: string; type?: string }) => (
    <div style={{ marginBottom: '16px' }}>
      <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px', fontWeight: 500 }}>
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={(form[name] as string) ?? ''}
        onChange={(e) => setForm((f) => ({ ...f, [name]: e.target.value }))}
        style={{
          width: '100%',
          padding: '8px 12px',
          borderRadius: '8px',
          border: '1px solid #334155',
          backgroundColor: '#0f1723',
          color: '#e2e8f0',
          fontSize: '13px',
          outline: 'none',
        }}
      />
    </div>
  );

  return (
    <div className="p-8">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#f1f5f9' }}>Clients</h1>
          <p style={{ fontSize: '14px', color: '#64748b', marginTop: '2px' }}>Manage Facebook ad account connections</p>
        </div>
        <button
          onClick={() => { setForm(empty); setEditing(null); setShowForm(true); }}
          style={{
            padding: '8px 20px', borderRadius: '8px', border: 'none',
            backgroundColor: '#2563eb', color: '#fff', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
          }}
        >
          + Add Client
        </button>
      </div>

      <div style={{ display: 'grid', gap: '12px' }}>
        {clients.map((c) => (
          <div
            key={c.id}
            style={{
              backgroundColor: '#161b27', border: '1px solid #1e293b',
              borderRadius: '12px', padding: '20px',
              display: 'flex', alignItems: 'center', gap: '20px',
            }}
          >
            <div style={{
              width: '44px', height: '44px', borderRadius: '10px',
              backgroundColor: '#1e293b', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '20px', flexShrink: 0,
            }}>
              👥
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '15px', fontWeight: 600, color: '#f1f5f9' }}>{c.name}</span>
                <span style={{
                  fontSize: '10px', padding: '2px 8px', borderRadius: '9999px',
                  backgroundColor: c.status === 'active' ? '#16a34a22' : '#64748b22',
                  color: c.status === 'active' ? '#22c55e' : '#64748b',
                  border: `1px solid ${c.status === 'active' ? '#22c55e44' : '#64748b44'}`,
                  fontWeight: 600,
                }}>
                  {c.status}
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                Ad Account: <span style={{ color: '#94a3b8' }}>{c.adAccountId}</span>
              </div>
              <div style={{ fontSize: '11px', color: '#475569', marginTop: '2px' }}>
                Token expires: {new Date(c.tokenExpiry).toLocaleDateString()}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => handleEdit(c)} style={{ padding: '6px 14px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: 'transparent', color: '#94a3b8', fontSize: '12px', cursor: 'pointer' }}>Edit</button>
              <button onClick={() => handleDelete(c.id)} style={{ padding: '6px 14px', borderRadius: '6px', border: '1px solid #7f1d1d', backgroundColor: 'transparent', color: '#ef4444', fontSize: '12px', cursor: 'pointer' }}>Delete</button>
            </div>
          </div>
        ))}
        {clients.length === 0 && (
          <div style={{ backgroundColor: '#161b27', border: '1px dashed #1e293b', borderRadius: '12px', padding: '48px', textAlign: 'center' }}>
            <div style={{ fontSize: '36px', marginBottom: '12px' }}>👥</div>
            <div style={{ fontSize: '14px', color: '#64748b' }}>No clients yet. Add your first Facebook ad account.</div>
          </div>
        )}
      </div>

      {showForm && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ backgroundColor: '#161b27', border: '1px solid #1e293b', borderRadius: '16px', padding: '32px', width: '520px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#f1f5f9', marginBottom: '24px' }}>
              {editing ? 'Edit Client' : 'Add New Client'}
            </h2>
            <Field label="Client Name" name="name" placeholder="My E-commerce Store" />
            <Field label="Facebook Ad Account ID" name="adAccountId" placeholder="act_123456789" />
            <Field label="Facebook Access Token" name="facebookToken" placeholder="EAA..." type="password" />
            <Field label="Google Sheet ID" name="googleSheetId" placeholder="1_9fnWQm3..." />
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px', fontWeight: 500 }}>Status</label>
              <select
                value={form.status ?? 'active'}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as 'active' | 'inactive' }))}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0f1723', color: '#e2e8f0', fontSize: '13px' }}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' }}>
              <button onClick={() => { setShowForm(false); setForm(empty); setEditing(null); }} style={{ padding: '8px 20px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: 'transparent', color: '#94a3b8', fontSize: '13px', cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.name || !form.adAccountId} style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', backgroundColor: '#2563eb', color: '#fff', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>{saving ? 'Saving…' : 'Save Client'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
