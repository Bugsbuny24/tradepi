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
