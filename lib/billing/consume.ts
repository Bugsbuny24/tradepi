export async function consumeCredits(admin: any, {
  userId,
  meter,
  amount,
  refType,
  refId,
  meta,
}: {
  userId: string;
  meter: string;
  amount: number;
  refType: string;
  refId?: string | null;
  meta?: any;
}) {
  const { error } = await admin.rpc("consume_credits", {
    p_user_id: userId,
    p_meter: meter,
    p_amount: amount,
    p_ref_type: refType,
    p_ref_id: refId ?? null,
    p_meta: meta ?? null,
  });
  if (error) throw new Error(error.message);
}
