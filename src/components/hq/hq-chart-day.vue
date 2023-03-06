<template>
  <trading-vue :id="stock.codes" :data="dc" :width="this.width" :height="this.height" title-txt="日K" ref="tvjsday"
    :legend-buttons="['display', 'settings', 'up', 'down', 'add', 'remove']" :chart-config="{ DEFAULT_LEN: 70 }"
    :extensions="ext" :overlays="ovs" :x-settings="xsett" :timezone="8" :index-based="true" :toolbar="true" />
</template>
<script>
import { TradingVue } from "@/components/trading-vue-js/trading-vue.js"
import { DataCube } from "@/components/trading-vue-js/trading-vue.js"
import Overlays from '@/components/overlays/tvjs-overlays'
import XP from 'tvjs-xp'


// import StdInput from '../StdInput.vue'
// import Multiselect from '@/components/Multiselect.vue'
// import AppTag from '../AppTag.vue'
// import Extensions from './index_dev'
// import App1 from '@/components/kline/apps/App1.vue'
import Data from '@/components/hq/data.json'
import { appendScript } from '@/common/js/util'



// import kline from "../kline/kline-line.vue";
export default {
  name: "hq-chart-day",
  components: {
    // [tabs.name]: tabs,
    // [tabItem.name]: tabItem,
    // [kline.name]: kline,
    TradingVue,
    // StdInput,
    // Multiselect,
    // AppTag
  },
  props: {
    stock: Object,

    // stock: {
    //   type: Object,
    //   // default: "sz000006",
    // },
    // key: {
    //   type: Number,
    //   default: "000006",
    // },
    // klineType: {
    //   type: String,
    //   default: "chart",
    // }
  },
  // props: {
  //   stock: Object,
  //   key: Number,
  //   // klineType: String
  // },
  data () {
    return {
      index_based: true,
      ext: Object.values(XP),

      dc: new DataCube(Data), // Data will be here,
      width: window.innerWidth,
      height: window.innerHeight,
      // extensions: Object.values(Extensions),
      // ext_names: Object.keys(Extensions),
      night: true,
      xsett: {
        'grid-resize': { min_height: 30 }
      },
      ovs: Object.values(Overlays),
      timer: "", // 定时刷新器

      // current: 'app-1',
      // top: 50,
      // resetkey: 0,
      // apps: [
      //   { id: 'app-1', comp: App1 },
      // { id: 'app-2', comp: App2 },
      // ]

    };
  },
  watch: {
    // 监听传进来的 props 数据
    $route (to, from) {
      // console.log(this.stock,'zhegeshi');

      this.setoldCharts();
      // this.setOptions().then(() => {
      //   this.changeOptions();
      // });
    },
    stock: function (newVal, oldVal) {
      // 这里可以做一些响应式的操作，比如更新组件的状态
      // this.code = newVal;
      // this.setOptions();
      // this.changeOptions(newVal)

      if (newVal.code == oldVal.code) {
        this.stock = newVal

        this.setoldCharts();
      } else {
        this.stock = newVal
        this.setoldCharts();
      }
      // this.stock = newVal
      // this.setOptions();
      // console.log('props 数据变化了！新的值为:', newVal, '旧的值为:', oldVal);

    },


  },

  computed: {
    colors () {
      return this.$props.night ? {} : {
        colorBack: '#fff',
        colorGrid: '#eee',
        colorText: '#333'
      }
    },
  },
  mounted () {
    window.addEventListener('resize', this.onResize)
    // let q = this.win_query()
    // if (q.nm === 'false') this.night = false
    // if (q.ov) this.current = q.ov
    // if (q.header === 'false') this.top = 0
    this.onResize()
    window.dc = this.dc
    window.tv = this.$refs.tvjsday
    // this.initChart()

  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onResize)
    this.$once("hook:beforeDestroy", () => {
      clearInterval(this.timer);
    });
  },

  methods: {
    onResize () {
      this.width = window.innerWidth
      this.height = window.innerHeight - 40
    },
    // initChart () {
    //   this.setoldCharts();

    //   this.timer = setInterval(() => {
    //     // if (ifCurTimeIsTradeTime()) {
    //     //判断当前是否为交易时间
    //     this.setoldCharts();
    //     // }
    //   }, 3000);
    // },
    setoldCharts () {
      let code_can = `${this.stock.codes}`
      let _api = `http://web.ifzq.gtimg.cn/appstock/app/fqkline/get?_var=kline_dayqfq&param=${code_can},day,,,770,qfq&r=${Math.random()}`
      new Promise((resolve, reject) => {
        appendScript(_api).then(() => {
          let _datas = window[`kline_dayqfq`].data[code_can]['qfqday'] || window[`kline_dayqfq`].data[code_can]['day']
          let _klines = []
          _datas.forEach(data => {
            _klines.push([
              new Date(data[0].replace(/-/g, "/")).getTime(),

              parseFloat(data[1]),
              parseFloat(data[3]),
              parseFloat(data[4]),
              parseFloat(data[2]),
              parseInt(data[5])
            ]

            )

          })
          Data.chart.data = _klines;

        })
      })

    },

  },
};
</script>
<style></style>
