<script setup lang="ts">
import DropdownSetting from "@/components/Settings/DropdownSetting.vue";
import { useToastStore } from "@/stores/toast";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount } from "vue";
import { RouterLink, useRoute } from "vue-router";

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
  <div class="container">
    <div class="Top">
      <nav>
        <div class="title">
          <img src="@/assets/images/logo.svg" />
          <RouterLink :to="{ name: 'Home' }">
            <h1>ReporTTer</h1>
          </RouterLink>
        </div>
        <ul>
          <li>
            <RouterLink :to="{ name: 'Home' }" class="menu_click"> Home </RouterLink>
          </li>
          <li v-if="isLoggedIn"><DropdownSetting class="menu_click" /></li>
          <li v-else>
            <RouterLink :to="{ name: 'Login' }" class="menu_click"> Login </RouterLink>
          </li>
        </ul>
      </nav>
      <article v-if="toast !== null" class="toast" :class="toast.style">
        <p>{{ toast.message }}</p>
      </article>
    </div>

    <div class="Mid">
      <RouterView class="view" />
    </div>

    <div class="Left" style="background-color: lightgray"></div>
    <div class="Right" style="background-color: lightgray"></div>
    <div class="Bottom" style="background-color: lightgray"></div>
  </div>
</template>

<style scoped>
@import "./assets/toast.css";
@import "./assets/main.css";

.container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr 1fr 1fr;
  gap: 0px 0px;
  grid-auto-flow: row;
  grid-template-areas:
    "Top Top Top Top Top Top Top Top Top"
    "Left Mid Mid Mid Mid Mid Mid Mid Right"
    "Left Mid Mid Mid Mid Mid Mid Mid Right"
    "Left Mid Mid Mid Mid Mid Mid Mid Right"
    "Bottom Bottom Bottom Bottom Bottom Bottom Bottom Bottom Bottom";
  width: 100%;
  height: 100%;
}

.Top {
  grid-area: Top;
}

.Bottom {
  grid-area: Bottom;
}

.Left {
  grid-area: Left;
}

.Right {
  grid-area: Right;
}

.Mid {
  grid-area: Mid;
}

td.col-column {
  width: 60px;
  background-color: lightgray;
  height: 100%;
}

nav {
  padding: 1em 2em;
  background-color: lightgray;
  display: flex;
  align-items: center;
}

h1 {
  font-size: 2em;
  margin: 0;
}

.title {
  display: flex;
  align-items: center;
  gap: 0.5em;
}

img {
  height: 2em;
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

.underline {
  text-decoration: underline;
}
</style>
