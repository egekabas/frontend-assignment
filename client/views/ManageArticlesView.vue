<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
import ArticleManager from "../components/Article/ArticleManager.vue";
import CreateArticleForm from "../components/Article/CreateArticleForm.vue";
import { fetchy } from "../utils/fetchy";

const { currentUsername, validation } = storeToRefs(useUserStore());

//eslint-disable-next-line
const articles = ref(Array<any>());

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
  if (validation.value) {
    await loadArticles();
  }
});
</script>

<template>
  <main>
    <div v-if="articles.length">
      <h1>{{ currentUsername }}'s articles</h1>
      <li v-for="article in articles" :key="article._id">
        <ArticleManager :article="article" />
      </li>
    </div>
    <div v-else>
      <h1>You have no articles yet</h1>
    </div>

    <div v-if="validation">
      <CreateArticleForm @refresh-posts="loadArticles" />
    </div>
    <div v-else><h2>Get validated to post articles!</h2></div>
  </main>
</template>

<style scoped></style>
