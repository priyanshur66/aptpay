"use client"
import acmeLogo from "../assets/images/acme.png";
import quantumLogo from "../assets/images/quantum.png";
import echoLogo from "../assets/images/echo.png";
import celestialLogo from "../assets/images/celestial.png";
import pulseLogo from "../assets/images/pulse.png";
import apexLogo from "../assets/images/apex.png";
import Image from 'next/image';
import LogoCarousel from "./companylogos";

const images = [
  { src: acmeLogo, alt: "Acme Logo" },
  { src: quantumLogo, alt: "Quantum Logo" },
  { src: echoLogo, alt: "Echo Logo" },
  { src: celestialLogo, alt: "Celestial Logo" },
  { src: pulseLogo, alt: "Pulse Logo" },
  { src: apexLogo, alt: "Apex Logo" },
];

export const LogoTicker = () => {
  return(
    <div className="bg-black text-white py-[72px] sm:py-24">
      <div className="container">
        <h2 className="text-2xl text-center text-white/70 mb-5">Boost Wellness Through Gamified Goals</h2>
        
        
        
      </div>

    </div>
  )
};
