import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import { loginUser } from '../firebase/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await loginUser(email, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError('E-mail ou senha incorretos. Verifique seus dados e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 bg-slate-50 flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[40px] shadow-2xl p-10 border border-slate-100"
      >
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-primary tracking-tighter mb-2">Bem-vindo de volta</h1>
          <p className="text-slate-500 font-medium">Acesse sua conta para gerenciar seus imóveis</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl flex items-start gap-3 text-sm font-bold border border-red-100">
            <AlertCircle size={18} className="shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">E-mail Corporativo</label>
            <div className="relative">
              <Mail size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com" 
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-14 pr-6 focus:outline-none focus:border-accent transition-all text-sm font-medium" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Senha</label>
              <Link to="/forgot-password" className="text-[10px] font-black text-accent uppercase tracking-widest hover:underline">Esqueceu a senha?</Link>
            </div>
            <div className="relative">
              <Lock size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-14 pr-6 focus:outline-none focus:border-accent transition-all text-sm font-medium" 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full btn-primary py-5 text-sm uppercase tracking-[0.2em] shadow-xl shadow-primary/20 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
            ) : (
              <div className="flex items-center justify-center gap-3">
                Entrar na Plataforma
                <LogIn size={20} />
              </div>
            )}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-slate-500 font-medium text-sm">
            Não tem uma conta? {' '}
            <Link to="/register" className="text-accent font-black hover:underline">Cadastre-se agora</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
