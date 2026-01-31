<template>
  <div class="home">

    <h1>TradePiGlobal</h1>
    <p class="subtitle">Global Trade Console</p>

    <div class="grid">
      <div v-for="m in modes" :key="m.title" class="card">
        <h2>{{ m.title }}</h2>
        <p>{{ m.subtitle }}</p>
        <button>Enter Mode</button>
      </div>
    </div>

  </div>
</template>

<script setup>
const modes = [
  { title: "B2B Trade", subtitle: "Wholesale & global sourcing" },
  { title: "B2C Market", subtitle: "Retail marketplace" },
  { title: "C2C Exchange", subtitle: "Peer-to-peer trading" },

  { title: "Gig Services", subtitle: "Freelance task marketplace" },
  { title: "Creator Market", subtitle: "Sell skills & micro-services" },

  { title: "Print-On-Demand", subtitle: "Custom printed products" },
  { title: "Fulfillment Hub", subtitle: "Supplier fulfillment system" },
  { title: "On-Demand Orders", subtitle: "Custom production requests" },

  { title: "Code Market", subtitle: "Scripts & dev assets" },
  { title: "Digital Assets", subtitle: "Themes, UI, templates" }
]
</script>

<style>
body{
  margin:0;
  font-family:Arial;
  background: radial-gradient(circle at top,#0f172a,#020617);
  color:white;
}

.home{
  text-align:center;
  padding:60px 20px;
}

.subtitle{
  color:#94a3b8;
  margin-bottom:40px;
}

.grid{
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
  gap:25px;
  max-width:1100px;
  margin:auto;
}

.card{
  background:linear-gradient(145deg,#0f172a,#020617);
  border:1px solid #1e293b;
  padding:30px;
  border-radius:14px;
  transition:.3s;
}

.card:hover{
  transform:translateY(-6px);
  border-color:#3b82f6;
}

button{
  margin-top:12px;
  padding:8px 18px;
  background:#2563eb;
  border:none;
  border-radius:6px;
  color:white;
  cursor:pointer;
}
</style>
