import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { api } from '../api';
import AnimateIn from '../components/AnimateIn';
import { ConfirmationPanel, NoticeBanner } from '../components/FeedbackMessages';
import { PageContent, PageShell } from '../components/PageLayout';

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
  const [error, setError] = useState('');

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
        .catch(() => {
          setError('This link may have expired or already been used.');
          setLoading(false);
        })
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
    setError('');
    try {
      await api(`/bookings/reschedule/${token}/select`, {
        method: 'POST',
        body: JSON.stringify({ optionIndex: selected }),
      });
      setDone(true);
    } catch (err) {
      setError((err as Error).message || 'Could not save your selection. Please try again.');
    }
  };

  if (loading) {
    return (
      <PageContent>
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <div className="w-10 h-10 rounded-full border-4 border-plutonic-blue/20 border-t-plutonic-blue animate-spin" />
          <p className="text-sm text-gray-500">Loading your reschedule options…</p>
        </div>
      </PageContent>
    );
  }

  if (!data && !done) {
    return (
      <PageContent narrow>
        <AnimateIn variant="fade-up">
          <ConfirmationPanel
            variant="error"
            eyebrow="Reschedule"
            title="Link unavailable"
            description="This reschedule link is invalid or has expired. Please check your WhatsApp message for a fresh link, or contact us directly."
            actions={
              <>
                <Link to="/" className="btn-outline">
                  Go home
                </Link>
                <Link to="/contact" className="btn-primary">
                  Contact us
                </Link>
              </>
            }
          />
        </AnimateIn>
      </PageContent>
    );
  }

  if (done) {
    const selectedOption =
      data && selected !== null ? data.options[selected] : data?.options[data.customerSelectedIndex ?? -1];

    return (
      <PageContent narrow>
        <AnimateIn variant="fade-up">
          <ConfirmationPanel
            variant="success"
            eyebrow="Reschedule"
            title="Time slot selected"
            description="We have received your preferred time. Our team will confirm the final appointment shortly."
            details={[
              ...(data?.ref ? [{ label: 'Booking', value: data.ref }] : []),
              ...(selectedOption
                ? [
                    { label: 'Date', value: selectedOption.date },
                    {
                      label: 'Time',
                      value: `${selectedOption.slotStart} – ${selectedOption.slotEnd}`,
                    },
                  ]
                : []),
            ]}
            actions={
              <Link to="/" className="btn-primary">
                Back to home
              </Link>
            }
          >
            <NoticeBanner variant="info" title="Confirmation via WhatsApp">
              You will receive a WhatsApp message once your new appointment time is confirmed. If you do not
              hear from us within 24 hours, please call us at +971 56 1615616.
            </NoticeBanner>
          </ConfirmationPanel>
        </AnimateIn>
      </PageContent>
    );
  }

  return (
    <PageShell narrow>
      <AnimateIn variant="blur-up" className="mb-8">
        <h1 className="section-title">Reschedule {data!.ref}</h1>
        <p className="section-subtitle mt-2">Choose your preferred time from the options below.</p>
      </AnimateIn>

      {error && (
        <NoticeBanner variant="error" title="Something went wrong" className="mb-4">
          {error}
        </NoticeBanner>
      )}

      <div className="premium-card-glow p-4 sm:p-6 space-y-3">
        {data!.options.map((opt, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setSelected(i)}
            className={`w-full p-4 border rounded-xl text-left transition-all ${
              selected === i
                ? 'border-sky-400 bg-sky-50 shadow-md shadow-sky-200/50 ring-2 ring-sky-200/60'
                : 'border-sky-100 hover:border-sky-300 hover:bg-sky-50/50'
            }`}
          >
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-plutonic-blue text-white text-sm font-bold mr-2">
              {i + 1}
            </span>
            <span className="font-semibold text-plutonic-blue-dark">{opt.date}</span>
            <span className="text-gray-600">
              {' '}
              — {opt.slotStart} to {opt.slotEnd}
            </span>
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
