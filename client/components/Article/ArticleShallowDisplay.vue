<script setup lang="ts">
import { computed, ref } from "vue";

const props = defineProps(["article"]);
const article = ref(props.article);
const articleLink = computed(() => {
  return `/article?id=${article.value._id}`;
});
</script>

<template>
  <router-link :to="articleLink">{{ article.title }}</router-link>
</template>

<style scoped></style>
