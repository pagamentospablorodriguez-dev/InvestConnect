import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import {
  TrendingUp, Package, DollarSign, CheckCircle,
  Plus, Users, Building, Target, Globe, MessageSquare,
  Sparkles, ArrowRight, Shield, Zap,
  Eye, Rocket,
} from 'lucide-react';
import {
  formatCompactCurrency, formatRelativeTime,
  getCategoryLabel, getInvestorTypeLabel,
  getInvestorTypeColor,
} from '../lib/utils';
import {
  FAKE_INVESTORS, FAKE_PROJECTS, FAKE_ACTIVITY, FAKE_FUNDED_DEALS,
  PLATFORM_STATS,
} from '../data/fakeData';

const typeIcons: Record<string, any> = {
  angel: Users, fund: Building, shark_talent_scout: Target, international: Globe,
};

const SIMULATED_EVENTS = [
  { type: 'bid', message: 'Novo lance de R$ 75.000 no projeto Café Orgânico', icon: DollarSign },
  { type: 'view', message: 'Roberto Almeida visualizou seu projeto', icon: Eye },
  { type: 'investor', message: 'Novo investidor verificado: Impact Brasil Fund', icon: Shield },
  { type: 'bid', message: 'Lance de R$ 120.000 recebido no EdTech', icon: DollarSign },
  { type: 'message', message: 'Mariana Costa enviou uma mensagem', icon: MessageSquare },
  { type: 'deal', message: 'Negócio fechado! R$ 90.000 investidos', icon: CheckCircle },
];

export default function DashboardHome() {
  const { profile } = useAuth();
  const isEntrepreneur = profile?.user_type === 'entrepreneur';
  const [projectCount, setProjectCount] = useState<number | null>(null);
  const [bidCount, setBidCount] = useState<number | null>(null);
  const [msgCount, setMsgCount] = useState<number | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [liveActivity, setLiveActivity] = useState<typeof FAKE_ACTIVITY>(FAKE_ACTIVITY.slice(0, 8));

  useEffect(() => {
    if (profile?.id) {
      if (isEntrepreneur) {
        supabase.from('projects').select('id', { count: 'exact', head: true }).eq('entrepreneur_id', profile.id)
          .then(({ count }) => {
            setProjectCount(count ?? 0);
            if (count === 0) setShowOnboarding(true);
          });
        supabase.from('investment_bids').select('id', { count: 'exact', head: true }).eq('status', 'pending')
          .then(({ count }) => setBidCount(count ?? 0));
      } else {
        supabase.from('investment_bids').select('id', { count: 'exact', head: true }).eq('investor_id', profile.id)
          .then(({ count }) => setBidCount(count ?? 0));
      }
      supabase.from('conversations').select('id', { count: 'exact', head: true })
        .or(`participant1_id.eq.${profile.id},participant2_id.eq.${profile.id}`)
        .then(({ count }) => setMsgCount(count ?? 0));
    }
  }, [profile]);

  // Simulated real-time activity
  useEffect(() => {
    if (!isEntrepreneur) return;
    const simulateEvent = () => {
      const event = SIMULATED_EVENTS[Math.floor(Math.random() * SIMULATED_EVENTS.length)];
      toast.custom((t) => (
        <div className={`${t.visible ? 'animate-slide-in-right' : 'animate-slide-out-right'} bg-gray-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 max-w-sm`}>
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
            <event.icon className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-sm font-medium">{event.message}</p>
        </div>
      ), { id: 'sim-event', duration: 4000, position: 'top-right' });
    };
    const timeout = setTimeout(() => {
      simulateEvent();
    }, 8000 + Math.random() * 12000);
    const interval = setInterval(() => {
      simulateEvent();
    }, 25000 + Math.random() * 20000);
    return () => { clearTimeout(timeout); clearInterval(interval); };
  }, [isEntrepreneur]);

  // Simulated new activity items appearing
  useEffect(() => {
    const interval = setInterval(() => {
      const types = ['investment', 'bid', 'new_project', 'new_investor'];
      const type = types[Math.floor(Math.random() * types.length)];
      const names = ['Lucas Ferreira', 'Ana Beatriz', 'Pedro Almeida', 'Juliana Rocha', 'Marcos Dias'];
      const cities = ['São Paulo', 'Rio de Janeiro', 'Curitiba', 'Belo Horizonte', 'Salvador'];
      const amounts = [45000, 80000, 120000, 65000, 95000, 150000, 200000];
      const name = names[Math.floor(Math.random() * names.length)];
      const city = cities[Math.floor(Math.random() * cities.length)];
      const amount = amounts[Math.floor(Math.random() * amounts.length)];

      const titles: Record<string, string> = {
        investment: 'Investimento realizado!',
        bid: 'Novo lance!',
        new_project: 'Novo projeto publicado',
        new_investor: 'Novo investidor verificado',
      };
      const descs: Record<string, string> = {
        investment: `${name} investiu R$ ${amount.toLocaleString('pt-BR')} em um projeto`,
        bid: `${name} fez lance de R$ ${amount.toLocaleString('pt-BR')}`,
        new_project: `${name} lançou projeto buscando R$ ${amount.toLocaleString('pt-BR')}`,
        new_investor: `${name} se juntou à plataforma`,
      };

      const newItem: typeof FAKE_ACTIVITY[0] = {
        id: `live-${Date.now()}`,
        type: type as any,
        title: titles[type],
        description: descs[type],
        amount,
        city,
        category: 'Tecnologia',
        created_at: new Date().toISOString(),
      };
      setLiveActivity(prev => [newItem, ...prev.slice(0, 7)]);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const firstName = profile?.full_name?.split(' ')[0] || '';

  const entrepreneurStats = [
    { label: 'Meus Projetos', value: projectCount ?? '-', icon: Package, color: 'bg-primary-500', href: '/dashboard/projetos', change: '+2 esta semana' },
    { label: 'Lances Recebidos', value: bidCount ?? '-', icon: DollarSign, color: 'bg-emerald-500', href: '/dashboard/lances', change: 'R$ 75k+ pendente' },
    { label: 'Mensagens', value: msgCount ?? '-', icon: MessageSquare, color: 'bg-amber-500', href: '/dashboard/mensagens', change: '3 nao lidas' },
    { label: 'Projetos Financiados', value: FAKE_FUNDED_DEALS.filter(d => d.status === 'completed').length, icon: CheckCircle, color: 'bg-green-500', href: '/dashboard/lances', change: 'R$ 470M total' },
  ];

  const investorStats = [
    { label: 'Projetos Disponiveis', value: FAKE_PROJECTS.length, icon: Package, color: 'bg-primary-500', href: '/dashboard/projetos', change: '+3 novos hoje' },
    { label: 'Meus Lances', value: bidCount ?? '-', icon: DollarSign, color: 'bg-emerald-500', href: '/dashboard/lances', change: '2 pendentes' },
    { label: 'Mensagens', value: msgCount ?? '-', icon: MessageSquare, color: 'bg-amber-500', href: '/dashboard/mensagens', change: '1 nao lida' },
    { label: 'Investidores Ativos', value: PLATFORM_STATS.totalInvestors, icon: Users, color: 'bg-sky-500', href: '/dashboard/investidores', change: '+12 este mes' },
  ];

  const stats = isEntrepreneur ? entrepreneurStats : investorStats;

  const onboardingSteps = [
    { label: 'Criar seu primeiro projeto', icon: Package, href: '/dashboard/projetos/novo', done: projectCount !== null && projectCount > 0 },
    { label: 'Completar seu perfil', icon: Users, href: '/dashboard/configuracoes', done: !!profile?.bio },
    { label: 'Explorar investidores', icon: Building, href: '/dashboard/investidores', done: false },
    { label: 'Enviar mensagem a um investidor', icon: MessageSquare, href: '/dashboard/mensagens', done: false },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-600 via-primary-700 to-emerald-600 p-6 sm:p-8"
      >
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 90% 10%, white, transparent 50%), radial-gradient(circle at 10% 80%, rgba(16,185,129,0.3), transparent 50%)' }} />
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
          <div className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-1.5 border border-white/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-white/80 text-xs font-medium">847 investidores online</span>
          </div>
        </div>
        <div className="relative z-10">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-1">
            Bem-vindo{firstName ? `, ${firstName}` : ''}!
          </h1>
          <p className="text-white/70 text-sm sm:text-base max-w-xl">
            {isEntrepreneur
              ? 'Sua plataforma esta ativa. Investidores estao buscando projetos agora mesmo — crie seu projeto e receba lances em ate 7 dias.'
              : 'Explore projetos e encontre oportunidades de investimento com alto potencial de retorno.'}
          </p>
          {isEntrepreneur && (
            <div className="flex flex-wrap gap-3 mt-5">
              <Link
                to="/dashboard/projetos/novo"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-primary-700 font-semibold rounded-xl hover:bg-gray-50 transition-all text-sm shadow-lg"
              >
                <Plus className="w-4 h-4" /> Criar Novo Projeto
              </Link>
              <Link
                to="/dashboard/investidores"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 border border-white/20 transition-all text-sm"
              >
                <Users className="w-4 h-4" /> Ver Investidores
              </Link>
            </div>
          )}
        </div>
      </motion.div>

      {/* Live Activity Banner */}
      {isEntrepreneur && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-emerald-50 border border-emerald-100 rounded-xl px-5 py-3 flex items-center gap-3 overflow-hidden"
        >
          <div className="flex-shrink-0 flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-semibold text-emerald-700">AO VIVO</span>
          </div>
          <div className="overflow-hidden flex-1">
            <p className="text-sm text-emerald-700 truncate">
              {liveActivity[0]?.title} — {liveActivity[0]?.description} <span className="text-emerald-500">({liveActivity[0]?.city})</span>
            </p>
          </div>
          <span className="text-xs text-emerald-500 flex-shrink-0">{formatRelativeTime(liveActivity[0]?.created_at || new Date().toISOString())}</span>
        </motion.div>
      )}

      {/* Onboarding Checklist */}
      {showOnboarding && isEntrepreneur && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-6 border-primary-200 bg-primary-50/30"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
              <Rocket className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Comece recebendo lances em 7 dias</h3>
              <p className="text-sm text-gray-500">Complete estes passos para maximizar suas chances</p>
            </div>
          </div>
          <div className="space-y-2">
            {onboardingSteps.map((step) => (
              <Link
                key={step.label}
                to={step.href}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-white transition-colors group"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${step.done ? 'bg-emerald-100' : 'bg-gray-100 group-hover:bg-primary-100'}`}>
                  {step.done ? (
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <step.icon className="w-4 h-4 text-gray-400 group-hover:text-primary-600" />
                  )}
                </div>
                <span className={`text-sm font-medium ${step.done ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                  {step.label}
                </span>
                {!step.done && <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary-500 ml-auto" />}
              </Link>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-primary-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-500">Progresso</span>
              <span className="text-xs font-bold text-primary-600">{onboardingSteps.filter(s => s.done).length}/{onboardingSteps.length}</span>
            </div>
            <div className="w-full h-2 bg-primary-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-600 rounded-full transition-all duration-500"
                style={{ width: `${(onboardingSteps.filter(s => s.done).length / onboardingSteps.length) * 100}%` }}
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Link key={stat.label} to={stat.href}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="stat-card hover:shadow-md hover:border-gray-200 transition-all cursor-pointer"
            >
              <div className={`${stat.color} w-10 h-10 rounded-xl flex items-center justify-center mb-3 shadow-lg`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-0.5">{stat.label}</p>
              <p className="text-xs text-emerald-600 mt-1 font-medium">{stat.change}</p>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      {isEntrepreneur && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { to: '/dashboard/projetos/novo', icon: Plus, label: 'Criar Projeto', desc: 'Apresente sua ideia', bg: 'bg-primary-100 group-hover:bg-primary-200', iconColor: 'text-primary-600', border: 'hover:border-primary-200' },
            { to: '/dashboard/investidores', icon: Users, label: 'Investidores', desc: '847+ disponiveis', bg: 'bg-emerald-100 group-hover:bg-emerald-200', iconColor: 'text-emerald-600', border: 'hover:border-emerald-200' },
            { to: '/dashboard/mensagens', icon: MessageSquare, label: 'Mensagens', desc: 'Converse agora', bg: 'bg-amber-100 group-hover:bg-amber-200', iconColor: 'text-amber-600', border: 'hover:border-amber-200' },
            { to: '/dashboard/lances', icon: DollarSign, label: 'Meus Lances', desc: 'Acompanhe ofertas', bg: 'bg-violet-100 group-hover:bg-violet-200', iconColor: 'text-violet-600', border: 'hover:border-violet-200' },
          ].map((action, i) => (
            <motion.div key={action.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.05 }}>
              <Link to={action.to} className={`flex items-center gap-4 p-5 bg-white rounded-xl border border-gray-100 ${action.border} hover:shadow-md transition-all group`}>
                <div className={`w-12 h-12 rounded-xl ${action.bg} flex items-center justify-center transition-colors`}>
                  <action.icon className={`w-6 h-6 ${action.iconColor}`} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{action.label}</p>
                  <p className="text-sm text-gray-500">{action.desc}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}

      {!isEntrepreneur && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { to: '/dashboard/projetos', icon: Package, label: 'Explorar Projetos', desc: '10 oportunidades ativas', bg: 'bg-primary-100 group-hover:bg-primary-200', iconColor: 'text-primary-600', border: 'hover:border-primary-200' },
            { to: '/dashboard/mensagens', icon: MessageSquare, label: 'Mensagens', desc: 'Converse com empreendedores', bg: 'bg-amber-100 group-hover:bg-amber-200', iconColor: 'text-amber-600', border: 'hover:border-amber-200' },
            { to: '/dashboard/lances', icon: DollarSign, label: 'Meus Lances', desc: 'Acompanhe suas ofertas', bg: 'bg-emerald-100 group-hover:bg-emerald-200', iconColor: 'text-emerald-600', border: 'hover:border-emerald-200' },
          ].map((action, i) => (
            <motion.div key={action.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.05 }}>
              <Link to={action.to} className={`flex items-center gap-4 p-5 bg-white rounded-xl border border-gray-100 ${action.border} hover:shadow-md transition-all group`}>
                <div className={`w-12 h-12 rounded-xl ${action.bg} flex items-center justify-center transition-colors`}>
                  <action.icon className={`w-6 h-6 ${action.iconColor}`} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{action.label}</p>
                  <p className="text-sm text-gray-500">{action.desc}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Activity Feed */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-gray-900">Atividade Recente</h2>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
            </div>
            <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">Tempo real</span>
          </div>
          <div className="divide-y divide-gray-50 max-h-[420px] overflow-y-auto">
            {liveActivity.map((item) => (
              <div key={item.id} className="px-5 py-3.5 hover:bg-gray-50/50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    item.type === 'investment' ? 'bg-emerald-100' :
                    item.type === 'bid' ? 'bg-primary-100' :
                    item.type === 'new_project' ? 'bg-amber-100' :
                    'bg-sky-100'
                  }`}>
                    {item.type === 'investment' && <DollarSign className="w-4 h-4 text-emerald-600" />}
                    {item.type === 'bid' && <TrendingUp className="w-4 h-4 text-primary-600" />}
                    {item.type === 'new_project' && <Package className="w-4 h-4 text-amber-600" />}
                    {item.type === 'new_investor' && <Users className="w-4 h-4 text-sky-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{item.title}</p>
                    <p className="text-xs text-gray-500 truncate">{item.description}</p>
                  </div>
                  <span className="text-[11px] text-gray-400 flex-shrink-0">{formatRelativeTime(item.created_at)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Investors / Featured Projects */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-900">
              {isEntrepreneur ? 'Investidores em Destaque' : 'Projetos em Destaque'}
            </h2>
            <Link
              to={isEntrepreneur ? '/dashboard/investidores' : '/dashboard/projetos'}
              className="text-xs text-primary-600 font-semibold hover:text-primary-700"
            >
              Ver todos
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {isEntrepreneur
              ? FAKE_INVESTORS.filter(i => i.featured).slice(0, 6).map((inv) => {
                  const Icon = typeIcons[inv.investor_type] || Users;
                  const color = getInvestorTypeColor(inv.investor_type);
                  return (
                    <Link key={inv.id} to={`/dashboard/investidores/${inv.id}`} className="block px-5 py-3.5 hover:bg-gray-50/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center shadow-sm`}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="text-sm font-semibold text-gray-900 truncate">{inv.profile?.full_name}</p>
                            {inv.verified && <CheckCircle className="w-3 h-3 text-primary-500 flex-shrink-0" />}
                          </div>
                          <p className="text-xs text-gray-500">{getInvestorTypeLabel(inv.investor_type)} · {inv.profile?.city}</p>
                        </div>
                        <span className="text-sm font-bold text-emerald-600">{formatCompactCurrency(inv.total_invested)}</span>
                      </div>
                    </Link>
                  );
                })
              : FAKE_PROJECTS.filter(p => p.featured).slice(0, 6).map((proj) => (
                  <Link key={proj.id} to={`/dashboard/projetos/${proj.id}`} className="block px-5 py-3.5 hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-100 to-emerald-50 flex items-center justify-center">
                        <Package className="w-4 h-4 text-primary-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{proj.title}</p>
                        <p className="text-xs text-gray-500">{getCategoryLabel(proj.category)} · {proj.entrepreneur?.full_name}</p>
                      </div>
                      <span className="text-sm font-bold text-emerald-600">{formatCompactCurrency(proj.asking_amount)}</span>
                    </div>
                  </Link>
                ))
            }
          </div>
        </div>
      </div>

      {/* Platform Stats Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 sm:p-8 relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white, transparent 50%), radial-gradient(circle at 80% 50%, rgba(16,185,129,0.5), transparent 50%)' }} />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <h3 className="text-white font-bold text-lg">Numeros da Plataforma</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              { label: 'Investidores Ativos', value: `${PLATFORM_STATS.totalInvestors}+`, sub: '+12 este mes' },
              { label: 'Total Investido', value: `R$ ${(PLATFORM_STATS.totalInvested / 1000000).toFixed(0)}M+`, sub: 'R$ 2.1M este mes' },
              { label: 'Negocios Financiados', value: `${PLATFORM_STATS.totalDeals}+`, sub: '+5 esta semana' },
              { label: 'Taxa de Sucesso', value: `${PLATFORM_STATS.successRate}%`, sub: 'Acima da media' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl sm:text-3xl font-bold text-white">{s.value}</p>
                <p className="text-gray-400 text-sm mt-1">{s.label}</p>
                <p className="text-emerald-400 text-xs mt-0.5">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Guarantee Banner */}
      {isEntrepreneur && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-primary-50 to-emerald-50 border border-primary-100 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center gap-4"
        >
          <div className="w-14 h-14 rounded-2xl bg-primary-100 flex items-center justify-center flex-shrink-0">
            <Shield className="w-7 h-7 text-primary-600" />
          </div>
          <div className="text-center sm:text-left flex-1">
            <h3 className="font-bold text-gray-900 text-lg">Garantia incondicional de 7 dias</h3>
            <p className="text-gray-500 text-sm mt-1">Se voce nao estiver satisfeito com a plataforma nos primeiros 7 dias, devolvemos 100% do seu investimento. Sem perguntas.</p>
          </div>
          <Link to="/dashboard/projetos/novo" className="btn-primary flex-shrink-0">
            <Rocket className="w-4 h-4" /> Comecar Agora
          </Link>
        </motion.div>
      )}
    </div>
  );
}
