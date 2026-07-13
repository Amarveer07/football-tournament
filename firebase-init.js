const firebaseConfig = {
  apiKey: "AIzaSyDflqJLfd9wK4eicO9Ir9NCyUZYMRIXUwI",
  authDomain: "football-tournament-87366.firebaseapp.com",
  databaseURL:
    "https://football-tournament-87366-default-rtdb.firebaseio.com",
  projectId: "football-tournament-87366",
  storageBucket: "football-tournament-87366.firebasestorage.app",
  messagingSenderId: "25593487396",
  appId: "1:25593487396:web:fec9543a7f8f41134ab8b1"
};

function initialiseFirebase() {
  if (typeof firebase === "undefined") {
    console.error("Firebase failed to load.");
    return;
  }

  // Prevent Firebase being initialised more than once.
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  // Available on both the public and admin pages.
  window.db = firebase.database();

  // Authentication is only loaded on the admin page.
  window.auth =
    typeof firebase.auth === "function"
      ? firebase.auth()
      : null;
}

initialiseFirebase();
