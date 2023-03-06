<template>
  <div id="box">
    <!-- 头部走马灯 -->
    <template class="stock-index">
      <el-carousel :interval="4000" type="card" height="120px">
        <el-carousel-item
          v-for="(item, index) in indexs"
          :key="index"
          @dblclick.native="showDetail(item)"
          :class="comparePrice(item.gain.percent, 0)"
        >
          <div class="upper-info">
            <h3>{{ item.name }}</h3>
            <p>{{ item.price.toFixed(2) }}</p>
          </div>
          <p class="index-gain">
            <span
              >{{ item.gain.price > 0 ? "+" : ""
              }}{{ item.gain.price.toFixed(2) }}</span
            >
            <span class="index-gain2">
              {{ item.gain.percent > 0 ? "+" : ""
              }}{{ item.gain.percent.toFixed(2) }}%</span
            >
          </p>
          <MinMarketChart
            :id="'Min' + index + 'Chart'"
            :stockCode1="item.code"
            :stockCode2="item.code.substring(0, 2) === 'sh' ? '0' : '1'"
            v-bind="$attrs"
            v-on="$listeners"
          />
          <!-- <about-view /> -->
        </el-carousel-item>
      </el-carousel>
    </template>
    <!-- 涨，跌，平，条 todo数据-->

    <!-- <about-view /> -->
    <!-- <hot-stock /> -->

    <!--加自选弹窗-->
    <optional-dialog ref="optionalDialog" @finish="fetchData" />
  </div>
</template>
  
  <script>
import { ifCurTimeIsTradeTime } from "@/common/js/adaper";

import MinMarketChart from "@/components/Charts/MinMarketChart";
import { mapActions } from "vuex";
import { apiUrl, timeSpan, stockIndex } from "../libs/constant"; // api,请求间隔,三大指数
import OptionalDialog from "../components/optional"; // 添加功能组件
import AboutView from "./AboutView.vue";
// import HotStock from "./hotstock.vue";

const shell = require("electron").shell;
const ipc = window.require("electron").ipcRenderer;
const Mousetrap = require("mousetrap"); // 键位映射库
const drag = require("electron-drag"); // 窗体移动库

export default {
  components: {
    OptionalDialog,
    AboutView,
    // HotStock,
    MinMarketChart,
  },
  data() {
    return {
      indexs: [], // 指数部分
      bodyTimer: "", // 定时刷新器

      // fortime: 0, //计数
      // times: 0,
      // // jdk:[],
      // stock: null,
      // sudown: "",
      // kline: null, // k线图
    };
  },
  created() {
    this.fetchData();
  },
  mounted() {
    this.initData();
    this.bindKey(); // 键盘映射
    this.bindMouse(); // 鼠标移动
    this.bindDrag(); // 绑定顶栏拖拽
    this.initIpcListener(); // 初始化主窗口监听事件
  },
  methods: {
    //
    initData() {
      this.bodyTimer = setInterval(() => {
        if (ifCurTimeIsTradeTime()) {
          this.fetchkline();
        }
      }, 3000);
    },
    /**
     * 通过腾讯接口获取指数&自选股的数据
     */
    fetchData() {
      let index = stockIndex.map((item) => item); // 接口需要加前缀

      let query = index.join(",");

      this.$http.get(apiUrl, { params: { q: query } }).then((res) => {
        this.resolveData(res.data);
      });
    },
    /**
     * 解析所有获取的股票数据
     * @param data {string} - 股票数据字符串
     */
    resolveData(data) {
      // const item = data.split('"')[1].split('~')
      // const deal = item[29].split('|')
      // console.log(item,'item')

      this.indexs = [];
      // console.log(this.optionals,'optionals人')
      data = data.replace(/[\r\n]/g, ""); // 去掉回车换行
      data = data.substring(0, data.length - 1); // 删除最后一位字符
      let splitData = data.split(";");
      // console.log(splitData,'item')
      splitData.forEach((item, index) => {
        let splitItem = item.split("="); // 按照等于号截取前后部分
        let prefix = splitItem[0]; // 前缀部分 // 等号前
        let suffix = splitItem[1].match(/"(.*?)"/)[1]; // 后缀内容，只取双引号内容
        let content = suffix.substring(0, suffix.length - 1).split("~");
        // console.log(content)
        let stock = {
          code: prefix.substring(2, 10),
          name: content[1],
          price: parseFloat(content[3]),
          gain: {
            price: parseFloat(content[31]),
            percent: parseFloat(content[32]),
          },
          yes: content[4],
          out: content[7], // 外盘
          in: content[8], // 内盘
          volume: content[6],
          status: content[40] === "" ? null : content[40],
          // volume: content[40],
          buy: [
            {
              price: parseFloat(content[9]),
              count: content[10],
            },
            {
              price: parseFloat(content[11]),
              count: content[12],
            },
            {
              price: parseFloat(content[13]),
              count: content[14],
            },
            {
              price: parseFloat(content[15]),
              count: content[16],
            },
            {
              price: parseFloat(content[17]),
              count: content[18],
            },
          ],
          // 买1-5
          sell: [
            {
              price: parseFloat(content[19]),
              count: content[20],
            },
            {
              price: parseFloat(content[21]),
              count: content[22],
            },
            {
              price: parseFloat(content[23]),
              count: content[24],
            },
            {
              price: parseFloat(content[25]),
              count: content[26],
            },
            {
              price: parseFloat(content[27]),
              count: content[28],
            },
          ],
          bs: [
            parseFloat(content[28]),
            parseFloat(content[26]),
            parseFloat(content[24]),
            parseFloat(content[22]),
            parseFloat(content[20]),
            parseFloat(content[10]),
            parseFloat(content[12]),
            parseFloat(content[14]),
            parseFloat(content[16]),
            parseFloat(content[18]),
          ],
        };
        stock.bsmax = Math.max.apply(null, stock.bs);
        // console(stock.bs,'shenme')
        if (this.times % 31 == 1) {
          // this.jdk=[]
          stock.jdk = stock.price;
          // this.jdk.push(stock.price)
        }
        // fortime+=1
        // console.log(this.optionals,'this.optionals')
        if (index < stockIndex.length) {
          // this.fortime+=1
          this.indexs.push(stock);
        } else {
          // this.fortime+=1
          // console.log(this.times%10,stock.jsd=stock.price,'this.times')
          // console.log(stock.bs,'this.jdk')
          this.optionals.push(stock);
        }
      });
      // console.log(this.jdk,'this.jdk')
    },

    /**
     * 弹窗添加自选股
     */
    addOptional() {
      this.$refs["optionalDialog"].show();
    },
    /**
     
      /**
       * 执行修改数据
       */
    modifyData() {
      const modified = this.optionals.map((item) => item.code);
      localStorage.setItem("optionals", modified.join(","));
    },
    /**
     * 显示单支股票的详情，通过新窗口显示
     * @param row {object} - 个股数据
     */
    showDetail(row) {
      // console.log( row.code)
      ipc.send("create", row.code);
    },

    /**
     * 点击跳转雪球网站
     * @param code {string} - 个股代码
     */
    openInXueQiu(code) {
      let marketPrefix = code.substring(0, 2).toLowerCase();
      shell.openExternal(
        "https://xueqiu.com/S/" +
          (marketPrefix === "hk" ? code.substring(2) : code)
      );
    },
    /**
     * 点击跳转东方财富网站
     * * @param code {string} - 个股代码
     */
    openInGuBa(code) {
      let marketPrefix = code.substring(0, 2).toLowerCase();
      shell.openExternal(
        "http://guba.eastmoney.com/list," +
          (marketPrefix === "hk"
            ? code
            : code === "sh000001"
            ? "szzs"
            : code.substring(2)) +
          ".html"
      );
    },

    /**
     * 主窗口线程事件监听
     */
    initIpcListener() {
      ipc.on("show-xueqiu", (event, code) => {
        this.openInXueQiu(code);
      });
      ipc.on("show-guba", (event, code) => {
        this.openInGuBa(code);
      });
      ipc.on("place-top", (event, code) => {
        let storage = localStorage.getItem("optionals");
        let storageOptional = storage.split(",");
        if (storageOptional.indexOf(code) > -1) {
          storageOptional.splice(storageOptional.indexOf(code), 1);
        }
        localStorage.setItem(
          "optionals",
          code + "," + storageOptional.join(",")
        );
        this.fetchData();
      });
      ipc.on("delete-stock", (event, code) => {
        // console.log(code, "要被删除的code");
        this.deleteStock(code);
      });
      ipc.on("delete-all", (event, code) => {
        // console.log(code, "要被删除的code");
        this.deleteAll();
      });
    },
    /**
     * 关闭主窗口
     */
    setWinClose() {
      ipc.send("main-window-close");
    },
    /**
     * 最小化主窗口
     */
    setWinMin() {
      ipc.send("main-window-min");
    },

    /**
     * 右键指数&个股显示上下文菜单
     * @param row {object} - 个股数据
     */
    showContext(row) {
      console.log(row);
      ipc.send("main-right-click", row.code);
    },

    /**
     * 绑定键盘映射
     */
    bindKey() {
      Mousetrap.bind(
        [
          "0",
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "a",
          "b",
          "c",
          "d",
          "e",
          "f",
          "g",
          "h",
          "i",
          "j",
          "k",
          "l",
          "m",
          "n",
          "o",
          "p",
          "q",
          "r",
          "s",
          "t",
          "u",
          "v",
          "w",
          "x",
          "y",
          "z",
        ],
        (e) => {
          this.$refs["optionalDialog"].show(e.key);
        }
      );
      Mousetrap.bind(["command+k", "ctrl+k"], function () {
        ipc.send("open-devtools");
      });
    },
    /**
     * 使用 electron-drag 解决顶栏无法捕获鼠标事件的问题（暂不支持linux）
     */
    bindDrag() {
      drag(".header");
      // 如果不支持则使用样式的方式
      if (!drag.supported) {
        document.querySelector(".header").style["-webkit-app-region"] = "drag";
      }
    },
    /**
     * 单独为页面做事件监听可以防止出现部分处于 body 中的 element ui 元素监听不到的问题
     */
    bindMouse() {
      document.addEventListener("mouseenter", this.mouseEnter);
      document.addEventListener("mouseleave", this.mouseLeave);
    },
    /**
     * 鼠标进入主窗口的情况
     */
    mouseEnter() {
      ipc.send("main-mouse-enter");
    },
    /**
     * 鼠标移出主窗口的情况
     */
    mouseLeave() {
      ipc.send("main-mouse-leave");
    },
  },
};
</script>
  
  <style lang="scss">
@import "../scss/index";
</style>
  