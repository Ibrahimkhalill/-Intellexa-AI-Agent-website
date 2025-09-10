import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import router from "./Routers/Router.jsx";
import { AuthProvider } from "./components/authContext.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { app } from "./firebase"; // your firebase.js
import { getMessaging } from "firebase/messaging";

// Register service worker for FCM
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/firebase-messaging-sw.js")
    .then((registration) => {
      console.log("Service Worker registered:", registration);
      // optional: you can initialize messaging with this registration
      const messaging = getMessaging(app);
    })
    .catch((err) => console.log("SW registration failed:", err));
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <div className="font-inter">
          <RouterProvider router={router} />
        </div>
      </AuthProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);
