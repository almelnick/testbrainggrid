import { Link } from 'react-router-dom';
import { AGENTS } from '../data/agents';

export default function Index() {
  return (
    <div className="min-h-screen bg-[#050508] text-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between backdrop-blur-md bg-black/60 border-b border-white/5">
        <span className="font-black text-xl tracking-tight">NEXUS<span className="text-purple-500">.</span></span>
        <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
          <Link to="/agentes" className="hover:text-white transition-colors">Equipo</Link>
          <Link to="/brief" className="hover:text-white transition-colors">Briefs</Link>
          <Link to="/campana" className="hover:text-white transition-colors">Campañas</Link>
        </div>
        <Link
          to="/onboarding"
          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm font-medium transition-colors"
        >
          Empezar
        </Link>
      </nav>

      {/* Hero */}
      <section className="pt-36 pb-24 px-6 max-w-6xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-medium mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
          Agencia digital con inteligencia artificial
        </div>
        <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
          Tu equipo creativo<br />
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            con cerebro de IA
          </span>
        </h1>
        <p className="text-gray-400 text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Director creativo, director de arte, copywriter, estratega y social manager —
          cinco especialistas AI que entienden tu marca y crean campañas que convierten.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/onboarding"
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl font-bold text-lg transition-all shadow-lg shadow-purple-900/30"
          >
            Incorporar mi marca →
          </Link>
          <Link
            to="/agentes"
            className="px-8 py-4 rounded-xl border border-white/20 hover:bg-white/5 font-medium text-gray-300 transition-all"
          >
            Conocer el equipo
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4">Cómo funciona</h2>
        <p className="text-gray-400 text-center mb-12">En tres pasos tenés tu agencia lista</p>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { step: '01', emoji: '🏢', title: 'Subí tu marca', desc: 'Contanos todo sobre tu negocio, producto y audiencia. Subí tus materiales de marca en minutos.' },
            { step: '02', emoji: '🤝', title: 'Conocé tu equipo', desc: 'Cinco especialistas AI aprenden sobre tu marca y están listos para trabajar en tus campañas.' },
            { step: '03', emoji: '🚀', title: 'Creá y lanzá', desc: 'Generá briefs, campañas, copys, prompts de imágenes y calendarios de contenido al instante.' },
          ].map(item => (
            <div key={item.step} className="p-6 rounded-2xl bg-white/4 border border-white/8">
              <div className="text-4xl mb-4">{item.emoji}</div>
              <div className="text-purple-500 text-sm font-mono font-bold mb-2">{item.step}</div>
              <h3 className="font-bold text-lg mb-2">{item.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4">Tu equipo de especialistas</h2>
        <p className="text-gray-400 text-center mb-12">Cada agente domina su área con las mejores herramientas de IA</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {AGENTS.map(agent => (
            <Link
              key={agent.id}
              to={`/chat/${agent.id}`}
              className="group p-5 rounded-2xl bg-white/4 border border-white/8 hover:border-white/20 hover:bg-white/8 transition-all"
            >
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${agent.gradient} flex items-center justify-center text-2xl mb-3`}>
                {agent.emoji}
              </div>
              <p className="font-bold text-sm">{agent.name}</p>
              <p className={`text-xs bg-gradient-to-r ${agent.gradient} bg-clip-text text-transparent font-medium mb-2`}>
                {agent.title}
              </p>
              <p className="text-gray-500 text-xs">{agent.specialty}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Capabilities */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Todo lo que podés crear</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { emoji: '📝', title: 'Briefs creativos', desc: 'Generá briefs completos con objetivos, targets y mensajes clave.' },
            { emoji: '🎯', title: 'Campañas 360°', desc: 'Concepto, mensajes por canal y cronograma de activación.' },
            { emoji: '✍️', title: 'Copys y textos', desc: 'Anuncios, emails, posts, scripts — en el tono exacto de tu marca.' },
            { emoji: '🖼️', title: 'Prompts de imágenes', desc: 'Prompts optimizados para DALL-E, Midjourney y Stable Diffusion.' },
            { emoji: '📱', title: 'Calendario de contenido', desc: 'Plan de publicaciones semanal o mensual por red social.' },
            { emoji: '📊', title: 'Análisis de mercado', desc: 'Insights de consumidores, tendencias y oportunidades de tu categoría.' },
          ].map(cap => (
            <div key={cap.title} className="p-5 rounded-xl bg-white/4 border border-white/8">
              <div className="text-2xl mb-3">{cap.emoji}</div>
              <h3 className="font-bold mb-1">{cap.title}</h3>
              <p className="text-gray-400 text-sm">{cap.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 max-w-3xl mx-auto text-center">
        <div className="p-12 rounded-3xl bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border border-purple-500/20">
          <h2 className="text-4xl font-black mb-4">¿Listo para empezar?</h2>
          <p className="text-gray-300 mb-8">Onboardeá tu marca en menos de 5 minutos y comenzá a crear.</p>
          <Link
            to="/onboarding"
            className="inline-block px-10 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl font-bold text-lg transition-all"
          >
            Incorporar mi marca gratis →
          </Link>
        </div>
      </section>

      <footer className="py-8 px-6 border-t border-white/5 text-center">
        <p className="text-gray-600 text-sm">NEXUS AI Agency — Tu equipo creativo potenciado por inteligencia artificial</p>
      </footer>
    </div>
  );
}
