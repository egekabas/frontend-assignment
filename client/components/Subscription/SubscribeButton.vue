<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { ref, computed} from "vue";
import { storeToRefs } from "pinia";
import { onBeforeMount } from "vue";

const props = defineProps(["creator", "isSubscribed"]);
const emit = defineEmits(["loadSubscription"]);

const creator = computed(() => {
  return props.creator;
})
const isSubscribed = computed(() => {
  return props.isSubscribed;
})

const { isLoggedIn, currentUsername } = storeToRefs(useUserStore());

const loading = ref(false);


async function subscribe() {
  loading.value = true;
  try {
    await fetchy("/api/subscribe", "POST", {
      query: { creator: creator.value },
    });
  } catch (err) {
    console.log(err);
  }
  emit("loadSubscription");
  loading.value = false
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
  emit("loadSubscription");
  loading.value = false
}

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
