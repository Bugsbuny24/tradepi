import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

function getIp(req: Request) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("cf-connecting-ip") ??
    null
  );
}

Deno.serve(async (req) => {
  try {
    const auth = req.headers.get("authorization") ?? "";
    if (!auth.startsWith("Bearer ")) {
      return Response.json({ error: "no_jwt" }, { status: 401 });
    }

    const supabase = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: auth } }, // user context => auth.uid() dolu
    });

    const body = await req.json().catch(() => ({}));
    const policy_ids: string[] = Array.isArray(body.policy_ids) ? body.policy_ids : [];
    if (policy_ids.length === 0) {
      return Response.json({ error: "policy_ids_required" }, { status: 400 });
    }

    const ip = getIp(req);
    const ua = req.headers.get("user-agent") ?? null;

    const { data, error } = await supabase.rpc("rpc_accept_policies", {
      p_document_ids: policy_ids,
      p_ip: ip,
      p_user_agent: ua,
      p_source: body.source ?? "app",
    });

    if (error) return Response.json({ error: error.message }, { status: 400 });

    return Response.json({ ok: true, inserted_count: data });
  } catch (e) {
    return Response.json({ error: "server_error", details: String(e) }, { status: 500 });
  }
});
