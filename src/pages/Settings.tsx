import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import {
  User, Mail, MapPin, Phone, Save, Camera,
  Shield, Bell, Key, Eye, EyeOff,
} from 'lucide-react';
import { BRAZILIAN_STATES } from '../lib/utils';

export default function SettingsPage() {
  const { profile, updateProfile } = useAuth();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    full_name: profile?.full_name || '',
    email: profile?.email || '',
    city: profile?.city || '',
    state: profile?.state || '',
    phone: profile?.phone || '',
    bio: profile?.bio || '',
  });
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications'>('profile');
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await updateProfile({
      full_name: form.full_name,
      city: form.city,
      state: form.state,
      phone: form.phone,
      bio: form.bio,
    });
    toast.success('Perfil atualizado com sucesso!');
    setSaving(false);
  };

  const handleChangePassword = async () => {
    if (!passwordForm.new || !passwordForm.confirm) {
      toast.error('Preencha todos os campos de senha.');
      return;
    }
    if (passwordForm.new.length < 6) {
      toast.error('A nova senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (passwordForm.new !== passwordForm.confirm) {
      toast.error('As senhas nao coincidem.');
      return;
    }
    setChangingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: passwordForm.new });
    if (error) {
      toast.error('Erro ao alterar senha. Verifique sua senha atual.');
    } else {
      toast.success('Senha alterada com sucesso!');
      setPasswordForm({ current: '', new: '', confirm: '' });
    }
    setChangingPassword(false);
  };

  const isEntrepreneur = profile?.user_type === 'entrepreneur';

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Configuracoes</h1>
        <p className="text-gray-500 mt-1 text-sm">Gerencie seu perfil e preferencias</p>
      </div>

      {/* Profile Header */}
      <div className="card p-6">
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-emerald-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              {form.full_name ? form.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : <User className="w-8 h-8" />}
            </div>
            <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 shadow-sm">
              <Camera className="w-4 h-4 text-gray-500" />
            </button>
          </div>
          <div>
            <h2 className="font-bold text-gray-900 text-lg">{form.full_name}</h2>
            <p className="text-sm text-gray-500">{form.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className={`badge ${isEntrepreneur ? 'bg-primary-100 text-primary-700' : 'bg-emerald-100 text-emerald-700'}`}>
                {isEntrepreneur ? 'Empreendedor' : 'Investidor'}
              </span>
              <span className="badge bg-emerald-100 text-emerald-700">
                <Shield className="w-3 h-3 mr-1" /> Verificado
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
        {[
          { key: 'profile' as const, label: 'Perfil', icon: User },
          { key: 'security' as const, label: 'Seguranca', icon: Key },
          { key: 'notifications' as const, label: 'Notificacoes', icon: Bell },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all ${
              activeTab === tab.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'profile' && (
        <div className="card p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome completo</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="input pl-10" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="email" value={form.email} disabled className="input pl-10 bg-gray-50 text-gray-500" />
            </div>
            <p className="text-xs text-gray-400 mt-1">O e-mail nao pode ser alterado</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="input pl-10" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <select value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className="input">
                <option value="">Selecione</option>
                {BRAZILIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="(11) 99999-9999" className="input pl-10" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              placeholder={isEntrepreneur ? 'Conte sobre voce e seus objetivos como empreendedor...' : 'Descreva seu perfil de investimento...'}
              rows={3}
              className="input"
            />
          </div>
          <div className="flex justify-end">
            <button onClick={handleSave} disabled={saving} className="btn-primary">
              <Save className="w-4 h-4" /> {saving ? 'Salvando...' : 'Salvar Alteracoes'}
            </button>
          </div>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="card p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha Atual</label>
            <div className="relative">
              <input type={showCurrent ? 'text' : 'password'} value={passwordForm.current} onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })} placeholder="Digite sua senha atual" className="input pr-10" />
              <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showCurrent ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nova Senha</label>
            <div className="relative">
              <input type={showNew ? 'text' : 'password'} value={passwordForm.new} onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })} placeholder="Digite a nova senha" className="input pr-10" />
              <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Nova Senha</label>
            <input type="password" value={passwordForm.confirm} onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })} placeholder="Digite novamente" className="input" />
          </div>
          {passwordForm.new && passwordForm.confirm && passwordForm.new !== passwordForm.confirm && (
            <p className="text-xs text-red-500">As senhas nao coincidem</p>
          )}
          {passwordForm.new && passwordForm.new.length < 6 && (
            <p className="text-xs text-amber-600">A senha deve ter pelo menos 6 caracteres</p>
          )}
          <div className="flex justify-end">
            <button onClick={handleChangePassword} disabled={changingPassword} className="btn-primary">
              <Key className="w-4 h-4" /> {changingPassword ? 'Alterando...' : 'Alterar Senha'}
            </button>
          </div>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="card p-6 space-y-4">
          {[
            { label: 'Novos lances nos meus projetos', desc: 'Receba notificacao quando um investidor fizer lance' },
            { label: 'Mensagens de investidores', desc: 'Notificacao quando receber uma nova mensagem' },
            { label: 'Atualizacoes de projetos', desc: 'Quando projetos que voce segue forem atualizados' },
            { label: 'Novos investidores na plataforma', desc: 'Saiba quando novos investidores se cadastrarem' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
              <div>
                <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked={i < 3} className="sr-only peer" />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
