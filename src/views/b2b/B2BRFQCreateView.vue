<template>
  <div class="wrap">
    <header class="bar">
      <RouterLink class="back" to="/b2b/products">← Back</RouterLink>
      <div>
        <div class="h">Create B2B RFQ</div>
        <div class="s">Request quotation (buyer flow)</div>
      </div>
    </header>

    <section class="card">
      <div class="row">
        <label>Listing</label>
        <input class="input" v-model="form.listingId" placeholder="listing uuid" />
      </div>

      <div class="grid2">
        <div class="row">
          <label>Quantity</label>
          <input class="input" v-model="form.quantity" placeholder="e.g. 1000" />
        </div>
        <div class="row">
          <label>Target Country</label>
          <input class="input" v-model="form.targetCountry" placeholder="e.g. Germany" />
        </div>
      </div>

      <div class="row">
        <label>Requirements</label>
        <textarea class="input area" v-model="form.requirements" placeholder="Specs, packaging, lead time, etc…" />
      </div>

      <div class="grid2">
        <div class="row">
          <label>Budget Min</label>
          <input class="input" v-model="form.budgetMin" placeholder="optional" />
        </div>
        <div class="row">
          <label>Budget Max</label>
          <input class="input" v-model="form.budgetMax" placeholder="optional" />
        </div>
      </div>

      <button class="btn" :disabled="submitting" @click="submit">
        {{ submitting ? "Sending…" : "Send RFQ" }}
      </button>

      <div class="note">
        ⚠️ Showroom flow: RFQ sends request; payment/shipping/escrow are not provided by platform.
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRoute } from "vue-router"
import { supabase } from "../../lib/supabase"

const route = useRoute()
const submitting = ref(false)

const form = ref({
  listingId: "",
  quantity: "",
  targetCountry: "",
  requirements: "",
  budgetMin: "",
  budgetMax: ""
})

onMounted(() => {
  // listingId query ile gelirse doldur
  const qid = route.query.listingId
  if (typeof qid === "string") form.value.listingId = qid
})

async function submit() {
  if (!form.value.listingId) return alert("listingId required")
  if (!form.value.quantity) return alert("quantity required")

  // buyer_id: auth varsa kullan, yoksa NULL bırak (RLS izinliyse)
  const { data: userRes } = await supabase.auth.getUser()
  const buyerId = userRes?.user?.id ?? null

  submitting.value = true
  const { error } = await supabase.from("rfq_requests").insert({
    listing_id: form.value.listingId,
    buyer_id: buyerId,
    quantity: Number(form.value.quantity),
    requirements: form.value.requirements,
    target_country: form.value.targetCountry,
    budget_min: form.value.budgetMin ? Number(form.value.budgetMin) : null,
    budget_max: form.value.budgetMax ? Number(form.value.budgetMax) : null,
    status: "open"
  })
  submitting.value = false

  if (error) {
    console.error(error)
    alert("RFQ error (check RLS / auth)")
    return
  }

  alert("RFQ sent ✅")
  form.value.requirements = ""
}
</script>

<style scoped>
.wrap{ min-height:100vh; padding:16px; background:#050b18; }
.bar{ display:flex; align-items:center; gap:12px; padding:12px; border:1px solid #1f2a44; border-radius:14px; background:#0b1220; }
.back{ text-decoration:none; color:#93c5fd; font-weight:700; }
.h{ font-size:16px; font-weight:900; }
.s{ font-size:12px; color:#94a3b8; }
.card{ margin-top:12px; padding:14px; border-radius:14px; border:1px solid #1f2a44; background:#0b1220; }
.row{ display:flex; flex-direction:column; gap:6px; margin-bottom:10px; }
label{ font-size:12px; color:#cbd5e1; }
.input{ padding:10px; border-radius:12px; border:1px solid #1f2a44; background:#050b18; color:#e5e7eb; }
.area{ min-height:110px; resize:vertical; }
.grid2{ display:grid; grid-template-columns:1fr 1fr; gap:10px; }
.btn{ width:100%; margin-top:6px; padding:12px; border-radius:12px; border:none; background:#2563eb; color:white; font-weight:900; }
.btn:disabled{ opacity:.6; }
.note{ margin-top:12px; color:#fbbf24; font-size:12px; border:1px dashed #fbbf24; padding:10px; border-radius:12px; }
</style>
