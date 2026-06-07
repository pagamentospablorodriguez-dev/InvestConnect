import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp, Menu, X, ArrowRight, CheckCircle, Zap, Target, Users,
  Building, Globe, Eye, Clock, Coffee, Briefcase, Heart, GraduationCap,
  Shirt, ChevronDown, ChevronUp, Shield, Award, Package,
  Star, Lock, Headphones, BadgeCheck, Timer,
} from 'lucide-react';
import {
  formatCompactCurrency, formatCurrency, formatNumber,
  getInvestorTypeLabel,
  getInvestorTypeColor, getInvestorTypeBadge,
} from '../lib/utils';
import {
  FAKE_INVESTORS, FAKE_PROJECTS, TESTIMONIALS,
  FAKE_FAQS, PLATFORM_STATS, FAKE_ACTIVITY, FAKE_FUNDED_DEALS,
} from '../data/fakeData';

const typeIcons: Record<string, any> = {
  angel: Users, fund: Building, shark_talent_scout: Target, international: Globe,
};
const catIcons: Record<string, any> = {
  food_beverage: Coffee, technology: Briefcase, healthcare: Heart,
  education: GraduationCap, fashion: Shirt, services: Zap,
  retail: Package, real_estate: Building, agriculture: Globe,
};

function LandingHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-xl shadow-sm border-b border-gray-100/50' : 'bg-white/90 backdrop-blur-xl border-b border-gray-100/50'}`}>
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
        <nav className="hidden md:flex items-center gap-1">
          <button onClick={() => scrollTo('#como-funciona')} className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary-600 rounded-lg hover:bg-gray-50 transition-all">Como Funciona</button>
          <button onClick={() => scrollTo('#investidores')} className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary-600 rounded-lg hover:bg-gray-50 transition-all">Investidores</button>
          <button onClick={() => scrollTo('#depoimentos')} className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary-600 rounded-lg hover:bg-gray-50 transition-all">Depoimentos</button>
          <button onClick={() => scrollTo('#faq')} className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary-600 rounded-lg hover:bg-gray-50 transition-all">FAQ</button>
          <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-primary-600 rounded-lg hover:bg-gray-50 transition-all">Entrar</Link>
          <Link to="/cadastro" className="ml-2 px-5 py-2.5 text-sm font-bold text-white bg-primary-600 rounded-xl hover:bg-primary-700 shadow-lg shadow-primary-600/25 transition-all">
            Receber Investimento
          </Link>
        </nav>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 hover:bg-gray-100 rounded-xl">
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-1"
          >
            <button onClick={() => scrollTo('#como-funciona')} className="block w-full text-left py-2.5 px-3 rounded-lg hover:bg-gray-50 font-medium text-gray-700">Como Funciona</button>
            <button onClick={() => scrollTo('#investidores')} className="block w-full text-left py-2.5 px-3 rounded-lg hover:bg-gray-50 font-medium text-gray-700">Investidores</button>
            <button onClick={() => scrollTo('#depoimentos')} className="block w-full text-left py-2.5 px-3 rounded-lg hover:bg-gray-50 font-medium text-gray-700">Depoimentos</button>
            <Link to="/login" className="block py-2.5 px-3 rounded-lg hover:bg-gray-50 font-medium text-gray-700">Entrar</Link>
            <Link to="/cadastro" className="block bg-primary-600 text-white text-center py-3 rounded-xl font-bold mt-2">Receber Investimento</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-950 via-primary-900 to-emerald-900" />
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(16,185,129,0.15) 0%, transparent 50%)' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center py-20 lg:py-28">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/90 text-sm font-medium mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          Vagas restantes: <span className="font-bold text-emerald-400">47</span> de 200
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white mb-6 leading-[1.1]"
        >
          Conexao direta com<br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-400">
            investidores do Shark Tank
          </span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <p className="text-xl sm:text-2xl text-white/90 font-semibold mb-2">Receba Ate</p>
          <span className="text-5xl sm:text-7xl lg:text-8xl font-black bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-emerald-300">
            R$ 100.000
          </span>
          <p className="text-xl text-white/80 mt-3 font-medium">Para Criar Seu Negocio</p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-lg text-white/60 max-w-3xl mx-auto mb-10 leading-relaxed"
        >
          {PLATFORM_STATS.totalInvestors}+ investidores estao procurando brasileiros como voce para financiar.
          Sem experiencia previa. Sem burocracia. So a sua ideia e a vontade de transformar sua vida.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            to="/cadastro"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-bold text-primary-900 bg-white rounded-2xl hover:bg-gray-50 shadow-2xl shadow-black/20 transition-all hover:scale-105"
          >
            QUERO RECEBER MEU INVESTIMENTO <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to="/cadastro?tipo=investidor"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-bold text-white bg-white/10 border-2 border-white/20 rounded-2xl hover:bg-white/20 transition-all"
          >
            SOU INVESTIDOR
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-6 text-white/50 text-sm"
        >
          <div className="flex items-center gap-2"><Shield className="w-4 h-4" /> 100% Seguro</div>
          <div className="flex items-center gap-2"><Award className="w-4 h-4" /> Empresa Registrada</div>
          <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Garantia 7 dias</div>
          <div className="flex items-center gap-2"><Lock className="w-4 h-4" /> LGPD Compliant</div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <div className="bg-gradient-to-t from-primary-950/80 to-transparent h-20" />
        <div className="bg-primary-950/90 backdrop-blur-sm border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { v: `${PLATFORM_STATS.totalInvestors}+`, l: 'Investidores Ativos' },
              { v: `R$ ${(PLATFORM_STATS.totalInvested / 1000000).toFixed(0)}M+`, l: 'Ja Investidos' },
              { v: `${PLATFORM_STATS.totalDeals}+`, l: 'Negocios Financiados' },
              { v: `${PLATFORM_STATS.successRate}%`, l: 'Taxa de Sucesso' },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + i * 0.1 }}
                className="text-center"
              >
                <span className="text-2xl sm:text-3xl font-bold text-white">{s.v}</span>
                <p className="text-white/50 text-sm mt-0.5">{s.l}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ActivityTicker() {
  const doubled = [...FAKE_ACTIVITY, ...FAKE_ACTIVITY];
  return (
    <section className="bg-gray-900 py-4 overflow-hidden border-b border-white/5">
      <div className="flex animate-scroll whitespace-nowrap">
        {doubled.map((item, i) => (
          <div key={i} className="inline-flex items-center gap-3 mx-6 px-5 py-2.5 bg-white/5 rounded-xl border border-white/10">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-white font-semibold text-sm">{formatCompactCurrency(item.amount!)}</span>
            <span className="text-white/80 text-sm">{item.title}</span>
            <span className="text-gray-500 text-xs">{item.city}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    { step: '01', title: 'Acesse a Plataforma', desc: 'Centenas de investidores-anjo, fundos e olheiros do Shark Tank estao la TODOS os dias buscando projetos como o seu.', icon: Zap, highlight: '847+ investidores ativos' },
    { step: '02', title: 'Apresente Seu Projeto', desc: 'Nao precisa ser perfeito. Um cafe, um app, uma loja, uma clinica — descreva sua ideia e nos ajudamos a estruturar.', icon: Target, highlight: 'Suporte na apresentacao' },
    { step: '03', title: 'Receba Lances', desc: 'Investidores veem seu projeto e fazem lances. Voce escolhe o melhor. Media de 7 dias para o primeiro lance.', icon: TrendingUp, highlight: '94% recebem lances' },
    { step: '04', title: 'Lance Seu Negocio', desc: 'Com o capital, voce transforma sua ideia em realidade. Mentoria inclusa pelo investidor. Contrato formal e seguro.', icon: CheckCircle, highlight: 'Mentoria inclusa' },
  ];

  return (
    <section id="como-funciona" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <p className="section-title mb-4">Simples e Rapido</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">
            Como Voce Vai Receber Ate R$100.000
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            Em 4 passos simples, voce conecta sua ideia aos investidores certos
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="bg-white rounded-2xl p-7 shadow-lg border border-gray-100 relative group hover:shadow-xl transition-all duration-300"
            >
              <span className="absolute -top-3.5 left-7 inline-flex w-8 h-8 rounded-full bg-primary-600 text-white font-bold text-xs items-center justify-center shadow-lg shadow-primary-600/30">
                {item.step}
              </span>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-100 to-emerald-50 flex items-center justify-center mb-5 mt-2 group-hover:scale-110 transition-transform">
                <item.icon className="w-7 h-7 text-primary-600" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h4>
              <p className="text-gray-500 text-sm leading-relaxed mb-3">{item.desc}</p>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                <CheckCircle className="w-3.5 h-3.5" /> {item.highlight}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TrustBadgesSection() {
  return (
    <section className="py-16 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-extrabold text-gray-900">Por Que Empreendedores Confiam Na Gente</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Shield, title: 'Due Diligence', desc: 'Todos os investidores passam por verificacao completa de identidade, capacidade financeira e antecedentes.' },
            { icon: BadgeCheck, title: 'Contratos Formais', desc: 'Acordos de investimento formalizados juridicamente. Voce recebe o capital com seguranca juridica total.' },
            { icon: Headphones, title: 'Suporte Dedicado', desc: 'Time de suporte via WhatsApp disponivel 7 dias por semana para ajudar em cada etapa do processo.' },
            { icon: Timer, title: 'Garantia 7 Dias', desc: 'Se dentro de 7 dias voce nao estiver satisfeito, devolvemos 100% do seu investimento. Sem perguntas.' },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center p-6"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center mx-auto mb-4">
                <item.icon className="w-7 h-7 text-primary-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function InvestorsSection() {
  return (
    <section id="investidores" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <p className="section-title mb-4">Investidores Verificados</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">
            {PLATFORM_STATS.totalInvestors}+ Investidores Prontos Para Investir
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            Investidores-anjo, fundos, olheiros do Shark Tank e investidores internacionais
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FAKE_INVESTORS.filter((i) => i.featured).map((inv, idx) => {
            const Icon = typeIcons[inv.investor_type] || Users;
            const color = getInvestorTypeColor(inv.investor_type);
            const badge = getInvestorTypeBadge(inv.investor_type);
            return (
              <motion.div
                key={inv.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08, duration: 0.4 }}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg hover:border-gray-200 transition-all duration-300 group"
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform`}>
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
                {inv.company_name && (
                  <p className="text-xs text-gray-400 mb-2">{inv.company_name}</p>
                )}
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{inv.bio}</p>
                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-50">
                  <div>
                    <p className="text-xs text-gray-400">{inv.total_investments} investimentos</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-emerald-600 text-sm">{formatCompactCurrency(inv.total_invested)}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
                  <span>{inv.profile?.city}, {inv.profile?.state}</span>
                  <span>R$ {formatNumber(inv.investment_range_min)} - {formatCompactCurrency(inv.investment_range_max)}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Link to="/cadastro" className="inline-flex items-center gap-2 text-primary-600 font-bold hover:text-primary-700 text-lg">
            Ver todos os {PLATFORM_STATS.totalInvestors}+ investidores <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function FeaturedProjectsSection() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <p className="section-title mb-4">Projetos em Destaque</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            Negocios Buscando Investimento Agora
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">Oportunidades verificadas com potencial de retorno comprovado</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FAKE_PROJECTS.filter((p) => p.featured).map((proj, i) => {
            const Icon = catIcons[proj.category] || Package;
            return (
              <motion.div
                key={proj.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card-hover p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-100 to-emerald-50 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <span className="badge bg-emerald-100 text-emerald-700">Ativo</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1.5">{proj.title}</h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{proj.short_description}</p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <div>
                    <p className="text-xs text-gray-400">Busca</p>
                    <p className="font-bold text-emerald-600">{formatCompactCurrency(proj.asking_amount)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-400">{proj.equity_offered}% equity</p>
                  </div>
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
  );
}

function FundedDealsSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <p className="section-title mb-4">Negocios Fechados</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            Investimentos Realizados Recentemente
          </h2>
          <p className="text-gray-500">Provas reais de que a plataforma funciona</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FAKE_FUNDED_DEALS.map((deal, i) => (
            <motion.div
              key={deal.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-5 border border-emerald-100"
            >
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
  );
}

function TestimonialsSection() {
  return (
    <section id="depoimentos" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <p className="section-title mb-4">Resultados Reais</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            Gente Como Voce Que Ja Recebeu Investimento
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary-500 to-emerald-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                  {t.avatar}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-0.5 mb-3">
                {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />)}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">"{t.quote}"</p>
              <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                <span className="text-emerald-600 font-bold">{formatCompactCurrency(t.amount)}</span>
                <span className="text-xs text-gray-400">{t.project}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const [openItems, setOpenItems] = useState<number[]>([]);
  return (
    <section id="faq" className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <p className="section-title mb-4">Duvidas</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Perguntas Frequentes</h2>
        </div>
        <div className="space-y-3">
          {FAKE_FAQS.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-gray-200 transition-colors"
            >
              <button
                onClick={() => setOpenItems((prev) => prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i])}
                className="flex items-center justify-between w-full px-6 py-5 text-left"
              >
                <span className="font-semibold text-gray-900 pr-4">{faq.q}</span>
                {openItems.includes(i) ? <ChevronUp className="w-5 h-5 text-primary-600 flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />}
              </button>
              <AnimatePresence>
                {openItems.includes(i) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-6 pb-5 text-gray-600 leading-relaxed">{faq.a}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-br from-primary-700 via-primary-600 to-emerald-600 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4">
            Por R$97, Voce Pode Receber Ate R$100.000
          </h2>
          <p className="text-xl text-white/70 mb-10">
            O acesso que pode transformar sua vida financeira para sempre
          </p>
          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-2xl max-w-lg mx-auto">
            <p className="text-gray-400 line-through text-lg">R$ 497</p>
            <div className="flex items-baseline justify-center gap-2 my-3">
              <span className="text-5xl sm:text-6xl font-black text-gray-900">R$ 97</span>
              <span className="text-gray-500 text-sm">/acesso unico</span>
            </div>
            <div className="space-y-3 text-left max-w-sm mx-auto mb-8">
              {[
                `Acesso a ${PLATFORM_STATS.totalInvestors}+ investidores verificados`,
                'Apresentacao ilimitada de projetos',
                'Recebimento de lances sem limite',
                'Chat direto com investidores',
                'Suporte dedicado via WhatsApp',
                'Garantia incondicional de 7 dias',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">{item}</span>
                </div>
              ))}
            </div>
            <Link
              to="/cadastro"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary-600 text-white font-bold rounded-2xl hover:bg-primary-700 shadow-xl shadow-primary-600/30 text-lg transition-all hover:scale-105 w-full"
            >
              GARANTIR MEU ACESSO <ArrowRight className="w-5 h-5" />
            </Link>
            <div className="flex items-center justify-center gap-2 mt-4">
              <Lock className="w-3.5 h-3.5 text-gray-400" />
              <p className="text-xs text-gray-400">Pagamento seguro. Garantia de 7 dias ou seu dinheiro de volta.</p>
            </div>
          </div>

          {/* Social proof under CTA */}
          <div className="mt-8 flex items-center justify-center gap-6 text-white/60 text-sm">
            <div className="flex items-center gap-2"><Shield className="w-4 h-4" /> Pagamento Seguro</div>
            <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4" /> 892+ negocios financiados</div>
            <div className="flex items-center gap-2"><Star className="w-4 h-4" /> 4.9/5 avaliacao</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-600 to-emerald-500 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-lg text-white">InvestConnect</span>
              <span className="ml-0.5 text-[9px] font-bold text-emerald-400 tracking-wider bg-emerald-900/50 px-1.5 py-0.5 rounded">BR</span>
            </div>
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
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <LandingHeader />
      <main>
        <HeroSection />
        <ActivityTicker />
        <HowItWorksSection />
        <TrustBadgesSection />
        <InvestorsSection />
        <FeaturedProjectsSection />
        <FundedDealsSection />
        <TestimonialsSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
