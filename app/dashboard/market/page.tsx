use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { ShoppingCart, Zap, ArrowLeft, Wallet, CheckCircle, XCircle } from "lucide-react";
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
    // Kullanıcı bilgisini al
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    }
    getUser();

    // Paketleri çek
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

    // Pi Browser kontrolü
    if (!(window as any).Pi) {
      alert("⚠️ Bu uygulama sadece Pi Browser'da çalışır!\n\nLütfen Pi Browser'ı aç ve tekrar dene.");
      return;
    }

    setLoading(pkg.code);

    try {
      // 1. Purchase intent oluştur (database'e kaydet)
      const { data: intent, error: intentError } = await supabase
        .from("purchase_intents")
        .insert({
          user_id: user.id,
          package_code: pkg.code,
          amount_pi: pkg.price_pi,
          txid: `temp_${Date.now()}`, // geçici, gerçek txid payment'tan gelecek
          status: "pending"
        })
        .select()
        .single();

      if (intentError) throw intentError;

      // 2. Pi Payment başlat
      const payment = await (window as any).Pi.createPayment({
        amount: pkg.price_pi,
        memo: `${pkg.title} - SnapLogic Package Purchase`,
        metadata: { 
          packageCode: pkg.code,
          intentId: intent.id,
          userId: user.id
        }
      }, {
        // Ödeme onay bekliyor
        onReadyForServerApproval: async (paymentId: string) => {
          console.log("✅ Payment ID alındı:", paymentId);
          
          // Backend'e approval isteği gönder
          try {
            const approvalRes = await fetch("/api/payments/approve", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                paymentId,
                intentId: intent.id
              })
            });

            const approvalData = await approvalRes.json();
            
            if (approvalData.ok) {
              console.log("✅ Backend approval başarılı");
            } else {
              throw new Error("Backend approval failed");
            }
          } catch (e) {
            console.error("❌ Approval hatası:", e);
          }
        },

        // Ödeme tamamlandı
        onReadyForServerCompletion: async (paymentId: string, txid: string) => {
          console.log("✅ Payment tamamlandı! TXID:", txid);
          
          // Backend'e verify isteği gönder
          try {
            const verifyRes = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                paymentId,
                txid,
                intentId: intent.id
              })
            });

            const verifyData = await verifyRes.json();

            if (verifyData.ok) {
              // Purchase intent'i güncelle
              await supabase
                .from("purchase_intents")
                .update({
                  status: "completed",
                  txid: txid,
                  decided_at: new Date().toISOString()
                })
                .eq("id", intent.id);

              alert(`🎉 BAŞARILI!\n\n${pkg.title} paketi satın alındı!\n\nTXID: ${txid.slice(0, 16)}...`);
              
              // Sayfayı yenile
              window.location.reload();
            } else {
              throw new Error("Verification failed");
            }
          } catch (e) {
            console.error("❌ Verification hatası:", e);
            alert("⚠️ Ödeme doğrulanamadı. Lütfen support'a başvur.");
          }
        },

        // İptal edildi
        onCancel: async (paymentId: string) => {
          console.log("❌ Ödeme iptal edildi");
          
          await supabase
            .from("purchase_intents")
            .update({
              status: "cancelled",
              decided_at: new Date().toISOString(),
              decision_note: "User cancelled payment"
            })
            .eq("id", intent.id);

          alert("Ödeme iptal edildi.");
        },

        // Hata
        onError: async (error: any, payment: any) => {
          console.error("❌ Pi Payment hatası:", error);
          
          await supabase
            .from("purchase_intents")
            .update({
              status: "failed",
              decided_at: new Date().toISOString(),
              decision_note: error.message || "Payment error"
            })
            .eq("id", intent.id);

          alert(`⚠️ Ödeme hatası: ${error.message}`);
        }
      });

      console.log("Payment başlatıldı:", payment);

    } catch (error: any) {
      console.error("Hata:", error);
      alert(`❌ Bir hata oluştu: ${error.message}`);
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
              Pi Network Native Packages
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
                    {Object.entries(pkg.grants).slice(0, 3).map(([key, value]) => (
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
                {pkg.price_pi} <span className="text-lg">PI</span>
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
            <div className="text-gray-600 text-sm uppercase font-bold">
              No packages available
            </div>
          </div>
        )}

        {/* Info Footer */}
        <div className="mt-12 text-center">
          <div className="text-[9px] text-gray-700 font-bold uppercase tracking-wider">
            💡 All transactions are processed through Pi Network blockchain
          </div>
        </div>
      </div>
    </div>
  );
        }
