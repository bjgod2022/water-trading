<template>
  <div class="d3line" :id="id"></div>
</template>

<script>
import * as d3 from "d3";
export default {
  name: "d3line",
  props: {
    id: String,
    width: Number,
    height: Number,
    dataset: Array,
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      d3.select("#svg" + this.id).remove();
      let width = this.width ? this.width : 600;
      let height = this.height ? this.height : 600;
      let padding = {
        left: 80,
        right: 50,
        top: 50,
        bottom: 50,
      };
      let colorZ = d3.scaleOrdinal(d3.schemeDark2);
      let parseTime = d3.timeParse("%Y-%m-%d");
      let xScale = d3
        .scaleTime()
        .range([0, width - padding.left - padding.right]);
      let dates = this.dataset.flatMap((d) =>
        d.value.map((v) => parseTime(v.key))
      );
      xScale.domain([d3.min(dates), d3.max(dates)]);
      let yScale = d3
        .scaleLinear()
        .range([height - padding.top - padding.bottom, 0]);
      yScale.domain([
        0,
        d3.max(this.dataset.flatMap((d) => d.value.map((v) => v.value))) + 2,
      ]);
      let xAxis = d3
        .axisBottom(xScale)
        .tickFormat(
          (d) => d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate()
        );
      let yAxis = d3.axisLeft(yScale);
      let svg = d3
        .select("#" + this.id)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("id", "svg" + this.id);
      svg
        .append("g")
        .attr(
          "transform",
          "translate(" + padding.left + "," + (height - padding.bottom) + ")"
        )
        .call(xAxis)
        .selectAll("text")
        .attr("dx", -20)
        .attr("dy", 10)
        .attr("transform", "rotate(-20)")
        .style("font-weight", "bold");
      svg
        .append("g")
        .attr(
          "transform",
          "translate(" + padding.left + "," + padding.top + ")"
        )
        .call(yAxis)
        .selectAll("text")
        .style("font-weight", "bold");
      let line = d3
        .line()
        .x((d) => xScale(parseTime(d.key)))
        .y((d) => yScale(d.value));
      this.dataset.forEach((v, vi) => {
        let tp_x = 0,
          tp_y = 0;
        svg
          .append("path")
          .attr("d", line(v.value))
          .attr(
            "transform",
            "translate(" + padding.left + "," + padding.top + ")"
          )
          .attr("fill", "none")
          .attr("stroke", (d, i) => colorZ(vi))
          .attr("stroke-width", 2)
          .style("stroke-dasharray", function (d, i) {
            return d3.select(this).node().getTotalLength();
          })
          .style("stroke-dashoffset", function (d, i) {
            return d3.select(this).node().getTotalLength();
          })
          .transition()
          .duration(2000)
          .ease(d3.easePolyOut)
          .delay((d, i) => i * 200)
          .style("stroke-dashoffset", 0);
        svg
          .selectAll("circle1")
          .data(v.value)
          .enter()
          .append("circle")
          .attr("cx", (d, i) => {
            let x = xScale(parseTime(d.key));
            if (i === v.value.length - 1) tp_x = x - 40;
            return x;
          })
          .attr("cy", (d, i) => {
            let y = yScale(d.value);
            if (i === v.value.length - 1) tp_y = y - 10;
            return y;
          })
          .attr("r", 2)
          .attr(
            "transform",
            "translate(" + padding.left + "," + padding.top + ")"
          )
          .style("fill", (d, i) => colorZ(vi))
          .on("mouseover", (d, i) => {
            let g = svg
              .append("g")
              .attr("id", `hoverg${vi}${d.key}${d.value}`)
              .attr(
                "transform",
                "translate(" +
                  (xScale(parseTime(d.key)) - 20) +
                  "," +
                  (yScale(d.value) + 30) +
                  ")"
              );
            g.append("rect")
              .attr("x", function (d) {
                return this.parentNode.getBBox().x - 3;
              })
              .attr("y", function (d, i) {
                return this.parentNode.getBBox().y - 20;
              })
              .attr("width", 110)
              .attr("height", 25)
              .style("fill", "#fffbf0");
            g.append("text")
              .text(`${d.key}:${d.value}`)
              .style("fill", colorZ(vi));
          })
          .on("mouseout", (d) =>
            d3.select(`#hoverg${vi}${d.key}${d.value}`).remove()
          )
          .transition()
          .duration(1500)
          .ease(d3.easePolyIn)
          .delay((d, i) => i * 200)
          .attr("r", 5);
        // svg.selectAll('text1')
        //   .data([v.name])
        //   .enter()
        //   .append('text')
        //   .attr('dx', (d, i) => tp_x)
        //   .attr('dy', (d, i) => tp_y)
        //   .attr('transform', 'translate(' + padding.left + ',' + padding.top + ')')
        //   .text((d) => d)
        //   .style("fill", (d, i) => colorZ(vi))
        //   .style('font-weight', 'bold')
        svg
          .append("text")
          .attr("dx", tp_x)
          .attr("dy", tp_y)
          .attr(
            "transform",
            "translate(" + padding.left + "," + padding.top + ")"
          )
          .text(v.name)
          .style("fill", colorZ(vi))
          .style("font-weight", "bold");
      });
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