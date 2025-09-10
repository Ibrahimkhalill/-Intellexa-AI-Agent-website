import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCzgdwzyJplulSmHbsAkWi1ysz3JasHK5I",
  authDomain: "ailearningauthentication.firebaseapp.com",
  projectId: "ailearningauthentication",
  storageBucket: "ailearningauthentication.firebasestorage.app",
  messagingSenderId: "213689067467",
  appId: "1:213689067467:web:ce5da4295ad0bad00bb84e",
};

export const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

// Request permission and get token
export const requestForToken = async () => {
  try {
    const currentToken = await getToken(messaging, {
      vapidKey:
        "BKirCbGacsgO6PnI8iDc5R4HhX1BENKxtIu0yQKfphC77tTkpF4arzGX11C_09UUw9aS2D9v_Z5wS5MwvuRrefM", // from Firebase console
    });
    if (currentToken) return currentToken;
  } catch (err) {
    console.error("FCM token error:", err);
  }
};

// Listen for messages **while app is open**
onMessage(messaging, (payload) => {
  console.log("Message received:", payload);
  new Notification(payload.notification.title, {
    body: payload.notification.body,
    icon: payload.notification.icon,
  });
});
