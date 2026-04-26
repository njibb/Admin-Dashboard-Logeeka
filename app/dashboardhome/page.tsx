"use client";
import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useSession, signOut } from "next-auth/react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  PieChart, Pie, Cell} from 'recharts';
import Swal from 'sweetalert2';

const ScrambleNumber = ({ value }: { value: string | number }): import("react/jsx-runtime").JSX.Element => {
  const [display, setDisplay] = useState<string | number>("...");

  useEffect((): (() => void) | undefined => {
  if (value === "...") return;
  const duration = 800; 
  const interval = 40; 
  let elapsed = 0;     
  
    const timer = setInterval((): void => {
      elapsed += interval;
      if (elapsed >= duration) {
        clearInterval(timer);
        setDisplay(value); 
      } else {
        setDisplay(Math.floor(Math.random() * 100)); 
      }
    }, interval);

    return (): void => clearInterval(timer);
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
  const [totalFaq, setTotalFaq] = useState<number | string>("...");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [rawBerita, setRawBerita] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [rawPortofolio, setRawPortofolio] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [rawFaq, setRawFaq] = useState<any[]>([]);

  // State untuk Filter Berita
  const [selectedYear, setSelectedYear] = useState<string>("Semua");
  const [selectedMonth, setSelectedMonth] = useState<string>("Semua");

  // State untuk Filter Portofolio
  const [selectedPortoYear, setSelectedPortoYear] = useState<string>("Semua");
  const [selectedPortoMonth, setSelectedPortoMonth] = useState<string>("Semua");

  useEffect((): void => {
    if (status === "unauthenticated") {
      router.push("/Login");
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
      const urlFaq = "/api/admin/faq/pagination?currentPage=1&dataPerPage=100&keywords=";
      
      const [beritaRes, portofolioRes, faqRes] = await Promise.all([
        axios.get(urlBerita, config),
        axios.get(urlPorto, config),
        axios.get(urlFaq, config)
      ]);

      const listBerita = beritaRes?.data?.result?.data || [];
      setRawBerita(listBerita);
      setTotalBerita(beritaRes?.data?.result?.count ?? listBerita.length ?? "0");

      const listPorto = portofolioRes?.data?.result?.data || portofolioRes?.data?.data || [];
      setRawPortofolio(listPorto);
      setTotalPortofolio(portofolioRes?.data?.result?.count ?? listPorto.length ?? "0");

      const listFaq = faqRes?.data?.result?.data || faqRes?.data?.data || [];
      setRawFaq(listFaq);
      setTotalFaq(faqRes?.data?.result?.count ?? listFaq.length ?? "0");

    } catch (error) {
      console.error("DASHBOARD FETCH ERROR:", error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          signOut({ callbackUrl: '/Login' });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'API Error!',
            text: `Gagal tarik data. Status: ${error.response?.status} - ${error.message}`
          });
        }
      }
    }
  };

  useEffect((): void => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tokenSiap = (session as any)?.accessToken;
    if (status === "authenticated" && tokenSiap) {
      fetchDashboardData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, session]);

  const availableYears = useMemo(function () {
    const years = new Set<string>();
    rawBerita.forEach((item): void => {
      if (item.waktu_posting) {
        const year = item.waktu_posting.substring(0, 4);
        if (!isNaN(Number(year))) years.add(year);
      }
    });
    return Array.from(years).sort().reverse();
  }, [rawBerita]);

  const availablePortoYears = useMemo(function () {
    const years = new Set<string>();
    rawPortofolio.forEach((item): void => {
      if (item.waktu_posting) {
        const year = item.waktu_posting.substring(0, 4);
        if (!isNaN(Number(year))) years.add(year);
      }
    });
    return Array.from(years).sort().reverse();
  }, [rawPortofolio]);

  const trendData = useMemo(() => {
    if (selectedMonth === "Semua") {
      const monthsCount = Array(12).fill(0);
      rawBerita.forEach((item): void => {
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

    } else {
      const yearNum = selectedYear !== "Semua" ? parseInt(selectedYear) : new Date().getFullYear();
      const monthNum = parseInt(selectedMonth);
      const daysInMonth = new Date(yearNum, monthNum, 0).getDate(); 
      
      const daysCount = Array(daysInMonth).fill(0);

      rawBerita.forEach((item): void => {
        if (!item.waktu_posting) return;
        const year = item.waktu_posting.substring(0, 4);
        const month = item.waktu_posting.substring(5, 7);
        const dayIdx = parseInt(item.waktu_posting.substring(8, 10), 10) - 1; 

        const matchYear = selectedYear === "Semua" || year === selectedYear;
        const matchMonth = month === selectedMonth;

        if (matchYear && matchMonth) {
          if (dayIdx >= 0 && dayIdx < daysInMonth) {
            daysCount[dayIdx] += 1;
          }
        }
      });

      return Array.from({ length: daysInMonth }, (_, i) => ({
        name: `${i + 1} ${MONTH_NAMES[monthNum - 1]}`, 
        Berita: daysCount[i]
      }));
    }
  }, [rawBerita, selectedYear, selectedMonth]);

  const categoryData = useMemo(() => {
    const catCounts: Record<string, number> = {};
    let filteredCount = 0;

    rawPortofolio.forEach((item): void => {
      let matchYear = true;
      let matchMonth = true;

      if (item.waktu_posting) {
        const year = item.waktu_posting.substring(0, 4);
        const month = item.waktu_posting.substring(5, 7);
        
        if (selectedPortoYear !== "Semua") matchYear = year === selectedPortoYear;
        if (selectedPortoMonth !== "Semua") matchMonth = month === selectedPortoMonth;
      }

      if (matchYear && matchMonth) {
        const cat = item.category_code ? item.category_code.replace('_', ' ').toUpperCase() : "UMUM";
        catCounts[cat] = (catCounts[cat] || 0) + 1;
        filteredCount++;
      }
    });

    const chartData = Object.keys(catCounts).map((key): { name: string; value: number; } => ({
      name: key, value: catCounts[key]
    }));

    return { chartData, filteredCount };
  }, [rawPortofolio, selectedPortoYear, selectedPortoMonth]);

  const latestFaqs = useMemo(() => {
    return [...rawFaq].sort((a, b) => {
       const dateA = new Date(a.waktu_posting || a.created_at).getTime();
       const dateB = new Date(b.waktu_posting || b.created_at).getTime();
       return dateB - dateA;
    }).slice(0, 4);
  }, [rawFaq]);

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

        {/* ================= KARTU ANGKA TOTAL (3 Kolom) ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-8">
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-[2rem] p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(220,38,38,0.15)] transition-all duration-300 group"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Total Berita</h3>
                <p className="text-5xl font-black text-gray-900 tracking-tight"><ScrambleNumber value={totalBerita} /></p>
              </div>
              <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm border border-red-100">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
              </div>
            </div>
            <p className="text-xs text-gray-500 font-medium">Artikel & Berita aktif di portal.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-[2rem] p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(249,115,22,0.15)] transition-all duration-300 group"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Total Portofolio</h3>
                <p className="text-5xl font-black text-gray-900 tracking-tight"><ScrambleNumber value={totalPortofolio} /></p>
              </div>
              <div className="w-14 h-14 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm border border-orange-100">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
              </div>
            </div>
            <p className="text-xs text-gray-500 font-medium">Project agensi Logeeka.</p>
          </motion.div> 

          <motion.div 
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-[2rem] p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(59,130,246,0.15)] transition-all duration-300 group"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Total FAQ</h3>
                <p className="text-5xl font-black text-gray-900 tracking-tight"><ScrambleNumber value={totalFaq} /></p>
              </div>
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm border border-blue-100">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-7 h-7">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-gray-500 font-medium">Daftar pertanyaan dan bantuan.</p>
          </motion.div> 

        </div>

        {/* ================= AREA GRAFIK RECHARTS (Grid 3 Kolom Kembali) ================= */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-8"
        >
          
          {/* Grafik Garis (Tren Berita - Mengambil 2 Kolom) */}
          <div className="lg:col-span-2 bg-white/90 backdrop-blur-xl border border-gray-200 rounded-[2rem] p-6 sm:p-8 shadow-sm flex flex-col">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Tren Posting Berita</h3>
                <p className="text-sm text-gray-500 font-medium mt-1">Aktivitas publikasi artikel per waktu</p>
              </div>
              
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-xl">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-gray-500"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
                  <select 
                    value={selectedMonth} 
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="bg-transparent text-sm font-bold text-gray-700 focus:outline-none cursor-pointer"
                  >
                    <option value="Semua">Bulan</option>
                    {MONTH_NAMES.map((month, index) => (
                      <option key={month} value={String(index + 1).padStart(2, '0')}>{month}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-xl">
                  <select 
                    value={selectedYear} 
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="bg-transparent text-sm font-bold text-gray-700 focus:outline-none cursor-pointer"
                  >
                    <option value="Semua">Tahun</option>
                    {availableYears.map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex-1 min-h-[250px] w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 10}} dy={10} />
                  <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                  <RechartsTooltip 
                    contentStyle={{ 
                      borderRadius: '1rem', 
                      border: 'none', 
                      boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                      backgroundColor: '#ffffff'
                    }}
                    labelStyle={{ color: '#111827', fontWeight: '900', marginBottom: '4px' }}
                    itemStyle={{ color: '#dc2626', fontWeight: '600' }}
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

          {/* Grafik Donat (Portofolio - Mengambil 1 Kolom) */}
          <div className="lg:col-span-1 bg-white/90 backdrop-blur-xl border border-gray-200 rounded-[2rem] p-6 shadow-sm flex flex-col h-full">
            
            <div className="flex flex-col items-start mb-6 gap-2">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">Kategori Portofolio</h3>
                <p className="text-xs text-gray-500 font-medium">Distribusi jenis project</p>
              </div>
              
              <div className="flex flex-wrap items-center gap-1.5 mt-1">
                <div className="bg-gray-50 border border-gray-200 px-2 py-1 rounded-lg">
                  <select 
                    value={selectedPortoMonth} 
                    onChange={(e) => setSelectedPortoMonth(e.target.value)}
                    className="bg-transparent text-xs font-bold text-gray-700 focus:outline-none cursor-pointer"
                  >
                    <option value="Semua">Bulan</option>
                    {MONTH_NAMES.map((month, index) => (
                      <option key={month} value={String(index + 1).padStart(2, '0')}>{month}</option>
                    ))}
                  </select>
                </div>
                <div className="bg-gray-50 border border-gray-200 px-2 py-1 rounded-lg">
                  <select 
                    value={selectedPortoYear} 
                    onChange={(e) => setSelectedPortoYear(e.target.value)}
                    className="bg-transparent text-xs font-bold text-gray-700 focus:outline-none cursor-pointer"
                  >
                    <option value="Semua">Tahun</option>
                    {availablePortoYears.map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            {categoryData.chartData.length > 0 ? (
              <div className="flex-1 min-h-[180px] w-full relative">
                
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-2 z-0">
                  <span className="text-3xl font-black text-gray-900">{categoryData.filteredCount}</span>
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Project</span>
                </div>

                <ResponsiveContainer width="100%" height="100%" className="relative z-10">
                  <PieChart>
                    <Pie
                      data={categoryData.chartData} cx="50%" cy="50%" innerRadius="65%" outerRadius="90%"
                      paddingAngle={5} dataKey="value" stroke="none"
                    >
                      {categoryData.chartData.map((entry, index): import("react/jsx-runtime").JSX.Element => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  
                    <RechartsTooltip 
                      wrapperStyle={{ zIndex: 100 }}
                      contentStyle={{ 
                        borderRadius: '1rem', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', backgroundColor: 'rgba(255, 255, 255, 0.95)' 
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400 font-medium text-center">
                 <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 mb-2 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                 <p className="text-sm">Kosong di periode ini</p>
              </div>
            )}
            
            {categoryData.chartData.length > 0 && (
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                 {categoryData.chartData.map((entry, index): import("react/jsx-runtime").JSX.Element => (
                   <div key={index} className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                      <span className="text-[11px] font-semibold text-gray-600">{entry.name}</span>
                   </div>
                 ))}
              </div>
            )}

          </div>

        </motion.div>

        {/* 🔥 TAMBAHAN BARU: SECTION FAQ YANG MEMANJANG DI BAWAH GRAFIK */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-[2rem] p-6 sm:p-8 shadow-sm flex flex-col mb-10"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
             <div>
               <h3 className="text-xl font-bold text-gray-900 mb-1">FAQ Terbaru</h3>
               <p className="text-sm text-gray-500 font-medium">Bantuan dan pertanyaan yang baru ditambahkan</p>
             </div>
             
             <Link href="/dashboardhome/faqs" className="flex items-center justify-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-5 py-2.5 rounded-xl transition-all border border-blue-100 w-full sm:w-auto">
               Lihat Semua
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" /></svg>
             </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {latestFaqs.length > 0 ? (
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              latestFaqs.map((faq: any, i: number) => (
                <div key={faq.id || i} className="p-5 rounded-2xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/40 transition-all group flex flex-col h-full bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                   <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-4 shrink-0 border border-blue-100 group-hover:scale-110 transition-transform">
                      <span className="font-black text-lg">?</span>
                   </div>
                   <h4 className="font-bold text-gray-900 text-sm mb-2 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                     {faq.judul}
                   </h4>
                   <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed mt-auto">
                     {faq.konten ? faq.konten.replace(/<[^>]+>/g, '') : "Tidak ada detail konten."}
                   </p>
                </div>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center text-gray-400 font-medium text-center py-10">
                <p>Belum ada daftar FAQ.</p>
              </div>
            )}
          </div>

        </motion.div>

      </div>
    </div>
  );
}