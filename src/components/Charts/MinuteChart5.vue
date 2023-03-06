<template>
  <div>
    <div
      :id="id"
      :class="className"
      :style="{ height: height, width: width }"
      :stockCode2="stockCode2"
    ></div>
    {{ stockCode2 }}
    <!-- {{ stockCode2 }}
  {{ stockCode1 }} -->
  </div>
</template>

<script>
import * as echarts from "echarts";
import { handleChartVol, ifCurTimeIsTradeTime } from "../../utils/stockUtils";
let chart = null;
export default {
  name: "MinuteChart",
  props: {
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
      default: "400px",
    },
    height: {
      type: String,
      default: "200px",
    },
  },
  data() {
    return {
      code: undefined,
      timer: "", // 定时刷新器
    };
  },
  mounted() {
    this.code = this.stockCode2;
    this.initChart();
  },
  beforeDestroy() {
    this.$once("hook:beforeDestroy", () => {
      echarts.dispose(this.chart);
      clearInterval(this.timer);
    });
  },
  watch: {
    stockCode2: {
      handler(val) {
        console.log("body watch:" + val);
        this.code = val;
        this.setOptions(this.code);
      },
    },
  },
  methods: {
    initChart() {
      // console.log("body: "+ this.code);
      this.chart = echarts.init(document.getElementById(this.id));
      this.setOptions(this.code);
      console.log("body: " + this.code);
      this.timer = setInterval(() => {
        // console.log("body: "+ this.code);
        this.setOptions(this.code);
        // if (ifCurTimeIsTradeTime()) { //判断当前是否为交易时间
        //     this.setOptions(this.code);
        // }
      }, 30000000);
    },
    setOptions(stockCode2) {
      console.log("_datas", stockCode2, "_datas");
      this.$store.dispatch("stock/getMinuteStock5", stockCode2).then((res) => {
        let _datas = window[`fdays_data_${stockCode2}`].data[stockCode2].data;
        let _klines = [];
        _datas.reverse();
        console.log("_datas", res, "_datas");
      });
    },
    //   console.log('_datas',stockCode2,'_datas')
    //   this.$store.dispatch('stock/getMinuteStock5', stockCode2).then(res => {
    //     // let _datas=window[`fdays_data_${stockCode2}`].data[stockCode2].data
    //     // let _klines=[]
    //     // _datas.reverse()
    //     console.log('_datas',res,'_datas')
    //     let _this = this;
    //     let priceArr = [];
    //     let priceAvg = [];
    //     let vol = [];
    //     let times = this.time_arr();
    //     let yestclose = res.yestclose;

    //     for (let i = 0; i < res.data.length; i++) {
    //       priceArr.push(res.data[i][1]);
    //       priceAvg.push(res.data[i][2]);
    //       vol.push(res.data[i][3]);
    //     }
    //     // console.log(stockCode2,'价格曲线')
    //     let baseNumber = Number(yestclose).toFixed(2);
    //     let minVal = (Number(baseNumber) - baseNumber * this.handleNum(baseNumber, priceArr));
    //     let maxVal = (Number(baseNumber) + baseNumber * this.handleNum(baseNumber, priceArr));
    //     let interval = minVal > maxVal ? Math.abs((baseNumber - minVal) / 3) : Math.abs((baseNumber - maxVal) / 3);
    //     let bgColor = "#fff";//背景
    //     let upColor = "#EC433D";//涨颜色
    //     let downColor = "#44A55B";//跌颜色
    //     let labelColor = "#666"; //文字颜色
    //     let borderColor = "#bebebe";// 图标边框色，会影响坐标轴上悬浮框的背景色
    //     let curColor = "#39afe6";  //分时价格线颜色
    //     let avgColor = "#E0AC58"; //均价线颜色
    //     let centerColor = "#4289c5"; //分时图中间线颜色
    //     this.chart.setOption({
    //       animation: false,
    //       axisPointer: {
    //         show: true,
    //         link: [
    //           {
    //             xAxisIndex: [0, 2],
    //           }, {
    //             yAxisIndex: [0, 2]
    //           }
    //         ]
    //       },
    //       tooltip: { //弹框指示器
    //         trigger: 'axis',
    //         backgroundColor: "#f1ff1",
    //         borderColor: "#ccc",
    //         borderWidth: 1,
    //         textStyle: {
    //           color: '#333'
    //         },
    //         axisPointer: {
    //           type: 'cross',
    //           label: {
    //             show: true,
    //             backgroundColor: '#333'
    //           }
    //         },
    //         formatter: function (params) {
    //           let i = params[0].dataIndex;
    //           let color;
    //           if (priceArr[i] > yestclose) {
    //             color = 'style="color:' + upColor + '"';
    //           } else {
    //             color = 'style="color:' + downColor + '"';
    //           }
    //           let html = '<div class="commColor" style="width:140px;">\
    //             <div>现价 <span  ' + color + ' >' + priceArr[i] + '</span></div>\
    //             <div>均价 <span  ' + color + ' >' + priceAvg[i].toFixed(2) + '</span></div>\
    //             <div>涨幅 <span  ' + color + ' >' + _this.ratioCalculate(priceArr[i], yestclose) + '%</span></div>\
    //             <div>成交量 <span  ' + color + ' >' + handleChartVol(Number(vol[i])) + '</span></div></div>';
    //           return html;
    //         }
    //       },
    //       color: [curColor, avgColor, centerColor],
    //       grid: [{
    //         show: true,
    //         borderColor: borderColor,
    //         id: 'gd1',
    //         height: '63%', //主K线的高度,

    //         top: '9%'
    //       }, {
    //         show: true,
    //         borderColor: borderColor,
    //         id: 'gd2',
    //         height: '63%', //主K线的高度,
    //         top: '9%'
    //       }, {
    //         show: true,
    //         borderColor: borderColor,
    //         id: 'gd3',
    //         top: '76%',
    //         height: '16%' //交易量图的高度
    //       }],
    //        // 下方滑块
    //       dataZoom: [
    //           {
    //               show: true,
    //               realtime: true,
    //           },
    //           {
    //               type: 'inside',
    //               realtime: true,
    //           },
    //       ],
    //       xAxis: [ //==== x轴
    //         { //主图
    //           gridIndex: 0,
    //           boundaryGap: false,
    //           axisTick: {
    //             show: false
    //           },
    //           axisLine: {
    //             lineStyle: {
    //               color: borderColor,

    //             }
    //           },
    //           data: times,
    //           axisLabel: { //label文字设置
    //             show: false
    //           },
    //           axisPointer: { //去掉主图x轴上的时间标签
    //             show: true,
    //             label: {
    //               show: false
    //             }
    //           },
    //           splitLine: { //分割线设置
    //             show: true,
    //             lineStyle: {
    //               type: 'dashed',

    //             },
    //             interval: function (index, value) {
    //               if( index <= 120){
    //                 if (index  % 30 === 0) {
    //                   return true;
    //                 }else{
    //                   return false;
    //                 }
    //               }else if( index > 121){
    //                 if( index % 30 ===1 || index === 241){
    //                   return true;
    //                 }else{
    //                   return false;
    //                 }
    //               }else{
    //                 return false;
    //               }
    //             }
    //           },
    //         },
    //         {
    //           show: false,
    //           gridIndex: 1,
    //           boundaryGap: false,
    //           data: times,
    //           axisLabel: { //label文字设置
    //             show: false
    //           },
    //           axisPointer: { //去掉主图x轴上的时间标签
    //             show: true,
    //             label: {
    //               show: false
    //             }
    //           },
    //           axisLine: {
    //             lineStyle: {
    //               color: borderColor,

    //             }
    //           },
    //         }, { //交易量图
    //           splitNumber: 2,
    //           type: 'category',
    //           gridIndex: 2,
    //           boundaryGap: false,
    //           data: times,
    //           axisLabel: { //label文字设置
    //             color: labelColor,
    //             fontSize: 10,

    //             interval: function (index, value) {
    //               if( index <= 120){
    //                 if (index  % 30 === 0) {
    //                   return true;
    //                 }else{
    //                   return false;
    //                 }
    //               }else if( index > 121){
    //                 if( index % 30 ===1 || index === 241){
    //                   return true;
    //                 }else{
    //                   return false;
    //                 }
    //               }else{
    //                 return false;
    //               }
    //             }
    //           },
    //           axisTick: {
    //             show: false
    //           },
    //           splitLine: { //分割线设置
    //             show: true,
    //             lineStyle: {
    //               type: 'dashed'
    //             }
    //           },
    //           axisLine: {
    //             lineStyle: {
    //               color: borderColor,

    //             }
    //           }
    //         }
    //       ],
    //       yAxis: [ //y轴
    //         {
    //           type: 'value',
    //           min: minVal,
    //           max: maxVal,
    //           interval: interval,
    //           gridIndex: 0,
    //           scale: true,
    //           // smooth: true,
    //           axisTick: { // 分割线 短
    //             show: false
    //           },
    //           axisLine: {
    //             lineStyle: {
    //               color: borderColor,

    //             }
    //           },
    //           axisPointer: {
    //             show: true,
    //             label: {
    //               formatter: function (params) {
    //                 return (params.value).toFixed(2);
    //               }
    //             }
    //           },
    //           axisLabel: {
    //             color: '#333',

    //             formatter: function (val) {
    //               val = val.toFixed(2);
    //               if (val > yestclose) {
    //                 return '{red|' + val + '}';
    //               } else if (val === baseNumber) {
    //                 return val;
    //               } else {
    //                 return '{green|' + val + '}';
    //               }
    //             },
    //             rich: {
    //               red: {
    //                 color: 'red',
    //                 lineHeight: 10,

    //               },
    //               green: {
    //                 color: 'green',
    //                 lineHeight: 10
    //               }
    //             }
    //           },
    //           z: 4,
    //           splitLine: { //分割线设置
    //             show: true,
    //             lineStyle: {
    //               type: 'dashed'

    //             }
    //           },
    //         }, {
    //           scale: true,
    //           gridIndex: 1,
    //           min: minVal,
    //           max: maxVal,
    //           interval: interval,
    //           position: 'right',
    //           z: 4,
    //           axisTick: {
    //             show: false
    //           },
    //           axisLine: {
    //             lineStyle: {

    //               color: borderColor,

    //             }
    //           },
    //           axisLabel: { //label文字设置
    //             color: function (val) {
    //               val = Number(val).toFixed(2)
    //               if (val === baseNumber) {
    //                 return '#333'
    //               }
    //               return Number(val) > Number(baseNumber) ? upColor : downColor;
    //             },
    //             inside: false, //label文字朝内对齐
    //             formatter: function (val) {
    //               let resul = _this.ratioCalculate(val, baseNumber);
    //               return Number(resul).toFixed(2) + '%'
    //             }
    //           },
    //           //
    //           visualMap: {
    //                   show: false,
    //                   dimension: 0,
    //                   priceArr: [{
    //                       gt: 0,

    //                       color: '#096'
    //                   }, {

    //                       lte:0,
    //                       color: '#ffde33'
    //                   }, {
    //                       gt: 100,
    //                       lte: 150,
    //                       color: '#ff9933'
    //                   }],
    //                   outOfRange: {
    //                       color: '#999'
    //                   }
    //               },
    //           //
    //           splitLine: { //分割线设置
    //             show: false,

    //             lineStyle: {
    //               color: '#181a23',

    //             }
    //           },
    //           axisPointer: {
    //             show: true,
    //             label: {
    //               formatter: function (params) { //计算右边Y轴对应的当前价的涨幅比例
    //                 return _this.ratioCalculate(params.value, baseNumber) + '%';
    //               }
    //             }
    //           }
    //         }, { //交易图
    //           // name: '万',
    //           nameGap: '0',
    //           nameTextStyle: {
    //             color: labelColor
    //           },
    //           gridIndex: 2,
    //           z: 4,
    //           splitNumber: 3,
    //           axisLine: {

    //             onZero: false,
    //             lineStyle: {
    //               color: borderColor,
    //             }
    //           },
    //           axisTick: {
    //             show: false
    //           },
    //           axisPointer: {
    //             show: false,
    //             label: {
    //               formatter: function (params) { //计算右边Y轴对应的当前价的涨幅比例
    //                 let _p = ((params.value) / 10000).toFixed(1) + '万';
    //                 return _p
    //               }
    //             }
    //           },
    //           splitLine: { //分割线设置
    //             show: false,

    //           },
    //           axisLabel: { //label文字设置
    //             color: labelColor,
    //             inside: false, //label文字朝内对齐
    //             fontSize: '60%',

    //             onZero: false,
    //             formatter: function (params) { //计算右边Y轴对应的当前价的涨幅比例
    //               let _p = (params / 10000).toFixed(1);
    //               if (params === 0) {
    //                 _p = '(万)'
    //               }
    //               return _p
    //             }
    //           },
    //         }
    //       ],
    //       backgroundColor: bgColor,
    //       blendMode: 'source-over',
    //       series: [{
    //         name: '',
    //         type: 'line',
    //         data: priceArr,
    //         smooth: true,
    //         symbol: "circle", //中时有小圆点
    //         lineStyle: {

    //           normal: {

    //             opacity: 0.8,
    //             color: curColor,
    //             width: 2
    //           }
    //         },
    //         areaStyle: {

    //           color: {
    //               x: 0,
    //               y: 0,
    //               x2: 0,
    //               y2: 1,
    //               colorStops: [{
    //                   offset: 0,
    //                   color: "red" // 0% 处的颜色
    //                 }, {
    //                   offset: 0.5,
    //                   color: "rgba(220,56,129,0)" // 100% 处的颜色
    //                 }],
    //                   globalCoord: false // 缺省为 false
    //                 }
    //           // normal: {
    //           //   color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
    //           //     offset: 0,
    //           //     color: 'rgba(0, 136, 212, 0.5)'
    //           //   }, {
    //           //     offset: 0.8,
    //           //     color: 'rgba(0, 136, 212, 0.5)'
    //           //   }], false),
    //           //   color: ['rgba(0, 136, 212, 0.5)'],
    //           //   shadowColor: 'rgba(0, 0, 0, 0.1)',
    //           //   shadowBlur: 10
    //           // }
    //         },
    //         markLine: {
    //           name: '昨日收盘价',
    //           symbol: ['none', 'none'],
    //           label: {
    //             show: false,
    //             formatter: Number(yestclose).toFixed(2),
    //             position: 'start',
    //           },
    //           lineStyle: {

    //             color: centerColor,
    //             type: 'dashed'
    //           },
    //           data: [{
    //             yAxis: yestclose,
    //           }]
    //         }
    //       },
    //         {
    //           name: '当前价',
    //           type: 'line',
    //           data: priceArr,
    //           smooth: true,
    //           symbol: "none",
    //           gridIndex: 1,
    //           xAxisIndex: 1,
    //           yAxisIndex: 1,
    //           lineStyle: {

    //             normal: {

    //               opacity: 0.8,
    //               color: curColor,
    //               width: 1
    //             }
    //           },
    //         },
    //         {
    //           name: '均价',
    //           type: 'line',
    //           data: priceAvg,
    //           smooth: true,
    //           symbol: "none",
    //           lineStyle: {

    //             normal: {
    //               opacity: 0.8,
    //               color: avgColor,
    //               width: 1
    //             }
    //           },
    //         },
    //         {
    //           name: '',
    //           type: 'bar',
    //           gridIndex: 2,
    //           xAxisIndex: 2,
    //           yAxisIndex: 2,
    //           data: vol,
    //           barWidth: '60%',
    //           itemStyle: {

    //               color: function (params) {
    //                 var colorList;
    //                 if (priceArr[params.dataIndex] > priceArr[params.dataIndex - 1]) {
    //                   colorList = upColor;
    //                 } else {
    //                   colorList = downColor;
    //                 }
    //                 return colorList;
    //               },

    //           }
    //         }
    //       ]
    //     });
    //   })
    // },
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
  },
};
</script>

