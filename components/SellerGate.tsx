"use client";

import { useEffect, useState } from "react";

export default function SellerGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    // MVP: şimdilik true
    // sonra supabase profile → is_seller / is_member kontrolü
    setAllowed(true);
  }, []);

  if (!allowed) {
    return <p>Erişim yok</p>;
  }

  return <>{children}</>;
}
