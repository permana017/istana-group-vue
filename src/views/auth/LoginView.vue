<template>
  <div
    class="min-h-screen grid lg:grid-cols-2 bg-gradient-to-br from-indigo-50 to-white"
  >
    <!-- Left: Branding / Illustration -->
    <div class="hidden lg:flex items-center justify-center p-12">
      <div class="max-w-md">
        <h1 class="text-4xl font-bold text-indigo-700">
          Istana Group Indonesia
        </h1>
        <p class="mt-4 text-gray-600">
          Platform belanja sederhana untuk demo technical test. Login untuk
          melanjutkan.
        </p>
        <ul class="mt-6 space-y-2 text-sm text-gray-600">
          <li>• Browse produk dan lihat detail</li>
          <li>• Tambahkan ke keranjang & checkout</li>
          <li>• Admin kelola produk & users</li>
        </ul>
      </div>
    </div>

    <!-- Right: Login Card -->
    <div class="flex items-center justify-center p-6">
      <div class="w-full max-w-md">
        <BaseCard :shadow="true">
          <div class="text-center">
            <h2 class="text-2xl font-semibold">Masuk akun</h2>
            <p class="text-sm text-gray-600">
              Gunakan kredensial demo di bawah
            </p>
          </div>

          <form class="mt-6 space-y-4" @submit.prevent="handleLogin">
            <div class="grid gap-3">
              <div>
                <label
                  for="username"
                  class="block text-sm font-medium text-gray-700"
                  >Username</label
                >
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  v-model="loginForm.username"
                  class="input-field mt-1"
                  placeholder="johnd"
                />
              </div>

              <div>
                <label
                  for="password"
                  class="block text-sm font-medium text-gray-700"
                  >Password</label
                >
                <div class="relative mt-1">
                  <input
                    :type="showPassword ? 'text' : 'password'"
                    id="password"
                    name="password"
                    required
                    v-model="loginForm.password"
                    class="input-field pr-10"
                    placeholder="m38rmF$"
                  />
                  <button
                    type="button"
                    class="absolute inset-y-0 right-0 px-3 text-sm text-gray-500"
                    @click="showPassword = !showPassword"
                  >
                    {{ showPassword ? "Hide" : "Show" }}
                  </button>
                </div>
              </div>
            </div>

            <div
              v-if="authStore.error"
              class="rounded-md bg-red-50 p-3 text-sm text-red-700"
            >
              {{ authStore.error }}
            </div>

            <div class="bg-blue-50 p-3 rounded-md text-sm text-blue-700">
              <p><strong>Demo:</strong> johnd / m38rmF$</p>
            </div>

            <button
              type="submit"
              :disabled="authStore.isLoading"
              class="btn-primary w-full"
            >
              {{ authStore.isLoading ? "Signing in..." : "Sign in" }}
            </button>

            <div
              class="flex items-center gap-2 text-xs text-gray-500 justify-center"
            >
              <span>Dengan masuk, Anda menyetujui</span>
              <a href="#" class="text-indigo-600">Ketentuan</a>
              <span>&</span>
              <a href="#" class="text-indigo-600">Kebijakan</a>
            </div>
          </form>
        </BaseCard>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useToastStore } from "@/stores/toast";
import BaseCard from "@/components/BaseCard.vue";

const router = useRouter();
const authStore = useAuthStore();
const toast = useToastStore();

const loginForm = ref({
  username: "johnd",
  password: "m38rmF$",
});

const showPassword = ref(false);

const handleLogin = async () => {
  authStore.clearError();

  const result = await authStore.login(loginForm.value);

  if (result.success) {
    toast.success("Login sukses! Selamat datang 👋", { duration: 2500 });
    router.push("/");
  } else if (result.error) {
    toast.error(result.error);
  }
};

onMounted(() => {
  // Clear any previous errors
  authStore.clearError();
});
</script>
