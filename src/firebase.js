import firebase from 'firebase'; 

const firebaseConfig = {
  apiKey: "AIzaSyDW7vLHlk0XOIAQHeZni20jBisInEqIskc",
  authDomain: "field-and-internship-post.firebaseapp.com",
  projectId: "field-and-internship-post",
  storageBucket: "field-and-internship-post.appspot.com",
  messagingSenderId: "54071853718",
  appId: "1:54071853718:web:815da074991f8fccf078b7",
  measurementId: "G-NVCT94BNJG"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
export default db;
