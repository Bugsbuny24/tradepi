<template>
  <div class="wrap">
    <header class="bar">
      <RouterLink class="back" to="/">←</RouterLink>
      <div>
        <div class="h">B2B Products</div>
        <div class="s">Showroom list (MOQ + country + media)</div>
      </div>
      <RouterLink class="pill" to="/b2b/rfq/create">Create RFQ</RouterLink>
    </header>

    <div class="filters">
      <input v-model="q" class="input" placeholder="Search title…" />
      <select v-model="country" class="input">
        <option value="">All countries</option>
        <option v-for="c in countries" :key="c" :value="c">{{ c }}</option>
      </select>
    </div>

    <div v-if="loading" class="state">Loading…</div>
    <div v-else-if="items.length === 0" class="state">No B2B listings yet.</div>

    <section class="grid">
      <article v-for="it in filtered" :key="it.id" class="card">
        <img class="img" :src="it.img || fallback" />
        <div class="t">{{ it.title }}</div>
        <div class="meta">
          <span>🌍 {{ it.country || "—" }}</span>
          <span>📦 MOQ: {{ it.moq ?? "—" }}</span>
        </div>

        <div class="row">
          <RouterLink class="btn ghost" :to="`/b2b/products/${it.id}`">Details</RouterLink>
          <RouterLink class="btn" :to="`/b2b/rfq/create?listingId=${it.id}`">Send RFQ</RouterLink>
        </div>
      </article>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import { supabase } from "../../lib/supabase"

const loading = ref(false)
const items = ref([])
const q = ref("")
const country = ref("")
const fallback = "https://via.placeholder.com/640x360?text=B2B+Listing"

onMounted(load)

async function load() {
  loading.value = true
  const { data, error } = await supabase
    .from("listings")
    .select(`
      id, title, active, listing_type,
      b2b_details(moq,country_of_origin),
      listing_media(url,sort_order)
    `)
    .eq("listing_type", "b2b")
    .eq("active", true)

  loading.value = false
  if (error) {
    console.error(error)
    return
  }

  items.value = (data || []).map(l => ({
    id: l.id,
    title: l.title,
    moq: l.b2b_details?.moq ?? null,
    country: l.b2b_details?.country_of_origin ?? null,
    img: (l.listing_media || []).sort((a,b)=>(a.sort_order??0)-(b.sort_order??0))[0]?.url
  }))
}

const countries = computed(() => {
  const set = new Set(items.value.map(i => i.country).filter(Boolean))
  return Array.from(set).sort()
})

const filtered = computed(() => {
  const s = q.value.trim().toLowerCase()
  return items.value.filter(i => {
    const okTitle = !s || i.title?.toLowerCase().includes(s)
    const okCountry = !country.value || i.country === country.value
    return okTitle && okCountry
  })
})
</script>

<style scoped>
.wrap{ min-height:100vh; padding:16px; background:#050b18; }
.bar{ display:flex; align-items:center; gap:12px; padding:12px; border:1px solid #1f2a44; border-radius:14px; background:#0b1220; }
.back{ text-decoration:none; color:#93c5fd; font-weight:700; }
.h{ font-size:18px; font-weight:800; }
.s{ font-size:12px; color:#94a3b8; }
.pill{ margin-left:auto; text-decoration:none; padding:8px 12px; border-radius:10px; background:#2563eb; color:white; font-weight:700; font-size:13px; }
.filters{ display:flex; gap:10px; margin:12px 0; }
.input{ flex:1; padding:10px; border-radius:12px; border:1px solid #1f2a44; background:#0b1220; color:#e5e7eb; }
.grid{ display:grid; grid-template-columns:repeat(auto-fit,minmax(240px,1fr)); gap:12px; }
.card{ border:1px solid #1f2a44; border-radius:14px; background:#0b1220; padding:12px; }
.img{ width:100%; height:150px; object-fit:cover; border-radius:10px; border:1px solid #0f172a; }
.t{ margin-top:10px; font-weight:800; }
.meta{ margin-top:6px; display:flex; justify-content:space-between; color:#94a3b8; font-size:12px; }
.row{ margin-top:10px; display:flex; gap:10px; }
.btn{ flex:1; text-align:center; text-decoration:none; padding:10px; border-radius:12px; background:#2563eb; color:white; font-weight:700; }
.ghost{ background:transparent; border:1px solid #334155; color:#93c5fd; }
.state{ padding:16px; color:#94a3b8; }
</style>
