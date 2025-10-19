<template>
  <div>
    <div v-if="isLoading" class="p-6">Loading product...</div>
    <div v-else-if="error" class="p-6 text-red-600">{{ error }}</div>
    <div v-else-if="!product" class="p-6">Product not found.</div>

    <div v-else class="space-y-8">
      <!-- Breadcrumb + Back -->
      <div class="flex items-center justify-between text-sm text-gray-600">
        <div class="flex items-center gap-2">
          <RouterLink to="/admin/products" class="hover:underline">Products</RouterLink>
          <span>/</span>
          <span class="line-clamp-1 max-w-[60ch]">{{ product.title }}</span>
        </div>
        <RouterLink to="/admin/products" class="hover:underline">Back</RouterLink>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Image -->
        <BaseCard class="flex items-center justify-center">
          <img :src="product.image" :alt="product.title" class="w-full max-w-lg h-auto object-contain" loading="lazy" />
        </BaseCard>

        <!-- Info (edit form for admin) -->
        <BaseCard>
          <template v-if="isEditing">
            <h2 class="text-xl font-semibold mb-4">Edit Produk</h2>
            <div class="grid gap-3">
              <!-- Preview gambar -->
              <div v-if="currentPreview" class="w-full flex items-center justify-center">
                <img :src="currentPreview" alt="Preview" class="max-h-64 object-contain rounded border" />
              </div>

              <input v-model="form.title" placeholder="Judul" class="input-field" />
              <textarea v-model="form.description" placeholder="Deskripsi" class="input-field" rows="4" />
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input v-model.number="form.price" type="number" min="0" step="0.01" placeholder="Harga" class="input-field" />
                <input v-model="form.category" placeholder="Kategori" class="input-field" />
              </div>
              <input v-model="form.image" placeholder="URL Gambar" class="input-field" />
              <div class="grid sm:grid-cols-[1fr_auto] gap-2 items-center">
                <input ref="fileInput" type="file" accept="image/*" @change="onFileChange" class="input-field" />
                <button v-if="imagePreview || form.image" class="btn-secondary" @click.prevent="clearImage">Hapus Gambar</button>
              </div>
            </div>
            <div class="mt-4 flex gap-2 justify-end">
              <button class="btn-secondary" :disabled="saving" @click="cancelEdit">Batal</button>
              <button class="btn-primary" :disabled="saving" @click="saveEdit">{{ saving ? 'Menyimpan...' : 'Simpan' }}</button>
            </div>
          </template>
          <template v-else>
            <h1 class="text-2xl sm:text-3xl font-semibold leading-snug">{{ product.title }}</h1>
            <p class="mt-6 text-gray-700 leading-relaxed">{{ product.description }}</p>

            <div class="mt-3 flex items-center gap-3 text-sm text-gray-600">
              <StarRating :rating="product.rating?.rate || 0" />
              <span>{{ product.rating?.count || 0 }} sold</span>
              <span>{{ product.category }}</span>
            </div>

            <div class="mt-4">
              <div class="text-3xl font-bold">{{ formattedPrice }}</div>
            </div>

            <div class="mt-6 flex gap-3">
              <button class="btn-secondary" @click="goBack">Kembali ke daftar</button>
              <button class="btn-primary" @click="startEdit">Edit</button>
            </div>
          </template>
        </BaseCard>
      </div>

      <BaseCard>
        <h2 class="text-lg font-semibold mb-3">Product Description</h2>
        <p class="text-gray-700 leading-relaxed">{{ product.description }}</p>
      </BaseCard>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import BaseCard from '@/components/BaseCard.vue'
import StarRating from '@/components/StarRating.vue'
import { productService } from '@/services/productService'
import Swal from 'sweetalert2'

const route = useRoute()
const router = useRouter()
const id = computed(() => Number(route.params.id))

const isLoading = ref(false)
const error = ref(null)
const product = ref(null)
const isEditing = ref(false)
const saving = ref(false)
const form = ref({
  id: null,
  title: '',
  description: '',
  price: 0,
  image: '',
  category: '',
})
const imagePreview = ref('')
const currentPreview = computed(() => imagePreview.value || form.value.image || product.value?.image || '')
const fileInput = ref(null)

async function load() {
  try {
    isLoading.value = true
    product.value = await productService.getById(id.value)
  } catch (e) {
    error.value = e.message
  } finally {
    isLoading.value = false
  }
}

watch(id, load, { immediate: true })

const formattedPrice = computed(() => {
  const val = product.value?.price ?? 0
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val)
  } catch {
    return `$${Number(val).toFixed(2)}`
  }
})

function goBack() {
  router.push('/admin/products')
}

function startEdit() {
  if (!product.value) return
  form.value = {
    id: product.value.id,
    title: product.value.title ?? '',
    description: product.value.description ?? '',
    price: Number(product.value.price ?? 0),
    image: product.value.image ?? '',
    category: product.value.category ?? '',
  }
  imagePreview.value = ''
  isEditing.value = true
}

async function saveEdit() {
  if (saving.value) return
  try {
    // basic validation
    if (!form.value.title?.trim()) {
      await Swal.fire({ icon: 'warning', title: 'Judul wajib diisi' })
      return
    }
    if (Number.isNaN(Number(form.value.price)) || Number(form.value.price) < 0) {
      await Swal.fire({ icon: 'warning', title: 'Harga harus angka positif' })
      return
    }
    saving.value = true
    await productService.update(form.value.id, { ...form.value })
    // reload product
    await load()
    isEditing.value = false
    await Swal.fire({ icon: 'success', title: 'Produk diperbarui' })
  } catch (e) {
    await Swal.fire({ icon: 'error', title: 'Gagal memperbarui', text: e.message })
  } finally {
    saving.value = false
  }
}

function cancelEdit() {
  isEditing.value = false
  imagePreview.value = ''
}

function onFileChange(e) {
  const file = e.target?.files?.[0]
  if (!file) return
  if (!file.type?.startsWith('image/')) {
    Swal.fire({ icon: 'warning', title: 'File harus berupa gambar' })
    return
  }
  const reader = new FileReader()
  reader.onload = () => {
    imagePreview.value = reader.result
    form.value.image = reader.result
  }
  reader.readAsDataURL(file)
}

function clearImage() {
  imagePreview.value = ''
  form.value.image = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}
</script>

<style scoped>
</style>
