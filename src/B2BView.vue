<template>
  <div class="page">

    <h1 class="title">B2B GLOBAL SHOWROOM</h1>

    <input
      v-model="search"
      class="search"
      placeholder="Search products..."
    />

    <div class="grid">
      <div class="card" v-for="item in filtered" :key="item.id">

        <img :src="item.img || fallback" class="img"/>

        <h3>{{ item.title }}</h3>

        <p class="meta">{{ item.country }}</p>

        <div class="row">
          <span>MOQ: {{ item.moq || "-" }}</span>
          <span>{{ item.price || "-" }}</span>
        </div>

        <button class="btn" @click="openRFQ(item)">
          Send RFQ
        </button>

      </div>
    </div>

    <!-- RFQ MODAL -->
    <div v-if="showRFQ" class="modal">
      <div class="modal-box">

        <h2>Send RFQ</h2>

        <input v-model="rfq.qty" placeholder="Quantity"/>
        <textarea v-model="rfq.req" placeholder="Requirements"/>
        <input v-model="rfq.country" placeholder="Target country"/>
        <input v-model="rfq.budgetMin" placeholder="Budget min"/>
        <input v-model="rfq.budgetMax" placeholder="Budget max"/>

        <div class="actions">
          <button @click="sendRFQ">Submit</button>
          <button @click="closeRFQ">Cancel</button>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue"
import { supabase } from "@/lib/supabase"

const listings = ref([])
const search = ref("")

const fallback =
  "https://via.placeholder.com/300x200?text=No+Image"

const showRFQ = ref(false)
const selectedListing = ref(null)

const rfq = ref({
  qty:"",
  req:"",
  country:"",
  budgetMin:"",
  budgetMax:""
})

onMounted(fetchListings)

async function fetchListings(){

  const { data, error } = await supabase
    .from("listings")
    .select(`
      id,
      title,
      b2b_details(moq,price_range,country_of_origin),
      listing_media(url)
    `)
    .eq("listing_type","b2b")
    .eq("active",true)

  if(error){
    console.log(error)
    return
  }

  listings.value = data.map(l => ({
    id:l.id,
    title:l.title,
    moq:l.b2b_details?.moq,
    price:l.b2b_details?.price_range,
    country:l.b2b_details?.country_of_origin,
    img:l.listing_media?.[0]?.url
  }))
}

const filtered = computed(()=>{
  return listings.value.filter(i =>
    i.title.toLowerCase().includes(search.value.toLowerCase())
  )
})

function openRFQ(item){
  selectedListing.value = item
  showRFQ.value = true
}

function closeRFQ(){
  showRFQ.value = false
}

async function sendRFQ(){

  const { error } = await supabase
    .from("rfq_requests")
    .insert({
      listing_id:selectedListing.value.id,
      buyer_id:"00000000-0000-0000-0000-000000000000", // TEMP
      quantity:rfq.value.qty,
      requirements:rfq.value.req,
      target_country:rfq.value.country,
      budget_min:rfq.value.budgetMin,
      budget_max:rfq.value.budgetMax,
      status:"open"
    })

  if(error){
    alert("Error sending RFQ")
    console.log(error)
    return
  }

  alert("RFQ sent 🚀")
  closeRFQ()
}
</script>

<style>
.page{
  padding:30px;
  color:white;
  background:#050b18;
  min-height:100vh;
}

.title{
  font-size:28px;
  margin-bottom:20px;
}

.search{
  padding:10px;
  width:300px;
  margin-bottom:20px;
}

.grid{
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(240px,1fr));
  gap:20px;
}

.card{
  background:#0b1220;
  padding:15px;
  border-radius:12px;
  border:1px solid #1f2a44;
}

.img{
  width:100%;
  height:160px;
  object-fit:cover;
  border-radius:8px;
}

.meta{
  opacity:.7;
}

.row{
  display:flex;
  justify-content:space-between;
  margin:10px 0;
}

.btn{
  background:#3b82f6;
  border:none;
  padding:10px;
  color:white;
  border-radius:8px;
  cursor:pointer;
}

/* MODAL */

.modal{
  position:fixed;
  inset:0;
  background:rgba(0,0,0,0.7);
  display:flex;
  justify-content:center;
  align-items:center;
}

.modal-box{
  background:#0b1220;
  padding:25px;
  border-radius:12px;
  width:320px;
  display:flex;
  flex-direction:column;
  gap:10px;
}

.modal-box input,
.modal-box textarea{
  padding:10px;
  border-radius:6px;
  border:none;
}

.actions{
  display:flex;
  justify-content:space-between;
}
</style>
