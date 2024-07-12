import { ref, computed, reactive } from "vue";
import { defineStore } from "pinia";

export const usePkStore = defineStore("pkStore", () => {
  const pk = reactive({
    status: "matching",
    socket: null,
    oppoent_username: "",
    oppoent_photo: "",
    gamemap: null,
  });

  const updateSocket = (socket) => {
    pk.socket = socket;
  };

  const updateOppent = (oppoent) => {
    pk.oppoent_photo = oppoent.photo;
    pk.oppoent_username = oppoent.username;
  };

  const updateStatus = (status) => {
    pk.status = status;
  };

  const updateGameMap = (gamemap) => {
    pk.gamemap = gamemap;
  };

  return { pk, updateSocket, updateOppent, updateStatus, updateGameMap };
});
