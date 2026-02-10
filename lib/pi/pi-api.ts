import "server-only";

/**
 * Pi Platform Server API helpers.
 *
 * Env:
 *  - PI_API_KEY: your Pi Platform API key (App > API Key)
 *  - PI_API_BASE (optional): defaults to https://api.minepi.com
 */
const PI_API_BASE = process.env.PI_API_BASE || "https://api.minepi.com";
const PI_API_KEY = process.env.PI_API_KEY || "";

// --- Types (minimal, enough for our flow) ---
export type PiPaymentDTO = {
  identifier: string;
  user_uid?: string;
  amount?: number;
  memo?: string;
  metadata?: any;
  to_address?: string;
  from_address?: string;
  created_at?: string;
  status?: any;
  transaction?: any;
};

// Accept "body: any" but keep the rest of RequestInit strict.
type PiRequestInit = Omit<RequestInit, "body"> & { body?: any };

function isBodyInit(v: any): v is BodyInit {
  return (
    typeof v === "string" ||
    (typeof Blob !== "undefined" && v instanceof Blob) ||
    (typeof ArrayBuffer !== "undefined" && v instanceof ArrayBuffer) ||
    (typeof FormData !== "undefined" && v instanceof FormData) ||
    (typeof URLSearchParams !== "undefined" && v instanceof URLSearchParams) ||
    (typeof ReadableStream !== "undefined" && v instanceof ReadableStream)
  );
}

async function piFetch<T>(path: string, init: PiRequestInit = {}): Promise<T> {
  if (!PI_API_KEY) throw new Error("PI_API_KEY missing");

  const url = `${PI_API_BASE}/v2${path}`;

  const headers = new Headers(init.headers || {});
  headers.set("Authorization", `Key ${PI_API_KEY}`);

  let body: BodyInit | undefined = undefined;

  if (init.body !== undefined && init.body !== null) {
    if (isBodyInit(init.body)) {
      body = init.body;
    } else {
      // assume JSON
      headers.set("Content-Type", headers.get("Content-Type") || "application/json");
      body = JSON.stringify(init.body);
    }
  }

  const res = await fetch(url, {
    ...init,
    headers,
    body,
  });

  const text = await res.text();
  let json: any = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = text;
  }

  if (!res.ok) {
    const msg =
      (json && (json.error || json.message)) ||
      `Pi API error (${res.status})`;
    throw new Error(msg);
  }

  return json as T;
}

/**
 * Approve payment so user can open wallet and proceed.
 * POST /v2/payments/{paymentId}/approve
 */
export async function piApprovePayment(paymentId: string) {
  return piFetch<PiPaymentDTO>(`/payments/${encodeURIComponent(paymentId)}/approve`, {
    method: "POST",
  });
}

/**
 * Complete payment after user signs and we get txid.
 * POST /v2/payments/{paymentId}/complete
 */
export async function piCompletePayment(paymentId: string, txid: string) {
  return piFetch<PiPaymentDTO>(`/payments/${encodeURIComponent(paymentId)}/complete`, {
    method: "POST",
    body: { txid },
  });
}

/**
 * Cancel payment.
 * POST /v2/payments/{paymentId}/cancel
 */
export async function piCancelPayment(paymentId: string) {
  return piFetch<any>(`/payments/${encodeURIComponent(paymentId)}/cancel`, {
    method: "POST",
  });
}

// Backwards-compatible alias (route import'un patlamasın diye)
export const cancelPayment = piCancelPayment;
