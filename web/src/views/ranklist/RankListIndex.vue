<template>
  <Content>
    <div class="card-body">
      <table class="table table-hover" style="text-align: center">
        <thead>
          <tr>
            <th>玩家</th>
            <th>天梯分</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td valign="middle">
              <img :src="user.photo" alt="" class="record-user-photo" />
              &nbsp;
              <span class="record-user-username">{{ user.username }}</span>
            </td>

            <td>{{ user.rating }}</td>
            <td>
              <button @click="open_record_content(record.record.id)" type="button" class="btn btn-secondary">查看录像</button>
            </td>
          </tr>
        </tbody>
      </table>

      <nav aria-label="..." style="float: right">
        <ul class="pagination">
          <li class="page-item" @click="click_page(-2)">
            <a class="page-link" href="#">前一页</a>
          </li>

          <li :class="'page-item ' + page.is_active" v-for="page in pages" :key="page.number" @click="click_page(page.number)">
            <a class="page-link" href="#">{{ page.number }}</a>
          </li>

          <li class="page-item" @click="click_page(-1)">
            <a class="page-link" href="#">下一页</a>
          </li>
        </ul>
      </nav>
    </div>
  </Content>
</template>

<script setup>
import Content from "@/components/Content.vue";
import { useUserStore } from "@/stores/user";
import axios from "axios";
import { ref } from "vue";
import { useRecordStore } from "@/stores/record";
import router from "@/router/index";
import { usePkStore } from "@/stores/pk";

const userStore = useUserStore();
const recordStore = useRecordStore();
const pkStore = usePkStore();

let current_page = 1;
let users = ref();
let users_count = ref(0);
let pages = ref([]);

const click_page = (page) => {
  if (page == -2) page = current_page - 1;
  else if (page == -1) page = current_page + 1;
  let max_pages = parseInt(Math.ceil(users_count.value / 3));

  if (page >= 1 && page <= max_pages) {
    pull_page(page);
  }
};

const update_pages = () => {
  let max_pages = parseInt(Math.ceil(users_count.value / 3));
  console.log("max_pages : " + max_pages, users_count.value);
  let new_pages = [];
  for (let i = current_page - 2; i <= current_page + 2; i++) {
    if (i >= 1 && i <= max_pages) {
      new_pages.push({
        number: i,
        is_active: i === current_page ? "active" : "",
      });
    }
  }
  pages.value = new_pages;
};

const pull_page = (page) => {
  current_page = page;
  axios({
    method: "GET",
    url: "http://127.0.0.1:3000/ranklist/getlist/",
    params: {
      page: page,
    },
    headers: {
      Authorization: "Bearer " + userStore.user.token,
    },
  }).then((resp) => {
    users.value = resp.data.users;
    users_count.value = resp.data.users_count;
    update_pages();
    console.log(users.value, users_count.value);
  });
};
pull_page(current_page);
</script>

<style scoped>
.record-user-photo {
  height: 4vh;
}

.active {
  background-color: lightblue;
  color: lightblue;
}
</style>
