<template>
  <Content> user </Content>
</template>

<script setup>
import Content from "@/components/Content.vue";
import axios from "axios";
import { useUserStore } from "@/stores/user";
const userStore = useUserStore();

// add bot
// axios({
//   method:"POST",
//   url : "http://127.0.0.1:3000/user/bot/add/",
//   data : {
//     title : "my bot",
//     description : "test bot",
//     content : "text",
//   },
//   headers : {
//     Authorization : "Bearer " + userStore.user.token,
//   }
// }).then (resp => {
//   console.log(resp.data);
// }).catch (resp => {
//   console.log(resp.data);
// })

// remove bot
// axios({
//   method: "POST",
//   url: "http://127.0.0.1:3000/user/bot/remove/",
//   data: {
//     botId: "5",
//   },
//   headers: {
//     Authorization: "Bearer " + userStore.user.token,
//   },
// })
//   .then((resp) => {
//     console.log(resp.data);
//   })
//   .catch((resp) => {
//     console.log(resp.data);
//   });

//update bot

// axios({
//   method: "POST",
//   url: "http://127.0.0.1:3000/user/bot/update/",
//   data: {
//     botId: "6",
//     title: "update title",
//     description: "update desc",
//     content: "update content",
//   },
//   headers: {
//     Authorization: "Bearer " + userStore.user.token,
//   },
// })
//   .then((resp) => {
//     console.log(resp.data);
//   })
//   .catch((resp) => {
//     console.log(resp.data);
//   });

// getlist

axios({
  method: "GET",
  url: "http://127.0.0.1:3000/user/bot/getlist/",
  headers: {
    Authorization: "Bearer " + userStore.user.token,
  },
})
  .then((resp) => {
    console.log(resp.data);
  })
  .catch((resp) => {
    console.log(resp.data);
  });
</script>

<style scoped></style>
