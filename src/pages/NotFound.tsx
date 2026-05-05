import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#050508] text-white flex items-center justify-center text-center px-6">
      <div>
        <p className="text-8xl font-black text-white/10 mb-4">404</p>
        <h1 className="text-2xl font-bold mb-2">Página no encontrada</h1>
        <p className="text-gray-400 mb-8">La página que buscás no existe.</p>
        <Link to="/" className="px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-xl font-medium transition-colors">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
