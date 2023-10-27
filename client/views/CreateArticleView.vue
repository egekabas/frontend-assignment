<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";

const { currentUsername, validation } = storeToRefs(useUserStore());

const title = ref("");
const content = ref("");

const createArticle = async (title: string, content: string) => {
  if(!window.confirm(
    "Articles can't be edited or deleted afterwards. Are you sure you want to post this article?"
  )){
    return;
  }

  try {
    await fetchy("api/articles", "POST", {
      body: { title, content },
    });
  } catch (_) {
    return;
  }
  emptyForm();
};

const emptyForm = () => {
  title.value = "";
  content.value = "";
};
</script>

<template>

  <h1 v-if="!validation">
    Get reporter validation from the <RouterLink to="/manageProfile">Manage Profile</RouterLink>
    page to post articles!
  </h1>

  <form v-else @submit.prevent="createArticle(title, content)">
    <h1 style="text-align:center; font-size: 150%;">Create a New Article:</h1>
    <textarea id="title" style="height: 1.5em; text-align: center; font-size: 150%;" v-model="title" placeholder="Title of your article!" required> </textarea>
    <textarea id="content" v-model="content" placeholder="Type your article!" required> </textarea>
    <button type="submit" class="pure-button-primary pure-button">Create Article</button>
  </form>

</template>

<style scoped>

@import url('https://fonts.googleapis.com/css2?family=Noticia+Text&family=UnifrakturMaguntia&display=swap');

button{
  height: 5em;
  font-size: 150%;
}
form {
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
  background-color: var(--blue);
}
textarea {
  background-color: var(--turqoise);
  font-family: 'Noticia Text', serif;
  height: 20em;
  padding: 0.5em;
  border-radius: 4px;
  resize: none;
}
*{
  font-size: 110%;
}

</style>
