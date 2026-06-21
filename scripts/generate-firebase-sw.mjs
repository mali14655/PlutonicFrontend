/**
 * Generates firebase-messaging-sw.js from env vars at build time (Vercel / CI).
 * Loads .env in local dev via dotenv if present.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const envPath = path.join(root, '.env');

if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) process.env[key] = val;
  }
}

const cfg = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || '',
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || '',
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.VITE_FIREBASE_APP_ID || '',
};

const out = `/* Auto-generated — do not edit. Run: npm run generate:firebase-sw */
importScripts('https://www.gstatic.com/firebasejs/12.15.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.15.0/firebase-messaging-compat.js');

const NOTIFICATION_SOUND = '/assets/sounds/notification.wav';
const NOTIFICATION_ICON = '/assets/branding/logo.png';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

firebase.initializeApp(${JSON.stringify(cfg, null, 2)});

const messaging = firebase.messaging();

function parsePayload(payload) {
  const data = payload.data || {};
  const title = payload.notification?.title || data.title || 'Plutonic Admin';
  const body = payload.notification?.body || data.body || 'New update';
  const url = payload.fcmOptions?.link || data.click_action || '/admin/dashboard';
  return { title, body, url };
}

function notifyOpenClients() {
  return self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
    clientList.forEach((client) => {
      client.postMessage({ type: 'PLUTONIC_FCM_SOUND' });
    });
  });
}

function showPlutonicNotification(title, body, url) {
  const options = {
    body,
    icon: NOTIFICATION_ICON,
    badge: NOTIFICATION_ICON,
    tag: 'plutonic-admin',
    renotify: true,
    requireInteraction: true,
    silent: false,
    sound: NOTIFICATION_SOUND,
    vibrate: [300, 100, 300, 100, 300],
    data: { url },
  };

  return self.registration.showNotification(title, options).then(() => notifyOpenClients());
}

messaging.onBackgroundMessage(() => notifyOpenClients());

self.addEventListener('push', (event) => {
  if (!event.data) return;

  let payload;
  try {
    payload = event.data.json();
  } catch {
    return;
  }

  if (payload.notification?.title || payload.notification?.body) {
    event.waitUntil(notifyOpenClients());
    return;
  }

  const { title, body, url } = parsePayload(payload);
  event.waitUntil(showPlutonicNotification(title, body, url));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/admin/dashboard';
  const absoluteUrl = new URL(targetUrl, self.location.origin).href;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes('/admin') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(absoluteUrl);
      }
    })
  );
});
`;

const target = path.join(root, 'public', 'firebase-messaging-sw.js');
fs.writeFileSync(target, out, 'utf8');
console.log('Generated', target);
