import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api';
import BrandLogo from '../../components/BrandLogo';
import AnimateIn from '../../components/AnimateIn';
import { images } from '../../lib/images';

export default function AdminLogin() {
  const [email, setEmail] = useState('admin@plutonic.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await api<{ token: string }>('/admin/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem('admin_token', data.token);
      navigate('/admin/dashboard');
    } catch {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img src={images.adminBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-plutonic-dark/90 to-plutonic-blue-dark/80" />
        <div className="relative z-10 flex flex-col justify-center p-12 text-white hero-stagger">
          <h2 className="text-4xl font-extrabold leading-tight">
            Manage bookings,<br />
            <span className="text-plutonic-gold">grow your business</span>
          </h2>
          <p className="mt-4 text-white/70 max-w-md leading-relaxed">
            Real-time notifications, WhatsApp integration, and full service management from one premium dashboard.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 bg-plutonic-surface">
        <AnimateIn variant="scale" className="w-full max-w-md">
        <form onSubmit={submit} className="premium-card premium-card-3d p-8 md:p-10 w-full">
          <BrandLogo className="mb-8" light={false} />
          <h1 className="text-2xl font-bold text-plutonic-blue-dark">Welcome back</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to your admin account</p>
          {error && (
            <p className="mt-4 text-red-600 text-sm bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</p>
          )}
          <div className="mt-6 space-y-4">
            <input
              className="input-premium"
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="input-premium"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-primary w-full mt-6">
            Sign in
          </button>
        </form>
        </AnimateIn>
      </div>
    </div>
  );
}
