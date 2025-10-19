import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "@/router";
import "./style.css";
import App from "./App.vue";
import { createI18n } from "vue-i18n";
import en from "@/locales/en.json";
import id from "@/locales/id.json";

// Detect locale (localStorage -> browser -> en)
const detected =
  localStorage.getItem("locale") || navigator.language?.slice(0, 2) || "en";
const locale = detected === "id" ? "id" : "en";

const i18n = createI18n({
  legacy: false,
  locale,
  fallbackLocale: "en",
  messages: { en, id },
});

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(i18n);

// Initialize stores before mounting to avoid auth race on refresh
import { useAuthStore } from "@/stores/auth";
import { useCartStore } from "@/stores/cart";

const authStore = useAuthStore();
const cartStore = useCartStore();

(async () => {
  try {
    await authStore.initializeAuth();
  } finally {
    cartStore.loadCartFromStorage();
    app.mount("#app");
  }
})();
