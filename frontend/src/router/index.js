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
import Order from '@/pages/Order.vue'
import OrderDetail from '@/components/OrderDetail.vue'
import CreateOrder from '@/pages/CreateOrder.vue'
import MyOrders from '@/pages/MyOrders.vue'
import OrderEdit from '@/pages/OrderEdit.vue'
import Payment from '@/pages/Payment.vue'
import PaymentSuccess from '@/pages/PaymentSuccess.vue'

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
  { path: '/profile/:id', component: Profile, props: true },
  { path: '/specialists', component: Specialists },
  { path: '/item/:id', component: ItemDetail, props: true },
  { path: '/', component: Order },
  { path: '/order/:id', component: OrderDetail, props: true },
  { path: '/order/:id/edit', component: OrderEdit, props: true },
  { path: '/create-order/:id', component: CreateOrder },
  { path: '/my-orders', component: MyOrders },
  { path: '/payment/:id', component: Payment, props: true },
  { path: '/payment/success/:id', component: PaymentSuccess, props: true },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
