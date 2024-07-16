<template>
  <PlayGround></PlayGround>
</template>

<script setup>
import PlayGround from "@/components/PlayGround.vue";
import { usePkStore } from "@/stores/pk";

const pkStore = usePkStore();
</script>

<style scoped></style>
