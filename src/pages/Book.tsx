import { useEffect, useState } from 'react';
import { useNavigate, useLocation as useRouterLocation } from 'react-router-dom';
import { api } from '../api';
import { useLocation } from '../context/LocationContext';
import { EmptyState, PageContent, PageHeader } from '../components/PageLayout';
import BookServicePicker, { type CategoryGroup } from '../components/BookServicePicker';
import BookingDatePicker, { toYmd } from '../components/BookingDatePicker';

const STEPS = [
  { id: 1, label: 'Services' },
  { id: 2, label: 'Schedule & details' },
  { id: 3, label: 'Payment' },
] as const;

function OrderSummary({
  locationLabel,
  selectedItems,
  subtotal,
  discount,
  discountPct,
  minServices,
  total,
  date,
  slotStart,
  customerName,
}: {
  locationLabel: string;
  selectedItems: { _id: string; name: string; priceAed: number | null; durationMinutes: number }[];
  subtotal: number;
  discount: number;
  discountPct: number;
  minServices: number;
  total: number;
  date: string;
  slotStart: string;
  customerName: string;
}) {
  const selectedCount = selectedItems.length;
  const servicesNeeded = Math.max(0, minServices - selectedCount);
  const discountActive = discountPct > 0 && selectedCount >= minServices;

  return (
    <div className="premium-card-glow p-6 lg:sticky lg:top-24">
      <h2 className="font-bold text-lg text-plutonic-blue-dark pb-4 border-b border-sky-100">
        Order summary
      </h2>

      {discountPct > 0 && (
        <div
          className={`mt-4 rounded-xl border px-4 py-3 text-sm ${
            discountActive
              ? 'border-green-200 bg-green-50'
              : 'border-sky-200 bg-sky-50/80'
          }`}
        >
          <p className="font-semibold text-plutonic-blue-dark">Multi-service discount</p>
          <p className={`mt-1 ${discountActive ? 'text-green-700' : 'text-gray-600'}`}>
            {discountActive
              ? `You're saving ${discountPct}% by booking ${selectedCount} services together.`
              : selectedCount === 0
                ? `Book ${minServices} or more services in one order to save ${discountPct}%.`
                : `Add ${servicesNeeded} more service${servicesNeeded !== 1 ? 's' : ''} to unlock ${discountPct}% off your total.`}
          </p>
        </div>
      )}

      <div className="mt-4 space-y-3 text-sm">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Location</p>
          <p className="text-plutonic-blue-dark font-medium mt-0.5">{locationLabel}</p>
        </div>

        {selectedItems.length > 0 ? (
          <div className="space-y-2 pt-2 border-t border-sky-100">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Services</p>
            {selectedItems.map((s) => (
              <div key={s._id} className="flex justify-between gap-3">
                <span className="text-gray-700">{s.name}</span>
                <span className="font-semibold text-plutonic-blue shrink-0">
                  {s.priceAed ? `AED ${s.priceAed}` : '—'}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm pt-2">No services selected yet.</p>
        )}

        {(date || slotStart) && (
          <div className="pt-2 border-t border-sky-100">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Schedule</p>
            {date && <p className="text-gray-700 mt-0.5">{date}</p>}
            {slotStart && <p className="text-plutonic-blue font-medium">{slotStart}</p>}
          </div>
        )}

        {customerName && (
          <div className="pt-2 border-t border-sky-100">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Contact</p>
            <p className="text-gray-700 mt-0.5">{customerName}</p>
          </div>
        )}
      </div>

      {selectedItems.length > 0 && (
        <div className="mt-6 pt-4 border-t border-sky-200 space-y-2 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>AED {subtotal}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount ({discountPct}%)</span>
              <span>-AED {discount}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-lg text-plutonic-blue pt-2">
            <span>Total</span>
            <span>AED {total}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Book() {
  const { location } = useLocation();
  const navigate = useNavigate();
  const routerState = useRouterLocation().state as { subServiceSlug?: string } | null;

  const [step, setStep] = useState(1);
  const [groups, setGroups] = useState<CategoryGroup[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [date, setDate] = useState('');
  const [slotStart, setSlotStart] = useState('');
  const [slots, setSlots] = useState<string[]>([]);
  const [customer, setCustomer] = useState({ name: '', phone: '', email: '', address: '', notes: '' });
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'bank_transfer' | 'stripe'>('cash');
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<{
    customDiscountPercent: number;
    customDiscountMinServices: number;
    businessInfo: { iban: string; bankName: string; accountName: string; whatsapp: string };
  } | null>(null);

  const allServices = groups.flatMap((g) => g.subServices);
  const selectedItems = allServices.filter((s) => selected.has(s._id));

  const totalDuration = selectedItems.reduce((sum, s) => sum + s.durationMinutes, 0);
  const subtotal = selectedItems.reduce((sum, s) => sum + (s.priceAed || 0), 0);
  const discountPct = settings?.customDiscountPercent ?? 0;
  const minServices = settings?.customDiscountMinServices ?? 2;
  const discount = selected.size >= minServices ? Math.round((subtotal * discountPct) / 100) : 0;
  const total = subtotal - discount;

  useEffect(() => {
    if (!location?.cityId) return;
    api<CategoryGroup[]>(`/sub-services/with-prices?cityId=${location.cityId}`).then((data) => {
      setGroups(data);
      if (routerState?.subServiceSlug) {
        const match = data.flatMap((g) => g.subServices).find((s) => s.slug === routerState.subServiceSlug);
        if (match) setSelected(new Set([match._id]));
      }
    });
    api<{
      customDiscountPercent: number;
      customDiscountMinServices: number;
      businessInfo: { iban: string; bankName: string; accountName: string; whatsapp: string };
    }>('/settings/public').then(setSettings);
  }, [location?.cityId, routerState?.subServiceSlug]);

  useEffect(() => {
    if (!date || totalDuration === 0) {
      setSlots([]);
      return;
    }
    api<{ slots: string[] }>(`/slots?date=${date}&durationMinutes=${totalDuration}`).then((r) =>
      setSlots(r.slots)
    );
  }, [date, totalDuration]);

  const toggle = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
    setSlotStart('');
  };

  const canContinueStep1 = selected.size > 0;
  const canContinueStep2 =
    Boolean(date && slotStart && customer.name.trim() && customer.phone.trim() && customer.address.trim());

  const submit = async () => {
    if (!location || selected.size === 0 || !date || !slotStart) return;
    setLoading(true);
    try {
      const result = await api<{
        booking: { ref: string; total: number };
        cityName: string;
        checkoutUrl?: string;
        whatsapp?: { sent: boolean; to: string; error?: string };
        receiptClickUrl?: string;
      }>('/bookings', {
        method: 'POST',
        body: JSON.stringify({
          cityId: location.cityId,
          date,
          slotStart,
          subServiceIds: Array.from(selected),
          customer,
          paymentMethod,
        }),
      });
      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
        return;
      }
      navigate('/booking/success', {
        state: {
          ref: result.booking.ref,
          total: result.booking.total,
          paymentMethod,
          settings,
          whatsapp: result.whatsapp,
          receiptClickUrl: result.receiptClickUrl,
        },
      });
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (!location) {
    return <EmptyState>Select a location first to book a service.</EmptyState>;
  }

  const locationLabel = `${location.cityName}, ${location.emirateName}`;

  return (
    <PageContent>
      <PageHeader title="Book a Service" subtitle={locationLabel} />

      <div className="flex gap-2 mb-6 sm:mb-8 overflow-x-auto pb-1 scrollbar-none flex-nowrap sm:flex-wrap">
        {STEPS.map((s) => (
          <div
            key={s.id}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
              step === s.id
                ? 'bg-plutonic-blue text-white shadow-md shadow-sky-200/50'
                : step > s.id
                  ? 'bg-sky-100 text-plutonic-blue-dark'
                  : 'bg-white border border-sky-100 text-gray-400'
            }`}
          >
            <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
              {s.id}
            </span>
            {s.label}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2">
          {step === 1 && (
            <section className="premium-card p-6 md:p-8">
              <h2 className="font-bold text-lg text-plutonic-blue-dark mb-1">Select services</h2>
              <p className="text-sm text-gray-500 mb-4">
                Tap a category to browse services. You can select from more than one category.
              </p>
              {discountPct > 0 && (
                <div className="rounded-xl border border-sky-200 bg-sky-50/80 px-4 py-3 mb-6 text-sm">
                  <p className="font-semibold text-plutonic-blue-dark">Save on multiple services</p>
                  <p className="text-gray-600 mt-1">
                    Book {minServices} or more services in a single order and get{' '}
                    <span className="font-semibold text-plutonic-blue">{discountPct}% off</span> your
                    total. Mix and match across categories — the discount applies automatically at checkout.
                  </p>
                </div>
              )}
              <BookServicePicker
                groups={groups}
                selected={selected}
                onToggleService={toggle}
                preselectedSlug={routerState?.subServiceSlug}
              />
              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!canContinueStep1}
                  className="btn-primary !px-8 disabled:opacity-50"
                >
                  Continue →
                </button>
              </div>
            </section>
          )}

          {step === 2 && (
            <section className="premium-card p-6 md:p-8 space-y-8">
              <div>
                <h2 className="font-bold text-lg text-plutonic-blue-dark mb-1">Date & time</h2>
                <p className="text-sm text-gray-500 mb-4">Pick when you would like us to visit.</p>
                <BookingDatePicker
                  value={date}
                  minDate={toYmd(new Date())}
                  onChange={(ymd) => {
                    setDate(ymd);
                    setSlotStart('');
                  }}
                />
                {date && slots.length > 0 && (
                  <div className="mt-6">
                    <p className="text-sm font-semibold text-plutonic-blue-dark mb-3">Available times</p>
                    <div className="flex flex-wrap gap-2">
                    {slots.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSlotStart(s)}
                        className={`pill ${slotStart === s ? 'pill-active' : 'pill-inactive'}`}
                      >
                        {s}
                      </button>
                    ))}
                    </div>
                  </div>
                )}
                {date && slots.length === 0 && totalDuration > 0 && (
                  <p className="text-gray-500 text-sm mt-4">No slots available for this date.</p>
                )}
              </div>

              <div>
                <h2 className="font-bold text-lg text-plutonic-blue-dark mb-1">Your details</h2>
                <p className="text-sm text-gray-500 mb-4">We will use this to confirm your booking.</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <input
                    placeholder="Full name"
                    className="input-premium"
                    value={customer.name}
                    onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                  />
                  <input
                    placeholder="Phone (UAE 05x or Pakistan 03x)"
                    className="input-premium"
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                  />
                  <input
                    placeholder="Email (optional)"
                    className="input-premium sm:col-span-2"
                    value={customer.email}
                    onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                  />
                  <input
                    placeholder="Address"
                    className="input-premium sm:col-span-2"
                    value={customer.address}
                    onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                  />
                  <textarea
                    placeholder="Notes (optional)"
                    className="input-premium sm:col-span-2"
                    rows={2}
                    value={customer.notes}
                    onChange={(e) => setCustomer({ ...customer, notes: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-3 justify-between pt-2">
                <button type="button" onClick={() => setStep(1)} className="btn-outline">
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={!canContinueStep2}
                  className="btn-primary !px-8 disabled:opacity-50"
                >
                  Continue →
                </button>
              </div>
            </section>
          )}

          {step === 3 && (
            <section className="premium-card p-6 md:p-8">
              <h2 className="font-bold text-lg text-plutonic-blue-dark mb-1">Payment</h2>
              <p className="text-sm text-gray-500 mb-6">Choose how you would like to pay.</p>
              <div className="space-y-3">
                {(['cash', 'bank_transfer', 'stripe'] as const).map((m) => (
                  <label
                    key={m}
                    className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
                      paymentMethod === m
                        ? 'border-sky-400 bg-sky-50 shadow-md shadow-sky-200/50'
                        : 'border-sky-100 bg-white hover:border-sky-300'
                    }`}
                  >
                    <input
                      type="radio"
                      checked={paymentMethod === m}
                      onChange={() => setPaymentMethod(m)}
                      className="accent-sky-500"
                    />
                    <span className="font-medium text-plutonic-blue-dark">
                      {m === 'cash'
                        ? 'Pay on arrival (cash)'
                        : m === 'bank_transfer'
                          ? 'Bank transfer'
                          : 'Pay online (card)'}
                    </span>
                  </label>
                ))}
              </div>

              <div className="flex flex-wrap gap-3 justify-between mt-8">
                <button type="button" onClick={() => setStep(2)} className="btn-outline">
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={submit}
                  disabled={loading}
                  className="btn-primary !px-8 disabled:opacity-50"
                >
                  {loading ? 'Processing…' : 'Confirm booking'}
                </button>
              </div>
            </section>
          )}
        </div>

        <div className="lg:col-span-1">
          <OrderSummary
            locationLabel={locationLabel}
            selectedItems={selectedItems}
            subtotal={subtotal}
            discount={discount}
            discountPct={discountPct}
            minServices={minServices}
            total={total}
            date={date}
            slotStart={slotStart}
            customerName={customer.name.trim()}
          />
        </div>
      </div>
    </PageContent>
  );
}
