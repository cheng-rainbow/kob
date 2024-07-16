<template>
  <Content>
    <div class="card-body">
      <table class="table table-hover" style="text-align: center">
        <thead>
          <tr>
            <th>A</th>
            <th>B</th>
            <th>对局结果</th>
            <th>对战时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in records" :key="record.record.id">
            <td valign="middle">
              <img :src="record.a_photo" alt="" class="record-user-photo" />
              &nbsp;
              <span class="record-user-username">{{ record.a_username }}</span>
            </td>
            <td valign="middle">
              <img :src="record.b_photo" alt="" class="record-user-photo" />
              &nbsp;
              <span class="record-user-username">{{ record.b_username }}</span>
            </td>
            <td>{{ record.result }}</td>
            <td>{{ record.record.createtime }}</td>
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
let records = ref();
let records_count = ref(0);
let pages = ref([]);

const click_page = (page) => {
  if (page == -2) page = current_page - 1;
  else if (page == -1) page = current_page + 1;
  let max_pages = parseInt(Math.ceil(records_count.value / 10));

  if (page >= 1 && page <= max_pages) {
    pull_page(page);
  }
};

const update_pages = () => {
  let max_pages = parseInt(Math.ceil(records_count.value / 10));
  console.log("max_pages : " + max_pages, records_count.value);
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

const stringTo2D = (map) => {
  let g = [];
  for (let i = 0, k = 0; i < 13; i++) {
    let line = [];
    for (let j = 0; j < 14; j++, k++) {
      if (map[k] === "1") {
        line.push(1);
      } else {
        line.push(0);
      }
    }
    g.push(line);
  }
  return g;
};

const open_record_content = (recordId) => {
  for (const record of records.value) {
    if (record.record.id === recordId) {
      recordStore.updateIsRecod(true);
      pkStore.updateGame({
        map: stringTo2D(record.record.map),
        a_id: record.record.aid,
        a_sx: record.record.asx,
        a_sy: record.record.asy,
        b_id: record.record.bid,
        b_sx: record.record.bsx,
        b_sy: record.record.bsy,
      });
      recordStore.updateSteps({
        a_steps: record.record.asteps,
        b_steps: record.record.bsteps,
      });

      recordStore.updateRecordLoser(record.record.loser);

      router.push({
        name: "record_content",
        params: {
          recordId,
        },
      });
      break;
    }
  }
};
const pull_page = (page) => {
  console.log("page");
  current_page = page;
  axios({
    method: "GET",
    url: "http://127.0.0.1:3000/record/getlist/",
    params: {
      page: page,
    },
    headers: {
      Authorization: "Bearer " + userStore.user.token,
    },
  }).then((resp) => {
    records.value = resp.data.records;
    records_count.value = resp.data.records_count;
    update_pages();
    console.log(records.value, records_count.value);
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
