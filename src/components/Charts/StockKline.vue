<template>
  <div>
    {{chartType}}
    {{id}}
    {{stockCode1}}
    {{className}}
    {{this.stockCode}}
     <!-- {{className}} -->
  <div :id="id" :class="className" :style="{height:height,width:width}" :stockCode="stockCode1" :chartTpe="chartType">
  </div>
</div>
</template>

<script>
  import * as echarts from 'echarts'
  let chart = null;
  export default {
    name: "stockKline",
    props: {
      stockCode1: {
        type: String
      },
      chartType: {
        type: String
      },
      className: {
        type: String
      },
      id: {
        type: String
      },
      width: {
        type: String,
        default: '400px'
      },
      height: {
        type: String,
        default: '200px'
      }
    },
    data() {
      return {
        code: undefined,
        upColor : '#EC433D',
        downColor : '#44A55B'
      }
    },
    mounted() {
      this.code = this.stockCode1;
      this.initChart();
    },
    watch: {
      stockCode1: {
        handler(val) {
          console.log("kline body watch stockCode:" + val);
          this.code = val;
          this.setOptions(this.code);
        }
      },
      chartType: {
        handler(val) {
          console.log("kline body watch chartType:" + val);
          this.chartType = val;
          this.setOptions(this.code);
        }
      }
    },
    beforeDestroy(){
      this.$once('hook:beforeDestroy', () => {
        echarts.dispose(this.chart);
      })
    },
    methods: {
      initChart() {
        this.chart = echarts.init(document.getElementById(this.id));
        this.setOptions(this.code);
      },
      setOptions(stockCode) {
        let query = this.handleCode(stockCode);
        let _this = this;
        this.$store.dispatch('stock/getStockInfo', stockCode).then(response => {

          let todayData = response.data.split("~");
          // console.log(todayData,'todayData')
          this.$store.dispatch('stock/getStockKlineInfo',stockCode).then(res => {

            //根据是何种类型的K线图，确定初始化的显示区间
            // let _this = this;
            let start = '';
            let len = res.data.length;
            if(len < 90){
              start = 100;
            }else{
              start = ((len - 80)/len)*100;
            }
            let tradeData = [];
            let values = [];
            let volumes = [];
            let preClose = [];
            let pctChg = [];
            let amount = [];
            for (let i = 0; i < res.data.length; i++) {
              tradeData.push(res.data[i].trade_date.substr(0,4)+'-'+res.data[i].trade_date.substr(4,2)+'-'+res.data[i].trade_date.substr(6,2));
              // 前四个渲染K线用的数据
              values.push([res.data[i].open, res.data[i].close,  res.data[i].low, res.data[i].high,
                res.data[i].vol]);
              preClose.push(res.data[i].pre_close);
              pctChg.push(res.data[i].pct_chg);
              volumes.push([i, res.data[i].vol, res.data[i].open < res.data[i].close ? 1 : -1]);
              amount.push(res.data[i].amount)
            }

            let today = new Date();
            let hour = Number(today.getHours());
            console.log("today22");
            console.log(today.getHours());

            //如果时间为9点～18点（默认数据库18点进行更新数据），则自行添加当天实时的日K数据
            if(9 <= hour && hour < 18 && this.chartType === "Daily") {
              tradeData.push(todayData[30].substr(0, 4) + '-' + todayData[30].substr(4, 2) + '-' + todayData[30].substr(6, 2));
              values.push([Number(todayData[5]), Number(todayData[3]), Number(todayData[34]), Number(todayData[33]),
                Number(todayData[36])]);
              preClose.push(todayData[4]);
              pctChg.push(todayData[32]);
              volumes.push([res.data.length, todayData[36], todayData[5] < todayData[3] ? 1 : -1]);
              amount.push(todayData[37]*10);
            }

            //如果时间为9点～18点（默认数据库18点进行更新数据），则自行添加当天实时的周K、月K数据
            if(9 <= hour && hour < 18 && (this.chartType === "Weekly" || this.chartType === "Monthly")) {
              tradeData.pop();
              tradeData.push(todayData[30].substr(0, 4) + '-' + todayData[30].substr(4, 2) + '-' + todayData[30].substr(6, 2));

              let valTemp = values.pop();
              values.push([valTemp[0], Number(todayData[3]),
                valTemp[2] < Number(todayData[34]) ? valTemp[2]:Number(todayData[34]),
                valTemp[3] > Number(todayData[33]) ? valTemp[3]:Number(todayData[33]),
                valTemp[4] + Number(todayData[36])]);

              pctChg.pop();
              pctChg.push(((Number(todayData[3])-valTemp[0])/valTemp[0] * 100).toFixed(2));

              let volTemp  = volumes.pop();
              volumes.push([res.data.length-1, (todayData[36]/1000000) + volTemp[1], valTemp[0] < todayData[3] ? 1 : -1]);

              let amountTemp = amount.pop();
              amount.push(amountTemp + todayData[37]*10);
            }
            let upColor = '#EC433D';
            let downColor = '#44A55B';
            let MA5Color = '#000000';
            let MA10Color = '#E0AC58';
            let MA20Color = '#73C8C6';
            let MA30Color = '#9C73AF';
            this.chart.setOption({
              backgroundColor: '#fff',
              animation: false,
              legend: {
                bottom: 10,
                left: 'center',
                data: [ 'MA5', 'MA10', 'MA20', 'MA30']
              },
              tooltip: {
                trigger: 'axis',
                axisPointer: {
                  type: 'cross'
                },
                backgroundColor: 'rgba(245, 245, 245, 0.8)',
                borderWidth: 1,
                borderColor: '#ccc',
                padding: 10,
                textStyle: {
                  color: '#000'
                },
                position: function (pos, params, el, elRect, size) {
                  var obj = {top: 10};
                  obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
                  return obj;
                },
                formatter: function (params) {
                  let param = params[0];
                  let i = param.dataIndex;

                  //成交量
                  let volStr = '';
                  if(volumes[i][1] > 100000000){
                    volStr = (volumes[i][1]/100000000).toFixed(2) + '亿手';
                  }else if(volumes[i][1] > 10000){
                    volStr = (volumes[i][1]/10000).toFixed(2) + '万手';
                  }else {
                    volStr = volumes[i][1] + '手';
                  }

                  //成交额
                  let amountStr = '';
                  if(amount[i] > 100000){
                    amountStr = (amount[i]/100000).toFixed(2) + '亿';
                  }else{
                    amountStr = (amount[i]/10).toFixed(2) + '万';
                  }

                  let html = '<div class="commColor" style="width:140px;">' +
                    '<div>日期: ' + tradeData[i] + '<hr size=1 style="margin: 3px 0">' +
                    '<div>今开: <span  ' + _this.handleColor(values[i][0],preClose[i]) + ' >' + values[i][0] + '</span></div>' +
                    '<div>今收: <span  ' + _this.handleColor(values[i][1],preClose[i]) + ' >' + values[i][1] + '</span></div>' +
                    '<div>最低: <span  ' + _this.handleColor(values[i][2],preClose[i]) + ' >' + values[i][2] + '</span></div>' +
                    '<div>最高: <span  ' + _this.handleColor(values[i][3],preClose[i]) + ' >' + values[i][3] + '</span></div>' +
                    '<div>涨幅: <span  ' + _this.handleColor(values[i][1],preClose[i]) + ' >' + pctChg[i] + '%</span></div>' +
                    '<div>成交量: <span>' + volStr + '</span></div>' +
                    '<div>成交额: <span>' + amountStr + '</span></div></div>';
                  return html;
                }
                // extraCssText: 'width: 170px'
              },
              axisPointer: {
                link: {xAxisIndex: 'all'},
                label: {
                  backgroundColor: '#777'
                }
              },
              visualMap: {
                show: false,
                seriesIndex: 5,
                dimension: 2,
                pieces: [{
                  value: 1,
                  color: upColor
                }, {
                  value: -1,
                  color: downColor
                }]
              },
              grid: [
                {
                  left: '10%',
                  right: '8%',
                  height: '50%'
                },
                {
                  left: '10%',
                  right: '8%',
                  top: '69%',
                  height: '15%'
                }
              ],
              xAxis: [
                {
                  type: 'category',
                  data: tradeData,
                  scale: true,
                  boundaryGap: false,
                  axisLine: {onZero: false},
                  splitLine: {show: false},
                  splitNumber: 20,
                  min: 'dataMin',
                  max: 'dataMax',
                  axisPointer: { //去掉主图的时间标签
                    show: true,
                    label: {
                      show: false
                    },
                    z: 100
                  }
                },
                {
                  type: 'category',
                  gridIndex: 1,
                  data: tradeData,
                  scale: true,
                  boundaryGap: false,
                  axisLine: {onZero: false},
                  axisTick: {show: false},
                  splitLine: {show: false},
                  axisLabel: {show: false},
                  splitNumber: 20,
                  min: 'dataMin',
                  max: 'dataMax'
                }
              ],
              yAxis: [
                {
                  scale: true,
                  splitArea: {show: false},
                  splitLine: {show: false}
                },
                {
                  scale: true,
                  gridIndex: 1,
                  splitNumber: 2,
                  axisLabel: {show: false},
                  axisLine: {show: false},
                  axisTick: {show: false},
                  splitLine: {show: false}
                }
              ],
              dataZoom: [
                {
                  show: false,
                  type: 'inside',
                  xAxisIndex: [0, 1],
                  start: start,
                  end: 100
                },
                {
                  show: true,
                  xAxisIndex: [0, 1],
                  type: 'slider',
                  top: '84%',
                  start: start,
                  end: 100
                }
              ],
              series: [
                {
                  name: 'stock',
                  type: 'candlestick',
                  symbol: 'none',
                  data: values,
                  itemStyle: {
                    color: upColor,
                    color0: downColor,
                    borderColor: null,
                    borderColor0: null
                  }
                },
                {
                  name: 'MA5',
                  type: 'line',
                  symbol: 'none',
                  data: this.calculateMA(5, values),
                  smooth: true,
                  itemStyle: {
                    color: MA5Color
                  },
                  lineStyle: {
                    width: 1.5,
                    opacity: 0.5
                  }
                },
                {
                  name: 'MA10',
                  type: 'line',
                  symbol: 'none',
                  data: this.calculateMA(10, values),
                  smooth: true,
                  itemStyle: {
                    color: MA10Color
                  },
                  lineStyle: {
                    width: 1.5,
                    opacity: 0.5
                  }
                },
                {
                  name: 'MA20',
                  type: 'line',
                  symbol: 'none',
                  data: this.calculateMA(20, values),
                  smooth: true,
                  itemStyle: {
                    color: MA20Color
                  },
                  lineStyle: {
                    width: 1.5,
                    opacity: 0.5
                  }
                },
                {
                  name: 'MA30',
                  type: 'line',
                  symbol: 'none',
                  data: this.calculateMA(30, values),
                  smooth: true,
                  itemStyle: {
                    color: MA30Color
                  },
                  lineStyle: {
                    width: 1.5,
                    opacity: 0.5
                  }
                },
                {
                  name: 'Volume',
                  type: 'bar',
                  symbol: 'none',
                  xAxisIndex: 1,
                  yAxisIndex: 1,
                  data: volumes
                }
              ]
            });
          })
          this.stockInfo = response.data.split("~");
          console.log(this.stockInfo);
          let preClose = this.stockInfo[4];
          this.colorArr.push(this.getColor(this.stockInfo[3],preClose));   //现价颜色
          this.colorArr.push(this.getColor(this.stockInfo[33],preClose));  //最高颜色
          this.colorArr.push(this.getColor(this.stockInfo[34],preClose));   //最低颜色
          this.colorArr.push(this.getColor(this.stockInfo[5],preClose));  //今开颜色
        })
      },
      handleCode(stockCode) {
        let suffix = stockCode.substr(0, 2);
        let ts_code = stockCode.substr(2, 6) + "." + suffix.toUpperCase();
        let type = this.chartType;
        return {ts_code: ts_code, type: type};
      },
      calculateMA(dayCount, values) {
        let result = [];
        for (let i = 0, len = values.length; i < len; i++) {
          if (i < dayCount) {
            result.push('-');
            continue;
          }
          let sum = 0;
          for (let j = 0; j < dayCount; j++) {
            sum += values[i - j][1];
          }
          result.push(+(sum / dayCount).toFixed(3));
        }
        return result;
      },
      handleColor(compareNum,baseNum){
        let color = '';
        if(compareNum > baseNum){
          color = 'style="color:' + this.upColor + '"';
        }else if(compareNum < baseNum){
          color = 'style="color:' + this.downColor + '"';
        }else{
          color = '';
        }
        return color;
      }
    }
  }
</script>

<style scoped>

</style>
