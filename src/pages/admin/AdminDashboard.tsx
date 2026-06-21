import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { adminApi } from '../../api';
import AnimateIn, { StaggerGroup } from '../../components/AnimateIn';

interface Booking {
  _id: string;
  ref: string;
  customer: { name: string; phone: string; address: string };
  date: string;
  slotStart: string;
  slotEnd: string;
  total: number;
  paymentStatus: string;
  paymentMethod: string;
  status: string;
  subServices?: { name: string; price: number }[];
  rescheduleProposal?: {
    options: { date: string; slotStart: string; slotEnd: string }[];
    customerSelectedIndex?: number;
  };
}

interface Stats {
  newBookingsToday: number;
  confirmedToday: number;
  completedToday: number;
  revenueToday: number;
  pendingPayment: number;
}

interface MonthStats {
  total: number;
  completed: number;
  revenue: number;
  pendingPayment: number;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem('admin_token') || '';
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [today, setToday] = useState<Stats | null>(null);
  const [month, setMonth] = useState<MonthStats | null>(null);
  const [filter, setFilter] = useState('all');
  const [toast, setToast] = useState('');

  const load = async () => {
    const path = filter === 'all' ? '/admin/bookings' : `/admin/bookings?status=${filter}`;
    const b = await adminApi<Booking[]>(path, token);
    setBookings(b);
    setToday(await adminApi<Stats>('/admin/stats/today', token));
    const now = new Date();
    setMonth(
      await adminApi<MonthStats>(
        `/admin/stats/month?year=${now.getFullYear()}&month=${now.getMonth() + 1}`,
        token
      )
    );
  };

  useEffect(() => {
    if (!token) {
      navigate('/admin');
      return;
    }
    load().catch(() => navigate('/admin'));
  }, [token, navigate, filter]);

  useEffect(() => {
    if (!token) return;
    const id = setInterval(() => load().catch(console.error), 30000);
    return () => clearInterval(id);
  }, [token]);

  useEffect(() => {
    const onFcm = (e: Event) => {
      const msg = (e as CustomEvent<{ title?: string; body?: string }>).detail;
      setToast(`${msg.title}: ${msg.body}`);
      load();
    };
    window.addEventListener('plutonic-fcm', onFcm);
    return () => window.removeEventListener('plutonic-fcm', onFcm);
  }, [token]);

  const markPaid = async (id: string) => {
    await adminApi(`/admin/bookings/${id}/paid`, token, { method: 'PATCH' });
    load();
  };

  const markCompleted = async (id: string) => {
    await adminApi(`/admin/bookings/${id}/status`, token, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'completed' }),
    });
    load();
  };

  return (
    <div>
      {toast && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl text-sm">
          🔔 {toast}
        </div>
      )}
      {today && month && (
        <StaggerGroup className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8" stagger={80}>
          <div className="admin-stat-card">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Today revenue</p>
            <p className="text-3xl font-extrabold text-plutonic-blue mt-2">AED {today.revenueToday}</p>
          </div>
          <div className="admin-stat-card">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">New today</p>
            <p className="text-3xl font-extrabold text-plutonic-blue-dark mt-2">{today.newBookingsToday}</p>
          </div>
          <div className="admin-stat-card">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Completed today</p>
            <p className="text-3xl font-extrabold text-plutonic-blue-dark mt-2">{today.completedToday}</p>
          </div>
          <div className="admin-stat-card">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Month revenue</p>
            <p className="text-3xl font-extrabold text-plutonic-blue mt-2">AED {month.revenue}</p>
          </div>
        </StaggerGroup>
      )}

      <AnimateIn variant="fade-up" delay={100}>
        <div className="flex gap-2 mb-6 flex-wrap">
        {['all', 'confirmed', 'completed', 'reschedule_pending', 'pending_payment', 'cancelled'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`pill ${filter === f ? 'pill-active' : 'pill-inactive'}`}
          >
            {f.replace('_', ' ')}
          </button>
        ))}
        </div>
      </AnimateIn>

      <AnimateIn variant="fade-up" delay={150}>
        <div className="admin-panel">
          <table className="admin-table w-full text-sm">
            <thead>
              <tr>
                <th>Ref</th>
                <th>Customer</th>
                <th>Schedule</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id}>
                  <td>
                    <Link
                      to={`/admin/bookings/${b._id}`}
                      className="font-mono text-xs text-plutonic-blue hover:underline font-semibold"
                    >
                      {b.ref}
                    </Link>
                  </td>
                  <td>
                    <div className="font-medium">{b.customer.name}</div>
                    <div className="text-gray-500 text-xs">{b.customer.phone}</div>
                  </td>
                  <td>{b.date} {b.slotStart}-{b.slotEnd}</td>
                  <td className="font-bold text-plutonic-blue">AED {b.total}</td>
                  <td>
                    <span className="block">{b.status}</span>
                    <span
                      className={
                        b.paymentStatus === 'paid' ? 'text-green-600 text-xs' : 'text-amber-600 text-xs'
                      }
                    >
                      {b.paymentStatus} · {b.paymentMethod}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-2 flex-wrap">
                      {b.paymentStatus !== 'paid' && (
                        <button
                          onClick={() => markPaid(b._id)}
                          className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded"
                        >
                          Paid
                        </button>
                      )}
                      {b.status !== 'completed' && b.status !== 'cancelled' && (
                        <button
                          onClick={() => markCompleted(b._id)}
                          className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                        >
                          Done
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {bookings.length === 0 && (
            <p className="p-8 text-center text-gray-500">No bookings.</p>
          )}
        </div>
      </AnimateIn>
    </div>
  );
}
