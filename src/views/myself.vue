<template>
  <div id="box">
    <!--顶栏部分-->

    <div class="header">
      <h1>
        <!-- <svg-icon icon-class="hot" /> -->
        <svg-icon
          style="font-size: 24px; color: yellowgreen; margin-right: 5px"
          icon-class="bagua2"
        />
        <router-link style="color: black; margin: 0 5px" to="/"
          >市场</router-link
        >
        |
        <!-- <svg-icon
          style="font-size: 24px; color: yellowgreen; margin-right: 5px"
          icon-class="my"
        /> -->
        <router-link
          style="font-size: 26px; color: yellowgreen; margin: 0 5px"
          to="/myself"
          >自选</router-link
        >|
        <!-- <svg-icon style="color: cadetblue" icon-class="taiji" /> -->
        <router-link style="color: black; margin: 0 5px" to="/zhouyi"
          >周易</router-link
        >
        <button @click="fetchData" v-show="notime">
          <svg-icon icon-class="fet" />刷新数据
        </button>
        <!-- <svg-icon style="color: yellowgreen" icon-class="set" /> -->
      </h1>

      <div class="action-buttons">
        <a class="button-pin" @click="addOptional">
          <svg-icon icon-class="search" class="icon-add" />
        </a>
        <a class="button-min" @click="setWinMin">
          <svg-icon icon-class="minus" class="icon-min" />
        </a>
        <a class="button-close" @click="setWinClose">
          <svg-icon icon-class="close" class="icon-close" />
        </a>
      </div>
    </div>
    <!-- <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> -->
    <!-- 头部走马灯 -->
    <template class="stock-index">
      <el-carousel :interval="4000" type="card" height="120px">
        <el-carousel-item
          v-for="(item, index) in indexs"
          :key="index"
          @contextmenu.native="showContext(item)"
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
          <about-view />
        </el-carousel-item>
      </el-carousel>
    </template>
    <!-- 涨，跌，平，条 todo数据-->

    <about-view />

    <!-- 自选票 -->

    <div class="table-container">
      <el-table
        class="optional-stock-table"
        height="1000"
        size="mini"
        row-key="code"
        :data="mystocks"
        :header-cell-style="{ padding: 0 }"
        @row-contextmenu="showContext"
        @row-dblclick="showDetail"
      >
        <el-table-column type="index" :index="indexMethod" width="35">
          <!-- {{ index }} -->
        </el-table-column>
        <el-table-column label="股票" width="110" prop="price" sortable>
          <template slot-scope="props">
            <div class="stock-info">
              <div
                :title="props.row.name"
                :class="comparePrice(props.row.gain.percent, 0)"
              >
                <!-- {{ props.row }} -->
                <h3>{{ props.row.name }}</h3>
                <!-- <h3>{{props.row.buy}}</h3> -->

                <span v-if="props.row.status">
                  {{ props.row.status === "S" ? "停" : "退" }}
                </span>
              </div>
              <div class="stock-info-name">
                <span>
                  {{ props.row.code.toUpperCase() }}
                </span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="价格" width="100" prop="price" sortable>
          <template slot-scope="props">
            <p
              class="gain-price"
              :class="comparePrice(props.row.gain.percent, 0)"
            >
              {{ props.row.price.toFixed(2) }}
            </p>
          </template>
        </el-table-column>

        <el-table-column label="略图" align="right" width="130">
          <template slot-scope="props">
            <p class="stock-slt">
              <!-- {{
                props.row.code.substring(0, 2) == "sz"
                  ? 0 + props.row.code.substring(2, 8)
                  : 1 + props.row.code.substring(2, 8)
              }} -->

              <MinMarketChart
                :id="'Min' + props.$index + 3 + 'Chart'"
                class="stock-slt"
                :stockCode1="props.row.code"
                :stockCode2="
                  props.row.code.substring(0, 2) === 'sh' ? '0' : '1'
                "
                v-bind="$attrs"
                v-on="$listeners"
              />
            </p>
          </template>
        </el-table-column>

        <el-table-column label="B/S-I/O" align="right">
          <template slot-scope="props">
            <Bar
              :bout="props.row.out"
              :bin="props.row.in"
              :bs="props.row.bs"
              :bsmax="props.row.bsmax"
            />
          </template>
        </el-table-column>

        <el-table-column label="成交量" align="right" width="90">
          <template slot-scope="props">
            <p class="stock-volume">
              {{ transVolume(props.row.volume)
              }}{{ props.row.code.indexOf("hk") > -1 ? "股" : "手" }}
            </p>
          </template>
        </el-table-column>

        <el-table-column
          prop="gain.percent"
          label="涨跌幅"
          align="right"
          sortable
        >
          <template slot-scope="props">
            <template v-if="!props.row.status">
              <span
                class="gain-price"
                :class="comparePrice(props.row.gain.percent, 0)"
              >
                {{ props.row.gain.price > 0 ? "+" : ""
                }}{{ props.row.gain.price.toFixed(2) }}
              </span>
              <span
                class="gain-percent"
                :class="comparePrice(props.row.gain.percent, 0)"
              >
                {{ props.row.gain.percent > 0 ? "+" : ""
                }}{{ props.row.gain.percent.toFixed(2) }}%
              </span>
            </template>
            <template v-else>
              <span class="gain-price">-</span>
              <span class="gain-percent">0.00%</span>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!--加自选弹窗-->
    <optional-dialog
      ref="optionalDialog"
      dataset="mystocks"
      @finish="fetchData"
    />
  </div>
</template>

<script>
import MinMarketChart from "@/components/Charts/MinMarketChart";
import { mapActions } from "vuex";
import { ifCurTimeIsTradeTime } from "@/common/js/adaper";

import { apiUrl, timeSpan, stockIndex } from "../libs/constant"; // api,请求间隔,三大指数
import Sortable from "sortablejs"; // 表格拖拽库
import OptionalDialog from "../components/optional"; // 添加功能组件
import AboutView from "./AboutView.vue";
import Bar from "./bar.vue";
import Zs from "./zs.vue";
import Bg from "./Bg.vue";
import Lx from "./Lx.vue";
import storage from "good-storage";

const shell = require("electron").shell;
const ipc = window.require("electron").ipcRenderer;
const Mousetrap = require("mousetrap"); // 键位映射库
const drag = require("electron-drag"); // 窗体移动库

export default {
  components: {
    OptionalDialog,
    AboutView,
    MinMarketChart,
    Bar,
    Zs,
    Bg,
    Lx,
  },
  data() {
    return {
      indexs: [], // 指数部分
      mystocks: [], // 自选部分
      jdk: [], // 自选部分
      fortime: 0, //计数
      times: 0,
      stockserver: [],
      // jdk:[],
      stock: null,
      sudown: "",
      kline: null, // k线图
      weizhi: "my",
      notime: true,
      interval: null, // 轮询
    };
  },
  created() {
    // this.goMain();
    this.fetchData();
  },
  mounted() {
    this.fetchData();
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      if (ifCurTimeIsTradeTime()) {
        this.fetchData();
      }
      // else {
      //   console.log("非交易时间");
      // }
    }, 3000);
    // setInterval(this.fetchData, 300000000); // 轮训获取数据
    this.rowDrop(); // 拖拽功能
    this.bindKey(); // 键盘映射
    this.bindMouse(); // 鼠标移动
    this.bindDrag(); // 绑定顶栏拖拽
    this.initIpcListener(); // 初始化主窗口监听事件
    // this.eventMarket();
  },
  methods: {
    // ...mapActions(["hq", "detil"]),
    // init() {
    //   this.hq("sz000001").then((datas) => {
    //     this.stock = datas;
    //     document.title = `${datas.name} ${datas.now} ${datas.value}(${datas.rate})`;
    //   });
    // },
    indexMethod(index) {
      return index + 1;
    },
    // 每行交错变色
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 === 1) {
        return "warning-row";
      } else if (rowIndex % 2 === 0) {
        return "success-row";
      }
      return "";
    },
    /**
     * 通过腾讯接口获取指数&自选股的数据
     */
    fetchData() {
      this.times += 1; // 请求成功次数
      // if(this.times%10==1){
      //     this.jdk=[]

      //   }
      let index = stockIndex.map((item) => item); // 接口需要加前缀
      console.log(index, "index");
      // let index = stockIndex.map(item =>'s_' + item) // 接口需要加前缀
      // let avOptional = [];
      // avOptional = this.stockserver.map((item) => item);
      // for (i in this.server) {
      //   avOptional.push(i);
      // }
      // console.log(avOptional, "avOptional");

      let selfstorage = storage.get("mystocks", "");
      console.log(selfstorage, "storage");
      let storageOptional = [];
      if (selfstorage !== "" && selfstorage !== null) {
        storageOptional = selfstorage.split(",");
      }
      let mystocks = storageOptional.map((item) => item.toLowerCase());
      let all = index.concat(mystocks);
      // let all = index.concat(avOptional);
      let query = all.join(",");
      // console.log(query, "query");
      // this.detil(query).then((datas) => {
      //   this.stock = datas;
      //   console.log(this.stock, "this.stock");
      //   // document.title = `${datas.name} ${datas.now} ${datas.value}(${datas.rate})`;
      // });

      this.$http.get(apiUrl, { params: { q: query } }).then((res) => {
        this.resolveData(res.data);
        // console.log(res, "index");
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
      this.mystocks = [];
      // console.log(this.mystocks,'mystocks人')
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
        // console.log(this.mystocks,'this.mystocks')
        if (index < stockIndex.length) {
          // this.fortime+=1
          this.indexs.push(stock);
        } else {
          // this.fortime+=1
          // console.log(this.times%10,stock.jsd=stock.price,'this.times')
          // console.log(stock.bs,'this.jdk')
          this.mystocks.push(stock);
        }
      });
      // console.log(this.jdk,'this.jdk')
      this.updateToolTips(this.mystocks);
    },

    /**
     * 弹窗添加自选股
     */
    addOptional() {
      this.$refs["optionalDialog"].show();
    },
    /**
     * 删除自选
     * @param code {string} - 个股代码
     */
    deleteStock(code) {
      let delstorage = storage.get("mystocks");
      let storageOptional = delstorage.split(",");
      let final = [];
      storageOptional.forEach((item) => {
        if (item.toLowerCase() !== code.toLowerCase()) {
          final.push(item);
        }
      });
      storage.set("mystocks", final.join(","));
      this.fetchData();
      this.$toasted.show("已删除", {
        theme: "toasted-primary",
        position: "bottom-center",
        duration: 1000,
      });
    },
    deleteAll() {
      storage.remove("mystocks");

      this.fetchData();
      this.$toasted.show("已清空", {
        theme: "toasted-primary",
        position: "bottom-center",
        duration: 3000,
      });
    },
    /**
     * 执行修改数据
     */
    modifyData() {
      const modified = this.mystocks.map((item) => item.code);
      localStorage.setItem("mystocks", modified.join(","));
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
     * 自选股的行拖拽排序功能
     */
    rowDrop() {
      const tbody = document.querySelector(".el-table__body-wrapper tbody");
      const _this = this;
      Sortable.create(tbody, {
        animation: 120,
        onEnd({ newIndex, oldIndex }) {
          const currRow = _this.mystocks.splice(oldIndex, 1)[0];
          _this.mystocks.splice(newIndex, 0, currRow);
          _this.modifyData();
        },
      });
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
      ipc.on("show-xueqiu-my", (event, code) => {
        this.openInXueQiu(code);
      });
      ipc.on("show-guba-my", (event, code) => {
        this.openInGuBa(code);
      });
      ipc.on("place-top-my", (event, code) => {
        let storage = localStorage.getItem("mystocks");
        let storageOptional = storage.split(",");
        if (storageOptional.indexOf(code) > -1) {
          storageOptional.splice(storageOptional.indexOf(code), 1);
        }
        localStorage.setItem(
          "mystocks",
          code + "," + storageOptional.join(",")
        );
        this.$router.go(0);
      });
      ipc.on("delete-stock-my", (event, code) => {
        this.deleteStock(code);
      });
      ipc.on("delete-all-my", (event, code) => {
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
     * 更新系统托盘的提示文字，显示当前前几条个股的信息
     * @param data {array} - 所有自选股的数据
     * @description windows下只能显示部分文字，会溢出，待解决
     */
    updateToolTips(data) {
      let content = data.map((item) => {
        return `${item.name}：当前价 ¥${item.price},涨跌 ¥${item.gain.price}（${item.gain.percent}%）`;
      });
      ipc.send("main-tray-update", content.join("\n"));
    },
    /**
     * 右键指数&个股显示上下文菜单
     * @param row {object} - 个股数据
     */
    showContext(row) {
      console.log(row);
      ipc.send("main-right-click", row.code, this.weizhi);
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
