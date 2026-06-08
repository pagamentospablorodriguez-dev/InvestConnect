import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import {
  DollarSign, Clock, CheckCircle, XCircle,
  TrendingUp, MessageSquare,
} from 'lucide-react';
import {
  formatCurrency, formatCompactCurrency, formatRelativeTime,
  getInitials,
} from '../lib/utils';
import { InvestmentBid } from '../types';
import { FAKE_PROJECTS, FAKE_INVESTORS } from '../data/fakeData';

const BID_MESSAGES = [
  // Per-investor-type messages for variety
  'Projeto com grande potencial! Gostaria de discutir uma parceria estrategica. Posso agregar com minha experiencia no setor.',
  'Acho que esse negocio pode escalar muito. Vamos conversar sobre os termos? Tenho interesse firme.',
  'Interesse firme. Posso agregar alem do capital com minha rede de contatos e mentoria ativa.',
  'Modelo de negocio solido e tração comprovada. Quero entender melhor a operacao para propor uma parceria.',
  'Ja investi em setor similar com exit em 3x. Posso ajudar com mentoria e network de fornecedores.',
  'Vi os numeros e fiquei impressionado. O ROI projetado e atrativo. Gostaria de agendar uma call.',
  'Tenho portfolio com 5 negocios no mesmo segmento. A sinergia e evidente. Vamos fechar?',
  'O diferencial competitivo me chamou atencao. Acredito que com capital e gestao podemos multiplicar o faturamento.',
  'Busco projetos com impacto social e retorno financeiro. Esse se encaixa perfeitamente no meu perfil.',
  'Fundo com foco exclusivo nesse setor. Temos 12 analistas que podem acelerar o due diligence.',
];

const INVESTOR_BIDS: InvestmentBid[] = [
  // Each bid uses a different investor and a different project with unique messages
  { id: 'fbid-0-0', project_id: 'proj-1', investor_id: 'p-1', amount: 72000, equity_requested: 13, message: BID_MESSAGES[0], status: 'pending', created_at: new Date(Date.now() - 3600000).toISOString(), investor: FAKE_INVESTORS[0].profile, project: FAKE_PROJECTS[0] },
  { id: 'fbid-0-1', project_id: 'proj-1', investor_id: 'p-5', amount: 85000, equity_requested: 16, message: BID_MESSAGES[1], status: 'pending', created_at: new Date(Date.now() - 86400000).toISOString(), investor: FAKE_INVESTORS[4].profile, project: FAKE_PROJECTS[0] },
  { id: 'fbid-0-2', project_id: 'proj-1', investor_id: 'p-2', amount: 98000, equity_requested: 14, message: BID_MESSAGES[2], status: 'counter', created_at: new Date(Date.now() - 172800000).toISOString(), investor: FAKE_INVESTORS[1].profile, project: FAKE_PROJECTS[0] },

  { id: 'fbid-1-0', project_id: 'proj-2', investor_id: 'p-4', amount: 110000, equity_requested: 10, message: BID_MESSAGES[3], status: 'pending', created_at: new Date(Date.now() - 7200000).toISOString(), investor: FAKE_INVESTORS[3].profile, project: FAKE_PROJECTS[1] },
  { id: 'fbid-1-1', project_id: 'proj-2', investor_id: 'p-3', amount: 125000, equity_requested: 11, message: BID_MESSAGES[4], status: 'accepted', created_at: new Date(Date.now() - 259200000).toISOString(), investor: FAKE_INVESTORS[2].profile, project: FAKE_PROJECTS[1] },

  { id: 'fbid-2-0', project_id: 'proj-3', investor_id: 'p-7', amount: 55000, equity_requested: 10, message: BID_MESSAGES[5], status: 'pending', created_at: new Date(Date.now() - 14400000).toISOString(), investor: FAKE_INVESTORS[6].profile, project: FAKE_PROJECTS[2] },
  { id: 'fbid-2-1', project_id: 'proj-3', investor_id: 'p-6', amount: 90000, equity_requested: 16, message: BID_MESSAGES[6], status: 'pending', created_at: new Date(Date.now() - 432000000).toISOString(), investor: FAKE_INVESTORS[5].profile, project: FAKE_PROJECTS[2] },

  { id: 'fbid-4-0', project_id: 'proj-5', investor_id: 'p-2', amount: 135000, equity_requested: 9, message: BID_MESSAGES[7], status: 'pending', created_at: new Date(Date.now() - 28800000).toISOString(), investor: FAKE_INVESTORS[1].profile, project: FAKE_PROJECTS[4] },
  { id: 'fbid-4-1', project_id: 'proj-5', investor_id: 'p-10', amount: 140000, equity_requested: 10, message: BID_MESSAGES[8], status: 'accepted', created_at: new Date(Date.now() - 345600000).toISOString(), investor: FAKE_INVESTORS[9].profile, project: FAKE_PROJECTS[4] },
  { id: 'fbid-4-2', project_id: 'proj-5', investor_id: 'p-11', amount: 120000, equity_requested: 8, message: BID_MESSAGES[9], status: 'pending', created_at: new Date(Date.now() - 518400000).toISOString(), investor: FAKE_INVESTORS[10].profile, project: FAKE_PROJECTS[4] },

  { id: 'fbid-7-0', project_id: 'proj-8', investor_id: 'p-4', amount: 190000, equity_requested: 7, message: BID_MESSAGES[3], status: 'pending', created_at: new Date(Date.now() - 57600000).toISOString(), investor: FAKE_INVESTORS[3].profile, project: FAKE_PROJECTS[7] },
  { id: 'fbid-7-1', project_id: 'proj-8', investor_id: 'p-8', amount: 200000, equity_requested: 8, message: BID_MESSAGES[5], status: 'counter', created_at: new Date(Date.now() - 691200000).toISOString(), investor: FAKE_INVESTORS[7].profile, project: FAKE_PROJECTS[7] },

  { id: 'fbid-9-0', project_id: 'proj-10', investor_id: 'p-1', amount: 70000, equity_requested: 12, message: BID_MESSAGES[1], status: 'accepted', created_at: new Date(Date.now() - 604800000).toISOString(), investor: FAKE_INVESTORS[0].profile, project: FAKE_PROJECTS[9] },
];

export default function BidsPage() {
  const { profile } = useAuth();
  const isEntrepreneur = profile?.user_type === 'entrepreneur';
  const [tab, setTab] = useState<'pending' | 'accepted' | 'all'>('pending');
  const [realBids, setRealBids] = useState<InvestmentBid[]>([]);
  const [localBids, setLocalBids] = useState<InvestmentBid[]>(INVESTOR_BIDS);

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

  const allBids = [...localBids, ...realBids];

  const filtered = tab === 'all'
    ? allBids
    : tab === 'pending'
      ? allBids.filter(b => b.status === 'pending' || b.status === 'counter')
      : allBids.filter(b => b.status === 'accepted');

  const handleAccept = (bidId: string) => {
    setLocalBids(prev => prev.map(b => b.id === bidId ? { ...b, status: 'accepted' as const } : b));
    toast.success('Lance aceito! O investidor sera notificado.');
  };

  const handleReject = (bidId: string) => {
    setLocalBids(prev => prev.map(b => b.id === bidId ? { ...b, status: 'rejected' as const } : b));
    toast.success('Lance recusado.');
  };

  const handleCounter = (bidId: string) => {
    setLocalBids(prev => prev.map(b => b.id === bidId ? { ...b, status: 'counter' as const } : b));
    toast.success('Contra-proposta enviada! Aguardando resposta do investidor.');
  };

  const statusConfig: Record<string, { color: string; icon: any; label: string }> = {
    pending: { color: 'bg-amber-100 text-amber-700', icon: Clock, label: 'Pendente' },
    accepted: { color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle, label: 'Aceito' },
    rejected: { color: 'bg-red-100 text-red-600', icon: XCircle, label: 'Recusado' },
    counter: { color: 'bg-primary-100 text-primary-700', icon: TrendingUp, label: 'Contra-Proposta' },
    withdrawn: { color: 'bg-gray-100 text-gray-600', icon: XCircle, label: 'Retirado' },
  };

  const pendingTotal = allBids.filter(b => b.status === 'pending' || b.status === 'counter').reduce((s, b) => s + b.amount, 0);

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
          <p className="text-xl font-bold text-gray-900">{formatCompactCurrency(pendingTotal)}</p>
          <p className="text-xs text-gray-500">Valor pendente</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
        {[
          { key: 'pending' as const, label: `Pendentes (${allBids.filter(b => b.status === 'pending' || b.status === 'counter').length})` },
          { key: 'accepted' as const, label: `Aceitos (${allBids.filter(b => b.status === 'accepted').length})` },
          { key: 'all' as const, label: `Todos (${allBids.length})` },
        ].map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${tab === t.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
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
            const displayName = isEntrepreneur ? bid.investor?.full_name : bid.project?.title;
            const subLabel = isEntrepreneur
              ? `Lance para: ${bid.project?.title || 'Projeto'}`
              : `Empreendedor: ${bid.project?.entrepreneur?.full_name}`;
            return (
              <motion.div key={bid.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="card p-5">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-emerald-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      {bid.investor ? getInitials(bid.investor.full_name) : (bid.project ? getInitials(bid.project.entrepreneur?.full_name || 'P') : 'I')}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900 text-sm truncate">{displayName}</p>
                        <span className={`badge ${status.color} flex-shrink-0`}>
                          <StatusIcon className="w-3 h-3 mr-1" />{status.label}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">{subLabel}</p>
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
                        <button onClick={() => handleAccept(bid.id)} className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition-colors">
                          Aceitar
                        </button>
                        <button onClick={() => handleCounter(bid.id)} className="px-3 py-1.5 bg-primary-100 text-primary-700 text-xs font-semibold rounded-lg hover:bg-primary-200 transition-colors">
                          Contra-Propor
                        </button>
                        <button onClick={() => handleReject(bid.id)} className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded-lg hover:bg-gray-200 transition-colors">
                          Recusar
                        </button>
                      </div>
                    )}
                    {isEntrepreneur && bid.status === 'counter' && (
                      <div className="flex gap-2">
                        <button onClick={() => handleAccept(bid.id)} className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition-colors">
                          Aceitar
                        </button>
                        <button onClick={() => handleReject(bid.id)} className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded-lg hover:bg-gray-200 transition-colors">
                          Recusar
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {bid.message && (
                  <div className="mt-3 ml-13 bg-gray-50 rounded-lg p-3 text-sm text-gray-600 flex items-start gap-2">
                    <MessageSquare className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                    <span>{bid.message}</span>
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
