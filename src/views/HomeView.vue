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
        GLOBAL TRADE + <span>NEW ECONOMY</span>
      </h1>

      <p>
        Non-custodial global exchange & digital trade ecosystem
      </p>
    </section>

    <!-- MODES -->
    <section class="grid">
      <div v-for="m in modes" :key="m.title" class="card">
        <h3>{{ m.title }}</h3>
        <p>{{ m.desc }}</p>
        <button>Enter Mode</button>
      </div>
    </section>

  </div>
</template>

<script setup>
const modes = [
  { title:"B2B Trade", desc:"Wholesale & global sourcing" },
  { title:"B2C Market", desc:"Retail marketplace" },
  { title:"C2C Exchange", desc:"Peer-to-peer trading" },

  { title:"Gig Services", desc:"Freelance task marketplace" },
  { title:"Skill Market", desc:"Micro-services & digital work" },

  { title:"Print-On-Demand", desc:"Custom printed products" },
  { title:"Dropship Hub", desc:"Supplier fulfillment system" },
  { title:"On-Demand Orders", desc:"Custom production requests" },

  { title:"Code Market", desc:"Scripts & dev assets" },
  { title:"Digital Assets", desc:"Themes, UI, templates" }
]
</script>

<style scoped>

.page{
  min-height:100vh;
  color:white;
  font-family:Arial;

  background:
  linear-gradient(rgba(0,0,0,.75),rgba(0,0,0,.95)),
  url("https://images.unsplash.com/photo-1519608484873-e999c86e7455");

  background-size:cover;
  background-position:center;
}

/* TOPBAR */

.topbar{
  display:flex;
  justify-content:space-between;
  padding:20px 40px;
  backdrop-filter:blur(10px);
  background:rgba(0,0,0,.35);
  border-bottom:1px solid rgba(255,255,255,.15);
}

.logo{
  font-weight:bold;
  color:#facc15;
}

.actions button{
  margin-left:10px;
}

.ghost{
  background:transparent;
  color:white;
  border:1px solid rgba(255,255,255,.3);
  padding:8px 14px;
  border-radius:8px;
}

.login{
  background:#facc15;
  border:none;
  padding:8px 16px;
  border-radius:8px;
}

/* HERO */

.hero{
  text-align:center;
  margin-top:60px;
}

.hero h1{
  font-size:40px;
}

.hero span{
  color:#facc15;
  text-shadow:0 0 20px #facc15;
}

/* GRID */

.grid{
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(240px,1fr));
  gap:25px;
  padding:60px;
}

.card{
  background:rgba(15,23,42,.6);
  border:1px solid rgba(255,255,255,.15);
  padding:30px;
  border-radius:18px;
  backdrop-filter: blur(12px);
  text-align:center;
  transition:.3s;
}

.card:hover{
  transform:scale(1.05);
  border-color:#facc15;
  box-shadow:0 0 30px rgba(250,204,21,.7);
}

.card h3{
  margin-bottom:10px;
}

.card button{
  margin-top:15px;
  background:#2563eb;
  color:white;
  border:none;
  padding:10px 18px;
  border-radius:8px;
}

</style>
