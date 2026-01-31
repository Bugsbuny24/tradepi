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
          <span>MOQ: {{ item.moq || '-' }}</span>
          <span>{{ item.price || '-' }}</span>
        </div>

        <button class="btn">Send RFQ</button>

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

onMounted(fetchListings)

async function fetchListings(){

  const { data, error } = await supabase
    .from("listings")
    .select(`
      id,
      title,
      b2b_details(moq, price_range, country_of_origin),
      listing_media(url)
    `)
    .eq("listing_type","b2b")
    .eq("active",true)

  if(error){
    console.log(error)
    return
  }

  listings.value = data.map(l => ({
    id: l.id,
    title: l.title,
    moq: l.b2b_details?.moq,
    price: l.b2b_details?.price_range,
    country: l.b2b_details?.country_of_origin,
    img: l.listing_media?.[0]?.url
  }))
}

const filtered = computed(()=>{
  return listings.value.filter(i =>
    i.title.toLowerCase().includes(search.value.toLowerCase())
  )
})
</script>
const showRFQ = ref(false)
const selectedListing = ref(null)

const rfq = ref({
  qty:"",
  req:"",
  country:"",
  budgetMin:"",
  budgetMax:""
})

function openRFQ(listing){
  selectedListing.value = listing
  showRFQ.value = true
}

function closeRFQ(){
  showRFQ.value = false
}

async function sendRFQ(){

  const { error } = await supabase
    .from("rfq_requests")
    .insert({
      listing_id: selectedListing.value.id,
      buyer_id: "00000000-0000-0000-0000-000000000000", // TEMP
      quantity: rfq.value.qty,
      requirements: rfq.value.req,
      target_country: rfq.value.country,
      budget_min: rfq.value.budgetMin,
      budget_max: rfq.value.budgetMax,
      status: "open"
    })

  if(error){
    alert("Error sending RFQ")
    console.log(error)
    return
  }

  alert("RFQ sent 🚀")
  closeRFQ()
}
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
