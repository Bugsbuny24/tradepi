"use client"; // Next.js istemci bileşeni olduğunu belirtir

import { useEffect } from "react";

export default function PiLogin() {
  useEffect(() => {
    // Sayfa yüklendiğinde Pi SDK'yı başlatır
    const initPi = async () => {
      if (typeof window !== "undefined" && (window as any).Pi) {
        try {
          await (window as any).Pi.init({ 
            version: "2.0", 
            sandbox: true // Vercel'deki env ayarın gelene kadar test için true kalsın
          });
          console.log("Pi SDK hazır.");
        } catch (err) {
          console.error("Pi SDK başlatılamadı:", err);
        }
      }
    };
    initPi();
  }, []);

  const handlePiLogin = async () => {
    if (!(window as any).Pi) {
      alert("Pi Browser kullanmalısınız!");
      return;
    }

    try {
      const scopes = ['payments', 'username'];
      
      // Tamamlanmamış ödemeleri kontrol eden zorunlu fonksiyon
      const onIncompletePaymentFound = (payment: any) => {
        console.log("Tamamlanmamış ödeme bulundu:", payment);
        // Burada backend'e ödemeyi tamamlaması için istek atabilirsin
      };

      // İşte tepki vermeyen butonun çalışmasını sağlayacak asıl tetikleyici
      const auth = await (window as any).Pi.authenticate(scopes, onIncompletePaymentFound);
      console.log("Giriş Başarılı! Kullanıcı:", auth.user.username);
      
      // Giriş başarılıysa kullanıcıyı Dashboard'a yönlendir
      // window.location.href = "/dashboard";
      
    } catch (err) {
      console.error("Giriş sırasında hata oluştu:", err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <button 
        onClick={handlePiLogin}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg"
      >
        Pi Network ile Giriş Yap
      </button>
    </div>
  );
}
