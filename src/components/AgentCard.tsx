import { Link } from 'react-router-dom';
import type { Agent } from '../types/agency';

interface Props {
  agent: Agent;
  compact?: boolean;
}

export default function AgentCard({ agent, compact = false }: Props) {
  if (compact) {
    return (
      <Link
        to={`/chat/${agent.id}`}
        className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/10 hover:border-white/20"
      >
        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${agent.gradient} flex items-center justify-center text-lg shrink-0`}>
          {agent.emoji}
        </div>
        <div>
          <p className="font-medium text-white text-sm">{agent.name}</p>
          <p className="text-xs text-gray-400">{agent.title}</p>
        </div>
      </Link>
    );
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-white/20 hover:bg-white/8 transition-all">
      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${agent.gradient} flex items-center justify-center text-3xl mb-4`}>
        {agent.emoji}
      </div>
      <h3 className="text-white font-bold text-lg">{agent.name}</h3>
      <p className={`text-sm font-medium bg-gradient-to-r ${agent.gradient} bg-clip-text text-transparent mb-2`}>
        {agent.title}
      </p>
      <p className="text-gray-400 text-sm mb-4 leading-relaxed">{agent.description}</p>
      <div className="mb-4">
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Herramientas</p>
        <div className="flex flex-wrap gap-1">
          {agent.tools.map(tool => (
            <span key={tool} className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-300">
              {tool}
            </span>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Capacidades</p>
        <ul className="space-y-1">
          {agent.capabilities.slice(0, 3).map(cap => (
            <li key={cap} className="text-xs text-gray-400 flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-gray-600 shrink-0" />
              {cap}
            </li>
          ))}
        </ul>
      </div>
      <Link
        to={`/chat/${agent.id}`}
        className={`block text-center py-2.5 px-4 rounded-xl bg-gradient-to-r ${agent.gradient} text-white text-sm font-medium hover:opacity-90 transition-opacity`}
      >
        Trabajar con {agent.name.split(' ')[0]}
      </Link>
    </div>
  );
}
