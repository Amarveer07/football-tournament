const firebaseConfig = {
  apiKey: "AIzaSyDflqJLfd9wK4eicO9Ir9NCyUZYMRIXUwI",
  authDomain: "football-tournament-87366.firebaseapp.com",
  databaseURL: "https://football-tournament-87366-default-rtdb.firebaseio.com",
  projectId: "football-tournament-87366",
  storageBucket: "football-tournament-87366.firebasestorage.app",
  messagingSenderId: "25593487396",
  appId: "1:25593487396:web:fec9543a7f8f41134ab8b1"
};
// 2) Initialize Firebase + Database
firebase.initializeApp(firebaseConfig);

window.db = firebase.database();
window.auth = firebase.auth();
