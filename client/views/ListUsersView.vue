<script setup lang="ts">
import LinkToUser from "@/components/User/LinkToUser.vue";
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../utils/fetchy";

const validatedUsers = ref(new Array<[string, number]>());
const nonValidatedUsers = ref(new Array<[string, number]>());
const loading = ref(true);

async function loadUsers() {
  const res = await fetchy("/api/users", "GET");
  await Promise.all(
    res.map(async (user: any) => {
      const username = user.username;
      let articleCnt = 0;
      try {
        const res = await fetchy("/api/articles/noContent", "GET", { query: { author: username }, alert: false });
        articleCnt = res.length;
      } catch {
        articleCnt = 0;
      }
      try {
        await fetchy("/api/validation", "GET", { query: { user: username }, alert: false });
        validatedUsers.value.push([username, articleCnt]);
      } catch {
        nonValidatedUsers.value.push([username, articleCnt]);
      }
    }),
  );

  validatedUsers.value.sort((a, b) => b[1] - a[1]);
  nonValidatedUsers.value.sort((a, b) => b[1] - a[1]);
}

onBeforeMount(async () => {
  await loadUsers();
  loading.value = false;
});
</script>

<template>
  <main v-if="!loading">
    <h2>Validated Users</h2>
    <div v-for="([user, articleCnt], idx) in validatedUsers" class="user-view" v-bind:key="idx">
      <LinkToUser :user="user" class="large-font" />
      <div>{{ articleCnt }} articles</div>
    </div>

    <h2>Non Validated Users</h2>
    <div v-for="([user, articleCnt], idx) in nonValidatedUsers" class="user-view" v-bind:key="idx">
      <LinkToUser :user="user" class="large-font" />
      <div>{{ articleCnt }} articles</div>
    </div>
  </main>
  <main v-else>
    <h1>Loading...</h1>
  </main>
</template>

<style scoped>
.large-font {
  font: 3em;
}
main {
  text-align: center;
  font-size: 2.2em;
  background-color: var(--blue);
}
h2 {
  margin-top: 1.5em;
}
.user-view {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 40%;
  padding-right: 40%;
  margin-bottom: 0.3em;
}
</style>
