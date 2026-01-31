<script setup>
import { useRouter } from "vue-router"

const router = useRouter()

const modes = [
  {
    title: "TRADE MODE",
    subtitle: "Global B2B Showroom",
    route: "/trade"
  },
  {
    title: "MARKET MODE",
    subtitle: "Global Marketplace",
    route: "/market"
  },
  {
    title: "SERVICES",
    subtitle: "Freelance & Digital Work",
    route: "/services"
  },
  {
    title: "DIGITAL ASSETS",
    subtitle: "Code • Themes • Templates",
    route: "/digital"
  }
]

function go(route){
  router.push(route)
}
</script>

<template>
  <div class="page">

    <!-- NAVBAR -->
    <nav class="nav">
      <div class="logo">TradePiGlobal</div>

      <div class="nav-right">
        <button class="btn ghost">Login</button>
        <button class="btn primary">Join</button>
      </div>
    </nav>

    <!-- HERO -->
    <section class="hero">
      <h1>GLOBAL TRADE CONSOLE</h1>
      <p>
        Choose your trading environment and connect with global buyers,
        suppliers and service providers.
      </p>

      <div class="badges">
        <span>✔ Non-custodial</span>
        <span>✔ Direct trade</span>
        <span>✔ B2B focused</span>
      </div>
    </section>

    <!-- PORTALS -->
    <section class="grid">
      <div 
        v-for="m in modes" 
        :key="m.title"
        class="card"
        @click="go(m.route)"
      >
        <h2>{{ m.title }}</h2>
        <p>{{ m.subtitle }}</p>
        <button>Enter</button>
      </div>
    </section>

    <!-- FOOTER -->
    <footer>
      TradePiGlobal is a non-intermediary B2B showroom platform.
    </footer>

  </div>
</template>

<style scoped>
.page{
  min-height:100vh;
  background: radial-gradient(circle at 20% 20%, #16213a, #05070f);
  color:white;
  font-family: Arial, sans-serif;
}

/* NAV */
.nav{
  display:flex;
  justify-content:space-between;
  padding:20px 40px;
  border-bottom:1px solid rgba(255,255,255,0.1);
}

.logo{
  font-weight:bold;
  letter-spacing:2px;
}

.nav-right{
  display:flex;
  gap:10px;
}

/* BUTTONS */
.btn{
  padding:8px 18px;
  border-radius:8px;
  border:none;
  cursor:pointer;
}

.ghost{
  background:transparent;
  border:1px solid rgba(255,255,255,0.3);
  color:white;
}

.primary{
  background:#2563eb;
  color:white;
}

/* HERO */
.hero{
  text-align:center;
  margin-top:60px;
}

.hero h1{
  font-size:40px;
  letter-spacing:3px;
}

.hero p{
  opacity:0.7;
  max-width:600px;
  margin:auto;
}

.badges{
  margin-top:15px;
  display:flex;
  justify-content:center;
  gap:20px;
  opacity:0.6;
  font-size:14px;
}

/* GRID */
.grid{
  margin:60px auto;
  display:grid;
  grid-template-columns:repeat(2, 300px);
  gap:30px;
  justify-content:center;
}

.card{
  background:rgba(255,255,255,0.05);
  border:1px solid rgba(255,255,255,0.2);
  padding:30px;
  border-radius:16px;
  cursor:pointer;
  transition:0.3s;
  backdrop-filter: blur(10px);
}

.card:hover{
  transform:scale(1.05);
  box-shadow:0 0 25px rgba(59,130,246,0.6);
}

.card h2{
  margin-bottom:10px;
}

.card p{
  opacity:0.7;
}

.card button{
  margin-top:15px;
  padding:8px 15px;
  background:rgba(255,255,255,0.1);
  color:white;
  border:none;
  border-radius:8px;
}

/* FOOTER */
footer{
  text-align:center;
  opacity:0.5;
  font-size:13px;
  padding-bottom:30px;
}
</style>
