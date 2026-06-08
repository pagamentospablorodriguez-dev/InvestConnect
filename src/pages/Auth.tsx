import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  TrendingUp, Mail, Lock, Eye, EyeOff, ArrowLeft, User, Building,
  MapPin, Target, Globe, Users, Phone, Briefcase, CheckCircle, Zap,
} from 'lucide-react';
import { BRAZILIAN_STATES, INVESTOR_TYPES } from '../lib/utils';
import { motion } from 'framer-motion';

export function LoginPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true);
    const { error } = await signIn(email, password);
    if (error) { setError(error.message === 'Invalid login credentials' ? 'E-mail ou senha incorretos' : error.message); setLoading(false); return; }
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-950 via-primary-900 to-emerald-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-8 text-sm font-medium transition-colors"><ArrowLeft className="w-4 h-4" /> Voltar ao site</Link>
        <div className="bg-white rounded-3xl p-8 shadow-2xl">
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-600 to-emerald-500 flex items-center justify-center shadow-lg shadow-primary-600/20"><TrendingUp className="w-7 h-7 text-white" /></div>
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 text-center mb-1">Bem-vindo de volta</h1>
          <p className="text-gray-500 text-center mb-6 text-sm">Entre na sua conta para acessar a plataforma</p>
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm font-medium border border-red-100">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label><div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" required className="input pl-10" /></div></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Senha</label><div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Sua senha" required className="input pl-10 pr-10" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button></div></div>
            <button type="submit" disabled={loading} className="btn-primary w-full text-base">{loading ? 'Entrando...' : 'Entrar'}</button>
          </form>
          <p className="text-center text-gray-500 mt-6 text-sm">Nao tem conta? <Link to="/cadastro" className="text-primary-600 font-semibold hover:text-primary-700">Criar conta gratis</Link></p>
        </div>
      </div>
    </div>
  );
}

// Welcome modal shown after first login
export function WelcomeModal({ onClose, userName }: { onClose: () => void; userName: string }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl text-center">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-600 to-emerald-500 flex items-center justify-center mx-auto mb-6 shadow-xl"><CheckCircle className="w-10 h-10 text-white" /></div>
        <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Conta criada com sucesso!</h2>
        <p className="text-gray-500 mb-6">Bem-vindo{userName ? `, ${userName}` : ''}! Sua conta esta ativa. Comece explorando a plataforma.</p>
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { icon: Users, label: 'Investidores ativos', color: 'text-primary-600 bg-primary-50' },
            { icon: Zap, label: 'Projetos publicados', color: 'text-amber-600 bg-amber-50' },
            { icon: CheckCircle, label: 'Negocios fechados', color: 'text-emerald-600 bg-emerald-50' },
          ].map((item) => (
            <div key={item.label} className={`rounded-xl p-3 ${item.color}`}>
              <item.icon className="w-5 h-5 mx-auto mb-1" />
              <p className="text-[10px] font-semibold">{item.label}</p>
            </div>
          ))}
        </div>
        <button onClick={onClose} className="btn-primary w-full text-base">Comecar Agora</button>
      </motion.div>
    </div>
  );
}

export function SignupPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signUp } = useAuth();
  const [step, setStep] = useState(1);
  const [showWelcome, setShowWelcome] = useState(false);
  const initialType = searchParams.get('tipo') === 'investidor' ? 'investor' : 'entrepreneur';
  const [userType, setUserType] = useState<'entrepreneur' | 'investor'>(initialType);
  const [investorType, setInvestorType] = useState('angel');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    full_name: '', email: '', password: '', confirm_password: '',
    city: '', state: '', phone: '', bio: '',
    company_name: '', investment_range_min: '10000', investment_range_max: '100000',
  });

  const handleNext = () => {
    if (!form.full_name || !form.email || !form.password) { setError('Preencha todos os campos obrigatorios'); return; }
    if (form.password !== form.confirm_password) { setError('As senhas nao coincidem'); return; }
    if (form.password.length < 6) { setError('A senha deve ter pelo menos 6 caracteres'); return; }
    setError(''); setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError('');
    const { error } = await signUp(form.email, form.password, {
      full_name: form.full_name, user_type: userType, city: form.city, state: form.state,
      phone: form.phone, bio: form.bio, investor_type: investorType,
      company_name: form.company_name, investment_range_min: parseInt(form.investment_range_min),
      investment_range_max: parseInt(form.investment_range_max),
    } as any);
    if (error) { setError(error.message === 'User already registered' ? 'Este e-mail ja esta cadastrado' : error.message); setLoading(false); return; }
    setShowWelcome(true);
  };

  if (showWelcome) {
    return <WelcomeModal onClose={() => navigate('/dashboard')} userName={form.full_name.split(' ')[0]} />;
  }

  const investorIcons: Record<string, any> = { angel: Users, fund: Building, shark_talent_scout: Target, international: Globe };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-950 via-primary-900 to-emerald-900 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <Link to="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-8 text-sm font-medium transition-colors"><ArrowLeft className="w-4 h-4" /> Voltar</Link>
        <div className="bg-white rounded-3xl p-8 shadow-2xl">
          <div className="flex justify-center mb-6"><div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-600 to-emerald-500 flex items-center justify-center shadow-lg shadow-primary-600/20"><TrendingUp className="w-7 h-7 text-white" /></div></div>
          <h1 className="text-2xl font-extrabold text-gray-900 text-center mb-1">Criar sua conta</h1>
          <p className="text-gray-500 text-center mb-6 text-sm">Comece a conectar-se com investidores agora</p>
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className={`w-2.5 h-2.5 rounded-full transition-colors ${step >= 1 ? 'bg-primary-600' : 'bg-gray-300'}`} />
            <div className={`w-12 h-1 rounded-full transition-colors ${step >= 2 ? 'bg-primary-600' : 'bg-gray-200'}`} />
            <div className={`w-2.5 h-2.5 rounded-full transition-colors ${step >= 2 ? 'bg-primary-600' : 'bg-gray-300'}`} />
          </div>
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm font-medium border border-red-100">{error}</div>}
          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <button type="button" onClick={() => setUserType('entrepreneur')} className={`p-4 rounded-xl border-2 transition-all text-center ${userType === 'entrepreneur' ? 'border-primary-600 bg-primary-50 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}>
                    <User className={`w-6 h-6 mx-auto mb-2 ${userType === 'entrepreneur' ? 'text-primary-600' : 'text-gray-400'}`} />
                    <p className={`font-semibold text-sm ${userType === 'entrepreneur' ? 'text-primary-700' : 'text-gray-700'}`}>Empreendedor</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">Receber investimento</p>
                  </button>
                  <button type="button" onClick={() => setUserType('investor')} className={`p-4 rounded-xl border-2 transition-all text-center ${userType === 'investor' ? 'border-emerald-600 bg-emerald-50 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}>
                    <Building className={`w-6 h-6 mx-auto mb-2 ${userType === 'investor' ? 'text-emerald-600' : 'text-gray-400'}`} />
                    <p className={`font-semibold text-sm ${userType === 'investor' ? 'text-emerald-700' : 'text-gray-700'}`}>Investidor</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">Investir em projetos</p>
                  </button>
                </div>
                {userType === 'investor' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Investidor</label>
                    <div className="grid grid-cols-2 gap-2">
                      {INVESTOR_TYPES.map((t) => { const Icon = investorIcons[t.value] || Users; return (
                        <button key={t.value} type="button" onClick={() => setInvestorType(t.value)} className={`flex items-center gap-2 p-3 rounded-xl border text-left transition-all ${investorType === t.value ? 'border-primary-600 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}>
                          <Icon className={`w-4 h-4 ${investorType === t.value ? 'text-primary-600' : 'text-gray-400'}`} />
                          <span className="text-xs font-medium">{t.label}</span>
                        </button>
                      ); })}
                    </div>
                  </div>
                )}
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Nome completo</label><div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="text" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} placeholder="Seu nome completo" required className="input pl-10" /></div></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label><div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="seu@email.com" required className="input pl-10" /></div></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Senha</label><div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type={showPassword ? 'text' : 'password'} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Minimo 6 caracteres" required className="input pl-10 pr-10" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button></div></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Confirmar senha</label><div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="password" value={form.confirm_password} onChange={(e) => setForm({ ...form, confirm_password: e.target.value })} placeholder="Digite novamente" required className="input pl-10" /></div></div>
                <button type="button" onClick={handleNext} className="btn-primary w-full">Continuar</button>
              </div>
            )}
            {step === 2 && (
              <div className="space-y-4">
                <button type="button" onClick={() => setStep(1)} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm font-medium"><ArrowLeft className="w-4 h-4" /> Voltar</button>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label><div className="relative"><MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Sao Paulo" required className="input pl-10" /></div></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Estado</label><select value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} required className="input"><option value="">Selecione</option>{BRAZILIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                </div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Telefone (opcional)</label><div className="relative"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="(11) 99999-9999" className="input pl-10" /></div></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">{userType === 'investor' ? 'Sobre voce como investidor' : 'Sobre voce e seu objetivo'}</label><textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder={userType === 'investor' ? 'Descreva seu perfil de investimento...' : 'Descreva o que voce busca...'} rows={3} className="input" /></div>
                {userType === 'investor' && (<>
                  {investorType === 'fund' && <div><label className="block text-sm font-medium text-gray-700 mb-1">Nome da empresa/fundo</label><div className="relative"><Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="text" value={form.company_name} onChange={(e) => setForm({ ...form, company_name: e.target.value })} placeholder="Nome do fundo" className="input pl-10" /></div></div>}
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Investimento minimo (R$)</label><input type="number" value={form.investment_range_min} onChange={(e) => setForm({ ...form, investment_range_min: e.target.value })} className="input" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Investimento maximo (R$)</label><input type="number" value={form.investment_range_max} onChange={(e) => setForm({ ...form, investment_range_max: e.target.value })} className="input" /></div>
                  </div>
                </>)}
                <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Criando conta...' : 'Criar minha conta'}</button>
              </div>
            )}
          </form>
          <p className="text-center text-gray-500 mt-6 text-sm">Ja tem conta? <Link to="/login" className="text-primary-600 font-semibold hover:text-primary-700">Fazer login</Link></p>
        </div>
      </div>
    </div>
  );
}
