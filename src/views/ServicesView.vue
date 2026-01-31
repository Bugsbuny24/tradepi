<template>
  <div class="page">
    <h1 class="title">GIG / SERVICES</h1>
    <p class="sub">Fiverr tarzı hizmetler + creator market giriş kapısı.</p>

    <div class="panel">
      <ul class="list">
        <li>Hizmet ilanı oluştur (seller)</li>
        <li>Teklif iste (buyer)</li>
        <li>Mesajlaşma + teslim linkleri</li>
      </ul>
      <div class="row">
        <RouterLink class="btn" to="/profile">Login/Profile</RouterLink>
        <RouterLink class="btn2" to="/digital">Go Digital</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from "vue-router"
</script>

<style scoped>
.page{ padding:16px 4px 40px; min-height:calc(100vh - 90px); }
.title{ margin:0 0 6px; font-size:28px; }
.sub{ margin:0 0 18px; color:#94a3b8; }
.panel{ border:1px solid rgba(56,189,248,.2); border-radius:16px; padding:16px; background:rgba(2,6,23,.45); }
.list{ margin:0 0 16px; color:#cbd5e1; }
.row{ display:flex; gap:10px; flex-wrap:wrap; }
.btn,.btn2{ text-decoration:none; padding:10px 14px; border-radius:12px; }
.btn{ background:linear-gradient(90deg,#2563eb,#38bdf8); color:white; }
.btn2{ border:1px solid rgba(255,255,255,.14); color:#e2e8f0; }
</style>
