<template>
  <div
    :id="id"
    style="width: 100vw"
    :stockCode1="stockCode1"
    :stockCode2="stockCode2"
  >
    <!-- <div>
      <div>
        <button @click="showParentComp">点击显示子组件02内容</button>
      </div>
    </div> -->
    <!-- <div class="minText">
      <el-link type="primary" @click="jumpToIndex(stockInfo[2])">{{stockInfo[1]}}</el-link>&nbsp;&nbsp;
      <span :style="colorStr">
        {{stockInfo[3]}}&nbsp;&nbsp;{{stockInfo[32]}}%&nbsp;&nbsp;{{stockInfo[31]}}
      </span>
    </div> -->
    <div :id="id + '1'" :style="{ height: height, width: width }"></div>
    <!-- <div>22222</div> -->
  </div>
</template>

<script>
import * as echarts from "echarts";
import { getColor } from "@/utils/stockUtils";

import {
  changeToIndexCode1,
  changeToIndexCode2,
  ifCurTimeIsTradeTime,
} from "../../utils/stockUtils";

let chart = null;
export default {
  name: "MinMinuteChart",
  props: {
    stockCode1: {
      type: String,
    },
    stockCode2: {
      type: String,
    },
    className: {
      type: String,
      default: "chart",
    },
    id: {
      type: String,
      default: "chart",
    },
    width: {
      type: String,
      default: "165px",
    },
    height: {
      type: String,
      default: "40px",
    },
  },
  data() {
    return {
      bodyTimer: "", // 定时刷新器
      headTimer: "",
      colorStr: "",
      stockInfo: [],
      suUp: 0,
    };
  },
  mounted() {
    this.initChart();
    this.setStockHead();
    // this.showParentComp();
  },
  beforeDestroy() {
    this.$once("hook:beforeDestroy", () => {
      echarts.dispose(this.chart);
      clearInterval(this.bodyTimer);
      clearInterval(this.headTimer);
    });
  },
  watch: {
    stockCode2: {
      handler(val) {
        this.setOptions(val);
      },
    },
    stockCode1: {
      handler(val) {
        this.getStockHeadInfo(val);
      },
    },
  },
  methods: {
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id + "1"));
      this.setOptions(this.stockCode2);
      this.bodyTimer = setInterval(() => {
        //判断当前是否为交易时间
        if (ifCurTimeIsTradeTime()) {
          this.setOptions(this.stockCode2);
        }
        // this.showParentComp();
      }, 3000);
    },
    setStockHead() {
      this.getStockHeadInfo(this.stockCode1);

      this.headTimer = setInterval(() => {
        if (ifCurTimeIsTradeTime()) {
          //判断当前是否为交易时间
          this.getStockHeadInfo(this.stockCode1);
        }
      }, 200000000);
    },
    getStockHeadInfo(stockCode1) {
      this.$store.dispatch("stock/getStockInfo", stockCode1).then((res) => {
        this.stockInfo = res.data.split("~");
        this.colorStr = getColor(
          Number(this.stockInfo[3]),
          Number(this.stockInfo[4])
        );
      });
    },
    setOptions(stockCode2) {
      // console.log(stockCode2, " setOptions(stockCode2) {");
      this.$store.dispatch("stock/getMinuteStock", stockCode2).then((res) => {
        // console.log('min:',res);
        let _this = this;
        let priceArr = [];
        let priceAvg = [];
        let vol = [];
        // let suUp = 0;
        let times = this.time_arr();
        let yestclose = res.yestclose;
        for (let i = 0; i < res.data.length; i++) {
          priceArr.push(res.data[i][1]);
          priceAvg.push(res.data[i][2]);
          vol.push(res.data[i][3]);
          if (i < 5) {
            this.suUp = res.data[0][1];
          } else {
            this.suUp = res.data[i - 5][1];
          }
        }

        let baseNumber = Number(yestclose);
        let minVal =
          Number(baseNumber) -
          baseNumber * this.handleNum(baseNumber, priceArr);
        let maxVal =
          Number(baseNumber) +
          baseNumber * this.handleNum(baseNumber, priceArr);
        let interval =
          minVal > maxVal
            ? Math.abs(baseNumber - minVal)
            : Math.abs(baseNumber - maxVal);
        let bgColor = ""; //背景
        let upColor = "#EC433D"; //涨颜色
        let downColor = "#44A55B"; //跌颜色
        let borderColor = "#f3f3f3"; // 图标边框色，会影响坐标轴上悬浮框的背景色
        let curColor = "rgb(77, 65, 247)"; //分时价格线颜色
        let avgColor = "rgb(221, 245, 2)"; //均价线颜色
        let centerColor = "#4289c5"; //分时图中间线颜色
        this.chart.setOption({
          animation: false,
          tooltip: {
            //弹框指示器
            trigger: "axis",
            backgroundColor: "#f1f1f1",
            borderColor: "#ccc",
            borderWidth: 1,
            textStyle: {
              color: "#333",
            },
            axisPointer: {
              type: "cross",
              label: {
                show: true,
                backgroundColor: "#333",
              },
            },
            formatter: function (params) {
              let i = params[0].dataIndex;
              let color;
              if (priceArr[i] > yestclose) {
                color = 'style="color:' + upColor + '"';
              } else {
                color = 'style="color:' + downColor + '"';
              }
              let html =
                '<div class="commColor" style="width:90px z-index:99">' +
                "<div>时间：<span>" +
                times[i] +
                "</span></div>" +
                "<div>价格：<span  " +
                color +
                " >" +
                priceArr[i].toFixed(2) +
                "</span></div>" +
                "<div>涨幅：<span  " +
                color +
                " >" +
                _this.ratioCalculate(priceArr[i], yestclose) +
                "%</span></div>";
              return html;
            },
          },
          color: [curColor, avgColor, centerColor],
          grid: [
            // borderWidth=0,
            {
              borderWidth: 0,
              show: false,
              // borderColor: borderColor,
              id: "gd1",
              height: "97%", //主K线的高度,
              top: "2%",
            },
            {
              borderWidth: 0,
              show: false,
              // borderColor: borderColor,
              id: "gd2",
              height: "97%", //主K线的高度,
              top: "2%",
            },
          ],
          xAxis: [
            //==== x轴
            {
              //主图

              gridIndex: 0,
              boundaryGap: false,
              axisTick: {
                show: false,
              },
              axisLine: {
                show: false,
                lineStyle: {
                  // color:'red',
                },
              },
              data: times,
              axisLabel: {
                //label文字设置
                show: false,
              },
              axisPointer: {
                //去掉主图x轴上的时间标签
                show: true,
              },
              splitLine: {
                //分割线设置
                show: false,
                interval: 120,
                lineStyle: {
                  type: "dashed",
                },
              },
            },
            {
              show: false,
              gridIndex: 1,
              boundaryGap: false,
              data: times,
              axisLabel: {
                //label文字设置
                show: false,
              },
              axisPointer: {
                //去掉主图x轴上的时间标签

                show: false,
                label: {
                  show: false,
                },
              },
              axisLine: {
                lineStyle: {
                  color: borderColor,
                },
              },
            },
          ],
          yAxis: [
            //y轴
            {
              type: "value",
              min: minVal,
              max: maxVal,
              interval: interval,
              gridIndex: 0,
              scale: true,
              axisTick: {
                // 分割线 短
                show: false,
              },
              axisLine: {
                show: false,
                lineStyle: {
                  color: borderColor,
                },
              },
              axisPointer: {
                show: false,
              },
              axisLabel: {
                show: false,
                color: "#333",
                inside: true,
                fontSize: 5,
                formatter: function (val) {
                  if (val > yestclose) {
                    return "{red|\n\n" + val.toFixed(2) + "}";
                  } else if (val === baseNumber) {
                    return val.toFixed(2) + "\n";
                  } else {
                    return "{green|" + val.toFixed(2) + "\n}";
                  }
                },
                rich: {
                  red: {
                    color: "red",
                    fontSize: 5,
                    lineHeight: 10,
                  },
                  green: {
                    color: "green",
                    fontSize: 5,
                    lineHeight: 10,
                  },
                },
              },
              z: 4,
              splitLine: {
                //分割线设置

                show: false,
                lineStyle: {
                  type: "dashed",
                },
              },
            },
            {
              scale: true,
              gridIndex: 1,
              min: minVal,
              max: maxVal,
              interval: interval,
              position: "right",
              z: 4,
              axisTick: {
                show: false,
              },
              axisLine: {
                lineStyle: {
                  color: borderColor,
                },
              },
              axisLabel: {
                //label文字设置
                show: false,
              },
              splitLine: {
                //分割线设置

                show: false,
                lineStyle: {
                  color: "#181a23",
                },
              },
              axisPointer: {
                show: false,
              },
            },
          ],
          backgroundColor: bgColor,
          blendMode: "source-over",
          series: [
            {
              name: "",
              type: "line",
              data: priceArr,
              smooth: true,
              symbol: "circle", //中时有小圆点
              lineStyle: {
                normal: {
                  opacity: 0.8,
                  color: curColor,
                  width: 1,
                },
              },
              // areaStyle: {
              //   color: {
              //     x: 0,
              //     y: 0,
              //     x2: 0,
              //     y2: 1,
              //     colorStops: [
              //       {
              //         offset: 0,
              //         color: "red", // 0% 处的颜色
              //       },
              //       {
              //         offset: 0.5,
              //         color: "rgba(220,56,129,0)", // 100% 处的颜色
              //       },
              //     ],
              //     globalCoord: false, // 缺省为 false
              //   },
              // },
              // areaStyle: {
              //   // normal: {
              //   //   color: ['rgba(0, 136, 212, 0.5)'],
              //   //   shadowColor: 'rgba(0, 0, 0, 0.1)',
              //   //   shadowBlur: 10
              //   // }
              // },
              markLine: {
                name: "昨日收盘价",
                symbol: ["none", "none"],
                label: {
                  show: false,
                },
                lineStyle: {
                  show: false,

                  color: centerColor,
                  type: "dashed",
                },
                data: [
                  {
                    yAxis: yestclose,
                  },
                ],
              },
            },
            {
              name: "当前价",
              type: "line",
              data: priceArr,
              smooth: true,
              symbol: "none",
              gridIndex: 1,
              xAxisIndex: 1,
              yAxisIndex: 1,

              lineStyle: {
                normal: {
                  opacity: 0.8,
                  color: curColor,
                  width: 1,
                },
              },
            },
            {
              name: "均价",
              type: "line",
              data: priceAvg,
              smooth: true,
              symbol: "none",
              lineStyle: {
                normal: {
                  opacity: 0.8,
                  color: avgColor,
                  width: 1,
                },
              },
            },
          ],
        });
      });
    },
    handleNum(baseNumber, priceArr) {
      let _aa = Math.abs(
        (Math.max.apply(null, priceArr) - baseNumber) / baseNumber
      ).toFixed(4);
      let _bb = Math.abs(
        (baseNumber - Math.min.apply(null, priceArr)) / baseNumber
      ).toFixed(4);
      return _aa > _bb ? _aa : _bb;
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
    time_arr() {
      //生成沪深时间段
      let timeArr = [];
      timeArr.push("09:30");
      timeArr.concat(this.getNextTime("09:30", "11:30", 1, timeArr));
      timeArr.push("13:00");
      timeArr.concat(this.getNextTime("13:00", "15:00", 1, timeArr));
      return timeArr;
    },
    jumpToIndex(code) {
      let indexCode1 = changeToIndexCode1(code);
      let indexCode2 = changeToIndexCode2(code);
      let query = { indexCode1: indexCode1, indexCode2: indexCode2 };
      this.$store.dispatch("stock/saveStockCodeToIndex", query);
      this.$router.push({ path: "/market/market" });
    },
  },
};
</script>
<!-- <style>
  .minText {
    text-align: center;
    margin: 0px auto 0px auto;
  }
</style> -->
