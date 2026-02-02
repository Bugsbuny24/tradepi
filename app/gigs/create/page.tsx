"use client";

import SellerGate from "@/components/SellerGate";

// Burayı senin auth’ından alacağız.
// Şimdilik örnek: Supabase auth ile userId çekiyorsan props olarak ver.
export default function CreateGigPage() {
  // TODO: senin projende userId'yi nereden alıyorsan buraya koy
  const userId = null as string | null;

  return (
    <SellerGate userId={userId}>
      <div style={{ padding: 16 }}>
        <h1 style={{ fontSize: 24, fontWeight: 900 }}>Gig Oluştur</h1>
        <p>Buraya gig formu gelecek…</p>
      </div>
    </SellerGate>
  );
}
