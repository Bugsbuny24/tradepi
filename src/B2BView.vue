<template>
  <div class="page">

    <h1 class="title">B2B GLOBAL SHOWROOM</h1>

    <!-- SEARCH -->
    <input
      class="search"
      placeholder="Search products, suppliers..."
    />

    <!-- GRID -->
    <div class="grid">
      <div class="card" v-for="item in items" :key="item.id">

        <img :src="item.img" class="img"/>

        <h3>{{ item.title }}</h3>
        <p class="meta">{{ item.company }}</p>
        <p class="meta">{{ item.country }}</p>

        <div class="row">
          <span>MOQ: {{ item.moq }}</span>
          <span>{{ item.price }}</span>
        </div>

        <button class="btn">Send RFQ</button>

      </div>
    </div>

  </div>
</template>

<script setup>
const items = [
  {
    id:1,
    title:"Smart LED Panels",
    company:"Shenzhen LightTech",
    country:"China",
    moq:500,
    price:"$8–12/unit",
    img:"https://images.unsplash.com/photo-1550009158-9ebf69173e03"
  },
  {
    id:2,
    title:"Organic Cotton T-Shirts",
    company:"Istanbul Textile",
    country:"Turkey",
    moq:300,
    price:"$4–6/unit",
    img:"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab"
  },
  {
    id:3,
    title:"Wireless Earbuds",
    company:"Seoul Digital",
    country:"Korea",
    moq:200,
    price:"$10–15/unit",
    img:"https://images.unsplash.com/photo-1585386959984-a4155224a1ad"
  }
]
</script>

<style>
.page{
  min-height:100vh;
  background:#040b18;
  color:white;
  padding:40px;
}

.title{
  text-align:center;
  margin-bottom:30px;
  font-size:34px;
  letter-spacing:2px;
  text-shadow:0 0 15px #00c3ff;
}

.search{
  width:100%;
  max-width:600px;
  display:block;
  margin:0 auto 40px;
  padding:14px;
  border-radius:10px;
  border:1px solid #0af;
  background:#071427;
  color:white;
}

.grid{
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(260px,1fr));
  gap:25px;
}

.card{
  background:linear-gradient(145deg,#071427,#020617);
  border:1px solid rgba(0,200,255,.4);
  border-radius:18px;
  padding:18px;
  transition:.3s;
  box-shadow:0 0 20px rgba(0,150,255,.15);
}

.card:hover{
  transform:translateY(-6px);
  box-shadow:0 0 30px rgba(0,200,255,.5);
}

.img{
  width:100%;
  height:160px;
  object-fit:cover;
  border-radius:12px;
  margin-bottom:10px;
}

.meta{
  color:#9cc;
  font-size:14px;
}

.row{
  display:flex;
  justify-content:space-between;
  margin:10px 0;
  color:#7fd;
}

.btn{
  width:100%;
  padding:12px;
  border:none;
  border-radius:10px;
  background:linear-gradient(90deg,#00c3ff,#0077ff);
  color:white;
  font-weight:bold;
  cursor:pointer;
  box-shadow:0 0 15px #00c3ff;
}
</style>
