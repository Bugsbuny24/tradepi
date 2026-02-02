"use client";

import SellerGate from "@/components/SellerGate";

// Burayı senin auth’ından alacağız.
// Şimdilik örnek: Supabase auth ile userId çekiyorsan props olarak ver.
export default function SellerGate({
  children,
  userId,
}: {
  children: React.ReactNode;
  userId?: string;
}) {
  ...
}
