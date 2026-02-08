import { consumeCredits } from "@/lib/billing/consume";
import { createAdminClient } from "@/lib/supabase/admin"; // sende neyse

// ... token çöz, chart bul, owner_id bulduktan sonra:

const admin = createAdminClient();

// 1 view = 1 kredi
await consumeCredits(admin, {
  userId: ownerId, // chart sahibi
  meter: "embed_view_remaining",
  amount: 1,
  refType: "embed_view",
  refId: chartId,
  meta: { token_prefix, mode: "normal" },
});
