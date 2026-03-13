/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';

export default function EditBeritaPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  
  const [judulBerita, setJudulBerita] = useState("");
  const [kontenBerita, setKontenBerita] = useState("");
  const [fileUpload, setFileUpload] = useState<File | null>(null);
  
 
  const [imagePreview, setImagePreview] = useState<string | null>(null); 

  const [isLoading, setIsLoading] = useState(true); 
  const [isSaving, setIsSaving] = useState(false);  
  const [errorMsg, setErrorMsg] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. MENGAMBIL DATA LAMA SAAT HALAMAN DIBUKA
  useEffect(() => {
    const fetchDetailBerita = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        
        const response = await axios.get(`/api/admin/berita/show/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });

        const dataAkurat = response.data?.data || response.data?.result || response.data;
        
       
        if (dataAkurat) {
          setJudulBerita(dataAkurat.judul_berita || "");
          setKontenBerita(dataAkurat.konten_berita || "");
          if (dataAkurat.file_url) {
            setImagePreview(dataAkurat.file_url); 
          }
        }
      } catch (error) {
        console.error("Gagal mengambil data lama:", error);
        setErrorMsg("Gagal memuat data lama dari server.");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchDetailBerita();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileUpload(file);
      setImagePreview(URL.createObjectURL(file)); 
    }
  };

  // 2. MENGIRIM DATA BARU KE SERVER
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg("");

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const formData = new FormData();
      formData.append("judul_berita", judulBerita);
      formData.append("konten_berita", kontenBerita);
    
      
      // Kirim file HANYA JIKA user mengupload gambar baru
      if (fileUpload) {
        formData.append("single_file_upload", fileUpload);
        formData.append("single_file_tipe", "MEDIA_FILE");
      }

    
      await axios.post(
        `/api/admin/berita/update/${id}`, 
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        }
      );

      alert("Berita berhasil diperbarui!");
      router.push("/dashboardhome/berita");

    } catch (error) {
      console.error("Gagal update berita:", error);
      setErrorMsg("Gagal menyimpan perubahan ke server.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen p-6 sm:p-10 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link href="/dashboardhome/berita" className="p-2 bg-white rounded-xl border border-gray-200 text-gray-500 hover:text-orange-600 hover:bg-orange-50 transition-all shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
            </Link>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Edit Berita</h2>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-200 font-medium">{errorMsg}</div>
      )}

      <div className="bg-white rounded-[1.5rem] border border-gray-200 shadow-sm overflow-hidden p-6 sm:p-8 max-w-4xl">
        {isLoading ? (
          <div className="py-10 text-center">
             <div className="inline-block animate-spin w-6 h-6 border-4 border-orange-500 border-t-transparent rounded-full mb-2"></div>
             <p className="text-gray-500 font-medium">Memuat data...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Input Judul */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Judul Berita <span className="text-red-500">*</span></label>
              <input 
                type="text" required
                value={judulBerita}
                onChange={(e) => setJudulBerita(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50 focus:bg-white transition-all"
              />
            </div>

            {/* Input Upload Gambar */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Upload Gambar Baru (Opsional)</label>
              <p className="text-xs text-gray-500 mb-3">Biarkan kosong jika tidak ingin mengubah gambar.</p>
              
              {imagePreview && (
                <div className="mb-4 relative w-full sm:w-64 h-40 rounded-xl overflow-hidden border border-gray-200">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  {/* Tombol hapus gambar HANYA muncul jika user mengupload gambar baru saat ini */}
                  {fileUpload && (
                    <button type="button" onClick={() => { setFileUpload(null); setImagePreview(null); if(fileInputRef.current) fileInputRef.current.value=''; }} className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-lg hover:bg-red-700">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  )}
                </div>
              )}
              <input 
                type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-600 cursor-pointer"
              />
            </div>

            {/* Textarea Konten */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Isi Konten Berita <span className="text-red-500">*</span></label>
              <textarea 
                required rows={8}
                value={kontenBerita}
                onChange={(e) => setKontenBerita(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50 focus:bg-white resize-y transition-all"
              ></textarea>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
              <Link href="/dashboardhome/berita" className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all">Batal</Link>
              <button type="submit" disabled={isSaving} className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all disabled:opacity-70 flex items-center gap-2">
                {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>

          </form>
        )}
      </div>
    </div>
  );
}