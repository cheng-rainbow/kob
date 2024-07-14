<template>
  <PlayGround v-if="pkStore.pk.status === 'playing'"></PlayGround>
  <MatchGround v-if="pkStore.pk.status === 'matching'" />
  <ResultBoard v-if="pkStore.pk.loser != 'none'" />
</template>

<script setup>
import PlayGround from "@/components/PlayGround.vue";
import { usePkStore } from "@/stores/pk";
import { useUserStore } from "@/stores/user";
import { onMounted, onUnmounted } from "vue";
import MatchGround from "@/components/MatchGround.vue";
import ResultBoard from "@/components/ResultBoard.vue";
const pkStore = usePkStore();
const userStore = useUserStore();

// 当前登录的用户的id, 应该传递的是当前用户的token, 用于验证身份, 而不是直接传递id
const socketUrl = `ws://127.0.0.1:3000/websocket/${userStore.user.token}`;

let socket = null;

onMounted(() => {
  pkStore.updateOppent({
    username: "?",
    photo: "https://cdn.acwing.com/media/article/image/2022/08/09/1_1db2488f17-anonymous.png",
  });

  socket = new WebSocket(socketUrl);

  // 建立连接时执行
  socket.onopen = () => {
    pkStore.updateSocket(socket);
    console.log("connected");
  };

  // 接收到信息时执行
  socket.onmessage = (msg) => {
    const data = JSON.parse(msg.data);
    if (data.event === "start-matching") {
      pkStore.updateOppent({
        username: data.opponent_username,
        photo: data.opponent_photo,
      });
      setTimeout(() => {
        pkStore.updateStatus("playing");
      }, 1000);

      pkStore.updateGame(data.game);
    } else if (data.event === "move") {
      const game = pkStore.pk.gameObject;
      const [snake0, snake1] = game.snakes;
      snake0.set_direction(data.a_direction);
      snake1.set_direction(data.b_direction);
    } else if (data.event === "result") {
      console.log(data);
      const game = pkStore.pk.gameObject;
      const [snake0, snake1] = game.snakes;

      if (data.loser === "all" || data.loser === "A") {
        snake0.status = "die";
      }
      if (data.loser === "all" || data.loser === "B") {
        snake1.status = "die";
      }

      pkStore.updateLoser(data.loser);
    }
  };

  // 关闭时执行
  socket.onclose = () => {
    console.log("disconnected!");
  };
});

onUnmounted(() => {
  socket.close();
  pkStore.updateStatus("matching");
});
</script>

<style scoped></style>
