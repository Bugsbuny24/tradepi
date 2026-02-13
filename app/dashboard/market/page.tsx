"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { ShoppingCart, Zap, ArrowLeft, Wallet, CheckCircle } from "lucide-react";
import Link from "next/link";

type Package = {
  id: string;
  code: string;
  title: string;
  price_pi: number;
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
        .from("active_packages")
        .select("*")
        .order("price_pi", { ascending: true });
      setPackages(data || []);
    }
    fetchPackages();
  }, []);

  const handlePurchase = async (pkg: Package) => {
    if (!user) {
      alert("Lütfen önce giriş yap!");
      return;
    }

    if (!(window as any).Pi) {
      alert("⚠️ Bu uygulama sadece Pi Browser'da çalışır!");
      return;
    }

    setLoading(pkg.code);

    try {
      const { data: intent, error: intentError } = await supabase
        .from("purchase_intents")
        .insert({
          user_id: user.id,
          package_code: pkg.code,
          amount_pi: pkg.price_pi,
          txid: `temp_${Date.now()}`,
          status: "pending"
        })
        .select()
        .single();

      if (intentError) throw intentError;

      const payment = await (window as any).Pi.createPayment({
        amount: pkg.price_pi,
        memo: `${pkg.title} - SnapLogic Package`,
        metadata: { 
          packageCode: pkg.code,
          intentId: intent.id,
          userId: user.id
        }
      }, {
        onReadyForServerApproval: async (paymentId: string) => {
          const res = await fetch("/api/payments/approve", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ paymentId, intentId: intent.id })
          });
          const data = await res.json();
          if (!data.ok) throw new Error("Approval failed");
        },

        onReadyForServerCompletion: async (paymentId: string, txid: string) => {
          const res = await fetch("/api/payments/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ paymentId, txid, intentId: intent.id })
          });
          const data = await res.json();
          
          if (data.ok) {
            await supabase
              .from("purchase_intents")
              .update({ status: "completed", txid, decided_at: new Date().toISOString() })
              .eq("id", intent.id);
            
            alert(`🎉 BAŞARILI! ${pkg.title} satın alındı!`);
            window.location.reload();
          }
        },

        onCancel: async () => {
          await supabase
            .from("purchase_intents")
            .update({ status: "cancelled", decided_at: new Date().toISOString() })
            .eq("id", intent.id);
          alert("Ödeme iptal edildi.");
        },

        onError: async (error: any) => {
          await supabase
            .from("purchase_intents")
            .update({ status: "failed", decided_at: new Date().toISOString() })
            .eq("id", intent.id);
          alert(`Hata: ${error.message}`);
        }
      });
    } catch (error: any) {
      alert(`Hata: ${error.message}`);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 md:p-8 font-mono">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-500 hover:text-yellow-500">
            <ArrowLeft size={16} />
            <span className="text-xs uppercase font-bold">Dashboard</span>
          </Link>
          
          <div className="text-center mt-4">
            <h1 className="text-4xl font-black italic text-yellow-500 uppercase">Market</h1>
          </div>
        </div>

        {user && (
          <div className="bg-[#0A0A0A] border border-white/5 p-4 rounded-2xl mb-8">
            <Wallet className="text-yellow-500 inline mr-2" size={20} />
            <span className="text-sm">{user.email}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div key={pkg.id} className="bg-[#0A0A0A] border border-white/5 p-8 rounded-3xl">
              <div className="text-xs text-gray-700 mb-2">{pkg.code}</div>
              <h3 className="text-xl font-black uppercase mb-4">{pkg.title}</h3>
              <div className="text-3xl font-black text-yellow-500 mb-6">{pkg.price_pi} PI</div>
              
              <button 
                onClick={() => handlePurchase(pkg)}
                disabled={loading === pkg.code}
                className="w-full bg-white text-black py-4 rounded-2xl font-black text-xs uppercase hover:bg-yellow-500 disabled:opacity-50"
              >
                {loading === pkg.code ? "Processing..." : "Purchase Now"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
          }
