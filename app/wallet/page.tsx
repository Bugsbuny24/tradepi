import { supabase } from "@/lib/supabase"

export default async function Wallet() {
  const { data: user } = await supabase.auth.getUser()

  const { data } = await supabase
    .from("credits_wallet")
    .select("*")
    .eq("user_id", user.user?.id)
    .single()

  return (
    <div>
      <h2 className="text-2xl font-bold">
        Balance: {data?.balance} Credits
      </h2>
    </div>
  )
}
