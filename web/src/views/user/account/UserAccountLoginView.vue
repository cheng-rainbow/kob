<template>
  <Content>
    <div class="row justify-content-md-center">
      <div class="col-3">
        <form @submit.prevent="login">
          <div class="mb-3">
            <label for="username" class="form-label">username</label>
            <input
              v-model="username"
              type="text"
              class="form-control"
              id="username"
              aria-describedby="emailHelp"
            />
          </div>

          <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input
              v-model="password"
              type="password"
              class="form-control"
              id="password"
            />
          </div>

          <div class="error-message">{{ error_message }}</div>

          <button type="submit" class="btn btn-primary">Submit</button>
        </form>
      </div>
    </div>
  </Content>
</template>

<script setup>
import Content from "@/components/Content.vue";
import { useUserStore } from "@/stores/user";
import { ref } from "vue";
import router from "@/router";

const userSotre = useUserStore();
let username = ref("");
let password = ref("");
let error_message = ref("");

const login = () => {
  error_message.value = "";
  userSotre.login({
    username: username.value,
    password: password.value,
    success() {
      userSotre.getinfo({
        success() {
          router.push({ name: "home" });
          console.log(userSotre.user);
        },
        error() {
          console.log("getinfo error");
        },
      });
    },
    error() {
      error_message.value = "用户名或密码错误   ";
    },
  });
};
</script>

<style scoped>
button {
  width: 100%;
}

div.error-message {
  color: red;
  margin-bottom: 5px;
}
</style>
