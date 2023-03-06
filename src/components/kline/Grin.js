// Adds all necessary stuff for you.
import { Overlay } from "trading-vue-js";

export default {
  name: "Grin",
  mixins: [Overlay],
  methods: {
    meta_info() {
      return { author: "C451", version: "1.0.0" };
    },
    // Here goes your code. You are provided with:
    // { All stuff is reactive }
    // $props.layout -> positions of all chart elements +
    //  some helper functions (see layout_fn.js)
    // $props.interval -> candlestick time interval
    // $props.sub -> current subset of candlestick data
    // $props.data -> your indicator's data subset.
    //  Comes "as is", should have the following format:
    //  [[<timestamp>, ... ], ... ]
    // $props.colors -> colors (see TradingVue.vue)
    // $props.cursor -> current position of crosshair
    // $props.settings -> indicator custom settings
    //  E.g. colors, line thickness, etc. You define it.
    // ~
    // Finally, let's make the canvas dirty!
    draw(ctx) {
      const l = this.$props.layout;
      const c = { x: l.width / 2, y: l.height / 2 };
      ctx.lineWidth = 1;
      ctx.strokeStyle = "gray";
      ctx.fillStyle = "red";
    
      ctx.shadowColor = 'red';
    
    //设置模糊范围
    // ctx.shadowBlur = 2;
    // ctx.shadowOffsetX = -20; //水平偏移量
    // ctx.shadowOffsetY = 20; //垂直偏移量
    ctx.font = '80px "微软雅黑"';           //设置字体
    ctx.textAlign = "left";                 //设置字体对齐的方式
    ctx.strokeText('周易选股', c.x-70, c.y+70);       //填充文字
    
 

    
 
    },
    // 
    

    // For all data with these types overlay will be
    // added to the renderer list. And '$props.data'
    // will have the corresponding values. If you want to
    // redefine the default behviour for a prticular
    // indicator (let's say EMA),
    // just create a new overlay with the same type:
    // e.g. use_for() { return ['EMA'] }.
    use_for() {
      return ["GRIN"];
    },
    data_colors() {
      return ["red"];
    }
  },
  data() {
    // Define internal setting & constants here
    return {};
  }
};
