import { firebaseConfig } from "./config";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
// const firebaseui = require("firebaseui");

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const app = firebase;
export const auth = app.auth();
export const db = app.firestore();
export const timestamp = firebase.firestore.FieldValue;

export const firebaseUIConfig = {
  signInFlow: "popup",
  signInOptions: [
    {
      provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      customParameters: { prompt: "select_account" },
    },
    firebase.auth.GithubAuthProvider.PROVIDER_ID,
  ],
  callbacks: {
    // Avoid redirects after sign-in.
    signInSuccessWithAuthResult: () => false,
  },
  // Terms of service url.
  tosUrl: "/terms",
  // Privacy policy url.
  privacyPolicyUrl: "/policies",
};

export default app;
