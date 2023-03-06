<template>
  <div>
    <el-popover placement="right" width="200" trigger="click">
      <!-- {{ (zs / 4800) * 100 }} -->
      <a class="settitle">
        动态设置table待完善。 六煞图-更新日期：{{ dayold }}</a
      >
      <!-- <div :id="id">
        <div :id="id + '1'" style="width: 200px; height: 100px"></div>
      </div> -->
      <div class="po_box potogram">
        <!-- <div :id="id">
          <div :id="id + '1'" style="width: 350px; height: 300px"></div>
        </div> -->
      </div>

      <div slot="reference">
        <div :id="id">
          <div :id="id + '1'" style="width: 80px; height: 50px"></div>
        </div>
        <!-- <div class="his_box togram">
          <div class="graph" v-for="(item, index) in bs" :key="index">
            <div :style="{ width: (item / maxbs) * 100 + '%' }">
              {{ item }}
            </div>
          </div>
        </div>
        <div class="boxx">
          <span
            class="item1"
            :style="{ width: ((4800 - zs) / 4800) * 100 + '%' }"
          ></span>
          <span
            class="item2"
            :style="{ width: (zs / 4800) * 100 + '%' }"
          ></span>
        </div> -->
      </div>
    </el-popover>
  </div>
</template>
<script>
import * as echarts from "echarts";

export default {
  props: {
    //     stockCode: {
    //         type: String
    //     },
    //     className: {
    //         type: String,
    //         default: 'chart'
    //     },

    bgcode: {
      type: String,
      default: "",
    },
    id: {
      type: String,
      default: "cha",
    },

    width: {
      type: String,
      default: "280px",
    },
    height: {
      type: String,
      default: "580px",
    },
  },
  data() {
    return {
      gpj: 0, //
      zpj: 0,
      dpj: 0,
      sgpj: 0, //
      szpj: 0,
      sdpj: 0,
      zs: 0,
      bs: [],
      maxbs: 0,
      dayold: "",
    };
  },

  created() {
    this.golx();
  },
  mounted() {
    this.golx();
    this.drawChart();
  },
  methods: {
    drawChart() {
      // console.log(this.bs, " this.bs,");
      // 基于准备好的dom，初始化echarts实例【这里存在一个问题，请看到最后】
      // let myChart = echarts.init(document.getElementById(this.id + "1"));
      let myChart = echarts.init(document.getElementById(this.id + "1"));
      // 指定图表的配置项和数据
      let option = {
        title: {
          // text: "六煞图",
        },
        tooltip: {},
        // legend: {
        //   data: ["销量"],
        // },
        xAxis: {
          data: ["1", "2", "空亡", "4", "5", "6"],
          // data: this.bs,
        },
        yAxis: {
          // show: false,
          // splitLine: { show: true }, //去除网格线
          splitLine: {
            // 网格线
            show: false,
            color: "red",
          },
        },
        series: [
          {
            name: "六煞",
            type: "bar",
            data: this.bs,
            // barWidth: 35, // 修改柱状图的宽度
            itemStyle: {
              // color: "#16adee",
              emphasis: {
                barBorderRadius: 1,
              },
              normal: {
                // color: "rgb(18,241,197)",
                // color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                //   { offset: 0, color: "#83bff6" },
                //   { offset: 0.5, color: "#188df0" },
                //   { offset: 1, color: "#188df0" },
                // ]),
                // 渐变色
                // color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                //   { offset: 0, color: "#32cd32" },
                //   { offset: 1, color: "#6495ed" },
                // ]),
                color: function (params) {
                  var index_color = params.value;
                  if (index_color <= 0) {
                    return "#00ff00";
                  } else if (index_color > 0 && index_color <= 35) {
                    return "#f5fc13";
                  } else if (index_color > 35 && index_color <= 75) {
                    return "#ff8400";
                  } else if (index_color > 75 && index_color <= 150) {
                    return "#fc0000";
                  } else if (index_color > 150 && index_color <= 250) {
                    return "#9b004f";
                  } else if (index_color > 250) {
                    return "#860023";
                  }
                },

                // shadowBlur: 20,
                // shadowColor: "rgba(64,95,94,0.5)",
                barBorderRadius: 1,
              },
            },
            showBackground: true,
            backgroundStyle: {
              // 背景圆角不生效
              borderRadius: 1,
              // 背景色
              // color: "rgb(9,60,167)",
              // color: "gray",
            },
          },
        ],
        grid: {
          top: "0%", // 与容器顶部的距离
          bottom: "1%", // 与容器底部的距离
        },
      };
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
    // 传值给父组件

    golx() {
      var ids = [];
      //alert("hello");
      this.$axios
        .get(`http://127.0.0.1:2030/?code=${this.bgcode}`)
        .then((response) => {
          this.info = response;

          if (response.data != NaN) {
            this.stockserver = response.data
              .replace(/\{|}/g, "")

              .split("~");
            // console.log(this.stockserver);
            this.dayold = this.stockserver[1];
            this.zs = this.stockserver[8];
            this.dpj = this.stockserver[9];
            this.mdpj = this.stockserver[10];
            this.zpj = this.stockserver[11];
            this.mzpj = this.stockserver[12];
            this.gpj = this.stockserver[13];
            this.mgpj = this.stockserver[14];
            this.bs = [
              Number(this.gpj),
              Number(this.zpj),
              Number(this.dpj),
              Number(this.mgpj),
              Number(this.mzpj),
              Number(this.mdpj),
            ];
            this.maxbs = Math.max.apply(null, this.bs);
            this.drawChart();
            //   console.log(Math.max.apply(null, this.bs), "222this.stockserver");
          } else {
            //   console.log("无数据this.stockserver");
          }

          // this.stockserver = JSON.parse(response.data);
          // for (let i = 0; i < this.stockserver.length; i++) {
          //   console.log(this.stockserver[i]);
          // }
          // console.log(this.stockserver, "this.stockserver");
          //   .replace(/\{|}/g, "")
          //   .replace(/\'/g, "")
          //   .split(", ");
          // const item = response.data.split(",");
          // this.optionals = response.data;
          // this.stockserver.forEach((item) => {
          //   this.ids.push(item);
          // });
        });
    },
  },
};
</script>

<style lang="scss">
.his_box {
  // -webkit-transform: rotate(-90deg);
  /*盒子*/
  // width: 400px;
  // height: 220px;
  // border: solid 1px #1E90FF;
  // position: relative;
  // width: 100%;
  // display: flex;

  // flex-direction: column;
  // justify-content: space-between;
}
.his_box > div {
  text-align: center;
}
.togram {
  /*直方图*/
  display: flex;
  flex-direction: column;
}
.togram > div {
  /*一条图块*/
  height: 3px;
  width: 70px; /*100%时的块宽度*/
  line-height: 4px;
  font-size: 4px;
  text-align: right;
  margin-bottom: 1px;
  display: flex;
}
.togram > div:nth-child(n + 2) div {
  /*图块颜色*/
  background-color: #ff009d;
}
.togram > div:nth-child(-n + 3) div {
  background-color: #03aa19;
}
.left {
  flex-grow: 0.1;
  position: relative;
  display: inline-block;
  background: #e20863;
  color: #fff;
  text-align: center;
  font-weight: bold;
  // width: 100%;
  font-size: 10px;
  line-height: 10px;
  height: 10px;
  min-width: 30px;
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
}
.boxx {
  //   flex-direction:column;
  //   justify-content: center;
  display: flex;
  // flex-direction:column;
  justify-content: space-around;
  width: 70px; /*100%时的块宽度*/
}

// 百分百的时候不显示该伪类
.item1 {
  width: 100%;
  height: 4px;
  background: rgb(241, 3, 162);
  border-bottom-right-radius: 15px;
  // border:1px solid deepskyblue;
  /*放大比例*/
  flex-grow: 0; /*默认0 不放大*/
}
.item2 {
  width: 100%;
  height: 4px;
  background: rgb(76, 0, 255);
  color: rgb(122, 122, 122);
  border-top-left-radius: 15px;
  // border:1px solid deepskyblue;
  /*放大比例*/
  flex-grow: 0; /*默认0 不放大*/
}

.settitle {
  font-size: 14px;
  color: azure;
}
.shuxie {
  // -webkit-writing-mode: vertical-rl;
  // writing-mode: vertical-rl;
  // color: white;
}
</style>