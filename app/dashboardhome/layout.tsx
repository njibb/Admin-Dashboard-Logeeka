"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from "next-auth/react";
import Image from 'next/image';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutSuccess = async () => {
    setShowLogoutModal(false);
    await signOut({ redirect: false });
    window.location.replace('/Login');
  };

  return (
    <div className="flex h-screen bg-[#fff5f5] overflow-hidden font-sans">
      
      {/* ================= 1. SIDEBAR KIRI ================= */}
      <aside 
        className={`absolute lg:relative z-30 flex flex-col bg-white border-r border-gray-100 h-screen w-64 shrink-0 transition-all duration-300 ease-in-out shadow-[4px_0_24px_rgba(0,0,0,0.02)]
        ${isSidebarOpen ? 'translate-x-0 ml-0' : '-translate-x-full lg:-ml-64'}`}
      >
     
        <div className="h-24 flex items-center justify-center relative border-b border-gray-50 shrink-0 px-6">
          
       
          <Image 
            src="/logo-logeeka.png" 
            alt="Logo Logeeka" 
            width={90} 
            height={90} 
            className="object-contain"
          />
          
          
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="absolute right-4 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
            title="Tutup Menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8">
          <div>
            <p className="px-3 text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Menu Utama</p>
            <Link href="/dashboardhome" className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${pathname === '/dashboardhome' ? 'bg-red-50 text-red-600' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>
              Dashboard
            </Link>
          </div>

          <div>
            <p className="px-3 text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Manajemen Data</p>
            <div className="space-y-1">
              <Link href="/dashboardhome/berita" className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${pathname.includes('/berita') ? 'bg-red-50 text-red-600' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                Berita
              </Link>
              <Link href="/dashboardhome/portofolio" className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${pathname.includes('/portofolio') ? 'bg-red-50 text-red-600' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                Portofolio
              </Link>
              {/* 🔥 TAMBAHAN: Menu FAQ */}
              <Link href="/dashboardhome/faqs" className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${pathname.includes('/faqs') ? 'bg-red-50 text-red-600' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                </svg>
                FAQ
              </Link>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-100 shrink-0 mb-4">
           <button 
             onClick={() => setShowLogoutModal(true)}
             className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white px-4 py-3 rounded-2xl hover:bg-black transition-all font-bold"
           >
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></svg>
             Logout
           </button>
        </div>
      </aside>

      {/* ================= 2. AREA KANAN (KONTEN) ================= */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className={`flex items-center px-6 shrink-0 z-10 transition-all duration-300 ${!isSidebarOpen ? 'h-20' : 'h-8 pt-6'}`}>
          {!isSidebarOpen && (
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2.5 bg-white rounded-xl shadow-sm border border-gray-200 text-gray-500 hover:text-red-600 hover:bg-red-50 hover:border-red-100 transition-all focus:outline-none"
              title="Tampilkan Menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M12 17.25h8.25" />
              </svg>
            </button>
          )}
        </header>

        <main className="flex-1 overflow-y-auto px-6 pb-10">
          {children}
        </main>
      </div>

      {/* ================= 3. POP-UP KONFIRMASI LOGOUT ================= */}
      
      {showLogoutModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4">
          
          <div className="bg-white rounded-[1.5rem] shadow-2xl border border-gray-100 p-5 flex flex-col sm:flex-row items-center gap-5 max-w-xl w-full">
            
         
            <div className="w-12 h-12 shrink-0 flex items-center justify-center text-red-500 bg-red-50 rounded-full border border-red-100">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
              </svg>
            </div>

          
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-lg font-bold text-gray-900">Anda ingin keluar??</h3>
              <p className="text-sm text-gray-500 mt-0.5">Sesi Anda akan berakhir dan harus login kembali.</p>
            </div>

          
            <div className="flex items-center gap-3 w-full sm:w-auto mt-4 sm:mt-0 justify-center">
              <button 
                onClick={() => setShowLogoutModal(false)}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-all bg-white"
              >
                Tidak
              </button>
              
              <button 
                onClick={handleLogoutSuccess}
                className="px-6 py-2.5 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 shadow-md shadow-red-200 transition-all whitespace-nowrap"
              >
                Ya
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}