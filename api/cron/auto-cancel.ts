import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

function getHeader(req: any, key: string) {
  const v = req.headers?.[key];
  if (Array.isArray(v)) return v[0];
  return v;
}

function assertCronSecret(req: any) {
  const secret = process.env.CRON_SECRET;
  const got =
    getHeader(req, "x-vercel-cron-secret") ||
    getHeader(req, "x-cron-secret");

  if (!secret) throw new Error("CRON_SECRET missing");

  if (!got || got !== secret) {
    const err: any = new Error("Unauthorized");
    err.statusCode = 401;
    throw err;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== "GET" && req.method !== "POST") {
      return res.status(405).json({ ok: false, error: "Method not allowed" });
    }

    assertCronSecret(req);

    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceKey) {
      return res.status(500).json({ ok: false, error: "Supabase env missing" });
    }

    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false },
    });

    const { data, error } = await supabase.rpc("rpc_auto_cancel_expired_orders");

    if (error) throw error;

    return res.status(200).json({
      ok: true,
      job: "auto_cancel_expired_orders",
      cancelledCount: data ?? 0,
      at: new Date().toISOString(),
    });
  } catch (e: any) {
    const status = e?.statusCode ? Number(e.statusCode) : 500;
    return res.status(status).json({
      ok: false,
      error: e?.message || String(e),
      at: new Date().toISOString(),
    });
  }
}
