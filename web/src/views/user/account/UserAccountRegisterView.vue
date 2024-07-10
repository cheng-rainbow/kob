<template>
  <Content>
    <div class="row justify-content-md-center">
      <div class="col-3">
        <form @submit.prevent="register">
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

          <div class="mb-3">
            <label for="confirmedPassword" class="form-label"
              >confirmedPassword</label
            >
            <input
              v-model="confirmedPassword"
              type="password"
              class="form-control"
              id="confirmedPassword"
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
import router from "@/router";
import { ref } from "vue";
import axios from "axios";

let username = ref("");
let password = ref("");
let confirmedPassword = ref("");
let error_message = ref("");

const register = () => {
  //register

  axios({
    method: "POST",
    url: "http://127.0.0.1:3000/user/account/register/",
    data: {
      username: username.value,
      password: password.value,
      confirmedPassword: confirmedPassword.value,
    },
  }).then((resp) => {
    if (resp.data.error_message === "success") {
      router.push({ name: "user_account_login" });
    } else {
      error_message.value = resp.data.error_message;
    }
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
