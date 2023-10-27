<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { onBeforeMount } from "vue";


const emit = defineEmits(["requestValidation"]);

async function requestValidation() {
  const res = await fetchy("/api/validation/request", "POST");
  emit("requestValidation");
}
</script>

<template>
  <main>
  <button class="btn btn-primary default" @click="requestValidation">Request Validation</button>
  </main>
</template>

<style scoped>

button{
  /* font-size: 1.5em; */
  padding: 0.3em;
}

main{
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
