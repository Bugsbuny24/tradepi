"use client"; // Dosyanın en başında olduğundan emin ol

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (result.success) {
        // Pi Browser'da en sağlam yöntem budur:
        window.location.assign(result.next || "/dashboard");
      } else {
        alert("Giriş başarısız! Bilgilerini kontrol et.");
        setLoading(false);
      }
    } catch (err) {
      console.error("Hata:", err);
      setLoading(false);
    }
  };

  return (
    // ... Mevcut JSX kodların ...
    <form onSubmit={handleSubmit}> 
      {/* action="/api/auth/login" kısmını sildik, onSubmit ekledik */}
      {/* ... inputların ... */}
      <button type="submit" disabled={loading}>
        {loading ? "GİRİŞ YAPILIYOR..." : "SİSTEME GİRİŞ YAP"}
      </button>
    </form>
  );
}
