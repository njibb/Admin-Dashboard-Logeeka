"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useSession, signOut } from "next-auth/react";


const ScrambleNumber = ({ value }: { value: string | number }) => {
  const [display, setDisplay] = useState<string | number>("...");

  useEffect(() => {
    if (value === "...") return; 

    // eslint-disable-next-line prefer-const
    let duration = 800; 
    // eslint-disable-next-line prefer-const
    let interval = 40;  
    let elapsed = 0;

    const timer = setInterval(() => {
      elapsed += interval;
      if (elapsed >= duration) {
        clearInterval(timer);
        setDisplay(value); 
      } else {
        setDisplay(Math.floor(Math.random() * 100)); 
      }
    }, interval);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{display}</span>;
};

export default function DashboardHomePage() {
  const router = useRouter();
  
  
  const { data: session, status } = useSession();

  const [totalBerita, setTotalBerita] = useState<number | string>("...");
  const [totalPortofolio, setTotalPortofolio] = useState<number | string>("...");

  
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // ================= FUNGSI GET DATA =================
  const fetchDashboardData = async () => {
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const token = (session as any)?.accessToken;

    if (!token) return; 

    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    };

    try {
      const urlBerita = "/api/admin/berita/pagination?sortBy=judul_berita&sort=asc&currentPage=1&dataPerPage=10&keywords=";
      const beritaRes = await axios.get(urlBerita, config);
      const countBerita = beritaRes.data?.result?.count ?? "0";
      
      setTotalBerita(countBerita);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
       
        signOut({ callbackUrl: '/login' });
        return; 
      }
      setTotalBerita("0");
    }

    try {
      const urlPorto = "/api/project-profile/pagination?sort=asc&currentPage=1&dataPerPage=10&keywords=";
      const portofolioRes = await axios.get(urlPorto, config);
      const countPortofolio = portofolioRes.data?.result?.count ?? "0";
      
      setTotalPortofolio(countPortofolio);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        signOut({ callbackUrl: '/login' });
        return;
      }
      setTotalPortofolio("0");
    }
  };

  useEffect(() => {
    
    if (status === "authenticated") {
      fetchDashboardData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, session]);

 
  if (status === "loading") {
    return <div className="min-h-screen bg-[#fff5f5]"></div>;
  }

  return (
    <div className="relative min-h-screen p-6 sm:p-10 overflow-hidden font-sans bg-[#fff5f5]">
      
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-red-300 rounded-full mix-blend-multiply filter blur-[120px] opacity-30 z-0 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-orange-200 rounded-full mix-blend-multiply filter blur-[120px] opacity-30 z-0 pointer-events-none"></div>

      <div className="relative z-10 max-w-6xl mx-auto">
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Dashboard <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">Utama</span>
          </h2>
          <p className="text-gray-600 mt-2 text-lg">
            Selamat datang kembali, Admin! Berikut adalah ringkasan sistem Logeeka hari ini.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          
          {/* ================= KARTU BERITA ================= */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(220,38,38,0.15)] transition-all duration-300 group"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-500 uppercase tracking-wider mb-1">Total Berita</h3>
                <p className="text-6xl font-black text-gray-900 tracking-tight">
                  <ScrambleNumber value={totalBerita} />
                </p>
              </div>
              <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm border border-red-100">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
            </div>
            <p className="text-sm text-gray-500 font-medium">Artikel & Berita aktif di portal Logeeka.</p>
          </motion.div>

          {/* ================= KARTU PORTOFOLIO ================= */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(249,115,22,0.15)] transition-all duration-300 group"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-500 uppercase tracking-wider mb-1">Total Portofolio</h3>
                <p className="text-6xl font-black text-gray-900 tracking-tight">
                  <ScrambleNumber value={totalPortofolio} />
                </p>
              </div>
              <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm border border-orange-100">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </div>
            </div>
            <p className="text-sm text-gray-500 font-medium">Project dan portofolio agensi Logeeka.</p>
          </motion.div> 

        </div>
      </div>
    </div>
  );
}