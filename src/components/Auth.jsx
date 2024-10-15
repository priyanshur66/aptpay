import { auth, googleAuthProvider } from "@/config/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { useState } from "react";
import { useEffect } from "react";
function Auth() {
  const signInWithGoogle = async () => {
    const res = await signInWithPopup(auth, googleAuthProvider);
    console.log(res);
  };
  const logout = async () => {
    const res = await signOut(auth);
    console.log(res);
  };
  console.log(auth?.currentUser?.email);

  return (
    <div>
      auth
      <div>
        <button onClick={signInWithGoogle}>sign up with google </button>
        <button onClick={logout}>logout </button>
      </div>
    </div>
  );
}
export default Auth;
