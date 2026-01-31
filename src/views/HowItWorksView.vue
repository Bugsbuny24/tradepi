<template>
  <div class="page">
    <h1 class="title">HOW IT WORKS</h1>
    <p class="sub">Platform aracı değildir: escrow yok, kargo/lojistik yok, komisyon yok.</p>

    <div class="panel">
      <ol class="list">
        <li>Satıcı vitrin/ilan açar.</li>
        <li>Alıcı arar veya RFQ gönderir.</li>
        <li>Taraflar mesajlaşır ve anlaşmayı kendi aralarında yapar.</li>
        <li>Platform sadece görünürlük & bağlantı sağlar.</li>
      </ol>

      <RouterLink class="btn" to="/">Back to Home</RouterLink>
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
.list{ margin:0 0 14px; color:#cbd5e1; }
.btn{ display:inline-block; text-decoration:none; padding:10px 14px; border-radius:12px; background:linear-gradient(90deg,#2563eb,#38bdf8); color:white; }
</style>
