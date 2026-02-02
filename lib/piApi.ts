// lib/piApi.ts

export type PiCreatePaymentBody = {
  amount: number;
  memo: string;
  metadata?: any;
  purpose: string;
};

export type NormalizedPiPayment = {
  payment_id: string;
  status: string;
  txid?: string | null; // ✅ eklendi
  raw: any;
};

const PI_BASE = "https://api.minepi.com/v2/payments";

function pickTxid(data: any): string | null {
  // Pi response'larda txid farklı yerlerde gelebiliyor
  return (
    data?.txid ??
    data?.transaction?.txid ??
    data?.payment?.txid ??
    data?.payment?.transaction?.txid ??
    null
  );
}

function normalizePiPayment(data: any): NormalizedPiPayment {
  const payment_id =
    data?.paymentId ??
    data?.payment_id ??
    data?.identifier ??
    data?.id ??
    data?.payment?.identifier ??
    data?.payment?.payment_id ??
    data?.payment?.id ??
    null;

  if (!payment_id) {
    throw new Error("PI_PAYMENT_ID_NOT_FOUND");
  }

  const status =
    data?.status ??
    data?.payment?.status ??
    data?.payment?.state ??
    "unknown";

  const txid = pickTxid(data);

  return {
    payment_id,
    status,
    txid,
    raw: data,
  };
}

async function safeJson(res: Response) {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return { _raw: text };
  }
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

  const data = await safeJson(res);

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

  const data = await safeJson(res);

  if (!res.ok) {
    throw new Error(
      `Pi get failed: ${res.status} ${JSON.stringify(data)}`
    );
  }

  return normalizePiPayment(data);
}

export async function piApprovePayment(
  payment_id: string
): Promise<NormalizedPiPayment> {
  const PI_API_KEY = process.env.PI_API_KEY;
  if (!PI_API_KEY) throw new Error("Missing PI_API_KEY");

  const res = await fetch(`${PI_BASE}/${payment_id}/approve`, {
    method: "POST",
    headers: {
      Authorization: `Key ${PI_API_KEY}`,
    },
  });

  const data = await safeJson(res);

  if (!res.ok) {
    throw new Error(
      `Pi approve failed: ${res.status} ${JSON.stringify(data)}`
    );
  }

  return normalizePiPayment(data);
}

export async function piCompletePayment(
  payment_id: string,
  txid?: string
): Promise<NormalizedPiPayment> {
  const PI_API_KEY = process.env.PI_API_KEY;
  if (!PI_API_KEY) throw new Error("Missing PI_API_KEY");

  const res = await fetch(`${PI_BASE}/${payment_id}/complete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Key ${PI_API_KEY}`,
    },
    // bazı ortamlarda txid gerekebilir; yoksa boş gönder
    body: JSON.stringify(txid ? { txid } : {}),
  });

  const data = await safeJson(res);

  if (!res.ok) {
    throw new Error(
      `Pi complete failed: ${res.status} ${JSON.stringify(data)}`
    );
  }

  return normalizePiPayment(data);
}
