export async function consumeCredits(
  admin: any,
  {
    userId,
    meter,
    units,
    refType,
    refId,
    meta,
  }: {
    userId: string;
    meter: string;
    units: number;
    refType: string;
    refId?: string | null;
    meta?: any;
  }
) {
  const { error } = await admin.rpc("consume_credits", {
    p_user_id: userId,
    p_meter: meter,
    p_units: units,
    p_ref_type: refType,
    p_ref_id: refId ?? null,
    p_meta: meta ?? null,
  });

  if (error) throw new Error(error.message);
}
