import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useModeStore } from "@/stores/mode";

// Auth Views
import LoginView from "@/views/auth/LoginView.vue";
import HomeView from "@/views/HomeView.vue";

// Admin Views
import AdminLayout from "@/views/admin/AdminLayout.vue";
import AdminProducts from "@/views/admin/AdminProducts.vue";
import AdminUsers from "@/views/admin/AdminUsers.vue";
import AdminOrders from "@/views/admin/AdminOrders.vue";
import AdminProductDetail from "@/views/admin/AdminProductDetail.vue";

// User Views
import UserLayout from "@/views/user/UserLayout.vue";
import ProductsList from "@/views/user/ProductsList.vue";
import ProductDetail from "@/views/user/ProductDetail.vue";
import CartView from "@/views/user/CartView.vue";
import CheckoutView from "@/views/user/CheckoutView.vue";
import UserOrders from "@/views/user/UserOrders.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomeView,
    meta: { requiresGuest: true },
  },
  {
    path: "/login",
    name: "Login",
    component: LoginView,
    meta: { requiresGuest: true },
  },
  // Admin Routes (nested)
  {
    path: "/admin",
    component: AdminLayout,
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      { path: "", redirect: "/admin/products" },
      { path: "products", name: "AdminProducts", component: AdminProducts },
      { path: "products/:id", name: "AdminProductDetail", component: AdminProductDetail },
      { path: "users", name: "AdminUsers", component: AdminUsers },
      { path: "orders", name: "AdminOrders", component: AdminOrders },
    ],
  },
  // User Routes (nested)
  {
    path: "/user",
    component: UserLayout,
    meta: { requiresAuth: true },
    children: [
      { path: "", redirect: "/user/products" },
      { path: "products", name: "ProductsList", component: ProductsList },
      { path: "products/:id", name: "ProductDetail", component: ProductDetail },
      { path: "cart", name: "Cart", component: CartView },
      { path: "checkout", name: "Checkout", component: CheckoutView },
      { path: "orders", name: "UserOrders", component: UserOrders },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Route Guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const mode = useModeStore();

  // Ensure profile is hydrated on refresh if token exists
  if (authStore.token && !authStore.user) {
    try {
      await authStore.getUserProfile();
    } catch (_) {
      // store.logout will clear token if needed
    }
  }

  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    // Allow staying on '/' (Home) if mode hasn't been chosen yet
    if (to.path === '/' && (mode.mode === null || mode.mode === undefined)) {
      return next();
    }
    // Otherwise redirect to appropriate start page based on admin or chosen mode
    const goAdmin = authStore.isAdmin || mode.mode === 'admin';
    next(goAdmin ? "/admin/products" : "/user/products");
  } else if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // If route requires auth and user is not authenticated, redirect to login
    next("/login");
  } else if (to.meta.requiresAdmin && !authStore.isAdmin) {
    // If route requires admin and user is not admin, redirect to user start page
    next("/user/products");
  } else {
    next();
  }
});

export default router;
