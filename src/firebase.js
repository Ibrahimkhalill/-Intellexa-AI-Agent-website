import { initializeApp } from "firebase/app";
import { getMessaging, getToken, isSupported, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCzgdwzyJplulSmHbsAkWi1ysz3JasHK5I",
  authDomain: "ailearningauthentication.firebaseapp.com",
  projectId: "ailearningauthentication",
  storageBucket: "ailearningauthentication.firebasestorage.app",
  messagingSenderId: "213689067467",
  appId: "1:213689067467:web:ce5da4295ad0bad00bb84e",
};

export const app = initializeApp(firebaseConfig);

// Messaging isn't available in every browser (e.g. Safari without push,
// private windows) - resolve to null there instead of crashing the app
const messagingPromise = isSupported()
  .then((supported) => (supported ? getMessaging(app) : null))
  .catch(() => null);

// Listen for messages **while app is open**
messagingPromise.then((messaging) => {
  if (!messaging) return;
  onMessage(messaging, (payload) => {
    const { title, body, icon } = payload.notification || {};
    if (title && "Notification" in window && Notification.permission === "granted") {
      new Notification(title, { body, icon });
    }
  });
});

// Request permission and get token
export const requestForToken = async () => {
  try {
    const messaging = await messagingPromise;
    if (!messaging) return null;
    // The user said no to notifications - don't keep asking or logging errors
    if ("Notification" in window && Notification.permission === "denied") return null;
    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js"
    );
    const currentToken = await getToken(messaging, {
      vapidKey:
        "BKirCbGacsgO6PnI8iDc5R4HhX1BENKxtIu0yQKfphC77tTkpF4arzGX11C_09UUw9aS2D9v_Z5wS5MwvuRrefM", // from Firebase console
      serviceWorkerRegistration: registration,
    });
    return currentToken || null;
  } catch (err) {
    console.error("FCM token error:", err);
    return null;
  }
};
