"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { ShoppingCart, Zap, ArrowLeft, Wallet, CheckCircle } from "lucide-react";
import Link from "next/link";

type Package = {
  id: string;
  code: string;
  title: string;
  price_try: number;
  price_usd: number;
  grants: any;
};

export default function MarketPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    }
    getUser();

    async function fetchPackages() {
      const { data } = await supabase
        .from("packages")
        .select("*")
        .eq("is_active", true)
        .eq("sell_currency", "TRY")
        .order("price_try", { ascending: true });
      
      setPackages(data || []);
    }
    fetchPackages();
  }, []);

  const handlePurchase = async (pkg: Package) => {
    if (!user) {
      alert("⚠️ Lütfen önce giriş yap!");
      window.location.href = "/auth";
      return;
    }

    setLoading(pkg.code);

    try {
      // Purchase intent oluştur
      const { data: intent, error: intentError } = await supabase
        .from("checkout_intents")
        .insert({
          user_id: user.id,
          package_code: pkg.code,
          amount: pkg.price_try,
          currency: "TRY",
          provider: "iyzico", // Gelecekte iyzico entegrasyonu
          provider_ref: `temp_${Date.now()}`,
          status: "pending"
        })
        .select()
        .single();

      if (intentError) throw intentError;

      // TODO: İyzico ödeme sayfasına yönlendir
      alert(`💳 Ödeme sistemi yakında aktif!\n\nPaket: ${pkg.title}\nFiyat: ${pkg.price_try} TRY`);
      
      // Demo için - gerçekte iyzico'ya yönlendirilecek
      // window.location.href = `/payment/${intent.id}`;

    } catch (error: any) {
      console.error("Purchase error:", error);
      alert(`❌ Hata: ${error.message}`);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 md:p-8 font-mono">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center gap-2 text-gray-500 hover:text-yellow-500 transition-colors mb-4"
          >
            <ArrowLeft size={16} />
            <span className="text-xs uppercase font-bold">Dashboard</span>
          </Link>
          
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-black italic text-yellow-500 uppercase mb-2">
              SnapCore Market
            </h1>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.3em]">
              Premium Packages
            </p>
          </div>
        </div>

        {/* User Info */}
        {user && (
          <div className="bg-[#0A0A0A] border border-white/5 p-4 rounded-2xl mb-8">
            <div className="flex items-center gap-3">
              <Wallet className="text-yellow-500" size={20} />
              <div>
                <div className="text-xs text-gray-500 uppercase font-bold">Logged in as</div>
                <div className="text-sm font-mono text-white">{user.email}</div>
              </div>
            </div>
          </div>
        )}

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div 
              key={pkg.id} 
              className="bg-[#0A0A0A] border border-white/5 p-6 md:p-8 rounded-[40px] hover:border-yellow-500/30 transition-all"
            >
              {/* Package Code */}
              <div className="text-[9px] text-gray-700 font-black mb-2 uppercase tracking-wider">
                {pkg.code}
              </div>

              {/* Package Title */}
              <h3 className="text-lg md:text-xl font-black uppercase italic mb-4 text-white">
                {pkg.title}
              </h3>

              {/* Grants Preview */}
              {pkg.grants && (
                <div className="mb-6">
                  <div className="text-[9px] text-gray-600 font-bold mb-2 uppercase">Includes:</div>
                  <div className="space-y-1">
                    {Object.entries(pkg.grants).slice(0, 4).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-2 text-[10px] text-gray-400">
                        <CheckCircle size={10} className="text-green-500" />
                        <span>{key.replace(/_/g, ' ')}: {String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Price */}
              <div className="text-2xl md:text-3xl font-black text-yellow-500 mb-6">
                {pkg.price_try} <span className="text-lg">TRY</span>
              </div>

              {/* Purchase Button */}
              <button 
                onClick={() => handlePurchase(pkg)}
                disabled={loading === pkg.code}
                className="w-full bg-white text-black py-4 rounded-2xl font-black text-[10px] uppercase hover:bg-yellow-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading === pkg.code ? (
                  <span className="flex items-center justify-center gap-2">
                    <Zap size={14} className="animate-pulse" />
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <ShoppingCart size={14} />
                    Purchase Now
                  </span>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* No packages message */}
        {packages.length === 0 && (
          <div className="text-center py-20">
            <div className="text-gray-600 text-sm uppercase font-bold mb-4">
              No packages available
            </div>
            <p className="text-gray-700 text-xs">
              Packages are being prepared. Check back soon!
            </p>
          </div>
        )}

        {/* Info Footer */}
        <div className="mt-12 text-center">
          <div className="text-[9px] text-gray-700 font-bold uppercase tracking-wider">
            💳 Secure payments powered by İyzico
          </div>
        </div>
      </div>
    </div>
  );
}
