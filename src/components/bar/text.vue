<template>
  <div id="app">
    <h1>
      <svg-icon
        style="font-size: 24px; color: yellowgreen; margin-right: 5px"
        icon-class="bagua2"
      />
      <router-link
        style="font-size: 26px; color: yellowgreen; margin: 0 5px"
        to="/"
        >市场</router-link
      >
      |
      <!-- <svg-icon style="color: cadetblue" icon-class="my" /> -->
      <router-link style="color: black; margin: 0 5px" to="/myself"
        >自选</router-link
      >|
      <!-- <svg-icon style="color: cadetblue" icon-class="taiji" /> -->
      <router-link style="color: black; margin: 0 5px" to="/zhouyi"
        >周易</router-link
      >
      <!-- <svg-icon style="color: aqua" icon-class="set" /> -->
      <!-- <svg-icon style="color: cadetblue" icon-class="taiji" /> -->|
      <router-link style="color: black; margin: 0 5px" to="/text"
        >测试页面</router-link
      >|
      <svg-icon
        style="font-size: 22px; color: yellowgreen; margin: 0 5px"
        icon-class="set"
      />
    </h1>
    <div class="box" v-for="item in list">
      <div class="left" :style="{ width: item.leftLen + '%' }">
        <div class="title">{{ item.ad.title }}</div>
        <div class="leftjin" :style="{ width: item.adPercentage + '%' }"></div>
      </div>
      <div class="right" :style="{ width: item.rightLen + '%' }">
        <div class="rightjin" :style="{ width: item.dePercentage + '%' }"></div>
        <div class="title">{{ item.de.title }}</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      list: [],
    };
  },
  methods: {
    getList() {
      let self = this;
      let [adMax, deMax, leftLen, rightLen, sum] = [0, 0, 0, 0, 0, 0];

      let list = [
        {
          ad: { title: "家居建", value: 100 },
          de: { title: "人流指数", value: 50 },
        },
        {
          ad: { title: "外国餐厅", value: 150 },
          de: { title: "专科医院", value: 70 },
        },
        {
          ad: { title: "中餐厅", value: 80 },
          de: { title: "停车场", value: 20 },
        },
        {
          ad: { title: "中餐厅", value: 20 },
          de: { title: "停车场", value: 90 },
        },
        {
          ad: { title: "中餐厅", value: 300 },
          de: { title: "停车场", value: 20 },
        },
        {
          ad: { title: "中餐厅", value: 250 },
          de: { title: "停车场", value: 130 },
        },
        {
          ad: { title: "中餐厅", value: 90 },
          de: { title: "停车场", value: 90 },
        },
        {
          ad: { title: "中餐厅", value: 0 },
          de: { title: "停车场", value: 200 },
        },
      ];

      list.forEach((val) => {
        if (val.ad.value > adMax) adMax = val.ad.value;
        if (val.de.value > deMax) deMax = val.de.value;
      });

      sum = adMax + deMax;

      leftLen = (adMax / sum) * 100;
      rightLen = (deMax / sum) * 100;

      let arr = [];

      self.list = list.map((val) => {
        val["leftLen"] = leftLen;
        val["rightLen"] = rightLen;
        val["adPercentage"] = (val.ad.value / adMax) * 100;
        val["dePercentage"] = (val.de.value / deMax) * 100;
        return val;
      });
    },
  },
  mounted() {
    let self = this;
    setTimeout(() => {
      self.getList();
    }, 1000);
  },
};
</script>
<style>
.box {
  display: flex;
  margin: 10px 0;
  width: 300px;
  height: 10px;
}
.left {
  height: 10px;
  display: flex;
  justify-content: flex-end;
}
.right {
  height: 10px;
  display: flex;
  justify-content: flex-start;
}
.leftjin {
  height: 10px;
  background: #6fcf97;
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
}
.rightjin {
  height: 10px;
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
  background: #930cea;
}
.title {
  color: #fff;
  font-size: 12px;
}
</style>
