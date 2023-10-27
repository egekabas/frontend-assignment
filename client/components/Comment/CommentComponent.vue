<script setup lang="ts">
import { computed, onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import CreateCommentForm from "./CreateCommentForm.vue";
import LinkToUser from "../User/LinkToUser.vue";

const props = defineProps(["comment", "index"]);

const index = computed(() => {
  return props.index;
});

const curComment = ref(props.comment);
//es-lint-disable-next-line
const prtComments = ref(Array<any>());
//es-lint-disable-next-line
const subComments = ref(Array<any>());

const targetId = computed(() => {
  return curComment.value._id;
});


const colorStyle = computed(() => {
  return index.value%2 == 0 ? "color0": "color1";
})

const commentColor = computed(() => {
  return index.value%2 == 0 ? "color1": "color0";
})

async function loadsubComments() {
  let res;
  let query = {targetId: targetId.value };
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
  <div class = "main-container" :class="colorStyle">
    
    <div class = "top-part">

      <div class = "button-content">

        <div class="button-wrapper">
          <button v-if="prtComments.length" @click="goToParentComment" class = "parent">Go back to parent comment</button><br />
        </div>

        <div>
          <p>{{ curComment.content }} </p>
          <p> by <LinkToUser :user="curComment.author"/></p>
        </div>

      </div>

      <div  class = "center">
        <CreateCommentForm :targetId="targetId" targetType="comment" @refreshComments="loadsubComments" :color="commentColor"/>
      </div>

    </div>
    
    <div>

      <div v-for="(comment, index) in subComments" :key="comment._id">
        
        <div class = "subcomment">
        
          <div>
            <p>{{ comment.content }} </p>
            <p> by <LinkToUser :user="comment.author"/></p>
          </div>

          <button @click="() => goToSubcomment(index)" class = "default">Go to <br> subcomment</button>
        
        </div>
        
      </div>

    </div>

  </div>
</template>

<style scoped>

.button-content{
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1em;
}

button.parent{
  min-width: 5.1em;
  max-width: 5.1em;
  height: 4em;
  background-color: var(--bright);
}
button.parent:hover{
	background:linear-gradient(to bottom, #408c99 5%, #599bb3 100%);
	background-color:#408c99;

}

.button-wrapper{
  width: 10%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  padding-right: 1em;
  padding-left: 1em;
  min-width: 5.1em;
  max-width: 5.1em;
  height: 4em;
}
.color0{
  background-color: var(--turqoise);
}
.color1{
  background-color: var(--blue);
}
.subcomment{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-left: 13%;
  margin-bottom: 0.5em;
  
  padding: 1em;

  width: 40%;

  gap: 3em;
  align-items: center;
  font-size: 80%;

  border: 3px solid;
}
button.parent{
  width: 30%;
  margin-top: 0.5em;
}

.center{
  display: flex;
  justify-content: center;
  align-items: center;
}

.top-part{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: stretch;
  gap: 2em;
}

.main-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.comment-content {
  display: flex;
  flex-direction: row;
}

</style>
