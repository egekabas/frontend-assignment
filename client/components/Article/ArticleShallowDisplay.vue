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
  <div>{{ accessMessage }}</div>
  <router-link :to="articleLink">{{ article.title }}</router-link>
</template>

<style scoped></style>
