"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function DashboardHomePage() {
  const router = useRouter();

  const [totalBerita, setTotalBerita] = useState<number | string>("...");
  const [totalPortofolio, setTotalPortofolio] = useState<number | string>("...");

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      // Menyiapkan konfigurasi header untuk API yang membutuhkan otorisasi
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      };

      // Menjalankan dua request API secara bersamaan untuk efisiensi
      const [beritaRes, portofolioRes] = await Promise.all([
        axios.get("/api/admin/berita/pagination?currentPage=1&dataPerPage=1", config),
        // Gunakan API publik untuk Portofolio karena di Postman tidak menggunakan bearer token pada bagian ini
        axios.get("/api/project-profile/pagination?currentPage=1&dataPerPage=1")
      ]);

      // Mengambil nilai "count" dari masing-masing response
      if (beritaRes.data?.result?.count !== undefined) {
        setTotalBerita(beritaRes.data.result.count);
      }
      
      if (portofolioRes.data?.result?.count !== undefined) {
        setTotalPortofolio(portofolioRes.data.result.count);
      }

    } catch (error) {
      console.error("Gagal mengambil data dashboard:", error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        localStorage.removeItem("token");
        router.push("/login");
      }
    }
  };

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative min-h-screen p-6 sm:p-10 overflow-hidden font-sans bg-[#fff5f5]">
      
      {/* ================= BACKGROUND MESH GRADIENT ================= */}
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-red-300 rounded-full mix-blend-multiply filter blur-[120px] opacity-30 z-0 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-orange-200 rounded-full mix-blend-multiply filter blur-[120px] opacity-30 z-0 pointer-events-none"></div>

      {/* ================= KONTEN UTAMA ================= */}
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

        {/* ================= KARTU STATISTIK ================= */}
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