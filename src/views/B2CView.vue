<template>
  <div class="page">
    <div class="head">
      <h1>B2C Market</h1>
      <p>Retail product cards. (No checkout yet)</p>
      <div class="row">
        <input v-model="q" class="input" placeholder="Search products…" />
        <button class="btn" @click="open=true">+ Add Product</button>
      </div>
    </div>

    <div class="grid">
      <div v-for="p in filtered" :key="p.id" class="card">
        <div class="tag">{{ p.category }}</div>
        <h3>{{ p.title }}</h3>
        <p class="muted">{{ p.brand }}</p>
        <p class="price">₽ {{ p.price }}</p>
        <div class="actions">
          <button class="btn2" @click="buy(p)">Buy (demo)</button>
          <button class="btnGhost" @click="fav()">★</button>
        </div>
      </div>
    </div>

    <div v-if="open" class="overlay" @click.self="open=false">
      <div class="modal">
        <h2>Add B2C Product</h2>
        <div class="form">
          <input v-model="form.title" class="input" placeholder="Product title" />
          <input v-model="form.brand" class="input" placeholder="Brand" />
          <input v-model="form.category" class="input" placeholder="Category" />
          <input v-model="form.price" class="input" placeholder="Price" />
        </div>
        <div class="row">
          <button class="btn" @click="add">Save</button>
          <button class="btnGhost" @click="open=false">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from "vue"

const q = ref("")
const open = ref(false)
const form = reactive({ title: "", brand: "", category: "", price: "" })

const items = ref([
  { id: 1, title: "Sourdough Bread", brand: "Kıtırköy", category: "Food", price: 120 },
  { id: 2, title: "Mint Minimal Hoodie", brand: "AbsürdWear", category: "Apparel", price: 890 },
  { id: 3, title: "Sport Gloves", brand: "DemirPro", category: "Sports", price: 490 },
  { id: 4, title: "3D Acoustic Pack", brand: "3DAkusti", category: "Digital", price: 250 },
])

const filtered = computed(() => {
  const s = q.value.trim().toLowerCase()
  if (!s) return items.value
  return items.value.filter(x => (x.title + " " + x.brand + " " + x.category).toLowerCase().includes(s))
})

function add() {
  if (!form.title) return alert("Title required")
  items.value.unshift({
    id: Date.now(),
    title: form.title,
    brand: form.brand || "—",
    category: form.category || "—",
    price: Number(form.price || 0),
  })
  form.title = form.brand = form.category = form.price = ""
  open.value = false
}

function buy(p) { alert(`Buy: ${p.title} (demo)`) }
function fav() { alert("Saved (demo) ⭐") }
</script>

<style scoped>
.page{min-height:100vh;padding:18px;background:#030712;color:#e5e7eb}
.head{max-width:980px;margin:0 auto 16px}
.head h1{margin:0 0 6px;font-size:26px}
.head p{margin:0 0 12px;color:#9ca3af}
.row{display:flex;gap:10px;align-items:center}
.input{flex:1;padding:10px 12px;border-radius:12px;border:1px solid rgba(255,255,255,.14);background:rgba(2,6,23,.65);color:#e5e7eb}
.btn{padding:10px 14px;border-radius:12px;border:0;font-weight:900;background:linear-gradient(90deg,#facc15,#f59e0b);color:#111827}
.grid{max-width:980px;margin:14px auto 0;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}
.card{padding:14px;border-radius:18px;border:1px solid rgba(56,189,248,.18);background:rgba(2,6,23,.55);box-shadow:0 12px 40px rgba(0,0,0,.35)}
.tag{display:inline-block;padding:4px 8px;border-radius:999px;border:1px solid rgba(255,255,255,.14);color:#38bdf8;font-size:12px;margin-bottom:8px}
.card h3{margin:0 0 4px}
.muted{margin:0 0 8px;color:#9ca3af;font-size:13px}
.price{margin:0 0 12px;font-weight:900;color:#facc15}
.actions{display:flex;gap:10px;align-items:center}
.btn2{flex:1;padding:9px 12px;border-radius:12px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.06);color:#e5e7eb;font-weight:800}
.btnGhost{width:44px;height:38px;border-radius:12px;border:1px solid rgba(255,255,255,.14);background:transparent;color:#e5e7eb}
.overlay{position:fixed;inset:0;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;padding:14px}
.modal{width:min(520px,100%);border-radius:18px;border:1px solid rgba(56,189,248,.22);background:#020617;padding:14px}
.modal h2{margin:0 0 10px}
.form{display:grid;gap:10px;margin-bottom:12px}
@media (max-width:720px){.grid{grid-template-columns:1fr}.row{flex-direction:column;align-items:stretch}}
</style>
