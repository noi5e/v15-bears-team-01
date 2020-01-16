import React, { useState, useContext } from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { Link } from "react-router-dom";
import AuthContext from "../utils/auth_context";
import jwt_decode from "jwt-decode";
import axios from "axios";
import history from "../utils/history";

const Auth = () => {
  const context = useContext(AuthContext);

  const uiConfig = {
    credentialHelper: "none",
    signInFlow: "popup",
    signInOptions: [
      context.firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      context.firebase.auth.GithubAuthProvider.PROVIDER_ID,
      context.firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      context.firebase.auth.EmailAuthProvider.PROVIDER_ID
    ],

    callbacks: {
      signInSuccessWithAuthResult: function(authResult) {
        saveProfile(authResult);
        return false;
      },
      signInFailure: function(error) {
        console.log(error);
      }
    }
  };

  const saveProfile = authResult => {
    console.log(authResult);

    context.firebase
      .auth()
      .currentUser.getIdToken()
      .then(token => sendtokenToServer(token));

    let sendtokenToServer = token => {
      axios
        .post("http://localhost:3000/sendtoken", { token })
        .then(res => sendProfiletoContext(res.data))
        .catch(err => console.log(err));
    };

    let sendProfiletoContext = data => {
      let email = authResult.user.email;
      let username = authResult.user.displayName;
      let id = jwt_decode(data.token);
      let photo = authResult.user.photoURL;

      let user = {
        email,
        username,
        id,
        photo
      };

      context.saveUser(user);
      history.replace("/profile");
    };
  };

  return (
    <div>
      <StyledFirebaseAuth
        uiConfig={uiConfig}
        firebaseAuth={context.firebase.auth()}
      />
    </div>
  );
};

export default Auth;
