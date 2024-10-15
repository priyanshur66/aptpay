import { auth, googleAuthProvider, db } from "@/config/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  setDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { AptosClient, AptosAccount } from "aptos";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { useUserStore } from "../../store"; // Update this import path

function Auth() {
  const router = useRouter();
  const { user, setUser, setPublicKey } = useUserStore();

  const crypto = require("crypto");
  const algorithm = "aes-256-cbc";
  const key = crypto.createHash("sha256").update("KEY_TEST").digest();
  const iv = crypto.randomBytes(16);

  function encrypt(text) {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return { iv: iv.toString("hex"), encryptedData: encrypted };
  }

  const getUserAWallet = async () => {
   // if (!user?.email) return;
    try {
      const newAccount = new AptosAccount();
      const collectionRef = collection(db, "testWalletUsers");
      const address = newAccount.address().hex();
      const privateKey = newAccount.toPrivateKeyObject().privateKeyHex;
      const encryptedResult = encrypt(privateKey);

      const walletData = {
        email: auth.currentUser.email,
        publicKey: address,
        userName: auth.currentUser.email,
        iv: encryptedResult.iv,
        encryptedData: encryptedResult.encryptedData,
      };

      const res = await addDoc(collectionRef, walletData);
      setPublicKey(address);
      console.log(res);
      return res;
    } catch (error) {
      console.error("Error generating wallet:", error);
      throw error;
    }
  };

  async function handleUserLogin() {
    try {
      console.log("callesd");
      const usersRef = collection(db, "testWalletUsers");
      const q = query(usersRef, where("email", "==", auth.currentUser.email));
      const querySnapshot = await getDocs(q);
      console.log(querySnapshot.docs);
      if (querySnapshot.docs.length == 0) {
        console.log("User does not exist");

        const res = await getUserAWallet();
        console.log(res);
        if (res) {
          router.push("/pay");
        }
        //return true;
      } else {
        if (auth.currentUser.email) {
          router.push("/pay");
        }
      }
      return !querySnapshot.empty;
    } catch (error) {
      console.error("Error checking if user exists:", error);
      throw error;
    }
  }

  const signInWithGoogle = async () => {
    try {
      const res = await signInWithPopup(auth, googleAuthProvider);
      if (res.user) {
        setUser({ email: res.user.email, publicKey: "" });
        //router.push("/pay");
      }
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser?.email) {
        setUser({ email: currentUser.email, publicKey: "" });
        console.log("current user is ", auth.currentUser);
        console.log("user is ",user);
        handleUserLogin();
        //router.push("/pay");
        // Optionally, you can fetch the user's public key from Firestore here
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [setUser]);

  return (
    <div>
      <div className="text-center flex justify-center flex-col">
        {!user ? (
          <button className="border" onClick={signInWithGoogle}>
            Sign up with Google
          </button>
        ) : (
          <>
            <p>Logged in as: {user.email}</p>
            <button className="" onClick={logout}>
              Logout
            </button>
            {/* <button onClick={}>Generate Wallet</button> */}
          </>
        )}
      </div>
    </div>
  );
}

export default Auth;
