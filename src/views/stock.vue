<template>
  <div class="stock-container">
    <header class="stock-header" v-if="stock">
      <div class="stock-top">
        <!-- <hq-base :stock="stock"></hq-base> -->
        <h2 class="stock-name">
          <svg-icon style="font-size: 30px; color: yellowgreen; margin-right: 0px" icon-class="bagua2" />
          {{ stock.name }}
        </h2>
        <span class="stock-code">({{ this.code.toUpperCase() }}) 股价：{{ stock.current }}
          <a :class="comparePrice(stock.current, stock.yesterday)">
            涨跌幅：{{ stock.gain.percent }}%</a>
          数据更新时间：{{ transDate(stock.time) }}
          （本页仅占位，未做任何优化）</span>
        <div class="action-buttons">
          <a class="button-close" @click="setWinClose">
            X
          </a>
        </div>
      </div>
      <!-- </div> -->
    </header>
    <div class="stock-content">

      <hq-chart-min class="stock-min" :stock="stock"></hq-chart-min>
      <hq-chart-day class="stock-day" :stock="stock"></hq-chart-day>

      <!-- <li>
                <hq-chart :stock="stock"></hq-chart>
              </li> -->
    </div>
  </div>
</template>

<script>
import {

  hqChartMin,
  hqChartDay,
  $components,
} from "@/components/";
import { mapActions } from "vuex";
import { apiUrl } from "../libs/constant"; // api,请求间隔,三大指数
const ipc = window.require("electron").ipcRenderer;
import { ifCurTimeIsTradeTime } from "@/common/js/adaper";


export default {
  components: $components([

    hqChartMin,
    hqChartDay,
  ]),
  data () {
    return {
      stock: null,
      interval: null, // 轮询
    };
  },
  created () {
    // this.init();
    this.fetchData(); // 第一次进来获取数据
    this.bindIPC(); // 绑定线程事件
  },
  mounted () {
    this.fetchData(); // 第一次进来获取数据
    clearInterval(this.interval); // 先清除前面的轮询
    this.interval = setInterval(() => {
      if (ifCurTimeIsTradeTime()) {
        this.fetchData();
      }
    }, 3000);
    // this.interval = setInterval(() => {
    //   this.fetchData();

    // }, 3000);
  },
  watch: {
    $route (to, from) {
      this.fetchData();
      // this.init();
    },
  },
  computed: {
    // 获取当前页面个股代码
    code () {
      return this.$route.params["code"];
    },
  },
  methods: {
    /**
 * 获取数据
 */
    fetchData () {
      let times = 0; // 请求成功次数
      this.$http
        .get(apiUrl, {
          params: { q: this.code },
        })
        .then((res) => {
          // console.log(res.data.substring(2, 10))
          const codesh = res.data.substring(2, 10)

          const item = res.data.split('"')[1].split("~");
          const deal = item[29].split("|");
          console.log(item[0])
          this.stock = {
            codes: codesh, // 代码
            name: item[1], // 名称
            code: item[2], // 代码
            current: parseFloat(item[3]), // 当前价
            yesterday: parseFloat(item[4]), // 昨收
            today: parseFloat(item[5]), // 今开
            volume: {
              total: item[6], // 成交量
              turn: item[37], // 成交额
            },
            out: item[7], // 外盘
            in: item[8], // 内盘
            time: item[30], // 时间
            gain: {
              price: parseFloat(item[31]), // 涨跌
              percent: parseFloat(item[32]), // 涨跌%
            },
            buy: [
              {
                price: parseFloat(item[9]),
                count: item[10],
              },
              {
                price: parseFloat(item[11]),
                count: item[12],
              },
              {
                price: parseFloat(item[13]),
                count: item[14],
              },
              {
                price: parseFloat(item[15]),
                count: item[16],
              },
              {
                price: parseFloat(item[17]),
                count: item[18],
              },
            ], // 买1-5
            sell: [
              {
                price: parseFloat(item[19]),
                count: item[20],
              },
              {
                price: parseFloat(item[21]),
                count: item[22],
              },
              {
                price: parseFloat(item[23]),
                count: item[24],
              },
              {
                price: parseFloat(item[25]),
                count: item[26],
              },
              {
                price: parseFloat(item[27]),
                count: item[28],
              },
            ], // 卖1-5
            deal: deal.map((detail) => {
              let per = detail.split("/");
              return {
                time: per[0].substring(0, 5),
                price: parseFloat(per[1]),
                count: per[2],
                type: per[3],
              };
            }),
            highest: parseFloat(item[33]), // 最高
            lowest: parseFloat(item[34]), // 最低
            turnover: parseFloat(item[38]), // 换手率
            swing: parseFloat(item[43]), // 振幅
            float: item[44], // 流通市值
            cap: item[45], // 总市值
            ratio: item[46], // 市净率
            limit: {
              up: parseFloat(item[47]), // 涨停
              down: parseFloat(item[48]), // 跌停
            },
          };
          times++;
          this.checkLoadFinish(times);
        });
    },
    /**
     * 检查请求次数，关闭弹窗
     * @param times {number} - 请求完成次数
     */
    checkLoadFinish (times) {
      console.log(times, this.loading, "看一下");
      if (times === 1 && this.loading !== null) {
        this.loading.close();
      }

    },

    /**
     * 绑定当前窗口IPC事件
     */
    bindIPC () {
      ipc.on("change-code", (event, arg) => {
        // 如果重复则不执行跳转
        if (this.code !== arg) {
          this.fetchData();
          // this.$router.replace({ name: "stock", params: { code: arg } });
          // this.fetchData();
          console.log(this.code, '这里是加载数据');

          this.loading = this.$loading({
            lock: false,
            text: "加载数据：" + arg,
          });
          this.$router.replace({ name: "stock", params: { code: arg } });

        }
        // this.fetchData();
      });
    },
    /**
     * 关闭窗口
     */
    setWinClose () {
      ipc.send("sub-window-close");
    },
    // // 提取数据模板 todo
    // ...mapActions(["hq"]),
    // init () {
    //   let _code = this.$route.params["code"];
    //   this.hq(_code).then((datas) => {
    //     this.stock = datas;
    //     document.title = `${datas.name} ${datas.now} ${datas.value}(${datas.rate})`;
    //   });

    // },
  },
};
</script>

<style lang="scss" >
@import "../scss/stock";



.stock-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 2px;
  background-color: $--dark-background;
  color: $--dark-foreground;



}

.stock-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 40px;
  background-color: $--dark-background;
  z-index: 1;

  >.stock-top {
    display: flex;
    align-items: flex-start;
    padding: 0px 0px 0 10px;
    -webkit-app-region: drag; //不可拖动

    >.stock-name {
      font-size: 25px !important;
    }

    >.stock-code {
      flex: 1;
      margin-left: 15px;
      margin-top: 15px;
      font-size: 14px;
      font-weight: 500;
      color: $--dark-foreground;
      overflow: hidden;

      >a {
        &.gain-more {
          color: $--dark-more-color;
        }

        &.gain-less {
          color: $--dark-less-color;
        }

        &.gain-ping {
          color: $--dark-less-color;
        }
      }

    }

    >.action-buttons {
      position: relative;
      z-index: 9999999;
      display: flex;
      align-items: center;
      padding: 5px;
      -webkit-app-region: no-drag; // 按钮不可拖拽


      >a {
        display: block;
        height: 14px;
        line-height: 14px;
        width: 30px;
        text-align: center;
        cursor: pointer;
        color: #888;

        >i {
          font-size: 14px;
        }

        &:hover {
          color: #000;
        }

        // &.button-min {
        //   margin-left: 8px;
        //   padding-left: 8px;
        //   border-left: 1px solid #e0e0e0;
        // }

        &.button-close {
          &:hover {
            color: #F84B4B;
          }
        }
      }
    }
  }
}

.stock-content {
  position: absolute;
  top: 30px;
  left: 0;
  width: 100%;
  height: calc(100% - 30px);
  overflow-y: auto;
  overflow-x: hidden;

  stock-min {
    padding: 0;
    margin: 0;
    list-style: none;
    background-color: $--dark-background;
    // height: 100px;

  }

  stock-day {
    padding: 10px;
    // margin-top: 10px;
    list-style: none;
    background-color: #cb1414;

    // background-color: $--dark-background;
    // height: 100px;

  }

  li {
    height: 100px;
    background-color: #cb1414;
    // margin: 10px;
    // padding: 10px;
  }
}
</style>
