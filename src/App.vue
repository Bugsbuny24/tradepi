<template>
  <div class="app-shell">
    <!-- TOPBAR -->
    <header class="topbar">
      <RouterLink to="/" class="logo">π TRADEPIGLOBAL</RouterLink>

      <div class="actions">
        <RouterLink class="ghost" to="/">Home</RouterLink>
        <RouterLink class="ghost" to="/how">How it works</RouterLink>
        <RouterLink class="login" to="/profile">Login</RouterLink>
      </div>
    </header>

    <main class="main">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { RouterLink, RouterView } from "vue-router"
</script>

<style>
/* Global base */
html, body { height: 100%; }
body{
  margin:0;
  font-family:Arial, Helvetica, sans-serif;
  background:#020617;
}

.app-shell{
  min-height:100vh;
  color:white;
  background:
    radial-gradient(circle at 50% 0%, #0b1a3a, transparent 40%),
    linear-gradient(#020617,#000814);
}

/* TOPBAR */
.topbar{
  position:sticky;
  top:0;
  z-index:50;
  display:flex;
  justify-content:space-between;
  align-items:center;
  padding:16px 22px;
  backdrop-filter:blur(10px);
  background:rgba(0,0,0,.35);
  border-bottom:1px solid rgba(0,150,255,.25);
}

.logo{
  color:#38bdf8;
  letter-spacing:2px;
  text-decoration:none;
  font-weight:700;
}

.actions{ display:flex; gap:10px; align-items:center; }

.ghost{
  text-decoration:none;
  background:none;
  border:1px solid #1e293b;
  color:#94a3b8;
  padding:7px 14px;
  border-radius:10px;
}

.login{
  text-decoration:none;
  background:#2563eb;
  border:none;
  color:white;
  padding:8px 16px;
  border-radius:10px;
}

.main{
  padding:18px;
}
</style>
