<template>
  <section>
    <!-- {{ stock }} -->

    <!-- <tabs @click="onChange" :headers="headers" :active="active"> -->
    <!-- {{ charts }} -->

    <tab-item v-for="(chart, index) in charts" :key="index" v-show="active == index">
      <keep-alive>
        <kline-can :id="stock.code" :delay="0" v-if="active == index" :stock="stock" :klineType="chart.type">
        </kline-can>
        <!-- <a>{{this.stock }}我的天啊</a> -->
      </keep-alive>
    </tab-item>
    <!-- </tabs> -->
  </section>
</template>
<script>
import tabs from "../tabs/tabs.vue";
import tabItem from "../tabs/tab-item.vue";
import klineCan from "../kline/kline-can.vue";
import { KLINE_NAME_DAY, KLINE_MAP_DAY } from "@/config/";
export default {
  name: "hq-chart-can",
  components: {
    [tabs.name]: tabs,
    [tabItem.name]: tabItem,
    // [kline.name]: kline,
    klineCan,
  },
  props: {
    stock: Object,
  },
  data () {
    return {
      headers: [],
      charts: [],
      active: 0,
    };
  },
  mounted () {
    for (let k in KLINE_MAP_DAY) {
      this.headers.push(KLINE_NAME_DAY[KLINE_MAP_DAY[k]]);
      this.charts.push({
        type: KLINE_MAP_DAY[k],
      });
    }
  },
  methods: {
    onChange (index) {
      this.active = index;
    },
  },
};
</script>
<!-- <style lang="scss" scoped>

</style> -->