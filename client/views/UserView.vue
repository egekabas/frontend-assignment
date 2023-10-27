<script setup lang="ts">
import ArticleShallowDisplay from "@/components/Article/ArticleShallowDisplay.vue";
import SubscribeButton from "@/components/Subscription/SubscribeButton.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { useToastStore } from "../stores/toast";
import { fetchy } from "../utils/fetchy";
import { formatDate } from "../utils/formatDate";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());

const props = defineProps(["username"]);
const username = ref(props.username);

const userNotFound = ref(false);
const loading = ref(true);
//es-lint-disable-next-line
const articles = ref(Array<any>());

const userValidation = ref<false | any>(false);

async function loadValidation() {
  let res;
  const query = { user: username.value };
  try {
    res = await fetchy("api/validation", "GET", { query, alert: false });
    userValidation.value = res;
  } catch (e) {
    if (e == `Error: Validation for ${username.value} does not exist!`) {
      userValidation.value = false;
      return;
    } else {
      useToastStore().showToast({ message: e as string, style: "error" });
      return;
    }
  }
}

const isSubscribed = ref(false);

async function checkIfSubscribed() {
  if (isLoggedIn.value) {
    let res;
    try {
      res = await fetchy("/api/isSubscribed", "GET", {
        query: { creator: username.value },
      });
    } catch (err) {
      console.log(err);
    }
    isSubscribed.value = res;
  }
  loading.value = false;
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
    res = await fetchy("/api/articles/noContent", "GET", { query, alert: false });
  } catch (e) {
    if (e == "Error: User not found!") {
      userNotFound.value = true;
    } else {
      useToastStore().showToast({ message: e as string, style: "error" });
    }
  }
  articles.value = res;
}

onBeforeMount(async () => {
  await loadArticles();
  if (!userNotFound.value) {
    await Promise.all([loadBio(), loadValidation(), checkIfSubscribed()]);
  }
  loading.value = false;
});
</script>

<template>
  <div v-if="loading" style="font-size: 3em; text-align: center">Loading</div>
  <h1 v-else-if="userNotFound">USER NOT FOUND</h1>
  <main v-else>
    <div class="user-info">
      <h1>
        {{ username }}
        <div v-if="username == currentUsername">(this is you!)</div>
      </h1>
      <div v-if="userValidation">
        <div>Validated Reporter since {{ formatDate(userValidation.dateCreated) }}</div>
      </div>
    </div>

    <div class="bio">
      <h2>Bio</h2>
      <p>
        {{ bio.length ? bio : "This user does not have a bio yet :(" }}
      </p>
    </div>

    <div v-if="articles.length">
      <h2>Articles</h2>
      <SubscribeButton :creator="username" :is-subscribed="isSubscribed" @load-subscription="checkIfSubscribed" />
      <li v-for="article in articles" :key="article._id" class="articles">
        <ArticleShallowDisplay :article="article" :is-subscribed="isSubscribed" />
      </li>
    </div>
    <h2 v-else>This user doesnt have any articles (yet?)</h2>
  </main>
</template>

<style scoped>
@import "@/assets/main.css";

.bio {
  background-color: var(--turqoise);
}
.articles {
  display: flex;
  justify-content: space-evenly;
  flex-direction: column;
  gap: 3em;
}
.user-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  padding-bottom: 2em;
}

main {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding-bottom: 5%;
  background-color: var(--blue);
}

* {
  text-align: center;
}

main {
  font-size: 1.7em;
}
</style>
