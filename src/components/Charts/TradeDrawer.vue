<template>
  <div :id="id" :class="className" :stockCode1="stockCode1" :btnSize="btnSize">
    <el-button type="danger" plain @click="clickBuy" :size="btnSize"
      >买入</el-button
    >
    <el-button type="primary" plain @click="clickSell" :size="btnSize"
      >卖出</el-button
    >
    <el-drawer
      :modal="modal"
      :visible.sync="drawer"
      size="49%"
      @open="drawerOpen"
      @close="drawerClose"
      :direction="direction"
    >
      <!--头部-->
      <div slot="title">
        <span class="trade-drawer-head-text"
          >总资产：{{ totalBalance + totalMarketValue }}</span
        >
        <span class="trade-drawer-head-text">可用资金：{{ avlBalance }}</span>
        <span class="trade-drawer-head-text"
          >参考市值：{{ totalMarketValue }}</span
        >
        <span class="trade-drawer-head-text"
          >浮动盈亏：<span :style="totalFloatingPLColor">{{
            totalFloatingPL
          }}</span></span
        >
        <el-button
          size="medium"
          style="margin-left: 8%; height: 35px"
          type="primary"
          @click="getUserBalanceStatus"
          round
        >
          刷新状态
        </el-button>
      </div>
      <el-row :gupanr="10" type="flex" class="trade-drawer-row" align="center">
        <el-col :span="10" class="trade-drawer-col1">
          <el-form ref="entrustForm" :model="entrustForm" :rules="rules">
            <el-form-item align="center" prop="actionType">
              <el-radio-group
                v-model="entrustForm.actionType"
                @change="actionTypeChange"
              >
                <el-radio-button label="buy">买入</el-radio-button>
                <el-radio-button label="sell">卖出</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item align="center" prop="entrustCode">
              <el-autocomplete
                v-model="entrustForm.entrustCode"
                :fetch-suggestions="querySearch"
                placeholder="请输入股票代码或名称"
                :trigger-on-focus="false"
                @select="handleSelect"
              ></el-autocomplete>
            </el-form-item>
            <el-form-item
              align="center"
              style="height: 30px"
              prop="entrustPrice"
            >
              <el-input-number
                v-model="entrustForm.entrustPrice"
                :precision="2"
                :step="0.01"
                :max="entrustForm.upLimitPrice"
                :min="entrustForm.downLimitPrice"
                @input="entrustPriceChange"
              ></el-input-number>
            </el-form-item>
            <el-form-item align="center" style="height: 30px">
              <span class="trade-input-text"
                >跌停:<span :style="downColor">{{
                  entrustForm.downLimitPrice
                }}</span></span
              >
              <span
                class="trade-input-text"
                v-if="entrustForm.actionType === 'buy'"
                >可买数量:{{ entrustForm.canBuyNumber }}</span
              >
              <span class="trade-input-text" v-else
                >可卖数量:{{ entrustForm.canSellNumber }}</span
              >
              <span class="trade-input-text"
                >涨停:<span :style="upColor">{{
                  entrustForm.upLimitPrice
                }}</span></span
              >
            </el-form-item>
            <el-form-item
              align="center"
              style="height: 30px"
              prop="entrustNumber"
            >
              <el-input-number
                v-if="entrustForm.actionType === 'buy'"
                v-model="entrustForm.entrustNumber"
                :step="100"
                :min="0"
                :max="entrustForm.canBuyNumber"
                :step-strictly="true"
              ></el-input-number>
              <el-input-number
                v-else
                v-model="entrustForm.entrustNumber"
                :step="100"
                :min="0"
                :max="entrustForm.canSellNumber"
                :step-strictly="true"
              ></el-input-number>
            </el-form-item>
            <el-form-item align="center" style="height: 30px" prop="storeRate">
              <el-radio-group
                v-model="entrustForm.storeRate"
                @change="storeRateChange"
              >
                <el-radio :label="1">全仓</el-radio>
                <el-radio :label="1 / 2">半仓</el-radio>
                <el-radio :label="1 / 3">1/3仓</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item align="center" prop="actionType">
              <el-button
                v-if="entrustForm.actionType === 'buy'"
                class="trade-button"
                type="danger"
                size="medium"
                @click="entrustTradeOrder"
                >买入
              </el-button>
              <el-button
                v-else
                class="trade-button"
                type="primary"
                size="medium"
                @click="entrustTradeOrder"
                >卖出
              </el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="22" class="trade-drawer-col2">
          <el-tabs v-model="actionName" type="card">
            <el-tab-pane label="挂单" name="entrustOrder">
              <el-table
                :data="entrustOrder"
                height="200"
                border
                fit
                highlight-current-row
                :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
                style="width: 100%; left: 20px"
              >
                <el-table-column
                  label="股票代码"
                  prop="stockCode"
                  align="center"
                  width="90"
                >
                  <template slot-scope="{ row }">
                    <span>{{ row.stockCode.substr(2, 6) }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="股票名称"
                  prop="stockName"
                  align="center"
                  width="100"
                >
                  <template slot-scope="{ row }">
                    <span>{{ row.stockName }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="委托时间"
                  prop="costPrice"
                  align="center"
                  width="110"
                >
                  <template slot-scope="{ row }">
                    <span>{{ row.entrustTime }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="委托数量"
                  prop="totalNumber"
                  align="center"
                  width="110"
                >
                  <template slot-scope="{ row }">
                    <span>{{ row.entrustNumber }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="委托价格"
                  prop="entrustPrice"
                  align="center"
                  width="110"
                >
                  <template slot-scope="{ row }">
                    <span>{{ row.entrustPrice }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="委托类型"
                  prop="type"
                  align="center"
                  width="100"
                >
                  <template slot-scope="{ row }">
                    <span>{{ row.type }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="委托状态"
                  prop="station"
                  align="center"
                  width="110"
                >
                  <template slot-scope="{ row }">
                    <span>{{ row.station }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="操作"
                  prop="action"
                  align="center"
                  width="120"
                >
                  <template slot-scope="{ row, $index }">
                    <el-button
                      type="danger"
                      size="mini"
                      @click="cancelEntrustOrder(row.orderId, $index)"
                    >
                      撤单
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="持仓信息" name="holdShares">
              <el-table
                :data="holdShares"
                height="200"
                border
                fit
                highlight-current-row
                :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
                style="width: 100%; left: 20px"
              >
                <el-table-column
                  label="股票代码"
                  prop="stockCode"
                  align="center"
                  width="80"
                >
                  <template slot-scope="{ row }">
                    <span>{{ row.stockCode.substr(2, 6) }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="股票名称"
                  prop="stockName"
                  align="center"
                  width="85"
                >
                  <template slot-scope="{ row }">
                    <span>{{ row.stockName }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="成本价"
                  prop="costPrice"
                  align="center"
                  width="80"
                >
                  <template slot-scope="{ row }">
                    <span>{{ row.costPrice }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="总数量"
                  prop="totalNumber"
                  align="center"
                  width="90"
                >
                  <template slot-scope="{ row }">
                    <span>{{ row.totalNumber }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="可用数量"
                  prop="avlNumber"
                  align="center"
                  width="90"
                >
                  <template slot-scope="{ row }">
                    <span>{{ row.avlNumber }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="浮动盈亏"
                  prop="floatingPL"
                  align="center"
                  width="100"
                >
                  <template slot-scope="{ row }">
                    <span :style="row.floatingColor">{{ row.floatingPL }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="浮动盈亏率"
                  prop="floatingPLChg"
                  align="center"
                  width="100"
                >
                  <template slot-scope="{ row }">
                    <span :style="row.floatingColor"
                      >{{ row.floatingPLChg }}%</span
                    >
                  </template>
                </el-table-column>
                <el-table-column
                  label="现价"
                  prop="nowPrice"
                  align="center"
                  width="80"
                >
                  <template slot-scope="{ row }">
                    <span>{{ row.nowPrice }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="市值"
                  prop="marketValue"
                  align="center"
                  width="100"
                >
                  <template slot-scope="{ row }">
                    <span>{{ row.marketValue }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="仓位"
                  prop="storeRate"
                  align="center"
                  width="76"
                >
                  <template slot-scope="{ row }">
                    <span>{{ row.storeRate }}%</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="当日委托" name="todayEntrust">
              <el-table
                :data="todayTradeOrder"
                height="200"
                border
                fit
                highlight-current-row
                :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
                style="width: 100%; left: 20px"
              >
                <el-table-column
                  label="股票代码"
                  prop="stockCode"
                  align="center"
                  width="90"
                >
                  <template slot-scope="{ row }">
                    <span>{{ row.stockCode.substr(2, 6) }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="股票名称"
                  prop="stockName"
                  align="center"
                  width="100"
                >
                  <template slot-scope="{ row }">
                    <span>{{ row.stockName }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="委托时间"
                  prop="costPrice"
                  align="center"
                  width="110"
                >
                  <template slot-scope="{ row }">
                    <span>{{ row.entrustTime }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="委托数量"
                  prop="totalNumber"
                  align="center"
                  width="110"
                >
                  <template slot-scope="{ row }">
                    <span>{{ row.entrustNumber }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="委托价格"
                  prop="entrustPrice"
                  align="center"
                  width="110"
                >
                  <template slot-scope="{ row }">
                    <span>{{ row.entrustPrice }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="委托类型"
                  prop="type"
                  align="center"
                  width="100"
                >
                  <template slot-scope="{ row }">
                    <span>{{ row.type }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="委托状态"
                  prop="station"
                  align="center"
                  width="110"
                >
                  <template slot-scope="{ row }">
                    <span>{{ row.station }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="成交价格"
                  prop="donePrice"
                  align="center"
                  width="110"
                >
                  <template slot-scope="{ row }">
                    <span>{{ row.donePrice }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="当日成交" name="todayDone">
              <el-table
                :data="todayDoneOrder"
                height="200"
                border
                fit
                highlight-current-row
                :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
                style="width: 100%; left: 20px"
              >
                <el-table-column
                  label="股票代码"
                  prop="stockCode"
                  align="center"
                  width="90"
                >
                  <template slot-scope="{ row }">
                    <span>{{ row.stockCode.substr(2, 6) }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="股票名称"
                  prop="stockName"
                  align="center"
                  width="100"
                >
                  <template slot-scope="{ row }">
                    <span>{{ row.stockName }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="委托时间"
                  prop="costPrice"
                  align="center"
                  width="110"
                >
                  <template slot-scope="{ row }">
                    <span>{{ row.entrustTime }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="委托数量"
                  prop="totalNumber"
                  align="center"
                  width="110"
                >
                  <template slot-scope="{ row }">
                    <span>{{ row.entrustNumber }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="委托价格"
                  prop="entrustPrice"
                  align="center"
                  width="110"
                >
                  <template slot-scope="{ row }">
                    <span>{{ row.entrustPrice }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="委托类型"
                  prop="type"
                  align="center"
                  width="100"
                >
                  <template slot-scope="{ row }">
                    <span>{{ row.type }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="委托状态"
                  prop="station"
                  align="center"
                  width="110"
                >
                  <template slot-scope="{ row }">
                    <span>{{ row.station }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="成交价格"
                  prop="donePrice"
                  align="center"
                  width="110"
                >
                  <template slot-scope="{ row }">
                    <span>{{ row.donePrice }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
import {
  changeToStockCode1,
  handleOrderType,
  getColor,
  getColorByOne,
  getDownColor,
  getUpColor,
  handleTimestamp,
  handleOrderStation,
  ifCurTimeIsTradeTime,
} from "../../utils/stockUtils";

import Util from "../../utils/utils";

export default {
  name: "tradeDrawer",
  props: {
    btnSize: {
      type: String,
    },
    stockCode1: {
      type: String,
    },
    className: {
      type: String,
      default: "StockHead",
    },
    id: {
      type: String,
      default: "StockHead",
    },
  },
  data() {
    const validateEntrustCode = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入股票代码"));
      } else if (!Util.entrustCodeReg.test(value)) {
        callback(new Error("请输入正确的股票代码"));
      } else {
        callback();
      }
    };
    const validateEntrustNumber = (rule, value, callback) => {
      if (value === undefined) {
        callback(new Error("请输入委托数量"));
      } else if (value === 0) {
        callback(new Error("委托数量不能为0"));
      } else if (isNaN(value)) {
        callback(new Error("委托数量不能为Nan"));
      } else {
        callback();
      }
    };
    return {
      drawer: false,
      modal: false,
      direction: "btt", //交易抽屉由下往上打开
      upColor: getUpColor(),
      downColor: getDownColor(),

      userToken: this.$store.getters.token,

      actionName: "entrustOrder",

      totalBalance: 0, //总资金
      avlBalance: 0, //可用资金
      totalMarketValue: 0, //总市值
      totalFloatingPL: 0, //浮动盈亏
      totalFloatingPLColor: "", //浮动盈亏颜色

      hold_stocks: [], //从数据库获取的持仓信息
      holdShares: [], //加工过后的持仓信息
      entrustOrder: [], //目前还挂着的委托单列表
      todayTradeOrder: [], //今日委托列表
      todayDoneOrder: [], //今日成交列表

      entrustForm: {
        entrustCode: this.stockCode1.substr(2, 6), //委托股票代码
        entrustPrice: 0, //委托价
        entrustNumber: 0, //委托数量
        upLimitPrice: 100, //涨停价
        downLimitPrice: 80, //跌停价
        storeRate: undefined, //购买仓位比重
        actionType: "buy",
        canBuyNumber: 0,
        canSellNumber: 0,
      },

      listTimer: "", //定时刷新器
      holdSharesTimer: "",

      station: {
        entrust: 0, //还挂着的单
        cancel: -1, //已撤的单
        done: 1, //已成交的单
      },

      rules: {
        entrustCode: [
          {
            validator: validateEntrustCode,
          },
        ],
        entrustNumber: [
          {
            validator: validateEntrustNumber,
          },
        ],
      },
    };
  },
  methods: {
    querySearch(query, cb) {
      let stockQuery = [];
      this.$store.dispatch("stock/getQueryStock", query).then((res) => {
        for (let i = 0; i < res.data.length; i++) {
          //this.stockQuery[i].value = res.data[i].symbol + '\t' + res.data[i].name
          stockQuery.push({
            value: res.data[i].symbol + "\t" + res.data[i].name,
            symbol: res.data[i].symbol,
            name: res.data[i].name,
          });
        }
      });
      // 调用 callback 返回建议列表的数据
      cb(stockQuery);
    },

    drawerOpen() {
      this.getUserBalanceStatus();
      this.holdSharesTimer = this.listTimer = setInterval(() => {
        if (ifCurTimeIsTradeTime()) {
          this.getUserBalanceStatus();
        }
      }, 300000000); //半分钟刷一次
    },

    drawerClose() {
      clearInterval(this.listTimer);
      clearInterval(this.holdSharesTimer);
      console.log("drawerClose");
    },

    getUserBalanceStatus() {
      this.$store
        .dispatch("trade/getCapitalStatus", this.userToken)
        .then((res) => {
          this.totalBalance = Number(res.total_balance);
          this.avlBalance = Number(res.avl_balance);
          this.hold_stocks = res.hold_stocks;
          this.getStocksNowPrice(res.hold_stocks);
          this.getStockPriceInfo(this.stockCode1);
          this.getTodayUserTradeOrderInfo();
          this.listTimer = setInterval(() => {
            if (ifCurTimeIsTradeTime()) {
              this.getStocksNowPrice(this.hold_stocks);
            }
          }, 30000000);
        });
    },

    //用户持仓信息
    getStocksNowPrice(holdShare) {
      let stockCodes = [];
      for (let i = 0; i < holdShare.length; i++) {
        stockCodes.push(holdShare[i].stock_code);
      }
      this.$store
        .dispatch("stock/getStockInfo", stockCodes.join())
        .then((res) => {
          let data = res.data.split(";");
          let temp = [];
          this.holdShares = [];
          this.totalMarketValue = 0;
          this.totalFloatingPL = 0;
          for (let i = 0; i < data.length - 1; i++) {
            temp.push(data[i].split("~"));
            this.holdShares.push({
              stockCode: holdShare[i].stock_code,
              stockName: holdShare[i].stock_name,
              costPrice: holdShare[i].cost_price,
              totalNumber: holdShare[i].total_number,
              avlNumber: holdShare[i].avl_number,
              nowPrice: Number(temp[i][3]), //该股票现价
              marketValue: Number(
                (Number(temp[i][3]) * holdShare[i].total_number).toFixed(2)
              ), //该股票持有总市值
              floatingPL: Number(
                (
                  (Number(temp[i][3]) - holdShare[i].cost_price) *
                  holdShare[i].total_number
                ).toFixed(2)
              ), //浮动盈亏
              floatingPLChg: Number(
                (
                  ((Number(temp[i][3]) - holdShare[i].cost_price) /
                    Number(temp[i][3])) *
                  100
                ).toFixed(2)
              ), //浮动盈亏比
              floatingColor: getColor(
                Number(temp[i][3]),
                holdShare[i].cost_price
              ),
            });
            this.totalMarketValue += this.holdShares[i].marketValue;
            this.totalFloatingPL += this.holdShares[i].floatingPL;
            if (holdShare[i].stock_code === this.stockCode1) {
              this.entrustForm.canSellNumber = this.holdShares[i].avlNumber;
            }
          }
          for (let i = 0; i < data.length - 1; i++) {
            this.holdShares[i].storeRate = Number(
              (
                (this.holdShares[i].marketValue /
                  (this.totalMarketValue + this.totalBalance)) *
                100
              ).toFixed(2)
            ); //仓位比重
          }
          this.totalFloatingPLChg = Number(
            (this.totalFloatingPL /
              (this.totalMarketValue + this.totalBalance)) *
              100
          ).toFixed(2);
          this.totalFloatingPLColor = getColorByOne(this.totalFloatingPL);
        });
    },

    //获取用户委托单信息，并对三个列表进行赋值
    getTodayUserTradeOrderInfo() {
      let query = { token: this.userToken, station: null };
      this.entrustOrder = [];
      this.todayTradeOrder = [];
      this.todayDoneOrder = [];
      this.$store
        .dispatch("trade/getTodayUserTradeOrderInfo", query)
        .then((response) => {
          // console.log("getTodayUserTradeOrderInfo")
          // console.log(res);
          let res = response.data;
          for (let i = 0; i < res.length; i++) {
            this.todayTradeOrder.push({
              orderId: res[i].order_id,
              stockCode: res[i].stock_code,
              stockName: res[i].stock_name,
              station: handleOrderStation(res[i].station),
              entrustTime: handleTimestamp(res[i].entrust_time, "hh:mm:ss"),
              entrustPrice: res[i].entrust_price,
              entrustNumber: res[i].number,
              donePrice:
                res[i].done_price === undefined ? "———" : res[i].done_price,
              cancelTime: handleTimestamp(res[i].cancel_time, "hh:mm:ss"),
              doneTime: handleTimestamp(res[i].done_time, "hh:mm:ss"),
              type: handleOrderType(res[i].type),
            });
            if (res[i].station === this.station.entrust) {
              this.entrustOrder.push(this.todayTradeOrder[i]);
            } else if (res[i].station === this.station.done) {
              this.todayDoneOrder.push(this.todayTradeOrder[i]);
            } else {
            }
          }
        });
      // console.log(this.todayTradeOrder);
      // console.log(this.entrustOrder);
      // console.log(this.todayDoneOrder);
    },

    //撤单
    cancelEntrustOrder(orderId, index) {
      this.$confirm("请确定是否要撤销该委托单？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true,
      }).then(() => {
        let data = { token: this.userToken, orderId: orderId };
        console.log("data:");
        console.log(data);
        this.$store.dispatch("trade/cancelUserEntrustOrder", data).then(() => {
          this.$notify({
            title: "Success",
            message: "撤单成功",
            type: "success",
            duration: 2000,
          });
          this.entrustOrder.splice(index, 1);
          this.getUserBalanceStatus();
        });
      });
    },

    //挂单
    entrustTradeOrder() {
      this.$confirm("请确定是否要进行挂单？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true,
      }).then(() => {
        this.$refs["entrustForm"].validate((valid) => {
          if (valid) {
            console.log(this.entrustForm);
            //if (ifCurTimeIsTradeTime()) { //判断当前是否为交易时间
            let data = {
              token: this.userToken,
              code: changeToStockCode1(this.entrustForm.entrustCode),
              price: this.entrustForm.entrustPrice.toFixed(2),
              number: this.entrustForm.entrustNumber,
              type: this.entrustForm.actionType,
            };
            this.$store.dispatch("trade/entrustTradeOrder", data).then(() => {
              this.$notify({
                title: "Success",
                message: "挂单成功",
                type: "success",
                duration: 2000,
              });
              this.getUserBalanceStatus();
            });
            // }else{
            //   this.$notify({
            //     title: 'Error',
            //     message: '当前并非交易时间，无法进行交易',
            //     type: 'error',
            //     duration: 2000
            //   });
            // }
          }
        });
      });
    },

    //获取股票当前价格，并赋值可买、可卖的数量
    getStockPriceInfo(stockCode) {
      this.$store.dispatch("stock/getStockInfo", stockCode).then((res) => {
        let stockInfo = res.data.split("~");
        this.entrustForm.entrustPrice = Number(stockInfo[3]); //现价
        this.entrustForm.upLimitPrice = Number(stockInfo[47]); //涨停价
        this.entrustForm.downLimitPrice = Number(stockInfo[48]); //跌停价
        this.entrustForm.canSellNumber = 0;
        this.entrustPriceChange();
        this.actionTypeChange();
      });
    },
    clickBuy() {
      this.drawer = true;
      this.entrustForm.actionType = "buy";
      this.getUserBalanceStatus();
    },
    clickSell() {
      this.drawer = true;
      this.entrustForm.actionType = "sell";
      this.getUserBalanceStatus();
    },
    handleSelect(item) {
      this.entrustForm.entrustCode = item.symbol;
      this.getStockPriceInfo(changeToStockCode1(item.symbol));
    },
    entrustPriceChange() {
      this.entrustForm.canBuyNumber =
        Math.floor(this.avlBalance / (this.entrustForm.entrustPrice * 100)) *
        100;
    },
    storeRateChange() {
      if (this.entrustForm.actionType === "buy") {
        this.entrustForm.entrustNumber =
          Math.floor(
            (this.entrustForm.canBuyNumber * this.entrustForm.storeRate) / 100
          ) * 100;
      } else {
        this.entrustForm.entrustNumber =
          Math.floor(
            (this.entrustForm.canSellNumber * this.entrustForm.storeRate) / 100
          ) * 100;
      }
    },
    actionTypeChange() {
      let code1 = changeToStockCode1(this.entrustForm.entrustCode);
      for (let i = 0; i < this.holdShares.length; i++) {
        if (this.holdShares[i].stockCode === code1) {
          this.entrustForm.canSellNumber = this.holdShares[i].avlNumber;
        }
      }
      console.log(this.entrustForm.entrustNumber);
      if (isNaN(this.entrustForm.entrustNumber)) {
        this.entrustForm.entrustNumber = 0;
      }
      this.storeRateChange();
    },
  },
};
</script>

<style scoped>
.trade-drawer-row {
  margin: 0 10px auto auto;
}

.trade-drawer-col1 {
  margin-left: 5%;
  font-size: 16px;
  border: 2px solid #cbcdd1;
  background-color: rgb(245, 245, 245);
}

.trade-drawer-col2 {
  margin-left: 8%;
  font-size: 16px;
  border: 2px solid #cbcdd1;
}

.trade-button {
  width: 200px;
  margin-bottom: 5px;
}

.trade-input-text {
  font-size: 12px;
  margin: 12px;
}

.trade-drawer-head-text {
  margin-left: 5%;
  margin-right: 5%;
  font-size: 18px;
}

.el-table th {
  display: table-cell !important;
}

.el-form-item {
  margin-top: 4px;
  margin-bottom: 4px;
}
</style>
