import { createRouter, createWebHistory } from "vue-router"

import Home from "../views/HomeView.vue"
import B2B from "../views/B2BView.vue"
import B2C from "../views/B2CView.vue"
import C2C from "../views/C2CView.vue"
import Services from "../views/ServicesView.vue"
import Digital from "../views/DigitalView.vue"
import RFQ from "../views/RFQView.vue"
import Profile from "../views/ProfileView.vue"

const routes = [
  { path: "/", component: Home },
  { path: "/b2b", component: B2B },
  { path: "/b2c", component: B2C },
  { path: "/c2c", component: C2C },
  { path: "/services", component: Services },
  { path: "/digital", component: Digital },
  { path: "/rfq", component: RFQ },
  { path: "/profile", component: Profile },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
