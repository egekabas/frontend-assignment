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

    <div>
      <router-link :to="articleLink">{{ article.title }}</router-link>
      <div style="text-size: 0.8em;"> Comments: {{ comments }} </div>
    </div>

    <button v-if="isPaid" class="btn btn-primary" @click="makeFree">Make Free</button>

    <button v-else class="btn btn-primary" @click="makePaid">Make Paid</button>



  </main>
</template>

<style scoped>


.info{
  font-size: 0.9em;
  padding-top: 0px;
  text-align: center;
}

button{
  background-color: white;
  height: 2.4em;
  width: 4em;
  font-size: 1.2em;
}

main{
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  
  margin-left: 20%; padding-left: 3%;
  margin-right: 20%;padding-right: 3%;
  
  padding-top: 1em;
  padding-bottom: 1em;
  
  border: solid 1px;
  margin-top: 1em;
  margin-bottom: 1em;

  background-color: --var(blue);
}

*{
  font-size: 1.1em;
}
</style>
