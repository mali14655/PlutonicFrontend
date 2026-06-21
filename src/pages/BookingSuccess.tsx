import { useLocation, Link, useSearchParams } from 'react-router-dom';
import AnimateIn from '../components/AnimateIn';
import {
  ConfirmationPanel,
  InfoBlock,
  NextStepsList,
  NoticeBanner,
  PAYMENT_LABELS,
} from '../components/FeedbackMessages';
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
  const info = state?.settings?.businessInfo;

  if (!ref) {
    return (
      <PageContent narrow>
        <AnimateIn variant="fade-up">
          <ConfirmationPanel
            variant="warning"
            eyebrow="Booking"
            title="Reference not found"
            description="We could not load your booking details. If you just completed a booking, check your WhatsApp or email for your reference number."
            actions={
              <Link to="/" className="btn-primary">
                Back to home
              </Link>
            }
          />
        </AnimateIn>
      </PageContent>
    );
  }

  const paymentLabel = paymentMethod ? PAYMENT_LABELS[paymentMethod] || paymentMethod : undefined;

  const nextSteps: string[] = [];
  if (whatsapp?.sent) {
    nextSteps.push('Check WhatsApp for your full booking confirmation and service details.');
  } else {
    nextSteps.push('We will contact you on the phone number you provided to confirm your booking.');
  }
  if (paymentMethod === 'bank_transfer') {
    nextSteps.push('Complete your bank transfer and send the receipt via WhatsApp (details below).');
  } else if (paymentMethod === 'cash') {
    nextSteps.push('Our team will arrive at your scheduled time — payment is collected on arrival.');
  } else if (paidOnline || paymentMethod === 'stripe') {
    nextSteps.push('Your payment has been received. No further payment action is needed.');
  }
  nextSteps.push('Need to change your appointment? Reply to our WhatsApp message or call us anytime.');

  const details = [
    { label: 'Reference', value: ref, highlight: false },
    ...(total ? [{ label: 'Total', value: `AED ${total}`, highlight: true as const }] : []),
    ...(paymentLabel ? [{ label: 'Payment', value: paymentLabel, highlight: false as const }] : []),
  ];

  return (
    <PageContent narrow>
      <AnimateIn variant="fade-up">
        <ConfirmationPanel
          variant="success"
          eyebrow="All set"
          title="Booking confirmed"
          description="Thank you for choosing Plutonic. Your request has been received and our team is preparing for your visit."
          details={details}
          actions={
            <>
              <Link to="/" className="btn-outline">
                Back to home
              </Link>
              <Link to="/services" className="btn-primary">
                Browse services
              </Link>
            </>
          }
        >
          {paidOnline && (
            <NoticeBanner variant="success" title="Payment received">
              Your online payment was processed successfully. A receipt will be included in your confirmation.
            </NoticeBanner>
          )}

          {whatsapp?.sent && (
            <NoticeBanner variant="success" title="WhatsApp confirmation sent">
              A detailed confirmation has been sent to <strong>{whatsapp.to}</strong>. Please keep this
              message for your records.
            </NoticeBanner>
          )}

          {whatsapp && !whatsapp.sent && (
            <NoticeBanner variant="warning" title="WhatsApp delivery pending">
              We could not deliver a WhatsApp message to {whatsapp.to || 'your number'}.
              {whatsapp.error && (
                <span className="block mt-1.5 text-xs text-amber-800/80">{whatsapp.error}</span>
              )}
              <span className="block mt-1.5">Our team will reach out by phone to confirm your booking.</span>
            </NoticeBanner>
          )}

          {paymentMethod === 'bank_transfer' && info && (
            <InfoBlock title="Bank transfer details">
              <p>
                <span className="text-gray-500">Bank:</span> {info.bankName}
              </p>
              <p>
                <span className="text-gray-500">Account name:</span> {info.accountName}
              </p>
              <p>
                <span className="text-gray-500">IBAN:</span>{' '}
                <span className="font-mono text-plutonic-blue-dark">{info.iban}</span>
              </p>
              <p className="!mt-4 font-medium text-plutonic-blue-dark">
                After transferring, send your payment receipt to our business WhatsApp (
                {info.phone || '+971 56 1615616'}). Please mention booking reference{' '}
                <strong>{ref}</strong>.
              </p>
              {state?.receiptClickUrl && (
                <a
                  href={state.receiptClickUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary !py-2.5 !px-5 !text-sm mt-4 inline-flex"
                >
                  Send receipt via WhatsApp
                </a>
              )}
            </InfoBlock>
          )}

          <InfoBlock title="What happens next">
            <NextStepsList steps={nextSteps} />
          </InfoBlock>
        </ConfirmationPanel>
      </AnimateIn>
    </PageContent>
  );
}
