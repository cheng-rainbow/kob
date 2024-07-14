import { ref, computed, reactive } from "vue";
import { defineStore } from "pinia";

export const usePkStore = defineStore("pkStore", () => {
  const pk = reactive({
    status: "matching",
    socket: null,
    oppoent_username: "",
    oppoent_photo: "",
    gamemap: null,

    a_id: 0,
    a_sx: 0,
    a_sy: 0,
    b_id: 0,
    b_sx: 0,
    b_sy: 0,

    gameObject: null,

    loser: "none", // A, B all
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

  const updateGame = (game) => {
    pk.gamemap = game.map;
    pk.a_id = game.a_id;
    pk.a_sx = game.a_sx;
    pk.a_sy = game.a_sy;
    pk.b_id = game.b_id;
    pk.b_sx = game.b_sx;
    pk.b_sy = game.b_sy;
  };

  const updateGameObject = (gameObject) => {
    pk.gameObject = gameObject;
  };

  const updateLoser = (loser) => {
    pk.loser = loser;
  };

  return { pk, updateSocket, updateOppent, updateStatus, updateGame, updateGameObject, updateLoser };
});
