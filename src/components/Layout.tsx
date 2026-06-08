import { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import {
  Menu, X, User, Package, DollarSign,
  MessageSquare, Bell, LogOut, Settings, Users, Home,
  ChevronDown, Search,
} from 'lucide-react';
import { getInitials, formatRelativeTime } from '../lib/utils';
import { FAKE_ACTIVITY } from '../data/fakeData';
import { UpgradeModal } from './UpgradeModal';

function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const recent = FAKE_ACTIVITY.slice(0, 4);

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all">
        <Bell className="w-5 h-5" />
        <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden"
            >
              <div className="p-4 border-b bg-gray-50">
                <h3 className="font-semibold text-gray-900">Notificações</h3>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {recent.map((item) => (
                  <div key={item.id} className="px-4 py-3 hover:bg-gray-50 border-b last:border-0 cursor-pointer">
                    <p className="text-sm font-medium text-gray-900">{item.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                    <p className="text-xs text-gray-400 mt-1">{formatRelativeTime(item.created_at)}</p>
                  </div>
                ))}
              </div>
              <div className="p-3 bg-gray-50 border-t text-center">
                <button className="text-sm text-primary-600 font-medium hover:text-primary-700">Ver todas</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export function DashboardLayout() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const isEntrepreneur = profile?.user_type === 'entrepreneur';

  const navItems = isEntrepreneur
    ? [
        { label: 'Dashboard', href: '/dashboard', icon: Home },
        { label: 'Meus Projetos', href: '/dashboard/projetos', icon: Package },
        { label: 'Lances', href: '/dashboard/lances', icon: DollarSign },
        { label: 'Investidores', href: '/dashboard/investidores', icon: Users },
        { label: 'Mensagens', href: '/dashboard/mensagens', icon: MessageSquare },
      ]
    : [
        { label: 'Dashboard', href: '/dashboard', icon: Home },
        { label: 'Projetos', href: '/dashboard/projetos', icon: Package },
        { label: 'Meus Lances', href: '/dashboard/lances', icon: DollarSign },
        { label: 'Mensagens', href: '/dashboard/mensagens', icon: MessageSquare },
      ];

  const isActive = (href: string) => {
    if (href === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(href);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed top-0 left-0 bottom-0 w-72 bg-white border-r border-gray-100 z-50 transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-100">
          <Link to="/" className="flex items-center gap-2.5">
            <img src="/ChatGPT_Image_6_de_jun._de_2026,_01_49_09.png" alt="InvestConnect BR" className="w-9 h-9" />
            <div>
              <span className="font-bold text-lg text-gray-900 leading-none">InvestConnect</span>
              <span className="block text-[10px] font-semibold text-emerald-600 tracking-wider uppercase">BR</span>
            </div>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <nav className="p-3 space-y-0.5">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive(item.href)
                  ? 'bg-primary-50 text-primary-700 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className="w-[18px] h-[18px]" />
              {item.label}
              {item.href === '/dashboard/mensagens' && (
                <span className="ml-auto bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">3</span>
              )}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
          <div className="bg-gradient-to-r from-primary-50 to-emerald-50 rounded-xl p-4 mb-3">
            <p className="text-xs font-semibold text-primary-700 mb-1">Upgrade Pro</p>
            <p className="text-[11px] text-gray-600 mb-2">Desbloqueie recursos avancados e prioridade nos lances</p>
            <button onClick={() => setUpgradeOpen(true)} className="w-full py-1.5 bg-primary-600 text-white text-xs font-semibold rounded-lg hover:bg-primary-700 transition-colors">
              Saiba Mais
            </button>
          </div>
        </div>
      </aside>

      <div className="lg:pl-72 flex-grow flex flex-col min-h-screen">
        <header className="sticky top-0 bg-white/80 backdrop-blur-xl border-b border-gray-100 z-30 flex items-center justify-between h-16 px-4 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-xl"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            <div className="hidden sm:flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-2 w-64">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar projetos, investidores..."
                className="bg-transparent text-sm outline-none flex-1 placeholder:text-gray-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <NotificationDropdown />
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-2 p-1.5 hover:bg-gray-50 rounded-xl transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-emerald-500 flex items-center justify-center text-white text-sm font-bold shadow-sm">
                  {profile?.full_name ? getInitials(profile.full_name) : <User className="w-4 h-4" />}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900 leading-none">{profile?.full_name?.split(' ')[0]}</p>
                  <p className="text-[11px] text-gray-500">
                    {isEntrepreneur ? 'Empreendedor' : 'Investidor'}
                  </p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400 hidden md:block" />
              </button>

              <AnimatePresence>
                {profileMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setProfileMenuOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden py-2"
                    >
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="font-medium text-gray-900 text-sm">{profile?.full_name}</p>
                        <p className="text-xs text-gray-500">{profile?.email}</p>
                      </div>
                      <Link
                        to="/dashboard/configuracoes"
                        onClick={() => setProfileMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <Settings className="w-4 h-4" /> Configuracoes
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full"
                      >
                        <LogOut className="w-4 h-4" /> Sair
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        <main className="flex-grow p-4 lg:p-8">
          <Outlet />
        </main>
      </div>

      <UpgradeModal isOpen={upgradeOpen} onClose={() => setUpgradeOpen(false)} />
    </div>
  );
}
