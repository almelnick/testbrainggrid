import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useClientProfile } from '../hooks/useClientProfile';
import { AGENTS } from '../data/agents';
import AgentCard from '../components/AgentCard';

export default function Dashboard() {
  const { profile, loading, clearProfile } = useClientProfile();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !profile) navigate('/onboarding');
  }, [loading, profile, navigate]);

  if (loading || !profile) return null;

  return (
    <div className="min-h-screen bg-[#050508] text-white">
      <nav className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
        <span className="font-black text-xl tracking-tight">NEXUS<span className="text-purple-500">.</span></span>
        <div className="flex items-center gap-6">
          <Link to="/brief" className="text-sm text-gray-400 hover:text-white transition-colors">Nuevo brief</Link>
          <Link to="/campana" className="text-sm text-gray-400 hover:text-white transition-colors">Campaña</Link>
          <Link to="/agentes" className="text-sm text-gray-400 hover:text-white transition-colors">Equipo</Link>
          <button onClick={() => { clearProfile(); navigate('/'); }} className="text-xs text-gray-600 hover:text-red-400 transition-colors">
            Salir
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-10">
          <h1 className="text-3xl font-black mb-1">
            Bienvenido, <span className="text-purple-400">{profile.brand}</span>
          </h1>
          <p className="text-gray-400">Tu equipo está listo. ¿Qué creamos hoy?</p>
        </div>

        {/* Quick actions */}
        <div className="grid sm:grid-cols-3 gap-4 mb-12">
          {[
            { emoji: '📝', title: 'Crear brief', desc: 'Desarrollar un brief creativo completo', to: '/brief', color: 'from-purple-600 to-indigo-600' },
            { emoji: '🚀', title: 'Nueva campaña', desc: 'Generar concepto y piezas de campaña', to: '/campana', color: 'from-pink-600 to-rose-600' },
            { emoji: '🎨', title: 'Director de Arte', desc: 'Generar prompts visuales para IA', to: '/chat/art-director', color: 'from-amber-500 to-orange-600' },
          ].map(action => (
            <Link key={action.to} to={action.to}
              className="group p-6 rounded-2xl bg-white/4 border border-white/10 hover:border-white/20 hover:bg-white/8 transition-all">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center text-2xl mb-4`}>
                {action.emoji}
              </div>
              <h3 className="font-bold">{action.title}</h3>
              <p className="text-gray-400 text-sm">{action.desc}</p>
            </Link>
          ))}
        </div>

        {/* Brand summary */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="p-6 rounded-2xl bg-white/4 border border-white/10">
            <h2 className="font-bold text-lg mb-4">Perfil de marca</h2>
            <div className="space-y-3">
              {[
                { label: 'Marca', value: profile.brand },
                { label: 'Industria', value: profile.industry },
                { label: 'Tono', value: profile.tone || '—' },
                { label: 'Objetivo', value: profile.goals },
              ].map(item => (
                <div key={item.label} className="flex gap-3">
                  <span className="text-gray-500 text-sm w-20 shrink-0">{item.label}</span>
                  <span className="text-white text-sm">{item.value}</span>
                </div>
              ))}
            </div>
            {profile.uploadedFiles.length > 0 && (
              <div className="mt-4 pt-4 border-t border-white/8">
                <p className="text-gray-500 text-xs mb-2">{profile.uploadedFiles.length} archivo(s) subido(s)</p>
                <div className="flex flex-wrap gap-2">
                  {profile.uploadedFiles.map(f => (
                    <span key={f.id} className="text-xs px-2 py-1 bg-white/8 rounded-lg text-gray-300">{f.name}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="p-6 rounded-2xl bg-white/4 border border-white/10">
            <h2 className="font-bold text-lg mb-4">Audiencia objetivo</h2>
            <p className="text-gray-300 text-sm leading-relaxed">{profile.targetAudience}</p>
            {profile.products && (
              <div className="mt-4 pt-4 border-t border-white/8">
                <p className="text-gray-500 text-xs mb-1">Productos / Servicios</p>
                <p className="text-gray-300 text-sm leading-relaxed line-clamp-4">{profile.products}</p>
              </div>
            )}
          </div>
        </div>

        {/* Team */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-xl">Tu equipo</h2>
            <Link to="/agentes" className="text-sm text-purple-400 hover:underline">Ver todos →</Link>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {AGENTS.map(agent => (
              <AgentCard key={agent.id} agent={agent} compact />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
