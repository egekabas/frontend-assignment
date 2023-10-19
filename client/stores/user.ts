import { defineStore } from "pinia";
import { computed, ref } from "vue";

import { fetchy } from "@/utils/fetchy";

export const useUserStore = defineStore(
  "user",
  () => {
    const currentUsername = ref("");
    // eslint-disable-next-line
    const validation = ref<false | { [key: string]: any }>(false);
    const isLoggedIn = computed(() => currentUsername.value !== "");

    const resetStore = () => {
      currentUsername.value = "";
    };

    const createUser = async (username: string, password: string) => {
      await fetchy("api/users", "POST", {
        body: { username, password },
      });
    };

    const loginUser = async (username: string, password: string) => {
      await fetchy("api/login", "POST", {
        body: { username, password },
      });
    };

    const updateSession = async () => {
      try {
        const { username } = await fetchy("api/session", "GET", { alert: false });
        currentUsername.value = username;
        try {
          validation.value = await fetchy("api/validation", "GET", {
            query: { user: currentUsername.value },
            alert: false,
          });
        } catch {
          validation.value = false;
        }
      } catch {
        currentUsername.value = "";
      }
    };

    const logoutUser = async () => {
      await fetchy("api/logout", "POST");
      resetStore();
    };

    const deleteUser = async () => {
      await fetchy("api/users", "DELETE");
      resetStore();
    };

    return {
      currentUsername,
      isLoggedIn,
      createUser,
      loginUser,
      updateSession,
      logoutUser,
      deleteUser,
      validation,
    };
  },
  { persist: true },
);
