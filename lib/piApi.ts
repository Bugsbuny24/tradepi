// lib/piApi.ts

type PiCreatePaymentBody = {
  amount: number;
  memo: string;
  metadata?: any;
  purpose: string;
};

type NormalizedPiPayment = {
  payment_id: string;
  status: string;
  raw: any;
};

const PI_BASE = "https://api.minepi.com/v2/payments";

function normalizePiPayment(data: any): NormalizedPiPayment {
  const payment_id =
    data.paymentId ??
    data.identifier ??
    data.id ??
    data?.payment?.identifier ??
    null;

  if (!payment_id) {
    throw new Error("PI_PAYMENT_ID_NOT_FOUND");
  }

  return {
    payment_id,
    status: data.status ?? data?.payment?.status ?? "unknown",
    raw: data,
  };
}

export async function piCreatePayment(
  body: PiCreatePaymentBody
): Promise<NormalizedPiPayment> {
  const PI_API_KEY = process.env.PI_API_KEY;
  if (!PI_API_KEY) throw new Error("Missing PI_API_KEY");

  const res = await fetch(PI_BASE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Key ${PI_API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      `Pi create failed: ${res.status} ${JSON.stringify(data)}`
    );
  }

  return normalizePiPayment(data);
}

export async function piGetPayment(
  payment_id: string
): Promise<NormalizedPiPayment> {
  const PI_API_KEY = process.env.PI_API_KEY;
  if (!PI_API_KEY) throw new Error("Missing PI_API_KEY");

  const res = await fetch(`${PI_BASE}/${payment_id}`, {
    headers: {
      Authorization: `Key ${PI_API_KEY}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      `Pi get failed: ${res.status} ${JSON.stringify(data)}`
    );
  }

  return normalizePiPayment(data);
}
