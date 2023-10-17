<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["article"]);
const article = ref(props.article);

const loading = ref(false);
const isPaid = ref(true);

const articleLink = computed(() => {
  return `/article?id=${article.value._id}`;
});
const comments = ref(0);

async function loadCommentCnt() {
  let res;
  let query = { targetId: article.value._id };
  try {
    res = await fetchy("api/comments/toArticle", "GET", { query });
  } catch (e) {
    console.log(e);
    return;
  }
  comments.value = res.length;
}

async function loadAccess() {
  loading.value = true;
  let res;
  try {
    res = await fetchy("/api/articles/isPaid", "GET", {
      query: { article: article.value._id },
    });
  } catch {
    return;
  }
  isPaid.value = res;
  loading.value = false;
}

async function makePaid() {
  try {
    await fetchy("/api/makePaid", "POST", {
      body: { articleId: article.value._id },
    });
    await loadAccess();
  } catch {
    return;
  }
}
async function makeFree() {
  try {
    await fetchy("/api/makeFree", "POST", {
      body: { articleId: article.value._id },
    });
    await loadAccess();
  } catch {
    return;
  }
}

onMounted(async () => {
  await loadAccess();
  await loadCommentCnt();
});
</script>

<template>
  <main>
    <router-link :to="articleLink">{{ article.title }}</router-link>
    <div>Amount of comments {{ comments }}</div>
    <div v-if="!loading">
      <div v-if="isPaid">
        <button class="btn btn-primary" @click="makeFree">Make Free</button>
      </div>
      <div v-else>
        <button class="btn btn-primary" @click="makePaid">Make Paid</button>
      </div>
    </div>
  </main>
</template>

<style scoped></style>
