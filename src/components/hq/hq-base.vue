<template>
  <section class="base number" :class="{ 'number--down': stock.value < 0 }">
    <div class="name">
      <!-- <span> {{ stock }} </span> -->
      <span>{{ stock.name }}({{ stock.code }}.{{ stock.prefix }})</span>
      <span class="time">{{ stock.timeText }}</span>
    </div>
    <ul class="list-base">
      <li class="change">{{ stock.now }}</li>
      <li class="change">
        <p>{{ stock.value >= 0 ? "+" : "" }}{{ stock.value }}</p>
        <p>{{ stock.rate }}</p>
      </li>
      <li v-show="!stock.index">
        <m-button
          v-show="!stock.free"
          text="添加自选"
          @click="addFree(stock)"
        ></m-button>
        <m-button
          v-show="stock.free"
          text="取消自选"
          @click="removeFree(stock)"
        ></m-button>
      </li>
    </ul>
    <list-view :wrap="true" :columns="3" :list="maps">
      <template v-slot:item="{ item }">
        <div
          class="base-item"
          v-show="(stock.index == 1 && item.index != 0) || !stock.index"
        >
          <span>{{ item.title }}</span>
          <span :class="{ change: item.static != 1 }">{{
            stock[item.field]
          }}</span>
        </div>
      </template>
    </list-view>
  </section>
</template>
<script>
import { button, listView } from "../base";
import { mapActions, mapGetters } from "vuex";
import { MAPS } from "@/config/";
export default {
  name: "hq-base",
  components: {
    [button.name]: button,
    [listView.name]: listView,
  },
  props: {
    stockfist: Object,
  },
  data() {
    return {
      maps: MAPS,
      stock: this.stockfist,
    };
  },
  methods: {
    ...mapActions(["addFree", "removeFree"]),
  },
};
</script>
<style lang="scss" scoped>
.base {
  .time {
    margin-left: 10px;
  }
  .list-base {
    display: flex;
    align-items: center;
    li {
      flex: 1;
    }
    li:first-child,
    li:last-child {
      flex: 0 0 150px;
    }
  }
  .base-item {
    padding: 5px 0px;
    display: flex;
    span {
      flex: 1;
    }
  }
}
</style>