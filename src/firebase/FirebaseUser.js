import React, { useContext, useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { FirebaseContext } from "./firebase";
export const FirebaseUser = props => {
  const firebase = useContext(FirebaseContext);
  const [user, setUser] = useState({ loading: true });
  const setProfileData = data => {
    setUser(c => {
      return { ...c, ...data };
    });
  };

  const [authUser, loading, error] = useAuthState(firebase.auth);

  if (error) console.log(error);

  //merge user with user in firebase db
  useEffect(() => {
    if (authUser) {
      const { uid, email, displayName } = authUser;
      if (uid !== user.uid) {
        firebase.db
          .collection("users")
          .doc(uid)
          .get()
          .then(doc => {
            setUser({ email, uid, displayName, ...doc.data(), loading: false });
          });
      }
    } else {
      if (user.uid) setUser({ loading: false });
    }
    //}
  }, [user, authUser, firebase.db]);
  return (
    <UserContext.Provider value={{ ...user, setProfileData }}>
      {!loading && <div aria-live="off">{props.children}</div>}
      {loading && <div>Loading...</div>}
    </UserContext.Provider>
  );
};
export const UserContext = React.createContext(null);
