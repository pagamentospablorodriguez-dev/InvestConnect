import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DashboardLayout } from './components/Layout';
import LandingPage from './pages/Landing';
import { LoginPage, SignupPage } from './pages/Auth';
import DashboardHome from './pages/DashboardHome';
import { ProjectsPage, ProjectDetailPage, NewProjectPage } from './pages/Projects';
import BidsPage from './pages/Bids';
import MessagesPage from './pages/Messages';
import InvestorsPage from './pages/Investors';
import InvestorDetailPage from './pages/InvestorDetail';
import SettingsPage from './pages/Settings';

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400 text-sm">Carregando...</p>
      </div>
    </div>
  );
}

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (user) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/cadastro" element={<PublicRoute><SignupPage /></PublicRoute>} />
      <Route path="/dashboard" element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
        <Route index element={<DashboardHome />} />
        <Route path="projetos" element={<ProjectsPage />} />
        <Route path="projetos/novo" element={<NewProjectPage />} />
        <Route path="projetos/:id" element={<ProjectDetailPage />} />
        <Route path="lances" element={<BidsPage />} />
        <Route path="investidores" element={<InvestorsPage />} />
        <Route path="investidores/:id" element={<InvestorDetailPage />} />
        <Route path="mensagens" element={<MessagesPage />} />
        <Route path="configuracoes" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1f2937',
              color: '#fff',
              borderRadius: '12px',
              fontSize: '14px',
            },
            success: {
              iconTheme: { primary: '#10b981', secondary: '#fff' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#fff' },
            },
          }}
        />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
