"use client";

import React from 'react';
import Link from 'next/link';
// 1. TAMBAHKAN useRouter di sini
import { usePathname, useRouter } from 'next/navigation'; 
// 2. TAMBAHKAN axios di sini
import axios from 'axios'; 

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // 3. Panggil router untuk fungsi pindah halaman
  const router = useRouter(); 

  const isActive = (path: string) => pathname === path || pathname?.startsWith(`${path}/`);

  // 4. INI ADALAH FUNGSI LOGOUT-NYA
  const handleLogout = async () => {
    const confirmLogout = window.confirm("Yakin ingin keluar dari Dashboard?");
    if (!confirmLogout) return;

    try {
      const token = localStorage.getItem("token");
      
      if (token) {
        await axios.post("/api/user/logout", {}, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });
      }
    } catch (error) {
      console.error("Gagal memanggil API logout:", error);
    } finally {
      // Menghapus token dari memori browser
      localStorage.removeItem("token");
      // Menendang user kembali ke form login
      router.push("/Login");
    }
  };

  return (
    <div className="flex h-screen bg-[#fff5f5] font-sans overflow-hidden">
      
      {/* ================= SIDEBAR NAVIGASI ================= */}
      <aside className="w-72 bg-white/90 backdrop-blur-xl border-r border-gray-200 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] relative z-20">
        
        {/* Logo Area */}
        <div className="h-24 flex items-center px-8 border-b border-gray-100">
          <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center mr-3 shadow-md shadow-red-200">
            <span className="text-white font-black text-2xl">L</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tighter">
            LOGEEKA<span className="text-red-600">.</span>
          </h1>
        </div>

        {/* Menu Navigasi */}
        <nav className="flex-1 overflow-y-auto py-8 px-5 space-y-2">
          
          <p className="px-3 text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Menu Utama</p>
          
          {/* Menu Dashboard */}
          <Link 
            href="/dashboardhome" 
            className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all duration-300 ${
              pathname === '/dashboardhome' 
                ? 'bg-red-50 text-red-600 shadow-sm border border-red-100' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>
            Dashboard
          </Link>

          <p className="px-3 text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 mt-8">Manajemen Data</p>

          {/* Menu Berita */}
          <Link 
            href="/dashboardhome/berita" 
            className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all duration-300 ${
              isActive('/dashboardhome/berita') 
                ? 'bg-red-50 text-red-600 shadow-sm border border-red-100' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
            Berita
          </Link>

          {/* Menu Portofolio */}
          <Link 
            href="/dashboardhome/portofolio" 
            className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all duration-300 ${
              isActive('/dashboardhome/portofolio') 
                ? 'bg-red-50 text-red-600 shadow-sm border border-red-100' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
            Portofolio
          </Link>

        </nav>

        {/* 5. INI TOMBOL LOGOUT YANG SUDAH DIBERI onClick */}
        <div className="p-6 border-t border-gray-100">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 hover:shadow-lg transition-all duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" /></svg>
            Logout
          </button>
        </div>
      </aside>

      {/* ================= AREA KONTEN UTAMA ================= */}
      <main className="flex-1 overflow-y-auto relative">
        {children}
      </main>

    </div>
  );
}