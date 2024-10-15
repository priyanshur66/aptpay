"use client"
import { Banner } from "@/components/Banner";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { LogoTicker } from "@/components/LogoTicker";
import { Features } from "@/components/Features";
import { CallToAction } from "@/components/CallToAction";


const Landing = () =>{
    return(
        <>
        <div className="overflow-x-hidden">
          
          <Navbar />
          <Hero />
          <LogoTicker />
          <Features />
          <CallToAction />
          </div>
          
        </>
    )
}

export default Landing;