"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

declare global {
  interface Window {
    Pi: any
  }
}

export default function MembershipPage() {
  const [plans, setPlans] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    loadPlans()
    getUser()

    if (window.Pi) {
      window.Pi.init({ version: "2.0" })
    }
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
    if (!window.Pi) return alert("Open in Pi Browser")

    const paymentData = {
      amount: plan.price_monthly,
      memo: `Membership ${plan.name}`,
      metadata: { plan_id: plan.id }
    }

    window.Pi.createPayment(paymentData, {
      onReadyForServerApproval: (paymentId: string) => {
        console.log("Approve:", paymentId)
      },

      onReadyForServerCompletion: async (paymentId: string, txid: string) => {
        console.log("Complete:", paymentId, txid)

        // DB kayıt
        await supabase.from("membership_payments").insert({
          user_id: user.id,
          plan_id: plan.id,
          payment_mode: "pi",
          amount: plan.price_monthly,
          currency: "PI",
          external_ref: txid,
          paid_at: new Date()
        })

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
      },

      onCancel: () => alert("Payment cancelled"),
      onError: (err: any) => console.error(err)
    })
  }

  return (
    <div className="p-10 grid grid-cols-3 gap-6">
      {plans.map(plan => (
        <div key={plan.id} className="border p-6 rounded-xl">
          <h2 className="text-xl font-bold">{plan.name}</h2>

          <p>{plan.price_monthly} PI / month</p>

          <button
            onClick={() => buy(plan)}
            className="bg-purple-600 text-white p-3 w-full mt-4 rounded-lg"
          >
            Buy with Pi
          </button>
        </div>
      ))}
    </div>
  )
}
