import React, { useRef, useContext } from "react";

import useInitialFocus from "./hooks/useInitialFocus";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { FirebaseContext } from "./firebase/firebase";
import { UserContext } from "./firebase/FirebaseUser";
import { Redirect } from "react-router-dom";

const Home = ({ history }) => {
  const main = useRef(null);
  const user = useContext(UserContext);
  const firebase = useContext(FirebaseContext);

  useInitialFocus(main, "Home");
  const uiConfig = {
    // Popup signin flow rather than redirect flow.
    //signInFlow: 'popup',

    signInSuccessUrl: "/projects",

    signInOptions: [firebase.googleProvider, firebase.emailProvider]
  };
  console.table(user);
  return (
    <div id="home">
      {user.uid && <Redirect to="/projects" />}
      <h1 tabIndex="-1" ref={main}>
        Home
      </h1>
      You must sign in to use the app.
      <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth} />
    </div>
  );
};
export default Home;
