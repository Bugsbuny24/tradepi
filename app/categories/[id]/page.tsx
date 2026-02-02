"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Cat = { id: string; name: string; parent_id: string | null };

export default function CategoryChildrenPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const parentId = params.id;

  const [parent, setParent] = useState<Cat | null>(null);
  const [children, setChildren] = useState<Cat[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const isLeaf = useMemo(() => !loading && children.length === 0, [loading, children]);

  useEffect(() => {
    (async () => {
      setMsg("");
      setLoading(true);

      const p = await supabase.from("categories").select("id,name,parent_id").eq("id", parentId).single();
      if (!p.error) setParent(p.data);

      const ch = await supabase
        .from("categories")
        .select("id,name,parent_id")
        .eq("parent_id", parentId)
        .order("name", { ascending: true });

      setChildren(ch.data ?? []);
      setLoading(false);
    })();
  }, [parentId]);

  const chooseThisCategory = async (categoryId: string) => {
    setMsg("");
    setSaving(true);
    try {
      // Kullanıcının supabase auth oturumu olmalı (auth.uid() ile profiles update edilir)
      const { data: userData, error: userErr } = await supabase.auth.getUser();
      if (userErr || !userData?.user?.id) throw new Error("Giriş yok. (Supabase auth session bulunamadı)");

      const uid = userData.user.id;

      const { error } = await supabase
        .from("profiles")
        .update({ selected_category_id: categoryId })
        .eq("id", uid);

      if (error) throw new Error(error.message);

      setMsg("✅ Kategori seçildi! Şimdi vitrine yönlendiriyorum…");
      setTimeout(() => router.push("/"), 600);
    } catch (e: any) {
      setMsg(e?.message ?? "Kategori kaydedilemedi.");
    } finally {
      setSaving(false);
    }

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: 16 }}>
      <button onClick={() => router.back()} style={{ marginBottom: 10 }}>
        ← Geri
      </button>

      <h1 style={{ fontSize: 22, fontWeight: 900 }}>
        {parent ? parent.name : "Kategori"}{" "}
      </h1>

      {loading ? <div style={{ marginTop: 16 }}>Yükleniyor...</div> : null}

      {!loading && children.length > 0 ? (
        <>
          <p style={{ opacity: 0.8, marginTop: 8 }}>Alt kategori seç:</p>
          <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
            {children.map((c) => (
              <button
                key={c.id}
                onClick={() => router.push(`/categories/${c.id}`)}
                style={{
                  textAlign: "left",
                  padding: 12,
                  border: "1px solid #eee",
                  borderRadius: 12,
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                {c.name} →
              </button>
            ))}
          </div>

          <div style={{ marginTop: 18, opacity: 0.8 }}>
            Bu ana kategoriyi direkt seçmek istersen:
          </div>
          <button
            disabled={saving}
            onClick={() => chooseThisCategory(parentId)}
            style={{
              marginTop: 10,
              width: "100%",
              padding: 12,
              borderRadius: 12,
              fontWeight: 900,
              cursor: "pointer",
            }}
          >
            {saving ? "Kaydediliyor..." : "Bu kategoriyi seç"}
          </button>
        </>
      ) : null}

      {!loading && isLeaf ? (
        <>
          <p style={{ opacity: 0.8, marginTop: 10 }}>
            Bu kategorinin altında alt kategori yok. Direkt bunu seçebilirsin.
          </p>
          <button
            disabled={saving}
            onClick={() => chooseThisCategory(parentId)}
            style={{
              marginTop: 10,
              width: "100%",
              padding: 12,
              borderRadius: 12,
              fontWeight: 900,
              cursor: "pointer",
            }}
          >
            {saving ? "Kaydediliyor..." : "Bu kategoriyi seç"}
          </button>
        </>
      ) : null}

      {msg ? (
        <div style={{ marginTop: 12, padding: 10, borderRadius: 10, background: "#f7f7f7" }}>
          {msg}
        </div>
