<template>
  <div>
    <!-- {{ bgcode }} -->
    <!-- <svg-icon icon-class="hot" /> -->
    {{ boptbg }}
    <!-- <svg-icon :icon-class="boptbg" /> -->
    <svg-icon icon-class="bg-right" />
    {{ optbgb }}
    <!-- <svg-icon :icon-class="optbgb" /> -->
  </div>
</template>

<script>
export default {
  props: {
    bgcode: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      boptbg: "", //
      optbgb: "",
    };
  },
  created() {
    this.gozy();
  },
  mounted() {
    this.gozy();
  },
  //   watch: {
  //     bjdk: {
  //       handler(val) {
  //         this.fetchzs();
  //       },
  //     },
  //   },
  methods: {
    gozy() {
      var ids = [];
      //alert("hello");
      // this.$axios.get("/api/?code=" + this.bgcode).then((response) => {
      this.$axios
        .get(`http://127.0.0.1:2030/?code=${this.bgcode}`)
        .then((response) => {
          this.info = response;

          if (response.data != NaN) {
            this.stockserver = response.data
              .replace(/\{|}/g, "")

              .split("~");
            this.boptbg = this.stockserver[4].substr(2, 5);

            this.optbgb = this.stockserver[5].substr(2, 5);
          } else {
            console.log("无数据this.stockserver");
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

