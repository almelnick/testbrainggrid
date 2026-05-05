import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useClientProfile } from '../hooks/useClientProfile';

const CHANNELS = ['Instagram', 'Facebook', 'TikTok', 'LinkedIn', 'Email', 'Google Ads', 'YouTube', 'WhatsApp', 'Prensa'];

interface BriefForm {
  title: string;
  objective: string;
  target: string;
  keyMessage: string;
  channels: string[];
  timeline: string;
  budget: string;
}

function buildBrief(f: BriefForm, brand: string, industry: string, products: string, audience: string, tone: string, goals: string): string {
  return `# BRIEF CREATIVO — ${f.title.toUpperCase()}

**Marca:** ${brand}\n**Industria:** ${industry}\n**Fecha:** ${new Date().toLocaleDateString('es-AR')}

---

## 1. OBJETIVO
${f.objective}

## 2. AUDIENCIA TARGET
${f.target || audience || 'No especificado'}

## 3. MENSAJE CLAVE
${f.keyMessage}

## 4. CANALES
${f.channels.length ? f.channels.join(' · ') : 'A definir'}

## 5. TIMELINE
${f.timeline || 'A definir'}

## 6. PRESUPUESTO
${f.budget || 'A definir'}

---

## CONTEXTO DE MARCA
**Producto/Servicio:** ${products || 'No especificado'}\n**Tono:** ${tone || 'No especificado'}\n**Objetivo de negocio:** ${goals || 'No especificado'}

---

## ENTREGABLES ESPERADOS
- Concepto creativo con idea central\n- Copies adaptados por canal (${f.channels.join(', ') || 'todos los canales'})\n- Prompts para generación de imágenes\n- Calendario de publicación sugerido

---
*Brief generado por NEXUS AI Agency — ${new Date().toLocaleString('es-AR')}*`;
}

export default function BriefGenerator() {
  const { profile } = useClientProfile();
  const [generating, setGenerating] = useState(false);
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState<BriefForm>({
    title: '', objective: '', target: profile?.targetAudience ?? '',
    keyMessage: '', channels: [], timeline: '', budget: '',
  });

  const set = (field: keyof BriefForm, value: string | string[]) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const toggleChannel = (ch: string) => {
    const next = form.channels.includes(ch)
      ? form.channels.filter(c => c !== ch)
      : [...form.channels, ch];
    set('channels', next);
  };

  const generate = async () => {
    if (!form.title || !form.objective || !form.keyMessage) return;
    setGenerating(true);
    await new Promise(r => setTimeout(r, 1500));
    setOutput(buildBrief(
      form,
      profile?.brand ?? 'N/D',
      profile?.industry ?? 'N/D',
      profile?.products ?? '',
      profile?.targetAudience ?? '',
      profile?.tone ?? '',
      profile?.goals ?? '',
    ));
    setGenerating(false);
  };

  const copy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#050508] text-white">
      <nav className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
        <Link to="/" className="font-black text-xl tracking-tight">NEXUS<span className="text-purple-500">.</span></Link>
        <Link to="/dashboard" className="text-sm text-gray-400 hover:text-white transition-colors">← Dashboard</Link>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-10">
          <h1 className="text-3xl font-black mb-2">Generador de Briefs</h1>
          <p className="text-gray-400">Completá los datos y tu equipo generará un brief creativo completo.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-5">
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Título del brief *</label>
              <input value={form.title} onChange={e => set('title', e.target.value)}
                placeholder="Ej: Lanzamiento Temporada Verano 2025"
                className="w-full px-4 py-3 bg-white/5 border border-white/15 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Objetivo de la campaña *</label>
              <textarea value={form.objective} onChange={e => set('objective', e.target.value)}
                placeholder="¿Qué querés lograr? Sé específico con los resultados esperados."
                rows={3} className="w-full px-4 py-3 bg-white/5 border border-white/15 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors resize-none" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Audiencia target</label>
              <textarea value={form.target} onChange={e => set('target', e.target.value)}
                placeholder="¿A quién le habla esta campaña específicamente?"
                rows={2} className="w-full px-4 py-3 bg-white/5 border border-white/15 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors resize-none" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Mensaje clave *</label>
              <textarea value={form.keyMessage} onChange={e => set('keyMessage', e.target.value)}
                placeholder="La idea central que querés que tu audiencia recuerde."
                rows={2} className="w-full px-4 py-3 bg-white/5 border border-white/15 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors resize-none" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Canales</label>
              <div className="flex flex-wrap gap-2">
                {CHANNELS.map(ch => (
                  <button key={ch} onClick={() => toggleChannel(ch)}
                    className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${
                      form.channels.includes(ch) ? 'border-purple-500 bg-purple-500/20 text-purple-300' : 'border-white/15 bg-white/5 text-gray-400 hover:border-white/30'
                    }`}>
                    {ch}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Timeline</label>
                <input value={form.timeline} onChange={e => set('timeline', e.target.value)}
                  placeholder="Ej: 2 semanas"
                  className="w-full px-4 py-3 bg-white/5 border border-white/15 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Presupuesto</label>
                <input value={form.budget} onChange={e => set('budget', e.target.value)}
                  placeholder="Ej: USD 5.000"
                  className="w-full px-4 py-3 bg-white/5 border border-white/15 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors" />
              </div>
            </div>
            <button onClick={generate}
              disabled={!form.title || !form.objective || !form.keyMessage || generating}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl font-bold transition-all flex items-center justify-center gap-2">
              {generating ? (
                <><span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />Generando brief...</>
              ) : '✨ Generar brief completo'}
            </button>
          </div>

          <div>
            {output ? (
              <div className="bg-white/4 border border-white/10 rounded-2xl overflow-hidden sticky top-6">
                <div className="flex items-center justify-between px-5 py-3 border-b border-white/8">
                  <span className="text-sm font-medium text-gray-300">Brief generado</span>
                  <div className="flex gap-2">
                    <button onClick={copy}
                      className="px-3 py-1 rounded-lg bg-white/8 hover:bg-white/15 text-xs text-gray-300 transition-colors">
                      {copied ? '✓ Copiado' : 'Copiar'}
                    </button>
                    <Link to="/campana"
                      className="px-3 py-1 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 text-xs text-purple-300 transition-colors">
                      Crear campaña →
                    </Link>
                  </div>
                </div>
                <pre className="p-5 text-gray-300 text-xs leading-relaxed whitespace-pre-wrap font-mono overflow-auto max-h-[600px]">
                  {output}
                </pre>
              </div>
            ) : (
              <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-8 rounded-2xl border-2 border-dashed border-white/10">
                <div className="text-5xl mb-4">📝</div>
                <p className="text-gray-400 font-medium">Tu brief aparecerá aquí</p>
                <p className="text-gray-600 text-sm mt-2">Completá el formulario y hacé clic en &quot;Generar brief&quot;</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
