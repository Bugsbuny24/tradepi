const PI_PLATFORM_API_BASE = process.env.PI_PLATFORM_API_BASE || "https://api.minepi.com/v2";
const PI_API_KEY = process.env.PI_API_KEY;

if (!PI_API_KEY) {
  console.warn("PI_API_KEY is not set. Pi server calls will fail.");
}

type PiApiError = {
  error?: string;
  message?: string;
};

async function piFetch<T = any>(
  path: string,
  init?: RequestInit & { body?: any }
): Promise<T> {
  const url = `${PI_PLATFORM_API_BASE}${path}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    // Pi Platform expects: Authorization: Key <API_KEY>
    Authorization: `Key ${PI_API_KEY || ""}`,
    ...(init?.headers as any),
  };

  const body =
    init?.body && typeof init.body === "object" ? JSON.stringify(init.body) : init?.body;

  const res = await fetch(url, {
    ...init,
    headers,
    body,
  });

  const json = (await res.json().catch(() => ({}))) as any;

  if (!res.ok) {
    const err = json as PiApiError;
    throw new Error(err?.error || err?.message || `Pi API error: ${res.status}`);
  }

  return json as T;
}

export async function piApprovePayment(paymentId: string) {
  // POST /v2/payments/{paymentId}/approve
  return piFetch(`/payments/${encodeURIComponent(paymentId)}/approve`, { method: "POST" });
}

export async function piCompletePayment(paymentId: string, txid: string) {
  // POST /v2/payments/{paymentId}/complete
  return piFetch(`/payments/${encodeURIComponent(paymentId)}/complete`, {
    method: "POST",
    body: { txid },
  });
}

export async function piCancelPayment(paymentId: string) {
  // POST /v2/payments/{paymentId}/cancel
  return piFetch(`/payments/${encodeURIComponent(paymentId)}/cancel`, { method: "POST" });
}

// Alias (some routes may import this name)
export const cancelPayment = piCancelPayment;
