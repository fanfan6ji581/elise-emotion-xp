// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyCYl7W19SBUV45XAr2nHPIBUi9ohhINmJc",
//   authDomain: "unsw-forcast-xp.firebaseapp.com",
//   projectId: "unsw-forcast-xp",
//   storageBucket: "unsw-forcast-xp.appspot.com",
//   messagingSenderId: "551022841592",
//   appId: "1:551022841592:web:68680f8588baea51d6750d",
//   measurementId: "G-VWRKDTFP7J"
// };
const firebaseConfig = {
  apiKey: "AIzaSyDzJs3TaafMdkwL1TTYZOIPpbF-HF7BQmI",
  authDomain: "unsw-emotion-xp.firebaseapp.com",
  projectId: "unsw-emotion-xp",
  storageBucket: "unsw-emotion-xp.appspot.com",
  messagingSenderId: "459424317735",
  appId: "1:459424317735:web:fdcc6429127eeea0622902"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
getAnalytics(app);
// Initialize Realtime Database and get a reference to the service
const db = getFirestore(app);

export default db;
