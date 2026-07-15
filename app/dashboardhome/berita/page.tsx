"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import { useSession, signOut } from "next-auth/react";

interface Berita {
  id: string;
  judul_berita: string;
  slug_berita: string;
  waktu_posting: string;
  asal_data: string;
}

export default function ManajemenBeritaPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [beritaData, setBeritaData] = useState<Berita[]>([]); 
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(""); 
  
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [entriesPerPage, setEntriesPerPage] = useState<number>(10);
  const [totalDataServer, setTotalDataServer] = useState<number>(0);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, entriesPerPage]);

  const fetchBerita = async () => {
    setIsLoading(true);
    setErrorMsg("");

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const token = (session as any)?.accessToken;
      if (!token) return;

      const response = await axios.get(
        `/api-proxy/api/admin/berita/pagination?sortBy=waktu_posting&sort=desc&currentPage=${currentPage}&dataPerPage=${entriesPerPage}&keywords=${debouncedSearch}`, 
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        }
      );

      if (response.data && response.data.result && response.data.result.data) {
        setBeritaData(response.data.result.data);
        setTotalDataServer(response.data.result.count || response.data.result.data.length);
      } else if (response.data && response.data.data) {
        setBeritaData(response.data.data);
        setTotalDataServer(response.data.count || response.data.data.length);
      } else {
        setBeritaData([]);
      }

    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          signOut({ callbackUrl: '/login' });
        } else {
          setErrorMsg("Gagal memuat data berita dari server.");
        }
      }
    } finally {
      setIsLoading(false); 
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = await Swal.fire({
      title: 'Yakin ingin menghapus?',
      text: "Berita ini tidak bisa dikembalikan setelah dihapus!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    });

    if (!confirmDelete.isConfirmed) return;

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const token = (session as any)?.accessToken;
      if (!token) return;

      await axios.delete(`/api-proxy/api/admin/berita/delete/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      Swal.fire({
        icon: 'success',
        title: 'Terhapus!',
        text: 'Berita berhasil dihapus.',
        timer: 2000,
        showConfirmButton: false
      });
      
      fetchBerita(); 

    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
         signOut({ callbackUrl: '/login' });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Terjadi kesalahan saat menghapus berita!'
        });
      }
    }
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tokenSiap = (session as any)?.accessToken;
    
    if (status === "authenticated" && tokenSiap) {
      fetchBerita();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, session, currentPage, entriesPerPage, debouncedSearch]);

  const displayedBerita = beritaData;

  if (status === "loading") {
    return <div className="min-h-screen p-6 sm:p-10 font-sans bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="min-h-screen p-6 sm:p-10 font-sans"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        
        <div className="flex items-center gap-4">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Berita</h2>
          {!isLoading && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 rounded-lg text-sm font-black border border-red-100 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              {totalDataServer > 0 ? totalDataServer : beritaData.length} Total Data
            </div>
          )}
        </div>
        
        <Link 
          href="/dashboardhome/berita/Tambah" 
          className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md shadow-red-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Tambah Berita
        </Link>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-200 font-medium">
          {errorMsg}
        </div>
      )}

      <div className="bg-white rounded-[1.5rem] border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
            <span>Show</span>
            <select 
              aria-label="Tampilkan entri" 
              name="showEntries" 
              value={entriesPerPage}
              onChange={(e) => setEntriesPerPage(Number(e.target.value))}
              className="border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white cursor-pointer"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span>entries</span>
          </div>

          <div className="relative w-full sm:w-64">
            <input 
              type="text" 
              placeholder="Cari data berita" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all bg-gray-50 focus:bg-white"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80">
                <th className="py-4 px-6 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider w-16 text-center">
                  No
                </th>
                <th className="py-4 px-6 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Judul Berita
                </th>
                <th className="py-4 px-6 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Asal Data
                </th>
                <th className="py-4 px-6 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Waktu Posting
                </th>
                <th className="py-4 px-6 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                [...Array(entriesPerPage)].map((_, index) => (
                  <tr key={index} className="animate-pulse border-b border-gray-50">
                    <td className="py-5 px-6"><div className="h-4 bg-gray-200 rounded-md w-8 mx-auto"></div></td>
                    <td className="py-5 px-6"><div className="h-4 bg-gray-200 rounded-md w-full"></div></td>
                    <td className="py-5 px-6"><div className="h-6 bg-gray-200 rounded-lg w-20"></div></td>
                    <td className="py-5 px-6"><div className="h-4 bg-gray-200 rounded-md w-24"></div></td>
                    <td className="py-5 px-6"><div className="h-8 bg-gray-200 rounded-lg w-28 mx-auto"></div></td>
                  </tr>
                ))
              ) : displayedBerita.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-24 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="bg-gray-50 p-6 rounded-full mb-6 border border-gray-100 shadow-inner">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-20 h-20 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-black text-gray-900 mb-2">Papan Berita Masih Kosong 📰</h3>
                      <p className="text-gray-500 max-w-md mb-8 font-medium">Sistem belum memiliki catatan artikel atau berita apapun. Yuk sebarkan informasi terbaru!</p>
                      <Link 
                        href="/dashboardhome/berita/Tambah"
                        className="px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl transition-all shadow-md flex items-center gap-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                        Tulis Berita Pertama
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                displayedBerita.map((item, index) => (
                  <tr key={item.id} className="hover:bg-red-50/40 transition-colors group">
                    <td className="py-4 px-6 border-b border-gray-100 text-sm font-semibold text-gray-900 text-center">
                      {(currentPage - 1) * entriesPerPage + index + 1}
                    </td>
                    <td className="py-4 px-6 border-b border-gray-100 text-sm font-semibold text-gray-900 max-w-[300px] truncate">
                      {item.judul_berita}
                    </td>
                    <td className="py-4 px-6 border-b border-gray-100 text-sm text-gray-600">
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-semibold">
                        {item.asal_data || "MANUAL"}
                      </span>
                    </td>
                    <td className="py-4 px-6 border-b border-gray-100 text-sm text-gray-600 whitespace-nowrap">
                      {item.waktu_posting}
                    </td>
                    <td className="py-4 px-6 border-b border-gray-100 text-sm text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Link 
                          href={`/dashboardhome/berita/detail/${item.id}`}
                          title="Lihat Detail" 
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        </Link>
                        <Link 
                          href={`/dashboardhome/berita/edit/${item.id}`}
                          title="Edit Berita" 
                          className="p-1.5 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-all"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>
                        </Link>
                        <button 
                          onClick={() => handleDelete(item.id)}
                          title="Hapus Berita" 
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50">
          <span className="text-sm text-gray-600 font-medium">
            Halaman {currentPage}
          </span>
          <div className="flex gap-2">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1 || isLoading}
              className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${currentPage === 1 || isLoading ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'}`}
            >
              Previous
            </button>
            <button 
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={displayedBerita.length < entriesPerPage || isLoading}
              className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${displayedBerita.length < entriesPerPage || isLoading ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'}`}
            >
              Next
            </button>
          </div>
        </div>

      </div>
    </motion.div>
  );
}