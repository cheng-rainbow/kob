<template>
  <Navbar />
  <RouterView />
</template>

<script setup>
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap";
import Navbar from "./components/Navbar.vue";
</script>

<style>
body {
  background-image: url(https://cdn.acwing.com/media/article/image/2022/07/07/1_59b8f162fd-background.png);
  background-size: cover;
}
</style>
