import { supabase } from "@/lib/supabase"

export default async function Listings() {
  const { data } = await supabase
    .from("listings")
    .select("*")
    .eq("active", true)

  return (
    <div className="grid grid-cols-3 gap-6">
      {data?.map((item) => (
        <div key={item.id} className="border p-4 rounded">
          <h3 className="font-bold">{item.title}</h3>
          <p>{item.description}</p>
          <p>{item.base_price} PI</p>
        </div>
      ))}
    </div>
  )
}
