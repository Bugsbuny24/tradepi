"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { Wallet, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  const [wallet, setWallet] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function getProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from("profiles").select("pi_wallet").eq("id", user.id).single();
        if (data?.pi_wallet) setWallet(data.pi_wallet);
      }
    }
    getProfile();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from("profiles").update({ pi_wallet: wallet }).eq("id", user?.id);
    if (error) alert("Hata: " + error.message);
    else alert("Cüzdanın Mühürlendi! Artık Para Kazanmaya Hazırsın. 💰");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 font-mono">
      <div className="max-w-xl mx-auto">
        <Link href="/dashboard" className="flex items-center gap-2 text-gray-500 mb-10 text-[9px] font-black uppercase">
          <ArrowLeft size={14} /> Operasyon Merkezi
        </Link>
        <div className="bg-[#0A0A0A] border border-white/5 p-10 rounded-[40px] shadow-2xl">
          <div className="flex items-center gap-3 mb-8">
            <Wallet className="text-yellow-500" size={24} />
            <h1 className="text-xl font-black uppercase italic tracking-tighter">Ödeme <span className="text-yellow-500">Ayarları</span></h1>
          </div>
          <input 
            value={wallet}
            onChange={(e) => setWallet(e.target.value)}
            placeholder="Pi Cüzdan Adresin (GACV...)"
            className="w-full bg-black/50 border border-white/10 p-4 rounded-2xl text-sm text-yellow-500 outline-none focus:border-yellow-500 transition-all mb-8 font-mono"
          />
          <button onClick={handleSave} disabled={loading} className="w-full bg-white text-black py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-yellow-500 transition-all">
            {loading ? "İŞLENİYOR..." : "CÜZDANI MÜHÜRLE"}
          </button>
        </div>
      </div>
    </div>
  );
}
