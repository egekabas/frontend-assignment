<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["targetId", "targetType", "color"]);
const targetId = ref(props.targetId);
const targetType = ref(props.targetType);
const color = ref(props.color);

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
    <textarea id="content" v-model="content" placeholder="Type your comment!" required :class="color"> </textarea>
    <button type="submit" class = "default">Create Comment</button>
  </form>
</template>

<style scoped>





form {
  /* background-color: var(--base-bg); */
  /* border-radius: 1em; */
  display: flex;
  flex-direction: row;
  justify-content: center;
}

textarea {

  font-family: inherit;
  font-size: inherit;
  /* height: 3em;
  padding: 0.5em;
  border-radius: 4px; */
  resize: none;
  width: 23em;
  height: 3em;
}

.color0{
  background-color: var(--turqoise);
}
.color1{
  background-color: var(--blue);
}
</style>
