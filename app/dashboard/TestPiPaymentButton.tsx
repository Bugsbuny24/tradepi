"use client";

type Props = {
  sandbox?: boolean;
};

export default function TestPiPaymentButton({ sandbox = false }: Props) {
  async function handlePay() {
    if (!(window as any).Pi) {
      alert("Pi SDK yok");
      return;
    }

    await (window as any).Pi.init({
      version: "2.0",
      sandbox,
    });

    const payment = await (window as any).Pi.createPayment({
      amount: 1,
      memo: "Test Payment",
    });

    console.log("Payment:", payment);
  }

  return (
    <button
      onClick={handlePay}
      className="px-6 py-3 rounded-xl bg-yellow-500 text-black font-bold"
    >
      Test Pi Payment
    </button>
  );
}
