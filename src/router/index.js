import { createRouter, createWebHistory } from "vue-router"

import Home from "../views/Home.vue"
import B2B from "../views/B2B.vue"
import B2C from "../views/B2C.vue"
import C2C from "../views/C2C.vue"
import Services from "../views/Services.vue"
import Digital from "../views/Digital.vue"
import POD from "../views/POD.vue"
import Dropship from "../views/Dropship.vue"

import RFQ from "../views/RFQ.vue"
import Messages from "../views/Messages.vue"
import Orders from "../views/Orders.vue"

import Dashboard from "../views/Dashboard.vue"
import Profile from "../views/Profile.vue"
import Company from "../views/Company.vue"

const routes = [
  { path: "/", component: Home },

  { path: "/b2b", component: B2B },
  { path: "/b2c", component: B2C },
  { path: "/c2c", component: C2C },

  { path: "/services", component: Services },
  { path: "/digital", component: Digital },
  { path: "/pod", component: POD },
  { path: "/dropship", component: Dropship },

  { path: "/rfq", component: RFQ },
  { path: "/messages", component: Messages },
  { path: "/orders", component: Orders },

  { path: "/dashboard", component: Dashboard },
  { path: "/profile", component: Profile },
  { path: "/company", component: Company },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
