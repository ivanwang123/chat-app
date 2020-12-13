import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyDFGyo3pyElYVe-pEkd5wX2SjDJIPWDy2c",
  authDomain: "chat-4cc67.firebaseapp.com",
  databaseURL: "https://chat-4cc67.firebaseio.com",
  projectId: "chat-4cc67",
  storageBucket: "chat-4cc67.appspot.com",
  messagingSenderId: "807401154049",
  appId: "1:807401154049:web:f42ab1c5d12aee54bb4200",
  measurementId: "G-CZER2XPT5G"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

firebase.firestore()
firebase.auth()
// firebase.analytics();

export default firebase