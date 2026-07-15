
"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useSession, signOut } from "next-auth/react";
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

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

export default function TambahFaqPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [judul, setJudul] = useState("");
  const [konten, setKonten] = useState("");
  const [] = useState<File | null>(null);
  const [] = useState<string | null>(null); 

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");


  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!konten || konten === '<p><br></p>') {
      Swal.fire({ icon: 'warning', title: 'Oops...', text: 'Isi jawaban FAQ tidak boleh kosong!' });
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const token = (session as any)?.accessToken;
      if (!token) return;
      
      const formData = new FormData();
      formData.append("judul", judul);
      formData.append("konten", konten);
       
      await axios.post(
        "/api-proxy/api/admin/faq/store", 
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
        title: 'FAQ berhasil disimpan!',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true
      });

      router.push("/dashboardhome/faqs");

    } catch (error) {
      console.error("Gagal menambah FAQ:", error);
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link 
              href="/dashboardhome/faqs" 
              className="p-2 bg-white rounded-xl border border-gray-200 text-gray-500 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
            </Link>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Tambah FAQ</h2>
          </div>
          <p className="text-gray-500 ml-12">Buat pertanyaan dan jawaban baru untuk user.</p>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-200 font-medium">{errorMsg}</div>
      )}

      <div className="bg-white rounded-[1.5rem] border border-gray-200 shadow-sm overflow-hidden p-6 sm:p-8 max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Pertanyaan (Judul) <span className="text-red-500">*</span></label>
            <input 
              type="text" required
              placeholder="Contoh: Bagaimana cara mendaftar akun?" 
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white"
            />
          </div>

         
         <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Jawaban (Konten) <span className="text-red-500">*</span></label>
            
            <div className="bg-white rounded-xl overflow-hidden border border-gray-300 [&_.ql-editor]:text-black [&_.ql-editor]:text-base text-black">
              <ReactQuill 
                theme="snow" 
                placeholder="Ketik jawaban lengkap di sini..." 
                value={konten} 
                onChange={setKonten} 
                modules={modules}
                formats={formats}
                className="h-64 mb-12" 
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
            <Link href="/dashboardhome/faqs" className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-all">Batal</Link>
            <button type="submit" disabled={isLoading} className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-md shadow-blue-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2">
              {isLoading ? "Menyimpan..." : "Simpan FAQ"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}