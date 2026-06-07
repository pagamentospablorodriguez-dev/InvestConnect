import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import {
  DollarSign, Clock, CheckCircle, XCircle,
  TrendingUp,
} from 'lucide-react';
import {
  formatCurrency, formatCompactCurrency, formatRelativeTime,
  getInitials,
} from '../lib/utils';
import { InvestmentBid } from '../types';
import { FAKE_PROJECTS, FAKE_INVESTORS } from '../data/fakeData';

export default function BidsPage() {
  const { profile } = useAuth();
  const isEntrepreneur = profile?.user_type === 'entrepreneur';
  const [tab, setTab] = useState<'pending' | 'accepted' | 'all'>('pending');
  const [realBids, setRealBids] = useState<InvestmentBid[]>([]);

  useEffect(() => {
    if (profile?.id) {
      if (isEntrepreneur) {
        supabase.from('projects').select('id').eq('entrepreneur_id', profile.id)
          .then(({ data: projData }) => {
            if (projData && projData.length > 0) {
              const projectIds = projData.map(p => p.id);
              supabase.from('investment_bids').select('*').in('project_id', projectIds).order('created_at', { ascending: false })
                .then(({ data }) => setRealBids(data || []));
            }
          });
      } else {
        supabase.from('investment_bids').select('*').eq('investor_id', profile.id).order('created_at', { ascending: false })
          .then(({ data }) => setRealBids(data || []));
      }
    }
  }, [profile]);

  // Generate fake bids for display
  const fakeBids: InvestmentBid[] = FAKE_PROJECTS.slice(0, 5).flatMap((proj, pi) =>
    FAKE_INVESTORS.slice(0, 2 + pi).map((inv, ii) => ({
      id: `fbid-${pi}-${ii}`,
      project_id: proj.id,
      investor_id: inv.profile_id,
      amount: Math.round(proj.asking_amount * (0.7 + Math.random() * 0.5)),
      equity_requested: proj.equity_offered ? +(proj.equity_offered - 2 + Math.random() * 4).toFixed(1) : undefined,
      message: [
        'Projeto com grande potencial! Gostaria de discutir uma parceria estrategica.',
        'Acho que esse negocio pode escalar muito. Vamos conversar sobre os termos?',
        'Interesse firme. Posso agregar alem do capital com minha rede de contatos.',
        'Modelo de negocio solido. Quero entender melhor a operacao.',
        'Ja investi em setor similar. Posso ajudar com mentoria e network.',
      ][ii % 5],
      status: (['pending', 'pending', 'accepted', 'counter'] as const)[ii % 4],
      created_at: new Date(Date.now() - (ii + 1) * 86400000 * (pi + 1)).toISOString(),
      investor: inv.profile,
      project: proj,
    }))
  );

  const allBids = [...fakeBids, ...realBids];

  const filtered = tab === 'all'
    ? allBids
    : tab === 'pending'
      ? allBids.filter(b => b.status === 'pending' || b.status === 'counter')
      : allBids.filter(b => b.status === 'accepted');

  const statusConfig: Record<string, { color: string; icon: any; label: string }> = {
    pending: { color: 'bg-amber-100 text-amber-700', icon: Clock, label: 'Pendente' },
    accepted: { color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle, label: 'Aceito' },
    rejected: { color: 'bg-red-100 text-red-600', icon: XCircle, label: 'Recusado' },
    counter: { color: 'bg-primary-100 text-primary-700', icon: TrendingUp, label: 'Contra-Proposta' },
    withdrawn: { color: 'bg-gray-100 text-gray-600', icon: XCircle, label: 'Retirado' },
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">
          {isEntrepreneur ? 'Lances Recebidos' : 'Meus Lances'}
        </h1>
        <p className="text-gray-500 mt-1 text-sm">
          {isEntrepreneur ? 'Gerencie os lances de investimento nos seus projetos' : 'Acompanhe os lances que voce enviou'}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="stat-card">
          <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center mb-2"><Clock className="w-4 h-4 text-amber-600" /></div>
          <p className="text-xl font-bold text-gray-900">{allBids.filter(b => b.status === 'pending' || b.status === 'counter').length}</p>
          <p className="text-xs text-gray-500">Pendentes</p>
        </div>
        <div className="stat-card">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center mb-2"><CheckCircle className="w-4 h-4 text-emerald-600" /></div>
          <p className="text-xl font-bold text-gray-900">{allBids.filter(b => b.status === 'accepted').length}</p>
          <p className="text-xs text-gray-500">Aceitos</p>
        </div>
        <div className="stat-card">
          <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center mb-2"><DollarSign className="w-4 h-4 text-primary-600" /></div>
          <p className="text-xl font-bold text-gray-900">{formatCompactCurrency(allBids.reduce((sum, b) => sum + (b.status === 'pending' ? b.amount : 0), 0))}</p>
          <p className="text-xs text-gray-500">Valor pendente</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
        {[
          { key: 'pending' as const, label: 'Pendentes' },
          { key: 'accepted' as const, label: 'Aceitos' },
          { key: 'all' as const, label: 'Todos' },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
              tab === t.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
          <DollarSign className="w-16 h-16 mx-auto text-gray-200 mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">Nenhum lance {tab === 'pending' ? 'pendente' : tab === 'accepted' ? 'aceito' : 'ainda'}</h3>
          <p className="text-gray-500 text-sm">
            {isEntrepreneur
              ? 'Quando investidores fizerem lances nos seus projetos, eles aparecerão aqui.'
              : 'Seus lances aparecerão aqui após você fazer ofertas nos projetos.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((bid, i) => {
            const status = statusConfig[bid.status] || statusConfig.pending;
            const StatusIcon = status.icon;
            return (
              <motion.div
                key={bid.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="card p-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-emerald-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      {bid.investor ? getInitials(bid.investor.full_name) : (bid.project ? getInitials(bid.project.entrepreneur?.full_name || 'P') : 'I')}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900 text-sm truncate">
                          {isEntrepreneur ? bid.investor?.full_name : bid.project?.title}
                        </p>
                        <span className={`badge ${status.color} flex-shrink-0`}>
                          <StatusIcon className="w-3 h-3 mr-1" />{status.label}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        {isEntrepreneur
                          ? `Lance para: ${bid.project?.title || 'Projeto'}`
                          : `Empreendedor: ${bid.project?.entrepreneur?.full_name}`
                        }
                      </p>
                      <p className="text-xs text-gray-400">{formatRelativeTime(bid.created_at)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 sm:gap-6">
                    <div className="text-right">
                      <p className="font-bold text-emerald-600 text-lg">{formatCurrency(bid.amount)}</p>
                      {bid.equity_requested && <p className="text-xs text-gray-500">{Number(bid.equity_requested).toFixed(1)}% equity</p>}
                    </div>
                    {isEntrepreneur && bid.status === 'pending' && (
                      <div className="flex gap-2">
                        <button className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition-colors">
                          Aceitar
                        </button>
                        <button className="px-3 py-1.5 bg-primary-100 text-primary-700 text-xs font-semibold rounded-lg hover:bg-primary-200 transition-colors">
                          Contra-Propor
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {bid.message && (
                  <div className="mt-3 ml-13 bg-gray-50 rounded-lg p-3 text-sm text-gray-600">
                    {bid.message}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
