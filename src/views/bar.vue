<template>
  <el-popover placement="left" width="300" trigger="click">
    <p class="title-bar">股票：更新日期：</p>
    <div class="bar_box bartogram">
      <div class="graph" v-for="(item, index) in bs" :key="index">
        <div :id="id" :style="{ width: (item / bsmax) * 100 + '%' }">
          {{ item }}
        </div>
      </div>
    </div>
    <div class="barxx">
      <span
        class="item11"
        :style="{ width: (bin / (bin * 1 + bout * 1)) * 100 + '%' }"
        >{{ bin }}</span
      >
      <span
        class="item22"
        :style="{ width: (bout / (bin * 1 + bout * 1)) * 100 + '%' }"
        >{{ bout }}-》{{
          ((bin / (bin * 1 + bout * 1)) * 100).toFixed(2)
        }}%</span
      >
    </div>
    <div slot="reference">
      <div class="his_box histogram">
        <div class="graph" v-for="(item, index) in bs" :key="index">
          <div :id="id" :style="{ width: (item / bsmax) * 100 + '%' }">
            {{ item }}
          </div>
        </div>
      </div>
      <div class="boxx">
        <span
          class="item1"
          :style="{ width: (bin / (bin * 1 + bout * 1)) * 100 + '%' }"
        ></span>
        <span
          class="item2"
          :style="{ width: (bout / (bin * 1 + bout * 1)) * 100 + '%' }"
        ></span>
      </div>
    </div>
  </el-popover>
</template>
<script>
export default {
  props: {
    //     stockCode: {
    //         type: String
    //     },
    //     className: {
    //         type: String,
    //         default: 'chart'
    //     },
    id: {
      type: String,
      default: "chart",
    },
    bs: {
      type: Array,
      default: "Array",
    },
    bsmax: {
      type: Number,
      default: "Number",
    },
    bin: {
      type: String,
      default: "Array",
    },
    bout: {
      type: String,
      default: "Number",
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
};
</script>

<style lang="scss">
.his_box {
  /*盒子*/
  // width: 400px;
  // height: 220px;
  // border: solid 1px #1E90FF;
  // position: relative;
  // width: 100%;
  display: flex;

  flex-direction: column;
  justify-content: space-between;
}
.his_box > div {
  text-align: center;
}
.histogram {
  /*直方图*/
  display: flex;
  flex-direction: column;
}
.histogram > div {
  /*一条图块*/
  height: 3px;
  width: 70px; /*100%时的块宽度*/
  line-height: 4px;
  font-size: 4px;
  text-align: right;
  margin-bottom: 1px;
  display: flex;
}
.histogram > div:nth-child(n + 4) div {
  /*图块颜色*/
  background-color: #ff009d;
}
.histogram > div:nth-child(-n + 5) div {
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
  background: rgb(74, 3, 241);
  border-bottom-right-radius: 15px;
  // border:1px solid deepskyblue;
  /*放大比例*/
  flex-grow: 0; /*默认0 不放大*/
}
.item2 {
  width: 100%;
  height: 4px;
  background: rgb(255, 0, 0);
  border-top-left-radius: 15px;
  // border:1px solid deepskyblue;
  /*放大比例*/
  flex-grow: 0; /*默认0 不放大*/
}

// 弹框ui
.bar_box {
  /*盒子*/
  // width: 400px;
  // height: 220px;
  // border: solid 1px #1E90FF;
  // position: relative;
  // width: 100%;
  display: flex;

  flex-direction: column;
  justify-content: space-between;
}
.bar_box > div {
  text-align: center;
}
.bartogram {
  /*直方图*/
  display: flex;
  flex-direction: column;
}
.bartogram > div {
  /*一条图块*/
  height: 25px;
  width: 300px; /*100%时的块宽度*/
  line-height: 25px;
  font-size: 20px;
  text-align: left;
  margin-bottom: 1px;
  color: #fff;
  display: flex;
}
.bartogram > div:nth-child(n + 4) div {
  /*图块颜色*/
  background-color: #ff009d;
}
.bartogram > div:nth-child(-n + 5) div {
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
.barxx {
  //   flex-direction:column;
  //   justify-content: center;
  display: flex;
  // flex-direction:column;
  justify-content: space-around;
  width: 300px; /*100%时的块宽度*/
}

// 百分百的时候不显示该伪类
.item11 {
  width: 100%;
  height: 25px;
  background: rgb(74, 3, 241);
  //   border-bottom-right-radius: 15px;
  // border:1px solid deepskyblue;
  /*放大比例*/
  flex-grow: 0; /*默认0 不放大*/
  font-size: 14px;
  color: #fff;
}
.item22 {
  width: 100%;
  height: 25px;
  background: rgb(255, 0, 0);
  font-size: 14px;
  //   border-top-left-radius: 15px;
  // border:1px solid deepskyblue;
  /*放大比例*/
  flex-grow: 0; /*默认0 不放大*/
  color: #fff;
}
.title-bar {
  font-size: 16px;
  color: #fff;
}
</style>