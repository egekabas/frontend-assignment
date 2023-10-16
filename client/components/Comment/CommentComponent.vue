<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import CreateCommentForm from "./CreateCommentForm.vue";

const props = defineProps(["comment"]);

const curComment = ref(props.comment);
//es-lint-disable-next-line
const prtComments = ref(Array<any>());
//es-lint-disable-next-line
const subComments = ref(Array<any>());

async function loadsubComments() {
  let res;
  let query = { targetId: curComment.value._id };
  try {
    res = await fetchy("api/comments/toComment", "GET", { query });
  } catch (e) {
    return;
  }
  subComments.value = res;
}
async function goToSubcomment(subCommentId: number) {
  prtComments.value.push(curComment.value);
  curComment.value = subComments.value[subCommentId];
  subComments.value = [];
  await loadsubComments();
}
async function goToParentComment() {
  curComment.value = prtComments.value.pop();
  subComments.value = [];
  await loadsubComments();
}

onBeforeMount(async () => {
  await loadsubComments();
});
</script>

<template>
  <div>
    ------------------
    <button v-if="prtComments.length" @click="goToParentComment">Go to parent comment</button><br />
    <CreateCommentForm :targetId="curComment._id" targetType="comment" @refreshComments="loadsubComments" />
    <p>{{ curComment.content }} by {{ curComment.author }}</p>
    <div>subComments</div>
    <li v-for="(comment, index) in subComments" :key="comment._id">
      <div>---</div>
      <p>{{ index }}:{{ comment.content }} by {{ comment.author }}</p>
      <button @click="() => goToSubcomment(index)">Go to sub comment</button>
      <div>---</div>
    </li>
    ------------------
  </div>
</template>

<style scoped></style>
