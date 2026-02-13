"use client"; // Etkileşim için şart

import Link from "next/link";
import { BarChart3, Zap, Shield } from "lucide-react";
import { useEffect } from "react";

export default function LandingPage() {
  
  // Pi Browser ortamında SDK'yı manuel kontrol etmek için
  const handleStart = async () => {
    if (typeof window !== "undefined" && window.Pi) {
      try {
        // Kullanıcıyı Pi ile doğrula
        const scopes = ['username', 'payments'];
        const auth = await window.Pi.authenticate(scopes, (payment) => {
          console.log("Tamamlanmamış ödeme bulundu:", payment);
        });
        
        console.log("SnapLogic Girişi Başarılı:", auth.user.username);
        // Doğrulama sonrası /auth veya /terminal sayfasına yönlendir
      } catch (err) {
        console.error("Pi Auth Hatası:", err);
      }
    } else {
      alert("Lütfen Pi Browser üzerinden giriş yapın!");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* ... Mevcut Tasarım Kodların ... */}

      {/* Hero Alanındaki Butonu Güncelleyelim */}
      <div className="flex flex-col md:flex-row gap-4">
        <button 
          onClick={handleStart}
          className="bg-yellow-500 text-black px-12 py-5 rounded-[24px] font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-[0_20px_40px_-10px_rgba(234,179,8,0.4)]"
        >
          Hemen Başla
        </button>
      </div>

      {/* ... Özellikler Bölümü ... */}
    </div>
  );
}
