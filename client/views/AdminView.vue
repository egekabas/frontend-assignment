<script setup lang="ts">
import LinkToUser from "@/components/User/LinkToUser.vue";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { useUserStore } from "../stores/user";
import { fetchy } from "../utils/fetchy";

const { currentUsername } = storeToRefs(useUserStore());

// eslint-disable-next-line
const requests = ref(Array<any>());

async function loadRequests() {
  let res;
  try {
    res = await fetchy("api/validation/request", "GET");
  } catch (e) {
    return;
  }
  requests.value = res;
}

async function approveRequest(username: string) {
  await fetchy("api/validation/approve", "POST", { body: { requestUser: username } });
  await loadRequests();
}
async function rejectRequest(username: string) {
  await fetchy("api/validation/reject", "POST", { body: { requestUser: username } });
  await loadRequests();
}

onBeforeMount(async () => {
  if (currentUsername.value === "root") {
    await loadRequests();
  }
});
</script>

<template>
  <main>
    <div v-if="currentUsername != 'root'">Need Admin Access for this page</div>
    <div v-else style="text-align: center">
      <h>Validation Requests</h>
      <div v-for="request in requests" v-bind:key="request._id">
        Validation request by <LinkToUser :user="request.user" />
        <button @click="() => approveRequest(request.user)">Approve Request</button>
        <button @click="() => rejectRequest(request.user)">Reject Request</button>
      </div>
    </div>
  </main>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Noticia+Text&family=UnifrakturMaguntia&display=swap");

.article-content {
  font-family: "Noticia Text", serif;
  font-size: 105%;
}

.center {
  display: flex;
  justify-content: center;
  align-items: start;
}

main {
  font-size: 1.7em;
  background-color: var(--blue);
}

.main-comment {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-left: 10%;

  align-items: center;
  gap: 2em;
  margin-bottom: 2em;
  background-color: var(--turqoise);
}

.main-container {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: stretch;
}

.title {
  flex-basis: 20%;
  display: flex;
  justify-content: center;
  align-items: stretch;
  flex-direction: column;
}
.subtitle {
  display: flex;
  justify-content: space-between;
  padding-left: 30%;
  padding-right: 30%;
}
h1 {
  text-align: center;
}

.article {
  flex-basis: 50%;
  widows: 20em;
  padding-left: 10%;
  padding-right: 10%;
  min-height: 15em;
}
.comments {
  flex-basis: 30%;
}
</style>
