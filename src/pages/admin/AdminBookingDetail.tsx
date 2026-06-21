import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminApi } from '../../api';

interface Booking {
  _id: string;
  ref: string;
  customer: { name: string; phone: string; email?: string; address: string; notes?: string };
  date: string;
  slotStart: string;
  slotEnd: string;
  total: number;
  subtotal: number;
  discount: number;
  paymentStatus: string;
  paymentMethod: string;
  status: string;
  subServices: { name: string; price: number; durationMinutes: number }[];
  rescheduleProposal?: {
    options: { date: string; slotStart: string; slotEnd: string }[];
    customerSelectedIndex?: number;
    token?: string;
  };
}

export default function AdminBookingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('admin_token') || '';
  const [booking, setBooking] = useState<Booking | null>(null);
  const [rescheduleOptions, setRescheduleOptions] = useState<
    { date: string; slotStart: string; slotEnd: string }[]
  >([{ date: '', slotStart: '', slotEnd: '' }]);
  const [rescheduleUrl, setRescheduleUrl] = useState('');
  const [whatsappStatus, setWhatsappStatus] = useState<{ sent: boolean; to: string; error?: string } | null>(null);

  useEffect(() => {
    if (!token || !id) {
      navigate('/admin');
      return;
    }
    adminApi<Booking>(`/admin/bookings/${id}`, token).then(setBooking).catch(() => navigate('/admin/dashboard'));
  }, [id, token, navigate]);

  const addOption = () => {
    setRescheduleOptions([...rescheduleOptions, { date: '', slotStart: '', slotEnd: '' }]);
  };

  const updateOption = (i: number, field: string, value: string) => {
    const next = [...rescheduleOptions];
    next[i] = { ...next[i], [field]: value };
    if (field === 'slotStart' && value && !next[i].slotEnd) {
      const [h, m] = value.split(':').map(Number);
      const endH = h + 1;
      next[i].slotEnd = `${String(endH).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    }
    setRescheduleOptions(next);
  };

  const sendReschedule = async () => {
    const valid = rescheduleOptions.filter((o) => o.date && o.slotStart && o.slotEnd);
    if (!valid.length || !id) return;
    const res = await adminApi<{
      rescheduleUrl: string;
      whatsapp: { sent: boolean; to: string; error?: string };
    }>(`/admin/bookings/${id}/reschedule`, token, {
      method: 'POST',
      body: JSON.stringify({ options: valid }),
    });
    setRescheduleUrl(res.rescheduleUrl);
    setWhatsappStatus(res.whatsapp);
    const updated = await adminApi<Booking>(`/admin/bookings/${id}`, token);
    setBooking(updated);
  };

  const confirmReschedule = async () => {
    if (!id) return;
    const res = await adminApi<{ booking: Booking; whatsapp: { sent: boolean; to: string; error?: string } }>(
      `/admin/bookings/${id}/confirm-reschedule`,
      token,
      { method: 'POST' }
    );
    setBooking(res.booking);
    setWhatsappStatus(res.whatsapp);
    setRescheduleUrl('');
  };

  if (!booking) return <p>Loading...</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-plutonic-blue-dark">Booking {booking.ref}</h1>
        <button onClick={() => navigate('/admin/dashboard')} className="text-sm text-plutonic-blue">← Back</button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="premium-card p-6 space-y-3">
          <h2 className="font-bold">Customer</h2>
          <p><strong>{booking.customer.name}</strong></p>
          <p>{booking.customer.phone}</p>
          <p>{booking.customer.email}</p>
          <p>{booking.customer.address}</p>
          {booking.customer.notes && <p className="text-gray-600 text-sm">{booking.customer.notes}</p>}
        </div>

        <div className="premium-card p-6 space-y-3">
          <h2 className="font-bold">Schedule</h2>
          <p>{booking.date}</p>
          <p>{booking.slotStart} – {booking.slotEnd}</p>
          <p>Status: <strong>{booking.status}</strong></p>
          <p>Payment: {booking.paymentStatus} ({booking.paymentMethod})</p>
          <p className="text-xl font-bold text-plutonic-blue">AED {booking.total}</p>
        </div>
      </div>

      <div className="premium-card p-6">
        <h2 className="font-bold mb-3">Services</h2>
        <ul className="space-y-1 text-sm">
          {booking.subServices.map((s, i) => (
            <li key={i}>{s.name} — AED {s.price} ({s.durationMinutes} min)</li>
          ))}
        </ul>
        {booking.discount > 0 && <p className="text-sm text-green-600 mt-2">Discount: -AED {booking.discount}</p>}
      </div>

      {booking.status === 'reschedule_pending' && booking.rescheduleProposal && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <h2 className="font-bold mb-2">Customer selection</h2>
          {booking.rescheduleProposal.customerSelectedIndex !== undefined ? (
            <p>
              Selected option {booking.rescheduleProposal.customerSelectedIndex + 1}:{' '}
              {JSON.stringify(booking.rescheduleProposal.options[booking.rescheduleProposal.customerSelectedIndex])}
            </p>
          ) : (
            <p className="text-gray-600">Waiting for customer to pick a slot.</p>
          )}
          {booking.rescheduleProposal.customerSelectedIndex !== undefined && (
            <button
              onClick={confirmReschedule}
              className="mt-3 bg-plutonic-blue text-white px-4 py-2 rounded-lg text-sm font-semibold"
            >
              Confirm new time & send WhatsApp
            </button>
          )}
        </div>
      )}

      <div className="premium-card p-6">
        <h2 className="font-bold mb-4">Reschedule — send options to customer</h2>
        <p className="text-sm text-gray-600 mb-4">Add multiple time options. Customer gets WhatsApp link to pick one.</p>
        {rescheduleOptions.map((opt, i) => (
          <div key={i} className="flex flex-wrap gap-2 mb-3">
            <input type="date" className="border rounded-lg px-2 py-1 text-sm" value={opt.date}
              onChange={(e) => updateOption(i, 'date', e.target.value)} />
            <input type="time" className="border rounded-lg px-2 py-1 text-sm" value={opt.slotStart}
              onChange={(e) => updateOption(i, 'slotStart', e.target.value)} />
            <input type="time" className="border rounded-lg px-2 py-1 text-sm" value={opt.slotEnd}
              onChange={(e) => updateOption(i, 'slotEnd', e.target.value)} />
          </div>
        ))}
        <div className="flex gap-2 mt-4">
          <button onClick={addOption} className="text-sm border px-3 py-1 rounded-lg">+ Add option</button>
          <button onClick={sendReschedule} className="text-sm bg-plutonic-blue text-white px-4 py-2 rounded-lg font-semibold">
            Send options via WhatsApp
          </button>
        </div>
        {rescheduleUrl && (
          <div className="mt-4 text-sm">
            {whatsappStatus?.sent ? (
              <p className="text-green-700">
                WhatsApp sent to customer <strong>{whatsappStatus.to}</strong>
              </p>
            ) : (
              <p className="text-red-600">
                WhatsApp failed to {whatsappStatus?.to || booking.customer.phone}
                {whatsappStatus?.error && `: ${whatsappStatus.error}`}
              </p>
            )}
            <p className="mt-2 text-gray-600">
              Reschedule link: <a href={rescheduleUrl} className="underline text-plutonic-blue">{rescheduleUrl}</a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
