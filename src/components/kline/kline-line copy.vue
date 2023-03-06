<template>
<div class="chart-wrapper">
    <!-- {{ id }} -->
    <div :theme="purple" id="chart22"   style="width:700px; height:430px" 
                 >
                 <div :theme="purple" id="'chart22'+'1'" style="width:700px; height:430px"></div>
   
</div>
<kline-tooltip :klineType="klineType" v-if="klineType!='day'" :dataSource="current"></kline-tooltip>
<canvas id="chart" ref="chart" v-show="lineChart"></canvas>
    <canvas id="volumn" ref="volumn" v-show="lineChart"></canvas>
    <loading v-show="!lineChart"></loading>
</div>
</template>
<script>
import * as echarts from 'echarts'
import  purple from '@/assets/purple.json'
import {handleChartVol, ifCurTimeIsTradeTime} from "@/utils/stockUtils";
import {loading} from '../base'
import klineTooltip from './kline-tooltip.vue'
import {mapActions} from 'vuex'
import{KLINE_MAP} from '@/config/'
import{createKline} from '@/common/js/adaper'
let chart= null
export default {
    name:'kline-line',
    props:{
        stock:Object,
        klineType:String,
        delay:Number
    },
    components:{
        [loading.name]:loading,
        [klineTooltip.name]:klineTooltip
    },
    data(){
        return{
            purple,
            current:{},
            barChart:null,
            lineChart:null,
            code: undefined,
            timer:"" // 定时刷新器
        }
    },
    mounted(){
        setTimeout(this.draw,this.delay)
        // console.log(data.list),
        this.code = this.stock;
         this.initChart();
    },
    beforeDestroy(){
      this.$once('hook:beforeDestroy', () => {
        echarts.dispose(this.chart);
        clearInterval(this.timer);
      })
    },
    watch: {
      stock: {
        handler (val) {
        //   console.log("body watch:"+val);
          this.code = val;
          this.setOptions();
        }
      }
    },
    methods:{
        ...mapActions(['klines']),
        initChart() {
        // console.log("youmeiyouid"+ this.id);
            this.chart = echarts.init(document.getElementById('chart22'));
            this.setOptions();
            // console.log("body: "+ this.code);
            this.timer = setInterval(() => {
            // console.log("body: "+ this.code);
            this.setOptions();
            // if (ifCurTimeIsTradeTime()) { //判断当前是否为交易时间
            //     this.setOptions(this.code);
            // }
            }, 300000000)
        },
        setOptions() {
            let _this = this;
            // let _data=data.list
            // this.current=data.new
            let priceArr = [];
            let priceAvg = [];
            let priceRate = [];
            let suUp = [];
            let vol = [];
            // let timesetp=[];
            let times = [];
            let _self=this
            if(this.klineType==day){

            } else {
                this.klines({stock:this.stock,klineType:this.klineType}).then(data => {
                let _data=data.list
                this.current=data.new
                let baseNumber = Number(data.basic);
                let minVal = Number(data.min) ;
                let maxVal = Number(data.max) ;
                let interval = minVal > maxVal ? Math.abs((baseNumber - minVal) / 3) : Math.abs((baseNumber - maxVal) / 3);
                // console.log(interval,'echarts绘制分时折线图')
                for (let i = 0; i < data.list.length; i++) {
                    // console.log(data.list[0].price),'data0';
                    priceArr.push(data.list[i].price);
                    priceAvg.push(data.list[i].price);
                    vol.push(data.list[i].text);
                    times.push(data.list[i].time);
                    // if(i==0){
                    //     vol.push(data.list[i].volumn);
                    //     }else{
                    //         vol.push(data.list[i].volumn-data.list[i-1].volumn)
                    //     };
                    if(i<5){
                        suUp.push(data.list[0].price);
                        }else{
                            suUp.push(data.list[i-5].price);
                        };
                    // console.log(vol,'vol绘制分时折线图')
                    priceRate.push(data.list[i].rate);
                    // timesetp.push(data.list[i].rate);
                }
                // 闪烁点
                let pricesEffectScatter = [
                    {
                    value: [times[priceArr.length-1], priceArr[priceArr.length - 1]],
                    symbolSize: 5
                    }
                ];
                let pricesUp = (priceArr[priceArr.length - 1]-suUp[priceArr.length - 1])/baseNumber*10000
                // let times = timesetp
                let bgColor = "#fff";//背景
                let upColor = "#EC433D";//涨颜色
                let downColor = "#44A55B";//跌颜色
                let labelColor = "#666"; //文字颜色
                let borderColor = "#bebebe";// 图标边框色，会影响坐标轴上悬浮框的背景色
                let curColor = "#39afe6";  //分时价格线颜色
                let avgColor = "#E0AC58"; //均价线颜色
                let centerColor = "#4289c5"; //分时图中间线颜色
            
                this.chart.setOption({
                    animation: false,
                    axisPointer: {
                    show: true,
                    link: [
                        {
                        xAxisIndex: [0, 2],
                        }, {
                        yAxisIndex: [0, 2]
                        }
                    ]
                    },
                    tooltip: { //弹框指示器
                        trigger: 'axis',
                        backgroundColor: "#f1ff1",
                        borderColor: "#ccc",
                        borderWidth: 1,
                        textStyle: {
                            color: '#333'
                        },
                        axisPointer: {
                            type: 'cross',
                            label: {
                            show: true,
                            backgroundColor: '#333'
                            }
                        },
                        formatter: function (params) {
                            let i = params[0].dataIndex;
                            let color;
                            // console.log(i,'echarts绘制分时折线图')
                            if (priceRate[i] >0) {
                            color = 'style="color:' + upColor + '"';
                            } else {
                            color = 'style="color:' + downColor + '"';
                            }
                            let html = '<div class="commColor" style="width:140px;">\
                            <div>现价 <span  ' + color + ' >' + priceArr[i].toFixed(2) + '</span></div>\
                            <div>均价 <span  ' + color + ' >' + priceAvg[i].toFixed(2) + '</span></div>\
                                    <div>涨幅 <span  ' + color + ' >' + priceRate[i] + '%</span></div>\
                                    <div>成交量 <span  ' + color + ' >' +handleChartVol(Number(vol[i])) + '</span></div></div>';
                            return html;
                        }
                    },
                    color: [curColor, avgColor, centerColor],
                    grid: [{
                        show: true,
                        borderColor: borderColor,
                        id: 'gd1',
                        height: '63%', //主K线的高度,
                        
                        top: '9%'
                        },
                        {
                        show: true,
                        borderColor: borderColor,
                        id: 'gd2',
                        height: '63%', //主K线的高度,
                        top: '9%'
                        }, {
                        show: true,
                        borderColor: borderColor,
                        id: 'gd3',
                        top: '76%',
                        height: '16%' //交易量图的高度
                    }],
                    // 下方滑块
                    dataZoom: [
                        {
                            show: true,
                            realtime: true,
                        },
                        {
                            type: 'inside',
                            realtime: true,
                        },
                    ],
                    
                    xAxis: [ //==== x轴
                    { //主图
                        gridIndex: 0,
                        boundaryGap: false,
                        axisTick: {
                        show: false
                        },
                        axisLine: {
                        lineStyle: {
                            color: borderColor,
                            
                        }
                        },
                        data: times,
                        axisLabel: { //label文字设置
                        show: false
                        },
                        axisPointer: { //去掉主图x轴上的时间标签
                        show: true,
                        label: {
                            show: false
                        }
                        },
                        splitLine: { //分割线设置
                        show: true,
                        lineStyle: {
                            type: 'dashed',
                            
                            
                        },
                        interval: function (index, value) {
                            if( index <= 120){
                            if (index  % 30 === 0) {
                                return true;
                            }else{
                                return false;
                            }
                            }else if( index > 121){
                            if( index % 30 ===1 || index === 241){
                                return true;
                            }else{
                                return false;
                            }
                            }else{
                            return false;
                            }
                        }
                        },
                    },
                    {
                        show: false,
                        gridIndex: 1,
                        boundaryGap: false,
                        data: times,
                        axisLabel: { //label文字设置
                        show: false
                        },
                        axisPointer: { //去掉主图x轴上的时间标签
                        show: true,
                        label: {
                            show: false
                        }
                        },
                        axisLine: {
                        lineStyle: {
                            color: 'borderColor',

                        }
                        },
                    }, { //交易量图
                        splitNumber: 2,
                        type: 'category',
                        gridIndex: 2,
                        boundaryGap: false,
                        data: times,
                        axisLabel: { //label文字设置
                        color: labelColor,
                        fontSize: 10,
                        
                        interval: function (index, value) {
                            if( index <= 120){
                            if (index  % 30 === 0) {
                                return true;
                            }else{
                                return false;
                            }
                            }else if( index > 121){
                            if( index % 30 ===1 || index === 241){
                                return true;
                            }else{
                                return false;
                            }
                            }else{
                            return false;
                            }
                        }
                        },
                        axisTick: {
                        show: false
                        },
                        splitLine: { //分割线设置
                        show: true,
                        lineStyle: {
                            type: 'dashed',
                            // color:'red'
                        }
                        },
                        axisLine: {
                        lineStyle: {
                            color: 'borderColor',
                            

                            
                        }
                        }
                    }
                    ],
                    yAxis: [ //y轴
                    {
                        type: 'value',
                        min: minVal,
                        max: maxVal,
                        interval: interval,
                        gridIndex: 0,
                        scale: true,
                        // smooth: true,
                        axisTick: { // 分割线 短
                        show: false
                        },
                        axisLine: {
                        lineStyle: {
                            color: 'borderColor',

                        }
                        },
                        axisPointer: {
                        show: true,
                        label: {
                            formatter: function (params) {
                            return (params.value).toFixed(2);
                            }
                        }
                        },
                        axisLabel: {
                        color: '#333',
                        
                        formatter: function (val) {
                            val = val.toFixed(2);
                            if (val > baseNumber) {
                            return '{red|' + val + '}';
                            } else if (val === baseNumber) {
                            return val;
                            } else {
                            return '{green|' + val + '}';
                            }
                        },
                        rich: {
                            red: {
                            color: 'red',
                            lineHeight: 1,
                            
                            },
                            green: {
                            color: 'green',
                            lineHeight: 1
                            }
                        }
                        },
                        z: 4,
                        splitLine: { //分割线设置
                        show: true,
                        lineStyle: {
                            type: 'dashed',
                            // color:'red'
                            

                        }
                        },
                    }, {
                        scale: true,
                        gridIndex: 1,
                        min: minVal,
                        max: maxVal,
                        interval: interval,
                        position: 'right',
                        z: 4,
                        axisTick: {
                        show: false
                        },
                        axisLine: {
                        lineStyle: {
                            
                            color: 'borderColor',
                            
                        }
                        },
                        axisLabel: { //label文字设置
                        color: function (val) {
                            val = Number(val).toFixed(2)
                            if (val === baseNumber) {
                            return '#333'
                            }
                            return Number(val) > Number(baseNumber) ? upColor : downColor;
                        },
                        inside: false, //label文字朝内对齐
                        formatter: function (val) {
                            let resul = _this.ratioCalculate(val, baseNumber);
                            return Number(resul).toFixed(2) + '%'
                        }
                        },
                        // 
                        // visualMap: {
                        //         show: false,
                        //         dimension: 0,
                        //         priceArr: [{
                        //             gt: 0,
                                
                        //             color: '#096'
                        //         }, {
                                
                        //             lte:0,
                        //             color: '#ffde33'
                        //         }, {
                        //             gt: 100,
                        //             lte: 150,
                        //             color: '#ff9933'
                        //         }],
                        //         outOfRange: {
                        //             color: '#999'
                        //         }
                        //     },
                        // 
                        splitLine: { //分割线设置
                        show: false,
                        
                        lineStyle: {
                            color: '#181a23',
                            
                        }
                        },
                        axisPointer: {
                        show: true,
                        label: {
                            formatter: function (params) { //计算右边Y轴对应的当前价的涨幅比例
                            return _this.ratioCalculate(params.value, baseNumber) + '%';
                            }
                        }
                        }
                    }, { //交易图
                        // name: '万',
                        nameGap: '0',
                        nameTextStyle: {
                        color: labelColor
                        },
                        gridIndex: 2,
                        z: 4,
                        splitNumber: 3,
                        axisLine: {
                        
                        onZero: false,
                        lineStyle: {
                            color: 'borderColor',
                        }
                        },
                        axisTick: {
                        show: false
                        },
                        axisPointer: {
                        show: false,
                        label: {
                            formatter: function (params) { //计算右边Y轴对应的当前价的涨幅比例
                            let _p = ((params.value) / 10000).toFixed(1) + '万';
                            return _p
                            }
                        }
                        },
                        splitLine: { //分割线设置
                        show: false,
                        
                        },
                        axisLabel: { //label文字设置
                        color: labelColor,
                        inside: false, //label文字朝内对齐
                        fontSize: '60%',
                        
                        onZero: false,
                        formatter: function (params) { //计算右边Y轴对应的当前价的涨幅比例
                            let _p = (params / 10000).toFixed(1);
                            if (params === 0) {
                            _p = '(万)'
                            }
                            return _p
                        }
                        },
                    }
                    ],

                    backgroundColor: bgColor,
                    blendMode: 'source-over',
                    series: [
                    {
                        gridIndex: 0,
                        // 设置涟漪特效动画
                        type: 'effectScatter',
                        // 有三种: cartesian2d(二维的直角坐标系) polar(极坐标系) geo(地理坐标系) ,此需求使用cartesian2d
                        coordinateSystem: 'cartesian2d',
                        // 单个闪烁点 ↓
                        data: pricesEffectScatter, //2d坐标系--[x轴, y轴, 标记大小]
                        // 何时显示特效:'render'-绘制完成后显示特效 'emphasis'-高亮（hover）的时候显示特效
                        showEffectOn: 'render',
                        // 涟漪特效配置
                        rippleEffect: {
                            // 波纹的绘制方式,可选'stroke'和'fill'
                            brushType: 'stroke',
                            scale: pricesUp,
                        },
                        // hoverAnimation: true,
                        itemStyle: {
                            color: '#F9293E',
                            shadowBlur: 1,
                            shadowColor: 'blue'
                        },
                        zlevel: 9
                    },
                        {
                    name: '',
                    type: 'line',
                    data: pricesEffectScatter,
                    smooth: true,
                    symbol: "circle", //中时有小圆点
                                /*
                    * 将折线分3端。绿色、灰色、红色
                    */
                    
                    
                    lineStyle: {
                        
                        normal: {
                        
                        opacity: 1,
                        color: 'red',
                        width: 1
                        }
                    },
                    // data: axisData,
                    // type: 'effectScatter', //散点图 scatter,涟漪动画,effectScatter
                    // // 涟漪动画大小
                    // rippleEffect: {
                    //     // 波纹的绘制方式,可选'stroke'和'fill'
                    //     brushType: 'stroke',
                    //     scale: 15,
                    // },
                    // // hoverAnimation: true,
                    // itemStyle: {
                    //     color: '#F9293E',
                    //     shadowBlur: 5,
                    //     shadowColor: '#F9293E'
                    // },
                    // zlevel: 9,
                
                    // // 何时显示特效:'render'-绘制完成后显示特效 'emphasis'-高亮（hover）的时候显示特效
                    // showEffectOn: 'render',
                    

                    // type: 'effectScatter', //散点图 scatter,涟漪动画,effectScatter
                    // 涟漪动画大小
                    // rippleEffect: {
                    //     scale: 1,
                    // },
                    // coordinateSystem: 'cartesian2d',
                    // showEffectOn: 'emphasis', //涟漪动画出现效果,render:加载出来就有效果, emphasis:鼠标滑过才有效果
                    // data: pricesEffectScatter, //2d坐标系--[x轴, y轴, 标记大小]
                    // showEffectOn: 'render',
                    // 涟漪特效配置
                    // rippleEffect: {
                    //     // 波纹的绘制方式,可选'stroke'和'fill'
                    //     brushType: 'stroke'
                    // },

                    
                
                    
                    // areaStyle: {
                    //     origin: 'end',
                    //     color: {
                    //     type: 'linear',
                    //     x: 0,
                    //     y: 0,
                    //     x2: 0,
                    //     y2: 1,
                    //     colorStops: [
                    //         { offset: 0.8, color: 'transparent' },
                    //         { offset: 0.8, color: '#fff' },
                    //         { offset: 1, color: '#3AD235' }
                    //     ]
                    //     }
                    
                    // },
                    markLine: {
                        name: '昨日收盘价',
                        symbol: ['none', 'none'],
                        label: {
                        show: false,
                        formatter:baseNumber,
                        position: 'start',
                        },
                        lineStyle: {
                        
                        color: centerColor,
                        type: 'dashed'
                        },
                        data: [{
                        yAxis: baseNumber,
                        }]
                    }
                    },
                    {
                        name: '当前价',
                        type: 'line',
                        data: priceArr,
                        smooth: true,
                        symbol: "none",
                        gridIndex: 1,
                        xAxisIndex: 1,
                        yAxisIndex: 1,
                        lineStyle: {
                        
                        normal: {
                            
                            opacity: 1,
                            color: curColor,
                            width: 1
                        }
                        },
                    },
                    {
                        name: '均价',
                        type: 'line',
                        data: priceAvg,
                        smooth: true,
                        symbol: "none",
                        lineStyle: {
                        
                        normal: {
                            opacity: 0.8,
                            color: avgColor,
                            width: 1
                        }
                        },
                    },
                    {
                        name: '',
                        type: 'bar',
                        gridIndex: 2,
                        xAxisIndex: 2,
                        yAxisIndex: 2,
                        data: vol,
                        barWidth: '60%',
                        itemStyle: {
                        
                            color: function (params) {
                            var colorList;
                            if (priceArr[params.dataIndex] > priceArr[params.dataIndex - 1]) {
                                colorList = upColor;
                            } else {
                                colorList = downColor;
                            }
                            return colorList;
                            },
                        
                        }
                    }
                    ]
                })
                // echart全图移入鼠标事件
                
                
                // echart全图点击事件
                // this.chart.getZr().on('mousemove', function (param) {
                // // 获取 点击的 触发点像素坐标
                //     const pointInPixel = [param.offsetX, param.offsetY]
                //     // 判断给定的点是否在指定的坐标系或者系列上
                //     if (this.chart.containPixel('grid', pointInPixel)) {
                //         // 获取到点击的 x轴 下标  转换为逻辑坐标
                //         const xIndex = this.chart.convertFromPixel({ seriesIndex: 0 }, pointInPixel)[0]
                //         console.log(xIndex)
                //     }
                //     })
                // this.chart.getZr().on('mousemove', function(params) {
                //     this.newimgAnalysisList = [];
                //     let pointInPixel = [params.offsetX, params.offsetY];
                //     console.log(pointInPixel,'pointInPixel')
                //     let pointInGrid = this.chart.convertFromPixel({seriesIndex: 0}, pointInPixel);
                //     console.log(pointInPixel,'pointInPixel',pointInGrid,'pointInGrid')
                //     let xIndex = pointInGrid[0];
                //     let op = this.chart.getOption();
                //     let machineName = op.xAxis[0].data[xIndex]; //获取x轴名字
                //     for(const i in this.imgAnalysisList) { //根据x轴名字，匹配后端返回过来的数据
                //     if(!this.imgAnalysisList.hasOwnProperty(i)) continue;
                //     if(machineName === this.imgAnalysisList[i].country) {
                //         this.newimgAnalysisList.push(this.imgAnalysisList[i]);
                //     }
                //     }
                // });
            })

       
                
            }
            
            this.klines({stock:this.stock,klineType:this.klineType}).then(data => {
                let _data=data.list
                this.current=data.new
                let baseNumber = Number(data.basic);
                let minVal = Number(data.min) ;
                let maxVal = Number(data.max) ;
                let interval = minVal > maxVal ? Math.abs((baseNumber - minVal) / 3) : Math.abs((baseNumber - maxVal) / 3);
                // console.log(interval,'echarts绘制分时折线图')
                for (let i = 0; i < data.list.length; i++) {
                    // console.log(data.list[0].price),'data0';
                    priceArr.push(data.list[i].price);
                    priceAvg.push(data.list[i].price);
                    vol.push(data.list[i].text);
                    times.push(data.list[i].time);
                    // if(i==0){
                    //     vol.push(data.list[i].volumn);
                    //     }else{
                    //         vol.push(data.list[i].volumn-data.list[i-1].volumn)
                    //     };
                    if(i<5){
                        suUp.push(data.list[0].price);
                        }else{
                            suUp.push(data.list[i-5].price);
                        };
                    // console.log(vol,'vol绘制分时折线图')
                    priceRate.push(data.list[i].rate);
                    // timesetp.push(data.list[i].rate);
                }
                // 闪烁点
                let pricesEffectScatter = [
                    {
                    value: [times[priceArr.length-1], priceArr[priceArr.length - 1]],
                    symbolSize: 5
                    }
                ];
                let pricesUp = (priceArr[priceArr.length - 1]-suUp[priceArr.length - 1])/baseNumber*10000
                // let times = timesetp
                let bgColor = "#fff";//背景
                let upColor = "#EC433D";//涨颜色
                let downColor = "#44A55B";//跌颜色
                let labelColor = "#666"; //文字颜色
                let borderColor = "#bebebe";// 图标边框色，会影响坐标轴上悬浮框的背景色
                let curColor = "#39afe6";  //分时价格线颜色
                let avgColor = "#E0AC58"; //均价线颜色
                let centerColor = "#4289c5"; //分时图中间线颜色
            
                this.chart.setOption({
                    animation: false,
                    axisPointer: {
                    show: true,
                    link: [
                        {
                        xAxisIndex: [0, 2],
                        }, {
                        yAxisIndex: [0, 2]
                        }
                    ]
                    },
                    tooltip: { //弹框指示器
                        trigger: 'axis',
                        backgroundColor: "#f1ff1",
                        borderColor: "#ccc",
                        borderWidth: 1,
                        textStyle: {
                            color: '#333'
                        },
                        axisPointer: {
                            type: 'cross',
                            label: {
                            show: true,
                            backgroundColor: '#333'
                            }
                        },
                        formatter: function (params) {
                            let i = params[0].dataIndex;
                            let color;
                            // console.log(i,'echarts绘制分时折线图')
                            if (priceRate[i] >0) {
                            color = 'style="color:' + upColor + '"';
                            } else {
                            color = 'style="color:' + downColor + '"';
                            }
                            let html = '<div class="commColor" style="width:140px;">\
                            <div>现价 <span  ' + color + ' >' + priceArr[i].toFixed(2) + '</span></div>\
                            <div>均价 <span  ' + color + ' >' + priceAvg[i].toFixed(2) + '</span></div>\
                                    <div>涨幅 <span  ' + color + ' >' + priceRate[i] + '%</span></div>\
                                    <div>成交量 <span  ' + color + ' >' +handleChartVol(Number(vol[i])) + '</span></div></div>';
                            return html;
                        }
                    },
                    color: [curColor, avgColor, centerColor],
                    grid: [{
                        show: true,
                        borderColor: borderColor,
                        id: 'gd1',
                        height: '63%', //主K线的高度,
                        
                        top: '9%'
                        },
                        {
                        show: true,
                        borderColor: borderColor,
                        id: 'gd2',
                        height: '63%', //主K线的高度,
                        top: '9%'
                        }, {
                        show: true,
                        borderColor: borderColor,
                        id: 'gd3',
                        top: '76%',
                        height: '16%' //交易量图的高度
                    }],
                    // 下方滑块
                    dataZoom: [
                        {
                            show: true,
                            realtime: true,
                        },
                        {
                            type: 'inside',
                            realtime: true,
                        },
                    ],
                    
                    xAxis: [ //==== x轴
                    { //主图
                        gridIndex: 0,
                        boundaryGap: false,
                        axisTick: {
                        show: false
                        },
                        axisLine: {
                        lineStyle: {
                            color: borderColor,
                            
                        }
                        },
                        data: times,
                        axisLabel: { //label文字设置
                        show: false
                        },
                        axisPointer: { //去掉主图x轴上的时间标签
                        show: true,
                        label: {
                            show: false
                        }
                        },
                        splitLine: { //分割线设置
                        show: true,
                        lineStyle: {
                            type: 'dashed',
                            
                            
                        },
                        interval: function (index, value) {
                            if( index <= 120){
                            if (index  % 30 === 0) {
                                return true;
                            }else{
                                return false;
                            }
                            }else if( index > 121){
                            if( index % 30 ===1 || index === 241){
                                return true;
                            }else{
                                return false;
                            }
                            }else{
                            return false;
                            }
                        }
                        },
                    },
                    {
                        show: false,
                        gridIndex: 1,
                        boundaryGap: false,
                        data: times,
                        axisLabel: { //label文字设置
                        show: false
                        },
                        axisPointer: { //去掉主图x轴上的时间标签
                        show: true,
                        label: {
                            show: false
                        }
                        },
                        axisLine: {
                        lineStyle: {
                            color: 'borderColor',

                        }
                        },
                    }, { //交易量图
                        splitNumber: 2,
                        type: 'category',
                        gridIndex: 2,
                        boundaryGap: false,
                        data: times,
                        axisLabel: { //label文字设置
                        color: labelColor,
                        fontSize: 10,
                        
                        interval: function (index, value) {
                            if( index <= 120){
                            if (index  % 30 === 0) {
                                return true;
                            }else{
                                return false;
                            }
                            }else if( index > 121){
                            if( index % 30 ===1 || index === 241){
                                return true;
                            }else{
                                return false;
                            }
                            }else{
                            return false;
                            }
                        }
                        },
                        axisTick: {
                        show: false
                        },
                        splitLine: { //分割线设置
                        show: true,
                        lineStyle: {
                            type: 'dashed',
                            // color:'red'
                        }
                        },
                        axisLine: {
                        lineStyle: {
                            color: 'borderColor',
                            

                            
                        }
                        }
                    }
                    ],
                    yAxis: [ //y轴
                    {
                        type: 'value',
                        min: minVal,
                        max: maxVal,
                        interval: interval,
                        gridIndex: 0,
                        scale: true,
                        // smooth: true,
                        axisTick: { // 分割线 短
                        show: false
                        },
                        axisLine: {
                        lineStyle: {
                            color: 'borderColor',

                        }
                        },
                        axisPointer: {
                        show: true,
                        label: {
                            formatter: function (params) {
                            return (params.value).toFixed(2);
                            }
                        }
                        },
                        axisLabel: {
                        color: '#333',
                        
                        formatter: function (val) {
                            val = val.toFixed(2);
                            if (val > baseNumber) {
                            return '{red|' + val + '}';
                            } else if (val === baseNumber) {
                            return val;
                            } else {
                            return '{green|' + val + '}';
                            }
                        },
                        rich: {
                            red: {
                            color: 'red',
                            lineHeight: 1,
                            
                            },
                            green: {
                            color: 'green',
                            lineHeight: 1
                            }
                        }
                        },
                        z: 4,
                        splitLine: { //分割线设置
                        show: true,
                        lineStyle: {
                            type: 'dashed',
                            // color:'red'
                            

                        }
                        },
                    }, {
                        scale: true,
                        gridIndex: 1,
                        min: minVal,
                        max: maxVal,
                        interval: interval,
                        position: 'right',
                        z: 4,
                        axisTick: {
                        show: false
                        },
                        axisLine: {
                        lineStyle: {
                            
                            color: 'borderColor',
                            
                        }
                        },
                        axisLabel: { //label文字设置
                        color: function (val) {
                            val = Number(val).toFixed(2)
                            if (val === baseNumber) {
                            return '#333'
                            }
                            return Number(val) > Number(baseNumber) ? upColor : downColor;
                        },
                        inside: false, //label文字朝内对齐
                        formatter: function (val) {
                            let resul = _this.ratioCalculate(val, baseNumber);
                            return Number(resul).toFixed(2) + '%'
                        }
                        },
                        // 
                        // visualMap: {
                        //         show: false,
                        //         dimension: 0,
                        //         priceArr: [{
                        //             gt: 0,
                                
                        //             color: '#096'
                        //         }, {
                                
                        //             lte:0,
                        //             color: '#ffde33'
                        //         }, {
                        //             gt: 100,
                        //             lte: 150,
                        //             color: '#ff9933'
                        //         }],
                        //         outOfRange: {
                        //             color: '#999'
                        //         }
                        //     },
                        // 
                        splitLine: { //分割线设置
                        show: false,
                        
                        lineStyle: {
                            color: '#181a23',
                            
                        }
                        },
                        axisPointer: {
                        show: true,
                        label: {
                            formatter: function (params) { //计算右边Y轴对应的当前价的涨幅比例
                            return _this.ratioCalculate(params.value, baseNumber) + '%';
                            }
                        }
                        }
                    }, { //交易图
                        // name: '万',
                        nameGap: '0',
                        nameTextStyle: {
                        color: labelColor
                        },
                        gridIndex: 2,
                        z: 4,
                        splitNumber: 3,
                        axisLine: {
                        
                        onZero: false,
                        lineStyle: {
                            color: 'borderColor',
                        }
                        },
                        axisTick: {
                        show: false
                        },
                        axisPointer: {
                        show: false,
                        label: {
                            formatter: function (params) { //计算右边Y轴对应的当前价的涨幅比例
                            let _p = ((params.value) / 10000).toFixed(1) + '万';
                            return _p
                            }
                        }
                        },
                        splitLine: { //分割线设置
                        show: false,
                        
                        },
                        axisLabel: { //label文字设置
                        color: labelColor,
                        inside: false, //label文字朝内对齐
                        fontSize: '60%',
                        
                        onZero: false,
                        formatter: function (params) { //计算右边Y轴对应的当前价的涨幅比例
                            let _p = (params / 10000).toFixed(1);
                            if (params === 0) {
                            _p = '(万)'
                            }
                            return _p
                        }
                        },
                    }
                    ],

                    backgroundColor: bgColor,
                    blendMode: 'source-over',
                    series: [
                    {
                        gridIndex: 0,
                        // 设置涟漪特效动画
                        type: 'effectScatter',
                        // 有三种: cartesian2d(二维的直角坐标系) polar(极坐标系) geo(地理坐标系) ,此需求使用cartesian2d
                        coordinateSystem: 'cartesian2d',
                        // 单个闪烁点 ↓
                        data: pricesEffectScatter, //2d坐标系--[x轴, y轴, 标记大小]
                        // 何时显示特效:'render'-绘制完成后显示特效 'emphasis'-高亮（hover）的时候显示特效
                        showEffectOn: 'render',
                        // 涟漪特效配置
                        rippleEffect: {
                            // 波纹的绘制方式,可选'stroke'和'fill'
                            brushType: 'stroke',
                            scale: pricesUp,
                        },
                        // hoverAnimation: true,
                        itemStyle: {
                            color: '#F9293E',
                            shadowBlur: 1,
                            shadowColor: 'blue'
                        },
                        zlevel: 9
                    },
                        {
                    name: '',
                    type: 'line',
                    data: pricesEffectScatter,
                    smooth: true,
                    symbol: "circle", //中时有小圆点
                                /*
                    * 将折线分3端。绿色、灰色、红色
                    */
                    
                    
                    lineStyle: {
                        
                        normal: {
                        
                        opacity: 1,
                        color: 'red',
                        width: 1
                        }
                    },
                    // data: axisData,
                    // type: 'effectScatter', //散点图 scatter,涟漪动画,effectScatter
                    // // 涟漪动画大小
                    // rippleEffect: {
                    //     // 波纹的绘制方式,可选'stroke'和'fill'
                    //     brushType: 'stroke',
                    //     scale: 15,
                    // },
                    // // hoverAnimation: true,
                    // itemStyle: {
                    //     color: '#F9293E',
                    //     shadowBlur: 5,
                    //     shadowColor: '#F9293E'
                    // },
                    // zlevel: 9,
                
                    // // 何时显示特效:'render'-绘制完成后显示特效 'emphasis'-高亮（hover）的时候显示特效
                    // showEffectOn: 'render',
                    

                    // type: 'effectScatter', //散点图 scatter,涟漪动画,effectScatter
                    // 涟漪动画大小
                    // rippleEffect: {
                    //     scale: 1,
                    // },
                    // coordinateSystem: 'cartesian2d',
                    // showEffectOn: 'emphasis', //涟漪动画出现效果,render:加载出来就有效果, emphasis:鼠标滑过才有效果
                    // data: pricesEffectScatter, //2d坐标系--[x轴, y轴, 标记大小]
                    // showEffectOn: 'render',
                    // 涟漪特效配置
                    // rippleEffect: {
                    //     // 波纹的绘制方式,可选'stroke'和'fill'
                    //     brushType: 'stroke'
                    // },

                    
                
                    
                    // areaStyle: {
                    //     origin: 'end',
                    //     color: {
                    //     type: 'linear',
                    //     x: 0,
                    //     y: 0,
                    //     x2: 0,
                    //     y2: 1,
                    //     colorStops: [
                    //         { offset: 0.8, color: 'transparent' },
                    //         { offset: 0.8, color: '#fff' },
                    //         { offset: 1, color: '#3AD235' }
                    //     ]
                    //     }
                    
                    // },
                    markLine: {
                        name: '昨日收盘价',
                        symbol: ['none', 'none'],
                        label: {
                        show: false,
                        formatter:baseNumber,
                        position: 'start',
                        },
                        lineStyle: {
                        
                        color: centerColor,
                        type: 'dashed'
                        },
                        data: [{
                        yAxis: baseNumber,
                        }]
                    }
                    },
                    {
                        name: '当前价',
                        type: 'line',
                        data: priceArr,
                        smooth: true,
                        symbol: "none",
                        gridIndex: 1,
                        xAxisIndex: 1,
                        yAxisIndex: 1,
                        lineStyle: {
                        
                        normal: {
                            
                            opacity: 1,
                            color: curColor,
                            width: 1
                        }
                        },
                    },
                    {
                        name: '均价',
                        type: 'line',
                        data: priceAvg,
                        smooth: true,
                        symbol: "none",
                        lineStyle: {
                        
                        normal: {
                            opacity: 0.8,
                            color: avgColor,
                            width: 1
                        }
                        },
                    },
                    {
                        name: '',
                        type: 'bar',
                        gridIndex: 2,
                        xAxisIndex: 2,
                        yAxisIndex: 2,
                        data: vol,
                        barWidth: '60%',
                        itemStyle: {
                        
                            color: function (params) {
                            var colorList;
                            if (priceArr[params.dataIndex] > priceArr[params.dataIndex - 1]) {
                                colorList = upColor;
                            } else {
                                colorList = downColor;
                            }
                            return colorList;
                            },
                        
                        }
                    }
                    ]
                })
                // echart全图移入鼠标事件
                
                
                // echart全图点击事件
                // this.chart.getZr().on('mousemove', function (param) {
                // // 获取 点击的 触发点像素坐标
                //     const pointInPixel = [param.offsetX, param.offsetY]
                //     // 判断给定的点是否在指定的坐标系或者系列上
                //     if (this.chart.containPixel('grid', pointInPixel)) {
                //         // 获取到点击的 x轴 下标  转换为逻辑坐标
                //         const xIndex = this.chart.convertFromPixel({ seriesIndex: 0 }, pointInPixel)[0]
                //         console.log(xIndex)
                //     }
                //     })
                // this.chart.getZr().on('mousemove', function(params) {
                //     this.newimgAnalysisList = [];
                //     let pointInPixel = [params.offsetX, params.offsetY];
                //     console.log(pointInPixel,'pointInPixel')
                //     let pointInGrid = this.chart.convertFromPixel({seriesIndex: 0}, pointInPixel);
                //     console.log(pointInPixel,'pointInPixel',pointInGrid,'pointInGrid')
                //     let xIndex = pointInGrid[0];
                //     let op = this.chart.getOption();
                //     let machineName = op.xAxis[0].data[xIndex]; //获取x轴名字
                //     for(const i in this.imgAnalysisList) { //根据x轴名字，匹配后端返回过来的数据
                //     if(!this.imgAnalysisList.hasOwnProperty(i)) continue;
                //     if(machineName === this.imgAnalysisList[i].country) {
                //         this.newimgAnalysisList.push(this.imgAnalysisList[i]);
                //     }
                //     }
                // });
            })

        },
        ratioCalculate(price, yclose) {
            return ((price - yclose) / yclose * 100).toFixed(2);
        },
        addTimeStr(time, num) {
            let hour = time.split(':')[0];
            let mins = Number(time.split(':')[1]);
            let mins_un = parseInt((mins + num) / 60);
            let hour_un = parseInt((Number(hour) + mins_un) / 24);
            if (mins_un > 0) {
            if (hour_un > 0) {
                let tmpVal = ((Number(hour) + mins_un) % 24) + "";
                hour = tmpVal.length > 1 ? tmpVal : '0' + tmpVal;//判断是否是一位
            } else {
                let tmpVal = Number(hour) + mins_un + "";
                hour = tmpVal.length > 1 ? tmpVal : '0' + tmpVal;
            }
            let tmpMinsVal = ((mins + num) % 60) + "";
            mins = tmpMinsVal.length > 1 ? tmpMinsVal : 0 + tmpMinsVal;//分钟数为 取余60的数
            } else {
            let tmpMinsVal = mins + num + "";
            mins = tmpMinsVal.length > 1 ? tmpMinsVal : '0' + tmpMinsVal;//不大于整除60
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
            timeArr.push('09:30');
            timeArr.concat(this.getNextTime('09:30', '11:30', 1, timeArr));
            timeArr.push('13:00');
            timeArr.concat(this.getNextTime('13:00', '15:00', 1, timeArr));
            return timeArr;
        },
        
        draw(){
            // console.log('data.list')
            let _self=this
            // console.log(this.stock,this.klineType,'cound绘制分时折线图')
            this.klines({stock:this.stock,klineType:this.klineType}).then(data => {
                let _data=data.list
                this.current=data.new
                // console.log(data.list[0],'绘制分时折线图')
                // 绘制分时折线图
                // console.log(data.list,'22绘制分时折线图')
                let _charts=createKline(this.klineType,{
                    el:this.$refs.chart,
                    barel:this.$refs.volumn,
                    ...data,
                    klineType:this.klineType,
                    onChange:(data)=>{
                        _self.current=data
                    },
                    onHide:()=>{
                        _self.current=data.new
                    }
                })
                // console.log(_charts.line,'22绘制分时折线图')
                this.lineChart=_charts.line
                this.barChart=_charts.bar
            })
        }
    }
}
</script>
<style lang="scss" scoped>
@import '@/common/scss/variable.scss';
.chart-wrapper {
    min-height:624px;
  }
  canvas#chart {
    width:700px;
    height: 500px;
    margin-top:10px;
  }
  canvas#volumn {
    width:700px;
    height: 100px;
  }
</style>