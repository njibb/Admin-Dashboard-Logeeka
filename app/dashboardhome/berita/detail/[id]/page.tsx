/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';

import { useSession, signOut } from "next-auth/react";

export default function DetailBeritaPage() {
  const params = useParams(); 
  const router = useRouter();
  const { id } = params; 

 
  const { data: session, status } = useSession();

  const [beritaDetail, setBeritaDetail] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");


  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchDetailBerita = async () => {
      setIsLoading(true);
      try {
        
        const token = (session as any)?.accessToken;
        
        if (!token) return;

        const response = await axios.get(`/api/admin/berita/show/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });

        const responsData = response.data?.data || response.data?.result || response.data;
        const dataAkurat = responsData?.berita ? responsData.berita : responsData;

        console.log("ISI DETAIL BERITA:", dataAkurat);
        setBeritaDetail(dataAkurat);

      } catch (error) {
        console.error("Gagal mengambil detail berita:", error);
        
        if (axios.isAxiosError(error) && error.response?.status === 401) {
       
          signOut({ callbackUrl: '/login' });
        } else {
          setErrorMsg("Gagal memuat detail berita dari server.");
        }
      } finally {
        setIsLoading(false);
      }
    };

   
    if (id && status === "authenticated") {
      fetchDetailBerita();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, status, session]);

  
  if (status === "loading") {
    return <div className="min-h-screen p-6 sm:p-10 font-sans bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

  let imageUrl = null;
  if (beritaDetail?.single_media_object?.path_media) {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL; 
    imageUrl = `${baseUrl}/${beritaDetail.single_media_object.path_media}`;
  } else {
      // Cadangan
      imageUrl = beritaDetail?.file_url || beritaDetail?.image_url || beritaDetail?.thumbnail_url;
  }

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
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-bold tracking-wider uppercase">
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

            {/*  Area Gambar */}
            {imageUrl ? (
              <div className="w-full h-64 sm:h-96 rounded-2xl overflow-hidden border border-gray-100 shadow-inner bg-gray-50">
                <img 
                  src={imageUrl} 
                  alt={beritaDetail.judul_berita} 
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-full h-64 sm:h-96 rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center p-6 text-center shadow-sm">
                <div className="flex flex-col items-center gap-4 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                  <p className="text-xl font-bold text-gray-700">Tidak ada gambar</p>
                  <p className="text-sm">Gambar tidak tersedia atau URL tidak valid.</p>
                </div>
              </div>
            )}

            {/* Isi Konten */}
            <div className="prose max-w-none text-gray-700 leading-relaxed text-lg">
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