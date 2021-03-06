import React from "react";
import { config } from "./config.js";
import app from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

export class firebase {
  constructor() {
    app.initializeApp(config);
    console.log("app initialized");

    this.emailProvider = app.auth.EmailAuthProvider.PROVIDER_ID;
    this.googleProvider = app.auth.GoogleAuthProvider.PROVIDER_ID;

    this.auth = app.auth();

    this.db = app.firestore();
    this.timeStamp = app.firestore.Timestamp;
  }

  signOut = () => {
    app.auth().signOut();
  };
}

export const FirebaseContext = React.createContext(null);
