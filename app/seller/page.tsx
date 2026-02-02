import SellerGate from "@/components/SellerGate";

export default function SellerPage() {
  return (
    <SellerGate>
      <div style={{ maxWidth: 820, margin: "0 auto", padding: 16 }}>
        <h2>Seller Panel</h2>
        <p>✅ Satıcı + üyelik + kategori tamam. Buraya gigs/orders koyacağız.</p>
      </div>
    </SellerGate>
  );
}
