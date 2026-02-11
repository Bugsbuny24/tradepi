import TestPiPaymentButton from "../TestPiPaymentButton";

export default function BillingPage() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-3xl font-black">Pi Billing</h1>
      <p className="text-sm text-gray-500">Sandbox test ödeme butonu.</p>
      <TestPiPaymentButton />
    </div>
  );
}
