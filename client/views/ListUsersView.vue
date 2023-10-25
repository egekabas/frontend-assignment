<script setup lang="ts">
import ArticleShallowDisplay from "@/components/Article/ArticleShallowDisplay.vue";
import SubscribeButton from "@/components/Subscription/SubscribeButton.vue";
import { onBeforeMount, ref } from "vue";
import { useToastStore } from "../stores/toast";
import { fetchy } from "../utils/fetchy";
import { formatDate } from "../utils/formatDate";
import LinkToUser from "@/components/User/LinkToUser.vue";


const validatedUsers = ref(new Array<string>());
const nonValidatedUsers = ref(new Array<string>());
const loading = ref(true);

async function loadUsers() {
  const res = await fetchy(
    "/api/users", "GET"
  );
  await Promise.all(res.map(async (user: any) => {
    const username = user.username;
    try{
      await fetchy("/api/validation", "GET", {query:{user: username}, alert: false});
      validatedUsers.value.push(username);
    } catch{
      nonValidatedUsers.value.push(username);
    }
  }))

}


onBeforeMount(async () => {
  await loadUsers();
  loading.value = false;
});
</script>

<template>
  <main v-if="!loading">
    <h2>Validated Users</h2>
    <div v-for="user in validatedUsers">
      <LinkToUser :user="user"/>
    </div>
    <h2>Non Validated Users</h2>
    <div v-for="user in nonValidatedUsers">
      <LinkToUser :user="user"/>
    </div>
  </main>
  <main v-else>
    <h1>Loading...</h1>
  </main>
</template>

<style scoped>

main{
  text-align: center;
  font-size: 2.2em;
  background-color: --var(blue);
}
h2{
  margin-top: 2em;
}

</style>
