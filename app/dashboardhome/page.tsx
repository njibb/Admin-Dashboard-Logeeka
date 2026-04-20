"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useSession, signOut } from "next-auth/react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';


const ScrambleNumber = ({ value }: { value: string | number }) => {
  const [display, setDisplay] = useState<string | number>("...");

  useEffect(() => {
  if (value === "...") return;
  const duration = 800; 
  const interval = 40; 
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

const COLORS = ['#dc2626', '#f97316', '#f59e0b', '#ef4444', '#84cc16'];
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];

export default function DashboardHomePage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [totalBerita, setTotalBerita] = useState<number | string>("...");
  const [totalPortofolio, setTotalPortofolio] = useState<number | string>("...");

  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [rawBerita, setRawBerita] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [rawPortofolio, setRawPortofolio] = useState<any[]>([]);

  // State untuk Filter Tahun Berita
  const [selectedYear, setSelectedYear] = useState<string>("Semua");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const fetchDashboardData = async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const token = (session as any)?.accessToken;
    if (!token) return;

    const config = {
      headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
    };

    try {
      const urlBerita = "/api/admin/berita/pagination?sortBy=waktu_posting&sort=desc&currentPage=1&dataPerPage=100&keywords=";
      const urlPorto = "/api/project-profile/pagination?sort=desc&currentPage=1&dataPerPage=100&keywords=";
      
      const [beritaRes, portofolioRes] = await Promise.all([
        axios.get(urlBerita, config).catch(() => null),
        axios.get(urlPorto, config).catch(() => null)
      ]);

      const listBerita = beritaRes?.data?.result?.data || [];
      setRawBerita(listBerita);
      setTotalBerita(beritaRes?.data?.result?.count ?? listBerita.length ?? "0");

      const listPorto = portofolioRes?.data?.result?.data || portofolioRes?.data?.data || [];
      setRawPortofolio(listPorto);
      setTotalPortofolio(portofolioRes?.data?.result?.count ?? listPorto.length ?? "0");

    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        signOut({ callbackUrl: '/login' });
      }
    }
  };

  useEffect(() => {
    if (status === "authenticated") fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, session]);

 
  
  const availableYears = useMemo(() => {
    const years = new Set<string>();
    rawBerita.forEach(item => {
      if (item.waktu_posting) {
        const year = item.waktu_posting.substring(0, 4); 
        if (!isNaN(Number(year))) years.add(year);
      }
    });
    return Array.from(years).sort().reverse(); 
  }, [rawBerita]);

  
  const trendData = useMemo(() => {
    const monthsCount = Array(12).fill(0); // Bikin array [0, 0, ..., 0] isi 12

    rawBerita.forEach(item => {
      if (!item.waktu_posting) return;
      const year = item.waktu_posting.substring(0, 4);
      const monthIdx = parseInt(item.waktu_posting.substring(5, 7), 10) - 1; 

     
      if (selectedYear === "Semua" || year === selectedYear) {
        if (monthIdx >= 0 && monthIdx <= 11) {
          monthsCount[monthIdx] += 1;
        }
      }
    });

    
    return MONTH_NAMES.map((month, index) => ({
      name: month,
      Berita: monthsCount[index]
    }));
  }, [rawBerita, selectedYear]);

 
  const categoryData = useMemo(() => {
    const catCounts: Record<string, number> = {};
    rawPortofolio.forEach(item => {
      const cat = item.category_code ? item.category_code.replace('_', ' ').toUpperCase() : "UMUM";
      catCounts[cat] = (catCounts[cat] || 0) + 1;
    });
    return Object.keys(catCounts).map(key => ({
      name: key, value: catCounts[key]
    }));
  }, [rawPortofolio]);


  if (status === "loading") {
    return <div className="min-h-screen bg-[#fff5f5]"></div>;
  }

  return (
    <div className="relative min-h-screen p-6 sm:p-10 overflow-hidden font-sans bg-[#fff5f5]">
      
      {/* Efek Latar Belakang Blur */}
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-red-300 rounded-full mix-blend-multiply filter blur-[120px] opacity-30 z-0 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-orange-200 rounded-full mix-blend-multiply filter blur-[120px] opacity-30 z-0 pointer-events-none"></div>

      <div className="relative z-10 max-w-6xl mx-auto">
        
        {/* Header Dashboard */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Dashboard <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">Utama</span>
          </h2>
          <p className="text-gray-600 mt-2 text-lg">
            Selamat datang kembali, Admin! Berikut adalah ringkasan sistem Logeeka hari ini.
          </p>
        </motion.div>

        {/* ================= KARTU ANGKA TOTAL ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <motion.div 
            initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(220,38,38,0.15)] transition-all duration-300 group"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-500 uppercase tracking-wider mb-1">Total Berita</h3>
                <p className="text-6xl font-black text-gray-900 tracking-tight"><ScrambleNumber value={totalBerita} /></p>
              </div>
              <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm border border-red-100">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
              </div>
            </div>
            <p className="text-sm text-gray-500 font-medium">Artikel & Berita aktif di portal Logeeka.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(249,115,22,0.15)] transition-all duration-300 group"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-500 uppercase tracking-wider mb-1">Total Portofolio</h3>
                <p className="text-6xl font-black text-gray-900 tracking-tight"><ScrambleNumber value={totalPortofolio} /></p>
              </div>
              <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm border border-orange-100">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
              </div>
            </div>
            <p className="text-sm text-gray-500 font-medium">Project dan portofolio agensi Logeeka.</p>
          </motion.div> 
        </div>

        {/* ================= AREA GRAFIK RECHARTS ================= */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10"
        >
          
          {/* Grafik Garis (Tren Berita Saja) */}
          <div className="lg:col-span-2 bg-white/90 backdrop-blur-xl border border-gray-200 rounded-[2rem] p-6 sm:p-8 shadow-sm flex flex-col">
            
            {/* Header Area & Filter Tahun */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Tren Posting Berita</h3>
                <p className="text-sm text-gray-500 font-medium mt-1">Aktivitas publikasi artikel per bulan</p>
              </div>
              
              {/* Tombol Filter Tahun */}
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-xl">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-gray-500"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
                <select 
                  value={selectedYear} 
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="bg-transparent text-sm font-bold text-gray-700 focus:outline-none cursor-pointer"
                >
                  <option value="Semua">Semua Tahun</option>
                  {availableYears.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Area Line Chart */}
            <div className="flex-1 min-h-[250px] w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dy={10} />
                  <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                    cursor={{ stroke: '#fca5a5', strokeWidth: 2, strokeDasharray: '5 5' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Berita" 
                    name="Jumlah Berita"
                    stroke="#dc2626" 
                    strokeWidth={4} 
                    dot={{r: 4, strokeWidth: 2, fill: '#fff'}} 
                    activeDot={{r: 8, stroke: '#dc2626', strokeWidth: 2}} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Grafik Donat */}
          <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-[2rem] p-6 sm:p-8 shadow-sm flex flex-col">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Kategori Portofolio</h3>
            <p className="text-sm text-gray-500 mb-6 font-medium">Distribusi berdasarkan jenis project</p>
            
            {categoryData.length > 0 ? (
              <div className="flex-1 min-h-[200px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData} cx="50%" cy="50%" innerRadius="65%" outerRadius="90%"
                      paddingAngle={5} dataKey="value" stroke="none"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                  </PieChart>
                </ResponsiveContainer>
                {/* Teks di tengah donat */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-2">
                  <span className="text-3xl font-black text-gray-900">{totalPortofolio}</span>
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Project</span>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400 font-medium">
                Belum ada data portofolio.
              </div>
            )}
            
            {/* Custom Legend Donut */}
            <div className="mt-6 flex flex-wrap justify-center gap-3">
               {categoryData.map((entry, index) => (
                 <div key={index} className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                    <span className="text-xs font-semibold text-gray-600">{entry.name}</span>
                 </div>
               ))}
            </div>

          </div>

        </motion.div>

      </div>
    </div>
  );
}