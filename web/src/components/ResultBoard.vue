<template>
  <div class="result-board">
    <div class="result-board-text" v-if="pkStore.pk.loser == 'all'">Draw</div>
    <div class="result-board-text" v-else-if="pkStore.pk.loser == 'A' && pkStore.pk.a_id == userStore.user.id">Lose</div>
    <div class="result-board-text" v-else-if="pkStore.pk.loser == 'B' && pkStore.pk.b_id == userStore.user.id">Lose</div>
    <div class="result-board-text" v-else>Win</div>

    <div class="result-board-btn">
      <button @click="restart" type="button" class="btn btn-success">再来！</button>
    </div>
  </div>
</template>

<script setup>
import { usePkStore } from "@/stores/pk";
import { useUserStore } from "@/stores/user";

const pkStore = usePkStore();
const userStore = useUserStore();

const restart = () => {
  pkStore.updateStatus("matching");
  pkStore.updateLoser("none");
  pkStore.updateOppent({
    photo: "https://cdn.acwing.com/media/article/image/2022/08/09/1_1db2488f17-anonymous.png",
    username: "?",
  });
};
</script>

<style scoped>
.result-board {
  height: 30vh;
  width: 30vw;
  background-color: rgba(50, 50, 50, 0.5);
  position: absolute;
  top: 30vh;
  left: 35vw;
}

.result-board-text {
  text-align: center;
  color: white;
  font-size: 50px;
  font-weight: 600;
  font-style: italic;
  padding-top: 5vh;
}

.result-board-btn {
  position: relative;
  top: 7vh;
  text-align: center;
}
</style>
