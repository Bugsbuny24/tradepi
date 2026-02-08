type PiPaymentDTO = any;

function piAuthHeaders() {
  const key = process.env.PI_API_KEY;
  if (!key) throw new Error("Missing PI_API_KEY");
  // Doc’larda örneklerde authorization: `key ${APIKEY}` geçiyor.
  // Bazı örneklerde "Key ..." de görülüyor. İkisini de tolere edelim.
  return {
    // çoğu entegrasyonda işe yarayan:
    Authorization: `Key ${key}`,
    // bazı örneklerde küçük harf:
    authorization: `key ${key}`,
    "Content-Type": "application/json",
  } as Record<string, string>;
}

export async function piApprovePayment(paymentId: string): Promise<PiPaymentDTO> {
  const url = `https://api.minepi.com/v2/payments/${encodeURIComponent(
    paymentId
  )}/approve`;

  const res = await fetch(url, {
    method: "POST",
    headers: piAuthHeaders(),
    body: "null", // doc örneklerinde null/empty
  });

  const text = await res.text();
  let json: any = null;
  try {
    json = JSON.parse(text);
  } catch {
    json = { raw: text };
  }

  if (!res.ok) {
    throw new Error(json?.error?.message ?? json?.message ?? `Pi approve failed`);
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
    headers: piAuthHeaders(),
    body: JSON.stringify({ txid }),
  });

  const text = await res.text();
  let json: any = null;
  try {
    json = JSON.parse(text);
  } catch {
    json = { raw: text };
  }

  if (!res.ok) {
    throw new Error(
      json?.error?.message ?? json?.message ?? `Pi complete failed`
    );
  }

  return json;
}
