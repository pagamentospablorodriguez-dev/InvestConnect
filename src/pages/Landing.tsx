import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  TrendingUp, ArrowRight, CheckCircle, Zap, Target, Users,
  Building, Globe, Eye, Clock, Coffee, Briefcase, Heart, GraduationCap,
  Shirt, Shield, Award, Package,
} from 'lucide-react';
import {
  formatCompactCurrency, formatCurrency,
  getInvestorTypeLabel,
  getInvestorTypeColor, getInvestorTypeBadge,
} from '../lib/utils';
import {
  FAKE_INVESTORS, FAKE_PROJECTS, PLATFORM_STATS, FAKE_FUNDED_DEALS,
} from '../data/fakeData';

const typeIcons: Record<string, any> = {
  angel: Users, fund: Building, shark_talent_scout: Target, international: Globe,
};
const catIcons: Record<string, any> = {
  food_beverage: Coffee, technology: Briefcase, healthcare: Heart,
  education: GraduationCap, fashion: Shirt, services: Zap,
  retail: Package, real_estate: Building, agriculture: Globe,
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-xl border-b border-gray-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-emerald-500 flex items-center justify-center shadow-lg shadow-primary-600/20">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-xl text-gray-900 leading-none">InvestConnect</span>
              <span className="ml-0.5 text-[10px] font-bold text-emerald-600 tracking-wider bg-emerald-50 px-1.5 py-0.5 rounded">BR</span>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-primary-600 rounded-lg hover:bg-gray-50 transition-all">Entrar</Link>
            <Link to="/cadastro" className="px-5 py-2.5 text-sm font-bold text-white bg-primary-600 rounded-xl hover:bg-primary-700 shadow-lg shadow-primary-600/25 transition-all">
              Criar Conta
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-950 via-primary-900 to-emerald-900 py-20 lg:py-28">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(16,185,129,0.15) 0%, transparent 50%)' }} />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/90 text-sm font-medium mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            Plataforma ativa com {PLATFORM_STATS.totalInvestors}+ investidores
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-[1.1]">
            Conecte seu negocio<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-400">
              aos investidores certos
            </span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
            A plataforma que conecta empreendedores brasileiros a investidores-anjo, fundos de investimento e olheiros do Shark Tank Brasil.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/cadastro" className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-bold text-primary-900 bg-white rounded-2xl hover:bg-gray-50 shadow-2xl shadow-black/20 transition-all hover:scale-105">
              Acessar Plataforma <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/cadastro?tipo=investidor" className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-bold text-white bg-white/10 border-2 border-white/20 rounded-2xl hover:bg-white/20 transition-all">
              Sou Investidor
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.6 }}
            className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {[
              { v: `${PLATFORM_STATS.totalInvestors}+`, l: 'Investidores Ativos' },
              { v: `R$ ${(PLATFORM_STATS.totalInvested / 1000000).toFixed(0)}M+`, l: 'Ja Investidos' },
              { v: `${PLATFORM_STATS.totalDeals}+`, l: 'Negocios Financiados' },
              { v: `${PLATFORM_STATS.successRate}%`, l: 'Taxa de Sucesso' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <span className="text-2xl sm:text-3xl font-bold text-white">{s.v}</span>
                <p className="text-white/50 text-sm mt-0.5">{s.l}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">Como Funciona</h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">Em 4 passos simples, voce conecta sua ideia aos investidores certos</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Crie sua conta', desc: 'Cadastre-se como empreendedor ou investidor em menos de 2 minutos.', icon: Zap },
              { step: '02', title: 'Publique seu projeto', desc: 'Descreva seu negocio, defina o valor e a equity oferecida.', icon: Target },
              { step: '03', title: 'Receba lances', desc: 'Investidores veem seu projeto e fazem propostas. Voce escolhe a melhor.', icon: TrendingUp },
              { step: '04', title: 'Feche o negocio', desc: 'Aceite o lance, assine o contrato e receba o capital.', icon: CheckCircle },
            ].map((item, i) => (
              <motion.div key={item.step} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-white rounded-2xl p-7 shadow-lg border border-gray-100 relative group hover:shadow-xl transition-all duration-300">
                <span className="absolute -top-3.5 left-7 inline-flex w-8 h-8 rounded-full bg-primary-600 text-white font-bold text-xs items-center justify-center shadow-lg shadow-primary-600/30">{item.step}</span>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-100 to-emerald-50 flex items-center justify-center mb-5 mt-2 group-hover:scale-110 transition-transform">
                  <item.icon className="w-7 h-7 text-primary-600" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Investors */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">Investidores Verificados</h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">Investidores-anjo, fundos, olheiros do Shark Tank e investidores internacionais</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FAKE_INVESTORS.filter((i) => i.featured).map((inv, idx) => {
              const Icon = typeIcons[inv.investor_type] || Users;
              const color = getInvestorTypeColor(inv.investor_type);
              const badge = getInvestorTypeBadge(inv.investor_type);
              return (
                <motion.div key={inv.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.08, duration: 0.4 }}
                  className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all">
                  <div className="flex items-start gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="font-bold text-gray-900 text-sm truncate">{inv.profile?.full_name}</p>
                        {inv.verified && <CheckCircle className="w-3.5 h-3.5 text-primary-500 flex-shrink-0" />}
                      </div>
                      <span className={`badge ${badge} mt-1`}>{getInvestorTypeLabel(inv.investor_type)}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{inv.bio}</p>
                  <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-50">
                    <span>{inv.profile?.city}, {inv.profile?.state}</span>
                    <span className="font-semibold text-emerald-600">{formatCompactCurrency(inv.total_invested)}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">Projetos em Destaque</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Negocios buscando investimento agora</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FAKE_PROJECTS.filter((p) => p.featured).map((proj, i) => {
              const Icon = catIcons[proj.category] || Package;
              return (
                <motion.div key={proj.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-100 to-emerald-50 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary-600" />
                    </div>
                    <span className="badge bg-emerald-100 text-emerald-700">Ativo</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1.5">{proj.title}</h3>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">{proj.short_description}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <div><p className="text-xs text-gray-400">Busca</p><p className="font-bold text-emerald-600">{formatCompactCurrency(proj.asking_amount)}</p></div>
                    <div className="text-center"><p className="text-xs text-gray-400">{proj.equity_offered}% equity</p></div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-gray-400 text-sm"><Eye className="w-4 h-4" />{proj.views}</div>
                      <div className="flex items-center gap-1 text-gray-400 text-sm"><Clock className="w-4 h-4" />{proj.bidCount} lances</div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Recent Deals */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">Negocios Fechados Recentemente</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FAKE_FUNDED_DEALS.map((deal, i) => (
              <motion.div key={deal.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-5 border border-emerald-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{deal.project?.title}</p>
                    <p className="text-xs text-gray-500">{deal.project?.entrepreneur?.full_name} + {deal.investor?.full_name}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-emerald-700">{formatCurrency(deal.amount)}</span>
                  <span className="text-sm text-gray-500">{deal.equity_percentage}% equity</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: 'Due Diligence', desc: 'Todos os investidores passam por verificacao completa.' },
              { icon: Award, title: 'Contratos Formais', desc: 'Acordos juridicamente formalizados com seguranca total.' },
              { icon: CheckCircle, title: '847+ Investidores', desc: 'Base ativa e verificada de investidores de todos os tipos.' },
              { icon: TrendingUp, title: '892+ Negocios', desc: 'Projetos financiados com taxa de sucesso de 94%.' },
            ].map((item) => (
              <div key={item.title} className="text-center p-6">
                <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-7 h-7 text-primary-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-primary-700 via-primary-600 to-emerald-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Pronto para conectar seu negocio aos investidores?
            </h2>
            <p className="text-xl text-white/70 mb-8">
              Crie sua conta e comece a receber propostas de investimento
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/cadastro" className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-bold text-primary-900 bg-white rounded-2xl hover:bg-gray-50 shadow-2xl transition-all hover:scale-105">
                Criar Conta Grátis <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/cadastro?tipo=investidor" className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-bold text-white bg-white/10 border-2 border-white/20 rounded-2xl hover:bg-white/20 transition-all">
                Sou Investidor
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-600 to-emerald-500 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg text-white">InvestConnect<span className="text-[9px] font-bold text-emerald-400 tracking-wider bg-emerald-900/50 px-1.5 py-0.5 rounded ml-0.5">BR</span></span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <span>Termos de Uso</span>
              <span>Politica de Privacidade</span>
              <span>Contato</span>
            </div>
            <p className="text-gray-500 text-sm">&copy; 2024 InvestConnectBR. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
