<script setup lang="ts">
import { computed, ref, defineProps } from 'vue';
import {RouterLink} from 'vue-router';

const props = defineProps(["user"]);
const user = ref<string>(props.user);
const userLink = computed(() => {
  return `/user?username=${user.value}`;
});


</script>

<template>
    <RouterLink :to="userLink">{{user}}</RouterLink>
</template>


