<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <main>
    <section>
      <div v-if="isLoggedIn">
        <h1>Welcome {{ currentUsername }}!</h1>
        <h2>Click the settings button on the right top to manage your profile or your articles!</h2>
        <h2>Or <RouterLink to="/users"> click here</RouterLink> to list other users' profiles!</h2>
      </div>
      <h1 v-else><RouterLink to="/login">Please login!</RouterLink></h1>
    </section>
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
h2 {
  text-align: center;
  margin-top: 2em;
}
main {
  background-color: --var(blue);
}
</style>
