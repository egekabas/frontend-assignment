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

    <div v-if="articles.length" class = "article-container">
      <h1 style="text-align: center;">{{ currentUsername }}'s articles</h1>
      
      <li v-for="article in articles" :key="article._id" class = "article-list">
        <ArticleManager :article="article" />
      </li>
    </div>

    <div v-else>
      <h1>You have no articles yet</h1>
    </div>


    <div style="background-color: var(--turqoise);">
      <div v-if="validation">
        <CreateArticleForm @refresh-posts="loadArticles" />
      </div>

      <div v-else>
        <h2>Get reporter validation from the <RouterLink to="/manageProfile">Manage Profile</RouterLink>
            page to post articles!</h2>
      </div>
    </div>
  </main>
</template>

<style scoped>

.article-container {
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.article-list{
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

main{
  background-color: var(--blue);
}
</style>
