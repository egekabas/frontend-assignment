<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { onBeforeMount } from "vue";

const props = defineProps(["creator"]);
const creator = ref(props.creator);

const { isLoggedIn, currentUsername } = storeToRefs(useUserStore());
const isSubscribed = ref(false);
const loading = ref(true);

async function checkIfSubscribed() {
  if (isLoggedIn.value) {
    let res;
    try {
      res = await fetchy("/api/isSubscribed", "GET", {
        query: { creator: creator.value },
      });
    } catch (err) {
      console.log(err);
    }
    isSubscribed.value = res;
  }
  loading.value = false;
}

async function subscribe() {
  loading.value = true;
  try {
    await fetchy("/api/subscribe", "POST", {
      query: { creator: creator.value },
    });
  } catch (err) {
    console.log(err);
  }
  await checkIfSubscribed();
}

async function unsubscribe() {
  loading.value = true;
  try {
    await fetchy("/api/unsubscribe", "POST", {
      query: { creator: creator.value },
    });
  } catch (err) {
    console.log(err);
  }
  await checkIfSubscribed();
}

onBeforeMount(async () => {
  await checkIfSubscribed();
});
</script>

<template>
  <div v-if="!isLoggedIn">Log in to subscribe</div>
  <div v-else-if="!loading && currentUsername !== creator">
    <div v-if="isSubscribed">
      <button @click="unsubscribe" class = "default unsubscribe">Unsubscribe from user<br>(you will lose access to paid articles)</button>
    </div>
    <div v-else>
      <button @click="subscribe" class = "default subscribe">Subscribe to user <br>to have access to paid articles</button>
    </div>
  </div>
</template>

<style scoped>

button.subscribe{
  background-color:var(--bright);
}
button.unsubscribe{
  background-color: red;
}



button:hover {
	background:linear-gradient(to bottom, #408c99 5%, #599bb3 100%);
	background-color:#408c99;
}

button:active {
	position:relative;
	top:1px;
}


</style>
