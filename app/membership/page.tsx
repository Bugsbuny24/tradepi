"use client";

import { useState } from "react";

declare global {
  interface Window {
    Pi?: any;
  }
}

export default function MembershipPage() {
  const [loading, setLoading] = useState(false);

  const startMembershipPayment = async () => {
    try {
      setLoading(true);

      if (!window.Pi) {
        alert("Pi SDK bulunamadı. Pi Browser içinde açmalısın.");
        return;
      }

      // 1) Ödeme kaydı backend'de oluştur (paymentId almak için)
      const createRes = await fetch("/api/pi/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          purpose: "membership",
          plan: "yearly",
          amount: 100,
        }),
      });

      if (!createRes.ok) {
        const t = await createRes.text();
        throw new Error("Create failed: " + t);
      }

      const { paymentId } = await createRes.json();

      // 2) Pi ödeme ekranını aç
      const paymentData = {
        amount: 100,
        memo: "TradePiGloball Annual Membership",
        metadata: {
          type: "membership",
          plan: "yearly",
          paymentId,
        },
      };

      const callbacks = {
        onReadyForServerApproval: async (piPaymentId: string) => {
          // Pi, "server approval" aşamasında backend'e gitmeni ister
          await fetch("/api/pi/payments/approve", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              paymentId,
              piPaymentId,
            }),
          });
        },

        onReadyForServerCompletion: async (piPaymentId: string, txid: string) => {
          // Ödeme blockchain tx ile oluştu: backend "complete" ile doğrular
          await fetch("/api/pi/payments/complete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              paymentId,
              piPaymentId,
              txid,
            }),
          });

          alert("Ödeme tamamlandı. Üyelik aktif!");
          // burada kullanıcıyı kategorilere yönlendirebilirsin
          // router.push("/categories")
        },

        onCancel: (piPaymentId: string) => {
          console.log("User cancelled:", piPaymentId);
          alert("Ödeme iptal edildi.");
        },

        onError: (error: any, piPaymentId: string) => {
          console.error("Payment error:", error, piPaymentId);
          alert("Ödeme hatası: " + (error?.message ?? "Bilinmeyen hata"));
        },
      };

      // Pi SDK çağrısı
      await window.Pi.createPayment(paymentData, callbacks);
    } catch (err: any) {
      console.error(err);
      alert(err?.message ?? "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>Yıllık Üyelik</h1>
      <p>100 Pi / yıl</p>

      <button onClick={startMembershipPayment} disabled={loading}>
        {loading ? "İşleniyor..." : "100 Pi ile Üye Ol"}
      </button>
    </div>
  );
}
