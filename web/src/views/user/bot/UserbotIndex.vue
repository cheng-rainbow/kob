<template>
  <div class="container">
    <div class="row">
      <div class="col-3">
        <div class="card" style="margin-top: 20px">
          <div class="card-body">
            <img :src="userStore.user.photo" alt="" style="width: 100%" />
          </div>
        </div>
      </div>

      <div class="col-9">
        <div class="card" style="margin-top: 20px">
          <div class="card-header" style="font-size: 130%">
            我的Bot
            <button type="button" class="btn btn-info float-end" data-bs-toggle="modal" data-bs-target="#add-bot-btn">创建Bot</button>

            <!-- Modal -->
            <div class="modal fade modal-lg" id="add-bot-btn" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                  <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">创建Bot</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                    <div class="mb-3">
                      <label for="add-bot-title" class="form-label">Bot名称</label>
                      <input v-model="botadd.title" type="text" class="form-control" id="add-bot-title" placeholder="请输入Bot名称" />
                    </div>
                    <div class="mb-3">
                      <label for="add-bot-description" class="form-label">简介</label>
                      <textarea v-model="botadd.description" class="form-control" id="add-bot-description" rows="3" placeholder="Bot简介"></textarea>
                    </div>
                    <div class="mb-3">
                      <label for="add-bot-code" class="form-label">代码</label>
                      <textarea v-model="botadd.content" class="form-control" id="add-bot-code" rows="3" placeholder="Bot代码"></textarea>
                    </div>
                  </div>
                  <div class="modal-footer">
                    <div class="error-message">{{ botadd.error_message }}</div>
                    <button type="button" class="btn btn-primary" @click="add_bot">创建</button>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- 显示我的bot列表 -->
          <div class="card-body">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>名称</th>
                  <th>创建时间</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="bot in bots" :key="bot.id">
                  <td valign="middle">{{ bot.title }}</td>
                  <td valign="middle">{{ bot.createtime }}</td>
                  <td>
                    <button type="button" class="btn btn-secondary" style="margin-right: 10px" @click="update_addbot(bot)" data-bs-toggle="modal" :data-bs-target="'#update-modal-' + bot.id">修改</button>
                    <button type="button" class="btn btn-danger" @click="remove_bot(bot)">删除</button>
                    <!-- 修改modal框 -->

                    <div class="modal fade modal-lg" :id="'update-modal-' + bot.id" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                      <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                          <div class="modal-header">
                            <h1 class="modal-title fs-5" id="exampleModalLabel">创建Bot</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                          </div>
                          <div class="modal-body">
                            <div class="mb-3">
                              <label for="add-bot-title" class="form-label">Bot名称</label>
                              <input v-model="botadd.title" type="text" class="form-control" id="add-bot-title" placeholder="请输入Bot名称" />
                            </div>
                            <div class="mb-3">
                              <label for="add-bot-description" class="form-label">简介</label>
                              <textarea v-model="botadd.description" class="form-control" id="add-bot-description" rows="3" placeholder="Bot简介"></textarea>
                            </div>
                            <div class="mb-3">
                              <label for="add-bot-code" class="form-label">代码</label>
                              <textarea v-model="botadd.content" class="form-control" id="add-bot-code" rows="3" placeholder="Bot代码"></textarea>
                            </div>
                          </div>
                          <div class="modal-footer">
                            <div class="error-message">{{ bot.error_message }}</div>
                            <button type="button" class="btn btn-primary" @click="update_bot(bot)">修改</button>
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { reactive, ref } from "vue";
import { useUserStore } from "@/stores/user";
import { Modal } from "bootstrap/dist/js/bootstrap";

const userStore = useUserStore();
let bots = ref([]);

const botadd = reactive({
  title: "",
  description: "",
  content: "",
  error_message: "",
});

// getlist
const refresh_bots = () => {
  axios({
    method: "GET",
    url: "http://127.0.0.1:3000/user/bot/getlist/",
    headers: {
      Authorization: "Bearer " + userStore.user.token,
    },
  }).then((resp) => {
    bots.value = resp.data;
  });
};

// create bot
const add_bot = () => {
  axios({
    method: "POST",
    url: "http://127.0.0.1:3000/user/bot/add/",
    data: {
      title: botadd.title,
      description: botadd.description,
      content: botadd.content,
    },
    headers: {
      Authorization: "Bearer " + userStore.user.token,
    },
  }).then((resp) => {
    if (resp.data.error_message === "success") {
      botadd.title = "";
      botadd.content = "";
      botadd.description = "";
      Modal.getInstance("#add-bot-btn").hide();
      refresh_bots();
    } else {
      botadd.error_message = resp.data.error_message;
    }
  });
};

// remove bot
const remove_bot = (bot) => {
  axios({
    method: "POST",
    url: "http://127.0.0.1:3000/user/bot/remove/",
    data: {
      botId: bot.id,
    },
    headers: {
      Authorization: "Bearer " + userStore.user.token,
    },
  }).then((resp) => {
    if (resp.data.error_message === "success") {
      refresh_bots();
    }
  });
};

// update addbot
const update_addbot = (bot) => {
  botadd.title = bot.title;
  botadd.content = bot.content;
  botadd.description = bot.description;
};

// update bot
const update_bot = (bot) => {
  axios({
    method: "POST",
    url: "http://127.0.0.1:3000/user/bot/update/",
    data: {
      botId: bot.id,
      title: botadd.title,
      description: botadd.description,
      content: botadd.content,
    },
    headers: {
      Authorization: "Bearer " + userStore.user.token,
    },
  }).then((resp) => {
    if (resp.data.error_message === "update success") {
      refresh_bots();
      Modal.getInstance("#update-modal-" + bot.id).hide();
    }
  });
};

refresh_bots();
</script>

<style scoped>
.error-message {
  color: red;
}
</style>

<script>
// add bot
// axios({
//   method:"POST",
//   url : "http://127.0.0.1:3000/user/bot/add/",
//   data : {
//     title : "my bot",
//     description : "test bot",
//     content : "text",
//   },
//   headers : {
//     Authorization : "Bearer " + userStore.user.token,
//   }
// }).then (resp => {
//   console.log(resp.data);
// }).catch (resp => {
//   console.log(resp.data);
// })

// remove bot
// axios({
//   method: "POST",
//   url: "http://127.0.0.1:3000/user/bot/remove/",
//   data: {
//     botId: "5",
//   },
//   headers: {
//     Authorization: "Bearer " + userStore.user.token,
//   },
// })
//   .then((resp) => {
//     console.log(resp.data);
//   })
//   .catch((resp) => {
//     console.log(resp.data);
//   });

//update bot
// axios({
//   method: "POST",
//   url: "http://127.0.0.1:3000/user/bot/update/",
//   data: {
//     botId: "6",
//     title: "update title",
//     description: "update desc",
//     content: "update content",
//   },
//   headers: {
//     Authorization: "Bearer " + userStore.user.token,
//   },
// })
//   .then((resp) => {
//     console.log(resp.data);
//   })
//   .catch((resp) => {
//     console.log(resp.data);
//   });

// getlist
// axios({
//   method: "GET",
//   url: "http://127.0.0.1:3000/user/bot/getlist/",
//   headers: {
//     Authorization: "Bearer " + userStore.user.token,
//   },
// })
//   .then((resp) => {
//     console.log(resp.data);
//   })
//   .catch((resp) => {
//     console.log(resp.data);
//   });
</script>
