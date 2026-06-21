import { useEffect, useState, useCallback } from 'react';
import { adminApi } from '../../api';
import { registerAdminFcm, showBrowserNotification, unlockNotificationSoundSync, triggerAlertSoundSync } from '../../lib/firebase';

type FcmStatus = 'loading' | 'enabled' | 'denied' | 'error';

export default function AdminFcm() {
  const token = localStorage.getItem('admin_token') || '';
  const [status, setStatus] = useState<FcmStatus>('loading');
  const [message, setMessage] = useState('');
  const [testing, setTesting] = useState(false);

  const setup = useCallback(async () => {
    if (!token) return;

    const result = await registerAdminFcm((msg) => {
      setMessage(`${msg.title}: ${msg.body}`);
      window.dispatchEvent(new CustomEvent('plutonic-fcm', { detail: msg }));
    });

    if (result.token) {
      await adminApi('/admin/fcm-token', token, {
        method: 'POST',
        body: JSON.stringify({ token: result.token }),
      });
      setStatus('enabled');
      setMessage('Notifications on — close this tab, then test from another tab or a new booking.');
    } else if (result.error?.includes('denied')) {
      setStatus('denied');
      setMessage(result.error);
    } else {
      setStatus('error');
      setMessage(result.error || 'Could not enable notifications');
    }
  }, [token]);

  useEffect(() => {
    setup();
  }, [setup]);

  const testNotification = async () => {
    triggerAlertSoundSync();
    setTesting(true);
    try {
      const res = await adminApi<{ sent: number; failed: number; error?: string }>(
        '/admin/fcm-test',
        token,
        { method: 'POST' }
      );
      if (res.sent > 0) {
        showBrowserNotification(
          'Plutonic test notification',
          'If you hear a sound and see this, admin push is working!'
        );
        triggerAlertSoundSync();
        setMessage('Test sent with sound — check notification banner too.');
      } else {
        setMessage(res.error || 'Server push failed — played local test sound only.');
        showBrowserNotification('Plutonic (local test)', 'Browser notifications are working.');
        triggerAlertSoundSync();
      }
    } catch (e) {
      setMessage((e as Error).message);
      showBrowserNotification('Plutonic (local test)', 'Browser notifications are working.');
      triggerAlertSoundSync();
    } finally {
      setTesting(false);
    }
  };

  const enableNotifications = () => {
    unlockNotificationSoundSync();
    setup();
  };

  if (status === 'enabled') {
    return (
        <div className="mb-6 rounded-2xl border border-green-200/80 bg-green-50/90 backdrop-blur-sm px-4 py-3 text-sm shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="font-semibold text-green-800">🔔 Notifications on</span>
            <span className="text-green-700 ml-2">{message}</span>
          </div>
          <button
            type="button"
            onClick={testNotification}
            disabled={testing}
            className="rounded-lg bg-green-600 text-white px-3 py-1.5 text-xs font-semibold hover:bg-green-700 disabled:opacity-50"
          >
            {testing ? 'Sending…' : 'Test notification'}
          </button>
        </div>
        <p className="mt-2 text-xs text-green-700">
          Background test: close this admin tab (keep Chrome open), open the public site in a new tab, create a test
          booking — you should get a notification on this device.
        </p>
      </div>
    );
  }

  return (
    <div className="mb-6 rounded-2xl border border-amber-200/80 bg-amber-50/90 backdrop-blur-sm px-4 py-3 text-sm text-amber-900 shadow-sm">
      <p className="font-semibold">Enable push notifications</p>
      <p className="mt-1 text-amber-800">{message || 'Allow notifications to get booking alerts with sound.'}</p>
      {status === 'error' && message.includes('VAPID') && (
        <ol className="mt-2 list-decimal list-inside space-y-1 text-xs text-amber-800">
          <li>
            Open{' '}
            <a
              href="https://console.firebase.google.com/project/mkd-delivery-21550/settings/cloudmessaging"
              target="_blank"
              rel="noreferrer"
              className="underline font-medium"
            >
              Firebase → Cloud Messaging
            </a>
          </li>
          <li>Under Web Push certificates, click <strong>Generate key pair</strong> (if none exists)</li>
          <li>Copy the <strong>Key pair</strong> public key (check for trailing spaces)</li>
          <li>Paste into <code className="bg-amber-100 px-1 rounded">client/.env</code> as <code className="bg-amber-100 px-1 rounded">VITE_FIREBASE_VAPID_KEY</code></li>
          <li>Restart <code className="bg-amber-100 px-1 rounded">npm run dev</code> and click Enable again</li>
        </ol>
      )}
      <button
        type="button"
        onClick={enableNotifications}
        className="mt-3 rounded-lg bg-amber-600 text-white px-3 py-1.5 text-xs font-semibold hover:bg-amber-700"
      >
        {status === 'denied' ? 'Try again' : 'Enable notifications'}
      </button>
    </div>
  );
}
