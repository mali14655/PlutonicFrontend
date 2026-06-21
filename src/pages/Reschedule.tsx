import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { api } from '../api';
import AnimateIn from '../components/AnimateIn';
import { EmptyState, PageContent, PageShell } from '../components/PageLayout';

export default function Reschedule() {
  const { token } = useParams();
  const [searchParams] = useSearchParams();
  const [data, setData] = useState<{
    ref: string;
    options: { date: string; slotStart: string; slotEnd: string }[];
    customerSelectedIndex?: number;
  } | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [done, setDone] = useState(searchParams.get('done') === '1');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const pick = searchParams.get('pick');
    if (pick !== null && pick !== '') {
      const idx = Number(pick);
      api(`/bookings/reschedule/${token}/select`, {
        method: 'POST',
        body: JSON.stringify({ optionIndex: idx }),
      })
        .then(() => setDone(true))
        .catch(() => setLoading(false))
        .finally(() => setLoading(false));
      return;
    }

    api<{
      ref: string;
      options: { date: string; slotStart: string; slotEnd: string }[];
      customerSelectedIndex?: number;
    }>(`/bookings/reschedule/${token}`)
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [token, searchParams]);

  const submit = async () => {
    if (selected === null || !token) return;
    await api(`/bookings/reschedule/${token}/select`, {
      method: 'POST',
      body: JSON.stringify({ optionIndex: selected }),
    });
    setDone(true);
  };

  if (loading) {
    return (
      <PageContent>
        <div className="flex justify-center py-16">
          <div className="w-10 h-10 rounded-full border-4 border-plutonic-blue/20 border-t-plutonic-blue animate-spin" />
        </div>
      </PageContent>
    );
  }

  if (!data && !done) {
    return <EmptyState>Invalid or expired link.</EmptyState>;
  }

  if (done) {
    return (
      <PageContent>
        <AnimateIn variant="fade-up" className="premium-card-glow p-8 md:p-10 text-center max-w-md mx-auto mesh-sky-bg border border-sky-100">
          <div className="w-14 h-14 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center mx-auto text-xl font-bold">
            ✓
          </div>
          <h1 className="text-xl font-bold text-plutonic-blue-dark mt-5">Selection received</h1>
          <p className="text-gray-600 mt-2">
            {data ? `Booking ${data.ref}: ` : ''}We will confirm your new time shortly via WhatsApp.
          </p>
        </AnimateIn>
      </PageContent>
    );
  }

  return (
    <PageShell narrow>
      <AnimateIn variant="blur-up" className="mb-8">
        <h1 className="section-title">Reschedule {data!.ref}</h1>
        <p className="section-subtitle mt-2">Tap your preferred time</p>
      </AnimateIn>

      <div className="premium-card-glow p-6 space-y-3">
        {data!.options.map((opt, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setSelected(i)}
            className={`w-full p-4 border rounded-xl text-left transition-all ${
              selected === i
                ? 'border-sky-400 bg-sky-50 shadow-md shadow-sky-200/50'
                : 'border-sky-100 hover:border-sky-300 hover:bg-sky-50/50'
            }`}
          >
            <span className="inline-block w-7 h-7 rounded-full bg-plutonic-blue text-white text-sm font-bold text-center leading-7 mr-2">
              {i + 1}
            </span>
            <span className="font-semibold text-plutonic-blue-dark">{opt.date}</span>
            <span className="text-gray-600"> — {opt.slotStart} to {opt.slotEnd}</span>
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={submit}
        disabled={selected === null}
        className="btn-primary w-full mt-6 disabled:opacity-50"
      >
        Confirm selection
      </button>
    </PageShell>
  );
}
