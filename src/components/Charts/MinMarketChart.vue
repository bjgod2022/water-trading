<template>
  <div>
    <!-- {{ stockCode1 }} -->
    <el-popover
      placement="right"
      width="460"
      style="margin: 0px"
      trigger="click"
    >
      <div class="line-picture">
        <img
          style="
            color: blue;
            font-size: 50px;
            background-color: rgba(255, 255, 255, 0.8);
            width: 460px;
          "
          :src="kline"
        />
      </div>

      <MinChart
        slot="reference"
        :id="id"
        :stockCode1="stockCode1"
        :stockCode2="stockCode2 + stockCode1.substring(2, 8)"
        @showParentComp="eventFromChild"
      />
    </el-popover>
  </div>
</template>

<script>
import MinChart from "@/components/Charts/MinMimuteChart";
import { ifCurTimeIsTradeTime } from "@/common/js/adaper";

export default {
  name: "min-market-chart",
  components: {
    MinChart,
  },
  props: {
    stockCode1: {
      type: String,
    },
    stockCode2: {
      type: String,
    },

    id: {
      type: String,
      default: "chart",
    },
    width: {
      type: String,
      default: "200px",
    },
    height: {
      type: String,
      default: "100px",
    },
  },
  data() {
    return {
      fromParentToChild: "",
      kline: null, // k线图
      interval: null,
    };
  },
  created() {
    this.fetchkline();
  },
  mounted() {
    this.fetchkline();
    this.sendeventMarket();
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      if (ifCurTimeIsTradeTime()) {
        this.fetchkline();
      }
    }, 3000);
    // this.interval = setInterval(this.fetchkline, 300000);
  },
  watch: {
    fromParentToChild: {
      handler(val) {
        this.sendeventMarket();
      },
    },
  },
  methods: {
    // 获取K线图
    fetchkline() {
      this.$http
        // http://image.sinajs.cn/newchart/min/n/sh000001.gif
        // "`http://image.sinajs.cn/newchart/min/n/${props.row.code}.gif`"
        // .get(`http://imgnode.gtimg.cn/hq_img`, {
        //   params: {
        //     // code: this.code,
        //     code: this.stockCode1,
        //     type: "minute",
        //     size: 1,
        //   },
        //   responseType: "arraybuffer",
        // })
        .get(`http://imgnode.gtimg.cn/hq_img`, {
          params: {
            // code: this.code,
            code: this.stockCode1,
            type: "minute",
            size: 1,
          },
          responseType: "arraybuffer",
        })
        .then((res) => {
          const result =
            "data:image/png;base64," +
            btoa(
              new Uint8Array(res.data).reduce(
                (data, byte) => data + String.fromCharCode(byte),
                ""
              )
            );
          this.kline = result;
        });
      // console.log("刷新了");
    },

    eventFromChild(dataIf) {
      // console.log(dataIf, "dataIf.show");
      // this.show = dataIf.show;
      this.fromParentToChild = dataIf;
      // console.log(this.fromParentToChild, "2子组收到消息");
      this.sendeventMarket();
    },
    sendeventMarket() {
      this.$emit("eventMarket", this.fromParentToChild);
      // console.log(this.fromParentToChild, "2子组件发送了消息");
    },
  },
};
</script>

<style scoped>
</style>
