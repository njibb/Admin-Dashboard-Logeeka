/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';

export default function DetailBeritaPage() {
  const params = useParams(); // Mengambil ID dari URL
  const router = useRouter();
  const { id } = params; // ID berita yang sedang diklik

  // Wadah untuk menyimpan 1 data berita spesifik (pakai any sementara karena struktur detail bisa beda)
  const [beritaDetail, setBeritaDetail] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchDetailBerita = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        // ⚠️ PERHATIAN: Cek Postman Mas Bayu bagian "show single data"
        // Sesuaikan URL-nya jika berbeda (misal: /api/admin/berita/show/id)
        const response = await axios.get(`/api/admin/berita/show/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });

        // Menyimpan data. Asumsi datanya ada di response.data.data atau response.data.result
        const dataAkurat = response.data?.data || response.data?.result || response.data;
        setBeritaDetail(dataAkurat);

      } catch (error) {
        console.error("Gagal mengambil detail berita:", error);
        setErrorMsg("Gagal memuat detail berita dari server.");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchDetailBerita();
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
              href="/dashboardhome/berita" 
              className="p-2 bg-white rounded-xl border border-gray-200 text-gray-500 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </Link>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Detail Berita</h2>
          </div>
          <p className="text-gray-500 ml-12">Melihat informasi lengkap dari berita yang dipilih.</p>
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
             <div className="inline-block animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
             <p className="text-gray-500 font-medium">Sedang memuat detail berita...</p>
          </div>
        ) : beritaDetail ? (
          <div className="space-y-8">
            {/* Header Detail (Judul & Badge) */}
            <div className="border-b border-gray-100 pb-6">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-bold tracking-wider">
                  {beritaDetail.asal_data || "MANUAL"}
                </span>
                <span className="text-sm text-gray-500 font-medium flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {beritaDetail.waktu_posting || "Waktu tidak diketahui"}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight">
                {beritaDetail.judul_berita}
              </h1>
            </div>

            {/* Gambar (Jika Ada) */}
            {beritaDetail.file_url && (
              <div className="w-full h-64 sm:h-96 rounded-2xl overflow-hidden border border-gray-200">
                <img 
                  src={beritaDetail.file_url} 
                  alt={beritaDetail.judul_berita} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Isi Konten */}
            <div className="prose max-w-none text-gray-700 leading-relaxed text-lg">
              {/* Jika konten berupa HTML, gunakan dangerouslySetInnerHTML. 
                  Jika berupa teks biasa, langsung tampilkan variabelnya. */}
              {beritaDetail.konten_berita ? (
                 <div dangerouslySetInnerHTML={{ __html: beritaDetail.konten_berita }} />
              ) : (
                 <p className="italic text-gray-400">Konten berita kosong.</p>
              )}
            </div>

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