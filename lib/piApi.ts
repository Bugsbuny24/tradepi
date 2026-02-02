// lib/piApi.ts
type PiCreatePaymentBody = {
  amount: number;
  memo: string;
  metadata?: any;
  purpose: string;
};

export async function piCreatePayment(body: PiCreatePaymentBody) {
  const PI_API_KEY = process.env.PI_API_KEY!;
  if (!PI_API_KEY) throw new Error("Missing PI_API_KEY");

  // TODO: Pi gerçek endpointine uyarlayacaksın.
  // Aşağıdaki URL örnektir.
  const res = await fetch("https://api.minepi.com/v2/payments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Key ${PI_API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Pi create failed: ${res.status} ${t}`);
  }
  return res.json(); // { paymentId, ... }
}

export async function piGetPayment(paymentId: string) {
  const PI_API_KEY = process.env.PI_API_KEY!;
  const res = await fetch(`https://api.minepi.com/v2/payments/${paymentId}`, {
    headers: { Authorization: `Key ${PI_API_KEY}` },
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Pi get failed: ${res.status} ${t}`);
  }
  return res.json();
}
