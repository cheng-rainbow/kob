<template>
  <!-- 过 ref，你能够在 onMounted 钩子中访问模板中的 div 和 canvas 元素。 -->
  <div ref="parent" class="gamemap">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { GameMap } from "../assets/script/GameMap";

let parent = ref(null);
let canvas = ref(null);

onMounted(() => {
  new GameMap(canvas.value.getContext("2d"), parent.value);
});
</script>

<style scoped>
.gamemap {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
