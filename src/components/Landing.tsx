"use client"
import { Banner } from "@/components/Banner";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { LogoTicker } from "@/components/LogoTicker";
import { Features } from "@/components/Features";
import { CallToAction } from "@/components/CallToAction";
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


const Landing = () =>{
    return(
        <>
        <div className="overflow-x-hidden">
          <Navbar />
          <Hero />
          <LogoTicker />
          <Features />
          </div> 
        </>
    )
}

export default Landing;