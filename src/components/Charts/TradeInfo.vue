<template>
  <div
    :id="id"
    :class="className"
    :style="{ height: height, width: width }"
    :stockCode1="stockCode1"
  >
    <el-row :gutter="5" type="flex" class="el-row-trade" align="center">
      <el-col :span="12">
        <div class="trade-head-text">
          委差：
          <div :style="colorArr[10]">{{ entrustDValue }}</div>
        </div>
        <div class="trade-head-text">
          外盘：
          <div :style="colorArr[11]">{{ BPan }}</div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="trade-head-text">
          委比：
          <div :style="colorArr[10]">{{ entrustRatio }}%</div>
        </div>
        <div class="trade-head-text">
          内盘：
          <div :style="colorArr[12]">{{ SPan }}</div>
        </div>
      </el-col>
    </el-row>
    <hr class="splitLine" />
    <el-row :gutter="5" type="flex" class="el-row-trade-sell" align="center">
      <el-col :span="8">
        <div class="BS-text">卖五</div>
        <div class="BS-text">卖四</div>
        <div class="BS-text">卖三</div>
        <div class="BS-text">卖二</div>
        <div class="BS-text">卖一</div>
      </el-col>
      <el-col :span="8">
        <div class="BS-text" :style="colorArr[9]">{{ BSTradeInfo[18] }}</div>
        <div class="BS-text" :style="colorArr[8]">{{ BSTradeInfo[16] }}</div>
        <div class="BS-text" :style="colorArr[7]">{{ BSTradeInfo[14] }}</div>
        <div class="BS-text" :style="colorArr[6]">{{ BSTradeInfo[12] }}</div>
        <div class="BS-text" :style="colorArr[5]">{{ BSTradeInfo[10] }}</div>
      </el-col>
      <el-col :span="8">
        <div class="BS-text">{{ BSTradeInfo[19] }}</div>
        <div class="BS-text">{{ BSTradeInfo[17] }}</div>
        <div class="BS-text">{{ BSTradeInfo[15] }}</div>
        <div class="BS-text">{{ BSTradeInfo[13] }}</div>
        <div class="BS-text">{{ BSTradeInfo[11] }}</div>
      </el-col>
    </el-row>
    <hr class="bs-splitLine" />
    <el-row :gutter="5" type="flex" class="el-row-trade-buy" align="center">
      <el-col :span="8">
        <div class="BS-text">买一</div>
        <div class="BS-text">买二</div>
        <div class="BS-text">买三</div>
        <div class="BS-text">买四</div>
        <div class="BS-text">买五</div>
      </el-col>
      <el-col :span="8">
        <div class="BS-text" :style="colorArr[0]">{{ BSTradeInfo[0] }}</div>
        <div class="BS-text" :style="colorArr[1]">{{ BSTradeInfo[2] }}</div>
        <div class="BS-text" :style="colorArr[2]">{{ BSTradeInfo[4] }}</div>
        <div class="BS-text" :style="colorArr[3]">{{ BSTradeInfo[6] }}</div>
        <div class="BS-text" :style="colorArr[4]">{{ BSTradeInfo[8] }}</div>
      </el-col>
      <el-col :span="8">
        <div class="BS-text">{{ BSTradeInfo[1] }}</div>
        <div class="BS-text">{{ BSTradeInfo[3] }}</div>
        <div class="BS-text">{{ BSTradeInfo[5] }}</div>
        <div class="BS-text">{{ BSTradeInfo[7] }}</div>
        <div class="BS-text">{{ BSTradeInfo[9] }}</div>
      </el-col>
    </el-row>
    <hr class="bs-splitLine" />

    <!--<el-row :gutter="5" type="flex" class="el-row-trade-record" align="center">-->
    <!--<el-col :span="12">-->
    <!--<div class="BS-text" v-for="(item) in tradeRecordInfo">{{item.time}}</div>-->
    <!--</el-col>-->
    <!--<el-col :span="10">-->
    <!--<div class="BS-text" v-for="(item) in tradeRecordInfo" :style="item.priceColor">{{item.price}}</div>-->
    <!--</el-col>-->
    <!--<el-col :span="10">-->
    <!--<div class="BS-text" v-for="(item) in tradeRecordInfo">{{item.number}}</div>-->
    <!--</el-col>-->
    <!--<el-col :span="3">-->
    <!--<div class="BS-text" v-for="(item) in tradeRecordInfo" :style="item.BSColor">{{item.BS}}</div>-->
    <!--</el-col>-->
    <!--</el-row>-->
    <el-row :gutter="5" type="flex" class="el-row-trade-record" align="center">
      <el-col :span="12">
        <div class="BS-text" v-for="item in tradeRecordInfo">{{ item[1] }}</div>
      </el-col>
      <el-col :span="10">
        <div class="BS-text" v-for="item in tradeRecordInfo" :style="item[7]">
          {{ item[2] }}
        </div>
      </el-col>
      <el-col :span="10">
        <div class="BS-text" v-for="item in tradeRecordInfo">{{ item[4] }}</div>
      </el-col>
      <el-col :span="3">
        <div class="BS-text" v-for="item in tradeRecordInfo" :style="item[8]">
          {{ item[6] }}
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  getBaseColor,
  getBSTradeInfo,
  getBSTradeInfoColor,
  getColor,
  getCurPage,
  getDownColor,
  getUpColor,
  handleBSPan,
  ifCurTimeIsTradeTime,
} from "../../utils/stockUtils";

export default {
  name: "tradeInfo",
  props: {
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
    width: {
      type: String,
      default: "280px",
    },
    height: {
      type: String,
      default: "550px",
    },
  },
  data() {
    return {
      stockInfo: [],
      entrustDValue: "",
      entrustRatio: "",
      BPan: "",
      SPan: "",
      stockIndustry: "",
      tradeRecordInfo: [],
      BSTradeInfo: [],
      stockArea: "",
      colorArr: [],

      tradeRecordPage: getCurPage(),

      timer: "", // 定时刷新器
    };
  },
  mounted() {
    this.setStockTrade();
  },
  beforeDestroy() {
    this.$once("hook:beforeDestroy", () => {
      clearInterval(this.timer);
    });
  },
  watch: {
    stockCode1: {
      immediate: true,
      handler() {
        this.setStockTrade();
      },
    },
  },
  methods: {
    setStockTrade() {
      this.getStockTradeInfo(this.stockCode1);
      this.timer = setInterval(() => {
        if (ifCurTimeIsTradeTime()) {
          //判断当前是否为交易时间
          this.getStockTradeInfo(this.stockCode1);
        }
      }, 30000000);
    },
    getTradeRecord(stockCode, page, preClose) {
      let query = { stockCode: stockCode, page: page };
      this.$store.dispatch("stock/getRecordInfo", query).then((res) => {
        //console.log(res)
        if (res.data !== "" && res.data !== null && res.data !== undefined) {
          this.tradeRecordPage = page;
          //console.log(this.tradeRecordPage)
          let tempRecord = [];
          this.getTradeRecordInfo(stockCode, page, tempRecord, preClose, 0);
        } else {
          this.tradeRecordPage = page - 1;
          //console.log(this.tradeRecordPage)
          this.getTradeRecord(stockCode, this.tradeRecordPage, preClose);
          //console.log(this.tradeRecordInfo)
        }
      });
    },

    //flag 为 0 则表示正常获取当前页交易数据，而为 1 则表示是因为最新页数据个数不足为10而返回去获取旧数据的
    getTradeRecordInfo(stockCode, page, tempRecord, preClose, flag) {
      let query = { stockCode: stockCode, page: page };
      this.$store.dispatch("stock/getRecordInfo", query).then((res) => {
        let data = res.data.split('"')[1].split("|");
        for (let i = data.length - 1; i >= 0 && tempRecord.length < 10; i--) {
          let temp = data[i].split("/");
          temp.push(getColor(Number(temp[2]), preClose)); //计算该成交价格的颜色
          if (temp[6] === "S") {
            temp.push(getDownColor());
          } else {
            temp.push(getUpColor());
          }
          tempRecord.push(temp);
        }
        if (data.length === 70 && flag === 0) {
          this.tradeRecordPage = page + 1;
          tempRecord = [];
          this.getTradeRecordInfo(stockCode, page + 1, tempRecord, preClose, 0);
        } else if (tempRecord.length < 10 && page > 0) {
          this.getTradeRecordInfo(stockCode, page - 1, tempRecord, preClose, 1);
        } else {
          this.tradeRecordInfo = [];
          this.tradeRecordInfo = tempRecord;
          tempRecord = [];
        }
      });
    },
    getStockTradeInfo(stockCode) {
      this.$store.dispatch("stock/getStockInfo", stockCode).then((res) => {
        this.stockInfo = res.data.split("~");
        let preClose = Number(this.stockInfo[4]);
        this.getTradeRecord(this.stockCode1, this.tradeRecordPage, preClose);
        //this.tradeRecordInfo = [];
        // let temps = this.stockInfo[29].split("|");
        // for (let i = 0; i < temps.length; i++) {
        //   let temp = temps[i].split('/');
        //   if(temp.length === 1){
        //     continue;
        //   }
        //   temp.push(getColor((Number(temp[1])), Number(preClose))); //计算该成交价格的颜色
        //   if (temp[3] === 'S') {
        //     temp.push(getDownColor());
        //   } else {
        //     temp.push(getUpColor());
        //   }
        //   this.tradeRecordInfo.push({
        //     time: temp[0],
        //     price: temp[1],
        //     priceColor: temp[6],
        //     number: temp[2],
        //     BS: temp[3],
        //     BSColor: temp[7]
        //   });
        // }

        this.BSTradeInfo = getBSTradeInfo(this.stockInfo);
        this.colorArr = getBSTradeInfoColor(preClose, this.BSTradeInfo);

        let entrustBuy =
          Number(this.stockInfo[10]) +
          Number(this.stockInfo[12]) +
          Number(this.stockInfo[14]) +
          Number(this.stockInfo[16]) +
          Number(this.stockInfo[18]);
        let entrustSell =
          Number(this.stockInfo[20]) +
          Number(this.stockInfo[22]) +
          Number(this.stockInfo[24]) +
          Number(this.stockInfo[26]) +
          Number(this.stockInfo[28]);
        this.entrustDValue = entrustBuy - entrustSell;
        this.entrustRatio = (
          ((entrustBuy - entrustSell) / (entrustBuy + entrustSell)) *
          100
        ).toFixed(2);
        this.BPan = handleBSPan(Number(this.stockInfo[7]));
        this.SPan = handleBSPan(Number(this.stockInfo[8]));
        if (this.entrustDValue > 0) {
          this.colorArr.push(getUpColor());
        } else if (this.entrustDValue < 0) {
          this.colorArr.push(getDownColor());
        } else {
          this.colorArr.push(getBaseColor());
        }
        this.colorArr.push(getUpColor());
        this.colorArr.push(getDownColor());
      });
    },
  },
};
</script>
<style>
.el-row-trade {
  margin: 10px auto auto auto;
}

.el-row-trade-buy {
  margin: -8px auto -5px auto;
}

.el-row-trade-sell {
  margin: 5px auto -8px auto;
}

.el-row-trade-record {
  margin: 7px auto -8px auto;
}

.BS-text {
  margin-left: 5px;
  min-height: 20px;
  min-width: 40px;
  font-size: 16px;
}

.trade-head-text {
  margin-left: 10px;
  min-height: 40px;
  min-width: 40px;
  font-size: 20px;
}

.splitLine {
  margin-left: -1px;
  border: 2px solid #adb0b2;
  background-color: rgb(235, 235, 235);
}

.bs-splitLine {
  margin-left: -1px;
}
</style>
