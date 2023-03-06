<template>
  <div class="gain-price" :class="comparePrice(bprice - optzs, 0)">
    <svg-icon
      icon-class="arrow-up"
      v-show="bprice - optzs > 0 ? true : false"
    />
    <svg-icon
      icon-class="arrow-down"
      v-show="bprice - optzs < 0 ? true : false"
    />

    {{ (((bprice - optzs) * 100) / yes).toFixed(2) }} %
  </div>
</template>

<script>
export default {
  props: {
    bprice: {
      type: Number,
      default: "Number",
    },
    bjdk: {
      type: Number,
      default: 0,
    },
    yes: {
      type: String,
      default: 0,
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
      optzs: 0, //
    };
  },
  created() {
    this.fetchzs();
  },
  mounted() {
    this.fetchzs();
  },
  watch: {
    bjdk: {
      handler(val) {
        this.fetchzs();
      },
    },
  },
  methods: {
    fetchzs() {
      if (this.bjdk * 1 > 0) {
        this.optzs = this.bjdk * 1;

        return this.optzs;
      }
    },
  },
};
</script>
<style>
.gain-price {
  font-weight: bold;
  text-align: center;
  font-size: 15px;
  line-height: 15px;
}
</style>
