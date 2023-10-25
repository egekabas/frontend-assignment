<script setup lang="ts">
import { computed, defineProps, onMounted, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["article"]);
const article = ref(props.article);
const articleLink = computed(() => {
  return `/article?id=${article.value._id}`;
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
  <div class = "container">
    <router-link :to="articleLink" class = "article-link">{{ article.title }}</router-link>
    <div>{{ accessMessage }}</div>
  </div>
</template>



<style scoped>

.container{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: end;
  padding-left: 30%;
  padding-right: 30%;
  margin-top: 0.5em;
}

.article-link{
  font-size: 1.3em;
  text-align: left;
}

</style>
