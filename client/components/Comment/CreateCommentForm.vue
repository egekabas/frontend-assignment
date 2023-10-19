<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["targetId", "targetType"]);
const targetId = props.targetId;
const targetType = props.targetType;

const content = ref("");
const emit = defineEmits(["refreshComments"]);

const createComment = async (content: string) => {
  const body = { content, targetId };
  try {
    if (targetType === "article") await fetchy("api/comments/toArticle", "POST", { body });
    else if (targetType === "comment") await fetchy("api/comments/toComment", "POST", { body });
  } catch (_) {
    return;
  }
  emit("refreshComments");
  emptyForm();
};

const emptyForm = () => {
  content.value = "";
};
</script>

<template>
  <form @submit.prevent="createComment(content)">
    <label for="content">Create Comment:</label>
    <textarea id="content" v-model="content" placeholder="Type your comment!" required> </textarea>
    <button type="submit" class="pure-button-primary pure-button">Create Comment</button>
  </form>
</template>

<style scoped>
form {
  background-color: var(--base-bg);
  /* border-radius: 1em; */
  display: flex;
  flex-direction: column;
  /* gap: 0.5em; */
  /* padding: 1em; */
  textarea.title {
    font-size: large;
    /* height: 2em; */
  }
  width: 50%;
}

textarea {
  font-family: inherit;
  font-size: inherit;
  /* height: 3em;
  padding: 0.5em;
  border-radius: 4px; */
  resize: none;
}
</style>
