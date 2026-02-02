import SellerGate from "@/components/SellerGate";
import SellerDashboard from "@/components/SellerDashboard";

export default function SellerPage() {
  return (
    <SellerGate>
      <SellerDashboard />
    </SellerGate>
  );
}
