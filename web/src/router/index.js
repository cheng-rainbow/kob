import NotFound from "@/views/error/NotFound.vue";
import PkIndex from "@/views/pk/PkIndex.vue";
import RankListIndex from "@/views/ranklist/RankListIndex.vue";
import RecordIndex from "@/views/record/RecordIndex.vue";
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
    },
    {
      path: "/ranklist",
      name: "ranklist",
      component: RankListIndex,
    },
    {
      path: "/record",
      name: "record",
      component: RecordIndex,
    },
    {
      path: "/user/bot",
      name: "userbot",
      component: UserbotIndex,
    },
    {
      path: "/404",
      name: "404",
      component: NotFound,
    },
    {
      path: "/:pathMatch(.*)", // 匹配所有路径
      redirect: "/404", //重定向到/404
    },
  ],
});

export default router;
