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
  { title: "B2B", subtitle: "Global Showroom" },
  { title: "B2C", subtitle: "Marketplace" },
  { title: "C2C", subtitle: "Peer Trading" },

  { title: "Services", subtitle: "Freelance Marketplace" },
  { title: "Fiverr Mode", subtitle: "Gig Economy" },

  { title: "Printify POD", subtitle: "Print On Demand" },
  { title: "Dropshipping", subtitle: "Supplier Fulfillment" },
  { title: "On-Demand", subtitle: "Custom Orders" },

  { title: "CodeCanyon", subtitle: "Code & Templates" },
  { title: "Digital Assets", subtitle: "Themes & UI Kits" }
];
</script>

<style>
body {
  margin: 0;
  font-family: Arial;
  background: radial-gradient(circle at top, #0f172a, #020617);
  color: white;
}

.home {
  text-align: center;
  padding: 60px 20px;
}

.subtitle {
  color: #94a3b8;
  margin-bottom: 40px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 25px;
  max-width: 1100px;
  margin: auto;
}

.card {
  background: linear-gradient(145deg, #0f172a, #020617);
  border: 1px solid #1e293b;
  padding: 30px;
  border-radius: 14px;
  transition: 0.3s;
}

.card:hover {
  transform: scale(1.05);
  border-color: #3b82f6;
  box-shadow: 0 0 25px rgba(59,130,246,0.5);
}

button {
  margin-top: 15px;
  padding: 10px 18px;
  background: #2563eb;
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
}
</style>
