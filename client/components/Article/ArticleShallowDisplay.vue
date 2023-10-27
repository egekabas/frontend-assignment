<script setup lang="ts">
import { computed, defineProps, onMounted, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["article", "isSubscribed"]);
const article = computed(() => {
  return props.article;
});
const articleLink = computed(() => {
  return `/article?id=${article.value._id}`;
});
const isSubscribed = computed(() => {
  return props.isSubscribed;
});

const isPaid = ref(false);
const accessMessage = computed(() => (isPaid.value ? "Paid Article" : "Free Article"));

async function loadAccess() {
  let res;
  try {
    res = await fetchy("/api/articles/isPaid", "GET", {
      query: { article: article.value._id },
    });
  } catch {
    return;
  }
  isPaid.value = res;
}

onMounted(async () => {
  await loadAccess();
});
</script>

<template>
  <div class="container" :class="{ warning: isPaid && !isSubscribed }">
    <router-link :to="articleLink" class="article-link">{{ article.title }}</router-link>
    <div>{{ accessMessage }}</div>
  </div>
</template>

<style scoped>
.warning {
  background-color: rgb(189, 82, 82);
}

.container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: end;
  margin-left: 30%;
  margin-right: 30%;
  padding: 0.3em;
  margin-top: 0.5em;
}

.article-link {
  font-size: 1.3em;
  text-align: left;
}
</style>
