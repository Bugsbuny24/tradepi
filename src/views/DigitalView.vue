<template>
  <div class="page">
    <div class="head">
      <h1>Digital / Code Market</h1>
      <p>Digital goods listings. (No payments yet)</p>
      <div class="row">
        <input v-model="q" class="input" placeholder="Search assets…" />
        <button class="btn" @click="open=true">+ Add Asset</button>
      </div>
    </div>

    <div class="grid">
      <div v-for="a in filtered" :key="a.id" class="card">
        <div class="tag">{{ a.type }}</div>
        <h3>{{ a.title }}</h3>
        <p class="muted">by {{ a.author }}</p>
        <p class="desc">{{ a.desc }}</p>
        <div class="actions">
          <button class="btn2" @click="get(a)">Get (demo)</button>
          <button class="btnGhost" @click="fav()">★</button>
        </div>
      </div>
    </div>

    <div v-if="open" class="overlay" @click.self="open=false">
      <div class="modal">
        <h2>Add Digital Asset</h2>
        <div class="form">
          <input v-model="form.title" class="input" placeholder="Asset title" />
          <input v-model="form.author" class="input" placeholder="Author" />
          <input v-model="form.type" class="input" placeholder="Type (Template, Script, UI…)" />
          <textarea v-model="form.desc" class="input" placeholder="Description"></textarea>
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
const form = reactive({ title: "", author: "", type: "", desc: "" })

const items = ref([
  { id: 1, title: "Vue Landing Template", author: "Onur Dev", type: "Template", desc: "Fast Vite + Vue marketing page." },
  { id: 2, title: "Supabase Auth UI Kit", author: "TradePi", type: "UI", desc: "Login/signup components (demo)." },
  { id: 3, title: "Video Caption Pack", author: "SamataTV", type: "Asset", desc: "Shorts captions presets." },
])

const filtered = computed(() => {
  const s = q.value.trim().toLowerCase()
  if (!s) return items.value
  return items.value.filter(x => (x.title + " " + x.author + " " + x.type + " " + x.desc).toLowerCase().includes(s))
})

function add() {
  if (!form.title) return alert("Title required")
  items.value.unshift({ id: Date.now(), title: form.title, author: form.author || "—", type: form.type || "—", desc: form.desc || "—" })
  form.title = form.author = form.type = form.desc = ""
  open.value = false
}
function get(a) { alert(`Get: ${a.title} (demo)`) }
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
.muted{margin:0 0 10px;color:#9ca3af;font-size:13px}
.desc{margin:0 0 12px;color:#cbd5e1;font-size:13px;line-height:1.4}
.actions{display:flex;gap:10px;align-items:center}
.btn2{flex:1;padding:9px 12px;border-radius:12px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.06);color:#e5e7eb;font-weight:800}
.btnGhost{width:44px;height:38px;border-radius:12px;border:1px solid rgba(255,255,255,.14);background:transparent;color:#e5e7eb}
.overlay{position:fixed;inset:0;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;padding:14px}
.modal{width:min(520px,100%);border-radius:18px;border:1px solid rgba(56,189,248,.22);background:#020617;padding:14px}
.modal h2{margin:0 0 10px}
.form{display:grid;gap:10px;margin-bottom:12px}
@media (max-width:720px){.grid{grid-template-columns:1fr}.row{flex-direction:column;align-items:stretch}}
</style>
