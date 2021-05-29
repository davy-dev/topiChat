import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyBvmrXBJOi6Tuxs_hoEJxYWMW9CViuOioU",
  authDomain: "test-chat-topitech.firebaseapp.com",
  projectId: "test-chat-topitech",
  storageBucket: "test-chat-topitech.appspot.com",
  messagingSenderId: "159005999131",
  appId: "1:159005999131:web:809879dcbb2cc959cdf8be",
};

const app = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();

const db = app.firestore();

const auth = app.auth();
const provider = new firebase.auth.GoogleAuthProvider();


export { db, auth, provider};
