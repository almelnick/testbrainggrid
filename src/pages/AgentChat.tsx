import { useState, useRef, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AGENTS } from '../data/agents';
import { useClientProfile } from '../hooks/useClientProfile';
import type { Message, AgentRole } from '../types/agency';

const RESPONSES: Record<AgentRole, string[]> = {
  'creative-director': [
    'Para posicionarte en el mercado, mi recomendación es construir un territorio emocional claro y consistente. Cada campaña debe reforzar una sola idea poderosa. ¿Empezamos por definir ese territorio?',
    'Veo una oportunidad clara en tu categoría: tu audiencia está buscando algo que las marcas actuales no les dan. Podemos ocupar ese espacio. ¿Desarrollamos el brief estratégico?',
    'Mi visión: menos promesas genéricas, más momentos reales. Tu marca tiene que conectar emocionalmente antes de intentar vender. ¿Empezamos con el concepto central de campaña?',
    'El análisis de tu competencia me muestra una brecha evidente. Nadie está comunicando desde el punto de vista del consumidor. Eso es exactamente lo que deberíamos explotar. ¿Lo trabajamos?',
  ],
  'art-director': [
    'Para tu estética, visualizo algo clean y contemporáneo. Paleta de neutros con un acento de color fuerte. Puedo generarte prompts específicos para DALL-E o Midjourney ahora mismo. ¿Qué tipo de pieza necesitás?',
    'Prompt para empezar: "Product photography, lifestyle aesthetic, soft natural lighting, premium feel, minimal background --ar 4:5 --style raw". ¿Querés que lo ajuste al tono de tu marca?',
    'El moodboard que tengo en mente mezcla fotografía editorial con tipografía bold. Colores sobrios con un acento de energía. ¿Preferís que el estilo sea más lifestyle o más centrado en el producto?',
    'Para las piezas de redes sociales te recomiendo un sistema visual con 3 templates: uno para contenido, uno para promociones y uno para interacción. ¿Arrancamos con los prompts?',
  ],
  'copywriter': [
    'El copy que mejor funciona en tu categoría es honesto y directo. Sin floritura. Tagline de prueba: "[Tu marca]: [beneficio principal] sin vueltas." ¿Lo ajustamos con los datos de tu marca?',
    'Para tu audiencia, el copy tiene que hablar del problema antes de hablar del producto. Propuesta: empezamos el anuncio con "¿Cansado de...?" y cerramos con la solución. ¿Lo desarrollamos?',
    'Para email marketing: subject line que recomiendo testar primero: "Esto cambia todo para [tipo de cliente]" — tiene alta tasa de apertura. ¿Desarrollamos el cuerpo del email completo?',
    'El tono que describiste me dice que tenemos que ser directos pero cálidos. Algo así: conversacional, sin jerga técnica, con calls to action claros. ¿Empezamos con el copy para anuncios?',
  ],
  'strategist': [
    'Tu categoría está en un momento interesante. Tu audiencia está siendo bombardeada con mensajes similares. La diferenciación tiene que ser en una dimensión de valor que nadie explota todavía. ¿Profundizamos?',
    'Para el plan de medios, recomendaría empezar por Instagram y Google Search — generás demanda y la capturás. Budget óptimo para arrancar con datos: USD 1.500-3.000/mes. ¿Armamos el media plan?',
    'Los KPIs clave para trackear: CAC, ROAS mínimo 3x, y frecuencia en brand awareness. ¿Cuál es el objetivo número uno que priorizás este trimestre?',
    'Analizando el mercado, veo tres segmentos que nadie está atacando bien. Podemos construir una estrategia de contenido y paid que se enfoque en el más rentable primero. ¿Te cuento más?',
  ],
  'social-manager': [
    'Para Instagram, la frecuencia ideal es 4-5 posts semanales + 2-3 Stories diarias. Distribución: 40% producto, 40% lifestyle y 20% engagement. ¿Arrancamos con el calendario de este mes?',
    'Tendencia fuerte ahora mismo para tu categoría en TikTok: formato "POV" y "day in the life". Tiene alto potencial de viralidad con tu audiencia. ¿Lo desarrollamos en detalle?',
    'Para crecer la comunidad: 1) Respondé TODOS los comentarios en las primeras 2 horas, 2) Usá máximo 5 hashtags muy específicos, 3) Publicá entre 7-9am o 6-9pm. ¿Querés el calendario completo?',
    'El contenido que más convierte ahora mismo es el educativo corto: "3 cosas que no sabías sobre [producto]". Fácil de hacer, alto engagement, posiciona como referente. ¿Lo trabajamos?',
  ],
};

export default function AgentChat() {
  const { agentId } = useParams<{ agentId: string }>();
  const { profile } = useClientProfile();
  const agent = AGENTS.find(a => a.id === agentId);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (agent && messages.length === 0) {
      setMessages([{
        id: '0',
        role: 'assistant',
        content: profile?.brand
          ? `Hola! Soy ${agent.name}, ${agent.title}. Ya leí todo sobre ${profile.brand} — ${profile.industry}, objetivo: ${profile.goals?.toLowerCase() ?? 'a definir'}. Estoy lista para trabajar. ¿Por dónde empezamos?`
          : `Hola! Soy ${agent.name}, ${agent.title}. Especialista en ${agent.specialty}. ¿En qué puedo ayudarte hoy?`,
        timestamp: new Date().toISOString(),
      }]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agent?.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const send = async () => {
    if (!input.trim() || !agent) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);
    await new Promise(r => setTimeout(r, 800 + Math.random() * 1200));
    const pool = RESPONSES[agent.id as AgentRole];
    const response = pool[Math.floor(Math.random() * pool.length)];
    setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: response, timestamp: new Date().toISOString() }]);
    setTyping(false);
  };

  if (!agent) return (
    <div className="min-h-screen bg-[#050508] text-white flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-400 mb-4">Agente no encontrado</p>
        <Link to="/agentes" className="text-purple-400 hover:underline">Ver equipo</Link>
      </div>
    </div>
  );

  return (
    <div className="h-screen bg-[#050508] text-white flex flex-col">
      <nav className="px-6 py-3 border-b border-white/5 flex items-center gap-4 shrink-0">
        <Link to="/dashboard" className="text-gray-400 hover:text-white text-sm transition-colors">←</Link>
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${agent.gradient} flex items-center justify-center text-xl shrink-0`}>
          {agent.emoji}
        </div>
        <div>
          <p className="font-bold text-sm">{agent.name}</p>
          <p className={`text-xs bg-gradient-to-r ${agent.gradient} bg-clip-text text-transparent`}>{agent.title}</p>
        </div>
        <div className="ml-auto flex gap-2">
          {AGENTS.filter(a => a.id !== agent.id).map(a => (
            <Link key={a.id} to={`/chat/${a.id}`}
              className={`w-8 h-8 rounded-lg bg-gradient-to-br ${a.gradient} flex items-center justify-center text-sm hover:scale-110 transition-transform`}
              title={a.name}>
              {a.emoji}
            </Link>
          ))}
        </div>
      </nav>

      <div className="border-b border-white/5 px-6 py-2 flex gap-2 overflow-x-auto shrink-0">
        {agent.capabilities.slice(0, 4).map(cap => (
          <button key={cap} onClick={() => setInput(cap)}
            className="flex-none text-xs px-3 py-1.5 rounded-full bg-white/6 border border-white/10 text-gray-400 hover:text-white hover:border-white/25 transition-all whitespace-nowrap">
            {cap}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        {messages.map(msg => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            {msg.role === 'assistant' && (
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${agent.gradient} flex items-center justify-center text-sm shrink-0 mt-1`}>
                {agent.emoji}
              </div>
            )}
            <div className={`max-w-lg px-4 py-3 rounded-2xl text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-purple-600/30 border border-purple-500/30 text-white'
                : 'bg-white/6 border border-white/10 text-gray-200'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex gap-3">
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${agent.gradient} flex items-center justify-center text-sm shrink-0`}>
              {agent.emoji}
            </div>
            <div className="px-4 py-3 bg-white/6 border border-white/10 rounded-2xl flex items-center gap-1">
              {[0, 1, 2].map(i => (
                <span key={i} style={{ animationDelay: `${i * 0.15}s` }}
                  className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="px-6 py-4 border-t border-white/5 shrink-0">
        <div className="flex gap-3 max-w-3xl mx-auto">
          <input value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder={`Hablá con ${agent.name}...`}
            className="flex-1 px-4 py-3 bg-white/5 border border-white/15 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors" />
          <button onClick={send} disabled={!input.trim() || typing}
            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${agent.gradient} flex items-center justify-center text-white font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 transition-all`}>
            ↑
          </button>
        </div>
      </div>
    </div>
  );
}
