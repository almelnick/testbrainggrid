import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useClientProfile } from '../hooks/useClientProfile';

type Tab = 'concept' | 'copies' | 'images' | 'calendar';

interface CopyItem { channel: string; headline: string; body: string; cta: string; }
interface Campaign {
  tagline: string;
  concept: string;
  copies: CopyItem[];
  imagePrompts: string[];
  calendar: string[];
}

function generate(idea: string, brand: string, audience: string, tone: string): Campaign {
  const first = audience.split(',')[0]?.trim() ?? 'tu audiencia';
  return {
    tagline: `${brand}: ${idea.split(' ').slice(0, 4).join(' ')}.`,
    concept: `La campaña parte de una premisa poderosa: ${brand} no vende un producto, vende una transformación.\n\nCada pieza comunica el antes y el después — el problema real que tiene ${first} y cómo ${brand} lo resuelve de manera única.\n\nLa idea creativa gira en torno a momentos concretos y auténticos, con un tono ${tone.toLowerCase() || 'cercano y profesional'}, donde la audiencia se identifica de inmediato.\n\nConcepto central: «${idea}»`,
    copies: [
      { channel: 'Instagram', headline: `${idea.charAt(0).toUpperCase() + idea.slice(1)} ✨`, body: `Sabemos lo que buscás. Por eso en ${brand} creamos algo diferente — pensado exactamente para vos.\n\n¿Listo para probarlo? 👇`, cta: 'Ver más →' },
      { channel: 'Facebook Ads', headline: `¿Buscás ${idea.split(' ').slice(0, 3).join(' ')}?`, body: `${brand} tiene la respuesta. Miles de personas ya lo están usando. ¿Te sumás?`, cta: 'Quiero saber más' },
      { channel: 'Email', headline: `Te presentamos algo nuevo de ${brand}`, body: `Hola,\n\nSabemos que valorás los resultados reales. Por eso hoy queremos contarte sobre algo que creamos especialmente para ayudarte con: ${idea}.\n\nEstá disponible desde hoy. Queremos que seas de los primeros en conocerlo.`, cta: 'Conocer ahora' },
      { channel: 'TikTok / Reels', headline: `POV: Descubrís ${brand}`, body: `Formato: video corto 15-30s mostrando antes/después o un dato sorprendente sobre el producto. Música trending, captions en pantalla, CTA al final.`, cta: 'Seguinos para más' },
    ],
    imagePrompts: [
      `Product photography, ${brand} product, clean white background, professional studio lighting, high-end commercial photography, 4K quality --ar 1:1`,
      `Lifestyle photo of ${first} using ${brand} product, candid authentic moment, golden hour lighting, warm tones, editorial style --ar 4:5`,
      `Minimalist graphic design for ${brand}, bold typography "${idea.split(' ').slice(0, 4).join(' ')}", gradient background, modern aesthetic, social media format --ar 9:16`,
      `Brand campaign visual for ${brand}, concept: ${idea}, cinematic photography, high contrast, fashion editorial quality --ar 16:9`,
    ],
    calendar: [
      'Semana 1 — Teaser: Posts de intriga sin revelar el producto. Stories con cuenta regresiva.',
      'Semana 2 — Lanzamiento: Reveal del producto. Reel principal. Email blast a toda la base.',
      'Semana 3 — Activación: Testimoniales, UGC, behind the scenes. Paid media en Meta + Google.',
      'Semana 4 — Sustentación: Contenido educativo sobre beneficios. Retargeting. Cierre con oferta.',
    ],
  };
}

export default function CampanaCreator() {
  const { profile } = useClientProfile();
  const [idea, setIdea] = useState('');
  const [loading, setLoading] = useState(false);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [tab, setTab] = useState<Tab>('concept');

  const run = async () => {
    if (!idea.trim()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 2000));
    setCampaign(generate(idea, profile?.brand ?? 'tu marca', profile?.targetAudience ?? '', profile?.tone ?? ''));
    setLoading(false);
    setTab('concept');
  };

  const TABS: { id: Tab; label: string }[] = [
    { id: 'concept', label: '💡 Concepto' },
    { id: 'copies', label: '✍️ Copies' },
    { id: 'images', label: '🎨 Prompts' },
    { id: 'calendar', label: '📅 Calendario' },
  ];

  return (
    <div className="min-h-screen bg-[#050508] text-white">
      <nav className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
        <Link to="/" className="font-black text-xl tracking-tight">NEXUS<span className="text-purple-500">.</span></Link>
        <Link to="/dashboard" className="text-sm text-gray-400 hover:text-white transition-colors">← Dashboard</Link>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-10">
          <h1 className="text-3xl font-black mb-2">Creador de Campañas</h1>
          <p className="text-gray-400">Describí tu idea y tu equipo AI genera una campaña completa al instante.</p>
        </div>

        <div className="flex gap-3 mb-8">
          <input value={idea} onChange={e => setIdea(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && run()}
            placeholder={`Ej: Lanzar las nuevas zapatillas sustentables de ${profile?.brand ?? 'mi marca'}`}
            className="flex-1 px-5 py-4 bg-white/5 border border-white/15 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors" />
          <button onClick={run} disabled={!idea.trim() || loading}
            className="px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl font-bold transition-all whitespace-nowrap flex items-center gap-2">
            {loading ? (
              <><span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />Creando...</>
            ) : '🚀 Crear campaña'}
          </button>
        </div>

        {campaign && (
          <div>
            <div className="flex gap-1 mb-6 bg-white/4 border border-white/10 rounded-xl p-1">
              {TABS.map(t => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                    tab === t.id ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
                  }`}>
                  {t.label}
                </button>
              ))}
            </div>

            {tab === 'concept' && (
              <div className="space-y-4">
                <div className="p-6 bg-white/4 border border-white/10 rounded-2xl">
                  <p className="text-purple-400 text-xs font-mono mb-3">TAGLINE</p>
                  <p className="text-2xl font-black italic">"{campaign.tagline}"</p>
                </div>
                <div className="p-6 bg-white/4 border border-white/10 rounded-2xl">
                  <p className="text-purple-400 text-xs font-mono mb-3">CONCEPTO CREATIVO</p>
                  <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{campaign.concept}</p>
                </div>
              </div>
            )}

            {tab === 'copies' && (
              <div className="space-y-4">
                {campaign.copies.map(copy => (
                  <div key={copy.channel} className="p-5 bg-white/4 border border-white/10 rounded-2xl">
                    <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 text-xs font-medium">{copy.channel}</span>
                    <p className="font-bold mt-3 mb-2">{copy.headline}</p>
                    <p className="text-gray-400 text-sm whitespace-pre-line mb-3">{copy.body}</p>
                    <span className="text-xs px-3 py-1 rounded-full bg-white/8 text-gray-300">CTA: {copy.cta}</span>
                  </div>
                ))}
              </div>
            )}

            {tab === 'images' && (
              <div className="space-y-3">
                <p className="text-gray-400 text-sm mb-4">Prompts optimizados para DALL-E 3, Midjourney y Stable Diffusion.</p>
                {campaign.imagePrompts.map((prompt, i) => (
                  <div key={i} className="p-4 bg-white/4 border border-white/10 rounded-xl flex gap-3">
                    <span className="text-gray-600 text-xs font-mono w-5 shrink-0 mt-0.5">0{i + 1}</span>
                    <div className="flex-1">
                      <p className="text-gray-300 text-sm font-mono leading-relaxed">{prompt}</p>
                      <button onClick={() => navigator.clipboard.writeText(prompt)}
                        className="mt-2 text-xs text-purple-400 hover:underline">Copiar prompt</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {tab === 'calendar' && (
              <div className="space-y-3">
                {campaign.calendar.map((item, i) => (
                  <div key={i} className="flex gap-4 p-4 bg-white/4 border border-white/10 rounded-xl">
                    <div className="w-8 h-8 rounded-full bg-purple-600/30 flex items-center justify-center text-purple-300 text-xs font-bold shrink-0">
                      {i + 1}
                    </div>
                    <p className="text-gray-300 text-sm pt-1">{item}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {!campaign && !loading && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🚀</div>
            <p className="text-gray-400 font-medium">Describí tu campaña arriba para empezar</p>
            <p className="text-gray-600 text-sm mt-2">Tu equipo generará: concepto, copies, prompts visuales y calendario</p>
          </div>
        )}
      </main>
    </div>
  );
}
