// supabase/functions/upload-url/index.ts
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

function sanitizeFilename(name: string) {
  // basit temizlik: path traversal vs. engelle
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

serve(async (req) => {
  try {
    const url = new URL(req.url);
    const listingId = url.searchParams.get("listing_id");
    const filenameRaw = url.searchParams.get("filename");

    if (!listingId || !filenameRaw) {
      return json(400, { error: "listing_id and filename required" });
    }

    const filename = sanitizeFilename(filenameRaw);

    const authHeader = req.headers.get("Authorization") || "";
    if (!authHeader.startsWith("Bearer ")) return json(401, { error: "missing bearer token" });
    const jwt = authHeader.slice("Bearer ".length);

    // JWT doğrula
    const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: `Bearer ${jwt}` } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData?.user) return json(401, { error: "invalid token" });
    const uid = userData.user.id;

    // Service role ile listing owner kontrolü + signed upload URL
    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { data: listing, error: lErr } = await admin
      .from("listings")
      .select("id, owner_id, listing_type")
      .eq("id", listingId)
      .maybeSingle();

    if (lErr) return json(500, { error: "listing_query_failed", details: lErr.message });
    if (!listing) return json(404, { error: "listing_not_found" });
    if (listing.owner_id !== uid) return json(403, { error: "not_listing_owner" });
    if (listing.listing_type !== "digital") return json(400, { error: "not_digital_listing" });

    const path = `listing/${listingId}/v1/${filename}`;

    // createSignedUploadUrl: signedUrl + token döndürür. 3
    const { data, error } = await admin.storage.from(BUCKET).createSignedUploadUrl(path);

    if (error || !data) return json(500, { error: "create_signed_upload_failed", details: error?.message });

    return json(200, {
      bucket: BUCKET,
      path,
      signedUrl: data.signedUrl,
      token: data.token,
      note: "Upload için supabase.storage.from(bucket).uploadToSignedUrl(path, token, file) kullan.",
    });
  } catch (e) {
    return json(500, { error: "unexpected", details: String(e) });
  }
});
