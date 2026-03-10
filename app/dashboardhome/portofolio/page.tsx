"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';

// Interface untuk TypeScript berdasarkan struktur data Portofolio
interface Portofolio {
  id: string;
  title: string;
  category_code: string;
  project_url: string;
}

export default function ManajemenPortofolioPage() {
  const [portofolioData, setPortofolioData] = useState<Portofolio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchPortofolio = async () => {
    setIsLoading(true);
    setErrorMsg("");

    try {
      // Mengambil data menggunakan API Publik Portofolio (sesuai Postman)
      const response = await axios.get("/api/project-profile/pagination?currentPage=1&dataPerPage=10");
      
      if (response.data?.result?.data) {
        setPortofolioData(response.data.result.data);
      }
    } catch (error) {
      console.error("Gagal mengambil data portofolio:", error);
      setErrorMsg("Terjadi kesalahan saat memuat data dari server.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPortofolio();
   
  }, []);

  return (
    <div className="min-h-screen p-6 sm:p-10 font-sans">
      
      {/* ================= HEADER HALAMAN ================= */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Manajemen Portofolio</h2>
          <p className="text-gray-500 mt-1">Kelola data project profile dan portofolio agensi.</p>
        </div>
        
        <Link 
          href="/dashboardhome/portofolio/tambah" 
          className="flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all shadow-md shadow-orange-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Tambah Portofolio
        </Link>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-200 font-medium">
          {errorMsg}
        </div>
      )}

      {/* ================= KARTU TABEL ================= */}
      <div className="bg-white/90 backdrop-blur-xl rounded-[1.5rem] border border-gray-200 shadow-sm overflow-hidden relative z-10">
        
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
            <span>Show</span>
            <select aria-label="Tampilkan entri" name="showEntries" className="border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white">
              <option>10</option>
              <option>25</option>
              <option>50</option>
            </select>
            <span>entries</span>
          </div>

          <div className="relative w-full sm:w-64">
            <input 
              type="text" 
              placeholder="Search project..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all bg-gray-50 focus:bg-white"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80">
                <th className="py-4 px-6 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Judul Project
                </th>
                <th className="py-4 px-6 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="py-4 px-6 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  URL / Link
                </th>
                <th className="py-4 px-6 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center">
                    <div className="inline-block animate-spin w-6 h-6 border-4 border-orange-500 border-t-transparent rounded-full mb-2"></div>
                    <p className="text-gray-500 font-medium">Mengambil data portofolio...</p>
                  </td>
                </tr>
              ) : portofolioData.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-gray-500 font-medium">
                     Belum ada data project yang tersedia.
                  </td>
                </tr>
              ) : (
                portofolioData.map((item) => (
                  <tr key={item.id} className="hover:bg-orange-50/30 transition-colors group">
                    <td className="py-4 px-6 border-b border-gray-100 text-sm font-semibold text-gray-900">
                      {item.title}
                    </td>
                    <td className="py-4 px-6 border-b border-gray-100 text-sm text-gray-600">
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold uppercase tracking-wider">
                        {item.category_code?.replace('_', ' ') || "UMUM"}
                      </span>
                    </td>
                    <td className="py-4 px-6 border-b border-gray-100 text-sm text-blue-600 hover:underline">
                      <a href={item.project_url} target="_blank" rel="noopener noreferrer">
                        {item.project_url || "-"}
                      </a>
                    </td>
                    <td className="py-4 px-6 border-b border-gray-100 text-sm text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button title="Lihat Detail" className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        </button>
                        <button title="Edit Project" className="p-1.5 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-all">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>
                        </button>
                        <button title="Hapus Project" className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}