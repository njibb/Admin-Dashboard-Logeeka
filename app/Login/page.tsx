"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      const cleanEmail = email.trim();
      const cleanPassword = password.trim();

      const response = await axios.post(
        "/api/auth/login", 
        {
          params: {
            email: cleanEmail,
            password: cleanPassword
          }
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      const token = response.data?.data?.token;
      
      if (token) {
        localStorage.setItem("token", token);
        router.push("/dashboardhome");
      } else {
        setErrorMsg("Login berhasil, tapi sistem tidak menemukan token.");
      }

    } catch (error) {
      console.error("Error Login:", error);
      
      if (axios.isAxiosError(error)) {
        const serverMessage = error.response?.data?.message;
        setErrorMsg(serverMessage || "Gagal login. Kredensial salah atau server menolak.");
      } else {
        setErrorMsg("Terjadi kesalahan pada jaringan.");
      }
      
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-[#fff5f5] overflow-hidden font-sans p-4">
      
      {/* Tombol Back */}
      <Link href="/" className="absolute top-8 left-8 text-red-800/60 hover:text-red-600 font-medium flex items-center gap-2 transition-colors z-20">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
        Home page
      </Link>

      {/* BACKGROUND MESH */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-red-300 rounded-full mix-blend-multiply filter blur-[120px] opacity-70"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-rose-400 rounded-full mix-blend-multiply filter blur-[150px] opacity-60"></div>
      <div className="absolute top-[20%] left-[40%] w-[400px] h-[400px] bg-orange-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-60 animate-pulse"></div>

      {/* KARTU LOGIN */}
      <div className="relative z-10 w-full max-w-md bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-[0_20px_50px_-12px_rgba(220,38,38,0.25)] p-8 sm:p-12 border border-white">
        
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center"><span className="text-white font-bold text-xl">L</span></div>
            <span className="text-xl font-bold text-gray-800 tracking-wider">LOGEEKA</span>
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Welcome Back!</h1>
          <p className="text-sm text-gray-500">We missed you! Please enter your details.</p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl text-center font-medium">
            {errorMsg}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleLogin}>
          
          {/* Input Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
            <input 
              type="email" 
              placeholder="Enter your Email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all bg-gray-50/50 focus:bg-white"
            />
          </div>

          {/* Input Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Enter Password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all bg-gray-50/50 focus:bg-white pr-10"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                )}
              </button>
            </div>
          </div>

          {/* Tombol Action */}
          <div className="pt-6">
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-red-600/30 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}