import SellerGate from "@/components/SellerGate";

export default function SellerMessagesPage() {
  return (
    <SellerGate>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: 16 }}>
        <h1 style={{ fontSize: 28, fontWeight: 900 }}>Mesajlar</h1>
        <p style={{ opacity: 0.8, marginTop: 8 }}>
          MVP: order_messages threadleri burada.
        </p>
        <a href="/seller" style={{ fontWeight: 900, textDecoration: "none" }}>← Seller Panel</a>
      </div>
    </SellerGate>
  );
}
