<template>
  <div class="wrap">
    <header class="bar">
      <RouterLink class="back" to="/b2b/products">← Back</RouterLink>
      <div class="h">B2B Product Detail</div>
      <RouterLink class="pill" :to="`/b2b/rfq/create?listingId=${id}`">Send RFQ</RouterLink>
    </header>

    <div v-if="loading" class="state">Loading…</div>
    <div v-else-if="!item" class="state">Not found.</div>

    <section v-else class="card">
      <img class="img" :src="item.img || fallback" />
      <h1 class="title">{{ item.title }}</h1>

      <div class="chips">
        <span class="chip">🌍 {{ item.country || "—" }}</span>
        <span class="chip">📦 MOQ: {{ item.moq ?? "—" }}</span>
      </div>

      <p class="desc">{{ item.description || "No description yet." }}</p>

      <div class="note">
        ⚠️ Showroom only. Platform does not provide shipping, escrow, or custody.
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRoute } from "vue-router"
import { supabase } from "../../lib/supabase"

const route = useRoute()
const id = route.params.id

const loading = ref(false)
const item = ref(null)
const fallback = "https://via.placeholder.com/960x540?text=B2B+Detail"

onMounted(load)

async function load(){
  loading.value = true
  const { data, error } = await supabase
    .from("listings")
    .select(`
      id, title, description,
      b2b_details(moq,country_of_origin),
      listing_media(url,sort_order)
    `)
    .eq("id", id)
    .single()

  loading.value = false
  if (error) {
    console.error(error)
    return
  }

  item.value = {
    id: data.id,
    title: data.title,
    description: data.description,
    moq: data.b2b_details?.moq ?? null,
    country: data.b2b_details?.country_of_origin ?? null,
    img: (data.listing_media || []).sort((a,b)=>(a.sort_order??0)-(b.sort_order??0))[0]?.url
  }
}
</script>

<style scoped>
.wrap{ min-height:100vh; padding:16px; background:#050b18; }
.bar{ display:flex; align-items:center; gap:12px; padding:12px; border:1px solid #1f2a44; border-radius:14px; background:#0b1220; }
.back{ text-decoration:none; color:#93c5fd; font-weight:700; }
.h{ font-weight:900; }
.pill{ margin-left:auto; text-decoration:none; padding:8px 12px; border-radius:10px; background:#2563eb; color:white; font-weight:800; font-size:13px; }
.card{ margin-top:12px; padding:14px; border-radius:14px; border:1px solid #1f2a44; background:#0b1220; }
.img{ width:100%; height:280px; object-fit:cover; border-radius:12px; border:1px solid #0f172a; }
.title{ margin:12px 0 6px; }
.chips{ display:flex; gap:8px; flex-wrap:wrap; }
.chip{ font-size:12px; color:#cbd5e1; border:1px solid #334155; padding:6px 10px; border-radius:999px; background:#0a1020; }
.desc{ color:#94a3b8; line-height:1.5; }
.note{ margin-top:12px; color:#fbbf24; font-size:12px; border:1px dashed #fbbf24; padding:10px; border-radius:12px; }
.state{ padding:16px; color:#94a3b8; }
</style>
