import { useState } from 'react';
import AdminDashboard from './components/AdminDashboard';
import Catalog from './components/Catalog';
import Header from './components/Header';
import Hero from './components/Hero';
import LoginModal from './components/LoginModal';
import { useAuth } from './context/AuthContext';
import useProducts from './hooks/useProducts';

export default function App() {
  const { isAuthenticated, login, logout } = useAuth();
  const { products, loading, error, reload, addProduct, removeProduct } = useProducts();
  const [view, setView] = useState('store'); // 'store' | 'admin'
  const [loginOpen, setLoginOpen] = useState(false);

  const showAdmin = isAuthenticated && view === 'admin';

  const handleAdminClick = () => {
    if (isAuthenticated) setView('admin');
    else setLoginOpen(true);
  };

  const handleLogin = async (credentials) => {
    await login(credentials);
    setLoginOpen(false);
    setView('admin');
  };

  const handleLogout = () => {
    logout();
    setView('store');
  };

  if (showAdmin) {
    return (
      <AdminDashboard
        products={products}
        onCreate={addProduct}
        onDelete={removeProduct}
        onLogout={handleLogout}
        onBackToStore={() => setView('store')}
      />
    );
  }

  return (
    <>
      <a
        href="#catalogo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:shadow-lg"
      >
        Pular para o catálogo
      </a>
      <Header isAuthenticated={isAuthenticated} onAdminClick={handleAdminClick} />
      <main>
        <Hero />
        <Catalog products={products} loading={loading} error={error} onRetry={reload} />
      </main>
      <footer className="border-t border-ink/10 py-8 text-center text-sm text-ink/70">
        © {new Date().getFullYear()} Jaca 3D · Feito camada por camada
      </footer>
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} onSubmit={handleLogin} />
    </>
  );
}
