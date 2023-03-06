<template>
  <div>
    <!-- {{ stockCode1 }} -->
    <el-popover
      placement="left"
      width="460"
      style="margin: 0px"
      trigger="click"
    >
      <div class="line-picture">
        <img
          style="
            /* color: blue; */
            font-size: 50px;
            background-color: rgba(0, 0, 0, 0.4) !important;
            width: 460px;
          "
          :src="klinemin"
        />
      </div>
      <span slot="reference" style="background-color: transparent">
        待完善
      </span>
    </el-popover>
    <el-popover
      placement="left"
      width="460"
      style="margin: 0px"
      trigger="click"
    >
      <div class="line-picture">
        <img
          style="
            /* color: blue; */
            font-size: 50px;
            background-color: rgba(0, 0, 0, 0.4) !important;

            width: 460px;
          "
          :src="klinedaily"
        />
      </div>
      <div slot="reference">
        <span style="background-color: transparent"> 可点击 </span>
      </div>
    </el-popover>
  </div>
</template>
  
  <script>
import { ifCurTimeIsTradeTime } from "@/common/js/adaper";

export default {
  props: {
    bgcode: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      klinemin: null, // k线图
      klinedaily: null, // k线图
      interval: null,
    };
  },
  created() {
    this.fetchkline();
  },
  mounted() {
    this.fetchkline();
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      if (ifCurTimeIsTradeTime()) {
        this.fetchkline();
      }
    }, 3000);
  },

  methods: {
    // 获取K线图
    fetchkline() {
      this.$http

        .get(`http://imgnode.gtimg.cn/hq_img`, {
          params: {
            // code: this.code,
            code: this.bgcode,
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
          this.klinemin = result;
        });
      this.$http

        .get(`http://imgnode.gtimg.cn/hq_img`, {
          params: {
            // code: this.code,
            code: this.bgcode,
            type: "day",
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
          this.klinedaily = result;
        });
    },
  },
};
</script>
  
  