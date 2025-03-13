import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import Finances from '../pages/Finances.vue'
import ItemDetail from '../pages/ItemDetail.vue'
import Messages from '../pages/Messages.vue'
import Login from '../pages/Login.vue'
import Register from '../pages/Register.vue'
import HowItWorks from '../pages/HowItWorks.vue'
import Guarantees from '../pages/Guarantees.vue'
import Rules from '../pages/Rules.vue'
import Settings from '@/pages/Settings.vue'
import Profile from '@/pages/Profile.vue'
import Specialists from '@/pages/Specialists.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/finances', component: Finances },
  { path: '/messages', component: Messages },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/how-it-works', component: HowItWorks },
  { path: '/guarantees', component: Guarantees },
  { path: '/rules', component: Rules },
  { path: '/settings', component: Settings },
  { path: '/profile', component: Profile },
  { path: '/specialists', component: Specialists },
  { path: '/item/:id', component: ItemDetail, props: true },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router