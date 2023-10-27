<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["article"]);
const article = computed(() => {
  return props.article;
})

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
  <div class = "main">

    <div>
      <router-link :to="articleLink">{{ article.title }}</router-link>
      <div style="text-size: 0.8em;"> Comments: {{ comments }} </div>
    </div>

    <div v-if="isPaid" class = "button-container">
      Paid Article
      <button  @click="makeFree" class = "make-free">Make Free</button>
    </div>
    <div v-else class = "button-container">
      Free Article
      <button @click="makePaid" class = "make-paid">Make Paid</button>
    </div>




  </div>
</template>

<style scoped>
.button-container{
  display: flex;
  align-items: center;
  gap: 1em;
}
.make-free{
  background-color: var(--bright);
}
.make-paid{
  background-color: yellow;
}

button:hover{
  background:linear-gradient(to bottom, #408c99 5%, #599bb3 100%);
	background-color:#408c99;
}

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

div.main{
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

  background-color: var(--turqoise);

}

*{
  font-size: 1.1em;
}
</style>
