<script setup lang="ts">
import { ref } from "vue";
import router from "../../router";
import { useUserStore } from "../../stores/user";

const isExtended = ref(false);
const toggle = () => {
  isExtended.value = !isExtended.value;
};
const { logoutUser } = useUserStore();

async function logout() {
  await logoutUser();
  void router.push({ name: "Home" });
}
</script>

<template>
  <main>
    <b-dropdown text="dropdown">
      <b-dropdown-item>First Action</b-dropdown-item>
      <b-dropdown-item>Second Action</b-dropdown-item>
      <b-dropdown-item>Third Action</b-dropdown-item>
    </b-dropdown>

    <!-- <div style="overflow: hidden">
      <button @click="toggle">Settings</button>
      <div v-if="isExtended" class="expander">
        <RouterLink to="/manageProfile">Manage Profile</RouterLink> <br />
        <RouterLink to="/manageArticles">Manage Articles</RouterLink> <br />
        <button @click="logout" class="linker">Logout</button> <br />
      </div>
    </div> -->
  </main>
</template>

<style scoped>
@import "@/assets/main.css";

.expander {
  position: absolute;
  text-align: right;
}
</style>
