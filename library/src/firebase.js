import firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyBmGxY3U7cIaSv9XDxtDa-jSsF8luc0xBw",
  authDomain: "library-b8b4e.firebaseapp.com",
  projectId: "library-b8b4e",
  storageBucket: "library-b8b4e.appspot.com",
  messagingSenderId: "643621508941",
  appId: "1:643621508941:web:56dbe43d842cab6eb54904",
  measurementId: "G-Y11GQ2D9PW"
};
  const firebaseApp = firebase.initializeApp(firebaseConfig);
  const db = firebaseApp.firestore();
  const auth = firebase.auth();

  export {auth,db};