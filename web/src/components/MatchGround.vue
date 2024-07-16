<template>
  <div class="match-ground">
    <div class="row">
      <div class="col-4">
        <div class="user-photo">
          <img :src="userStore.user.photo" alt="" />
        </div>
        <div class="user-username">
          {{ userStore.user.username }}
        </div>
      </div>
      <div class="col-4">
        <div class="user-select-bot">
          <select v-model="select_bot" class="form-select" aria-label="Default select example">
            <option value="-1" selected>亲自上阵</option>
            <option v-for="bot in bots" :key="bot.id" :value="bot.id">
              {{ bot.title }}
            </option>
          </select>
        </div>
      </div>

      <div class="col-4">
        <div class="user-photo">
          <img :src="pkStore.pk.oppoent_photo" alt="" />
        </div>
        <div class="user-username">
          {{ pkStore.pk.oppoent_username }}
        </div>
      </div>
    </div>
    <div class="col-12" style="text-align: center; padding-top: 15vh">
      <button @click="click_march_btn" type="button" class="btn btn-info btn-lg">{{ march_btn_info }}</button>
    </div>
  </div>
</template>

<script setup>
import { usePkStore } from "@/stores/pk";
import { useUserStore } from "@/stores/user";
import { ref } from "vue";
import axios from "axios";
const userStore = useUserStore();
const pkStore = usePkStore();
let bots = ref([]);
let select_bot = ref("-1");

let march_btn_info = ref("开始匹配");

const click_march_btn = () => {
  if (march_btn_info.value === "开始匹配") {
    march_btn_info.value = "取消";
    pkStore.pk.socket.send(
      JSON.stringify({
        event: "start-matching",
        bot_id: select_bot.value,
      })
    );
  } else {
    march_btn_info.value = "开始匹配";

    pkStore.pk.socket.send(JSON.stringify({ event: "stop-matching" }));
  }
};

const refresh_bots = () => {
  axios({
    method: "GET",
    url: "http://127.0.0.1:3000/user/bot/getlist/",
    headers: {
      Authorization: "Bearer " + userStore.user.token,
    },
  }).then((resp) => {
    bots.value = resp.data;
  });
};

refresh_bots();
</script>

<style scoped>
.match-ground {
  width: 60vw;
  height: 70vh;
  background-color: rgb(50, 50, 50, 0.5);
  margin: 40px auto;
}

.user-photo {
  align-items: center;
  text-align: center;
  padding-top: 10vh;
}

.user-photo > img {
  border-radius: 50%;
  width: 20vh;
}

.user-username {
  padding-top: 3vh;
  color: white;
  text-align: center;
  font-size: 24px;
  font-weight: 600;
}

.user-select-bot {
  padding-top: 20vh;
}
.user-select-bot > select {
  width: 60%;
  margin: 0 auto;
}
</style>
