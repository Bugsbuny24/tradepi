<template>
  <div class="page">
    <!-- TOP BAR -->
    <header class="topbar">
      <div class="logo">π TRADEPIGLOBAL</div>

      <div class="actions">
        <RouterLink class="ghost" to="/explore">Explore</RouterLink>
        <RouterLink class="ghost" to="/how">How it works</RouterLink>
        <RouterLink class="login" to="/profile">Login</RouterLink>
      </div>
    </header>

    <!-- HERO -->
    <section class="hero">
      <h1>
        GLOBAL TRADE + <span>NEW ECONOMY</span>
      </h1>
      <p>Non-custodial global exchange &amp; digital trade ecosystem</p>
    </section>

    <!-- MODES -->
    <section class="grid">
      <div v-for="m in modes" :key="m.title" class="card">
        <h3>{{ m.title }}</h3>
        <p>{{ m.desc }}</p>

        <RouterLink class="enter" :to="m.to">
          Enter Mode
        </RouterLink>
      </div>
    </section>
  </div>
</template>

<script setup>
import { RouterLink } from "vue-router";

const modes = [
  { title: "B2B Trade", desc: "Wholesale & global sourcing", to: "/b2b" },
  { title: "B2C Market", desc: "Retail marketplace", to: "/b2c" },
  { title: "C2C Exchange", desc: "Peer-to-peer trading", to: "/c2c" },
  { title: "Gig Services", desc: "Freelance task marketplace", to: "/services" },
  { title: "Skill Market", desc: "Micro-services & digital work", to: "/services" },
  { title: "Print-On-Demand", desc: "Custom printed products", to: "/services" },
  { title: "Dropship Hub", desc: "Supplier fulfillment system", to: "/b2b" },
  { title: "On-Demand Orders", desc: "Custom production requests", to: "/b2b" },
  { title: "Code Market", desc: "Scripts & dev assets", to: "/digital" },
  { title: "Digital Assets", desc: "Themes, UI, templates", to: "/digital" },
];
</script>

<style scoped>
.page {
  min-height: 100vh;
  padding: 18px 14px 56px;
  background: radial-gradient(circle at 20% 0%, rgba(56,189,248,.16), transparent 45%),
              radial-gradient(circle at 80% 0%, rgba(250,204,21,.10), transparent 45%),
              #030712;
  color: #e5e7eb;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 6px;
}

.logo { color: #38bdf8; font-weight: 700; letter-spacing: .4px; }

.actions { display: flex; gap: 10px; align-items: center; }

.ghost, .login {
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,.14);
  color: #e5e7eb;
  font-size: 14px;
}

.login {
  background: linear-gradient(90deg, #facc15, #f59e0b);
  color: #111827;
  border: 0;
  font-weight: 700;
}

.hero {
  text-align: center;
  padding: 24px 0 10px;
}

.hero h1 {
  margin: 0;
  font-size: 28px;
  letter-spacing: .6px;
}
.hero h1 span { color: #facc15; }
.hero p { margin: 10px 0 0; color: #9ca3af; }

.grid {
  margin: 22px auto 0;
  display: grid;
  gap: 16px;
  max-width: 920px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.card {
  padding: 18px;
  border-radius: 18px;
  border: 1px solid rgba(56,189,248,.18);
  background: rgba(2,6,23,.55);
  box-shadow: 0 12px 40px rgba(0,0,0,.35);
  text-align: center;
}

.card h3 { margin: 4px 0 8px; font-size: 16px; }
.card p { margin: 0 0 14px; color: #9ca3af; font-size: 13px; }

.enter {
  display: inline-block;
  text-decoration: none;
  padding: 9px 14px;
  border-radius: 10px;
  background: linear-gradient(90deg, #2563eb, #38bdf8);
  color: #fff;
  font-weight: 700;
  font-size: 13px;
}

@media (max-width: 720px) {
  .grid { grid-template-columns: 1fr; }
}
</style>
