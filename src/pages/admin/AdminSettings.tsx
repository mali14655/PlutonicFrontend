import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../../api';

interface Settings {
  workStart: string;
  workEnd: string;
  bufferMinutes: number;
  customDiscountPercent: number;
  customDiscountMinServices: number;
  businessInfo: {
    companyName: string;
    address: string;
    phone: string;
    phoneAlt: string;
    whatsapp: string;
    email: string;
    iban: string;
    bankName: string;
    accountName: string;
  };
}

export default function AdminSettings() {
  const token = localStorage.getItem('admin_token') || '';
  const navigate = useNavigate();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate('/admin');
      return;
    }
    adminApi<Settings>('/admin/settings', token).then(setSettings);
  }, [token, navigate]);

  const save = async () => {
    if (!settings) return;
    await adminApi('/admin/cms/settings', token, {
      method: 'PATCH',
      body: JSON.stringify(settings),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!settings) return <p>Loading...</p>;

  const updateBiz = (field: string, value: string) => {
    setSettings({
      ...settings,
      businessInfo: { ...settings.businessInfo, [field]: value },
    });
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-plutonic-blue-dark">Settings</h1>

      <div className="premium-card p-6 space-y-4">
        <h2 className="font-bold">Booking slots</h2>
        <div className="grid sm:grid-cols-3 gap-3">
          <label className="text-sm">
            Work start
            <input className="border rounded-lg px-3 py-2 w-full mt-1" value={settings.workStart}
              onChange={(e) => setSettings({ ...settings, workStart: e.target.value })} />
          </label>
          <label className="text-sm">
            Work end
            <input className="border rounded-lg px-3 py-2 w-full mt-1" value={settings.workEnd}
              onChange={(e) => setSettings({ ...settings, workEnd: e.target.value })} />
          </label>
          <label className="text-sm">
            Buffer (min)
            <input type="number" className="border rounded-lg px-3 py-2 w-full mt-1" value={settings.bufferMinutes}
              onChange={(e) => setSettings({ ...settings, bufferMinutes: Number(e.target.value) })} />
          </label>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <label className="text-sm">
            Custom discount %
            <input type="number" className="border rounded-lg px-3 py-2 w-full mt-1" value={settings.customDiscountPercent}
              onChange={(e) => setSettings({ ...settings, customDiscountPercent: Number(e.target.value) })} />
          </label>
          <label className="text-sm">
            Min services for discount
            <input type="number" className="border rounded-lg px-3 py-2 w-full mt-1" value={settings.customDiscountMinServices}
              onChange={(e) => setSettings({ ...settings, customDiscountMinServices: Number(e.target.value) })} />
          </label>
        </div>
      </div>

      <div className="premium-card p-6 space-y-3">
        <h2 className="font-bold">Business & bank details</h2>
        {(['companyName', 'address', 'phone', 'phoneAlt', 'whatsapp', 'email', 'bankName', 'accountName', 'iban'] as const).map((field) => (
          <input
            key={field}
            className="border rounded-lg px-3 py-2 w-full text-sm"
            placeholder={field}
            value={settings.businessInfo?.[field] || ''}
            onChange={(e) => updateBiz(field, e.target.value)}
          />
        ))}
      </div>

      <button onClick={save} className="bg-plutonic-blue text-white px-6 py-3 rounded-lg font-semibold">
        {saved ? 'Saved!' : 'Save settings'}
      </button>
    </div>
  );
}
