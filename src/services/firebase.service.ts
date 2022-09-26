// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_auth_domain,
  projectId: process.env.REACT_APP_project_id,
  storageBucket: process.env.REACT_APP_storage_bucket,
  messagingSenderId: process.env.REACT_APP_measure,
  appId: process.env.REACT_APP_app_id,
  measurementId: process.env.REACT_APP_measurementId,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// const analytics = getAnalytics(app);

export { app, auth };
