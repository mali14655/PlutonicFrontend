import { Link, useNavigate, useLocation } from 'react-router-dom';
import PageTransition from '../PageTransition';
import AdminFcm from './AdminFcm';
import BrandLogo from '../BrandLogo';

const nav = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: '◫' },
  { to: '/admin/services', label: 'Services', icon: '◎' },
  { to: '/admin/settings', label: 'Settings', icon: '⚙' },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.removeItem('admin_token');
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-plutonic-surface flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col bg-plutonic-dark text-white shrink-0">
        <div className="p-6 border-b border-white/10">
          <BrandLogo to="/admin/dashboard" />
          <p className="text-[10px] uppercase tracking-widest text-plutonic-gold mt-3 font-semibold">Admin Panel</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                location.pathname.startsWith(n.to)
                  ? 'bg-plutonic-blue text-white shadow-lg shadow-plutonic-blue/30'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className="text-lg opacity-80">{n.icon}</span>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10 space-y-2">
          <Link to="/" className="block text-center text-sm text-white/60 hover:text-plutonic-gold transition py-2">
            View public site →
          </Link>
          <button
            onClick={logout}
            className="w-full text-sm bg-white/10 hover:bg-white/15 px-4 py-2.5 rounded-xl transition"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden bg-plutonic-dark text-white px-4 py-3 flex items-center justify-between">
          <BrandLogo to="/admin/dashboard" />
          <div className="flex gap-2">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className={`text-xs px-3 py-1.5 rounded-lg ${
                  location.pathname.startsWith(n.to) ? 'bg-plutonic-blue' : 'bg-white/10'
                }`}
              >
                {n.label}
              </Link>
            ))}
            <button onClick={logout} className="text-xs bg-white/10 px-3 py-1.5 rounded-lg">Exit</button>
          </div>
        </header>

        <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 lg:py-8">
          <AdminFcm />
          <PageTransition />
        </main>
      </div>
    </div>
  );
}
