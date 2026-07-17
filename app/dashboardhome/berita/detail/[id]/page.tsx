/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { useSession, signOut } from "next-auth/react";
import 'react-quill-new/dist/quill.snow.css';

export default function DetailBeritaPage() {
  const params = useParams(); 
  const router = useRouter();
  const id = params?.id; 

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
      if (!id) return;
      setIsLoading(true);
      try {
        const token = (session as any)?.accessToken;
        if (!token) return;

        // SEKARANG NEMBAK KE /api-proxy/ (CORS Aman!)
        const response = await axios.get(`/api-proxy/api/admin/berita/show/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });

        const responsData = response.data?.data?.berita; 
        setBeritaDetail(responsData);

      } catch (error: any) {
        console.error("Gagal mengambil detail berita:", error);
        if (error.response?.status === 401) {
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
  }, [id, status, session]);

  if (status === "loading") {
    return <div className="min-h-screen p-6 sm:p-10 font-sans bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

  const imageUrl = beritaDetail?.media_url;

  return (
    <div className="min-h-screen p-6 sm:p-10 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link 
              href="/dashboardhome/berita" 
              className="p-2 bg-white rounded-xl border border-gray-200 text-gray-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-all shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </Link>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Detail Berita</h2>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-200 font-medium">
          {errorMsg}
        </div>
      )}

      <div className="bg-white rounded-[1.5rem] border border-gray-200 shadow-sm overflow-hidden p-6 sm:p-10 max-w-4xl relative">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center">
             <div className="inline-block animate-spin w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full mb-4"></div>
             <p className="text-gray-500 font-medium">Sedang memuat detail berita...</p>
          </div>
        ) : beritaDetail ? (
          <div className="space-y-8">
            <div className="border-b border-gray-100 pb-6">
              <h1 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight">
                {beritaDetail.judul_berita}
              </h1>
            </div>

            {imageUrl ? (
              <div className="w-full h-64 sm:h-96 rounded-2xl overflow-hidden border border-gray-100 shadow-inner bg-gray-50">
                <img src={imageUrl} alt={beritaDetail.judul_berita} className="w-full h-full object-cover" />
              </div>
            ) : null}

            <div className="text-gray-700 leading-relaxed text-lg">
              {beritaDetail.konten_berita ? (
                <div 
                  className="ql-editor p-0 
                  [&_p]:!mb-5 
                  [&_ul]:pl-8 [&_ul]:!mb-5 [&_ul>li]:!list-disc
                  [&_ol]:pl-8 [&_ol]:!mb-5 [&_ol>li]:!list-decimal
                  [&_li]:!mb-2 
                  [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:!mb-5 
                  [&_h2]:text-xl [&_h2]:font-bold [&_h2]:!mb-5" 
                  style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}
                  dangerouslySetInnerHTML={{ __html: beritaDetail.konten_berita.replace(/[\r\n]+/g, ' ').replace(/&nbsp;/g, ' ') }} 
                />
              ) : (
                <p className="italic text-gray-400">Konten berita kosong.</p>
              )}
            </div>
          </div>
        ) : (
          <div className="py-20 text-center text-gray-500 font-medium">Data detail tidak ditemukan.</div>
        )}
      </div>
    </div>
  );
}