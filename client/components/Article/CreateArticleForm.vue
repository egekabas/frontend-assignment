<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const title = ref("");
const content = ref("");
const emit = defineEmits(["refreshPosts"]);

const createArticle = async (title: string, content: string) => {
  try {
    await fetchy("api/articles", "POST", {
      body: { title, content },
    });
  } catch (_) {
    return;
  }
  emit("refreshPosts");
  emptyForm();
};

const emptyForm = () => {
  title.value = "";
  content.value = "";
};
</script>

<template>
  <form @submit.prevent="createArticle(title, content)">
    <label for="content">Post Article:</label>
    <textarea id="title" class="title" v-model="title" placeholder="Title of your article!" required> </textarea>
    <textarea id="content" v-model="content" placeholder="Type your article!" required> </textarea>
    <button type="submit" class="pure-button-primary pure-button">Create Article</button>
  </form>
</template>

<style scoped>
form {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}
textarea.title {
  font-size: large;
  height: 2em;
}

textarea {
  font-family: inherit;
  font-size: inherit;
  height: 6em;
  padding: 0.5em;
  border-radius: 4px;
  resize: none;
}
</style>
