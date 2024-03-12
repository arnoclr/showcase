import { initializeApp } from "firebase/app";
import { getMessaging, isSupported, type Messaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDgti7R6tPmNhjOY4Kp_Qt9CBRAgxTWkKM",
  authDomain: "arno-cellarier.firebaseapp.com",
  projectId: "arno-cellarier",
  storageBucket: "arno-cellarier.appspot.com",
  messagingSenderId: "122339573172",
  appId: "1:122339573172:web:d377c096955a56e642c6e1",
};

const app = initializeApp(firebaseConfig);

let messaging: Messaging | null = null;
isSupported().then((supported) => {
  if (supported) {
    messaging = getMessaging(app);
  }
});

export { messaging };
