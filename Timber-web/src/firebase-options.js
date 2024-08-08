/* eslint-disable @typescript-eslint/no-unused-vars */
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDGA4U6Yfaq2uegDpvG87Qivi9d2CTS5JA",
  authDomain: "meetchat-9d4b5.firebaseapp.com",
  projectId: "meetchat-9d4b5",
  storageBucket: "meetchat-9d4b5.appspot.com",
  messagingSenderId: "951954100055",
  appId: "1:951954100055:web:4be323a057676a2094f812",
  measurementId: "G-4T132YFQ5J",
};


const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);
export default app;