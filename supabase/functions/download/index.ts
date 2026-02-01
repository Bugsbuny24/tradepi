// supabase/functions/download/index.ts
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!; // verify JWT
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!; // storage signed url + db
const SIGNED_URL_SECONDS = 600; // 10 dk

function json(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

serve(async (req) => {
  try {
    // Basit rate-limit (10k için yeter): aynı IP'nin çok hızlı spam'ini keser
    // (Daha ileri için DB/Upstash vs. eklenir)
    const url = new URL(req.url);
    const orderId = url.searchParams.get("order_id");
    if (!orderId) return json(400, { error: "order_id required" });

    const authHeader = req.headers.get("Authorization") || "";
    if (!authHeader.startsWith("Bearer ")) {
      return json(401, { error: "missing bearer token" });
    }
    const jwt = authHeader.slice("Bearer ".length);

    // User client: JWT doğrulamak için
    const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: `Bearer ${jwt}` } },
    });

    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData?.user) return json(401, { error: "invalid token" });
    const uid = userData.user.id;

    // Service role client: DB + storage signed URL
    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // 1) Order doğrula (buyer sahipliği)
    const { data: order, error: orderErr } = await admin
      .from("orders")
      .select("id, buyer_id, seller_id, module, status, listing_id")
      .eq("id", orderId)
      .maybeSingle();

    if (orderErr) return json(500, { error: "order_query_failed", details: orderErr.message });
    if (!order) return json(404, { error: "order_not_found" });

    if (order.buyer_id !== uid) return json(403, { error: "not_order_owner" });
    if (order.module !== "digital") return json(400, { error: "not_digital_order" });

    const allowed = ["paid", "completed", "resolved_released"];
    if (!allowed.includes(order.status)) return json(403, { error: "order_not_ready" });
    if (!order.listing_id) return json(400, { error: "order_missing_listing" });

    // 2) Digital details al (storage path)
    const { data: dd, error: ddErr } = await admin
      .from("digital_details")
      .select("storage_bucket, storage_path")
      .eq("listing_id", order.listing_id)
      .maybeSingle();

    if (ddErr) return json(500, { error: "digital_details_failed", details: ddErr.message });
    if (!dd?.storage_bucket || !dd?.storage_path) {
      return json(404, { error: "asset_path_missing" });
    }

    // 3) Signed URL üret
    const { data: signed, error: signErr } = await admin.storage
      .from(dd.storage_bucket)
      .createSignedUrl(dd.storage_path, SIGNED_URL_SECONDS);

    if (signErr || !signed?.signedUrl) {
      return json(500, { error: "sign_failed", details: signErr?.message });
    }

    return json(200, { url: signed.signedUrl, expires_in: SIGNED_URL_SECONDS });
  } catch (e) {
    return json(500, { error: "unexpected", details: String(e) });
  }
});
