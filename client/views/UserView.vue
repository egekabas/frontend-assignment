<script setup lang="ts">
import ArticleShallowDisplay from "@/components/Article/ArticleShallowDisplay.vue";
import SubscribeButton from "@/components/Subscription/SubscribeButton.vue";
import { onBeforeMount, ref } from "vue";
import { useToastStore } from "../stores/toast";
import { fetchy } from "../utils/fetchy";

const props = defineProps(["username"]);
const username = ref(props.username);

const loading = ref(true);
const articles = ref([]);
const isValidated = ref(false);
const validation = ref({});

async function loadValidation() {
  let res;
  const query = { user: username.value };
  try {
    res = await fetchy("api/validation", "GET", { query, alert: false });
    validation.value = res;
    isValidated.value = true;
  } catch (e) {
    if (e == "Error: Validation for user does not exist!") {
      isValidated.value = false;
      return;
    } else {
      useToastStore().showToast({ message: e.toString(), style: "error" });
      return;
    }
  }
}

async function loadArticles() {
  let res;
  const query = { username: username.value };
  try {
    res = await fetchy("api/articles/noContent", "GET", { query });
  } catch (e) {
    return;
  }

  articles.value = res;
}

onBeforeMount(async () => {
  await Promise.all([loadArticles(), loadValidation()]);

  loading.value = false;
});
</script>

<template>
  <div v-if="loading">Loading</div>
  <div v-else>
    <h1>{{ username }}</h1>
    <div v-if="isValidated">
      <SubscribeButton :creator="username" />
      <p>Validated since {{ validation.dateCreated }}</p>
      <li v-for="article in articles" :key="article._id"><ArticleShallowDisplay :article="article" /></li>
    </div>
  </div>
</template>

<style scoped></style>
