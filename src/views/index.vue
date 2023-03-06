<template>
  <div id="box">
    <!--顶栏部分-->

    <div class="header">
      <h1>
        <!-- <svg-icon
          class="head-cho"
          style="font-size: 24px; color: yellowgreen; margin-right: 5px"
          icon-class="bagua2"
        /> -->
        <img src="../assets/logo.png" style="height: 24px; margin-right: 5px" />
        <router-link class="head-cho" to="/">市场</router-link>
        |
        <router-link class="head-nocho" to="/myself">自选</router-link>|
        <router-link class="head-nocho" to="/zhouyi">周易</router-link>
        <router-link class="head-nocho" to="/text">测试页面</router-link>|
        <!-- <svg-icon
          style="font-size: 22px; color: yellowgreen; margin: 0 5px"
          icon-class="set"
        /> -->
        <!-- <button @click="changeTheme">Change Theme</button> -->
        <el-switch v-model="switchStatus"></el-switch>
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
    <header-index />
    <about-view />

    <!-- 自选票 -->

    <div class="table-container">
      <el-table
        lazy
        :height="tableHeight"
        class="optional-stock-table"
        size="mini"
        tooltip-effect="dark"
        row-key="f12"
        :data="myop"
        :header-cell-style="{ padding: 0 }"
        :row-class-name="tableRowClassName"
        @row-contextmenu="showContext"
        @row-dblclick="showDetail"
        :empty-text="emptytext"
      >
        <el-table-column type="index" :index="indexMethod" width="35">
        </el-table-column>

        <el-table-column label="股票" width="170" prop="f14" sortable>
          <template slot-scope="props">
            <div class="stock-info">
              <div :title="props.row.f14">
                <h3>{{ props.row.f14 }}</h3>
                <a v-html="$options.filters.font_color(props.row.f100)"> </a>
              </div>

              <div class="stock-info-name">
                <span class="hint-market">
                  {{ props.row.f13 > 0 ? "上证" : "深证" }}
                </span>
                <!-- <el-popover
                  placement="bottom"
                  title="标题"
                  width="200"
                  trigger="click"
                >
                  <div v-for="i in props.row.f103.split(',')">
                    <span>{{ i }}</span>
                  </div>
                  <el-button slot="reference">click 激活</el-button>
                </el-popover> -->
                <span>
                  {{ props.row.f12 }}
                  <a style="font-size: 12px">
                    <svg-icon icon-class="map"></svg-icon>

                    {{ props.row.f102.substring(0, 2) }}
                  </a>
                </span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="f2"
          width="110"
          label="价格"
          align="left"
          sortable
        >
          <template slot-scope="props">
            <template>
              <span class="mar-price">
                {{ props.row.f2 }}
              </span>
              <!-- <span class="mar-price" :class="comparePrice(props.row.f3, 0)">
                {{ props.row.f2 }}
              </span> -->
            </template>
          </template>
        </el-table-column>
        <el-table-column
          prop="f22"
          label="涨速"
          min-width="120"
          align="center"
          sortable
        >
          <template slot-scope="props">
            <p class="stock-speed" :class="comparePrice(props.row.f22, 0)">
              <zhangsu :fudu="props.row.f22"></zhangsu>
            </p>
          </template>
        </el-table-column>
        <el-table-column prop="f3" label="涨跌幅" align="center" sortable>
          <template slot-scope="props">
            <template>
              <span class="stock-price">
                {{ props.row.f4 > 0 ? "+" : "" }}{{ props.row.f4 }}
              </span>
              <span class="gain-percent" :class="comparePrice(props.row.f3, 0)">
                {{ props.row.f3 > 0 ? "+" : "" }}{{ props.row.f3 }}%
              </span>
            </template>
          </template>
        </el-table-column>
        <el-table-column
          prop="f62"
          width="100"
          label="流入"
          align="center"
          sortable
        >
          <template slot-scope="props">
            <liuru
              :zljlr="props.row.f62"
              :cdd="props.row.f64"
              :cddlc="props.row.f65"
              :dd="props.row.f70"
              :ddlc="props.row.f71"
              :zd="props.row.f76"
              :zdlc="props.row.f77"
              :xd="props.row.f82"
              :xdlc="props.row.f73"
            ></liuru>
          </template>
        </el-table-column>
        <el-table-column label="煞/发" align="center">
          <template slot-scope="props">
            <Lx
              :bgcode="
                props.row.f12.substring(0, 1) == 0
                  ? 'sz' + props.row.f12
                  : 'sh' + props.row.f12
              "
              :id="'lx' + props.$index + 'sha'"
            ></Lx>
          </template>
        </el-table-column>
        <el-table-column label="略图" align="center">
          <template slot-scope="props">
            <zt-message
              :bgcode="
                props.row.f13 > 0 ? 'sh' + props.row.f12 : 'sz' + props.row.f12
              "
            />
          </template>
        </el-table-column>
        <el-table-column label="本/变卦" align="center">
          <template slot-scope="props">
            <Bg
              :bgcode="
                props.row.f12.substring(0, 1) == 0
                  ? 'sz' + props.row.f12
                  : 'sh' + props.row.f12
              "
            />
          </template>
        </el-table-column>
        <el-table-column prop="f33" label="委比" align="center" sortable>
          <template slot-scope="props">
            <p class="stock-price">{{ props.row.f33 }}%</p>
          </template>
        </el-table-column>
        <el-table-column label="成交量" align="center" width="90">
          <template slot-scope="props">
            <p class="f5">
              {{ transVolume(props.row.f5) }}
            </p>
          </template>
        </el-table-column>

        <el-table-column label="成交额" align="center" width="90">
          <template slot-scope="props">
            <p class="f5">
              {{ transVolume(props.row.f6) }}
            </p>
          </template>
        </el-table-column>

        <el-table-column prop="f7" label="振幅" align="center" sortable>
          <template slot-scope="props">
            <p class="stock-price">{{ props.row.f7 }}%</p>
          </template>
        </el-table-column>
        <el-table-column prop="f8" label="换手率" align="center" sortable>
          <template slot-scope="props">
            <p class="stock-price">{{ props.row.f8 }}%</p>
          </template>
        </el-table-column>
        <el-table-column prop="f100" label="行业" align="center" sortable>
          <template slot-scope="props">
            <p class="stock-price">{{ props.row.f100 }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="f10" label="量比" align="center" sortable>
          <template slot-scope="props">
            <p class="stock-price">{{ props.row.f10 }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="f24" label="60日" align="center" sortable>
          <template slot-scope="props">
            <p class="stock-price">{{ props.row.f24 }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="f114" label="市盈率" align="center" sortable>
          <template slot-scope="props">
            <p class="stock-price">{{ props.row.f114 }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="f115" label="TTM" align="center" sortable>
          <template slot-scope="props">
            <p class="stock-price">{{ props.row.f115 }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="f124" label="时间" align="center" sortable>
          <template slot-scope="props">
            <p class="stock-price">{{ props.row.f124 }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="f21" label="流通" align="center" sortable>
          <template slot-scope="props">
            <p class="stock-price">{{ props.row.f21 }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="f33" label="委比" align="center" sortable>
          <template slot-scope="props">
            <p class="stock-price">{{ props.row.f33 }}</p>
          </template>
        </el-table-column>

        <el-table-column prop="f15" label="高/低" align="center" sortable>
          <template slot-scope="props">
            <p class="stock-price">{{ props.row.f15 }}</p>
            <p class="stock-price">{{ props.row.f16 }}</p>
          </template>
        </el-table-column>
        <div slot="empty" class="emptyBg" style="margin-left: -800px">
          <!-- <svg-icon
            style="font-size: 120px; margin-left: -500px"
            icon-class="bagua2"
          /> -->
          <!-- {{ logowidth }} -->
          <img
            src="../assets/logo.png"
            style="height: 180px; margin-left: -500px"
          />

          <p style="font-size: 20px; margin-left: -500px">没有记录哦~</p>
          <p style="font-size: 20px; margin-left: -500px; color: royalblue">
            待详情页完善后可支持股指，行业模块
          </p>
        </div>
      </el-table>
    </div>

    <!--加自选弹窗-->
    <optional-dialog
      ref="optionalDialog"
      :dataset="dataset"
      @finish="getcashData"
    />
  </div>
</template>

<script>
import zhangsu from "../components/bar/zhangsu.vue";
import liuru from "../components/bar/liuru.vue";

import Sortable from "sortablejs"; // 表格拖拽库
import MinMarketChart from "@/components/Charts/MinMarketChart";
import { mapActions } from "vuex";
import HeaderIndex from "./headerIndex.vue";
import storage from "good-storage";

// import { apiUrl, timeSpan, stockIndex } from "../libs/constant"; // api,请求间隔,三大指数
import OptionalDialog from "../components/optional"; // 添加功能组件
import AboutView from "./AboutView.vue";
import ZtMessage from "./ztMessage.vue";
import Bar from "./bar.vue";
import Zs from "./zs.vue";
import Bg from "./Bg.vue";
import Lx from "./Lx.vue";
const shell = require("electron").shell;
const ipc = window.require("electron").ipcRenderer;
const Mousetrap = require("mousetrap"); // 键位映射库
const drag = require("electron-drag"); // 窗体移动库

export default {
  name: "Home",

  components: {
    OptionalDialog,
    AboutView,
    MinMarketChart,
    HeaderIndex,
    ZtMessage,
    zhangsu,
    liuru,
    Bar,
    Zs,
    Bg,
    Lx,
  },
  data() {
    return {
      switchStatus: true,
      // theme: "dark",

      logowidth: window.innerWidth / 2 + "px",

      indexs: [], // 指数部分
      optionalstex: [], // 自选部分
      jdk: [], // 自选部分
      fortime: 0, //计数
      times: 0,
      stockserver: [],
      // jdk:[],
      stock: null,
      kline: null, // k线图
      tableHeight: "", //表格高度
      obj: "",
      myselfstorage: [],
      myop: [],
      isShowTooltip: false,
      dataset: "optionalstex",
      weizhi: "ma",
    };
  },
  filters: {
    //处理函数

    addPriceIcon(value) {
      return value + " ¥";
    },
    font_color(val) {
      let setcolor = storage.get(val, "");
      var color = `rgb(${Math.round(Math.random() * 100)},${Math.round(
        Math.random() * 100
      )},${Math.round(Math.random() * 100)})`;
      // storage.remove(val, "");
      if (setcolor != "") {
        return (
          '<span class="hangye" style="border-radius:5px;border: 1px solid #474747;margin: 0;padding:0px;color:' +
          setcolor +
          ';">' +
          val +
          "</span>"
        );
      } else {
        setcolor = storage.set(val, color);
        return (
          '<span class="hangye"  style="border-radius:5px;border: 1px solid #474747;margin: 0;padding:0px;color:' +
          setcolor +
          ';">' +
          val +
          "</span>"
        );
      }
    },
  },
  created() {
    this.getcashData();
    this.getTableHeight();
    // this.loadTheme();
  },
  mounted() {
    setInterval(this.getcashData, 3000); // 轮训获取数据
    this.rowDrop(); // 拖拽功能
    this.bindKey(); // 键盘映射
    this.bindMouse(); // 鼠标移动
    this.bindDrag(); // 绑定顶栏拖拽
    this.initIpcListener(); // 初始化主窗口监听事件
    let _this = this;
    window.onresize = () => {
      if (_this.resizeFlag) {
        clearTimeout(_this.resizeFlag);
      }
      _this.resizeFlag = setTimeout(() => {
        _this.getTableHeight();
        _this.resizeFlag = null;
      }, 0);
    };
  },
  computed: {
    localtimes: function () {
      return this.$store.state.localtimes;
    },
  },
  watch: {
    localtimes: {
      handler(val) {
        this.getcashData();
      },
    },
    switchStatus(val) {
      document.body.className = val ? "dark-theme" : "light-theme";
    },
  },

  methods: {
    toggleTheme() {
      this.theme = this.theme === "light" ? "dark" : "light";
      this.$nextTick(() => {
        document.body.className = this.theme;
      });
    },
    //计算table高度(动态设置table高度)
    getTableHeight() {
      let tableH = 200; //距离页面下方的高度
      let tableHeightDetil = window.innerHeight - tableH;
      if (tableHeightDetil <= 300) {
        this.tableHeight = 300;
      } else {
        this.tableHeight = window.innerHeight - tableH;
      }
    },

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
    getcashData() {
      this.myop = [];
      let query = storage.get("optionalstex", "");
      let myselfstorage = [];
      this.emptytext = "数据加载中";
      if (query !== "" && query !== null) {
        myselfstorage = query.split(",");
        myselfstorage.forEach((item) => {
          let selecode =
            item.substr(0, 2) == "sz"
              ? 0 + item.substr(2, 8)
              : 1 + item.substr(2, 8);
          let stock = storage.get(selecode, "");
          // console.log(stock, "这个是stock");
          if (stock !== "" && stock !== null) {
            this.myop.push(stock);
          } else {
            this.deleteStock(item);
          }
        });
        this.emptytext = "数据加载中------------";
      }
    },
    // 添加行业框颜色

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
      let delestorage = storage.get("optionalstex");
      let storageOptional = delestorage.split(",");
      let final = [];
      storageOptional.forEach((item) => {
        if (item.toLowerCase() !== code.toLowerCase()) {
          final.push(item);
        }
      });
      storage.set("optionalstex", final.join(","));
      this.getcashData();
      this.$toasted.show(`您已成功删除：${code}`, {
        theme: "toasted-primary",
        position: "bottom-center",
        duration: 1000,
      });
    },
    deleteAll() {
      storage.remove("optionalstex");

      this.getcashData();
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
      const modified = this.optionalstex.map((item) => item.code);
      storage.set("optionalstex", modified.join(","));
    },
    /**
     * 显示单支股票的详情，通过新窗口显示
     * @param row {object} - 个股数据
     */
    showDetail(row) {
      let code = row.f13 > 0 ? "sh" + row.f12 : "sz" + row.f12;
      ipc.send("create", code);
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
          const currRow = _this.optionalstex.splice(oldIndex, 1)[0];
          _this.optionalstex.splice(newIndex, 0, currRow);
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
      ipc.on("show-xueqiu-ma", (event, code) => {
        this.openInXueQiu(code);
      });
      ipc.on("show-guba-ma", (event, code) => {
        this.openInGuBa(code);
      });
      ipc.on("place-top-ma", (event, code) => {
        let topstorage = storage.get("optionalstex");
        let storageOptional = topstorage.split(",");
        if (storageOptional.indexOf(code) > -1) {
          storageOptional.splice(storageOptional.indexOf(code), 1);
        }
        storage.set("optionalstex", code + "," + storageOptional.join(","));
        this.getcashData();
      });
      ipc.on("add-stock-ma", (event, code) => {
        // console.log(code, "要被删除的code");
        this.andMystock(code);
        this.getcashData();
      });
      ipc.on("delete-stock-ma", (event, code) => {
        // console.log(code, "要被删除的code");
        this.deleteStock(code);
      });
      ipc.on("delete-all-ma", (event, code) => {
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

    /**
     * 右键指数&个股显示上下文菜单
     * @param row {object} - 个股数据
     */
    showContext(row) {
      // console.log(row);
      let code = row.f13 > 0 ? "sh" + row.f12 : "sz" + row.f12;
      // console.log(code, "code");
      ipc.send("main-right-click", code, this.weizhi);
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
     * 添加自选股
     */
    andMystock(code) {
      let selestorage = storage.get("mystocks", "");
      if (selestorage !== null && selestorage !== "") {
        let splitCode = selestorage.split(","); // 获取存储的代码
        // 判断是否存在
        if (splitCode.indexOf(code) > -1 || stockIndex.indexOf(code) > -1) {
          this.$toasted.show("已存在自选", {
            theme: "toasted-primary",
            position: "bottom-center",
            duration: 2000,
          });
          // this.refreshOptionals();
        } else {
          storage.set("mystocks", `${code},${selestorage}`); // 非空的情况
          this.$toasted.show("添加自选", {
            theme: "toasted-primary",
            position: "bottom-center",
            duration: 2000,
          });
          // this.refreshOptionals();
        }
      } else {
        storage.set("mystocks", code); // 空的情况
        this.$toasted.show("添加自选", {
          theme: "toasted-primary",
          position: "bottom-center",
          duration: 2000,
        });
        // this.refreshOptionals();
      }
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

