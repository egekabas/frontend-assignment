<script setup lang="ts">
import DropdownSetting from "@/components/Settings/DropdownSetting.vue";
import { useToastStore } from "@/stores/toast";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount } from "vue";
import { RouterLink, useRoute } from "vue-router";
import GlobalStyling from "./GlobalStyling.vue"

const currentRoute = useRoute();
const currentRouteName = computed(() => currentRoute.name);
const userStore = useUserStore();
const { isLoggedIn } = storeToRefs(userStore);
const { toast } = storeToRefs(useToastStore());

// Make sure to update the session before mounting the app in case the user is already logged in
onBeforeMount(async () => {
  try {
    await userStore.updateSession();
  } catch {
    // User is not logged in
  }
});
</script>

<template>
  <GlobalStyling/>
  <div class="container">
    <div>
      <nav>

        <div class = "top-group">
          <RouterLink :to="{ name: 'Home' }" style="text-decoration: none;">
            <h1 class = "app-name">Reportter</h1>
          </RouterLink>
        </div>

        <div class = "top-group">
          <RouterLink :to="{ name: 'Home' }" class="menu-item"> Home </RouterLink>
          <div v-if="isLoggedIn"><DropdownSetting class="menu-item"/></div>
          <div v-else> <RouterLink :to="{ name: 'Login' }" class="menu-item"> Login </RouterLink> </div>
        </div>

      </nav>

      <article v-if="toast !== null" class="toast" :class="toast.style">
        <p>{{ toast.message }}</p>
      </article>

    </div>

    <div class="Mid">
      <RouterView class="view" />
    </div>

  </div>
</template>

<style scoped>
@import "./assets/toast.css";

@import url('https://fonts.googleapis.com/css2?family=UnifrakturMaguntia&display=swap');

.app-name{
  font-family: 'UnifrakturMaguntia', cursive;
  text-decoration: none;
  font-size: 5em;
}
.container{
  background-color: var(--blue);
  height: 100vh;
}

nav {
  padding: 1em 2em;
  background-color: var(--green);
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 4em;
  text-decoration: underline;
}

.top-group{
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  flex-direction: row;
  width: 15%;
  margin-left: 5em;
  margin-right: 5em;
}

.menu-item{
  font-size: 2.5em;
  margin-left: 0.5em;
  margin-right: 0.5em;
  
}

img {
  height: 3em;
}

h1 {
  font-size: 3em;
}

a {
  font-size: large;
  color: black;
  text-decoration: none;
}

ul {
  list-style-type: none;
  margin-left: auto;
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 1em;
}

</style>
