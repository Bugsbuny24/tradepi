<template>
  <div class="page">

    <!-- TOPBAR -->
    <header class="topbar">
      <div class="logo">π TRADEPIGLOBAL</div>

      <div class="actions">
        <button class="ghost">Explore</button>
        <button class="ghost">How it works</button>
        <button class="login">Login</button>
      </div>
    </header>

    <!-- HERO -->
    <section class="hero">
      <h1>
        GLOBAL TRADE +
        <span>NEW ECONOMY</span>
      </h1>

      <p>
        Non-custodial global exchange ecosystem.<br>
        Direct buyer–seller connections.
      </p>
    </section>

    <!-- GRID -->
    <section class="grid">
      <div v-for="m in modes" :key="m.title" class="card">
        <div class="glow-line"></div>

        <h3>{{ m.title }}</h3>
        <p>{{ m.subtitle }}</p>

        <button>Enter Mode</button>
      </div>
    </section>

    <footer class="footer">
      Direct trade • No escrow • Global access
    </footer>

  </div>
</template>

<script setup>
const modes = [
  { title:"B2B TRADE", subtitle:"Wholesale & global sourcing" },
  { title:"B2C MARKET", subtitle:"Retail marketplace" },
  { title:"C2C EXCHANGE", subtitle:"Peer-to-peer trading" },

  { title:"GIG SERVICES", subtitle:"Freelance marketplace" },
  { title:"CREATOR MARKET", subtitle:"Digital services & skills" },
  { title:"PRINT-ON-DEMAND", subtitle:"Custom printed products" },

  { title:"FULFILLMENT HUB", subtitle:"Supplier logistics" },
  { title:"ON-DEMAND ORDERS", subtitle:"Custom production" },
  { title:"CODE MARKET", subtitle:"Scripts & dev assets" },

  { title:"DIGITAL ASSETS", subtitle:"Themes & templates" },
];
</script>

<style>
body{
  margin:0;
  font-family:Arial, Helvetica, sans-serif;
}

/* BACKGROUND */
.page{
  min-height:100vh;
  color:white;
  background:
    radial-gradient(circle at 50% 0%, #0b1a3a, transparent 40%),
    linear-gradient(#020617,#000814);
}

/* TOPBAR */
.topbar{
  display:flex;
  justify-content:space-between;
  padding:18px 40px;
  backdrop-filter:blur(10px);
  background:rgba(0,0,0,.4);
  border-bottom:1px solid rgba(0,150,255,.25);
}

.logo{
  color:#38bdf8;
  letter-spacing:2px;
}

.actions button{ margin-left:10px; }

.ghost{
  background:none;
  border:1px solid #1e293b;
  color:#94a3b8;
  padding:7px 14px;
  border-radius:8px;
}

.login{
  background:#2563eb;
  border:none;
  color:white;
  padding:8px 16px;
  border-radius:8px;
}

/* HERO */
.hero{
  text-align:center;
  padding:70px 20px 30px;
}

.hero h1{
  font-size:40px;
  letter-spacing:2px;
}

.hero span{
  color:#38bdf8;
  text-shadow:0 0 18px #38bdf8;
}

.hero p{
  color:#94a3b8;
}

/* GRID */
.grid{
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(240px,1fr));
  gap:30px;
  max-width:1100px;
  margin:30px auto;
  padding:20px;
}

/* CARD = FUTURISTIC PANEL */
.card{
  position:relative;
  background:linear-gradient(180deg,#020617,#050c1f);
  border-radius:18px;
  padding:30px;
  text-align:center;
  overflow:hidden;

  border:1px solid rgba(56,189,248,.25);
  box-shadow:
    inset 0 0 30px rgba(0,150,255,.08),
    0 0 10px rgba(0,150,255,.15);

  transition:.35s;
}

/* Moving light line */
.glow-line{
  position:absolute;
  height:2px;
  width:120%;
  background:linear-gradient(90deg,transparent,#38bdf8,transparent);
  top:0;
  left:-20%;
  opacity:.6;
}

/* Hover effects */
.card:hover{
  transform:translateY(-10px) scale(1.03);
  box-shadow:
    inset 0 0 40px rgba(0,150,255,.2),
    0 0 30px rgba(56,189,248,.5);
  border-color:#38bdf8;
}

.card h3{
  margin:0;
  color:#e2e8f0;
}

.card p{
  color:#94a3b8;
  font-size:14px;
}

.card button{
  margin-top:18px;
  padding:10px 18px;
  background:linear-gradient(90deg,#2563eb,#38bdf8);
  border:none;
  border-radius:10px;
  color:white;
  cursor:pointer;
  box-shadow:0 0 12px rgba(56,189,248,.6);
}

/* FOOTER */
.footer{
  text-align:center;
  padding:30px;
  color:#64748b;
  border-top:1px solid rgba(56,189,248,.15);
}
</style>
