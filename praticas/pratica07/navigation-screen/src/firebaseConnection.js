// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBniBMPJBnzOwvLksC3UAcTIIGhEMNf-xE",
  authDomain: "app-financas-f347a.firebaseapp.com",
  projectId: "app-financas-f347a",
  storageBucket: "app-financas-f347a.firebasestorage.app",
  messagingSenderId: "9680097834",
  appId: "1:9680097834:web:b6f5e01cf3e00c1d022953"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);