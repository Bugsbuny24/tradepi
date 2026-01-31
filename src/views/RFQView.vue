<template>
  <div class="page">
    <h1 class="title">RFQ HUB</h1>
    <p class="sub">Buyer → Request For Quotation</p>

    <div class="panel">
      <h2>Create RFQ</h2>

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
import { reactive } from "vue";
import { RouterLink } from "vue-router";
import { withSupabase } from "@/lib/supabase";

const form = reactive({
  product: "",
  qty: "",
  target_country: "",
  budget_min: "",
  budget_max: "",
  requirements: "",
});

async function submit() {
  if (!form.product || !form.qty) {
    alert("Product + Quantity required");
    return;
  }

  const payload = {
    listing_id: null,
    buyer_id: "00000000-0000-0000-0000-000000000000",
    quantity: form.qty,
    requirements: `${form.product} ${form.requirements}`.trim(),
    target_country: form.target_country,
    budget_min: form.budget_min || null,
    budget_max: form.budget_max || null,
    status: "open",
  };

  const { error } = await withSupabase((sb) =>
    sb.from("rfq_requests").insert(payload)
  );

  if (error) {
    alert("Demo mode: RFQ simulated ✅");
  } else {
    alert("RFQ created ✅");
  }

  Object.keys(form).forEach((k) => (form[k] = ""));
}
</script>
