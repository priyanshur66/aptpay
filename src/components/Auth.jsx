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
  const aptosConfig = new AptosConfig({ network: Network.TESTNET });
  const aptos = new Aptos(aptosConfig);

  const NODE_URL = "https://fullnode.testnet.aptoslabs.com/v1";
  const crypto = require("crypto");
  const algorithm = "aes-256-cbc";
  const key = crypto
    .createHash("sha256")
    .update(process.env.NEXT_PUBLIC_ENCRYPT_KEY)
    .digest();
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
      console.log("called");
      const usersRef = collection(db, "testWalletUsers");
      const q = query(usersRef, where("email", "==", auth.currentUser.email));
      const querySnapshot = await getDocs(q);
  
      if (querySnapshot.empty) {
        console.log("User does not exist");
  
        const res = await getUserAWallet();
        console.log(res);
  
        // Fetch the newly created user data
        const newUserSnapshot = await getDocs(q);
        if (!newUserSnapshot.empty) {
          const newUserData = newUserSnapshot.docs[0].data();
          setUser({
            email: auth.currentUser.email,
            publicKey: newUserData.publicKey,
            encData: newUserData.encryptedData,
            iv: newUserData.iv,
          });
          console.log(res);
          if (res) {
            router.push("/pay");
          }
        } else {
          console.error("Failed to retrieve new user data");
        }
      } else {
        if (auth.currentUser.email) {
          const userData = querySnapshot.docs[0].data();
          console.log(userData.publicKey);
          setUser({
            email: auth.currentUser.email,
            publicKey: userData.publicKey,
            encData: userData.encryptedData,
            iv: userData.iv,
          });
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
        setUser({ email: res.user.email, publicKey: res.user.publicKey });
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
        setUser({ email: currentUser.email, publicKey: currentUser.publicKey });
        console.log("current user is ", auth.currentUser);
        console.log("user is ", user);
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
          <button className="flex items-center mt-24 mb-10 justify-center border px-4 py-2 rounded-lg bg-white text-gray-700 hover:bg-gray-100" onClick={signInWithGoogle}>
          <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
            <path fill="#4285F4" d="M24 9.5c2.2 0 4.2.8 5.8 2.3l4.3-4.3C30.8 5 27.5 4 24 4 14.9 4 7.5 10.9 6 19.5l5.9 4.6c.8-5.5 5.5-9.6 12.1-9.6z"/>
            <path fill="#34A853" d="M24 44c5.5 0 10-1.8 13.4-4.8l-6.1-4.7c-1.7 1.2-3.8 1.9-7.3 1.9-5.7 0-10.5-3.8-12.2-9l-6 4.6C10.1 39.9 16.6 44 24 44z"/>
            <path fill="#FBBC05" d="M43.6 24.5c0-1.1-.1-2.2-.3-3.2H24v6.3h11.1c-.5 2.5-2 4.6-4.2 6l6.1 4.7c3.6-3.3 6-8.1 6-13.8z"/>
            <path fill="#EA4335" d="M12.5 28.8c-.4-1.2-.6-2.5-.6-3.8s.2-2.6.6-3.8l-6-4.6C5.2 19.6 4.5 22.2 4.5 25s.7 5.4 2 7.6l6-4.6z"/>
          </svg>
        
          Sign in with Google
        </button>
        
        ) : (
          <>
            <p>Logged in as: {user.email}</p>
            <button className="border px-8 py-1" onClick={logout}>
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
