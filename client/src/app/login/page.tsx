'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TrendingUpIcon, LockIcon, UserIcon } from 'lucide-react';
import apiClient from '@/lib/api-client';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const { data } = await apiClient.post('/auth/login', { username, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.username);
      router.push('/dashboard');
    } catch (err) {
      setError('Credenciales inválidas. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800"
      >
        <div className="p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/30 mb-4">
              <TrendingUpIcon size={32} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Bienvenido de nuevo</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Ingresa tus credenciales para continuar</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Usuario</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-3 text-slate-400" size={18} />
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                  placeholder="admin"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Contraseña</label>
              <div className="relative">
                <LockIcon className="absolute left-3 top-3 text-slate-400" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <p className="text-rose-500 text-sm font-medium bg-rose-50 dark:bg-rose-500/10 p-3 rounded-lg text-center border border-rose-100 dark:border-rose-500/20">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98]"
            >
              {isLoading ? 'Cargando...' : 'Iniciar Sesión'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
            ¿No tienes cuenta? <span className="text-blue-600 dark:text-blue-400 font-semibold cursor-pointer hover:underline">Solicitar acceso</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
