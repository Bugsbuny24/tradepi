import SellerGate from "@/components/SellerGate";

export default function CreateGigPage() {
  return (
    <SellerGate>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: 16 }}>
        <h1 style={{ fontSize: 28, fontWeight: 900 }}>Gig Oluştur</h1>
        <p style={{ opacity: 0.8, marginTop: 8 }}>
          MVP: formu burada yapacağız (title, price, delivery_days, revisions).
        </p>

        <div style={{ marginTop: 14 }}>
          <a href="/seller" style={{ fontWeight: 900, textDecoration: "none" }}>
            ← Seller Panel
          </a>
        </div>
      </div>
    </SellerGate>
  );
}
