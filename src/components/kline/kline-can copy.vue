<template>
  <span>
    <trading-vue
      :title-txt="stock.name + stock.code"
      ref="tvjs"
      :width="width"
      :data="dc"
      :height="500"
      :legend-buttons="['display', 'settings', 'up', 'down', 'add', 'remove']"
      :color-back="colors.back"
      :color-grid="colors.grid"
      :color-text="colors.text"
      @signal="onsignal"
      :toolbar="true"
      :timezone="parseInt(timezone)"
      :chart-config="{ MIN_ZOOM: 1 }"
      :index-based="index_based"
      :overlays="ovs"
      :x-settings="xsett"
      :extensions="extensions"
      :skin="skin"
    />
    <!-- <span class="log-scale">
      <input type="checkbox" v-model="log_scale" />
      <label>对数坐标</label>
    </span> -->
    <span class="gc-mode">
      <input type="checkbox" v-model="index_based" />
      <label>连续数据</label>
    </span>
    <span class="timezone">
      <input type="number" min="-12" max="12" v-model="timezone" />
      <label>时区</label>
    </span>
    <!-- <tf-selector :charts="dc" v-on:selected="on_selected"> </tf-selector> -->

    <!-- {{ trading }} -->

    <!-- <trading-vue
      :id="newtrad"
      :width="width"
      :title-txt="stock.name"
      :data="dc"
      :height="800"
      :toolbar="true"
      :overlays="overlays"
      :timezone="8"
      :index-based="index_based"
      :chart-config="{ DEFAULT_LEN: 22 }"
    >
    </trading-vue> -->

    <!-- <trading-vue
      :id="can"
      :data="chart"
      :width="width"
      :height="430"
      :title-txt="stock.name"
      :overlays="overlays"
      :toolbar="true"
      :timezone="8"
      :chart-config="{ DEFAULT_LEN: 57 }"
      :index-based="index_based"
      :legend-buttons="['display', 'down']"
    >
    </trading-vue> -->

    <!-- <div class="chart-wrapper">
      <div :id="id" style="width: 100%; height: 700px">
        <div :id="id + '1'" style="width: 100%; height: 700px"></div>
      </div>
      <kline-tooltip
        :klineType="klineType"
        v-if="klineType != 'day'"
        :dataSource="current"
      ></kline-tooltip>
      <canvas id="chart" ref="chart" v-show="lineChart"></canvas>
    <canvas id="volumn" ref="volumn" v-show="lineChart"></canvas>
    <loading v-show="!lineChart"></loading>
    </div> -->
  </span>
</template>
<script>
// 时间计算
const SECOND = 1000;
const MINUTE = SECOND * 60;
const MINUTE3 = MINUTE * 3;
const MINUTE5 = MINUTE * 5;
const MINUTE15 = MINUTE * 15;
const MINUTE30 = MINUTE * 30;
const HOUR = MINUTE * 60;
const HOUR4 = HOUR * 4;
const HOUR12 = HOUR * 12;
const DAY = HOUR * 24;
const WEEK = DAY * 7;
const MONTH = WEEK * 4;
const YEAR = DAY * 365;
//
// Gettin' data through webpeck proxy
const PORT = location.port;
const URL = `http://localhost:${PORT}/api/v1/klines?symbol=`;
const WSS = `ws://localhost:${PORT}/ws/btcusdt@aggTrade`;
import Stream from "./stream.js";
import SkinPack from "./SkinPack/index.js";

// import TradingVue from "trading-vue-js";
import Multiselect from "../Multiselect.vue";

import Data from "./data.json";
import Stoch from "./Stoch";
import { TradingVue } from "@/trandingvue/trading-vue";
import Grin from "./Grin.js"; // New import
import EMBY from "./ema_crossover.vue"; // New import

import Overlays from "tvjs-overlays";
import { DataCube } from "trading-vue-js";
import XP from "tvjs-xp";
import Extensions from "tvjs-xp";
import Illuminati from "./shared/illuminati.js";
import TfSelector from "./Timeframes/TFSelector.vue";

//
import * as echarts from "echarts";

import { handleChartVol, ifCurTimeIsTradeTime } from "@/utils/stockUtils";
import { loading } from "../base";
import klineTooltip from "./kline-tooltip.vue";
import { mapActions } from "vuex";
import { KLINE_MAP } from "@/config/";
import { createKline } from "@/common/js/adaper";
let chart = null;
export default {
  // name: "kline-line",
  icon: "⚡",
  name: "Stocks",
  description: "Should display marker hints (click earnings icon)",
  props: ["night"],
  mixins: [Illuminati],
  props: {
    stock: Object,
    klineType: String,
    delay: Number,
    id: String,
  },
  components: {
    [loading.name]: loading,
    [klineTooltip.name]: klineTooltip,
    TradingVue,
    Multiselect,
    TfSelector,
  },

  data() {
    return {
      log_scale: false,
      index_based: true,
      timezone: 8,
      extensions: [SkinPack],

      chart: {},
      // extensions: Object.values(Extensions),
      ext_names: Object.keys(Extensions),
      ext: Object.values(XP),
      night: true,
      checks: {},
      texttime: new Date().getHours(),
      texthour4: new Date(),

      value: "100",
      textfont: "18px Arial",
      newtrad: "newtrad",
      textcolor: "red",
      sliderValue: 50,
      can: "can",
      klinecan: "klinecan",

      current: {},
      barChart: null,
      lineChart: null,
      code: undefined,
      timer: "", // 定时刷新器
      trading: "",
      // mmd: [],
      //
      // index_based: true,
      legend: true,
      display_set: true,

      dc: new DataCube(Data),
      xsett: {
        "grid-resize": { min_height: 30 },
        "extension-id-2": {
          /* ... */
        },
      },
      ovs: Object.values(Overlays),
      overlays: [Grin, EMBY],
      // overlays: [
      //   // Grin,
      //   EMBY,
      //   // Overlays["CCI"],
      //   // Overlays["MACD"],
      //   // Overlays["MFI"],
      //   // Overlays["XOhlcBars"],
      //   // Overlays["SAR"],
      //   // Overlays["Ribbon"],
      //   // Overlays["BB"],
      //   // Overlays["Ichi"],
      //   // Overlays["RSI"],
      // ],
      // ovs: Object.values(Overlays),
      // overlays: [Stoch],
      title: "",
      width: window.innerWidth,
      height: window.innerHeight,
      colors: {
        colorBack: "#fff",
        colorGrid: "#eee",
        colorText: "#E0AC58",
      },
      buttons: ["display", "settings", "remove"],
    };
  },
  mounted() {
    window.addEventListener("resize", this.onResize);
    this.onResize();
    window.tv = this.$refs.tvjs;
    window.dc = this.chart;

    setTimeout(this.draw, 0);

    this.code = this.stock;
    this.initChart();
    // let now = new Date().getDay();
    this.texttime = new Date().getDay();
    console.log("看，我跑起来了");
    this.texthour4 = new Date();
    this.load_chunk([now - HOUR4, now]).then((data) => {
      console.log("看，我跑起来了");
      this.chart = new DataCube(
        {
          ohlcv: data["chart.data"],
          // onchart: [
          //   {
          //     type: "EMAx6",
          //     name: "Multiple EMA",
          //     data: [],
          //   },
          // ],
          // offchart: [
          //   {
          //     type: "BuySellBalance",
          //     name: "Buy/Sell Balance, $lookback",
          //     data: [],
          //     settings: {},
          //   },
          // ],
          // datasets: [
          //   {
          //     type: "Trades",
          //     id: "binance-btcusdt",
          //     data: [],
          //   },
          // ],
        },
        { aggregation: 100 }
      );
      this.chart.onrange(this.load_chunk);
      this.$refs.tvjs.resetChart();
      // this.stream = this.setoldCharts();
      // this.stream.ontrades = this.on_trades;
      // window.dc = this.chart; // Debug
      // window.tv = this.$refs.tvjs; // Debug
    });
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
    console.log(this.stream, "this.stream");
    if (this.stream) this.stream.off();

    this.$once("hook:beforeDestroy", () => {
      echarts.dispose(this.chart);
      clearInterval(this.timer);
    });
  },
  watch: {
    stock: {
      handler(val) {
        this.code = val;
        this.setOptions();
      },
    },
    log_scale(value) {
      if (this.chart.data.chart) {
        this.$set(this.chart.data.chart, "grid", {
          logScale: value,
        });
      }
    },
  },
  // computed: {
  //   colors() {
  //     return this.night
  //       ? {}
  //       : {
  //           colorBack: "#fff",
  //           colorGrid: "#eee",
  //           colorText: "#333",
  //         };
  //   },
  // },
  computed: {
    colors() {
      return this.$props.night
        ? {}
        : {
            colorBack: "#fff",
            colorGrid: "#eee",
            colorText: "#333",
          };
    },
    skin() {
      return this.$props.night ? "NightSkin" : "DaySkin";
    },
  },
  methods: {
    on_selected(tf) {
      this.chart.set("chart.data", this.charts[tf.name]);
      this.$refs.tradingVue.resetChart();
      this.log_scale = false;
    },
    async load_chunk(range) {
      let [t1, t2] = range;
      let x = "BTCUSDT";
      let q = `${x}&interval=1m&startTime=${t1}&endTime=${t2}`;
      let r = await fetch(URL + q).then((r) => r.json());
      return this.format(this.parse_binance(r));
    },
    reset(state) {
      let sub = Object.keys(state).filter((x) => state[x]);
      this.extensions = sub.map((x) => Extensions[x]);
      this.resetkey++;
    },
    // 买入卖出信号
    onsignal(e) {
      switch (e.type) {
        case "pump-it":
          binance.createMarketBuyOrder();
          break;
        case "dump-it":
          binance.createMarketSellOrder();
          break;
      }
    },
    onResize(event) {
      if (window.innerWidth > 780) {
        this.width = window.innerWidth;
      } else {
        this.width = window.innerWidth;
      }
      this.height = window.innerHeight - 50;
    },
    //
    ...mapActions(["klines"]),
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id));
      this.setOptions();

      this.timer = setInterval(() => {
        // this.setOptions();
        if (ifCurTimeIsTradeTime()) {
          //判断当前是否为交易时间
          this.setOptions();
        }
      }, 3000);
    },
    setoldCharts() {
      if (this.klineType == "day") {
        this.klines({ stock: this.stock, klineType: "day" }).then((data) => {
          let values = [];
          for (let i = 0; i < data.list.length - 1; i++) {
            values.push([
              // data.list[i].time,
              // format(data.list[i].time),
              new Date(data.list[i].time.replace(/-/g, "/")).getTime(),
              data.list[i].start,
              data.list[i].high,
              data.list[i].low,
              data.list[i].end,

              data.list[i].volumn,
            ]);
          }
        });
        return values;
      }
    },

    setOptions() {
      let _this = this;
      // let _data=data.list
      // this.current=data.new
      let priceArr = [];
      let priceAvg = [];
      let priceRate = [];
      let pricesEffectScatter = [];
      let suUp = [];
      let vol = [];
      // let timesetp=[];
      let times = [];
      let _self = this;
      if (this.klineType == "day") {
        this.klines({ stock: this.stock, klineType: "day" }).then((data) => {
          let start = "";
          let len = data.list.length;
          if (len < 90) {
            start = 100;
          } else {
            start = ((len - 80) / len) * 100;
          }

          let tradeData = [];
          let values = [];
          let valuesmacd = [];
          let mavalues5 = [];
          let volumes = [];
          // let preClose = [];
          let pctChg = [];
          // let amount = [];
          for (let i = 0; i < data.list.length; i++) {
            tradeData.push(data.list[i].time);
            // 前四个渲染K线用的数据
            values.push([
              // data.list[i].time,
              // format(data.list[i].time),
              new Date(data.list[i].time.replace(/-/g, "/")).getTime(),
              data.list[i].start,
              data.list[i].high,
              data.list[i].low,
              data.list[i].end,

              data.list[i].volumn,
            ]);
            mavalues5.push([
              new Date(data.list[i].time.replace(/-/g, "/")).getTime(),
              // this.calculateMA(5, data.list[i].start),
              data.list[i].end.toFixed(2),
            ]);

            volumes.push([
              new Date(data.list[i].time.replace(/-/g, "/")).getTime(),
              data.list[i].volumn,
              data.list[i].start < data.list[i].end ? 0 : 1,
            ]);
            // amount.push(res.data[i].amount)
          }
          // let lsitext = this.calculateMA(30, values);

          this.trading = values;
          // this.chart.chart.data = values;
          // console.log(Data.chart.data, values, "Data");
          Data.chart.data = values;
          // console.log(Data, "Data");
          // this.chart.onchart[0].data = this.calculateMA(21, values);
          // this.chart.offchart[0].data = volumes;
          // this.chart.offchart[0].data = this.calculateMACD;

          // this.chart.onchart[0];
          // this.mmd = mavalues5;

          let today = new Date();
          let hour = Number(today.getHours());

          let dupColor = "#EC433D";
          let ddownColor = "#44A55B";
          let MA5Color = "#000000";
          let MA10Color = "#E0AC58";
          let MA20Color = "#73C8C6";
          let MA30Color = "#9C73AF";
          // this.chart.setOption({
          //   backgroundColor: "#fff",
          //   animation: false,
          //   legend: {
          //     bottom: 10,
          //     left: "center",
          //     data: ["MA5", "MA10", "MA20", "MA30"],
          //   },
          //   tooltip: {
          //     trigger: "axis",
          //     axisPointer: {
          //       type: "cross",
          //     },
          //     backgroundColor: "rgba(245, 245, 245, 0.8)",
          //     borderWidth: 1,
          //     borderColor: "#ccc",
          //     padding: 10,
          //     textStyle: {
          //       color: "#000",
          //     },
          //     position: function (pos, params, el, elRect, size) {
          //       var obj = { top: 10 };
          //       obj[["left", "right"][+(pos[0] < size.viewSize[0] / 2)]] = 30;
          //       return obj;
          //     },
          //     formatter: function (params) {
          //       let param = params[0];
          //       let i = param.dataIndex;

          //       //成交量
          //       let volStr = "";
          //       if (volumes[i][1] > 100000000) {
          //         volStr = (volumes[i][1] / 100000000).toFixed(2) + "亿手";
          //       } else if (volumes[i][1] > 10000) {
          //         volStr = (volumes[i][1] / 10000).toFixed(2) + "万手";
          //       } else {
          //         volStr = volumes[i][1] + "手";
          //       }

          //       //成交额
          //       // let amountStr = '';
          //       // if(amount[i] > 100000){
          //       //     amountStr = (amount[i]/100000).toFixed(2) + '亿';
          //       // }else{
          //       //     amountStr = (amount[i]/10).toFixed(2) + '万';
          //       // }

          //       let html =
          //         '<div class="commColor" style="width:140px;">' +
          //         "<div>日期: " +
          //         tradeData[i] +
          //         '<hr size=1 style="margin: 3px 0">' +
          //         "<div>今开: <span  " +
          //         _this.handleColor(values[i][0], values[i][0]) +
          //         " >" +
          //         values[i][0] +
          //         "</span></div>" +
          //         "<div>今收: <span  " +
          //         _this.handleColor(values[i][1], values[i][0]) +
          //         " >" +
          //         values[i][1] +
          //         "</span></div>" +
          //         "<div>最低: <span  " +
          //         _this.handleColor(values[i][2], values[i][0]) +
          //         " >" +
          //         values[i][2] +
          //         "</span></div>" +
          //         "<div>最高: <span  " +
          //         _this.handleColor(values[i][3], values[i][0]) +
          //         " >" +
          //         values[i][3] +
          //         "</span></div>" +
          //         "<div>涨幅: <span  " +
          //         _this.handleColor(values[i][1], values[i][0]) +
          //         " >" +
          //         pctChg[i] +
          //         "%</span></div>" +
          //         "<div>成交量: <span>" +
          //         volStr +
          //         "</span></div></div>";

          //       return html;
          //     },
          //     // extraCssText: 'width: 170px'
          //   },
          //   axisPointer: {
          //     link: { xAxisIndex: "all" },
          //     label: {
          //       backgroundColor: "#777",
          //     },
          //   },
          //   visualMap: {
          //     show: false,
          //     seriesIndex: 5,
          //     dimension: 2,
          //     pieces: [
          //       {
          //         value: 1,
          //         color: dupColor,
          //       },
          //       {
          //         value: -1,
          //         color: ddownColor,
          //       },
          //     ],
          //   },
          //   grid: [
          //     {
          //       left: "10%",
          //       right: "8%",
          //       height: "50%",
          //     },
          //     {
          //       left: "10%",
          //       right: "8%",
          //       top: "69%",
          //       height: "15%",
          //     },
          //   ],
          //   xAxis: [
          //     {
          //       type: "category",
          //       data: tradeData,
          //       scale: true,
          //       boundaryGap: false,
          //       axisLine: { onZero: false },
          //       splitLine: { show: false },
          //       splitNumber: 20,
          //       min: "dataMin",
          //       max: "dataMax",
          //       axisPointer: {
          //         //去掉主图的时间标签
          //         show: true,
          //         label: {
          //           show: false,
          //         },
          //         z: 100,
          //       },
          //     },
          //     {
          //       type: "category",
          //       gridIndex: 1,
          //       data: tradeData,
          //       scale: true,
          //       boundaryGap: false,
          //       axisLine: { onZero: false },
          //       axisTick: { show: false },
          //       splitLine: { show: false },
          //       axisLabel: { show: false },
          //       splitNumber: 20,
          //       min: "dataMin",
          //       max: "dataMax",
          //     },
          //   ],
          //   yAxis: [
          //     {
          //       scale: true,
          //       splitArea: { show: false },
          //       splitLine: { show: false },
          //     },
          //     {
          //       scale: true,
          //       gridIndex: 1,
          //       splitNumber: 2,
          //       axisLabel: { show: false },
          //       axisLine: { show: false },
          //       axisTick: { show: false },
          //       splitLine: { show: false },
          //     },
          //   ],
          //   dataZoom: [
          //     {
          //       show: true,
          //       type: "inside",
          //       xAxisIndex: [0, 1],
          //       start: 0,
          //       end: 100,
          //     },
          //     {
          //       show: true,
          //       xAxisIndex: [0, 1],
          //       type: "slider",
          //       top: "84%",
          //       start: 0,
          //       end: 100,
          //     },
          //   ],
          //   series: [
          //     {
          //       name: "stock",
          //       type: "candlestick",
          //       symbol: "none",
          //       data: values,
          //       itemStyle: {
          //         color: dupColor,
          //         color0: ddownColor,
          //         borderColor: null,
          //         borderColor0: null,
          //       },
          //     },
          //     {
          //       name: "MA5",
          //       type: "line",
          //       symbol: "none",
          //       data: this.calculateMA(5, values),
          //       smooth: true,
          //       itemStyle: {
          //         color: MA5Color,
          //       },
          //       lineStyle: {
          //         width: 1.5,
          //         opacity: 0.5,
          //       },
          //     },
          //     {
          //       name: "MA10",
          //       type: "line",
          //       symbol: "none",
          //       data: this.calculateMA(10, values),
          //       smooth: true,
          //       itemStyle: {
          //         color: MA10Color,
          //       },
          //       lineStyle: {
          //         width: 1.5,
          //         opacity: 0.5,
          //       },
          //     },
          //     {
          //       name: "MA20",
          //       type: "line",
          //       symbol: "none",
          //       data: this.calculateMA(20, values),
          //       smooth: true,
          //       itemStyle: {
          //         color: MA20Color,
          //       },
          //       lineStyle: {
          //         width: 1.5,
          //         opacity: 0.5,
          //       },
          //     },
          //     {
          //       name: "MA30",
          //       type: "line",
          //       symbol: "none",
          //       data: this.calculateMA(30, values),
          //       smooth: true,
          //       itemStyle: {
          //         color: MA30Color,
          //       },
          //       lineStyle: {
          //         width: 1.5,
          //         opacity: 0.5,
          //       },
          //     },
          //     {
          //       name: "Volume",
          //       type: "bar",
          //       symbol: "none",
          //       xAxisIndex: 1,
          //       yAxisIndex: 1,
          //       data: volumes,
          //     },
          //   ],
          // });
          // this.stockInfo = response.data.split("~");

          // let preClose = this.stockInfo[4];
          // this.colorArr.push(this.getColor(this.stockInfo[3],preClose));   //现价颜色
          // this.colorArr.push(this.getColor(this.stockInfo[33],preClose));  //最高颜色
          // this.colorArr.push(this.getColor(this.stockInfo[34],preClose));   //最低颜色
          // this.colorArr.push(this.getColor(this.stockInfo[5],preClose));  //今开颜色
        });
      }
    },
    handleCode(stockCode) {
      let suffix = stockCode.substr(0, 2);
      let ts_code = stockCode.substr(2, 6) + "." + suffix.toUpperCase();
      let type = this.chartType;
      return { ts_code: ts_code, type: type };
    },
    calculateMA(dayCount, values) {
      let result = [];
      for (let i = 0, len = values.length; i < len; i++) {
        if (i < dayCount) {
          // result.push("-");
          result.push([values[i][0], "-"]);
          continue;
        }
        let sum = 0;
        for (let j = 0; j < dayCount; j++) {
          sum += values[i - j][1];
        }
        result.push([values[i][0], +(sum / dayCount).toFixed(3)]);
      }
      return result;
    },
    calculateMACD(dayCountf, dayCountm, dayCountl, values) {
      let result = [];
      let resultmacd = [];
      console.log(values, "values");
      for (let i = 0, len = values.length; i < len; i++) {
        if (i < dayCountl) {
          result.push([values[i][0], 0, "-"]);
          continue;
        }
        let sumf = 0;
        let suml = 0;
        for (let j = 0; j < dayCountf; j++) {
          sumf += values[i - j][1];
        }
        for (let j = 0; j < dayCountl; j++) {
          suml += values[i - j][1];
        }
        result.push([
          values[i][0],
          +(suml / dayCountf).toFixed(3) - +(suml / dayCountl).toFixed(3),
          // +(suml / dayCountl).toFixed(3),
        ]);
      }
      for (let i = 0, len = result.length; i < len; i++) {
        if (i < dayCountm) {
          // result.push("-");
          resultmacd.push([result[i][0], "-", "-"]);
          continue;
        }
        let summ = 0;
        for (let j = 0; j < dayCountm; j++) {
          summ += result[i - j][1];
        }
        resultmacd.push([
          result[i][0],

          (result[i][1] - +(summ / dayCountm).toFixed(3)) * 2,
          result[i][1],
          +(summ / dayCountm).toFixed(3),
        ]);
      }
      return resultmacd;
    },
    handleColor(compareNum, baseNum) {
      let color = "red";
      if (compareNum > baseNum) {
        color = 'style="color:' + this.upColor + '"';
      } else if (compareNum < baseNum) {
        color = 'style="color:' + this.downColor + '"';
      } else {
        color = "";
      }
      return color;
    },
    ratioCalculate(price, yclose) {
      return (((price - yclose) / yclose) * 100).toFixed(2);
    },
    addTimeStr(time, num) {
      let hour = time.split(":")[0];
      let mins = Number(time.split(":")[1]);
      let mins_un = parseInt((mins + num) / 60);
      let hour_un = parseInt((Number(hour) + mins_un) / 24);
      if (mins_un > 0) {
        if (hour_un > 0) {
          let tmpVal = ((Number(hour) + mins_un) % 24) + "";
          hour = tmpVal.length > 1 ? tmpVal : "0" + tmpVal; //判断是否是一位
        } else {
          let tmpVal = Number(hour) + mins_un + "";
          hour = tmpVal.length > 1 ? tmpVal : "0" + tmpVal;
        }
        let tmpMinsVal = ((mins + num) % 60) + "";
        mins = tmpMinsVal.length > 1 ? tmpMinsVal : 0 + tmpMinsVal; //分钟数为 取余60的数
      } else {
        let tmpMinsVal = mins + num + "";
        mins = tmpMinsVal.length > 1 ? tmpMinsVal : "0" + tmpMinsVal; //不大于整除60
      }
      return hour + ":" + mins;
    },

    //获取增加指定分钟数的 数组  如 09:30增加2分钟  结果为 ['09:31','09:32']
    getNextTime(startTime, endTIme, offset, resultArr) {
      let result = this.addTimeStr(startTime, offset);
      resultArr.push(result);
      if (result === endTIme) {
        return resultArr;
      } else {
        return this.getNextTime(result, endTIme, offset, resultArr);
      }
    },
    /**
     * 不同类型的股票的交易时间会不同
     * @param {Object} type   hs=沪深  us=美股  hk=港股
     */
    time_arr() {
      //生成沪深时间段
      let timeArr = [];
      timeArr.push("09:30");
      timeArr.concat(this.getNextTime("09:30", "11:30", 1, timeArr));
      timeArr.push("13:00");
      timeArr.concat(this.getNextTime("13:00", "15:00", 1, timeArr));
      return timeArr;
    },

    draw() {
      let _self = this;

      this.klines({ stock: this.stock, klineType: this.klineType }).then(
        (data) => {
          let _data = data.list;
          this.current = data.new;

          // 绘制分时折线图

          let _charts = createKline(this.klineType, {
            el: this.$refs.chart,
            barel: this.$refs.volumn,
            ...data,
            klineType: this.klineType,
            onChange: (data) => {
              _self.current = data;
            },
            onHide: () => {
              _self.current = data.new;
            },
          });

          this.lineChart = _charts.line;
          this.barChart = _charts.bar;
        }
      );
    },
  },
};
</script>
<style>
.gc-mode {
  position: absolute;
  top: 10px;
  right: 70px;
  color: #888;
  background: inherit;
  font: 11px -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu,
    Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
}
.timezone {
  position: absolute;
  top: 35px;
  right: 70px;
  color: #888;
  background: inherit;
  font: 11px -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu,
    Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
}
.timezone input {
  color: #4285f4;
  background: inherit;
  border: 1px dotted #808080;
  border-radius: 3px;
  text-align: end;
}
.log-scale {
  position: absolute;
  top: 60px;
  right: 80px;
  color: #888;
  font: 11px -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu,
    Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
}
@media only screen and (max-device-width: 480px) {
  .tf-selector {
    top: 50px;
    right: 140px;
    max-width: 140px;
    font: 12px -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
      Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  }
  .log-scale,
  .gc-mode {
    right: 50px !important;
  }
}
</style>