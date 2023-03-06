<template>
  <div
    :id="id"
    :class="className"
    :style="{ height: height, width: width }"
    :stockCode1="stockCode1"
  >
    <!-- {{ stockCode1 }} -->
    <el-row :gutter="5" type="flex" class="el-row-head" align="center">
      <el-col :span="8">
        <div class="title-content">{{ stockInfo[1] }}</div>
        <div class="title-content" :style="colorArr[0]">{{ stockInfo[3] }}</div>
        <div class="pct-content" :style="colorArr[0]">
          {{ stockInfo[31] }} &nbsp;&nbsp; {{ stockInfo[32] }}%
        </div>
      </el-col>
      <el-col :span="8">
        <div class="text-content">代码：{{ stockCode1 }}</div>
        <div class="text-content">
          今开：<span :style="colorArr[3]">{{ stockInfo[5] }}</span>
        </div>
        <div class="text-content">昨收：{{ stockInfo[4] }}</div>
        <div class="text-content">换手率：{{ stockInfo[38] }}%</div>
      </el-col>
      <el-col :span="8">
        <div class="text-content">
          最高：<span :style="colorArr[1]">{{ stockInfo[33] }}</span>
        </div>
        <div class="text-content">
          最低：<span :style="colorArr[2]">{{ stockInfo[34] }}</span>
        </div>
        <div class="text-content">
          涨停：<span :style="colorArr[4]">{{ stockInfo[47] }}</span>
        </div>
        <div class="text-content">
          跌停：<span :style="colorArr[5]">{{ stockInfo[48] }}</span>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="text-content">
          最新：<span :style="colorArr[0]">{{ stockInfo[3] }}</span>
        </div>
        <div class="text-content">
          涨跌幅：<span :style="colorArr[0]">{{ stockInfo[32] }}%</span>
        </div>
        <div class="text-content">
          涨跌额：<span :style="colorArr[0]">{{ stockInfo[31] }}</span>
        </div>
        <div class="text-content">振幅：{{ stockInfo[43] }}%</div>
      </el-col>
      <el-col :span="8">
        <div class="text-content">市净率：{{ stockInfo[46] }}</div>
        <div class="text-content">市盈率：{{ stockInfo[39] }}</div>
        <div class="text-content">行业：{{ stockIndustry }}</div>
        <div class="text-content">地区：{{ stockArea }}</div>
      </el-col>
      <el-col :span="9">
        <div class="text-content">成交量：{{ stockInfo[36] }}</div>
        <div class="text-content">成交额：{{ stockInfo[37] }}</div>
        <div class="text-content">流通值：{{ stockInfo[44] }}亿元</div>
        <div class="text-content">总市值：{{ stockInfo[45] }}亿元</div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  getDownColor,
  getUpColor,
  handleStockHeadVol,
  getColor,
  handleAmount,
  ifCurTimeIsTradeTime,
} from "../../utils/stockUtils";

export default {
  name: "stockHead",
  props: {
    stockCode1: {
      type: String,
    },
    className: {
      type: String,
      default: "StockHead",
    },
    id: {
      type: String,
      default: "StockHead",
    },
    width: {
      type: String,
      default: "900px",
    },
    height: {
      type: String,
      default: "180px",
    },
  },
  data() {
    return {
      stockInfo: [],
      stockIndustry: "",
      stockArea: "",
      colorArr: [],
      timer: "", // 定时刷新器
    };
  },
  mounted() {
    this.setStockHead();
  },
  beforeDestroy() {
    this.$once("hook:beforeDestroy", () => {
      clearInterval(this.timer);
    });
  },
  watch: {
    stockCode1: {
      immediate: true,
      handler(val) {
        this.getStockHeadInfo(val);
      },
    },
  },
  methods: {
    setStockHead() {
      this.getStockHeadInfo(this.stockCode1);
      this.getStockBasicInfo(this.stockCode1);
      this.timer = setInterval(() => {
        if (ifCurTimeIsTradeTime()) {
          //判断当前是否为交易时间
          this.getStockHeadInfo(this.stockCode1);
        }
      }, 30000000);
    },
    getStockBasicInfo(stockCode) {
      this.$store
        .dispatch("stock/getStockBasicInfo", stockCode.substr(2, 6))
        .then((res) => {
          this.stockIndustry = res.data.industry;
          this.stockArea = res.data.area;
        });
    },
    getStockHeadInfo(stockCode) {
      this.$store.dispatch("stock/getStockInfo", stockCode).then((res) => {
        this.stockInfo = res.data.split("~");
        let preClose = this.stockInfo[4];
        this.colorArr = [];
        this.colorArr.push(
          getColor(Number(this.stockInfo[3]), Number(preClose))
        ); //现价颜色
        this.colorArr.push(
          getColor(Number(this.stockInfo[33]), Number(preClose))
        ); //最高颜色
        this.colorArr.push(
          getColor(Number(this.stockInfo[34]), Number(preClose))
        ); //最低颜色
        this.colorArr.push(
          getColor(Number(this.stockInfo[5]), Number(preClose))
        ); //今开颜色
        this.colorArr.push(getUpColor()); //涨停颜色
        this.colorArr.push(getDownColor()); //跌停颜色

        this.stockInfo[36] = handleStockHeadVol(this.stockInfo[36]);
        this.stockInfo[37] = handleAmount(this.stockInfo[37]);
      });
    },
  },
};
</script>
<style>
.el-row-head {
  margin: 20px auto auto auto;
}

.text-content {
  margin-left: -10px;
  min-height: 40px;
  min-width: 40px;
  font-size: 16px;
}

.title-content {
  margin-top: 5px;
  margin-right: 5px;
  min-height: 40px;
  min-width: 50px;
  text-align: center;
  font-size: 30px;
}

.pct-content {
  margin-top: 5px;
  min-height: 40px;
  min-width: 40px;
  text-align: center;
  font-size: 16px;
}
</style>
