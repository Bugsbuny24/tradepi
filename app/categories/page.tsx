"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Cat = { id: string; name: string; parent_id: string | null };

export default function CategoriesPage() {
  const [cats, setCats] = useState<Cat[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      setErr("");
      setLoading(true);
      const { data, error } = await supabase
        .from("categories")
        .select("id,name,parent_id")
        .is("parent_id", null)
        .order("name", { ascending: true });

      if (error) setErr(error.message);
      setCats(data ?? []);
      setLoading(false);
    })();
  }, []);

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: 16 }}>
      <h1 style={{ fontSize: 24, fontWeight: 900 }}>Kategori seç</h1>
      <p style={{ opacity: 0.8, marginTop: 6 }}>
        Önce ana kategoriyi seç, sonra alt kategoriler gelecek.
      </p>

      {loading ? <div style={{ marginTop: 16 }}>Yükleniyor...</div> : null}
      {err ? (
        <div style={{ marginTop: 16, padding: 12, background: "#fee2e2", borderRadius: 10 }}>
          {err}
        </div>
      ) : null}

      <div style={{ marginTop: 16, display: "grid", gap: 10 }}>
        {cats.map((c) => (
          <Link
            key={c.id}
            href={`/categories/${c.id}`}
            style={{
              display: "block",
              padding: 12,
              border: "1px solid #eee",
              borderRadius: 12,
              textDecoration: "none",
              fontWeight: 800,
            }}
          >
            {c.name} →
          </Link>
        ))}
      </div>
    </div>
  );
}
