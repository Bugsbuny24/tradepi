export type PiConfig = {
  apiKey: string; // Pi Developer Portal -> API Key
  sandbox: boolean; // true=testnet(sandbox), false=mainnet
};

function getPiConfig(): PiConfig {
  const apiKey = process.env.PI_API_KEY || "";
  const sandbox = process.env.NEXT_PUBLIC_PI_SANDBOX === "true";
  if (!apiKey) throw new Error("PI_API_KEY env missing");
  return { apiKey, sandbox };
}

function piBaseUrl(sandbox: boolean) {
  // Pi Platform API base
  return sandbox ? "https://api.testnet.minepi.com" : "https://api.minepi.com";
}

// IMPORTANT: RequestInit body is BodyInit, not an object.
// We accept "body?: any" but we serialize to JSON before calling fetch.
type PiFetchInit = Omit<RequestInit, "body"> & { body?: any };

async function piFetch<T>(path: string, init: PiFetchInit = {}): Promise<T> {
  const { apiKey, sandbox } = getPiConfig();
  const url = `${piBaseUrl(sandbox)}/v2${path}`;

  const method = init.method || "GET";

  const headers: Record<string, string> = {
    "Authorization": `Key ${apiKey}`,
    ...(init.headers as any),
  };

  let body: any = undefined;

  if (init.body !== undefined) {
    // If already a string, pass through. Otherwise JSON stringify.
    body = typeof init.body === "string" ? init.body : JSON.stringify(init.body);
    headers["Content-Type"] = headers["Content-Type"] || "application/json";
  }

  const res = await fetch(url, {
    ...init,
    method,
    headers,
    body,
  } as any);

  const text = await res.text();
  let json: any = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    // non-json
  }

  if (!res.ok) {
    const msg =
      (json && (json.error || json.message)) ||
      text ||
      `Pi API error ${res.status}`;
    throw new Error(msg);
  }

  return json as T;
}

// ---- PI Payments v2 ----
// Create payment (server side)
export async function piCreatePayment(dto: {
  amount: number;
  memo: string;
  metadata?: any;
  uid: string; // Pi user uid
  username?: string;
}) {
  return piFetch<any>("/payments", {
    method: "POST",
    body: dto,
  });
}

// Approve payment (server side)
export async function piApprovePayment(paymentId: string) {
  return piFetch<any>(`/payments/${encodeURIComponent(paymentId)}/approve`, {
    method: "POST",
  });
}

// Complete payment (server side)
export async function piCompletePayment(paymentId: string, txid: string) {
  return piFetch<any>(`/payments/${encodeURIComponent(paymentId)}/complete`, {
    method: "POST",
    body: { txid },
  });
}

// Cancel payment (server side)
export async function piCancelPayment(paymentId: string) {
  return piFetch<any>(`/payments/${encodeURIComponent(paymentId)}/cancel`, {
    method: "POST",
  });
}

// Backwards-compatible alias (bazı route dosyaları bunu import ediyor)
export const cancelPayment = piCancelPayment;
