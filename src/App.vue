<template>
  <div class="page">

    <!-- TOP BAR -->
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

    <!-- MODES GRID -->
    <section class="grid">
      <div
        v-for="m in modes"
        :key="m.title"
        class="card"
      >
        <h3>{{ m.title }}</h3>
        <p>{{ m.subtitle }}</p>
        <button>Enter Mode</button>
      </div>
    </section>

    <!-- FOOTER -->
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

  { title:"FULFILLMENT HUB", subtitle:"Supplier logistics system" },
  { title:"ON-DEMAND ORDERS", subtitle:"Custom production requests" },
  { title:"CODE MARKET", subtitle:"Scripts & dev assets" },

  { title:"DIGITAL ASSETS", subtitle:"Themes, UI, templates" },
];
</script>

<style>
body{
  margin:0;
  font-family:Arial, Helvetica, sans-serif;
}

.page{
  min-height:100vh;
  color:white;
  background:
    radial-gradient(circle at 20% 20%, #0f1c3d, transparent 40%),
    #020617;
}

/* TOPBAR */

.topbar{
  display:flex;
  justify-content:space-between;
  align-items:center;
  padding:20px 40px;
  backdrop-filter: blur(8px);
  background:rgba(0,0,0,.35);
  border-bottom:1px solid rgba(0,150,255,.2);
}

.logo{
  font-weight:bold;
  letter-spacing:2px;
  color:#38bdf8;
}

.actions button{
  margin-left:12px;
}

.ghost{
  background:none;
  border:1px solid #1e293b;
  color:#94a3b8;
  padding:8px 14px;
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
  padding:80px 20px 40px;
}

.hero h1{
  font-size:42px;
  margin:0;
  letter-spacing:2px;
}

.hero span{
  color:#38bdf8;
  text-shadow:0 0 12px #38bdf8;
}

.hero p{
  color:#94a3b8;
  margin-top:16px;
}

/* GRID */

.grid{
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(240px,1fr));
  gap:28px;
  max-width:1100px;
  margin:40px auto;
  padding:20px;
}

.card{
  background:linear-gradient(145deg,#020617,#0b1120);
  border:1px solid rgba(56,189,248,.25);
  padding:30px;
  border-radius:16px;
  text-align:center;
  transition:.35s;
  position:relative;
  overflow:hidden;
}

/* Neon Glow */
.card::before{
  content:"";
  position:absolute;
  inset:0;
  background:linear-gradient(120deg,transparent,rgba(56,189,248,.3),transparent);
  opacity:0;
  transition:.4s;
}

.card:hover{
  transform:translateY(-8px) scale(1.02);
  box-shadow:0 0 25px rgba(56,189,248,.35);
  border-color:#38bdf8;
}

.card:hover::before{
  opacity:1;
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
  margin-top:16px;
  background:#2563eb;
  border:none;
  padding:10px 18px;
  border-radius:8px;
  color:white;
  cursor:pointer;
}

/* FOOTER */

.footer{
  text-align:center;
  padding:30px;
  color:#64748b;
  border-top:1px solid rgba(56,189,248,.15);
}
</style>
