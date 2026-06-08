import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import {
  Plus, Search, Eye, ArrowLeft, Send, X,
  Package, Coffee, Briefcase, Heart, GraduationCap,
  Shirt, Building2, Leaf, Film, Landmark, Truck,
  Wrench, DollarSign, CheckCircle, MessageSquare,
  TrendingUp, BarChart3, Users, ArrowRight,
  FileText, Shield, Zap,
} from 'lucide-react';
import {
  formatCurrency, formatCompactCurrency, formatRelativeTime,
  getInitials, getCategoryLabel, generateSlug,
} from '../lib/utils';
import { Project, InvestmentBid } from '../types';
import { FAKE_PROJECTS, FAKE_INVESTORS } from '../data/fakeData';

const catIcons: Record<string, any> = {
  food_beverage: Coffee, technology: Briefcase, healthcare: Heart,
  education: GraduationCap, fashion: Shirt, services: Wrench,
  retail: Package, real_estate: Building2, agriculture: Leaf,
  entertainment: Film, finance: Landmark, logistics: Truck,
};

const catGradients: Record<string, string> = {
  food_beverage: 'from-orange-500 to-amber-600',
  technology: 'from-blue-500 to-indigo-600',
  healthcare: 'from-rose-500 to-pink-600',
  education: 'from-violet-500 to-purple-600',
  fashion: 'from-fuchsia-500 to-pink-600',
  services: 'from-teal-500 to-cyan-600',
  retail: 'from-emerald-500 to-green-600',
  real_estate: 'from-slate-500 to-gray-600',
  agriculture: 'from-lime-500 to-green-600',
  entertainment: 'from-red-500 to-orange-600',
  finance: 'from-sky-500 to-blue-600',
  logistics: 'from-indigo-500 to-violet-600',
};

// Milestone badges for projects
function ProjectMilestones({ project }: { project: Project }) {
  const milestones = [];
  if (project.views > 100) milestones.push({ label: 'Popular', color: 'bg-blue-100 text-blue-700' });
  if ((project.bidCount || 0) >= 3) milestones.push({ label: 'Quente', color: 'bg-red-100 text-red-700' });
  if (project.featured) milestones.push({ label: 'Destaque', color: 'bg-amber-100 text-amber-700' });
  if (project.equity_offered && project.equity_offered <= 12) milestones.push({ label: 'Valuation Alto', color: 'bg-emerald-100 text-emerald-700' });

  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {milestones.map(m => (
        <span key={m.label} className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${m.color}`}>{m.label}</span>
      ))}
    </div>
  );
}

export function ProjectsPage() {
  const { profile } = useAuth();
  const isEntrepreneur = profile?.user_type === 'entrepreneur';
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [myProjects, setMyProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isEntrepreneur && profile?.id) {
      supabase
        .from('projects')
        .select('*')
        .eq('entrepreneur_id', profile.id)
        .order('created_at', { ascending: false })
        .then(({ data }) => {
          setMyProjects(data || []);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [profile, isEntrepreneur]);

  const displayProjects = isEntrepreneur
    ? myProjects
    : FAKE_PROJECTS
        .filter(p => {
          const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.short_description.toLowerCase().includes(search.toLowerCase());
          const matchCat = !categoryFilter || p.category === categoryFilter;
          return matchSearch && matchCat;
        })
        .sort((a, b) => {
          if (sortBy === 'featured') return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
          if (sortBy === 'amount_high') return b.asking_amount - a.asking_amount;
          if (sortBy === 'amount_low') return a.asking_amount - b.asking_amount;
          if (sortBy === 'bids') return (b.bidCount || 0) - (a.bidCount || 0);
          return 0;
        });

  const categories = [...new Set(FAKE_PROJECTS.map(p => p.category))];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">
            {isEntrepreneur ? 'Meus Projetos' : 'Projetos Disponiveis'}
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            {isEntrepreneur ? 'Gerencie seus projetos e receba lances' : `${FAKE_PROJECTS.length} oportunidades verificadas buscando investimento`}
          </p>
        </div>
        {isEntrepreneur && (
          <Link to="/dashboard/projetos/novo" className="btn-primary text-sm">
            <Plus className="w-4 h-4" /> Novo Projeto
          </Link>
        )}
      </div>

      {/* Platform trust bar */}
      {!isEntrepreneur && (
        <div className="flex items-center gap-6 bg-emerald-50 rounded-xl px-5 py-3 border border-emerald-100">
          <div className="flex items-center gap-2 text-sm"><Shield className="w-4 h-4 text-emerald-600" /><span className="text-emerald-700 font-medium">Due diligence verificada</span></div>
          <div className="flex items-center gap-2 text-sm"><FileText className="w-4 h-4 text-emerald-600" /><span className="text-emerald-700 font-medium">Contratos formais</span></div>
          <div className="flex items-center gap-2 text-sm"><CheckCircle className="w-4 h-4 text-emerald-600" /><span className="text-emerald-700 font-medium">892+ negocios financiados</span></div>
        </div>
      )}

      {!isEntrepreneur && (
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar projetos por nome ou descricao..." className="input pl-10" />
          </div>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="input w-auto min-w-[160px]">
            <option value="">Todas categorias</option>
            {categories.map(c => <option key={c} value={c}>{getCategoryLabel(c)}</option>)}
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="input w-auto min-w-[140px]">
            <option value="featured">Destaques</option>
            <option value="bids">Mais lances</option>
            <option value="amount_high">Maior valor</option>
            <option value="amount_low">Menor valor</option>
          </select>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12"><div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" /></div>
      ) : displayProjects.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4"><Package className="w-8 h-8 text-gray-400" /></div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">{isEntrepreneur ? 'Nenhum projeto ainda' : 'Nenhum projeto encontrado'}</h3>
          <p className="text-gray-500 mb-6 text-sm">{isEntrepreneur ? 'Crie seu primeiro projeto para comecar a receber lances de investimento.' : 'Tente ajustar os filtros de busca.'}</p>
          {isEntrepreneur && <Link to="/dashboard/projetos/novo" className="btn-primary"><Plus className="w-5 h-5" /> Criar Projeto</Link>}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayProjects.map((proj, i) => {
            const Icon = catIcons[proj.category] || Package;
            const gradient = catGradients[proj.category] || 'from-primary-500 to-emerald-600';
            const statusColors: Record<string, string> = { active: 'bg-emerald-100 text-emerald-700', funded: 'bg-primary-100 text-primary-700', draft: 'bg-gray-100 text-gray-600', closed: 'bg-red-100 text-red-600' };
            const statusLabels: Record<string, string> = { active: 'Ativo', funded: 'Financiado', draft: 'Rascunho', closed: 'Encerrado' };
            return (
              <motion.div key={proj.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card-hover group">
                {/* Gradient top bar */}
                <div className={`h-2 bg-gradient-to-r ${gradient}`} />
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-100 to-emerald-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-primary-600" />
                    </div>
                    <span className={`badge ${statusColors[proj.status] || statusColors.active}`}>{statusLabels[proj.status] || 'Ativo'}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1.5">{proj.title}</h3>
                  <p className="text-gray-500 text-sm mb-3 line-clamp-2">{proj.short_description}</p>

                  <ProjectMilestones project={proj} />

                  {proj.entrepreneur && (
                    <div className="flex items-center gap-2 mt-3">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-500 to-emerald-500 flex items-center justify-center text-white text-[10px] font-bold">{getInitials(proj.entrepreneur.full_name)}</div>
                      <span className="text-xs text-gray-500">{proj.entrepreneur.full_name}</span>
                      <span className="text-xs text-gray-400">· {proj.entrepreneur.city}, {proj.entrepreneur.state}</span>
                    </div>
                  )}

                  {/* Financial highlights */}
                  <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-gray-50">
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider">Busca</p>
                      <p className="font-bold text-emerald-600 text-sm">{formatCompactCurrency(proj.asking_amount)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider">Equity</p>
                      <p className="font-semibold text-gray-700 text-sm">{proj.equity_offered}%</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider">Lances</p>
                      <p className="font-semibold text-gray-700 text-sm flex items-center justify-end gap-1"><DollarSign className="w-3 h-3" />{proj.bidCount || 0}</p>
                    </div>
                  </div>
                </div>
                <Link to={`/dashboard/projetos/${proj.id}`} className="flex items-center justify-center gap-2 px-6 py-3 border-t border-gray-100 text-sm font-semibold text-primary-600 hover:bg-primary-50 transition-colors">
                  Ver Detalhes <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [showBidModal, setShowBidModal] = useState(false);
  const [bidAmount, setBidAmount] = useState('');
  const [bidEquity, setBidEquity] = useState('');
  const [bidMessage, setBidMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'financials' | 'bids' | 'docs'>('overview');
  const [realProject, setRealProject] = useState<Project | null>(null);
  const [bids, setBids] = useState<InvestmentBid[]>([]);
  const [fakeBidStatuses, setFakeBidStatuses] = useState<Record<string, string>>({});

  const isEntrepreneur = profile?.user_type === 'entrepreneur';

  useEffect(() => {
    if (id && profile?.id) {
      supabase.from('projects').select('*').eq('id', id).single()
        .then(({ data }) => {
          if (data) {
            setRealProject(data);
            supabase.from('investment_bids').select('*').eq('project_id', id).order('created_at', { ascending: false })
              .then(({ data: bidsData }) => setBids(bidsData || []));
          }
        });
    }
  }, [id, profile]);

  const project = realProject || FAKE_PROJECTS.find(p => p.id === id);
  if (!project) return <div className="text-center py-12"><p className="text-gray-500">Projeto nao encontrado</p></div>;

  const Icon = catIcons[project.category] || Package;
  const gradient = catGradients[project.category] || 'from-primary-500 to-emerald-600';

  const handleBidSubmit = async () => {
    if (!profile || !bidAmount) return;
    setSubmitting(true);
    const { error } = await supabase.from('investment_bids').insert({
      project_id: project.id, investor_id: profile.id,
      amount: parseInt(bidAmount), equity_requested: bidEquity ? parseFloat(bidEquity) : null,
      message: bidMessage, status: 'pending',
    });
    if (error) { toast.error('Erro ao enviar lance'); setSubmitting(false); return; }
    toast.success('Lance enviado! O empreendedor sera notificado em instantes.');
    setShowBidModal(false); setBidAmount(''); setBidEquity(''); setBidMessage('');
    setSubmitting(false);
  };

  const fakeBids = FAKE_INVESTORS.slice(0, 3).map((inv, i) => ({
    id: `fb-${i}`, project_id: project.id, investor_id: inv.profile_id,
    amount: Math.round(project.asking_amount * (0.75 + i * 0.15)),
    equity_requested: project.equity_offered ? +(project.equity_offered - 1 + i * 1.5).toFixed(1) : undefined,
    message: ['Projeto excepcional! Minha experiencia no setor pode acelerar o growth. Vamos agendar uma call?', 'Vi metricas muito positivas. Tenho interesse em participar com valor acima do pedido.', 'Perfil de investimento muito alinhado. Posso agregar com network e mentoria ativa.'][i],
    status: 'pending' as const, created_at: new Date(Date.now() - (i + 1) * 43200000).toISOString(), investor: inv.profile,
  }));

  const allBids = [...fakeBids.map(fb => ({ ...fb, status: (fakeBidStatuses[fb.id] || fb.status) as any })), ...bids];
  const highestBid = Math.max(...allBids.map(b => b.amount), 0);

  // Simulated financial metrics
  const financials = {
    revenue: Math.round(project.asking_amount * 0.4),
    growth: Math.round(15 + Math.random() * 45),
    customers: Math.round(100 + Math.random() * 4000),
    margin: Math.round(20 + Math.random() * 40),
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <button onClick={() => navigate(-1)} className="btn-ghost"><ArrowLeft className="w-4 h-4" /> Voltar</button>

      <div className="card overflow-hidden">
        <div className={`bg-gradient-to-r ${gradient} p-6 sm:p-8 text-white relative`}>
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, white, transparent 50%)' }} />
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center"><Icon className="w-6 h-6" /></div>
                  <span className="badge bg-white/20 text-white">{getCategoryLabel(project.category).toUpperCase()}</span>
                  {project.featured && <span className="badge bg-amber-400/30 text-white"><Zap className="w-3 h-3 mr-1" />DESTAQUE</span>}
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">{project.title}</h1>
                <p className="text-white/80">{project.short_description}</p>
              </div>
              <div className="sm:text-right">
                <p className="text-white/60 text-sm">Valor solicitado</p>
                <p className="text-3xl sm:text-4xl font-extrabold">{formatCurrency(project.asking_amount)}</p>
                {project.equity_offered && <p className="text-white/80 mt-1 font-medium">{project.equity_offered}% equity oferecida</p>}
                {highestBid > 0 && <p className="text-amber-300 text-sm mt-2">Maior lance: {formatCurrency(highestBid)}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-4 gap-0 border-b border-gray-100">
          {[
            { icon: Eye, label: 'Views', value: project.views },
            { icon: DollarSign, label: 'Lances', value: allBids.length },
            { icon: TrendingUp, label: 'Crescimento', value: `${financials.growth}%` },
            { icon: Users, label: 'Clientes', value: financials.customers.toLocaleString() },
          ].map((s, i) => (
            <div key={s.label} className={`py-4 text-center ${i < 3 ? 'border-r border-gray-100' : ''}`}>
              <s.icon className="w-4 h-4 mx-auto text-gray-400 mb-1" />
              <p className="text-lg font-bold text-gray-900">{s.value}</p>
              <p className="text-[11px] text-gray-400 uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          {[
            { key: 'overview' as const, label: 'Visao Geral' },
            { key: 'financials' as const, label: 'Financeiro' },
            { key: 'bids' as const, label: `Lances (${allBids.length})` },
            { key: 'docs' as const, label: 'Documentos' },
          ].map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-3 text-sm font-semibold transition-colors ${activeTab === tab.key ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6 sm:p-8">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {project.full_description && (
                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-3">Sobre o Projeto</h3>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">{project.full_description}</p>
                </div>
              )}
              <div className="grid sm:grid-cols-2 gap-4">
                {project.business_model && <div className="bg-gray-50 rounded-xl p-5"><h4 className="font-semibold text-gray-900 text-sm mb-2">Modelo de Negocio</h4><p className="text-sm text-gray-600">{project.business_model}</p></div>}
                {project.target_market && <div className="bg-gray-50 rounded-xl p-5"><h4 className="font-semibold text-gray-900 text-sm mb-2">Mercado-Alvo</h4><p className="text-sm text-gray-600">{project.target_market}</p></div>}
                {project.competitive_advantage && <div className="bg-gray-50 rounded-xl p-5"><h4 className="font-semibold text-gray-900 text-sm mb-2">Vantagem Competitiva</h4><p className="text-sm text-gray-600">{project.competitive_advantage}</p></div>}
                {project.use_of_funds && <div className="bg-gray-50 rounded-xl p-5"><h4 className="font-semibold text-gray-900 text-sm mb-2">Uso dos Recursos</h4><p className="text-sm text-gray-600">{project.use_of_funds}</p></div>}
              </div>
              {project.entrepreneur && (
                <div className="border-t border-gray-100 pt-6">
                  <h3 className="font-bold text-gray-900 text-lg mb-4">Sobre o Empreendedor</h3>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-emerald-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">{getInitials(project.entrepreneur.full_name)}</div>
                    <div>
                      <p className="font-semibold text-gray-900">{project.entrepreneur.full_name}</p>
                      <p className="text-sm text-gray-500">{project.entrepreneur.city}, {project.entrepreneur.state}</p>
                    </div>
                    <Link to="/dashboard/mensagens" className="ml-auto btn-secondary text-sm py-2 px-4"><MessageSquare className="w-4 h-4" /> Enviar Mensagem</Link>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'financials' && (
            <div className="space-y-6">
              <div className="grid sm:grid-cols-4 gap-4">
                {[
                  { label: 'Receita Mensal', value: formatCurrency(financials.revenue), icon: DollarSign, color: 'text-emerald-600' },
                  { label: 'Crescimento MoM', value: `${financials.growth}%`, icon: TrendingUp, color: 'text-blue-600' },
                  { label: 'Margem Bruta', value: `${financials.margin}%`, icon: BarChart3, color: 'text-violet-600' },
                  { label: 'Clientes Ativos', value: financials.customers.toLocaleString(), icon: Users, color: 'text-primary-600' },
                ].map((m) => (
                  <div key={m.label} className="bg-gray-50 rounded-xl p-4 text-center">
                    <m.icon className={`w-5 h-5 mx-auto ${m.color} mb-2`} />
                    <p className={`text-xl font-bold ${m.color}`}>{m.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{m.label}</p>
                  </div>
                ))}
              </div>
              <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-100">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-emerald-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-emerald-800 text-sm">Dados financeiros verificados</p>
                    <p className="text-xs text-emerald-600 mt-1">Todas as metricas financeiras foram verificadas pelo time de due diligence da InvestConnectBR.</p>
                  </div>
                </div>
              </div>
              {project.equity_offered && (
                <div className="bg-gray-50 rounded-xl p-5">
                  <h4 className="font-semibold text-gray-900 text-sm mb-3">Estrutura do Investimento</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm"><span className="text-gray-500">Valor solicitado</span><span className="font-semibold">{formatCurrency(project.asking_amount)}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-500">Equity oferecida</span><span className="font-semibold">{project.equity_offered}%</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-500">Valuation implicito</span><span className="font-semibold">{formatCurrency(Math.round(project.asking_amount / (project.equity_offered / 100)))}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-500">Investimento minimo</span><span className="font-semibold">{formatCurrency(Math.round(project.asking_amount * 0.1))}</span></div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'bids' && (
            <div className="space-y-3">
              {allBids.length === 0 ? (
                <div className="text-center py-8"><DollarSign className="w-12 h-12 mx-auto text-gray-300 mb-3" /><p className="text-gray-500 text-sm">Nenhum lance ainda. Os investidores vao aparecer!</p></div>
              ) : allBids.map((bid) => (
                <div key={bid.id} className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100/80 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-emerald-500 flex items-center justify-center text-white text-sm font-bold">{bid.investor ? getInitials(bid.investor.full_name) : 'I'}</div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="font-semibold text-gray-900 text-sm">{bid.investor?.full_name || 'Investidor'}</p>
                          <CheckCircle className="w-3.5 h-3.5 text-primary-500" />
                        </div>
                        <p className="text-xs text-gray-500">{formatRelativeTime(bid.created_at)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-emerald-600">{formatCurrency(bid.amount)}</p>
                      {bid.equity_requested && <p className="text-xs text-gray-500">{Number(bid.equity_requested).toFixed(1)}% equity</p>}
                    </div>
                  </div>
                  {bid.message && <p className="text-sm text-gray-600 mt-3 pl-13">{bid.message}</p>}
                  {isEntrepreneur && bid.status === 'pending' && (
                    <div className="flex gap-2 mt-3 pl-13">
                      <button onClick={() => { setFakeBidStatuses(prev => ({ ...prev, [bid.id]: 'accepted' })); toast.success('Lance aceito!'); }} className="px-4 py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition-colors">Aceitar Lance</button>
                      <button onClick={() => { setFakeBidStatuses(prev => ({ ...prev, [bid.id]: 'counter' })); toast.success('Contra-proposta enviada!'); }} className="px-4 py-1.5 bg-primary-100 text-primary-700 text-xs font-semibold rounded-lg hover:bg-primary-200 transition-colors">Contra-Propor</button>
                      <button onClick={() => { setFakeBidStatuses(prev => ({ ...prev, [bid.id]: 'rejected' })); toast.success('Lance recusado.'); }} className="px-4 py-1.5 bg-gray-200 text-gray-600 text-xs font-semibold rounded-lg hover:bg-gray-300 transition-colors">Recusar</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'docs' && (
            <div className="space-y-3">
              <div className="bg-amber-50 rounded-xl p-4 border border-amber-100 flex items-start gap-3">
                <Shield className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-amber-800 text-sm">Documentos verificados pela InvestConnectBR</p>
                  <p className="text-xs text-amber-600 mt-1">Todo investidor recebe acesso apos due diligence completa.</p>
                </div>
              </div>
              {['Contrato Social', 'Balanco Financeiro 2024', 'Declaracao de IR', 'Certificado de Registro', 'Pitch Deck (PDF)'].map((doc) => (
                <div key={doc} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{doc}</p>
                      <p className="text-xs text-gray-400">Verificado</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <button className="text-xs text-primary-600 font-semibold hover:text-primary-700">Acessar</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {!isEntrepreneur && (
        <button onClick={() => setShowBidModal(true)} className="btn-primary w-full text-lg py-4 shadow-xl">
          <DollarSign className="w-5 h-5" /> Fazer Lance de Investimento
        </button>
      )}

      <AnimatePresence>
        {showBidModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-xl font-bold text-gray-900">Fazer Lance</h3>
                <button onClick={() => setShowBidModal(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-500" /></button>
              </div>
              <div className="bg-primary-50 rounded-xl p-4 mb-5">
                <p className="font-semibold text-gray-900 text-sm">{project.title}</p>
                <p className="text-sm text-gray-600 mt-1">Busca {formatCurrency(project.asking_amount)} por {project.equity_offered}% equity</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valor do Lance (R$) *</label>
                  <input type="number" value={bidAmount} onChange={(e) => setBidAmount(e.target.value)} placeholder="100000" className="input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Equidade Solicitada (%)</label>
                  <input type="number" step="0.1" value={bidEquity} onChange={(e) => setBidEquity(e.target.value)} placeholder="10" className="input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mensagem</label>
                  <textarea value={bidMessage} onChange={(e) => setBidMessage(e.target.value)} placeholder="Conte por que voce quer investir e como pode agregar..." rows={4} className="input" />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowBidModal(false)} className="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors">Cancelar</button>
                <button onClick={handleBidSubmit} disabled={submitting || !bidAmount} className="flex-1 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 disabled:opacity-50 transition-colors">
                  {submitting ? 'Enviando...' : <><Send className="w-4 h-4 inline mr-2" />Enviar Lance</>}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function NewProjectPage() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '', category: '', asking_amount: '', equity_offered: '',
    short_description: '', full_description: '',
    business_model: '', target_market: '', competitive_advantage: '', use_of_funds: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) { setStep(step + 1); return; }
    setLoading(true);
    const slug = generateSlug(form.title);
    const { error } = await supabase.from('projects').insert({
      entrepreneur_id: profile?.id, title: form.title, slug, category: form.category,
      asking_amount: parseInt(form.asking_amount), equity_offered: form.equity_offered ? parseFloat(form.equity_offered) : null,
      short_description: form.short_description, full_description: form.full_description,
      business_model: form.business_model || null, target_market: form.target_market || null,
      competitive_advantage: form.competitive_advantage || null, use_of_funds: form.use_of_funds || null,
      status: 'active', views: Math.floor(Math.random() * 20), featured: false,
    });
    if (error) { toast.error('Erro ao criar projeto'); setLoading(false); return; }
    toast.success('Projeto publicado! Investidores ja podem ver e fazer lances.');
    navigate('/dashboard/projetos');
  };

  const stepLabels = ['Basico', 'Descricao', 'Detalhes'];

  return (
    <div className="max-w-2xl mx-auto">
      <button onClick={() => navigate(-1)} className="btn-ghost mb-6"><ArrowLeft className="w-4 h-4" /> Voltar</button>
      <div className="card overflow-hidden">
        <div className="p-6 bg-gray-50 border-b border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-500">Passo {step} de 3 - {stepLabels[step - 1]}</span>
            <span className="text-sm font-bold text-primary-600">{Math.round((step / 3) * 100)}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden"><div className="h-full bg-primary-600 rounded-full transition-all duration-300" style={{ width: `${(step / 3) * 100}%` }} /></div>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {step === 1 && (
            <div className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Nome do Projeto *</label><input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Ex: Cafe Especial Boutique" required className="input" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Categoria *</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required className="input">
                  <option value="">Selecione</option>
                  <option value="food_beverage">Alimentacao</option><option value="technology">Tecnologia</option><option value="healthcare">Saude</option>
                  <option value="education">Educacao</option><option value="fashion">Moda</option><option value="retail">Varejo</option>
                  <option value="services">Servicos</option><option value="real_estate">Imobiliario</option><option value="agriculture">Agronegocio</option>
                  <option value="entertainment">Entretenimento</option><option value="finance">Financas</option><option value="logistics">Logistica</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Valor (R$) *</label><input type="number" value={form.asking_amount} onChange={(e) => setForm({ ...form, asking_amount: e.target.value })} placeholder="100000" required className="input" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Equity (%)</label><input type="number" step="0.1" value={form.equity_offered} onChange={(e) => setForm({ ...form, equity_offered: e.target.value })} placeholder="10" className="input" /></div>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Descricao Curta *</label><textarea value={form.short_description} onChange={(e) => setForm({ ...form, short_description: e.target.value })} placeholder="Uma frase que resuma seu negocio" required rows={2} maxLength={150} className="input" /><p className="text-xs text-gray-400 mt-1">{form.short_description.length}/150</p></div>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-4">
              <button type="button" onClick={() => setStep(1)} className="btn-ghost text-xs"><ArrowLeft className="w-3 h-3" /> Voltar</button>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Descricao Completa *</label><textarea value={form.full_description} onChange={(e) => setForm({ ...form, full_description: e.target.value })} placeholder="Descreva seu negocio em detalhes..." required rows={6} className="input" /></div>
            </div>
          )}
          {step === 3 && (
            <div className="space-y-4">
              <button type="button" onClick={() => setStep(2)} className="btn-ghost text-xs"><ArrowLeft className="w-3 h-3" /> Voltar</button>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Modelo de Negocio</label><input type="text" value={form.business_model} onChange={(e) => setForm({ ...form, business_model: e.target.value })} placeholder="Ex: SaaS B2B, Marketplace..." className="input" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Mercado-Alvo</label><input type="text" value={form.target_market} onChange={(e) => setForm({ ...form, target_market: e.target.value })} placeholder="Ex: Mulheres 25-45 anos" className="input" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Vantagem Competitiva</label><textarea value={form.competitive_advantage} onChange={(e) => setForm({ ...form, competitive_advantage: e.target.value })} placeholder="O que torna seu negocio unico?" rows={2} className="input" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Uso dos Recursos</label><textarea value={form.use_of_funds} onChange={(e) => setForm({ ...form, use_of_funds: e.target.value })} placeholder="Como vai usar o investimento?" rows={2} className="input" /></div>
              <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                <div className="flex items-start gap-2"><CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" /><div><p className="text-sm font-semibold text-emerald-800">Projetos completos recebem 3x mais lances</p><p className="text-xs text-emerald-600 mt-1">Investidores preferem projetos com informacoes detalhadas!</p></div></div>
              </div>
            </div>
          )}
          <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Publicando...' : step === 3 ? 'Publicar Projeto' : 'Continuar'}</button>
        </form>
      </div>
    </div>
  );
}
