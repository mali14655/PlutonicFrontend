import { useLocation, Link, useSearchParams } from 'react-router-dom';
import AnimateIn from '../components/AnimateIn';
import { PageContent } from '../components/PageLayout';

export default function BookingSuccess() {
  const [searchParams] = useSearchParams();
  const paidOnline = searchParams.get('paid') === '1';
  const state = useLocation().state as {
    ref: string;
    total: number;
    paymentMethod: string;
    whatsapp?: { sent: boolean; to: string; error?: string };
    receiptClickUrl?: string;
    settings?: {
      businessInfo: { iban: string; bankName: string; accountName: string; whatsapp: string; phone: string };
    };
  } | null;

  const ref = state?.ref || searchParams.get('ref');
  const total = state?.total;
  const paymentMethod = paidOnline ? 'stripe' : state?.paymentMethod;
  const whatsapp = state?.whatsapp;

  if (!ref) {
    return (
      <PageContent>
        <div className="premium-card-glow p-12 text-center">
          <Link to="/" className="text-plutonic-blue font-semibold hover:underline">Go home</Link>
        </div>
      </PageContent>
    );
  }

  const info = state?.settings?.businessInfo;

  return (
    <PageContent>
      <AnimateIn variant="fade-up" className="premium-card-glow p-8 md:p-10 text-center max-w-lg mx-auto mesh-sky-bg border border-sky-100">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mx-auto text-2xl font-bold">
          ✓
        </div>
        <h1 className="text-2xl font-bold text-plutonic-blue-dark mt-6">Booking confirmed</h1>
        <p className="text-gray-600 mt-2">
          Reference: <strong className="text-plutonic-blue-dark">{ref}</strong>
        </p>
        {total && <p className="text-xl font-bold text-plutonic-blue mt-2">AED {total}</p>}
        {paidOnline && <p className="text-green-600 text-sm mt-2">Payment received online.</p>}

        {whatsapp?.sent && (
          <p className="mt-6 text-green-700 text-sm bg-green-50 border border-green-200 rounded-xl p-4">
            WhatsApp confirmation sent to <strong>{whatsapp.to}</strong>
          </p>
        )}
        {whatsapp && !whatsapp.sent && (
          <p className="mt-6 text-amber-700 text-sm bg-amber-50 border border-amber-200 rounded-xl p-4">
            WhatsApp could not be sent to {whatsapp.to || 'your number'}.
            {whatsapp.error && <span className="block mt-1 text-xs">{whatsapp.error}</span>}
          </p>
        )}

        {paymentMethod === 'bank_transfer' && info && (
          <div className="mt-8 p-5 bg-sky-50 border border-sky-100 rounded-xl text-left text-sm">
            <h3 className="font-bold text-plutonic-blue-dark mb-2">Bank transfer details</h3>
            <p>Bank: {info.bankName}</p>
            <p>Account: {info.accountName}</p>
            <p>IBAN: {info.iban}</p>
            <p className="mt-4 font-medium text-plutonic-blue-dark">
              After transferring, send your payment receipt to our business WhatsApp (
              {info.phone || '+971 56 1615616'}). Mention booking {ref}.
            </p>
            {state?.receiptClickUrl && (
              <a
                href={state.receiptClickUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-primary !py-2 !px-4 !text-sm mt-4 inline-block"
              >
                Send receipt via WhatsApp
              </a>
            )}
          </div>
        )}

        {!whatsapp?.sent && !paidOnline && (
          <p className="mt-6 text-gray-600 text-sm">
            We will contact you on the phone number you provided if WhatsApp delivery fails.
          </p>
        )}

        <div className="flex flex-wrap justify-center gap-3 mt-8">
          <Link to="/" className="btn-outline">Back to home</Link>
          <Link to="/services" className="btn-primary">Browse services</Link>
        </div>
      </AnimateIn>
    </PageContent>
  );
}
