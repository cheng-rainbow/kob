import { ref, computed, reactive } from "vue";
import { defineStore } from "pinia";
import axios from "axios";

export const useUserStore = defineStore("userStore", () => {
  const user = reactive({
    id: "",
    username: "",
    photo: "",
    token: "",
    is_login: false,
    pulling_info: true,
  });

  const updateUser = (new_user) => {
    user.id = new_user.id;
    user.username = new_user.username;
    user.photo = new_user.photo;
    user.is_login = new_user.is_login;
  };

  const updateToken = (token) => {
    user.token = token;
  };

  const updataPullingInfo = (flag) => {
    user.pulling_info = flag;
  };

  // login
  const login = (data) => {
    axios({
      method: "POST",
      url: "http://127.0.0.1:3000/user/account/token/",
      data: {
        username: data.username,
        password: data.password,
      },
    })
      .then((resp) => {
        if (resp.data.error_message === "success") {
          localStorage.setItem("jwt_token", resp.data.token);
          updateToken(resp.data.token);
          data.success(resp);
        } else {
          data.error(resp);
        }
      })
      .catch((resp) => {
        data.error(resp);
      });
  };

  // getinfo
  const getinfo = (data) => {
    axios({
      method: "GET",
      url: "http://127.0.0.1:3000/user/account/info/",
      headers: {
        Authorization: "Bearer " + user.token,
      },
    })
      .then((resp) => {
        if (resp.data.error_message === "success") {
          updateUser({
            ...resp.data,
            is_login: true,
          });
          data.success();
        } else {
          data.error();
        }
      })
      .catch((resp) => {
        data.error();
      });
  };

  // get logout
  const logout = () => {
    user.username = "";
    user.id = "";
    user.photo = "";
    user.is_login = false;
    user.token = "";
    localStorage.removeItem("jwt_token");
  };

  return { user, login, getinfo, logout, updateToken, updataPullingInfo };
});
