<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container">
      <router-link class="navbar-brand" :to="{ name: 'pk' }">KOB</router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarText"
        aria-controls="navbarText"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarText">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link
              :class="route_name == 'pk' ? 'nav-link myactive' : 'nav-link'"
              aria-current="page"
              :to="{ name: 'pk' }"
              >对战</router-link
            >
          </li>
          <li class="nav-item">
            <router-link
              :class="route_name == 'record' ? 'nav-link myactive' : 'nav-link'"
              :to="{ name: 'record' }"
              >对局列表</router-link
            >
          </li>
          <li class="nav-item">
            <router-link
              :class="
                route_name == 'ranklist' ? 'nav-link myactive' : 'nav-link'
              "
              :to="{ name: 'ranklist' }"
              >排行榜</router-link
            >
          </li>
        </ul>
        <li class="nav-item dropdown myli">
          <router-link
            class="nav-link dropdown-toggle"
            :to="{ name: 'userbot' }"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            ld
          </router-link>
          <ul class="dropdown-menu">
            <li>
              <router-link class="dropdown-item" :to="{ name: 'userbot' }"
                >我的</router-link
              >
            </li>
            <li>
              <router-link class="dropdown-item" :to="{ name: 'userbot' }"
                >退出</router-link
              >
            </li>
          </ul>
        </li>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useRoute } from "vue-router";
import { computed } from "vue";

const route = useRoute();
let route_name = computed(() => route.name);
</script>

<style scoped>
.myli {
  list-style: none;
  color: #9b9d9e;
}

.myactive {
  color: white;
}
</style>
