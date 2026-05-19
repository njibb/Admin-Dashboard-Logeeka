/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useSession, signOut } from "next-auth/react";

// 🔥 UBAHAN: Import Dynamic dan CSS Quill
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css'; 

// Deklarasi Komponen Quill secara dinamis
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

// ==========================================================================
// 🔥 KONFIGURASI ANTI-STYLE SILUMAN (Sesuai Kebijakan Ketat Bang Hafizh)
// ==========================================================================
const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ['link', 'clean']
  ],
  clipboard: {
    matchVisual: false, 
  }
};

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 
  'link'
];

export default function TambahPortofolioPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  // ================= STATE & REFS =================
  const [title, setTitle] = useState("");
  const [projectUrl, setProjectUrl] = useState("");
  const [categoryCode, setCategoryCode] = useState("marketing_communication"); 
  const [description, setDescription] = useState(""); // 🔥 UBAHAN: State untuk Text Editor
  const [fileUpload, setFileUpload] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // ================= EVENT HANDLERS =================
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileUpload(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 🔥 UBAHAN: Validasi Text Editor tidak boleh kosong
    if (!description || description === '<p><br></p>') {
      Swal.fire({ icon: 'warning', title: 'Oops...', text: 'Deskripsi detail project tidak boleh kosong!' });
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const token = (session as any)?.accessToken;
      if (!token) return;

      const formData = new FormData();
      formData.append("title", title);
      formData.append("project_url", projectUrl);
      formData.append("category_code", categoryCode);
      formData.append("description", description); // 🔥 UBAHAN: Mengirim konten HTML bersih ke API
      
      if (fileUpload) {
        formData.append("single_thumbnail_upload", fileUpload); 
      }

      const response = await axios.post(
        "/api/admin/project-profile/store", 
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data?.status === 0 || response.data?.status_code === 400) {
        const pesanError = response.data?.error_list?.[0] || response.data?.message || "Gagal menyimpan.";
        setErrorMsg(`Ditolak Server: ${pesanError}`);
        setIsLoading(false);
        return; 
      }

      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Portofolio ditambahkan!',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true
      });

      router.push("/dashboardhome/portofolio");

    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          signOut({ callbackUrl: '/login' });
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

  if (status === "loading") {
    return <div className="min-h-screen p-6 sm:p-10 font-sans bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

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
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Tambah Portofolio</h2>
          </div>
          <p className="text-gray-500 ml-12">Isi detail project baru ke dalam sistem Logeeka.</p>
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
          
          {/* Judul Project */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Judul Project <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              required
              placeholder="Contoh: Manajemen Media Sosial - PT Maju Mundur" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all bg-gray-50 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* URL Project */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">URL Project <span className="text-red-500">*</span></label>
              <input 
                type="url" 
                required
                placeholder="https://example.com" 
                value={projectUrl}
                onChange={(e) => setProjectUrl(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all bg-gray-50 focus:bg-white"
              />
            </div>

            {/* Kategori Project */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Kategori Project <span className="text-red-500">*</span></label>
              <select 
                value={categoryCode}
                onChange={(e) => setCategoryCode(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all bg-gray-50 focus:bg-white cursor-pointer"
              >
                <option value="marketing_communication">Marketing Communication</option>
                <option value="digital_creative">Digital Creative</option>
                <option value="web_development">Web Development</option>
                <option value="branding_design">Branding & Design</option>
              </select>
            </div>
          </div>

          {/* 🔥 UBAHAN: Komponen Text Editor Deskripsi Project */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Deskripsi / Detail Project <span className="text-red-500">*</span></label>
            <div className="text-gray-900 bg-white rounded-xl overflow-hidden border border-gray-300">
              <ReactQuill 
                theme="snow" 
                placeholder="Ketik detail pencapaian, tech stack, atau deskripsi lengkap project di sini..."
                value={description} 
                onChange={setDescription} 
                modules={modules}
                formats={formats}
                className="h-64 mb-12" 
              />
            </div>
          </div>

          {/* Upload Thumbnail */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Upload Thumbnail Project <span className="text-red-500">*</span></label>
            {imagePreview && (
              <div className="mb-4 relative w-full sm:w-64 h-40 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <button 
                  type="button" 
                  onClick={() => {
                    setFileUpload(null);
                    setImagePreview(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-lg hover:bg-red-700 transition shadow-md"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            )}

            <input 
              type="file" 
              accept="image/*"
              required={!fileUpload}
              ref={fileInputRef}
              onChange={handleFileChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 text-sm font-medium file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-600 hover:file:bg-red-100 cursor-pointer"
            />
          </div>

          {/* ================= TOMBOL AKSI ================= */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
            <Link 
              href="/dashboardhome/portofolio"
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
              {isLoading ? "Menyimpan..." : "Simpan Portofolio"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}