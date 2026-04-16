"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function DashboardHomePage() {
  const router = useRouter();

  const [totalBerita, setTotalBerita] = useState<number | string>("...");
  const [totalPortofolio, setTotalPortofolio] = useState<number | string>("...");

 const fetchDashboardData = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login"); 
      return;
    }

    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    };

    // 1. Fetch Total Berita
    try {
      const urlBerita = "/api/admin/berita/pagination?sortBy=judul_berita&sort=asc&currentPage=1&dataPerPage=10&keywords=";
      const beritaRes = await axios.get(urlBerita, config);
      const countBerita = beritaRes.data?.result?.count ?? "0";
      
      setTotalBerita(countBerita);
    } catch (error) {
      console.error("Failed to fetch Berita count:", error);
      setTotalBerita("0");
    }

    // 2. Fetch Total Portofolio
    try {
      // 🔥 PERBAIKAN: Hapus /admin/ karena dari Postman jalurnya langsung /api/project-profile/
      const urlPorto = "/api/project-profile/pagination?sort=asc&currentPage=1&dataPerPage=10&keywords=";
      const portofolioRes = await axios.get(urlPorto, config);
      const countPortofolio = portofolioRes.data?.result?.count ?? "0";
      
      setTotalPortofolio(countPortofolio);
    } catch (error) {
      console.error("Failed to fetch Portofolio count:", error);
      setTotalPortofolio("0");
    }
  };

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative min-h-screen p-6 sm:p-10 overflow-hidden font-sans bg-[#fff5f5]">
      
      {/* Background Mesh Gradient */}
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-red-300 rounded-full mix-blend-multiply filter blur-[120px] opacity-30 z-0 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-orange-200 rounded-full mix-blend-multiply filter blur-[120px] opacity-30 z-0 pointer-events-none"></div>

      {/* Konten Utama */}
      <div className="relative z-10 max-w-6xl mx-auto">
        
        {/* Header Teks */}
        <div className="mb-10">
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Dashboard <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">Utama</span>
          </h2>
          <p className="text-gray-600 mt-2 text-lg">
            Selamat datang kembali, Admin! Berikut adalah ringkasan sistem Logeeka hari ini.
          </p>
        </div>

        {/* Kartu Statistik */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          
          {/* Kartu 1: Total Berita */}
          <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(220,38,38,0.15)] transition-all duration-300 group">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-500 uppercase tracking-wider mb-1">Total Berita</h3>
                <p className="text-5xl font-black text-gray-900">{totalBerita}</p>
              </div>
              <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm border border-red-100">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
            </div>
            <p className="text-sm text-gray-500">Artikel & Berita aktif di portal Logeeka.</p>
          </div>

          {/* Kartu 2: Total Portofolio */}
          <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(249,115,22,0.15)] transition-all duration-300 group">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-500 uppercase tracking-wider mb-1">Total Portofolio</h3>
                <p className="text-5xl font-black text-gray-900">{totalPortofolio}</p>
              </div>
              <div className="w-14 h-14 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm border border-orange-100">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </div>
            </div>
            <p className="text-sm text-gray-500">Project dan portofolio agensi Logeeka.</p>
          </div>

        </div>
      </div>
    </div>
  );
}