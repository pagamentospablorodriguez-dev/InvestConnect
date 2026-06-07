import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users, Building, Target, Globe, Search, CheckCircle,
  MessageSquare, DollarSign, MapPin,
} from 'lucide-react';
import {
  formatCompactCurrency, formatNumber,
  getInvestorTypeLabel, getInvestorTypeColor, getInvestorTypeBadge,
} from '../lib/utils';
import { FAKE_INVESTORS } from '../data/fakeData';

const typeIcons: Record<string, any> = {
  angel: Users, fund: Building, shark_talent_scout: Target, international: Globe,
};

export default function InvestorsPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const filtered = FAKE_INVESTORS.filter((inv) => {
    const matchSearch = !search ||
      inv.profile?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      inv.company_name?.toLowerCase().includes(search.toLowerCase()) ||
      inv.bio?.toLowerCase().includes(search.toLowerCase());
    const matchType = !typeFilter || inv.investor_type === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Investidores</h1>
        <p className="text-gray-500 mt-1 text-sm">Encontre o investidor ideal para o seu projeto</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome, empresa ou setor..."
            className="input pl-10"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="input w-auto min-w-[180px]"
        >
          <option value="">Todos os tipos</option>
          <option value="angel">Investidor-Anjo</option>
          <option value="fund">Fundo de Investimento</option>
          <option value="shark_talent_scout">Olheiro Shark Tank</option>
          <option value="international">Investidor Internacional</option>
        </select>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((inv, i) => {
          const Icon = typeIcons[inv.investor_type] || Users;
          const color = getInvestorTypeColor(inv.investor_type);
          const badge = getInvestorTypeBadge(inv.investor_type);
          return (
            <motion.div
              key={inv.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card-hover p-6"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="font-bold text-gray-900 truncate">{inv.profile?.full_name}</p>
                    {inv.verified && <CheckCircle className="w-3.5 h-3.5 text-primary-500 flex-shrink-0" />}
                  </div>
                  <span className={`badge ${badge} mt-1`}>{getInvestorTypeLabel(inv.investor_type)}</span>
                </div>
              </div>

              {inv.company_name && (
                <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><Building className="w-3 h-3" /> {inv.company_name}</p>
              )}
              <p className="text-xs text-gray-400 mb-3 flex items-center gap-1"><MapPin className="w-3 h-3" /> {inv.profile?.city}, {inv.profile?.state}</p>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{inv.bio}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Investimentos</span>
                  <span className="font-semibold text-gray-900">{inv.total_investments}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Total investido</span>
                  <span className="font-bold text-emerald-600">{formatCompactCurrency(inv.total_invested)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Range</span>
                  <span className="text-gray-700 font-medium">R$ {formatNumber(inv.investment_range_min)} - {formatCompactCurrency(inv.investment_range_max)}</span>
                </div>
              </div>

              {inv.sectors.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {inv.sectors.slice(0, 3).map((s) => (
                    <span key={s} className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{s}</span>
                  ))}
                  {inv.sectors.length > 3 && (
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-400">+{inv.sectors.length - 3}</span>
                  )}
                </div>
              )}

              <div className="flex gap-2 pt-4 border-t border-gray-50">
                <Link
                  to="/dashboard/mensagens"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-primary-50 text-primary-600 text-sm font-semibold rounded-lg hover:bg-primary-100 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" /> Mensagem
                </Link>
                <Link
                  to="/dashboard/projetos"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-emerald-50 text-emerald-600 text-sm font-semibold rounded-lg hover:bg-emerald-100 transition-colors"
                >
                  <DollarSign className="w-4 h-4" /> Ver Projetos
                </Link>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <Search className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">Nenhum investidor encontrado com esses filtros.</p>
        </div>
      )}
    </div>
  );
}
