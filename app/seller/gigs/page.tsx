import SellerGate from "@/components/SellerGate";

export default function SellerGigsPage() {
  return (
    <SellerGate>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: 16 }}>
        <h1 style={{ fontSize: 28, fontWeight: 900 }}>Gigs’lerim</h1>
        <p style={{ opacity: 0.8, marginTop: 8 }}>
          MVP: burada gig listesi göstereceğiz.
        </p>

        <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
          <a href="/gigs/create" style={btnStyle}>➕ Gig Oluştur</a>
          <a href="/seller" style={btnStyle}>← Seller Panel</a>
        </div>
      </div>
    </SellerGate>
  );
}

const btnStyle: React.CSSProperties = {
  display: "block",
  padding: 14,
  border: "2px solid #111",
  borderRadius: 14,
  fontWeight: 900,
  textDecoration: "none",
  textAlign: "center",
};
