<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-semibold">Users</h1>
      <button class="btn-primary" @click="openCreate()">New User</button>
    </div>

    <div v-if="isLoading" class="p-4">Loading...</div>
    <div v-else-if="error" class="p-4 text-red-600">{{ error }}</div>

    <!-- Table presentation -->
    <div class="overflow-x-auto bg-white rounded-lg">
      <table class="w-full table-auto">
        <thead class="bg-gray-50">
          <tr>
            <th
              class="px-4 py-3 text-left text-sm font-semibold text-gray-700 capitalize"
            >
              Name
            </th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">
              Email
            </th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">
              Username
            </th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">
              Phone
            </th>
            <th
              class="px-4 py-3 text-right text-sm font-semibold text-gray-700"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr v-for="u in users" :key="u.id" class="align-top">
            <td class="px-4 py-3 align-middle">
              <div class="font-medium capitalize">
                {{ (u.name?.firstname || "") + " " + (u.name?.lastname || "") }}
              </div>
            </td>
            <td class="px-4 py-3 align-middle">
              <div class="text-sm text-gray-800">{{ u.email }}</div>
            </td>
            <td class="px-4 py-3 align-middle">
              <div class="text-sm text-gray-800 capitalize">
                {{ u.username }}
              </div>
            </td>
            <td class="px-4 py-3 align-middle">
              <div class="text-sm text-gray-800">{{ u.phone }}</div>
            </td>
            <td class="px-4 py-3 align-middle">
              <div class="flex gap-2 justify-end">
                <button class="btn-secondary" @click="openEdit(u)">Edit</button>
                <button class="btn-danger" @click="remove(u.id)">Delete</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
    >
      <div class="bg-white rounded-lg p-6 w-full max-w-lg">
        <h3 class="text-lg font-semibold mb-4">
          {{ form.id ? "Edit" : "Create" }} User
        </h3>
        <div class="grid gap-3">
          <input v-model="form.email" placeholder="Email" class="input-field" />
          <input
            v-model="form.username"
            placeholder="Username"
            class="input-field"
          />
          <input
            v-model="form.password"
            placeholder="Password"
            class="input-field"
            type="password"
          />
          <div class="grid grid-cols-2 gap-3">
            <input
              v-model="form.name.firstname"
              placeholder="First name"
              class="input-field"
            />
            <input
              v-model="form.name.lastname"
              placeholder="Last name"
              class="input-field"
            />
          </div>
          <input v-model="form.phone" placeholder="Phone" class="input-field" />
        </div>
        <div class="mt-4 flex justify-end gap-2">
          <button class="btn-secondary" @click="closeModal">Cancel</button>
          <button class="btn-primary" @click="save">Save</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Swal from "sweetalert2";
import { userService } from "@/services/userService";

const users = ref([]);
const isLoading = ref(false);
const error = ref(null);

const showModal = ref(false);
const form = ref({
  id: null,
  email: "",
  username: "",
  password: "",
  name: { firstname: "", lastname: "" },
  phone: "",
});

const load = async () => {
  try {
    isLoading.value = true;
    users.value = await userService.getAllUsers();
  } catch (e) {
    error.value = e.message;
  } finally {
    isLoading.value = false;
  }
};

const openCreate = () => {
  form.value = {
    id: null,
    email: "",
    username: "",
    password: "",
    name: { firstname: "", lastname: "" },
    phone: "",
  };
  showModal.value = true;
};

const openEdit = (u) => {
  form.value = JSON.parse(JSON.stringify(u));
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const save = async () => {
  try {
    const isUpdate = !!form.value.id;
    if (isUpdate) {
      await userService.updateUser(form.value.id, form.value);
    } else {
      await userService.createUser(form.value);
    }
    await load();
    closeModal();
    await Swal.fire({
      icon: "success",
      title: "Berhasil",
      text: isUpdate ? "User diperbarui" : "User ditambahkan",
    });
  } catch (e) {
    await Swal.fire({ icon: "error", title: "Gagal", text: e.message });
  }
};

const remove = async (id) => {
  const res = await Swal.fire({
    title: "Hapus user ini?",
    text: "Tindakan ini tidak dapat dibatalkan.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Ya, hapus",
    cancelButtonText: "Batal",
  });
  if (!res.isConfirmed) return;
  try {
    await userService.deleteUser(id);
    await load();
    await Swal.fire({
      icon: "success",
      title: "Berhasil",
      text: "User dihapus",
    });
  } catch (e) {
    await Swal.fire({ icon: "error", title: "Gagal", text: e.message });
  }
};

onMounted(load);
</script>
