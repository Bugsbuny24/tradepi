"use client";

export default function Page() {
  const pay = async () => {
    if (!window.Pi) {
      alert("Pi SDK yok");
      return;
    }

    window.Pi.init({ version: "1.5", sandbox: false });

    try {
      const payment = await window.Pi.createPayment({
        amount: 1,
        memo: "Test payment",
        metadata: { orderId: "order123" }
      });

      // paymentId backend'e gönderilecek
      await fetch("/api/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId: payment.identifier })
      });

      alert("Ödeme isteği gönderildi");
    } catch (e) {
      console.error(e);
      alert("Ödeme iptal edildi");
    }
  };

  return <button onClick={pay}>1 Pi Öde</button>;
}
