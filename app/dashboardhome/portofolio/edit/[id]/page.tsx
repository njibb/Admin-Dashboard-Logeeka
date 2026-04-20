/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';

import { useSession, signOut } from "next-auth/react";

export default function EditPortofolioPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

 
  const { data: session, status } = useSession();

  const [title, setTitle] = useState("");
  const [projectUrl, setProjectUrl] = useState("");
  const [categoryCode, setCategoryCode] = useState("marketing_communication");
  
  const [fileUpload, setFileUpload] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true); 
  const [isSaving, setIsSaving] = useState(false);  
  const [errorMsg, setErrorMsg] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

 
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  
  useEffect(() => {
    const fetchDataLama = async () => {
      try {
      
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const token = (session as any)?.accessToken;
        if (!token) return;

        const response = await axios.get(`/api/admin/project-profile/show/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });

        const dataAkurat = response.data?.data || response.data?.result || response.data;
        
        if (dataAkurat) {
          setTitle(dataAkurat.title || "");
          setProjectUrl(dataAkurat.project_url || "");
          setCategoryCode(dataAkurat.category_code || "marketing_communication");
          if (dataAkurat.thumbnail_url) {
            setImagePreview(dataAkurat.thumbnail_url); 
          }
        }
      } catch (error) {
        console.error("Gagal mengambil data lama:", error);
        
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          
           signOut({ callbackUrl: '/login' });
        } else {
           console.log("Data lama gagal dimuat. Form akan kosong.");
        }
      } finally {
        setIsLoading(false);
      }
    };

   
    if (id && status === "authenticated") fetchDataLama();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, status, session]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileUpload(file);
      setImagePreview(URL.createObjectURL(file)); 
    }
  };

 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg("");

    try {
     
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const token = (session as any)?.accessToken;
      if (!token) return;

      const formData = new FormData();
      formData.append("title", title);
      formData.append("project_url", projectUrl);
      formData.append("category_code", categoryCode);
      
      if (fileUpload) {
        formData.append("single_thumbnail_upload", fileUpload); 
      }

      await axios.post(
        `/api/admin/project-profile/update/${id}`, 
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        }
      );

      alert("Portofolio berhasil diperbarui!");
      router.push("/dashboardhome/portofolio");

    } catch (error) {
      console.error("Gagal update portofolio:", error);
      
      if (axios.isAxiosError(error) && error.response?.status === 401) {
         signOut({ callbackUrl: '/login' });
      } else {
         setErrorMsg("Gagal menyimpan perubahan ke server. Cek koneksi atau URL API.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (status === "loading") {
    return <div className="min-h-screen p-6 sm:p-10 font-sans bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen p-6 sm:p-10 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div className="flex items-center gap-3 mb-2">
          <Link href="/dashboardhome/portofolio" className="p-2 bg-white rounded-xl border border-gray-200 text-gray-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-all shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
          </Link>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Edit Portofolio</h2>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-200 font-medium">{errorMsg}</div>
      )}

      <div className="bg-white rounded-[1.5rem] border border-gray-200 shadow-sm overflow-hidden p-6 sm:p-8 max-w-4xl">
        {isLoading ? (
          <div className="py-10 text-center">
             <div className="inline-block animate-spin w-6 h-6 border-4 border-red-500 border-t-transparent rounded-full mb-2"></div>
             <p className="text-gray-500 font-medium">Memuat data project...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Nama / Judul Project <span className="text-red-500">*</span></label>
              <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-red-500 bg-gray-50 focus:bg-white transition-all" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">URL / Link Project <span className="text-red-500">*</span></label>
                <input type="url" required value={projectUrl} onChange={(e) => setProjectUrl(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-red-500 bg-gray-50 focus:bg-white transition-all" />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Kategori Project <span className="text-red-500">*</span></label>
                <select value={categoryCode} onChange={(e) => setCategoryCode(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-red-500 bg-gray-50 focus:bg-white transition-all">
                  <option value="marketing_communication">Marketing Communication</option>
                  <option value="digital_creative">Digital Creative</option>
                  <option value="web_development">Web Development</option>
                  <option value="branding_design">Branding & Design</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Ubah Thumbnail (Opsional)</label>
              <p className="text-xs text-gray-500 mb-3">Abaikan jika tidak ingin mengganti gambar.</p>
              
              {imagePreview && (
                <div className="mb-4 relative w-full sm:w-64 h-40 rounded-xl overflow-hidden border border-gray-200">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  {fileUpload && (
                    <button type="button" onClick={() => { setFileUpload(null); setImagePreview(null); if(fileInputRef.current) fileInputRef.current.value=''; }} className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-lg hover:bg-red-700 transition">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  )}
                </div>
              )}
              <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-600 hover:file:bg-red-100 cursor-pointer" />
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
              <Link href="/dashboardhome/portofolio" className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all">Batal</Link>
              <button type="submit" disabled={isSaving} className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-md shadow-red-200 disabled:opacity-70 flex items-center gap-2">
                {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>

          </form>
        )}
      </div>
    </div>
  );
}