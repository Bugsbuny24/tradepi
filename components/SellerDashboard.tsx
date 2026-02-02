"use client";

export default function SellerDashboard() {
  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: 16 }}>
      <h1 style={{ fontSize: 34, fontWeight: 900 }}>Seller Panel</h1>
      <p style={{ opacity: 0.8, marginTop: 6 }}>
        Gigs / Orders / Mesajlar burada olacak.
      </p>

      <div style={{ display: "grid", gap: 12, marginTop: 18 }}>
        <a href="/gigs/create" style={cardStyle}>
          ➕ Gig Oluştur
          <div style={subText}>Yeni hizmet ekle</div>
        </a>

        <a href="/seller/gigs" style={cardStyle}>
          📦 Gigs’lerim
          <div style={subText}>Aktif / taslak / pause</div>
        </a>

        <a href="/seller/orders" style={cardStyle}>
          🧾 Siparişler
          <div style={subText}>Gelen / devam eden / tamamlanan</div>
        </a>

        <a href="/seller/messages" style={cardStyle}>
          💬 Mesajlar
          <div style={subText}>Order mesajları</div>
        </a>
      </div>

      <div style={{ marginTop: 18 }}>
        <a href="/" style={ghostStyle}>← Ana Sayfa</a>
      </div>
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  display: "block",
  padding: 16,
  border: "2px solid #111",
  borderRadius: 16,
  fontWeight: 900,
  textDecoration: "none",
  color: "inherit",
};

const subText: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  opacity: 0.7,
  marginTop: 6,
};

const ghostStyle: React.CSSProperties = {
  textDecoration: "none",
  fontWeight: 900,
};
