type PiPaymentDTO = any;

function piHeaders(): Record<string, string> {
  const key = process.env.PI_API_KEY;
  if (!key) throw new Error("Missing PI_API_KEY");

  // Pi örneklerinde `authorization: key ...` çok geçiyor.
  // Bazı ortamlarda `Authorization: Key ...` da kabul görüyor.
  return {
    Authorization: `Key ${key}`,
    authorization: `key ${key}`,
    "Content-Type": "application/json",
  };
}

async function parseJson(res: Response) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

export async function piApprovePayment(paymentId: string): Promise<PiPaymentDTO> {
  const url = `https://api.minepi.com/v2/payments/${encodeURIComponent(
    paymentId
  )}/approve`;

  const res = await fetch(url, {
    method: "POST",
    headers: piHeaders(),
    body: "null",
  });

  const json = await parseJson(res);
  if (!res.ok) {
    throw new Error(
      json?.error?.message ?? json?.message ?? `Pi approve failed (${res.status})`
    );
  }
  return json;
}

export async function piCompletePayment(
  paymentId: string,
  txid: string
): Promise<PiPaymentDTO> {
  const url = `https://api.minepi.com/v2/payments/${encodeURIComponent(
    paymentId
  )}/complete`;

  const res = await fetch(url, {
    method: "POST",
    headers: piHeaders(),
    body: JSON.stringify({ txid }),
  });

  const json = await parseJson(res);
  if (!res.ok) {
    throw new Error(
      json?.error?.message ?? json?.message ?? `Pi complete failed (${res.status})`
    );
  }
  return json;
}
