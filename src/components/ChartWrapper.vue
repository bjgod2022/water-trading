<template>
  <trading-vue
    :data="dataCube"
    :toolbar="true"
    :color-back="colors.colorBack"
    :color-grid="colors.colorGrid"
    :color-text="colors.colorText"
    :titleTxt="this.titleTxt"
    :overlays="overlays"
    :width="this.width"
    :height="this.height"
    ref="tvjs"
  ></trading-vue>
</template>

<script>
import { TradingVue, DataCube } from "trading-vue-js";
import Overlays from "tvjs-overlays";

export default {
  name: "ChartWrapper",
  props: {
    newData: Object,
    width: Number,
    height: Number,
  },
  components: {
    TradingVue,
  },
  data() {
    return {
      night: false,
      overlays: [Overlays["SMA"]],
      titleTxt: "",
    };
  },
  computed: {
    colors() {
      return this.night
        ? {}
        : {
            colorBack: "#fff",
            colorGrid: "#eee",
            colorText: "#333",
          };
    },
    dataCube() {
      return new DataCube(this.newData);
    },
  },
  watch: {
    newData: function (newVal, oldVal) {
      // Toolbar Disappears when data is loaded asynchronously
      // see https://github.com/tvjsx/trading-vue-js/issues/119
      this.$refs.tvjs.resetChart();
    },
  },
};
</script>

