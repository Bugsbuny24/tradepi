// lib/pi/pi-api.ts

type PiPaymentDTO = any;

const PI_API_BASE = "https://api.minepi.com/v2";

function piHeaders(): Record<string, string> {
  const key = process.env.PI_API_KEY;
  if (!key) throw new Error("Missing PI_API_KEY");

  return {
    // Pi örneklerinde iki format da kullanılıyor, ikisini de yolluyoruz
    Authorization: `Key ${key}`,
    authorization: `key ${key}`,
    "Content-Type": "application/json",
  };
}

async function parseJson(res: Response) {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return { raw: text };
  }
}

async function piFetch<T>(
  path: string,
  init: RequestInit & { body?: any } = {}
): Promise<T> {
  const url = path.startsWith("http") ? path : `${PI_API_BASE}${path}`;

  const res = await fetch(url, {
    ...init,
    headers: {
      ...piHeaders(),
      ...(init.headers as Record<string, string> | undefined),
    },
    body:
      init.body === undefined
        ? undefined
        : init.body === null
        ? "null"
        : typeof init.body === "string"
        ? init.body
        : JSON.stringify(init.body),
  });

  const json: any = await parseJson(res);

  if (!res.ok) {
    throw new Error(
      json?.error?.message ??
        json?.message ??
        `Pi API failed (${res.status}) ${url}`
    );
  }

  return json as T;
}

export async function piApprovePayment(paymentId: string): Promise<PiPaymentDTO> {
  return piFetch<PiPaymentDTO>(
    `/payments/${encodeURIComponent(paymentId)}/approve`,
    { method: "POST", body: null }
  );
}

export async function piCompletePayment(
  paymentId: string,
  txid: string
): Promise<PiPaymentDTO> {
  return piFetch<PiPaymentDTO>(
    `/payments/${encodeURIComponent(paymentId)}/complete`,
    { method: "POST", body: { txid } }
  );
}

export async function piCancelPayment(paymentId: string): Promise<PiPaymentDTO> {
  return piFetch<PiPaymentDTO>(
    `/payments/${encodeURIComponent(paymentId)}/cancel`,
    { method: "POST", body: null }
  );
}
