<template>
  <div id="app-liuru">
    <el-popover
      placement="left"
      width="400"
      style="margin: 0px"
      trigger="click"
    >
      <div class="first-liuru">
        <a class="title-liuru">主力净流入{{ parseInt(zljlr / 10000) }}万</a>
        <div
          class="box-liuru"
          style="min-width: 100px; height: 14%"
          v-for="item in list"
        >
          <div class="left-liuru" :style="{ width: item.leftLen + '% ' }">
            <!-- <div class="title-liuru">{{ item.ad.title }}</div>
            <div class="title-liuru">{{ item.ad.value }}</div> -->
            <div
              class="leftjin-liuru"
              :style="{ width: item.adPercentage + '%' }"
            >
              <div class="title-liuru">
                {{ item.ad.title }}:{{ parseInt(item.ad.value / 10000) }}万
              </div>
            </div>
          </div>
          <div class="right-liuru" :style="{ width: item.rightLen + '%' }">
            <div
              class="rightjin-liuru"
              :style="{ width: item.dePercentage + '%' }"
            >
              <div class="title-liuru-right">
                {{ item.de.title }}:{{ parseInt(item.de.value / 10000) }}万
              </div>
            </div>
          </div>
        </div>
      </div>
      <div slot="reference" style="min-width: 100px; height: 50px">
        {{ parseInt(zljlr / 10000) }}万
        <div
          class="box-liuru"
          style="min-width: 100px; height: 8%"
          v-for="item in list"
        >
          <div class="left-liuru" :style="{ width: item.leftLen + '%' }">
            <!-- <div class="title-liuru">{{ item.ad.title }}</div> -->
            <div
              class="leftjin-liuru"
              :style="{ width: item.adPercentage + '%' }"
            ></div>
          </div>
          <div class="right-liuru" :style="{ width: item.rightLen + '%' }">
            <div
              class="rightjin-liuru"
              :style="{ width: item.dePercentage + '%' }"
            ></div>
            <!-- <div class="title-liuru">{{ item.de.title }}</div> -->
          </div>
        </div>
      </div>
    </el-popover>
  </div>
</template>
<script>
export default {
  data() {
    return {
      list: [],
    };
  },
  props: {
    zljlr: {
      type: Number,
      default: 0,
    },
    cdd: {
      type: Number,
      default: 0,
    },
    cddlc: {
      type: Number,
      default: 0,
    },
    dd: {
      type: Number,
      default: 0,
    },
    ddlc: {
      type: Number,
      default: 0,
    },
    zd: {
      type: Number,
      default: 0,
    },
    zdlc: {
      type: Number,
      default: 0,
    },
    xd: {
      type: Number,
      default: 0,
    },
    xdlc: {
      type: Number,
      default: 0,
    },
  },
  methods: {
    getList() {
      let self = this;
      let [adMax, deMax, leftLen, rightLen, sum, adeMax] = [0, 0, 0, 0, 0, 0];

      let list = [
        {
          ad: { title: "超大单", value: this.cdd },
          de: { title: "超大单流出", value: this.cddlc },
        },
        {
          ad: { title: "大单", value: this.dd },
          de: { title: "大单流出", value: this.ddlc },
        },
        {
          ad: { title: "中单", value: this.zd },
          de: { title: "中单流出", value: this.zdlc },
        },
        {
          ad: { title: "小单", value: this.xd },
          de: { title: "小单流出", value: this.xdlc },
        },
      ];

      list.forEach((val) => {
        if (val.ad.value > adMax) adMax = val.ad.value;
        if (val.de.value > deMax) deMax = val.de.value;
      });
      if (adMax > deMax) {
        adeMax = adMax;
      } else {
        adeMax = deMax;
      }

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
</style>
