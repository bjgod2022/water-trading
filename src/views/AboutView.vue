<template>
  <div class="about">
    <div class="duelNumber">
      <div class="fall">
        <div class="arrow"></div>
        <div class="text">跌：{{ zfdown }}支</div>
      </div>
      <div class="fall" style="align-items: center">
        <div class="text" style="margin-left: 100px">平：{{ zfzero }}支</div>
      </div>

      <div class="rise">
        <div class="text">涨{{ zfup }}支</div>
        <div class="arrow"></div>
      </div>
    </div>
    <div class="duelBox">
      <div class="fall" :style="{ width: zfdownRate + '%' }">
        <div class="anchor2"></div>
        <div class="anchor1"></div>
      </div>
      <div class="rise" :style="{ width: leftPercent + '%' }">
        <div class="anchor1"></div>
        <div class="anchor2"></div>
      </div>
    </div>
  </div>
</template>
 
<script>
const LEFT_BAR = "left";
const RIGHT_BAR = "right";
const SHOW_TIP = "show";
const HIDE_TIP = "hide";
import { mapActions } from "vuex";
import { ifCurTimeIsTradeTime } from "@/common/js/adaper";

export default {
  data() {
    return {
      nranks: null, // 个股详情
      interval: null, // 轮询

      LEFT_BAR: LEFT_BAR,
      RIGHT_BAR: RIGHT_BAR,
      SHOW_TIP: SHOW_TIP,
      HIDE_TIP: HIDE_TIP,

      totalNum: 0,
      zfzero: 0,
      zfup: 0,
      zfdown: 0,
      zfupRate: 0,
      zfdownRate: 0,
      leftPercent: null,
      rightPercent: null,
      leftBar: {
        isShowTip: false,
        delayOut: null,
      },
      rightBar: {
        isShowTip: false,
        delayOut: null,
      },
    };
  },
  created() {
    this.init();
  },
  mounted() {
    this.init();
    clearInterval(this.init());
    this.interval = setInterval(() => {
      if (ifCurTimeIsTradeTime()) {
        this.init();
      }
    }, 3000);
  },
  beforeDestroy() {
    this.$once("hook:beforeDestroy", () => {
      clearInterval(this.bodyTimer);
    });
  },
  methods: {
    onMouseTooltip(tipType, actionType) {
      let bar = null;
      if (tipType == LEFT_BAR) {
        bar = this.leftBar;
      } else if (tipType == RIGHT_BAR) {
        bar = this.rightBar;
      } else {
        return;
      }
      if (actionType === SHOW_TIP) {
        this.showBarTooltip(bar);
      } else if (actionType === HIDE_TIP) {
        this.hideBarTooltip(bar);
      } else {
        return;
      }
    },
    showBarTooltip(bar) {
      if (bar.delayOut != null) {
        clearTimeout(bar.delayOut);
      }
      bar.delayOut = null;
      bar.isShowTip = true;
    },
    hideBarTooltip(bar) {
      clearTimeout(bar.delayOut);
      bar.delayOut = setTimeout(function () {
        bar.isShowTip = false;
      }, 100);
    },
    ...mapActions(["ranks"]),
    init() {
      this.ranks().then((datas) => {
        this.nranks = datas;
        this.leftPercent = this.nranks.upRate;
        this.rightPercent = this.nranks.downRate;
        this.totalNum = this.nranks.total;
        this.zfzero = this.nranks.zero;
        this.zfup = this.nranks.up;
        this.zfdown = this.nranks.down;
        this.zfupRate = this.nranks.upRate;
        this.zfdownRate = this.nranks.downRate;
      });
    },
  },
  // computed: {
  //   rightPercent: function(){
  //     return 100 - this.leftPercent;
  //   }
  // }
};
</script>

