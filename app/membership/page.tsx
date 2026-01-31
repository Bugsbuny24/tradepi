"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function MembershipPage() {
  const [plans, setPlans] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    loadPlans()
    getUser()
  }, [])

  async function getUser() {
    const { data } = await supabase.auth.getUser()
    setUser(data.user)
  }

  async function loadPlans() {
    const { data } = await supabase
      .from("membership_plans")
      .select("*")
      .eq("is_active", true)

    setPlans(data || [])
  }

  async function buy(plan: any) {
    if (!user) return alert("Login required")

    // 1️⃣ payment record
    await supabase.from("membership_payments").insert({
      user_id: user.id,
      plan_id: plan.id,
      payment_mode: "pi",
      amount: plan.price_monthly,
      currency: "PI"
    })

    // 2️⃣ subscription başlat
    const expire = new Date()
    expire.setMonth(expire.getMonth() + 1)

    await supabase.from("user_subscriptions").insert({
      user_id: user.id,
      plan_id: plan.id,
      status: "active",
      started_at: new Date(),
      expires_at: expire,
      payment_mode: "pi"
    })

    alert("Membership activated 🚀")
  }

  return (
    <div className="p-10 grid grid-cols-3 gap-6">
      {plans.map(plan => (
        <div key={plan.id} className="border p-6 rounded-xl">
          <h2 className="text-xl font-bold">{plan.name}</h2>

          <p className="my-3">
            {plan.price_monthly} PI / month
          </p>

          <button
            onClick={() => buy(plan)}
            className="bg-black text-white w-full p-3 rounded-lg"
          >
            Buy with Pi
          </button>
        </div>
      ))}
    </div>
  )
}
