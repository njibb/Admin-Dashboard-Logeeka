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
  const [imageUrl, setImageUrl] = useState<string | null>(null); // State khusus buat nangkep gambar
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

 useEffect(() => {
    const fetchDetailPortofolio = async () => {
      if (!id) return; 

      setIsLoading(true);
      setErrorMsg("");

      try {
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

        // 🔥 FIKS: Jalurnya resmi pakai /admin/ (Sesuai dengan Postman)
        const response = await axios.get(`/api/admin/project-profile/show/${id}`, config);

        // Buka kardus datanya
        const responsData = response.data?.data || response.data?.result || response.data;
        const dataAkurat = responsData?.project_profile || responsData?.portofolio || responsData;
        
        console.log("✅ ISI DETAIL PORTOFOLIO:", dataAkurat); 
        setPortofolioDetail(dataAkurat);

        // Jurus Sapu Jagat Gambar
        if (dataAkurat) {
          const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://logeeka-magang.mokumuka.com';
          let finalImageUrl = null;

          if (dataAkurat?.single_media_object?.path_media) {
            finalImageUrl = `${baseUrl}/${dataAkurat.single_media_object.path_media}`;
          } else if (dataAkurat?.single_file_object?.path_media) {
            finalImageUrl = `${baseUrl}/${dataAkurat.single_file_object.path_media}`;
          } else if (dataAkurat?.thumbnail_url) {
            if (dataAkurat.thumbnail_url.startsWith('http')) {
              finalImageUrl = dataAkurat.thumbnail_url;
            } else {
              finalImageUrl = `${baseUrl}/${dataAkurat.thumbnail_url}`;
            }
          }
          setImageUrl(finalImageUrl);
        }

      } catch (error) {
        
        if (axios.isAxiosError(error)) {
          console.log("❌ ERROR DARI SERVER:", error.response?.data);
          setErrorMsg(`Data Portofolio ini tidak ditemukan atau sudah dihapus dari server.`);
        } else {
          setErrorMsg("Gagal memuat detail portofolio. Terjadi kesalahan jaringan.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetailPortofolio();
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
              className="p-2 bg-white rounded-xl border border-gray-200 text-black hover:text-white hover:bg-black transition-all shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </Link>
            <h2 className="text-3xl font-black text-black tracking-tight">Detail Portofolio</h2>
          </div>
          <p className="text-black font-medium ml-12">Melihat informasi lengkap dari project yang dipilih.</p>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-200 font-bold">
          {errorMsg}
        </div>
      )}

      {/* ================= KONTEN DETAIL ================= */}
      <div className="bg-white rounded-[1.5rem] border border-gray-200 shadow-sm overflow-hidden p-6 sm:p-10 max-w-4xl relative">
        
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center">
             <div className="inline-block animate-spin w-8 h-8 border-4 border-black border-t-transparent rounded-full mb-4"></div>
             <p className="text-black font-bold">Sedang memuat detail portofolio...</p>
          </div>
        ) : portofolioDetail ? (
          <div className="space-y-8">
            
            {/* Header Detail (Judul & Kategori) */}
            <div className="border-b border-gray-100 pb-6">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-gray-100 text-black rounded-lg text-xs font-black tracking-wider uppercase border border-gray-200">
                  {portofolioDetail.category_code ? portofolioDetail.category_code.replace('_', ' ') : "UMUM"}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-black leading-tight mb-4">
                {portofolioDetail.title || portofolioDetail.judul || "Judul Project Tidak Tersedia"}
              </h1>
              
              {/* Link Project URL */}
              {portofolioDetail.project_url && (
                <a 
                  href={portofolioDetail.project_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-white bg-black hover:bg-gray-800 font-bold px-5 py-2.5 rounded-xl transition-colors shadow-md"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                  </svg>
                  Kunjungi Link Project
                </a>
              )}
            </div>

            {/* Gambar Thumbnail */}
            {imageUrl ? (
              <div className="w-full h-auto rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                <img 
                  src={imageUrl} 
                  alt={portofolioDetail.title || "Thumbnail Portofolio"} 
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-full h-40 bg-gray-50 border border-gray-200 rounded-2xl flex items-center justify-center text-black font-medium">
                Tidak ada thumbnail project
              </div>
            )}

            {/* Deskripsi (Jika ada field konten) */}
            {(portofolioDetail.konten || portofolioDetail.deskripsi) && (
              <div className="prose max-w-none text-black">
                <p className="whitespace-pre-wrap leading-relaxed font-medium">
                  {portofolioDetail.konten || portofolioDetail.deskripsi}
                </p>
              </div>
            )}

          </div>
        ) : (
          <div className="py-20 text-center text-black font-bold">
            Data detail tidak ditemukan.
          </div>
        )}

      </div>
    </div>
  );
}