import React, { useContext } from "react";
import styles from "../styles/Home.module.scss";
import firebase from "firebase";
import { provider } from "../firebase";
import UserContext from "../context/UserContext";
import RoomListContainer from "../components/RoomListContainer";
import HighlightIcon from '@material-ui/icons/Highlight';

export default function Home() {
  const { userInContext, setUserInContext, refresh } = useContext(UserContext);

  const anonymeSignIn = () => {
    firebase.auth().signInAnonymously();
  };

  firebase.auth().onAuthStateChanged((firebaseUser) => {
    setUserInContext(firebaseUser);

    console.log(userInContext);
  });

  const googleSignIn = () => {
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => setUserInContext(result));
    console.log(userInContext);
  };

  return (
    <div className={styles.container}>
      <div className={styles.app__chat}>
        {userInContext && <RoomListContainer />}

        <div className="SignIn">
          {userInContext ? (
            <h1>
            <HighlightIcon className="iconHighlight"/>
              Bienvenue sur le Chat{" "}
              {userInContext.isAnonymous
                ? userInContext.uid
                : userInContext.displayName}
            </h1>
          ) : (
            <div>
              <h1>THE CHAT </h1>
              <button onClick={anonymeSignIn}> Se Connecter en Anonyme</button>
              <button onClick={googleSignIn}> Se Connecter avec Google</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
