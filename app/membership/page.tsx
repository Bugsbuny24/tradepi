import { supabase } from "@/lib/supabase"

export default async function Membership() {
  const { data } = await supabase
    .from("membership_plans")
    .select("*")
    .eq("is_active", true)

  return (
    <div className="grid grid-cols-3 gap-6">
      {data?.map((p) => (
        <div key={p.id} className="border p-6">
          <h3 className="text-xl font-bold">{p.name}</h3>
          <p>{p.price_monthly} PI / month</p>
          <button className="bg-black text-white p-2 mt-4 w-full">
            Buy
          </button>
        </div>
      ))}
    </div>
  )
}
