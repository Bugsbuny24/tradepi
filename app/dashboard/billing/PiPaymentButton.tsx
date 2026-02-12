"use client"; // Kanka burası çok önemli, tarayıcıda çalışacak

import { createPaymentIntent } from "./actions"; // Az önce yazdığımız server action

interface Props {
  packageCode: string;
  amount: number;
}

export default function PiPaymentButton({ packageCode, amount }: Props) {
  
  const handlePayment = async () => {
    try {
      // 1. Şemadaki 'checkout_intents' tablosuna kaydı açıyoruz (Server Action)
      const intentId = await createPaymentIntent(packageCode, amount);

      // 2. Pi SDK'yı tetikliyoruz
      // @ts-ignore (Pi SDK global window objesinde olduğu için)
      await window.Pi.createPayment({
        amount: amount,
        memo: `SnapLogic ${packageCode} Paketi`,
        metadata: { intentId: intentId },
      }, {
        onReadyForServerApproval: async (paymentId: string) => {
          // Kendi API'mize "Ödeme onay bekliyor" diyoruz
          await fetch('/api/payments/pi/approve', {
            method: 'POST',
            body: JSON.stringify({ paymentId, intentId })
          });
        },
        onReadyForServerCompletion: async (paymentId: string, txid: string) => {
          // Blokzincir onayladı, şemadaki 'pi_purchases' ve 'user_quotas' güncellenecek
          const res = await fetch('/api/payments/pi/complete', {
            method: 'POST',
            body: JSON.stringify({ paymentId, txid, intentId })
          });
          
          if(res.ok) alert("Krediler Şemaya Mühürlendi! 🚀");
        },
        onCancel: (paymentId: string) => console.log("İptal edildi"),
        onError: (error: Error, payment: any) => console.error("Hata:", error),
      });

    } catch (err) {
      console.error("Ödeme başlatılamadı:", err);
    }
  };

  return (
    <button 
      onClick={handlePayment}
      className="w-full py-4 bg-yellow-500 text-black rounded-2xl font-black text-[11px] uppercase tracking-widest hover:scale-[1.02] transition-all"
    >
      {amount} PI İLE SATIN AL
    </button>
  );
}
