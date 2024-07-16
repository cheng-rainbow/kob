import { useUserStore } from "@/stores/user";
import NotFound from "@/views/error/NotFound.vue";
import PkIndex from "@/views/pk/PkIndex.vue";
import RankListIndex from "@/views/ranklist/RankListIndex.vue";
import RecordIndex from "@/views/record/RecordIndex.vue";
import RecordContent from "@/views/record/RecordContent.vue";
import UserAccountLoginView from "@/views/user/account/UserAccountLoginView.vue";
import UserAccountRegisterView from "@/views/user/account/UserAccountRegisterView.vue";
import UserbotIndex from "@/views/user/bot/UserbotIndex.vue";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      redirect: "/pk",
    },
    {
      path: "/pk",
      name: "pk",
      component: PkIndex,
      meta: {
        requestAuth: true,
      },
    },
    {
      path: "/ranklist",
      name: "ranklist",
      component: RankListIndex,
      meta: {
        requestAuth: true,
      },
    },
    {
      path: "/record",
      name: "record",
      component: RecordIndex,
      meta: {
        requestAuth: true,
      },
    },
    {
      path: "/record/:recordId/",
      name: "record_content",
      component: RecordContent,
      meta: {
        requestAuth: true,
      },
    },
    {
      path: "/user/bot",
      name: "user_bot_index",
      component: UserbotIndex,
      meta: {
        requestAuth: true,
      },
    },
    {
      path: "/user/account/login",
      name: "user_account_login",
      component: UserAccountLoginView,
      meta: {
        requestAuth: false,
      },
    },
    {
      path: "/user/account/register",
      name: "user_account_register",
      component: UserAccountRegisterView,
      meta: {
        requestAuth: false,
      },
    },
    {
      path: "/404",
      name: "404",
      component: NotFound,
      meta: {
        requestAuth: false,
      },
    },
    {
      path: "/:pathMatch(.*)", // 匹配所有路径
      redirect: "/404", //重定向到/404
    },
  ],
});

router.beforeEach((to, from, next) => {
  const userStore = useUserStore(); // 在beforeEach外面用的话会报错
  if (to.meta.requestAuth && !userStore.user.is_login) {
    next({ name: "user_account_login" });
  } else {
    next();
  }
});

export default router;
