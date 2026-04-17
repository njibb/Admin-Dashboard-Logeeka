/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function TambahBeritaPage() {
  const router = useRouter();
  
 
  const [judulBerita, setJudulBerita] = useState("");
  const [kontenBerita, setKontenBerita] = useState("");
  const [fileUpload, setFileUpload] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null); 

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  
  const fileInputRef = useRef<HTMLInputElement>(null);

  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileUpload(file);
     
      setImagePreview(URL.createObjectURL(file));
    }
  };

 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      
      const formData = new FormData();
      formData.append("judul_berita", judulBerita);
      formData.append("konten_berita", kontenBerita);
      formData.append("single_file_tipe", "MEDIA_FILE"); // Sesuai Postman
      
      if (fileUpload) {
        formData.append("single_file_upload", fileUpload);
      }

      
      await axios.post(
        "/api/admin/berita/store", 
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        }
      );

      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Berita berhasil disimpan!',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true
      });

      router.push("/dashboardhome/berita");
      router.push("/dashboardhome/berita");

    } catch (error) {
      console.error("Gagal menambah berita:", error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          router.push("/login");
        } else {
          setErrorMsg(error.response?.data?.message || "Gagal menyimpan data ke server.");
        }
      } else {
        setErrorMsg("Terjadi kesalahan jaringan atau sistem.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 sm:p-10 font-sans">
      
      {/* ================= HEADER HALAMAN ================= */}
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
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Tambah Berita</h2>
          </div>
          <p className="text-gray-500 ml-12">Silakan isi detail form di bawah untuk membuat berita baru.</p>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-200 font-medium">
          {errorMsg}
        </div>
      )}

      {/* ================= FORM KARTU ================= */}
      <div className="bg-white rounded-[1.5rem] border border-gray-200 shadow-sm overflow-hidden p-6 sm:p-8 max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Input Judul Berita */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Judul Berita <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              required
              placeholder="Contoh: Tutorial bikin nasi goreng" 
              value={judulBerita}
              onChange={(e) => setJudulBerita(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all bg-gray-50 focus:bg-white"
            />
          </div>

          {/* Input Upload Gambar */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Upload Gambar (Banner Berita) <span className="text-red-500">*</span></label>
            
            {/* Preview Gambar jika sudah dipilih */}
            {imagePreview && (
              <div className="mb-4 relative w-full sm:w-64 h-40 rounded-xl overflow-hidden border border-gray-200">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <button 
                  type="button" 
                  onClick={() => {
                    setFileUpload(null);
                    setImagePreview(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-lg hover:bg-red-700 transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}

            <input 
              type="file" 
              accept="image/*"
              required={!fileUpload}
              ref={fileInputRef}
              onChange={handleFileChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all bg-gray-50 focus:bg-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-600 hover:file:bg-red-100 cursor-pointer"
            />
          </div>

          {/* Textarea Konten Berita */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Isi Konten Berita <span className="text-red-500">*</span></label>
            <textarea 
              required
              rows={8}
              placeholder="Ketik isi lengkap berita di sini..." 
              value={kontenBerita}
              onChange={(e) => setKontenBerita(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all bg-gray-50 focus:bg-white resize-y"
            ></textarea>
          </div>

          {/* Tombol Action */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
            <Link 
              href="/dashboardhome/berita"
              className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-all"
            >
              Batal
            </Link>
            <button 
              type="submit" 
              disabled={isLoading}
              className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-md shadow-red-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              )}
              {isLoading ? "Menyimpan..." : "Simpan Berita"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}