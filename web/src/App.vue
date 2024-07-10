<template>
  <Navbar />
  <RouterView />
</template>

<script setup>
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap";
import Navbar from "./components/Navbar.vue";
import axios from "axios";

// get token
// axios({
//   method: "POST",
//   url: "http://127.0.0.1:3000/user/account/token/",
//   data: {
//     username: "hello",
//     password: "123456",
//   },
// })
//   .then((resp) => {
//     console.log(resp.data);
//   })
//   .catch((error) => {
//     console.log(error.data);
//   });

// get info
// axios({
//   method: "GET",
//   url: "http://127.0.0.1:3000/user/account/info/",
//   headers: {
//     Authorization:
//       "Bearer " +
//       "eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI0Y2NiYjRkMGU3ZmY0YTdiYmVjN2M0MmE1ZDZmODk5MSIsInN1YiI6IjIiLCJpc3MiOiJzZyIsImlhdCI6MTcyMDU4NTQ1NSwiZXhwIjoxNzIxNzk1MDU1fQ.JlvR_MtgAPUygZLNhS6G4uuh_Xtxoq7OjyP21FeKnWo",
//   },
// })
//   .then((resp) => {
//     console.log(resp.data);
//   })
//   .catch((resp) => {
//     console.log(resp.data);
//   });

//register

// axios({
//   method: "POST",
//   url: "http://127.0.0.1:3000/user/account/register/",
//   data: {
//     username: "ld1",
//     password: "123456",
//     confirmedPassword: "123456",
//   },
// })
//   .then((resp) => {
//     console.log(resp.data);
//   })
//   .catch((resp) => {
//     console.log(resp.data);
//   });
</script>

<style>
body {
  background-image: url(https://cdn.acwing.com/media/article/image/2022/07/07/1_59b8f162fd-background.png);
  background-size: cover;
}
</style>
