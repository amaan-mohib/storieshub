import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
const firebaseui = require("firebaseui");

const firebaseConfig = {
  apiKey: "AIzaSyBbVJtps_gIU88oCIdA3k-qujSGbC4iPhE",
  authDomain: "storieshub.firebaseapp.com",
  projectId: "storieshub",
  storageBucket: "storieshub.appspot.com",
  messagingSenderId: "465909431732",
  appId: "1:465909431732:web:e429b65f695e9a46f6c6e1",
};

const app = firebase.initializeApp(firebaseConfig);

export const auth = app.auth();
export const db = app.firestore();
export const timestamp = firebase.firestore.FieldValue;

export function firebaseUI() {
  let uiConfig = {
    callbacks: {
      signInSuccessWithAuthResult: function (authResult, redirectUrl) {
        // User successfully signed in.
        // Return type determines whether we continue the redirect automatically
        // or whether we leave that to developer to handle.
        let user = authResult.user;
        let db = app.firestore();
        console.log(db);
        let docRef = db.collection("users").doc(`${user.uid}`);
        docRef
          .get()
          .then((doc) => {
            if (!doc.exists) {
              console.log("read");
              docRef
                .set(
                  {
                    uid: user.uid,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                    email: user.email,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                  },
                  { merge: true }
                )
                .then(() => {})
                .catch((err) => console.error(err));
            }
          })
          .catch((err) => console.error(err));

        return true;
      },
      uiShown: function () {
        // The widget is rendered.
        // Hide the loader.
        document.getElementById("loader").style.display = "none";
      },
    },
    // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
    signInFlow: "popup",
    // signInSuccessUrl: "/",
    signInOptions: [
      // Leave the lines as is for the providers you want to offer your users.
      {
        provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        customParameters: { prompt: "select_account" },
      },
      firebase.auth.GithubAuthProvider.PROVIDER_ID,
    ],
    // Terms of service url.
    tosUrl: "<your-tos-url>",
    // Privacy policy url.
    privacyPolicyUrl: "<your-privacy-policy-url>",
  };

  let ui =
    firebaseui.auth.AuthUI.getInstance() ||
    new firebaseui.auth.AuthUI(firebase.auth());
  ui.start("#firebaseui-auth-container", uiConfig);
}

export default app;
