<template>
  <div class="page">
    <header class="topbar">
      <div class="logo">π tradepigloball</div>
      <div class="right">
        <span class="pill">PI MODE ✅</span>
        <span class="pill off" title="USD MODE kapalı">USD MODE ⛔</span>
      </div>
    </header>

    <section class="hero">
      <h1>TradePiGloball</h1>
      <p>Showroom-first. Modules are separated. No copy pages.</p>
    </section>

    <section class="grid">
      <RouterLink class="card" to="/b2b/products">
        <h3>B2B</h3>
        <p>Wholesale showroom → RFQ flow</p>
        <span class="go">Enter</span>
      </RouterLink>

      <RouterLink class="card" to="/b2c">
        <h3>B2C</h3>
        <p>Retail catalog-style (no RFQ zorunlu)</p>
        <span class="go">Enter</span>
      </RouterLink>

      <RouterLink class="card" to="/c2c">
        <h3>C2C</h3>
        <p>Peer listing → message seller (RFQ yok)</p>
        <span class="go">Enter</span>
      </RouterLink>

      <RouterLink class="card" to="/services">
        <h3>Fiverr (Services)</h3>
        <p>Gig packages → order workflow</p>
        <span class="go">Enter</span>
      </RouterLink>

      <RouterLink class="card" to="/code">
        <h3>Codecanyon (Code)</h3>
        <p>License/download/support workflow</p>
        <span class="go">Enter</span>
      </RouterLink>

      <RouterLink class="card" to="/pod">
        <h3>Printify (POD)</h3>
        <p>Connect store → sync catalog</p>
        <span class="go">Enter</span>
      </RouterLink>

      <RouterLink class="card" to="/dropship">
        <h3>Dropship / On-demand</h3>
        <p>Supplier sync → fulfillment outside</p>
        <span class="go">Enter</span>
      </RouterLink>
    </section>

    <footer class="foot">
      No escrow • No shipping • No commission
    </footer>
  </div>
</template>

<style scoped>
.page{ min-height:100vh; padding:18px; background:linear-gradient(#020617,#000814); }
.topbar{ display:flex; justify-content:space-between; align-items:center; padding:12px 14px; border:1px solid #0b2a4a; border-radius:14px; background:rgba(0,0,0,.35); }
.logo{ letter-spacing:1px; font-weight:700; color:#38bdf8; text-transform:lowercase; }
.right{ display:flex; gap:8px; }
.pill{ padding:6px 10px; border-radius:999px; border:1px solid #1e293b; color:#e2e8f0; font-size:12px; }
.off{ opacity:.6; }
.hero{ padding:22px 6px 6px; }
.hero h1{ margin:0; font-size:34px; }
.hero p{ margin:8px 0 0; color:#94a3b8; }
.grid{ margin-top:16px; display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:12px; }
.card{ display:block; text-decoration:none; padding:16px; border-radius:16px; border:1px solid #1e293b; background:rgba(15,23,42,.55); }
.card h3{ margin:0 0 6px; color:#e5e7eb; }
.card p{ margin:0 0 10px; color:#94a3b8; font-size:13px; line-height:1.35; }
.go{ display:inline-block; padding:8px 12px; border-radius:10px; background:#2563eb; color:white; font-weight:600; font-size:13px; }
.foot{ margin-top:20px; color:#64748b; font-size:12px; text-align:center; }
</style>
