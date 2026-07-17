/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
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

export default function EditFaqPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const { data: session, status } = useSession();

  const [judul, setJudul] = useState("");
  const [konten, setKonten] = useState("");
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
    const fetchDetailFaq = async () => {
      try {
        const token = (session as any)?.accessToken;
        if (!token) return;

        const response = await axios.get(`/api-proxy/api/admin/faq/show/${id}`, {
          headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
        });

        const dataAkurat = response.data?.data?.faq || response.data?.faq;
        
        if (dataAkurat) {
          setJudul(dataAkurat.judul || "");
          setKonten(dataAkurat.konten || "");
          
          let imageUrl = null;
          if (dataAkurat?.single_file_object?.path_media) {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
            if(dataAkurat.single_file_object.path_media.startsWith("http")) {
               imageUrl = dataAkurat.single_file_object.path_media;
            } else {
               imageUrl = `${baseUrl}/${dataAkurat.single_file_object.path_media}`;
            }
          }

          if (imageUrl) setImagePreview(imageUrl); 
        }
      } catch (error) {
        console.error("Gagal mengambil data lama:", error);
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          signOut({ callbackUrl: '/login' });
        } else {
          setErrorMsg("Gagal memuat data lama dari server.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (id && status === "authenticated") fetchDetailFaq();

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

    if (!konten || konten === '<p><br></p>') {
      Swal.fire({ icon: 'warning', title: 'Oops...', text: 'Isi jawaban tidak boleh kosong!' });
      return;
    }

    setIsSaving(true);
    setErrorMsg("");

    try {
      const token = (session as any)?.accessToken;
      if (!token) return;

      const formData = new FormData();
      formData.append("judul", judul);
      formData.append("konten", konten);
      
      if (fileUpload) {
        formData.append("single_file_upload", fileUpload);
        formData.append("single_file_tipe", "MEDIA_FILE");
      }

      await axios.post(
        `/api-proxy/api/admin/faq/update/${id}`, 
        formData,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      Swal.fire({
        toast: true, position: 'top-end', icon: 'success', title: 'Perubahan berhasil disimpan!', showConfirmButton: false, timer: 3000, timerProgressBar: true
      });

      router.push("/dashboardhome/faqs");

    } catch (error) {
      console.error("Gagal update FAQ:", error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        signOut({ callbackUrl: '/login' });
      } else {
        setErrorMsg("Gagal menyimpan perubahan ke server.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (status === "loading") return <div className="min-h-screen p-6 sm:p-10 font-sans bg-gray-50 flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen p-6 sm:p-10 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link href="/dashboardhome/faqs" className="p-2 bg-white rounded-xl border border-gray-200 text-black hover:text-blue-600 hover:bg-blue-50 transition-all shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
            </Link>
            <h2 className="text-3xl font-black text-black tracking-tight">Edit FAQ</h2>
          </div>
          <p className="text-black ml-12 font-medium">Ubah informasi FAQ sesuai kebutuhan.</p>
        </div>
      </div>

      {errorMsg && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-200 font-bold">{errorMsg}</div>}

      <div className="bg-white rounded-[1.5rem] border border-gray-200 shadow-sm overflow-hidden p-6 sm:p-8 max-w-4xl">
        {isLoading ? (
          <div className="py-10 text-center">
             <div className="inline-block animate-spin w-6 h-6 border-4 border-black border-t-transparent rounded-full mb-2"></div>
             <p className="text-black font-bold">Memuat data FAQ...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-black text-black mb-2">Pertanyaan (Judul) <span className="text-red-600">*</span></label>
              <input type="text" required value={judul} onChange={(e) => setJudul(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-xl text-black text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 focus:bg-white transition-all outline-none" />
            </div>

         

            <div>
              <label className="block text-sm font-black text-black mb-2">Jawaban (Konten) <span className="text-red-600">*</span></label>
              <div className="bg-white rounded-xl overflow-hidden border border-gray-300 [&_.ql-editor]:text-black [&_.ql-editor]:text-base text-black">
                <ReactQuill 
                  theme="snow" 
                  value={konten} 
                  onChange={setKonten} 
                  modules={modules}
                  formats={formats}
                  className="h-64 mb-12" 
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
              <Link href="/dashboardhome/faqs" className="px-6 py-3 bg-white border border-gray-300 text-black font-black rounded-xl hover:bg-gray-100 transition-all">Batal</Link>
              <button type="submit" disabled={isSaving} className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl transition-all disabled:opacity-70 flex items-center gap-2 shadow-md">
                {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}