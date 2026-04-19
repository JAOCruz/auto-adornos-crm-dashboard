import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login(email);
      navigate('/');
    } catch (err) {
      setError('Error al iniciar sesión');
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1120] flex items-center justify-center p-4 relative overflow-hidden">
      <style>{`
        .bg-cyber-grid {
          background-size: 50px 50px;
          background-image:
            linear-gradient(to right, rgba(59, 130, 246, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(59, 130, 246, 0.05) 1px, transparent 1px);
        }
      `}</style>

      {/* Background */}
      <div className="bg-cyber-grid pointer-events-none fixed inset-0 z-0" />
      <div className="fixed top-0 left-0 z-50 h-1 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-[0_0_20px_rgba(59,130,246,0.5)]" />

      {/* Content */}
      <div className="w-full max-w-md relative z-10">
        <div className="bg-[#0F172A]/80 backdrop-blur-md rounded-lg shadow-2xl p-8 border border-slate-800">
          <h1 className="font-display text-3xl font-bold text-white mb-2">
            Auto Adornos<span className="text-blue-500"> RD</span>
          </h1>
          <p className="text-slate-400 mb-8">CRM Dashboard</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Correo
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                className="w-full bg-slate-800/50 text-white px-4 py-2 rounded border border-slate-700 focus:border-blue-500 focus:outline-none transition-colors placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-slate-800/50 text-white px-4 py-2 rounded border border-slate-700 focus:border-blue-500 focus:outline-none transition-colors placeholder:text-slate-500"
              />
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition-colors mt-6"
            >
              Iniciar Sesión
            </button>
          </form>

          <p className="text-center text-slate-400 text-xs mt-6">
            Demo — usa cualquier email/contraseña
          </p>
        </div>
      </div>
    </div>
  );
}
