import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Users, Building, Target, Globe, CheckCircle,
  MessageSquare, DollarSign, MapPin, Briefcase,
  Shield, Clock, TrendingUp, Award, Star,
} from 'lucide-react';
import {
  formatCompactCurrency, formatCurrency,
  getInvestorTypeLabel, getInvestorTypeColor,
} from '../lib/utils';
import { FAKE_INVESTORS, FAKE_PROJECTS, FAKE_FUNDED_DEALS } from '../data/fakeData';

const typeIcons: Record<string, any> = {
  angel: Users, fund: Building, shark_talent_scout: Target, international: Globe,
};

export default function InvestorDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const investor = FAKE_INVESTORS.find(i => i.id === id);

  if (!investor) {
    return (
      <div className="max-w-3xl mx-auto text-center py-12">
        <Users className="w-16 h-16 mx-auto text-gray-200 mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Investidor nao encontrado</h2>
        <p className="text-gray-500 mb-6">Verifique o link e tente novamente.</p>
        <Link to="/dashboard/investidores" className="btn-primary">Ver Investidores</Link>
      </div>
    );
  }

  const Icon = typeIcons[investor.investor_type] || Users;
  const color = getInvestorTypeColor(investor.investor_type);

  // Simulated investment history
  const dealHistory = FAKE_FUNDED_DEALS.filter(d => d.investor_id === investor.id || d.investor?.full_name === investor.profile?.full_name);
  const recentProjects = FAKE_PROJECTS.slice(0, 3);

  // Simulated stats
  const avgDealSize = Math.round(investor.total_invested / investor.total_investments);
  const successRate = Math.round(85 + Math.random() * 15);
  const responseTime = investor.investor_type === 'fund' ? '2-5 dias' : investor.investor_type === 'international' ? '3-7 dias' : '1-3 dias';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button onClick={() => navigate(-1)} className="btn-ghost"><ArrowLeft className="w-4 h-4" /> Voltar</button>

      {/* Profile Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card overflow-hidden">
        <div className={`bg-gradient-to-r ${color} p-8 text-white relative`}>
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, white, transparent 50%)' }} />
          <div className="relative z-10 flex flex-col sm:flex-row items-start gap-5">
            <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-xl">
              <Icon className="w-10 h-10" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl sm:text-3xl font-extrabold">{investor.profile?.full_name}</h1>
                {investor.verified && <CheckCircle className="w-5 h-5 text-white/80" />}
              </div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold">
                  {getInvestorTypeLabel(investor.investor_type)}
                </span>
                {investor.company_name && (
                  <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5" /> {investor.company_name}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 text-white/80 text-sm">
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {investor.profile?.city}, {investor.profile?.state}</span>
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> Responde em {responseTime}</span>
              </div>
            </div>
            <div className="sm:text-right">
              <p className="text-white/60 text-sm">Total investido</p>
              <p className="text-3xl sm:text-4xl font-extrabold">{formatCompactCurrency(investor.total_invested)}</p>
              <p className="text-white/80 text-sm mt-1">{investor.total_investments} investimentos realizados</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-0 border-b border-gray-100">
          {[
            { icon: DollarSign, label: 'Investimentos', value: investor.total_investments, color: 'text-emerald-600' },
            { icon: TrendingUp, label: 'Taxa de Sucesso', value: `${successRate}%`, color: 'text-primary-600' },
            { icon: Award, label: 'Ticket Medio', value: formatCompactCurrency(avgDealSize), color: 'text-amber-600' },
            { icon: Star, label: 'Rating', value: '4.9/5', color: 'text-violet-600' },
          ].map((s, idx) => (
            <div key={s.label} className={`py-4 text-center ${idx < 3 ? 'border-r border-gray-100' : ''}`}>
              <s.icon className={`w-5 h-5 mx-auto ${s.color} mb-1`} />
              <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
              <p className="text-[11px] text-gray-400 uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Bio */}
        <div className="p-6">
          <h3 className="font-bold text-gray-900 text-lg mb-3">Sobre</h3>
          <p className="text-gray-600 leading-relaxed">{investor.bio}</p>
        </div>
      </motion.div>

      {/* Investment Details */}
      <div className="grid sm:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-6">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-600" /> Faixa de Investimento
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <span className="text-sm text-gray-500">Minimo</span>
              <span className="font-bold text-gray-900">{formatCurrency(investor.investment_range_min)}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl">
              <span className="text-sm text-emerald-600">Maximo</span>
              <span className="font-bold text-emerald-700">{formatCurrency(investor.investment_range_max)}</span>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card p-6">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-primary-600" /> Setores de Interesse
          </h3>
          <div className="flex flex-wrap gap-2">
            {investor.sectors.map((sector) => (
              <span key={sector} className="px-3 py-1.5 bg-primary-50 text-primary-700 text-sm font-medium rounded-lg">
                {sector}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Credentials & Trust */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-6">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-emerald-600" /> Verificacoes e Credenciais
        </h3>
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { label: 'Identidade verificada', desc: 'Documento de identidade validado', done: true },
            { label: 'Historico financeiro', desc: 'Comprovacao de capacidade de investimento', done: true },
            { label: 'Referencias verificadas', desc: '3+ referencias de empreendedores', done: true },
            { label: 'Antecedentes criminais', desc: 'Certidao negativa verificada', done: true },
            { label: 'Acordos assinados', desc: 'Termos de uso e confidencialidade', done: true },
            { label: 'Perfil completo', desc: '100% do perfil preenchido', done: true },
          ].map((cred) => (
            <div key={cred.label} className="flex items-start gap-2 p-3 bg-emerald-50/50 rounded-lg">
              <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900">{cred.label}</p>
                <p className="text-xs text-gray-500">{cred.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Recent Deals */}
      {(dealHistory.length > 0) && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="card p-6">
          <h3 className="font-bold text-gray-900 mb-4">Investimentos Realizados</h3>
          <div className="space-y-3">
            {dealHistory.map((deal) => (
              <div key={deal.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm">{deal.project?.title}</p>
                  <p className="text-xs text-gray-500">{deal.project?.entrepreneur?.full_name} · {deal.equity_percentage}% equity</p>
                </div>
                <span className="font-bold text-emerald-600">{formatCurrency(deal.amount)}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Projects This Investor Might Like */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card p-6">
        <h3 className="font-bold text-gray-900 mb-4">Projetos Recentes na Plataforma</h3>
        <div className="space-y-3">
          {recentProjects.map((proj) => (
            <Link key={proj.id} to={`/dashboard/projetos/${proj.id}`} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-primary-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm">{proj.title}</p>
                <p className="text-xs text-gray-500">{proj.entrepreneur?.full_name} · {proj.category}</p>
              </div>
              <span className="font-bold text-emerald-600">{formatCompactCurrency(proj.asking_amount)}</span>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          to="/dashboard/mensagens"
          className="flex-1 btn-primary text-center py-3"
        >
          <MessageSquare className="w-4 h-4 inline mr-2" /> Enviar Mensagem
        </Link>
        <Link
          to="/dashboard/investidores"
          className="flex-1 btn-secondary text-center py-3"
        >
          Ver Todos os Investidores
        </Link>
      </div>
    </div>
  );
}
