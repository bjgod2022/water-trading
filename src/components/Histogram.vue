 <!--
   d3组件：柱状图
   属性说明：
    id：必填，如果同一页面引用多个柱状图，请设置不同的id
    width：选填，默认600
    height：选填，默认600
    begincolor：选填，柱状图渐变色的起始颜色，默认绿色
    endcolor：选填，柱状图渐变色的结束颜色，默认蓝色
    selectcolor：选填，鼠标滑过柱状图时显示的颜色，默认蓝色
    dataset：必填，数据
      数据格式：
         [
           {'name': '北京', value: 40},
           {'name': '厦门', value: 200},
           {'name': '大兴安岭', value: 97},
           {'name': '苏州', value: 10}
         ]
    rotate：选填，当x轴文字过长，可设置此值为true让文字旋转，默认不旋转
    onRectClick: 选填，点击柱状图的自定义事件
 -->
 
 <template>
  <div class="histogram" :id="id"></div>
</template>
  
  <script>
import * as d3 from "d3";
function noop(d, i) {
  // console.log(d)
  // console.log(i)
}
export default {
  name: "histogram",
  props: {
    id: String,
    Number,
    height: Number,
    begincolor: String,
    endcolor: String,
    selectcolor: String,
    dataset: Array,
    rotate: Boolean,
    onRectClick: {
      type: Function,
      default: noop,
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      d3.select("#svg" + this.id).remove();
      let width = this.width ? this.width : 600;
      let height = this.height ? this.height : 600;
      let svg = d3
        .select("#" + this.id)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("id", "svg" + this.id);
      let begincolor = this.begincolor ? this.begincolor : "steelblue";
      let endcolor = this.endcolor ? this.endcolor : "green";
      let selectcolor = this.selectcolor ? this.selectcolor : "steelblue";
      let linecolorid = "linecolor" + this.id;
      let linearGradient = svg
        .append("defs")
        .append("linearGradient")
        .attr("id", linecolorid)
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "0%")
        .attr("y2", "100%");
      linearGradient
        .append("stop")
        .attr("offset", "0%")
        .attr("style", "stop-color:" + begincolor + "; stop-opacity:1");
      linearGradient
        .append("stop")
        .attr("offset", "100%")
        .attr("style", "stop-color:" + endcolor + "; stop-opacity:1");
      let gwidth = width - 100;
      let gheight = height - 100;
      let values = this.dataset.map((d) => d.value);
      let xScale1 = d3
        .scaleBand()
        .range([0, gwidth])
        .domain(this.dataset.map((d) => d.name));
      let yScale1 = d3
        .scaleLinear()
        .domain([0, d3.max(values)])
        .range([gheight, 0]);
      let xAxis = d3.axisBottom().scale(xScale1);
      let yAxis = d3.axisLeft().scale(yScale1);
      let xScale = d3
        .scaleBand()
        .domain(d3.range(this.dataset.length))
        .rangeRound([0, gwidth])
        .round(0.05);
      let yScale = d3
        .scaleLinear()
        .domain([0, d3.max(values)])
        .range([0, gheight]);
      svg
        .selectAll("rect")
        .data(values)
        .enter()
        .append("rect")
        .attr("x", (d, i) => 60 + xScale(i))
        .attr("width", xScale.bandwidth() - 1)
        .attr("y", 50 + gheight)
        .attr("height", 0)
        .attr("fill", "red")
        .on("click", this.onRectClick)
        // .on("click", function(d, i) {
        //   d3.select(this)
        //     .transition()
        //     .duration(1000)
        //     .ease(d3.easeBounce)
        //     .attr("fill", "green");
        // })
        .on("mouseover", function (d, i) {
          d3.select(this)
            // .transition(d)
            // .duration(200)
            // .ease(d3.easeBounce)
            .attr("fill", selectcolor);
        })
        .on("mouseout", function (d, i) {
          d3.select(this)
            // .transition(d)
            // .duration(200)
            // .ease(d3.easeBounce)
            .attr("fill", "url(#" + linecolorid + ")");
        })
        .transition()
        .duration(1500)
        .ease(d3.easeBounce)
        .delay((d, i) => i * 200)
        .attr("y", (d) => 50 + gheight - yScale(d))
        .attr("height", yScale)
        .attr("fill", "url(#" + linecolorid + ")");

      svg
        .selectAll("text")
        .data(values)
        .enter()
        .append("text")
        .attr("x", (d, i) => 60 + xScale(i))
        .attr("y", (d) => 50 + gheight - yScale(d))
        .attr("dx", xScale.bandwidth() / 4)
        .attr("dy", 15)
        .attr("text-anchor", "begin")
        .attr("font-size", () => {
          if (width > 400) return 14;
          else return 10;
        })
        .attr("fill", "white")
        .transition()
        .delay(2000)
        .text((d) => d);

      let xvalues = svg
        .append("g")
        .attr("transform", "translate(60, " + (gheight + 50) + ")")
        .call(xAxis);

      if (this.rotate) {
        xvalues
          .selectAll("text")
          .attr("dx", -30)
          .attr("dy", 10)
          .attr("transform", "rotate(-30)");
      }

      svg.append("g").attr("transform", "translate(60, 50)").call(yAxis);

      // if (this.width && this.height) {
      //   svg.attr("width", this.width)
      //     .attr("height", this.height)
      //     .attr("viewBox", "0 0 600 600");
      // }
    },
  },
  watch: {
    dataset() {
      this.init();
    },
  },
};
</script>
  
  <style>
</style>