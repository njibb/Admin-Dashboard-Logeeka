/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { useSession, signOut } from "next-auth/react";
import Swal from 'sweetalert2';
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
  clipboard: { matchVisual: false }
};

const formats = [
  'header', 'bold', 'italic', 'underline', 'strike', 'blockquote', 'list', 'link'
];

export default function EditPortofolioPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;
  const { data: session, status } = useSession();

  const [title, setTitle] = useState("");
  const [projectUrl, setProjectUrl] = useState("");
  const [categoryCode, setCategoryCode] = useState("marketing_communication");
  const [description, setDescription] = useState(""); 
  const [fileUpload, setFileUpload] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true); 
  const [isSaving, setIsSaving] = useState(false);  
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    const fetchDataLama = async () => {
      if (!id) return;
      try {
        const token = (session as any)?.accessToken;
        if (!token) return;

        const response = await axios.get(`/api-proxy/api/project-profile/pagination?currentPage=1&dataPerPage=5&keywords=${id}`, {
          headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
        });

        const listData = response.data?.result?.data || response.data?.data || [];
        const dataAkurat = listData[0]; 
        
        if (dataAkurat) {
          setTitle(dataAkurat.title || dataAkurat.judul_portofolio || "");
          setProjectUrl(dataAkurat.project_url || "");
          setCategoryCode(dataAkurat.category_code || dataAkurat.kategori || "marketing_communication");
          setDescription(dataAkurat.description || dataAkurat.konten_portofolio || dataAkurat.konten || ""); 
          if (dataAkurat?.thumbnail_url) setImagePreview(dataAkurat.thumbnail_url);
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) signOut({ callbackUrl: '/login' });
        else setErrorMsg("Gagal memuat data lama.");
      } finally {
        setIsLoading(false);
      }
    };
    if (id && status === "authenticated") fetchDataLama();
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
      const token = (session as any)?.accessToken;
      if (!token) return;

      const formData = new FormData();
      formData.append("title", title);
      formData.append("project_url", projectUrl);
      formData.append("category_code", categoryCode);
      formData.append("description", description); 
      
      if (fileUpload) {
        formData.append("single_thumbnail_upload", fileUpload);
      }

      await axios.post(`/api-proxy/api/admin/project-profile/update/${id}`, formData, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });

      Swal.fire({ icon: 'success', title: 'Berhasil!', text: 'Perubahan disimpan.', timer: 2000, showConfirmButton: false });
      router.push("/dashboardhome/portofolio");

    } catch (error: any) {
      console.error("Error Detail:", error.response?.data);
      setErrorMsg(`Error: ${error.response?.data?.message || "Gagal menyimpan."}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen p-6 sm:p-10 font-sans">
      <h2 className="text-3xl font-extrabold mb-6 text-black">Edit Portofolio</h2>
      {errorMsg && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl font-medium">{errorMsg}</div>}
      
      <div className="bg-white rounded-[1.5rem] p-8 max-w-4xl border shadow-sm">
        {isLoading ? <p className="text-black">Memuat...</p> : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-2 font-bold text-black">Judul Project</label>
              <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-3 border rounded-xl text-black" />
            </div>
            <div>
              <label className="block mb-2 font-bold text-black">URL Project</label>
              <input type="url" required value={projectUrl} onChange={(e) => setProjectUrl(e.target.value)} className="w-full p-3 border rounded-xl text-black" />
            </div>
            <div>
              <label className="block mb-2 font-bold text-black">Kategori</label>
              <select value={categoryCode} onChange={(e) => setCategoryCode(e.target.value)} className="w-full p-3 border rounded-xl text-black">
                <option value="marketing_communication">Marketing Communication</option>
                <option value="digital_creative">Digital Creative</option>
                <option value="web_development">Web Development</option>
                <option value="branding_design">Branding & Design</option>
              </select>
            </div>
            <div>
              <label className="block mb-2 font-bold text-black">Deskripsi</label>
              <ReactQuill theme="snow" value={description} onChange={setDescription} className="h-40 mb-12 text-black" />
            </div>
            <div>
              <label className="block mb-2 font-bold text-black">Ganti Thumbnail</label>
              {/* Preview Gambar */}
              {imagePreview && (
                <div className="mb-4">
                  <img src={imagePreview} alt="Thumbnail" className="w-40 h-40 object-cover rounded-xl border border-gray-300" />
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleFileChange} className="w-full p-3 border rounded-xl text-black" />
            </div>
            <button type="submit" disabled={isSaving} className="px-8 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition">
              {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}