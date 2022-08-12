import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAl9ImrrohgHE8g1DQ8CH3qbcQ88ZT05s4",
  authDomain: "home-lander-7550.firebaseapp.com",
  projectId: "home-lander-7550",
  storageBucket: "home-lander-7550.appspot.com",
  messagingSenderId: "554583464284",
  appId: "1:554583464284:web:5ae3092f76be0d9a010999",
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();
