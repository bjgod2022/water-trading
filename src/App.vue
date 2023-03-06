<template>
  <div id="app">
    <!-- <BuySellPanel /> -->
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
import storage from "good-storage";
import { ifCurTimeIsTradeTime } from "@/common/js/adaper";
export default {
  data() {
    return {
      items: "",
      bodyTimer: "", // 定时刷新器
      times: 0,
    };
  },
  created() {
    this.fetchkline();
  },
  mounted() {
    this.initData();
  },
  beforeDestroy() {
    this.$once("hook:beforeDestroy", () => {
      clearInterval(this.bodyTimer);
    });
  },
  // computed: {
  //   localtimes: function () {
  //     return this.$store.state.localtimes;
  //   },
  // },
  methods: {
    initData() {
      this.bodyTimer = setInterval(() => {
        if (ifCurTimeIsTradeTime()) {
          this.fetchkline();
        }
      }, 3000);
    },

    fetchkline() {
      this.$store.commit("increment");
      this.$http
        .get(`http://82.push2.eastmoney.com/api/qt/clist/get`, {
          params: {
            pn: "1",
            pz: "50000",
            po: "1",
            np: "1",
            ut: "bd1d9ddb04089700cf9c27f6f7426281",
            fltt: "2",
            invt: "2",
            fid: "f3",
            fs: "m:0 t:6,m:0 t:80,m:1 t:2,m:1 t:23,m:0 t:81 s:2048",
            fields:
              "f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f11,f12,f13,f14,f15,f16,f17,f18,f20,f21,f22,f23,f24,f25,f33,f34,f35,f39,f62,f64,f65,f66,f69,f70,f71,f72,f75,f76,f77,f78,f81,f82,f83,f84,f87,f100,f102,f103,f104,f105,f106,f114,f115,f124,f128,f134,f164,f166,f168,f170,f172,f174,f176,f178,f180,f182,f350,f351,f352",
            _: "1623833739532",
          },
        })
        .then((res) => {
          this.obj = res.data.data.diff;
          for (var i = 0; i < this.obj.length; i++) {
            this.items = this.obj[i];
            let key = this.obj[i].f13 + this.obj[i].f12;
            storage.set(key, this.items);
          }
        });
    },
  },
};
</script>

<style lang="scss">
@import "./scss/app";
</style>
         