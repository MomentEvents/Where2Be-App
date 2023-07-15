// Import the functions you need from the SDKs you need
import { initializeApp } from "@react-native-firebase/app";
import { getAnalytics } from "@react-native-firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDSoLfi80tvpbREYBEQ9ItqPtdVPj-4BIs",
  authDomain: "moment-3bcc2.firebaseapp.com",
  projectId: "moment-3bcc2",
  storageBucket: "moment-3bcc2.appspot.com",
  messagingSenderId: "207081824530",
  appId: "1:207081824530:web:1952606d030433eff8d3cb",
  measurementId: "G-Z4YX16NDDR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


// test
// logEvent(analytics, 'notification_received');
export { analytics }