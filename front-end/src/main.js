import { createApp } from 'vue'
import App from './App.vue'
import './main.css';
import * as VueRouter from 'vue-router'
import ShoppingCartPage from './pages/ShoppingCartPage.vue';
import ProductsPage from './pages/ProductsPage.vue';
import ProductDetailPage from './pages/ProductDetailPage.vue';
import NotFoundPage from './pages/NotFoundPage.vue';

import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAcQajWcVrzM1WkOuhizmdHpR-vfeqLUwI",
  authDomain: "vue-e-commerce-site.firebaseapp.com",
  projectId: "vue-e-commerce-site",
  storageBucket: "vue-e-commerce-site.appspot.com",
  messagingSenderId: "381441551476",
  appId: "1:381441551476:web:938d044bcbfd009b67b521"
};

initializeApp(firebaseConfig);

createApp(App)
.use(VueRouter.createRouter({
  history: VueRouter.createWebHistory(process.env.BASE_URL),
  routes: [{
    path: '/cart',
    component: ShoppingCartPage,
  }, {
    path: '/products',
    component: ProductsPage,
  }, {
    path: '/products/:productId',
    component: ProductDetailPage,
  }, {
    path: '/',
    redirect: '/products',
  }, {
    path: '/:pathMatch(.*)*',
    component: NotFoundPage,
  }]
}))
.mount('#app')
