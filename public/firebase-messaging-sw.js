/* eslint-env serviceworker */
/* global firebase, importScripts */
importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyCzgdwzyJplulSmHbsAkWi1ysz3JasHK5I",
  authDomain: "ailearningauthentication.firebaseapp.com",
  projectId: "ailearningauthentication",
  storageBucket: "ailearningauthentication.firebasestorage.app",
  messagingSenderId: "213689067467",
  appId: "1:213689067467:web:ce5da4295ad0bad00bb84e",
});

const messaging = firebase.messaging();

// Background notifications
messaging.onBackgroundMessage(function (payload) {
  console.log(payload);
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: payload.notification.icon,
  });
});
