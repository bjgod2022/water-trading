<template>
  <div>
    <!-- {{ stock.yesterday }} -->
    <trading-vue :id="kineline" :data="dc" :width="width" :height="height" :overlays="ovs" :toolbar="true"
      :chart-config="{ DEFAULT_LEN: 500 }" title-txt="分时" :timezone="8" :index-based="index_based"
      :legend-buttons="['display', 'settings', 'up', 'down', 'add', 'remove']" :x-settings="xsett" :extensions="ext">
    </trading-vue>
    <!-- <span class="gc-mode">
      <input type="checkbox" v-model="index_based" />
      <label>连续数据</label>
    </span> -->
    <!-- <span class="timezone">
      <input type="number" min="-12" max="12" v-model="timezone" />
      <label>时区</label>
    </span> -->
  </div>
</template>
<script>
// import TradingVue from "trading-vue-js";
import Data from "./datamin.json";
import Stoch from "./Stoch";
import { TradingVue } from "trading-vue-js";
import Grin from "./Grin.js"; // New import
import Overlays from "tvjs-overlays";
import { DataCube } from "trading-vue-js";
import XP from "tvjs-xp";
import Extensions from "tvjs-xp";
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
  // name: "app",
  name: "kline-line",
  icon: "⚡",
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
    Overlays,
  },
  data () {
    return {
      timezone: 8,
      kineline: "kineline",
      extensions: Object.values(Extensions),
      ext_names: Object.keys(Extensions),
      ext: Object.values(XP),
      // overlays: [Grin, Overlays["MACD"], Overlays["EMA"]],

      current: {},
      barChart: null,
      lineChart: null,
      code: undefined,
      timer: "", // 定时刷新器
      trading: "",
      index_based: true,
      dc: new DataCube(Data),
      xsett: {
        "grid-resize": { min_height: 30 },
        "extension-id-2": {
          /* ... */
        },
      },
      ovs: Object.values(Overlays),
      minChart: {
        chart: {
          // type: "Splines",
          type: "Candles",
          data: [],
          settings: {
            priceLine: true,
            showVolume: false,
            colorCandleDw: "red",
          },
        },
        onchart: [
          {
            name: "价格线", // Or template, e.g. "RSI, $length"
            type: "EMA",
            data: [],

            settings: { lineWidth: "2", color: "red" }, // Arbitrary settings format
          },
          {
            name: "周易",
            type: "GRIN",
            data: [],
            settings: {
              "z-index": -10,
            },
          },
        ],
        offchart: [
          // {
          //   name: "成交量",
          //   type: "Volume",
          //   data: [],
          //   settings: {
          //     "z-index": 15,
          //   },
          // },
          {
            name: "MACD",
            type: "MACD",
            data: [],
            settings: {
              histColors: ["#35a776", "#79e0b3", "#e54150", "#ea969e"],
            },
          },
        ],
      },
      // overlays: [Stoch],
      title: "",
      width: window.innerWidth,
      height: window.innerHeight - 200,
      colors: {
        colorBack: "#fff",
        colorGrid: "#eee",
        colorText: "#E0AC58",
      },
      buttons: ["display", "settings", "remove"],
    };
  },
  mounted () {
    window.addEventListener("resize", this.onResize);

    setTimeout(this.draw, this.delay);
    this.code = this.stock;
    this.initChart();
  },
  beforeDestroy () {
    window.removeEventListener("resize", this.onResize);

    this.$once("hook:beforeDestroy", () => {
      echarts.dispose(this.chart);
      clearInterval(this.timer);
    });
  },
  watch: {
    stock: {
      handler (val) {
        this.code = val;
        this.setOptions();
      },
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
  methods: {
    onResize (event) {
      if (window.innerWidth > 768) {
        this.width = window.innerWidth;
      } else {
        this.width = window.innerWidth;
      }
      // this.width = window.innerWidth;
      this.height = window.innerHeight;
    },
    //
    ...mapActions(["klines"]),
    initChart () {
      // this.chart = echarts.init(document.getElementById(this.id));
      this.setOptions();
      this.timer = setInterval(() => {
        if (ifCurTimeIsTradeTime()) {
          //判断当前是否为交易时间
          this.setOptions();
        }
      }, 3000);
    },
    setOptions () {
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

      this.klines({ stock: this.stock, klineType: this.klineType }).then(
        (data) => {
          let _data = data.list;
          this.current = data.new;
          let baseNumber = Number(data.basic);
          let minVal = Number(data.min + 0.01);
          let maxVal = Number(data.max + 0.01);
          let interval =
            minVal > maxVal
              ? Math.abs((baseNumber - minVal) / 3)
              : Math.abs((baseNumber - maxVal) / 3);
          let minivalues = [];
          let minivaluess = [];
          let volumes = [];
          let lineWidth = 12;
          let colorCandleUp = "";
          let colorCandleDw = "";
          let colorWickUp = "";
          let colorWickDw = "";
          let color = "";

          for (let i = 0; i < data.list.length; i++) {
            // if (data.list[i].price * 1 < this.stock.yesterday * 1) {
            //   colorCandleUp = "#4283f4";
            //   colorCandleDw = "#4283f4";
            //   colorWickUp = "#4283f4";
            //   colorWickDw = "#4283f4";
            //   // color = 'red';
            // } else {
            //   colorCandleUp = "red";
            //   colorCandleDw = "red";
            //   colorWickUp = "red";
            //   colorWickDw = "red";
            //   // color = 'green';
            // }
            minivalues.push([
              new Date(data.list[i].time.replace(/-/g, "/")).getTime(),
              data.list[i].price,
              data.list[i].price,
              data.list[i].price,
              data.list[i].price,
              data.list[i].text,

              // {
              //   "colorCandleUp": colorCandleUp,
              //   "colorCandleDw": colorCandleDw,
              //   "colorWickUp": colorWickUp,
              //   "colorWickDw": colorWickDw,
              //   "lineWidth": lineWidth,
              //   // "color": color,

              // }
            ]);
            if (data.list[i].time.substr(11, 15) == "15:00") {
              volumes.push([
                new Date(data.list[i].time.replace(/-/g, "/")).getTime(),
                data.list[i].time.substr(0, 18),
                0,
                "#777",
                // data.list[i].text,
                // data.list[i].start < data.list[i].end ? 1 : -1,
              ]);
            }

            priceArr.push(data.list[i].price);
            priceAvg.push(data.list[i].price);
            vol.push(data.list[i].text);
            times.push(data.list[i].time);
            // if(i==0){
            //     vol.push(data.list[i].volumn);
            //     }else{
            //         vol.push(data.list[i].volumn-data.list[i-1].volumn)
            //     };
            if (i < 5) {
              suUp.push(data.list[0].price);
            } else {
              suUp.push(data.list[i - 5].price);
            }
            priceRate.push(data.list[i].rate);
            // timesetp.push(data.list[i].rate);
          }
          // this.minChart.chart.data = minivalues;
          //       {
          //   "name": "日期分界线",
          //   "type": "Splitters",
          //   "data": [],
          //   "settings": {
          //     "legend": false
          //   }
          // }
          // console.log(volumes, "volumes");
          Data.chart.data = minivalues;
          // Data.offchart[0] = {
          //   "name": "RSI, 20",
          //   "type": "RSI",
          //   "settings": {
          //     "lineWidth": 2,
          //     "upper": 70,
          //     "lower": 30,
          //     "backColor": "#85c42731"
          //   }
          // }
          // Data.onchart[0].type = "Splitters";
          // Data.onchart[0].data = volumes;
          // Data.onchart[0] = {
          //   "name": "日期分界线",
          //   "type": "Splitters",
          //   "data": volumes,
          //   "settings": {
          //     // "legend": false
          //   }
          // }
          // this.chart.onchart[0].data = this.calculateWeek(21, minivalues);

          // this.minChart.onchart[0].data = minivaluess;
          // this.minChart.offchart[0].data = volumes;

          // 闪烁点
          let pricesEffectScatter = [
            {
              value: [data.new.time, data.new.price],
              symbolSize: 15,
            },
          ];

          let pricesUp =
            ((priceArr[priceArr.length] - suUp[priceArr.length]) / baseNumber) *
            10000;
          // let times = timesetp
          let bgColor = "#fff"; //背景
          let upColor = "#EC433D"; //涨颜色
          let downColor = "#44A55B"; //跌颜色
          let labelColor = "#666"; //文字颜色
          let borderColor = "#bebebe"; // 图标边框色，会影响坐标轴上悬浮框的背景色
          let curColor = "#39afe6"; //分时价格线颜色
          let avgColor = "#E0AC58"; //均价线颜色
          let centerColor = "#4289c5"; //分时图中间线颜色
        }
      );
    },
    handleCode (stockCode) {
      let suffix = stockCode.substr(0, 2);
      let ts_code = stockCode.substr(2, 6) + "." + suffix.toUpperCase();
      let type = this.chartType;
      return { ts_code: ts_code, type: type };
    },
    calculateWeek (dayCount, values) {
      let result = [];
      for (let i = 0, len = values.length; i < len; i++) {
        if (values[i][0]) {
        }

        if (i < dayCount) {
          result.push("-");
          continue;
        }
        let sum = 0;
        for (let j = 0; j < dayCount; j++) {
          sum += values[i - j][1];
        }
        result.push(+(sum / dayCount));
      }
      return result;
    },
    calculateMA (dayCount, values) {
      let result = [];
      for (let i = 0, len = values.length; i < len; i++) {
        if (i < dayCount) {
          result.push("-");
          continue;
        }
        let sum = 0;
        for (let j = 0; j < dayCount; j++) {
          sum += values[i - j][1];
        }
        result.push(+(sum / dayCount));
      }
      return result;
    },
    handleColor (compareNum, baseNum) {
      let color = "";
      if (compareNum > baseNum) {
        color = 'style="color:' + this.upColor + '"';
      } else if (compareNum < baseNum) {
        color = 'style="color:' + this.downColor + '"';
      } else {
        color = "";
      }
      return color;
    },
    ratioCalculate (price, yclose) {
      return (((price - yclose) / yclose) * 100).toFixed(2);
    },
    addTimeStr (time, num) {
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
    getNextTime (startTime, endTIme, offset, resultArr) {
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
    time_arr () {
      //生成沪深时间段
      let timeArr = [];
      timeArr.push("09:30");
      timeArr.concat(this.getNextTime("09:30", "11:30", 1, timeArr));
      timeArr.push("13:00");
      timeArr.concat(this.getNextTime("13:00", "15:00", 1, timeArr));
      return timeArr;
    },

    draw () {
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
<!-- <style lang="scss" scoped>
@import "@/common/scss/variable.scss";
.chart-wrapper {
  min-height: 624px;
}
canvas#chart {
  width: 700px;
  height: 500px;
  margin-top: 10px;
}
canvas#volumn {
  width: 700px;
  height: 100px;
}
</style> -->