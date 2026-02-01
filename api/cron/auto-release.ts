import { createClient } from "@supabase/supabase-js";

function assertCronSecret(req: any) {
  const secret = process.env.CRON_SECRET;
  const got = req.headers["x-cron-secret"] || req.query?.secret;
  if (!secret) throw new Error("CRON_SECRET missing");
  if (got !== secret) {
    const err: any = new Error("Unauthorized");
    err.statusCode = 401;
    throw err;
  }
}

export default async function handler(req: any, res: any) {
  try {
    assertCronSecret(req);

    const supabaseUrl = process.env.SUPABASE_URL!;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    if (!supabaseUrl || !serviceKey) throw new Error("Supabase env missing");

    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false },
    });

    const minTrust = Number(req.query?.minTrust ?? 60);

    const { data, error } = await supabase.rpc("rpc_auto_release_due_orders", {
      p_min_trust: minTrust,
    });

    if (error) throw error;

    res.status(200).json({
      ok: true,
      job: "auto_release_due_orders",
      minTrust,
      releasedCount: data ?? 0,
    });
  } catch (e: any) {
    res.status(e.statusCode || 500).json({
      ok: false,
      error: e.message || String(e),
    });
  }
}
