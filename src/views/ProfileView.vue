<template>
  <div class="page">
    <h1 class="title">PROFILE</h1>
    <p class="sub">Login / account — (auth MVP).</p>

    <div v-if="!isSupabaseConfigured" class="notice">
      <strong>Demo mode:</strong> Supabase auth aktif değil. Burayı sonra gerçek auth'a bağlarız.
    </div>

    <div class="panel">
      <h2 class="h2">Quick actions</h2>
      <div class="row">
        <RouterLink class="btn" to="/b2b">Go B2B Showroom</RouterLink>
        <RouterLink class="btn2" to="/">Back Home</RouterLink>
      </div>

      <div class="divider"></div>

      <h2 class="h2">Auth status</h2>
      <p class="muted">
        {{ isSupabaseConfigured ? "Supabase configured ✅" : "Supabase not configured ❌" }}
      </p>
      <p class="muted">Şimdilik: buyer_id / seller_id TEMP. Bir sonraki adımda Pi Browser + Supabase auth bağlarız.</p>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from "vue-router"
import { isSupabaseConfigured } from "@/lib/supabase"
</script>

<style scoped>
.page{ padding:16px 4px 40px; min-height:calc(100vh - 90px); }
.title{ margin:0 0 6px; font-size:28px; }
.sub{ margin:0 0 18px; color:#94a3b8; }
.h2{ margin:0 0 12px; font-size:18px; }
.panel{ border:1px solid rgba(56,189,248,.2); border-radius:16px; padding:16px; background:rgba(2,6,23,.45); }
.notice{ border:1px solid rgba(250,204,21,.35); background:rgba(250,204,21,.08); padding:12px 14px; border-radius:14px; color:#f8fafc; margin: 12px 0 18px; }
.row{ display:flex; gap:10px; flex-wrap:wrap; }
.btn,.btn2{ text-decoration:none; padding:10px 14px; border-radius:12px; }
.btn{ background:linear-gradient(90deg,#2563eb,#38bdf8); color:white; }
.btn2{ border:1px solid rgba(255,255,255,.14); color:#e2e8f0; }
.divider{ height:1px; background:rgba(56,189,248,.18); margin:16px 0; }
.muted{ color:#cbd5e1; margin:0 0 8px; }
</style>
