import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Lock, Mail } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
    } catch (err) {
      setError('Неверный email или пароль');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <img src="/image.png" alt="FA Progress" className="h-24 w-24 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-[#C4A572] mb-2">Админ панель</h1>
          <p className="text-gray-400">Войдите в систему управления</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-gradient-to-br from-[#C4A572]/10 to-transparent rounded-2xl border border-[#C4A572]/30 p-8"
        >
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-white mb-2 font-semibold">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#C4A572]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/30 border border-white/20 rounded-lg pl-12 pr-4 py-3 text-white focus:border-[#C4A572] focus:outline-none"
                  placeholder="coach@faprogress.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-white mb-2 font-semibold">Пароль</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#C4A572]" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/30 border border-white/20 rounded-lg pl-12 pr-4 py-3 text-white focus:border-[#C4A572] focus:outline-none"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C4A572] text-black px-6 py-3 rounded-lg font-bold hover:bg-[#D4B582] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Вход...' : 'Войти'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
