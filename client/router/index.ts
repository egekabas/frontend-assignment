import { storeToRefs } from "pinia";
import { createRouter, createWebHistory } from "vue-router";

import { useUserStore } from "@/stores/user";
import ArticleView from "../views/ArticleView.vue";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import ManageArticlesView from "../views/ManageArticlesView.vue";
import ManageProfile from "../views/ManageProfile.vue";
import NotFoundView from "../views/NotFoundView.vue";
import UserView from "../views/UserView.vue";
import ListUsersViews from "../views/ListUsersView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Home",
      component: HomeView,
    },
    {
      path: "/manageProfile",
      name: "Manage User",
      component: ManageProfile,
      meta: { requiresAuth: true },
    },
    {
      path: "/login",
      name: "Login",
      component: LoginView,
      meta: { requiresAuth: false },
      beforeEnter: (to, from) => {
        const { isLoggedIn } = storeToRefs(useUserStore());
        if (isLoggedIn.value) {
          return { name: "Settings" };
        }
      },
    },
    {
      path: "/article",
      name: "Article",
      component: ArticleView,
      props: (route) => ({ articleId: route.query.id }),
      meta: { requiresAuth: true },
    },
    {
      path: "/user",
      name: "User",
      component: UserView,
      props: (route) => ({ username: route.query.username }),
      meta: { requiresAuth: false },
    },
    {
      path: "/users",
      name: "Users",
      component: ListUsersViews,
      meta: { requiresAuth: false },
    },
    {
      path: "/manageArticles",
      name: "Manage Articles",
      component: ManageArticlesView,
      meta: { requiresAuth: true },
    },
    {
      path: "/:catchAll(.*)",
      name: "not-found",
      component: NotFoundView,
    },
  ],
});

/**
 * Navigation guards to prevent user from accessing wrong pages.
 */
router.beforeEach((to, from) => {
  const { isLoggedIn } = storeToRefs(useUserStore());

  if (to.meta.requiresAuth && !isLoggedIn.value) {
    return { name: "Login" };
  }
});

export default router;
