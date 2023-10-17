<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { computed, onMounted, ref } from "vue";
import ArticleManager from "../components/Article/ArticleManager.vue";
import { fetchy } from "../utils/fetchy";

const { currentUsername, validation } = storeToRefs(useUserStore());

//eslint-disable-next-line
const articles = ref(Array<any>());

const isValidated = computed(() => {
  if (Object.keys(validation.value).length > 0) {
    return true;
  } else {
    return false;
  }
});

async function loadArticles() {
  let res;
  try {
    res = await fetchy("/api/articles/noContent", "GET", {
      query: { author: currentUsername.value },
    });
  } catch {
    return;
  }
  articles.value = res;
}

onMounted(async () => {
  if (isValidated.value) {
    await loadArticles();
  }
});
</script>

<template>
  <main>
    <div v-if="!isValidated">Only validated users have access to this page</div>
    <div v-else>
      <h1>{{ currentUsername }}'s articles</h1>
      <li v-for="article in articles" :key="article._id">
        <ArticleManager :article="article" />
      </li>
    </div>
  </main>
</template>

<style scoped></style>
