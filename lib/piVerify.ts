import { PI_API_KEY, PI_PLATFORM_API } from "./piConfig";

export async function piGetPayment(paymentId: string) {
  const res = await fetch(`${PI_PLATFORM_API}/v2/payments/${paymentId}`, {
    headers: { Authorization: `Key ${PI_API_KEY}` },
    cache: "no-store",
  });

  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Pi payment fetch failed: ${res.status} ${t}`);
  }
  return res.json();
}
