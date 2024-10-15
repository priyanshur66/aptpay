"use client";
import Image from "next/image";
import Auth from "@/components/Auth";
import { auth, db } from "@/config/firebaseConfig";
import {
  getDocs,
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
export default function Home() {
  return (
    <div>
      <Auth />
    </div>
  );
}
