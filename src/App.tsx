import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useParams, Outlet } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from './lib/supabase';
import { useAuth, AuthProvider } from './contexts/AuthContext';
import { formatCurrency, formatCompactCurrency, getInitials, BRAZILIAN_STATES } from './lib/utils';
import {
  TrendingUp, Menu, X, Mail, Lock, Eye, EyeOff, ArrowLeft, User, Building, MapPin,
  Plus, Search, Eye as EyeIcon, Clock, CheckCircle, Send, MessageSquare, DollarSign, ArrowRight,
  Target, Users, Globe, Package, Zap,
  Briefcase, Coffee, Heart, GraduationCap, Shirt
} from 'lucide-react';

// ============================================================================
// FAKE DATA
// ============================================================================

const FAKE_INVESTORS = [
  { id: '1', name: 'Roberto Almeida', type: 'angel', typeLabel: 'Investidor-Anjo', city: 'São Paulo', state: 'SP', bio: 'Investidor-anjo desde 2015. Foco em tecnologia.', investments: 12, totalInvested: 980000, rangeMin: 30000, rangeMax: 150000, verified: true, featured: true },
  { id: '2', name: 'Mariana Costa', type: 'fund', typeLabel: 'Fundo de Investimento', company: 'Costa Capital', city: 'Rio de Janeiro', state: 'RJ', bio: 'Gestora com R$50M AUM.', investments: 28, totalInvested: 4500000, rangeMin: 50000, rangeMax: 500000, verified: true, featured: true },
  { id: '3', name: 'Carlos Eduardo Silva', type: 'shark_talent_scout', typeLabel: 'Olheiro Shark Tank', city: 'Curitiba', state: 'PR', bio: 'Olheiro oficial do Shark Tank Brasil.', investments: 8, totalInvested: 1200000, rangeMin: 100000, rangeMax: 500000, verified: true, featured: true },
  { id: '4', name: 'James Peterson', type: 'international', typeLabel: 'Investidor Internacional', company: 'Global Partners VC', city: 'New York', state: 'NY', bio: '20+ years in venture capital.', investments: 15, totalInvested: 3200000, rangeMin: 100000, rangeMax: 1000000, verified: true, featured: true },
  { id: '5', name: 'Fernanda Lima', type: 'angel', typeLabel: 'Investidor-Anjo', city: 'Belo Horizonte', state: 'MG', bio: 'Empresária do ramo alimentício.', investments: 8, totalInvested: 560000, rangeMin: 20000, rangeMax: 100000, verified: true, featured: false },
  { id: '6', name: 'André Souza', type: 'fund', typeLabel: 'Fundo de Investimento', company: 'SaaS Ventures', city: 'Porto Alegre', state: 'RS', bio: 'Sócio de VC focado em SaaS B2B.', investments: 22, totalInvested: 2800000, rangeMin: 50000, rangeMax: 300000, verified: true, featured: true },
  { id: '7', name: 'Patricia Mendes', type: 'angel', typeLabel: 'Investidor-Anjo', city: 'Salvador', state: 'BA', bio: 'Investidora de impacto social.', investments: 6, totalInvested: 420000, rangeMin: 25000, rangeMax: 150000, verified: true, featured: false },
  { id: '8', name: 'Michael Chen', type: 'international', typeLabel: 'Investidor Internacional', company: 'Asia Ventures', city: 'Hong Kong', state: 'HK', bio: 'Latin America focus.', investments: 9, totalInvested: 1900000, rangeMin: 200000, rangeMax: 2000000, verified: true, featured: true },
];

const SAMPLE_PROJECTS = [
  { id: '1', title: 'Café Orgânico Sustentável', category: 'food_beverage', categoryLabel: 'Alimentação', asking_amount: 80000, equity_offered: 15, description: 'Café especial orgânico com delivery direto do produtor.', city: 'São Paulo', state: 'SP', views: 234, bids: 2, featured: true, entrepreneur: { name: 'Luciana Mendes' } },
  { id: '2', title: 'App de Delivery Rural', category: 'technology', categoryLabel: 'Tecnologia', asking_amount: 120000, equity_offered: 12, description: 'Plataforma de delivery focada em produtos rurais.', city: 'Rio de Janeiro', state: 'RJ', views: 156, bids: 1, featured: true, entrepreneur: { name: 'Pedro Santos' } },
  { id: '3', title: 'Clínica Veterinária 24h', category: 'healthcare', categoryLabel: 'Saúde', asking_amount: 95000, equity_offered: 18, description: 'Clínica veterinária com atendimento 24h e telemedicina.', city: 'Belo Horizonte', state: 'MG', views: 189, bids: 1, featured: false, entrepreneur: { name: 'Ana Paula' } },
  { id: '4', title: 'E-commerce Moda Circular', category: 'fashion', categoryLabel: 'Moda', asking_amount: 55000, equity_offered: 20, description: 'Plataforma de moda sustentável com buyback.', city: 'Curitiba', state: 'PR', views: 98, bids: 0, featured: false, entrepreneur: { name: 'Carolina Silva' } },
  { id: '5', title: 'EdTech para Escolas Públicas', category: 'education', categoryLabel: 'Educação', asking_amount: 140000, equity_offered: 10, description: 'Plataforma gamificada de ensino adaptativo.', city: 'Florianópolis', state: 'SC', views: 312, bids: 1, featured: true, entrepreneur: { name: 'Ricardo Almeida' } },
];

const TESTIMONIALS = [
  { name: 'Lucas Mendes', location: 'São Paulo, SP', amount: 80000, project: 'App de Delivery', quote: 'Em 3 semanas recebi R$ 80.000 de um investidor-anjo. Meu app hoje atende 15 cidades.', avatar: 'L' },
  { name: 'Camila Rodrigues', location: 'Rio de Janeiro, RJ', amount: 100000, project: 'Café Especial', quote: 'Recebi R$ 100.000. O investidor me ajuda com mentorias. Arrependimento: não ter entrado antes.', avatar: 'C' },
  { name: 'Rafael Souza', location: 'Belo Horizonte, MG', amount: 45000, project: 'E-commerce', quote: 'Ideia simples: e-commerce de produtos sustentáveis. Recebi 3 lances em 2 semanas.', avatar: 'R' },
  { name: 'Ana Paula Ferreira', location: 'Curitiba, PR', amount: 150000, project: 'HealthTech', quote: 'Um fundo de investimento me ofereceu R$150.000. Mudou minha vida profissional.', avatar: 'A' },
  { name: 'Pedro Henrique Lima', location: 'Salvador, BA', amount: 60000, project: 'Clínica Veterinária', quote: 'Em 10 dias já tinha proposta. R$60.000 transformaram meu sonho em realidade.', avatar: 'P' },
  { name: 'Juliana Costa', location: 'Florianópolis, SC', amount: 200000, project: 'EdTech', quote: '4 investidores deram lances. Fechei com R$200.000. Hoje temos 50.000 usuários.', avatar: 'J' },
];

const typeIcons: Record<string, any> = { angel: Users, fund: Building, shark_talent_scout: Target, international: Globe };
const typeColors: Record<string, string> = { angel: 'from-blue-500 to-blue-600', fund: 'from-emerald-500 to-emerald-600', shark_talent_scout: 'from-amber-500 to-orange-500', international: 'from-purple-500 to-violet-600' };

// ============================================================================
// LAYOUT COMPONENTS
// ============================================================================

function LandingLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-emerald-500 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900">InvestConnectBR</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <button onClick={() => scrollTo('#como-funciona')} className="text-gray-600 hover:text-primary-600 font-medium">Como Funciona</button>
            <button onClick={() => scrollTo('#investidores')} className="text-gray-600 hover:text-primary-600 font-medium">Investidores</button>
            <button onClick={() => scrollTo('#depoimentos')} className="text-gray-600 hover:text-primary-600 font-medium">Depoimentos</button>
            <Link to="/login" className="text-gray-600 hover:text-primary-600 font-medium">Entrar</Link>
            <Link to="/cadastro" className="bg-primary-600 text-white px-5 py-2 rounded-xl font-semibold hover:bg-primary-700">Receber Investimento</Link>
          </nav>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="md:hidden bg-white border-t px-4 py-4 space-y-2">
              <button onClick={() => scrollTo('#como-funciona')} className="block w-full text-left py-2">Como Funciona</button>
              <button onClick={() => scrollTo('#investidores')} className="block w-full text-left py-2">Investidores</button>
              <Link to="/login" className="block py-2">Entrar</Link>
              <Link to="/cadastro" className="block bg-primary-600 text-white text-center py-3 rounded-xl">Receber Investimento</Link>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      <main>{children}</main>
    </div>
  );
}

function DashboardLayout() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = window.location;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isEntrepreneur = profile?.user_type === 'entrepreneur';

  const navItems = isEntrepreneur
    ? [{ label: 'Dashboard', href: '/dashboard', icon: TrendingUp }, { label: 'Projetos', href: '/dashboard/projetos', icon: Package }, { label: 'Lances', href: '/dashboard/lances', icon: DollarSign }, { label: 'Mensagens', href: '/dashboard/mensagens', icon: MessageSquare }]
    : [{ label: 'Dashboard', href: '/dashboard', icon: TrendingUp }, { label: 'Projetos', href: '/dashboard/projetos', icon: Package }, { label: 'Meus Lances', href: '/dashboard/lances', icon: DollarSign }, { label: 'Mensagens', href: '/dashboard/mensagens', icon: MessageSquare }];

  const handleSignOut = async () => { await signOut(); navigate('/'); };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AnimatePresence>{sidebarOpen && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/50 z-40 lg:hidden" />}</AnimatePresence>
      <aside className={`fixed top-0 left-0 bottom-0 w-64 bg-white border-r z-50 transform transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-600 to-emerald-500 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg">InvestConnect</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden"><X className="w-5 h-5" /></button>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map(item => (
            <Link key={item.href} to={item.href} onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl ${location.pathname === item.href ? 'bg-primary-50 text-primary-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>
              <item.icon className="w-5 h-5" />{item.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <button onClick={handleSignOut} className="flex items-center gap-2 w-full px-4 py-2 text-gray-600 hover:text-red-600">Sair</button>
        </div>
      </aside>
      <div className="lg:pl-64 flex-grow">
        <header className="sticky top-0 bg-white border-b z-30 flex items-center justify-between h-16 px-4 lg:px-8">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2"><Menu className="w-6 h-6" /></button>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-emerald-500 flex items-center justify-center text-white font-bold">
              {profile?.full_name ? getInitials(profile.full_name) : <User className="w-5 h-5" />}
            </div>
            <span className="font-medium">{profile?.full_name}</span>
          </div>
        </header>
        <main className="p-4 lg:p-8"><Outlet /></main>
      </div>
    </div>
  );
}

// ============================================================================
// PAGES
// ============================================================================

function HomePage() {
  const [faqOpen, setFaqOpen] = useState<number[]>([]);
  const faqs = [
    { q: 'Eu realmente posso receber até R$100.000?', a: 'Sim! Os investidores estão buscando projetos para financiar. O valor médio é R$75.000, mas já tivemos negócios de R$10.000 até mais de R$200.000.' },
    { q: 'Preciso ter experiência empreendedora?', a: 'Não! A maioria dos empreendedores financiados nunca tinha aberto um negócio. Investidores buscam potencial e vontade.' },
    { q: 'Que tipo de negócio pode ser financiado?', a: 'Qualquer tipo! Restaurante, loja, clínica, app, e-commerce... Negócios tradicionais recebem tanto quanto startups.' },
    { q: 'Isso é seguro?', a: '100% seguro. Somos empresa brasileira registrada. Contratos formais, due diligence, acompanhamento jurídico.' },
  ];

  return (
    <LandingLayout>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-emerald-900" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center py-20">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/90 text-sm font-medium mb-8">
            <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span></span>
            Vagas restantes: <span className="font-bold">47</span> de 200
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Conexão direta com investidores<br /><span className="text-emerald-400">do Shark Tank USA</span>
          </motion.h1>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <p className="text-2xl text-white/90 font-semibold mb-2">Receba Até</p>
            <span className="text-5xl sm:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-emerald-300">R$ 100.000</span>
            <p className="text-xl text-white/80 mt-2">Para Criar Seu Negócio</p>
          </motion.div>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-lg text-white/70 max-w-3xl mx-auto mb-10">
            Centenas de investidores estão procurando brasileiros como você para financiar. Sem experiência prévia. Sem burocracia. Só a sua ideia e a vontade.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/cadastro" className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-bold text-primary-900 bg-white rounded-xl hover:bg-gray-100 shadow-2xl">
              QUERO RECEBER MEU INVESTIMENTO <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-black/20 backdrop-blur-sm border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-3 gap-6">
            {[{ v: '847+', l: 'Investidores Ativos' }, { v: 'R$ 47M+', l: 'Já Investidos' }, { v: '892+', l: 'Negócios Financiados' }].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 + i * 0.1 }} className="text-center">
                <span className="text-3xl font-bold text-white">{s.v}</span>
                <p className="text-white/60 text-sm">{s.l}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Activity Scroller */}
      <section className="bg-gray-900 py-6 overflow-hidden">
        <div className="flex animate-scroll whitespace-nowrap">
          {[...SAMPLE_PROJECTS, ...SAMPLE_PROJECTS].map((p, i) => (
            <div key={i} className="inline-flex items-center gap-3 mx-6 px-6 py-3 bg-white/5 rounded-xl border border-white/10">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-white font-semibold">{formatCompactCurrency(p.asking_amount)}</span>
              <span className="text-white/80">{p.title}</span>
              <span className="text-gray-500 text-sm">{p.city}</span>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="como-funciona" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-sm font-semibold text-primary-600 uppercase tracking-wider mb-4">Simples e Rápido</h2>
            <h3 className="text-3xl sm:text-4xl font-bold text-gray-900">Como Você Vai Receber Até R$100.000</h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Acesse a Plataforma', desc: 'Centenas de investidores-anjo, fundos e olheiros do Shark Tank estão lá TODOS os dias.', icon: Zap },
              { step: '02', title: 'Apresente Seu Projeto', desc: 'Não precisa ser perfeito. Um café, um app, uma loja — descreva sua ideia.', icon: Target },
              { step: '03', title: 'Receba Lances', desc: 'Investidores veem seu projeto e fazem lances. Você escolhe o melhor.', icon: TrendingUp },
              { step: '04', title: 'Lance Seu Negócio', desc: 'Com o capital, você transforma sua ideia em realidade, com mentoria inclusa.', icon: CheckCircle },
            ].map((item, i) => (
              <motion.div key={item.step} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-white rounded-2xl p-6 shadow-lg border relative">
                <span className="absolute -top-4 left-6 inline-flex w-10 h-10 rounded-full bg-primary-600 text-white font-bold text-sm items-center justify-center">{item.step}</span>
                <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center mb-4 mt-2"><item.icon className="w-6 h-6 text-primary-600" /></div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h4>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Investors */}
      <section id="investidores" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-sm font-semibold text-primary-600 uppercase tracking-wider mb-4">Investidores Verificados</h2>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">{FAKE_INVESTORS.length}+ Investidores Prontos Para Investir</h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {FAKE_INVESTORS.filter(i => i.featured).map((inv) => {
              const Icon = typeIcons[inv.type] || Users;
              return (
                <motion.div key={inv.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white rounded-xl p-6 border shadow-sm hover:shadow-md">
                  <div className="flex items-start gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${typeColors[inv.type]} flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{inv.name}</p>
                      <p className="text-sm text-primary-600">{inv.typeLabel}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{inv.bio}</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">{inv.investments} investimentos</span>
                    <span className="font-semibold text-emerald-600">{formatCompactCurrency(inv.totalInvested)}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Projetos em Destaque</h2>
              <p className="text-gray-500">Oportunidades de investimento verificadas</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SAMPLE_PROJECTS.filter(p => p.featured).map((proj) => {
              const catIcons: Record<string, any> = { food_beverage: Coffee, technology: Briefcase, healthcare: Heart, education: GraduationCap, fashion: Shirt };
              const Icon = catIcons[proj.category] || Package;
              return (
                <motion.div key={proj.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white rounded-xl border shadow-sm p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary-600" />
                    </div>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700">Ativo</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{proj.title}</h3>
                  <p className="text-gray-500 text-sm mb-4">{proj.description}</p>
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <p className="text-xs text-gray-500">Busca</p>
                      <p className="font-bold text-emerald-600">{formatCompactCurrency(proj.asking_amount)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">{proj.equity_offered}% equity</p>
                      <div className="flex items-center gap-1 text-gray-400 text-sm"><EyeIcon className="w-4 h-4" />{proj.views}</div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="depoimentos" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-sm font-semibold text-primary-600 uppercase tracking-wider mb-4">Resultados Reais</h2>
            <h3 className="text-3xl font-bold text-gray-900">Gente Como Você Que Já Recebeu Investimento</h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-gray-50 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-emerald-500 flex items-center justify-center text-white font-bold">{t.avatar}</div>
                  <div>
                    <p className="font-semibold text-gray-900">{t.name}</p>
                    <p className="text-sm text-gray-500">{t.location}</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-4">"{t.quote}"</p>
                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="text-emerald-600 font-bold text-lg">{formatCompactCurrency(t.amount)}</span>
                  <span className="text-sm text-gray-500">{t.project}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Perguntas Frequentes</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl border overflow-hidden">
                <button onClick={() => setFaqOpen(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i])} className="flex items-center justify-between w-full px-6 py-4 text-left">
                  <span className="font-semibold text-gray-900">{faq.q}</span>
                  <span className="text-primary-600">{faqOpen.includes(i) ? '−' : '+'}</span>
                </button>
                {faqOpen.includes(i) && <div className="px-6 pb-4 text-gray-600">{faq.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-emerald-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Por R$97, Você Pode Receber Até R$100.000</h2>
          <div className="bg-white rounded-3xl p-8 mt-8 text-center">
            <p className="text-gray-400 line-through text-xl">R$ 497</p>
            <div className="flex items-baseline justify-center gap-2 my-4">
              <span className="text-5xl font-bold text-gray-900">R$ 97</span>
              <span className="text-gray-500">/acesso único</span>
            </div>
            <div className="space-y-3 text-left max-w-md mx-auto mb-8">
              {['Acesso a 847+ investidores', 'Apresentação ilimitada de projetos', 'Recebimento de lances sem limite', 'Suporte dedicado', 'Garantia de 7 dias'].map((item, i) => (
                <div key={i} className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-emerald-500" /><span className="text-gray-700">{item}</span></div>
              ))}
            </div>
            <Link to="/cadastro" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700">
              GARANTIR MEU ACESSO <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-emerald-500 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white">InvestConnectBR</span>
          </div>
          <p className="text-gray-500 text-sm">© 2024 Todos os direitos reservados</p>
        </div>
      </footer>
    </LandingLayout>
  );
}

function LoginPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await signIn(email, password);
    if (error) { setError(error.message); setLoading(false); return; }
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 to-emerald-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-8"><ArrowLeft className="w-4 h-4" /> Voltar</Link>
        <div className="bg-white rounded-3xl p-8 shadow-2xl">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-600 to-emerald-500 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">Entrar na sua conta</h1>
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" required className="input pl-10" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••" required className="input pl-10 pr-10" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Entrando...' : 'Entrar'}</button>
          </form>
          <p className="text-center text-gray-500 mt-6">Não tem conta? <Link to="/cadastro" className="text-primary-600 font-semibold">Criar conta</Link></p>
        </div>
      </div>
    </div>
  );
}

function SignupPage() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState<'entrepreneur' | 'investor'>('entrepreneur');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ full_name: '', email: '', password: '', confirm_password: '', city: '', state: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (form.password !== form.confirm_password) { setError('As senhas não coincidem'); return; }
      if (form.password.length < 6) { setError('A senha deve ter pelo menos 6 caracteres'); return; }
      setStep(2); return;
    }
    setLoading(true);
    const { error } = await signUp(form.email, form.password, { full_name: form.full_name, user_type: userType, city: form.city, state: form.state });
    if (error) { setError(error.message); setLoading(false); return; }
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 to-emerald-900 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <Link to="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-8"><ArrowLeft className="w-4 h-4" /> Voltar</Link>
        <div className="bg-white rounded-3xl p-8 shadow-2xl">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-600 to-emerald-500 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">Criar sua conta</h1>
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className={`w-3 h-3 rounded-full ${step >= 1 ? 'bg-primary-600' : 'bg-gray-300'}`} />
            <div className={`w-16 h-1 rounded ${step >= 2 ? 'bg-primary-600' : 'bg-gray-200'}`} />
            <div className={`w-3 h-3 rounded-full ${step >= 2 ? 'bg-primary-600' : 'bg-gray-300'}`} />
          </div>
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm">{error}</div>}
          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <button type="button" onClick={() => setUserType('entrepreneur')} className={`p-4 rounded-xl border-2 ${userType === 'entrepreneur' ? 'border-primary-600 bg-primary-50' : 'border-gray-200'}`}>
                    <User className="w-6 h-6 mx-auto mb-2 text-primary-600" />
                    <p className="font-semibold">Empreendedor</p>
                    <p className="text-xs text-gray-500">Receber investimento</p>
                  </button>
                  <button type="button" onClick={() => setUserType('investor')} className={`p-4 rounded-xl border-2 ${userType === 'investor' ? 'border-emerald-600 bg-emerald-50' : 'border-gray-200'}`}>
                    <Building className="w-6 h-6 mx-auto mb-2 text-emerald-600" />
                    <p className="font-semibold">Investidor</p>
                    <p className="text-xs text-gray-500">Investir em projetos</p>
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome completo</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="text" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} placeholder="Seu nome" required className="input pl-10" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="seu@email.com" required className="input pl-10" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Mínimo 6 caracteres" required className="input pl-10 pr-10" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar senha</label>
                  <input type="password" value={form.confirm_password} onChange={(e) => setForm({ ...form, confirm_password: e.target.value })} placeholder="Digite novamente" required className="input" />
                </div>
                <button type="button" onClick={() => setStep(2)} className="btn-primary w-full">Continuar</button>
              </div>
            )}
            {step === 2 && (
              <div className="space-y-4">
                <button type="button" onClick={() => setStep(1)} className="flex items-center gap-2 text-gray-500 hover:text-gray-700"><ArrowLeft className="w-4 h-4" /> Voltar</button>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="São Paulo" required className="input pl-10" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                    <select value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} required className="input">
                      <option value="">Selecione</option>
                      {BRAZILIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Criando...' : 'Criar minha conta'}</button>
              </div>
            )}
          </form>
          <p className="text-center text-gray-500 mt-6">Já tem conta? <Link to="/login" className="text-primary-600 font-semibold">Fazer login</Link></p>
        </div>
      </div>
    </div>
  );
}

function DashboardHome() {
  const { profile } = useAuth();
  const isEntrepreneur = profile?.user_type === 'entrepreneur';

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-primary-600 to-emerald-600 rounded-2xl p-6 sm:p-8 text-white">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Bem-vindo{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}!</h1>
        <p className="text-white/80">{isEntrepreneur ? 'Gerencie seus projetos e acompanhe os lances de investimento.' : 'Explore projetos e encontre oportunidades de investimento.'}</p>
      </motion.div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: isEntrepreneur ? 'Meus Projetos' : 'Projetos', value: '0', icon: Package, color: 'bg-blue-500' },
          { label: isEntrepreneur ? 'Lances Recebidos' : 'Meus Lances', value: '0', icon: DollarSign, color: 'bg-emerald-500' },
          { label: 'Pendentes', value: '0', icon: Clock, color: 'bg-amber-500' },
          { label: 'Financiados', value: '0', icon: CheckCircle, color: 'bg-green-500' },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white rounded-xl p-5 shadow-sm border">
            <div className={`${stat.color} w-10 h-10 rounded-lg flex items-center justify-center mb-3`}><stat.icon className="w-5 h-5 text-white" /></div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </motion.div>
        ))}
      </div>
      {isEntrepreneur && (
        <Link to="/dashboard/projetos/novo" className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700">
          <Plus className="w-5 h-5" /> Criar Novo Projeto
        </Link>
      )}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Oportunidades</h2>
        <Link to="/dashboard/projetos" className="flex items-center gap-4 p-4 bg-gradient-to-r from-primary-50 to-emerald-50 rounded-xl hover:from-primary-100 hover:to-emerald-100">
          <div className="w-12 h-12 rounded-xl bg-primary-600 flex items-center justify-center"><Package className="w-6 h-6 text-white" /></div>
          <div><p className="font-semibold text-gray-900">Ver Projetos Disponíveis</p><p className="text-sm text-gray-500">Explore negócios buscando investimento</p></div>
        </Link>
      </div>
    </div>
  );
}

function ProjectsPage() {
  const { profile } = useAuth();
  const isEntrepreneur = profile?.user_type === 'entrepreneur';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{isEntrepreneur ? 'Meus Projetos' : 'Projetos Disponíveis'}</h1>
          <p className="text-gray-500 mt-1">{isEntrepreneur ? 'Gerencie seus projetos' : 'Explore oportunidades de investimento'}</p>
        </div>
        {isEntrepreneur && <Link to="/dashboard/projetos/novo" className="btn-primary"><Plus className="w-5 h-5" /> Novo Projeto</Link>}
      </div>
      <div className="bg-white rounded-xl p-4 shadow-sm border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input type="text" placeholder="Buscar projetos..." className="input pl-10" />
        </div>
      </div>
      {!isEntrepreneur && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SAMPLE_PROJECTS.map((proj, i) => {
            const catIcons: Record<string, any> = { food_beverage: Coffee, technology: Briefcase, healthcare: Heart, education: GraduationCap, fashion: Shirt };
            const Icon = catIcons[proj.category] || Package;
            return (
              <motion.div key={proj.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white rounded-xl border shadow-sm p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center"><Icon className="w-6 h-6 text-primary-600" /></div>
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700">Ativo</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{proj.title}</h3>
                <p className="text-gray-500 text-sm mb-4">{proj.description}</p>
                <div className="flex items-center justify-between pt-4 border-t">
                  <div><p className="text-xs text-gray-500">Busca</p><p className="font-bold text-emerald-600">{formatCompactCurrency(proj.asking_amount)}</p></div>
                  <div className="text-right"><p className="text-xs text-gray-500">{proj.equity_offered}% equity</p><div className="flex items-center gap-1 text-gray-400 text-sm"><EyeIcon className="w-4 h-4" />{proj.views}</div></div>
                </div>
                <Link to={`/dashboard/projetos/${proj.id}`} className="btn-primary w-full mt-4 text-center text-sm py-2">Ver Detalhes</Link>
              </motion.div>
            );
          })}
        </div>
      )}
      {isEntrepreneur && (
        <div className="bg-white rounded-xl p-12 text-center border">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4"><Package className="w-8 h-8 text-gray-400" /></div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum projeto ainda</h3>
          <p className="text-gray-500 mb-6">Crie seu primeiro projeto para começar a receber lances.</p>
          <Link to="/dashboard/projetos/novo" className="btn-primary"><Plus className="w-5 h-5" /> Criar Projeto</Link>
        </div>
      )}
    </div>
  );
}

function NewProjectPage() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: '', category: '', asking_amount: '', equity_offered: '', short_description: '', full_description: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 2) { setStep(step + 1); return; }
    setLoading(true);
    const slug = form.title.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
    const { error } = await supabase.from('projects').insert({
      entrepreneur_id: profile?.id,
      title: form.title,
      slug,
      category: form.category,
      asking_amount: parseInt(form.asking_amount),
      equity_offered: form.equity_offered ? parseFloat(form.equity_offered) : null,
      short_description: form.short_description,
      full_description: form.full_description,
      status: 'active',
    });
    if (error) { toast.error('Erro ao criar projeto'); setLoading(false); return; }
    toast.success('Projeto criado com sucesso!');
    navigate('/dashboard/projetos');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6"><ArrowLeft className="w-4 h-4" /> Voltar</button>
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-6 bg-gray-50 border-b">
          <div className="flex items-center justify-between mb-2"><span className="text-sm font-medium text-gray-500">Passo {step} de 2</span><span className="text-sm font-medium text-primary-600">{step * 50}%</span></div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden"><div className="h-full bg-primary-600 rounded-full transition-all" style={{ width: `${step * 50}%` }} /></div>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Projeto *</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Ex: Café Especial Boutique" required className="input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoria *</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required className="input">
                  <option value="">Selecione</option>
                  <option value="food_beverage">Alimentação</option>
                  <option value="technology">Tecnologia</option>
                  <option value="healthcare">Saúde</option>
                  <option value="education">Educação</option>
                  <option value="fashion">Moda</option>
                  <option value="retail">Varejo</option>
                  <option value="services">Serviços</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Valor Solicitado (R$) *</label>
                <input type="number" value={form.asking_amount} onChange={(e) => setForm({ ...form, asking_amount: e.target.value })} placeholder="100000" required className="input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Equity Oferecida (%)</label>
                <input type="number" value={form.equity_offered} onChange={(e) => setForm({ ...form, equity_offered: e.target.value })} placeholder="10" className="input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição Curta *</label>
                <textarea value={form.short_description} onChange={(e) => setForm({ ...form, short_description: e.target.value })} placeholder="Uma frase que resuma seu negócio" required rows={2} maxLength={150} className="input" />
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-4">
              <button type="button" onClick={() => setStep(1)} className="flex items-center gap-2 text-gray-500 hover:text-gray-700"><ArrowLeft className="w-4 h-4" /> Voltar</button>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição Completa *</label>
                <textarea value={form.full_description} onChange={(e) => setForm({ ...form, full_description: e.target.value })} placeholder="Descreva seu negócio em detalhes..." required rows={6} className="input" />
              </div>
            </div>
          )}
          <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Salvando...' : step === 2 ? 'Criar Projeto' : 'Continuar'}</button>
        </form>
      </div>
    </div>
  );
}

function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [showBidModal, setShowBidModal] = useState(false);
  const [bidAmount, setBidAmount] = useState('');
  const [bidMessage, setBidMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const project = SAMPLE_PROJECTS.find(p => p.id === id);
  const isEntrepreneur = profile?.user_type === 'entrepreneur';

  if (!project) return <div className="text-center py-12"><p className="text-gray-500">Projeto não encontrado</p></div>;

  const catIcons: Record<string, any> = { food_beverage: Coffee, technology: Briefcase, healthcare: Heart, education: GraduationCap, fashion: Shirt };
  const Icon = catIcons[project.category] || Package;

  const handleBidSubmit = async () => {
    if (!profile || !bidAmount) return;
    setSubmitting(true);
    const { error } = await supabase.from('investment_bids').insert({
      project_id: project.id,
      investor_id: profile.id,
      amount: parseInt(bidAmount),
      message: bidMessage,
      status: 'pending',
    });
    if (error) { toast.error('Erro ao enviar lance'); setSubmitting(false); return; }
    toast.success('Lance enviado com sucesso!');
    setShowBidModal(false);
    setBidAmount('');
    setBidMessage('');
    setSubmitting(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-gray-700"><ArrowLeft className="w-4 h-4" /> Voltar</button>
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="bg-gradient-to-r from-primary-600 to-emerald-600 p-6 sm:p-8 text-white">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center"><Icon className="w-7 h-7" /></div>
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-white/20">{project.categoryLabel.toUpperCase()}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">{project.title}</h1>
              <p className="text-white/80">{project.description}</p>
            </div>
            <div className="text-right">
              <p className="text-white/60 text-sm">Valor solicitado</p>
              <p className="text-3xl font-bold">{formatCurrency(project.asking_amount)}</p>
              {project.equity_offered && <p className="text-white/80 mt-2">{project.equity_offered}% equity</p>}
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="flex gap-6 mb-8">
            <div className="flex items-center gap-2 text-gray-500"><EyeIcon className="w-4 h-4" />{project.views} visualizações</div>
            <div className="flex items-center gap-2 text-gray-500"><Clock className="w-4 h-4" />{project.bids} lances</div>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm">Ativo</span>
          </div>
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sobre o Empreendedor</h3>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-emerald-500 flex items-center justify-center text-white font-bold">{getInitials(project.entrepreneur.name)}</div>
              <div><p className="font-semibold text-gray-900">{project.entrepreneur.name}</p><p className="text-sm text-gray-500">{project.city}, {project.state}</p></div>
            </div>
          </div>
        </div>
      </div>
      {!isEntrepreneur && (
        <button onClick={() => setShowBidModal(true)} className="btn-primary w-full text-lg py-4"><DollarSign className="w-5 h-5" /> Fazer Lance de Investimento</button>
      )}
      {showBidModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Fazer Lance de Investimento</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Valor do Lance (R$)</label>
                <input type="number" value={bidAmount} onChange={(e) => setBidAmount(e.target.value)} placeholder="100000" className="input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mensagem para o Empreendedor</label>
                <textarea value={bidMessage} onChange={(e) => setBidMessage(e.target.value)} placeholder="Conte por que você quer investir..." rows={3} className="input" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowBidModal(false)} className="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl">Cancelar</button>
              <button onClick={handleBidSubmit} disabled={submitting || !bidAmount} className="flex-1 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 disabled:opacity-50">
                {submitting ? 'Enviando...' : <><Send className="w-4 h-4 inline mr-2" />Enviar Lance</>}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

function BidsPage() {
  const { profile } = useAuth();
  const isEntrepreneur = profile?.user_type === 'entrepreneur';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{isEntrepreneur ? 'Lances Recebidos' : 'Meus Lances'}</h1>
        <p className="text-gray-500 mt-1">{isEntrepreneur ? 'Gerencie os lances de investimento nos seus projetos' : 'Acompanhe os lances que você enviou'}</p>
      </div>
      <div className="bg-white rounded-xl p-12 text-center border">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4"><DollarSign className="w-8 h-8 text-gray-400" /></div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum lance ainda</h3>
        <p className="text-gray-500">{isEntrepreneur ? 'Quando investidores fizerem lances nos seus projetos, eles aparecerão aqui.' : 'Seus lances aparecerão aqui após você fazer ofertas.'}</p>
      </div>
    </div>
  );
}

function MessagesPage() {
  return (
    <div className="h-[calc(100vh-12rem)] flex bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="w-80 border-r hidden md:block">
        <div className="p-4 border-b"><h2 className="font-bold text-gray-900">Mensagens</h2></div>
        <div className="p-6 text-center text-gray-500"><MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" /><p>Nenhuma conversa ainda</p></div>
      </div>
      <div className="flex-grow flex items-center justify-center text-gray-500">
        <div className="text-center"><MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" /><p className="text-lg font-medium">Selecione uma conversa</p></div>
      </div>
    </div>
  );
}

// ============================================================================
// PAGE LOADERS
// ============================================================================

function PageLoader() {
  return <div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" /></div>;
}

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!user) return window.location.href = '/login', null;
  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (user) return window.location.href = '/dashboard', null;
  return <>{children}</>;
}

// ============================================================================
// MAIN APP
// ============================================================================

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/cadastro" element={<PublicRoute><SignupPage /></PublicRoute>} />
      <Route path="/dashboard" element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
        <Route index element={<DashboardHome />} />
        <Route path="projetos" element={<ProjectsPage />} />
        <Route path="projetos/novo" element={<NewProjectPage />} />
        <Route path="projetos/:id" element={<ProjectDetailPage />} />
        <Route path="lances" element={<BidsPage />} />
        <Route path="mensagens" element={<MessagesPage />} />
      </Route>
      <Route path="*" element={<HomePage />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ duration: 4000, style: { background: '#1f2937', color: '#fff', borderRadius: '12px' } }} />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
