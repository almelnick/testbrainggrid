import { Link } from 'react-router-dom';
import { AGENTS } from '../data/agents';
import AgentCard from '../components/AgentCard';

export default function Agentes() {
  return (
    <div className="min-h-screen bg-[#050508] text-white">
      <nav className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
        <Link to="/" className="font-black text-xl tracking-tight">NEXUS<span className="text-purple-500">.</span></Link>
        <Link to="/dashboard" className="text-sm text-gray-400 hover:text-white transition-colors">Dashboard →</Link>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black mb-4">Tu equipo de IA</h1>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto">
            Cinco especialistas de inteligencia artificial listos para crear campañas que conectan con tu audiencia.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {AGENTS.map(agent => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">¿Todavía no cargaste tu marca?</h2>
          <p className="text-gray-400 mb-6">En 5 minutos tenés tu equipo trabajando para vos.</p>
          <Link
            to="/onboarding"
            className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl font-bold text-lg transition-all"
          >
            Incorporar mi marca →
          </Link>
        </div>
      </main>
    </div>
  );
}
