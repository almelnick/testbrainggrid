import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClientProfile } from '../hooks/useClientProfile';
import FileUpload from '../components/FileUpload';
import type { ClientProfile } from '../types/agency';

const STEPS = [
  { id: 1, label: 'Tu marca' },
  { id: 2, label: 'Producto' },
  { id: 3, label: 'Audiencia' },
  { id: 4, label: 'Materiales' },
  { id: 5, label: 'Objetivos' },
];

const TONE_OPTIONS = ['Profesional', 'Cercano', 'Divertido', 'Inspiracional', 'Premium', 'Irreverente', 'Educativo', 'Urgente', 'Empático'];
const GOAL_OPTIONS = ['Aumentar ventas directas', 'Generar brand awareness', 'Atraer nuevos clientes', 'Fidelizar clientes existentes', 'Lanzar un nuevo producto', 'Crecer en redes sociales'];

export default function Onboarding() {
  const navigate = useNavigate();
  const { saveProfile } = useClientProfile();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<Partial<ClientProfile>>({
    brand: '', industry: '', products: '',
    targetAudience: '', tone: '', competitors: '',
    goals: '', uploadedFiles: [],
  });

  const update = (field: keyof ClientProfile, value: ClientProfile[keyof ClientProfile]) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const toggleTone = (t: string) => {
    const current = data.tone?.split(', ').filter(Boolean) ?? [];
    const next = current.includes(t) ? current.filter(x => x !== t) : [...current, t];
    update('tone', next.join(', '));
  };

  const canProceed = () => {
    if (step === 1) return !!(data.brand && data.industry);
    if (step === 2) return !!data.products;
    if (step === 3) return !!data.targetAudience;
    if (step === 5) return !!data.goals;
    return true;
  };

  const handleFinish = () => {
    saveProfile(data as ClientProfile);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#050508] text-white flex flex-col">
      <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
        <span className="font-black text-xl tracking-tight">NEXUS<span className="text-purple-500">.</span></span>
        <span className="text-gray-400 text-sm">Paso {step} de {STEPS.length}</span>
      </div>

      <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full px-6 py-12">
        {/* Progress bar */}
        <div className="flex items-center gap-1 mb-10">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center gap-1 flex-1">
              <div className={`flex items-center gap-1.5 ${s.id <= step ? 'text-white' : 'text-gray-600'}`}>
                <span className={`w-7 h-7 rounded-full text-xs flex items-center justify-center font-bold transition-all ${
                  s.id < step ? 'bg-purple-600' : s.id === step ? 'bg-purple-600 ring-2 ring-purple-400/30' : 'bg-white/10'
                }`}>
                  {s.id < step ? '✓' : s.id}
                </span>
                <span className="hidden sm:block text-xs">{s.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-px transition-all ${s.id < step ? 'bg-purple-600' : 'bg-white/10'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="flex-1 space-y-6">
          {step === 1 && (
            <>
              <div>
                <h2 className="text-2xl font-bold mb-2">Contanos sobre tu marca</h2>
                <p className="text-gray-400">Tu equipo AI necesita conocer quién sos para trabajar bien.</p>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Nombre de la marca *</label>
                <input value={data.brand ?? ''} onChange={e => update('brand', e.target.value)}
                  placeholder="Ej: Patagonia, Nike, Mi Empresa"
                  className="w-full px-4 py-3 bg-white/5 border border-white/15 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Industria / Sector *</label>
                <input value={data.industry ?? ''} onChange={e => update('industry', e.target.value)}
                  placeholder="Ej: Moda sustentable, Software B2B, Gastronomía"
                  className="w-full px-4 py-3 bg-white/5 border border-white/15 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors" />
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <h2 className="text-2xl font-bold mb-2">¿Qué vendés?</h2>
                <p className="text-gray-400">Describirlo bien ayuda a crear mensajes que convierten.</p>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Productos o servicios principales *</label>
                <textarea value={data.products ?? ''} onChange={e => update('products', e.target.value)}
                  placeholder="Describí lo que vendés: qué es, para qué sirve, qué lo hace diferente..."
                  rows={5} className="w-full px-4 py-3 bg-white/5 border border-white/15 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors resize-none" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Competidores principales (opcional)</label>
                <input value={data.competitors ?? ''} onChange={e => update('competitors', e.target.value)}
                  placeholder="Ej: Marca A, Marca B"
                  className="w-full px-4 py-3 bg-white/5 border border-white/15 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors" />
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div>
                <h2 className="text-2xl font-bold mb-2">¿A quién le hablás?</h2>
                <p className="text-gray-400">Cuanto más específico, mejores serán las ideas del equipo.</p>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Audiencia objetivo *</label>
                <textarea value={data.targetAudience ?? ''} onChange={e => update('targetAudience', e.target.value)}
                  placeholder="Ej: Mujeres de 28-45, profesionales, con hijos, que valoran la sostenibilidad..."
                  rows={4} className="w-full px-4 py-3 bg-white/5 border border-white/15 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors resize-none" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Tono y personalidad de la marca</label>
                <div className="flex flex-wrap gap-2">
                  {TONE_OPTIONS.map(t => (
                    <button key={t} onClick={() => toggleTone(t)}
                      className={`px-3 py-2 rounded-lg text-sm border transition-all ${
                        data.tone?.includes(t) ? 'border-purple-500 bg-purple-500/20 text-purple-300' : 'border-white/15 bg-white/5 text-gray-400 hover:border-white/30'
                      }`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <div>
                <h2 className="text-2xl font-bold mb-2">Subí tus materiales</h2>
                <p className="text-gray-400">Logos, fotos, brand guidelines — todo lo que ayude a representar tu marca.</p>
              </div>
              <FileUpload
                files={data.uploadedFiles ?? []}
                onChange={files => update('uploadedFiles', files)}
              />
              <p className="text-gray-500 text-xs">Paso opcional pero muy recomendado para mejores resultados.</p>
            </>
          )}

          {step === 5 && (
            <>
              <div>
                <h2 className="text-2xl font-bold mb-2">¿Cuál es tu objetivo?</h2>
                <p className="text-gray-400">Que tu equipo sepa hacia dónde apuntar.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {GOAL_OPTIONS.map(g => (
                  <button key={g} onClick={() => update('goals', g)}
                    className={`px-4 py-3 rounded-xl text-sm border text-left transition-all ${
                      data.goals === g ? 'border-purple-500 bg-purple-500/20 text-white' : 'border-white/15 bg-white/5 text-gray-400 hover:border-white/30'
                    }`}>
                    {g}
                  </button>
                ))}
              </div>
              <textarea value={GOAL_OPTIONS.includes(data.goals ?? '') ? '' : data.goals ?? ''}
                onChange={e => update('goals', e.target.value)}
                placeholder="O describí tu objetivo específico aquí..."
                rows={2} className="w-full px-4 py-3 bg-white/5 border border-white/15 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors resize-none" />
            </>
          )}
        </div>

        <div className="flex items-center justify-between pt-8 border-t border-white/5 mt-8">
          <button onClick={() => setStep(s => s - 1)} disabled={step === 1}
            className="px-6 py-3 rounded-xl border border-white/15 text-gray-400 hover:border-white/30 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all">
            Atrás
          </button>
          {step < 5 ? (
            <button onClick={() => setStep(s => s + 1)} disabled={!canProceed()}
              className="px-8 py-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl font-medium transition-all">
              Siguiente →
            </button>
          ) : (
            <button onClick={handleFinish} disabled={!canProceed()}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl font-bold transition-all">
              Conocer mi equipo →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
