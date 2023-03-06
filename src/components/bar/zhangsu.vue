<template>
  <div>
    {{ fudu }}%
    <div class="box-zhuangsu">
      <!-- <svg-icon
        icon-class="stock-up"
        style="font-size: 14px !important"
        v-show="fudu > 0 ? true : false"
      />
      <svg-icon
        icon-class="stock-down"
        style="font-size: 14px !important"
        v-show="fudu < 0 ? true : false"
      /> -->
      <div class="left-zhuangsu" v-if="fudu < 0">
        <!-- <div class="title">{{ item.ad.title }}</div> -->
        <div class="left-zhuangsu" v-if="fudu + 10 < 0">
          <div
            class="leftjin-zhuangsu"
            :style="{ width: 0 - fudu * 10 - 100 + '%' }"
          ></div>
          <div class="leftjin-zhuangsu" :style="{ width: 100 + '%' }"></div>
        </div>
        <div class="left-zhuangsu" v-else>
          <div
            class="leftjin-zhuangsu"
            :style="{ width: 0 - fudu * 10 + '%' }"
          ></div>
        </div>
      </div>
      <!-- <div v-if="fudu + 10 < 0"></div>
        <div v-else></div> -->
      <div class="right-zhuangsu" v-else>
        <div v-if="fudu - 10 > 0">
          <div
            class="rightjin-zhuangsu"
            :style="{ width: fudu * 10 - 100 + '%' }"
          ></div>
          <div class="rightjin-zhuangsu" :style="{ width: 100 + '%' }"></div>
        </div>
        <div v-else>
          <div
            class="rightjin-zhuangsu"
            :style="{ width: fudu * 10 + '%' }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    fudu: {
      type: Number,
      default: 0,
    },
    fudu2: {
      type: Number,
      default: 12,
    },
  },
};
</script>
<style>
</style>
