import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyCkbuSLft0KeDGpwu8oJvrnEHBrc0xUyqg",
  authDomain: "coupled-cc311.firebaseapp.com",
  projectId: "coupled-cc311",
  storageBucket: "coupled-cc311.appspot.com",
  messagingSenderId: "927050956739",
  appId: "1:927050956739:web:07376d14851edbbcb88776",
  measurementId: "G-B4WZ23C3GV",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });

const storage = firebase.storage;

export { auth, provider, storage };
export default db;
