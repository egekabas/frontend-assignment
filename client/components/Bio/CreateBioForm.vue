<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const content = ref("");
const emit = defineEmits(["refreshBio"]);

const createBio = async (content: string) => {
  const body = { content };
  try {
    await fetchy("api/bios", "POST", { body });
  } catch (_) {
    return;
  }
  emit("refreshBio");
  emptyForm();
};

const emptyForm = () => {
  content.value = "";
};
</script>

<template>
  <form @submit.prevent="createBio(content)">
    <textarea id="content" v-model="content" placeholder="Type your bio!" required> </textarea>
    <button type="submit" class="default">Create Bio</button>
  </form>
</template>

<style scoped>
button {
  width: 5.5em;
  height: 3em;
}

form {
  /* background-color: var(--base-bg); */
  /* border-radius: 1em; */
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
}

textarea {
  background-color: var(--blue);
  font-family: inherit;
  font-size: inherit;
  /* height: 3em;
  padding: 0.5em;
  border-radius: 4px; */
  resize: none;
  width: 23em;
  height: 10em;
}
</style>
