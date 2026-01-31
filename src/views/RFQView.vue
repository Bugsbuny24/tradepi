<template>
  <div class="page">
    <h1 class="title">RFQ HUB</h1>
    <p class="sub">Buyer → Request For Quotation. Satıcılar teklif verir.</p>

    <div v-if="!isSupabaseConfigured" class="notice">
      <strong>Demo mode:</strong> RFQ formu çalışır ama kayıt demo olarak kabul edilir.
    </div>

    <div class="panel">
      <h2 class="h2">Create RFQ</h2>
      <div class="grid">
        <input v-model="form.product" placeholder="Product / Need" />
        <input v-model="form.qty" placeholder="Quantity" />
        <input v-model="form.target_country" placeholder="Target country" />
        <input v-model="form.budget_min" placeholder="Budget min" />
        <input v-model="form.budget_max" placeholder="Budget max" />
        <textarea v-model="form.requirements" placeholder="Requirements" />
      </div>
      <div class="row">
        <button class="btn" @click="submit">Submit RFQ</button>
        <RouterLink class="btn2" to="/b2b">Back to B2B</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue"
import { RouterLink } from "vue-router"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"

const form = reactive({
  product: "",
  qty: "",
  target_country: "",
  budget_min: "",
  budget_max: "",
  requirements: "",
})

async function submit() {
  if (!form.product || !form.qty) {
    alert("Product + Quantity required")
    return
  }

  if (!isSupabaseConfigured) {
    alert("RFQ saved (demo) 🚀")
    Object.keys(form).forEach((k) => (form[k] = ""))
    return
  }

  const { error } = await supabase.from("rfq_requests").insert({
    listing_id: null,
    buyer_id: "00000000-0000-0000-0000-000000000000", // TEMP until auth
    quantity: form.qty,
    requirements: `[${form.product}] ${form.requirements}`.trim(),
    target_country: form.target_country,
    budget_min: form.budget_min,
    budget_max: form.budget_max,
    status: "open",
  })

  if (error) {
    console.log(error)
    alert("Failed to submit")
    return
  }

  alert("RFQ submitted 🚀")
  Object.keys(form).forEach((k) => (form[k] = ""))
}
</script>

<style scoped>
.page{ padding:16px 4px 40px; min-height:calc(100vh - 90px); }
.title{ margin:0 0 6px; font-size:28px; }
.sub{ margin:0 0 18px; color:#94a3b8; }
.h2{ margin:0 0 12px; font-size:18px; }
.panel{ border:1px solid rgba(56,189,248,.2); border-radius:16px; padding:16px; background:rgba(2,6,23,.45); }
.notice{ border:1px solid rgba(250,204,21,.35); background:rgba(250,204,21,.08); padding:12px 14px; border-radius:14px; color:#f8fafc; margin: 12px 0 18px; }

.grid{ display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:10px; margin: 10px 0 14px; }
input, textarea{
  padding:10px;
  border-radius:12px;
  border:1px solid rgba(255,255,255,.08);
  background:rgba(2,6,23,.7);
  color:white;
  outline:none;
}
textarea{ min-height:90px; grid-column:1 / -1; }
.row{ display:flex; gap:10px; flex-wrap:wrap; }
.btn{ background:linear-gradient(90deg,#2563eb,#38bdf8); color:white; border:none; padding:10px 14px; border-radius:12px; cursor:pointer; }
.btn2{ text-decoration:none; border:1px solid rgba(255,255,255,.14); color:#e2e8f0; padding:10px 14px; border-radius:12px; }
</style>
