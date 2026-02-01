// supabase/functions/upload-complete/index.ts
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const BUCKET = "digital-assets";

function json(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

serve(async (req) => {
  try {
    if (req.method !== "POST") return json(405, { error: "POST only" });

    const authHeader = req.headers.get("Authorization") || "";
    if (!authHeader.startsWith("Bearer ")) return json(401, { error: "missing bearer token" });
    const jwt = authHeader.slice("Bearer ".length);

    const body = await req.json().catch(() => null);
    const listingId = body?.listing_id;
    const path = body?.path;

    if (!listingId || !path) return json(400, { error: "listing_id and path required" });

    // JWT doğrula
    const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: `Bearer ${jwt}` } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData?.user) return json(401, { error: "invalid token" });
    const uid = userData.user.id;

    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // listing owner kontrol
    const { data: listing, error: lErr } = await admin
      .from("listings")
      .select("id, owner_id, listing_type")
      .eq("id", listingId)
      .maybeSingle();

    if (lErr) return json(500, { error: "listing_query_failed", details: lErr.message });
    if (!listing) return json(404, { error: "listing_not_found" });
    if (listing.owner_id !== uid) return json(403, { error: "not_listing_owner" });
    if (listing.listing_type !== "digital") return json(400, { error: "not_digital_listing" });

    // digital_details upsert
    const { error: upErr } = await admin
      .from("digital_details")
      .upsert(
        { listing_id: listingId, storage_bucket: BUCKET, storage_path: path },
        { onConflict: "listing_id" }
      );

    if (upErr) return json(500, { error: "upsert_failed", details: upErr.message });

    return json(200, { ok: true, listing_id: listingId, bucket: BUCKET, path });
  } catch (e) {
    return json(500, { error: "unexpected", details: String(e) });
  }
});
