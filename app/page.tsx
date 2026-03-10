import React from "react";
import Link from "next/link";

export default function HomePage() {
  return (
   
    <div className="min-h-screen relative flex flex-col items-center justify-center bg-[#fff5f5] overflow-hidden font-sans">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-red-300 rounded-full mix-blend-multiply filter blur-[120px] opacity-70"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-rose-400 rounded-full mix-blend-multiply filter blur-[150px] opacity-60"></div>
      <div className="absolute top-[20%] left-[40%] w-[400px] h-[400px] bg-orange-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-60 animate-pulse"></div>
      {/* ================= KONTEN TENGAH ================= */}
      <div className="relative z-10 text-center px-4">
        <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-red-600 via-rose-500 to-orange-400 drop-shadow-sm">
          LOGEEKA<span className="text-red-500">.</span>
        </h1>
      </div>
      {/* ================= TOMBOL LOGIN (POJOK KANAN BAWAH) ================= */}
      <div className="absolute bottom-8 right-8 md:bottom-12 md:right-12 z-20">
        <Link 
          href="Login" 
          className="group flex items-center gap-3 px-6 py-3 bg-white/60 backdrop-blur-md border border-white/80 rounded-full shadow-lg hover:shadow-xl hover:bg-white transition-all duration-300"
        >
          <span className="text-red-600 font-bold text-sm md:text-base tracking-wide">
            Login page
          </span>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth={2.5} 
            stroke="currentColor" 
            className="w-5 h-5 text-red-600 group-hover:translate-x-1 transition-transform"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
};