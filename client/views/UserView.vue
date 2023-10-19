<script setup lang="ts">
import ArticleShallowDisplay from "@/components/Article/ArticleShallowDisplay.vue";
import SubscribeButton from "@/components/Subscription/SubscribeButton.vue";
import { onBeforeMount, ref } from "vue";
import { useToastStore } from "../stores/toast";
import { fetchy } from "../utils/fetchy";
import { formatDate } from "../utils/formatDate";

const props = defineProps(["username"]);
const username = ref(props.username);

const loading = ref(true);
//es-lint-disable-next-line
const articles = ref(Array<any>());

const userValidation = ref<false | { [key: string]: any }>(false);

async function loadValidation() {
  let res;
  const query = { user: username.value };
  try {
    res = await fetchy("api/validation", "GET", { query, alert: false });
    userValidation.value = res;
  } catch (e) {
    if (e == "Error: Validation for user does not exist!") {
      userValidation.value = false;
      return;
    } else {
      useToastStore().showToast({ message: e as string, style: "error" });
      return;
    }
  }
}

const bio = ref("");
async function loadBio() {
  let res;
  const query = { user: username.value };
  try {
    res = await fetchy("/api/bios", "GET", { query, alert: false });
    bio.value = res.content;
  } catch (e) {
    if (e == `Error: Bio for user ${username.value} not found`) {
      return;
    } else {
      useToastStore().showToast({ message: e as string, style: "error" });
      return;
    }
  }
}

async function loadArticles() {
  let res;
  const query = { author: username.value };
  try {
    res = await fetchy("/api/articles/noContent", "GET", { query });
  } catch (e) {
    return;
  }
  articles.value = res;
}
onBeforeMount(async () => {
  await Promise.all([loadArticles(), loadBio(), loadValidation()]);
  loading.value = false;
});
</script>

<template>
  <div v-if="loading" style="font-size: xx-large">Loading</div>

  <main v-else class="container">
    <div class="user-info">
      <div>
        <h1>{{ username }}</h1>
        <div v-if="userValidation">
          <div>Validated Reporter since {{ formatDate(userValidation.dateCreated) }}</div>
        </div>
      </div>
      <div>Other info</div>
    </div>

    <div class="bio-subscribe">
      <div>
        <h2>Bio</h2>
        <p>
          {{ bio.length ? bio : "This user does not have a bio yet :(" }}
        </p>
      </div>
      <SubscribeButton :creator="username" />
    </div>

    <div v-if="articles.length">
      <h2>Articles</h2>
      <li v-for="article in articles" :key="article._id"><ArticleShallowDisplay :article="article" /></li>
    </div>
    <div v-else>This user doesnt have any articles (yet?)</div>
  </main>
</template>

<style scoped>
@import "@/assets/main.css";

.user-info {
  display: flex;
  justify-content: space-between;
  padding-right: 20%;
  padding-bottom: 2em;
}

h1,
h2 {
  font-size: 40px;
}

.bio-subscribe {
  display: flex;
  justify-content: space-between;
  padding-right: 20%;
  padding-bottom: 4em;
}

* {
  font-size: 30px;
}
</style>
