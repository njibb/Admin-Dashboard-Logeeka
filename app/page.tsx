"use client";
import React from "react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center bg-[#fff5f5] overflow-hidden font-sans p-4">
      
      {/* ================= BACKGROUND MESH GRADIENT ================= */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-red-300 rounded-full mix-blend-multiply filter blur-[120px] opacity-70"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-rose-400 rounded-full mix-blend-multiply filter blur-[150px] opacity-60"></div>
      <div className="absolute top-[20%] left-[40%] w-[400px] h-[400px] bg-orange-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-60 animate-pulse"></div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center w-full max-w-3xl bg-white/60 backdrop-blur-2xl p-12 md:p-20 rounded-[3rem] border border-white shadow-[0_20px_50px_-12px_rgba(220,38,38,0.15)]">
        
        <div className="flex items-center gap-3 mb-6">
          <span className="px-4 py-1.5 bg-red-600 text-white rounded-xl text-xs font-black tracking-wider uppercase shadow-sm">
            DIGITAL MARKETING AGENCY
          </span>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-gray-900 leading-none mb-6">
          LOGEEKA<span className="text-red-600">.</span>
        </h1>


        {/* ================= TOMBOL LOGIN ================= */}
        <Link 
          href="/Login" 
          className="group flex items-center gap-3 px-8 py-4 bg-red-600 text-white rounded-full shadow-lg shadow-red-600/30 hover:bg-red-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
        >
          <span className="font-bold text-lg tracking-wide">
            Login Page
          </span>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth={2.5} 
            stroke="currentColor" 
            className="w-5 h-5 group-hover:translate-x-1 transition-transform"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Link>

      </div>
    </div>
  );
}