import { initializeApp, getApps } from 'firebase/app';
import { getMessaging, getToken, deleteToken, onMessage, isSupported } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const NOTIFICATION_SOUND = '/assets/sounds/notification.wav';

export interface FcmRegisterResult {
  token: string | null;
  error?: string;
}

let alertAudio: HTMLAudioElement | null = null;
let audioUnlocked = false;

export function getFirebaseApp() {
  if (!getApps().length) {
    return initializeApp(firebaseConfig);
  }
  return getApps()[0];
}

function playBeepFallback(): void {
  try {
    const ctx = new AudioContext();
    void ctx.resume().then(() => {
      const playTone = (freq: number, start: number, duration: number, volume = 0.4) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.value = freq;
        gain.gain.value = volume;
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + duration);
      };
      playTone(880, 0, 0.2, 0.35);
      playTone(1100, 0.22, 0.28, 0.45);
    });
  } catch {
    /* ignore */
  }
}

export function prepareNotificationSound() {
  if (!alertAudio) {
    alertAudio = new Audio(NOTIFICATION_SOUND);
    alertAudio.preload = 'auto';
    alertAudio.volume = 1;
  }
}

/** Start sound synchronously inside a click handler (before any await). */
export function triggerAlertSoundSync(): void {
  prepareNotificationSound();
  if (alertAudio) {
    const instance = alertAudio.cloneNode(true) as HTMLAudioElement;
    instance.volume = 1;
    void instance.play().catch(() => playBeepFallback());
    return;
  }
  playBeepFallback();
}

/** Unlock audio synchronously on user click — must run before await. */
export function unlockNotificationSoundSync(): void {
  prepareNotificationSound();
  if (!alertAudio || audioUnlocked) return;

  void alertAudio
    .play()
    .then(() => {
      alertAudio!.pause();
      alertAudio!.currentTime = 0;
      audioUnlocked = true;
    })
    .catch(() => {
      playBeepFallback();
      audioUnlocked = true;
    });
}

export async function unlockNotificationSound(): Promise<void> {
  unlockNotificationSoundSync();
}

export async function playAlertSound(): Promise<void> {
  triggerAlertSoundSync();
}

function listenForServiceWorkerSound() {
  if (!('serviceWorker' in navigator)) return;

  navigator.serviceWorker.addEventListener('message', (event: MessageEvent) => {
    if (event.data?.type === 'PLUTONIC_FCM_SOUND') {
      triggerAlertSoundSync();
    }
  });
}

listenForServiceWorkerSound();

async function getServiceWorkerRegistration() {
  if (!('serviceWorker' in navigator)) return undefined;
  try {
    const reg = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
      updateViaCache: 'none',
    });
    await reg.update();
    await navigator.serviceWorker.ready;
    return reg;
  } catch (err) {
    console.warn('FCM service worker registration failed', err);
    return undefined;
  }
}

export function showBrowserNotification(title: string, body: string) {
  if (Notification.permission !== 'granted') return;

  triggerAlertSoundSync();

  const n = new Notification(title, {
    body,
    icon: '/assets/branding/logo.png',
    badge: '/assets/branding/logo.png',
    tag: 'plutonic-admin',
    requireInteraction: true,
    silent: false,
  });

  n.onclick = () => {
    window.focus();
    if (!window.location.pathname.startsWith('/admin')) {
      window.location.href = '/admin/dashboard';
    }
    n.close();
  };
}

async function resetPushSubscription(swReg: ServiceWorkerRegistration) {
  try {
    const existing = await swReg.pushManager.getSubscription();
    if (existing) {
      await existing.unsubscribe();
    }
  } catch (err) {
    console.warn('Could not clear old push subscription', err);
  }
}

async function acquireFcmToken(
  messaging: ReturnType<typeof getMessaging>,
  swReg: ServiceWorkerRegistration,
  vapidKey: string
): Promise<string> {
  try {
    return await getToken(messaging, {
      vapidKey,
      serviceWorkerRegistration: swReg,
    });
  } catch (firstErr) {
    console.warn('FCM getToken failed, resetting subscription:', firstErr);
    await resetPushSubscription(swReg);
    try {
      await deleteToken(messaging);
    } catch {
      /* no prior token */
    }
    return await getToken(messaging, {
      vapidKey,
      serviceWorkerRegistration: swReg,
    });
  }
}

export async function registerAdminFcm(
  onForegroundMessage?: (payload: { title?: string; body?: string }) => void
): Promise<FcmRegisterResult> {
  if (!import.meta.env.VITE_FIREBASE_API_KEY) {
    return { token: null, error: 'Firebase not configured in client .env' };
  }

  const supported = await isSupported();
  if (!supported) {
    return { token: null, error: 'Push notifications not supported in this browser' };
  }

  let permission = Notification.permission;
  if (permission === 'default') {
    permission = await Notification.requestPermission();
  }
  if (permission !== 'granted') {
    return { token: null, error: 'Notification permission denied — enable in browser settings' };
  }

  const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY?.trim();
  if (!vapidKey) {
    return { token: null, error: 'VITE_FIREBASE_VAPID_KEY missing in client .env' };
  }

  prepareNotificationSound();

  try {
    const app = getFirebaseApp();
    const messaging = getMessaging(app);
    const swReg = await getServiceWorkerRegistration();

    if (!swReg) {
      return { token: null, error: 'Service worker failed to register — try a hard refresh (Ctrl+Shift+R)' };
    }

    const token = await acquireFcmToken(messaging, swReg, vapidKey);

    if (!token) {
      return { token: null, error: 'Could not get FCM token — check VAPID key in Firebase Console' };
    }

    onMessage(messaging, (payload) => {
      const title = payload.notification?.title || payload.data?.title || 'Plutonic Admin';
      const body = payload.notification?.body || payload.data?.body || '';
      onForegroundMessage?.({ title, body });
      showBrowserNotification(title, body);
    });

    return { token };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'FCM registration failed';
    console.error('FCM registration error:', err);

    if (message.includes('token-subscribe-failed') || message.includes('authentication credential')) {
      return {
        token: null,
        error:
          'FCM registration failed — try: (1) hard refresh Ctrl+Shift+R, (2) confirm VAPID key from Firebase Console, (3) restart npm run dev, then click Enable again.',
      };
    }

    return { token: null, error: message };
  }
}
