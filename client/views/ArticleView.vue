<script setup lang="ts">
import CommentComponent from "@/components/Comment/CommentComponent.vue";
import CreateCommentForm from "@/components/Comment/CreateCommentForm.vue";
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../utils/fetchy";

const props = defineProps(["articleId"]);
const articleId = ref(props.articleId);

const loading = ref(true);
const notSubscribed = ref(false);

const articleTitle = ref("");
const articleContent = ref("");
const articleDate = ref("");
const articleAuthor = ref("");

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
  let res;
  let query = { articleId: articleId.value };
  try {
    res = await fetchy("api/articles/withContent", "GET", { query });
  } catch (e) {
    if (e == "Error: Error: User user is not subscribed to creator root!") {
      notSubscribed.value = true;
    }
    return;
  }

  articleTitle.value = res.title;
  articleContent.value = res.content;
  articleAuthor.value = res.author;
  articleDate.value = res.dateCreated;
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
  <div v-if="loading">Article Loading</div>
  <div v-else-if="notSubscribed">This content is paid, subscribe to have access</div>
  <div v-else>
    <h1>{{ articleTitle }}</h1>
    <p>{{ articleContent }}</p>
    <CreateCommentForm :targetId="articleId" targetType="article" @refresh-comments="loadComments" />
    <li v-for="comment in comments" :key="comment._id">
      <CommentComponent :comment="comment" />
    </li>
  </div>
</template>

<style scoped></style>
