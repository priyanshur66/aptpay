import { auth, googleAuthProvider } from "@/config/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { useState } from "react";
import { useEffect } from "react";
function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signIn = async () => {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    console.log(res);
  };
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
        <input
          type="email"
          name=""
          id=""
          placeholder="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          name=""
          id=""
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={signIn}>sign in </button>
        <button onClick={signInWithGoogle}>sign up with google </button>
        <button onClick={logout}>logout </button>
      </div>
    </div>
  );
}
export default Auth;