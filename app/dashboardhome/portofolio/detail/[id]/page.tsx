/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';

export default function DetailPortofolioPage() {
  const params = useParams(); 
  const router = useRouter();
  const { id } = params; 

  const [portofolioDetail, setPortofolioDetail] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchDetailPortofolio = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        
      const response = await axios.get(`/api/admin/project-profile/show/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });

        
        const dataAkurat = response.data?.data || response.data?.result || response.data;
        console.log("ISI DETAIL PORTOFOLIO:", dataAkurat); 
        setPortofolioDetail(dataAkurat);

      } catch (error) {
        console.error("Gagal mengambil detail portofolio:", error);
        setErrorMsg("Gagal memuat detail portofolio dari server. Cek URL API.");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchDetailPortofolio();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <div className="min-h-screen p-6 sm:p-10 font-sans">
      
      {/* ================= HEADER HALAMAN ================= */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link 
              href="/dashboardhome/portofolio" 
              className="p-2 bg-white rounded-xl border border-gray-200 text-gray-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-all shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </Link>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Detail Portofolio</h2>
          </div>
          <p className="text-gray-500 ml-12">Melihat informasi lengkap dari project yang dipilih.</p>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-200 font-medium">
          {errorMsg}
        </div>
      )}

      {/* ================= KONTEN DETAIL ================= */}
      <div className="bg-white rounded-[1.5rem] border border-gray-200 shadow-sm overflow-hidden p-6 sm:p-10 max-w-4xl relative">
        
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center">
             <div className="inline-block animate-spin w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full mb-4"></div>
             <p className="text-gray-500 font-medium">Sedang memuat detail portofolio...</p>
          </div>
        ) : portofolioDetail ? (
          <div className="space-y-8">
            
            {/* Header Detail (Judul & Kategori) */}
            <div className="border-b border-gray-100 pb-6">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-red-50 text-red-600 rounded-lg text-xs font-bold tracking-wider uppercase border border-red-100">
                  {portofolioDetail.category_code ? portofolioDetail.category_code.replace('_', ' ') : "UMUM"}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight mb-4">
                {portofolioDetail.title || "Judul Project Tidak Tersedia"}
              </h1>
              
              {/* Link Project URL */}
              {portofolioDetail.project_url && (
                <a 
                  href={portofolioDetail.project_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium bg-blue-50 px-4 py-2 rounded-xl transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                  </svg>
                  Kunjungi Link Project
                </a>
              )}
            </div>

            {/* Gambar Thumbnail */}
            {portofolioDetail.thumbnail_url ? (
              <div className="w-full h-auto rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                <img 
                  src={portofolioDetail.thumbnail_url} 
                  alt={portofolioDetail.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-full h-40 bg-gray-50 border border-gray-200 rounded-2xl flex items-center justify-center text-gray-400">
                Tidak ada thumbnail project
              </div>
            )}

          </div>
        ) : (
          <div className="py-20 text-center text-gray-500 font-medium">
            Data detail tidak ditemukan.
          </div>
        )}

      </div>
    </div>
  );
}