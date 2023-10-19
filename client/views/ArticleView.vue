<script setup lang="ts">
import CommentComponent from "@/components/Comment/CommentComponent.vue";
import CreateCommentForm from "@/components/Comment/CreateCommentForm.vue";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount, ref } from "vue";
import { useToastStore } from "../stores/toast";
import { useUserStore } from "../stores/user";
import { fetchy } from "../utils/fetchy";

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
    articleDate.value = res.dateCreated;
  } catch (e) {
    if (e != `Error: Error: User ${currentUsername.value} is not subscribed to creator root!`) {
      useToastStore().showToast({ message: e as string, style: "error" });
    }
    notSubscribed.value = true;
    const res = await fetchy("api/articles/noContent", "GET", { query, alert: false });

    articleTitle.value = res.title;
    articleAuthor.value = res.author;
    articleDate.value = res.dateCreated;
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
    <div v-if="loading">Article Loading</div>
    <section v-else class="layout">
      <div class="header">
        <div>
          <h1>{{ articleTitle }}</h1>
          <div>
            <div>
              by <RouterLink :to="authorLink">{{ articleAuthor }}</RouterLink>
            </div>
            <div>{{ articleDate }}</div>
          </div>
        </div>
      </div>

      <div class="main">
        <div v-if="notSubscribed">
          This content is paid, subscribe to user <RouterLink :to="authorLink">{{ articleAuthor }}</RouterLink> have access
        </div>

        <div v-if="!notSubscribed">
          <p>{{ articleContent }}</p>
        </div>
      </div>

      <div class="footer">
        <div v-if="!notSubscribed">
          <h3>Comments</h3>
          <CreateCommentForm :targetId="articleId" targetType="article" @refresh-comments="loadComments" />
          <li v-for="comment in comments" :key="comment._id" class="comment-containter">
            <CommentComponent :comment="comment" />
          </li>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.layout {
  margin: 0% 10%;
  height: 768px;
  /* width: 1366px;
  height: 768px; */
  display: grid;
  grid:
    "header" auto
    "main" 1fr
    "footer" 1fr
    / 1fr;
  gap: 8px;
}
.comment-container {
  overflow-y: auto;
  max-height: min-content;
  display: flex;
  align-items: center;
}
.header {
  grid-area: header;
}
.main {
  grid-area: main;
}
.footer {
  grid-area: footer;
}

h1 {
  text-align: center;
}
</style>
