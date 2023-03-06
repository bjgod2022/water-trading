<template>
  <section>
    <!-- {{ stock }} -->
    <keep-alive>

      <trading-vue ref="tvjs" :width="width" :height="height" :data="dc" :extensions="ext" :overlays="ovs"
        :x-settings="xsett" :toolbar="true" :chart-config="{ DEFAULT_LEN: 250 }" title-txt="分时" :timezone="8"
        :index-based="true" :legend-buttons="['display', 'settings', 'up', 'down', 'add', 'remove']" />
    </keep-alive>
  </section>
</template>
<script>
// import kline from "../kline/kline-line.vue";
import TradingVue from '@/components/trading-vue-js/trading-vue'
import XP from 'tvjs-xp'
import Data from "./datamin.json";
import { DataCube } from "@/components/trading-vue-js/trading-vue";
import Overlays from "tvjs-overlays";
import { mapActions } from "vuex";




export default {
  name: "hq-chart-min",
  components: {
    // [kline.name]: kline,
    TradingVue,
  },
  props: {
    stock: Object,
  },
  data () {
    return {
      ext: Object.values(XP),
      ovs: Object.values(Overlays),
      xsett: {
        'grid-resize': { min_height: 30 }
      },

      dc: new DataCube(Data),
      width: window.innerWidth,
      height: window.innerHeight,
      // minivalues: [],


    };
  },
  mounted () {
    window.addEventListener('resize', this.onResize)
    this.onResize()
    window.dc = this.dc

    // window.dc = this.dc
    window.tv = this.$refs.tvjs
    // this.code = this.stock;
    // this.setOptions();
    // this.setOptions();

  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onResize)
  },
  watch: {
    // 监听传进来的 props 数据
    $route (to, from) {
      // console.log(this.stock,'zhegeshi');

      this.setOptions();
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

        this.setOptions();
      } else {
        this.stock = newVal
        this.setOptions();
      }
      // this.stock = newVal
      // this.setOptions();
      // console.log('props 数据变化了！新的值为:', newVal, '旧的值为:', oldVal);

    },


  },


  methods: {
    ...mapActions(["klines"]),

    onResize (event) {
      this.width = window.innerWidth
      this.height = window.innerHeight - 40
    },
    // 初始化数据
    setOptions () {
      let _this = this;
      // this.minivalues = [];
      // minivalues = []
      console.log(this.stock.name, 'this.stock')
      this.klines({ stock: _this.stock, klineType: 'five' }).then(
        (data) => {
          let _this = this;
          console.log(data, '初始化数据')
          // this.minivalues = [];
          let minivalues = [];
          for (let i = 0; i < data.list.length; i++) {
            minivalues.push([
              new Date(data.list[i].time.replace(/-/g, "/")).getTime(),
              data.list[i].price,
              data.list[i].price,
              data.list[i].price,
              data.list[i].price,
              data.list[i].text,
            ]);

          }
          Data.chart.data = minivalues;
          // this.minivalues = [];
          // this.onResize()

        }
      )
    },
    // 装载数据
    // changeOptions (val) {
    //   let _this = this;

    //   console.log(val, 'val', this.minivalues[this.minivalues.length - 1][0], 'minivalues,更新数据')
    //   this.minivalues[this.minivalues.length - 1][0]
    // this.klines({ stock: _this.stock, klineType: 'five' }).then(
    //   (data) => {
    //     // console.log(data, '装载数据')
    //     // let minivalues = [];
    //     for (let i = 0; i < data.list.length; i++) {
    //       this.minivalues.push([
    //         new Date(data.list[i].time.replace(/-/g, "/")).getTime(),
    //         data.list[i].price,
    //         data.list[i].price,
    //         data.list[i].price,
    //         data.list[i].price,
    //         data.list[i].text,
    //       ]);

    //     }
    // Data.chart.data = this.minivalues;
    //     // this.onResize()

    //   }
    // )
    // }
  },
};
</script>
<!-- data: {
  someParameter: null,
},
watch: {
  someParameter: function(newValue) {
    if (newValue === null || newValue === undefined) {
      setTimeout(() => {
        this.handleParameter();
      }, 1000); // 等待一秒后执行处理函数
    } else {
      this.handleParameter();
    }
  },
},
methods: {
  handleParameter() {
    // 在这里处理 someParameter 参数
    console.log('handleParameter called');
  },
}, -->
