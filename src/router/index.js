import { createRouter, createWebHistory } from "vue-router"

import HomeView from "../views/HomeView.vue"

// B2B (ayrık sayfalar)
import B2BProductsView from "../views/b2b/B2BProductsView.vue"
import B2BProductDetailView from "../views/b2b/B2BProductDetailView.vue"
import B2BRFQCreateView from "../views/b2b/B2BRFQCreateView.vue"

// Placeholders (kopya değil, sadece yön tabelası)
import B2CStub from "../views/stubs/B2CStub.vue"
import C2CStub from "../views/stubs/C2CStub.vue"
import ServicesStub from "../views/stubs/ServicesStub.vue"
import CodeStub from "../views/stubs/CodeStub.vue"
import PodStub from "../views/stubs/PodStub.vue"
import DropshipStub from "../views/stubs/DropshipStub.vue"

const routes = [
  { path: "/", component: HomeView },

  // B2B
  { path: "/b2b/products", component: B2BProductsView },
  { path: "/b2b/products/:id", component: B2BProductDetailView },
  { path: "/b2b/rfq/create", component: B2BRFQCreateView },

  // Other modules (şimdilik ayrık stub)
  { path: "/b2c", component: B2CStub },
  { path: "/c2c", component: C2CStub },
  { path: "/services", component: ServicesStub },
  { path: "/code", component: CodeStub },
  { path: "/pod", component: PodStub },
  { path: "/dropship", component: DropshipStub },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
