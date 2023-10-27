<script setup lang="ts">
import CommentComponent from "@/components/Comment/CommentComponent.vue";
import CreateCommentForm from "@/components/Comment/CreateCommentForm.vue";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount, ref } from "vue";
import { useToastStore } from "../stores/toast";
import { useUserStore } from "../stores/user";
import { fetchy } from "../utils/fetchy";
import { formatDate } from "@/utils/formatDate";
import LinkToUser from "@/components/User/LinkToUser.vue";

const { currentUsername } = storeToRefs(useUserStore());
const props = defineProps(["articleId"]);
const articleId = ref(props.articleId);

const loading = ref(true);
const notSubscribed = ref(false);

const articleTitle = ref("");
const articleContent = ref("");
const articleDate = ref("");
const articleAuthor = ref("");

const authorLink = computed(() => {
  return `/user?username=${articleAuthor.value}`;
});

// eslint-disable-next-line
const comments = ref(Array<any>());

async function loadComments() {
  let res;
  let query = { targetId: articleId.value };
  try {
    res = await fetchy("api/comments/toArticle", "GET", { query });
  } catch (e) {
    return;
  }
  comments.value = res;
}

async function loadArticle() {
  const query = { articleId: articleId.value };
  try {
    const res = await fetchy("api/articles/withContent", "GET", { query, alert: false });

    articleTitle.value = res.title;
    articleContent.value = res.content;
    articleAuthor.value = res.author;
    articleDate.value = formatDate(res.dateCreated);
  } catch (e) {
    if (e != `Error: Error: User ${currentUsername.value} is not subscribed to creator root!`) {
      useToastStore().showToast({ message: e as string, style: "error" });
    }
    notSubscribed.value = true;
    const res = await fetchy("api/articles/noContent", "GET", { query, alert: false });

    articleTitle.value = res.title;
    articleAuthor.value = res.author;
    articleDate.value = formatDate(res.dateCreated);
  }
}

onBeforeMount(async () => {
  await loadArticle();
  if (!notSubscribed.value) {
    await loadComments();
  }
  loading.value = false;
});
</script>

<template>
  <main>
    <div v-if="loading" style="font-size: 2em; text-align: center;">Article Loading</div>
    
    <div v-else class="main-container">

      <div class="title">
        <h1>{{ articleTitle }}</h1>

        <div class = "subtitle">
          
          <div>
            by <LinkToUser :user="articleAuthor"/>
          </div>

          <div>{{ articleDate }}</div>
        </div>

      </div>

      <div class="article">
        <h1 v-if="notSubscribed">
          This content is paid, subscribe to user <RouterLink :to="authorLink">{{ articleAuthor }}</RouterLink> have access
        </h1>

        <div v-if="!notSubscribed">
          <p class = "article-content">{{ articleContent }}</p>
        </div>
      </div>

      <div v-if="!notSubscribed" class="comments">

        <div class = "main-comment">
          <h3> Type out a comment telling <br> us your opinion about the article! </h3>
          <CreateCommentForm :targetId="articleId" targetType="article" @refresh-comments="loadComments" color="color1"/>
        </div>
        
        <div v-if="comments.length">
          <div class = "center">
            <h3 style="text-align: center; margin-bottom: 2em;"> Or look at and comment to other comments</h3>
          </div>

          <li v-for="(comment, idx) in comments" :key="comment._id" class="comment-containter">
            <CommentComponent :comment="comment" :index="idx"/>
          </li>
        </div>

      </div>

    </div>
  </main>
</template>

<style scoped>

@import url('https://fonts.googleapis.com/css2?family=Noticia+Text&family=UnifrakturMaguntia&display=swap');

.article-content{
  font-family: 'Noticia Text', serif;
  font-size: 105%;
}

.center{
  display: flex;
  justify-content: center;
  align-items: start;
}

main{
  font-size: 1.7em;
  background-color: var(--blue);
}

.main-comment{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-left: 10%;
  
  align-items: center;
  gap: 2em;
  margin-bottom: 2em;
  background-color: var(--turqoise);
}

.main-container{
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: stretch;
}

.title{
  flex-basis: 20%;
  display: flex;
  justify-content: center;
  align-items: stretch;
  flex-direction: column;
}
.subtitle{
  display: flex;
  justify-content: space-between;
  padding-left: 30%;
  padding-right: 30%;
  
}
h1{
  text-align: center;
}


.article{
  flex-basis: 50%;
  widows: 20em;
  padding-left: 10%;
  padding-right: 10%;
  min-height: 15em;
}
.comments{
  flex-basis: 30%;
}

</style>
