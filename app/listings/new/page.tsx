"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"

export default function NewListing() {
  const [title, setTitle] = useState("")
  const [price, setPrice] = useState("")

  const create = async () => {
    const { data: user } = await supabase.auth.getUser()

    await supabase.from("listings").insert({
      title,
      base_price: price,
      owner_id: user.user?.id,
      listing_type: "b2b",
    })
  }

  return (
    <div className="space-y-4 max-w-md">
      <input
        placeholder="Title"
        className="border p-2 w-full"
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        placeholder="Price"
        className="border p-2 w-full"
        onChange={(e) => setPrice(e.target.value)}
      />

      <button
        onClick={create}
        className="bg-black text-white p-2 w-full"
      >
        Create
      </button>
    </div>
  )
}
