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
    <!-- <b-dropdown text="dropdown">
      <b-dropdown-item>First Action</b-dropdown-item>
      <b-dropdown-item>Second Action</b-dropdown-item>
      <b-dropdown-item>Third Action</b-dropdown-item>
    </b-dropdown> -->

    <div style="overflow: hidden">
      <button @click="toggle" class = "pure" :style="{fontWeight: isExtended ? 'bold' : 'normal'}">Settings</button>

      <div v-if="isExtended" class="expander">
        <RouterLink to="/manageProfile" class="basic-text">Manage Profile</RouterLink>
        <RouterLink to="/manageArticles" class="basic-text">Manage Articles</RouterLink> 
        <button @click="logout" class = "pure right">Logout</button>
      </div>
    </div>
  </main>
</template>

<style scoped>
@import "@/assets/main.css";


*{
  background-color: var(--green);
  text-decoration: underline;
}
.expander {
  position: absolute;
  text-align: right;
  right: 0;
  margin-top: .5em;
  padding-right: 2.4em;
  padding-left: 2em;
  height: 7em;
  width: 4em;
  display: flex;
  flex-direction: column;
  align-items: right;
  justify-content: space-evenly;
}

button.right{
  text-align: end;
  justify-content: end;
}

button.pure{
  border: none;
  color: inherit;
  cursor: pointer;
  font: inherit;
  padding: 0;
  font-size: inherit;
}

.basic-text{
  color: black;
  text-decoration: none;
}
</style>
