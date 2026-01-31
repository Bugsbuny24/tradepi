<template>
  <div class="page">
    <h1 class="title">HOW IT WORKS</h1>
    <p class="sub">TradePiGloball = showroom + connection. No escrow, no commission, no custody.</p>

    <div class="panel">
      <ol class="list">
        <li><strong>Explore:</strong> Ürün / hizmet / dijital listelemeleri gör.</li>
        <li><strong>Connect:</strong> RFQ veya mesajlaşma ile satıcıyla direkt iletişim kur.</li>
        <li><strong>Deal:</strong> Ödeme/teslimat/kontrat satıcı–alıcı arasında.</li>
      </ol>

      <div class="note">
        <strong>Platform taraf değildir:</strong> kargo/lojistik, escrow, iade, dispute/hakemlik yok.
      </div>

      <RouterLink class="btn" to="/">Back Home</RouterLink>
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
.list{ margin:0 0 16px; color:#cbd5e1; line-height:1.6; }
.note{ border:1px solid rgba(56,189,248,.18); background:rgba(56,189,248,.06); padding:12px 14px; border-radius:14px; color:#e2e8f0; margin: 12px 0 16px; }
.btn{ display:inline-block; text-decoration:none; padding:10px 14px; border-radius:12px; background:linear-gradient(90deg,#2563eb,#38bdf8); color:white; }
</style>
