<template>
  <div class="home">
    <h1>TradePiGlobal</h1>
    <p>Global Trade Console</p>

    <div class="modes">
      <div class="card" v-for="m in modes" :key="m.title">
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
  { title: "Services", subtitle: "Freelance" }
];
</script>

<style>
body {
  margin: 0;
  font-family: Arial;
  background: #0b0f1a;
  color: white;
}

.home {
  text-align: center;
  padding: 60px;
}

.modes {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-top: 40px;
}

.card {
  background: #111827;
  padding: 30px;
  border-radius: 12px;
}

button {
  padding: 10px 20px;
  background: #2563eb;
  border: none;
  color: white;
  border-radius: 6px;
}
</style>
