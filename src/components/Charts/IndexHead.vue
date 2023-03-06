<template>
  <div :id="id" :class="className" :style="{height:height,width:width}" :stockCode1="stockCode1">
    <el-row :gutter="10" type="flex" class="row-bg el-row-two" align="center">
      <el-col :span="8">
        <div class="title-content">{{stockInfo[1]}}</div>
        <div class="title-content" :style="colorArr[0]">{{stockInfo[3]}}</div>
        <div class="pct-content" :style="colorArr[0]">{{stockInfo[31]}} &nbsp;&nbsp; {{stockInfo[32]}}%</div>
      </el-col>
      <el-col :span="8">
        <div class="text-content" :style="colorArr[3]">今开：{{stockInfo[5]}}</div>
        <div class="text-content">昨收：{{stockInfo[4]}}</div>
        <div class="text-content">代码：{{stockCode1}}</div>
      </el-col>
      <el-col :span="8">
        <div class="text-content" :style="colorArr[1]">最高：{{stockInfo[33]}}</div>
        <div class="text-content" :style="colorArr[2]">最低：{{stockInfo[34]}}</div>
        <div class="text-content">振幅：{{stockInfo[43]}}%</div>
      </el-col>
      <el-col :span="8">
        <div class="text-content" :style="colorArr[0]">最新：{{stockInfo[3]}}</div>
        <div class="text-content" :style="colorArr[0]">涨跌幅：{{stockInfo[32]}}%</div>
        <div class="text-content" :style="colorArr[0]">涨跌额：{{stockInfo[31]}}</div>
      </el-col>
      <el-col :span="8">
        <div class="text-content">成交量：{{stockInfo[36]}}</div>
        <div class="text-content">成交额：{{stockInfo[37]}}</div>
        <div class="text-content"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {getColor,handleVol,handleAmount} from "@/utils/stockUtils";
  import {ifCurTimeIsTradeTime} from "../../utils/stockUtils";

  export default {
    name: "indexHead",
    props: {
      stockCode1: {
        type: String
      },
      className: {
        type: String,
        default: 'StockHead'
      },
      id: {
        type: String,
        default: 'StockHead'
      },
      width: {
        type: String,
        default: '800px'
      },
      height: {
        type: String,
        default: '200px'
      }
    },
    data() {
      return {
        stockInfo: [],
        colorArr: [],
        timer:"" // 定时刷新器
      }
    },
    mounted() {
      this.setStockHead();
    },
    beforeDestroy(){
      this.$once('hook:beforeDestroy', () => {
        clearInterval(this.timer);
      })
    },
    watch: {
      stockCode1: {
        immediate: true,
        handler (val) {
          console.log("head watch:"+val);
          this.getStockHeadInfo(val);
        }
      }
    },
    methods: {
      setStockHead(){
        this.getStockHeadInfo(this.stockCode1);
        this.timer = setInterval(() => {
          if (ifCurTimeIsTradeTime()) { //判断当前是否为交易时间
              this.getStockHeadInfo(this.stockCode1);
          }
        }, 3000)
      },
      getStockHeadInfo(stockCode) {
        this.$store.dispatch('stock/getStockInfo', stockCode).then(res => {
          this.stockInfo = res.data.split("~");
          let preClose = this.stockInfo[4];
          this.colorArr = [];
          this.colorArr.push(getColor(Number(this.stockInfo[3]),Number(preClose)));   //现价颜色
          this.colorArr.push(getColor(Number(this.stockInfo[33]),Number(preClose)));  //最高颜色
          this.colorArr.push(getColor(Number(this.stockInfo[34]),Number(preClose)));   //最低颜色
          this.colorArr.push(getColor(Number(this.stockInfo[5]),Number(preClose)));  //今开颜色

          this.stockInfo[36] = handleVol(this.stockInfo[36]);
          this.stockInfo[37] = handleAmount(this.stockInfo[37]);
        })
      }
    }
  }
</script>
<style>
  .el-row-two {
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
    min-height: 40px;
    min-width: 40px;
    text-align: center;
    font-size: 30px;
  }

  .pct-content {
    min-height: 40px;
    min-width: 40px;
    text-align: center;
    font-size: 16px;
  }
</style>
