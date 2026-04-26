/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { useSession, signOut } from "next-auth/react";
import 'react-quill-new/dist/quill.snow.css';

export default function DetailFaqPage() {
  const params = useParams(); 
  const router = useRouter();
  const { id } = params; 

  const { data: session, status } = useSession();

  const [faqDetail, setFaqDetail] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchDetailFaq = async () => {
      setIsLoading(true);
      try {
        const token = (session as any)?.accessToken;
        if (!token) return;

        const response = await axios.get(`/api/admin/faq/show/${id}`, {
          headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
        });

        const dataAkurat = response.data?.data?.faq || response.data?.faq;
        setFaqDetail(dataAkurat);

      } catch (error) {
        console.error("Gagal mengambil detail FAQ:", error);
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          signOut({ callbackUrl: 'Login' });
        } else {
          setErrorMsg("Gagal memuat detail FAQ dari server.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (id && status === "authenticated") fetchDetailFaq();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, status, session]);

  if (status === "loading") {
    return <div className="min-h-screen p-6 sm:p-10 font-sans bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

  let imageUrl = null;
  if (faqDetail?.single_file_object?.path_media) {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || ""; 
    if(faqDetail.single_file_object.path_media.startsWith("http")) {
       imageUrl = faqDetail.single_file_object.path_media;
    } else {
       imageUrl = `${baseUrl}/${faqDetail.single_file_object.path_media}`;
    }
  }

  return (
    <div className="min-h-screen p-6 sm:p-10 font-sans">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link 
              href="/dashboardhome/faqs" 
              className="p-2 bg-white rounded-xl border border-gray-200 text-gray-500 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
            </Link>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Detail FAQ</h2>
          </div>
          <p className="text-gray-500 ml-12">Melihat informasi lengkap dari FAQ yang dipilih.</p>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-200 font-medium">{errorMsg}</div>
      )}

      <div className="bg-white rounded-[1.5rem] border border-gray-200 shadow-sm overflow-hidden p-6 sm:p-10 max-w-4xl relative">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center">
             <div className="inline-block animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
             <p className="text-gray-500 font-medium">Sedang memuat detail FAQ...</p>
          </div>
        ) : faqDetail ? (
          <div className="space-y-8">
            
            <div className="border-b border-gray-100 pb-6">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold tracking-wider uppercase border border-blue-100">
                  PERTANYAAN
                </span>
                <span className="text-sm text-gray-500 font-medium flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {faqDetail.waktu_posting || "Waktu tidak diketahui"}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight">
                {faqDetail.judul}
              </h1>
            </div>

            {imageUrl && (
              <div className="w-full h-64 sm:h-96 rounded-2xl overflow-hidden border border-gray-100 shadow-inner bg-gray-50">
                <img src={imageUrl} alt={faqDetail.judul} className="w-full h-full object-cover" />
              </div>
            )}

            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
               <h3 className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-widest">Jawaban</h3>
               <div className="text-gray-800 leading-relaxed text-lg ql-snow">
                 {faqDetail.konten ? (
                    <div 
                      className="ql-editor p-0 [&_p]:!mb-4 [&_h1]:!mb-4 [&_h2]:!mb-4 [&_h3]:!mb-4 [&_ul]:!mb-4 [&_ol]:!mb-4 [&_li]:!mb-1" 
                      dangerouslySetInnerHTML={{ __html: faqDetail.konten }} 
                    />
                 ) : (
                    <p className="italic text-gray-400">Jawaban FAQ kosong.</p>
                 )}
               </div>
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