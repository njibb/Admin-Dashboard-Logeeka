"use client";
import React from "react";
import Link from "next/link";
// 🔥 PASTIKAN IMPORT SPLINE YANG INI, BUKAN YANG /next
import Spline from '@splinetool/react-spline';

export default function HomePage() {
  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center bg-[#fff5f5] overflow-hidden font-sans">
      
      {/* ================= BACKGROUND MESH GRADIENT ================= */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-red-300 rounded-full mix-blend-multiply filter blur-[120px] opacity-70"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-rose-400 rounded-full mix-blend-multiply filter blur-[150px] opacity-60"></div>
      <div className="absolute top-[20%] left-[40%] w-[400px] h-[400px] bg-orange-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-60 animate-pulse"></div>

      {/* ================= MAIN CONTENT CONTAINER (FULL-PAGE SPLIT-SCREEN) ================= */}
      {/* Kita buat 'kartu' besar di tengah layar yang memuat split-screen */}
      <div className="relative z-10 w-full max-w-7xl h-[80vh] flex items-center justify-center p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 w-full h-full bg-white/40 backdrop-blur-3xl rounded-[2rem] sm:rounded-[3rem] border border-white/60 shadow-3xl overflow-hidden group">
          
          {/* ----- KOLOM KIRI: 3D MODEL ----- */}
          {/* Hapus pointer-events-none biar objek 3D-nya bisa diputar-putar */}
          <div className="w-full h-full relative border-b md:border-b-0 md:border-r border-gray-100/50 group-hover:scale-105 transition-transform duration-700">
            <Spline
              className="w-full h-full object-cover"
              scene="https://prod.spline.design/nAeYrG6-cWBSwYfT/scene.splinecode" 
            />
          </div>

          {/* ----- KOLOM KANAN: JUDUL & SUBTITLE ----- */}
          {/* Ubah text-center jadi text-left biar rapi */}
          <div className="w-full h-full flex flex-col items-start justify-center p-12 md:p-16 lg:p-20 text-left bg-gray-50/50">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-4 py-1.5 bg-gray-900 text-white rounded-xl text-xs font-black tracking-wider uppercase">
                DIGITAL LOGISTICS
              </span>
            </div>
            
            {/* 🔥 Ganti teks gradien jadi solid merah biar bold dan profesional */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter text-red-600 leading-none mb-4">
              LOGEEKA<span className="text-red-500">.</span>
            </h1>

            <p className="text-gray-700 font-semibold text-xl md:text-2xl mt-4 max-w-xl leading-relaxed">
              Transforming supply chain operations with intelligent, data-driven automation.
            </p>

            {/* ================= TOMBOL LOGIN (DIBAWAH JUDUL) ================= */}
            {/* Kasih margin top biar ada jarak dari teks */}
            <div className="mt-8 z-20">
                <Link 
                href="/Login" 
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

        </div>
      </div>
      
    </div>
  );
}