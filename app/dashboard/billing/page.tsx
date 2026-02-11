import TestPiPaymentButton from "../TestPiPaymentButton";

export default function BillingPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Billing</h1>
      <TestPiPaymentButton sandbox={true} />
    </div>
  );
}
