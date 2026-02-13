"use client";

export default function Page() {
  const handleAuth = async () => {
    // 1. SDK var mı kontrol et
    if (typeof window !== "undefined" && window.Pi) {
      try {
        // 2. Pi SDK Başlat (Version belirtmek şarttır)
        window.Pi.init({ version: "1.5", sandbox: true });

        // 3. Kimlik Doğrulama
        const scopes = ['username', 'payments'];
        const auth = await window.Pi.authenticate(scopes, (payment: any) => {
          console.log("Eksik ödeme:", payment);
        });
        
        console.log("Giriş Başarılı:", auth.user.username);
      } catch (err) {
        alert("Giriş başarısız! Pi Browser kullandığınızdan emin olun.");
      }
    } else {
      alert("Pi SDK henüz yüklenmedi, lütfen saniyeler sonra tekrar deneyin.");
    }
  };

  return (
    <button onClick={handleAuth}>
      HEMEN BAŞLA
    </button>
  );
}
