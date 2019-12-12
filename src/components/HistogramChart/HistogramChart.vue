<template>
  <div class="Histogram-root">
    <svg width="100%" height="100%" ref="svg">
      <g>
        <template v-for="(value, index) in bins">
          <rect :key="'rect'+index"/>
        </template>
      </g>

      <g ref="brushG" @click="handleClick"/>

      <template>
        <g ref="xAxis" />
        <g ref="yAxis" />
      </template>
      <!-- <line v-show="!isDisplayAxis" ref="line"></line> -->
    </svg>
  </div>
</template>

<script>
import * as d3 from "d3";
import _ from 'lodash';

export default {
  name: "HistogramChart",
  data: function() {
    return {
      margin: {
        top: 20,
        right: 20,
        bottom: 35,
        left: 30
      },
      isMounted: false,
      selection: [],
      brushedBins: [],
      clickedBin: undefined,
      disableClick: false
    };
  },
  props: {
    data: { //dataset
      type: Array,
      default: () => []
    },
    encoding: {
      type: Object
    }
  },
  computed: {
    fullEncoding() {
      const defaultEncoding = {
        x: 'Name of the horizontal axis',
        xType: 'numeric',
        count: 5,
        color: '#4e79a7',
        selectionColor: '#3fca2f'      
      };
      return _.merge(defaultEncoding, this.encoding);
    },
    scaleX() { //scale of xAxis
      const bins = this.bins;
      const margin = this.margin;
      const width = this.width;

      let left = margin.left;
      let right = width - margin.right;

      console.log(left, right);

      return d3.scaleBand()
        .domain(bins.map(d => d.name))
        .rangeRound([left, right]);
    },
    bins() { //parse dataset
      const data = this.data;
      const binCount = this.fullEncoding.count;

      const attr = this.fullEncoding.x;

      const res = [];
      const max = d3.max(this.data, d => d[attr]);
      const min = d3.min(this.data, d => d[attr]);

      if (this.fullEncoding.xType === 'numeric') {

        const dif = (max - min) / binCount;
        for(let i=1;i<=binCount-1;i++){
          res.push(min + dif * i);
        }

        const result = d3
          .histogram()
          .value(d => d[attr])
          .thresholds(res)(data);

        result.forEach(d => d.name = `${d.x0}-${d.x1}`)

        return result;

      } else {

        const set = new Set(data.map(d => d[attr]));
        const values = Array.from(set);
        values.sort();

        const valueMap = {};
        values.forEach((d, i) => valueMap[d] = i);

        const result = values.map(d => []);
        result.forEach((d, i) => d.name = values[i])

        data.forEach(d => result[valueMap[d[attr]]].push(d))
        
        return result;

      }
    },
    width() { //get svg width

      if (!this.isMounted) {
        return;
      }

      return this.$refs.svg.getBoundingClientRect().width;
    },
    height() { //get svg height

      if (!this.isMounted) {
        return;
      }

      return this.$refs.svg.getBoundingClientRect().height;
    },
    scaleY() { //scale of yAxis
      const bins = this.bins;
      const margin = this.margin;
      const height = this.height;

      return d3
        .scaleLinear()
        .domain([0, d3.max(bins, d => d.length)])
        .nice()
        .range([height - margin.bottom, margin.top]);
    },
    getSvg() { //get svg element
      const svg = this.$refs.svg;
      return svg;
    },
    getRect() { //get all rects
      const svg = this.$refs.svg;
      return d3.select(svg).selectAll("rect");
    },
    brushListener() { //listener of brush event
      const width = this.width;
      const height = this.height;
      const margin = this.margin;
      const brushended = this.brushended;

      let left = margin.left;
      let top = margin.top;
      let right = width - margin.right;
      let bottom = height - margin.bottom;

      return d3
        .brushX()
        .extent([
          [left, top],
          [right, bottom]
        ])
        .on("end", brushended);
    }
  },
  methods: {
    brushended() { //brush event handler
      const x = this.scaleX;
      const selection = d3.event.selection;
      const brush = this.brushListener;
      // window.console.log(selection)
      //window.console.log(d3.event.sourceEvent instanceof MouseEvent)
      if (!(d3.event.sourceEvent instanceof MouseEvent)) return;

      if (!selection) {
        this.selection = null;
        this.brushedBins = [];
        this.disableClick = false;
        console.log('cancel brushing');
        return;
      }

      this.clickedBin = undefined;
      this.disableClick = true;

      // console.log('brushing', selection);

      const bins = this.bins;
      const minRange = x(bins[0].name);
      const band = x.bandwidth();

      const x0 = Math.floor((selection[0] - minRange) / band);
      const x1 = Math.ceil((selection[1] - minRange) / band);

      // window.console.log([x0, x1])
      const res = [x(bins[x0].name), x(bins[x0].name) + (x1 - x0)*band];

      // bins.forEach(d => console.log(x(d.name)));

      const selected = _.concat.apply(null, bins.slice(x0, x1));
      this.selection = selected;
      this.brushedBins = bins.slice(x0, x1).map(d => d.name);

      // console.log("selected elements", this.selection);
      // console.log("brushed bins", this.brushedBins)

      //window.console.log(d3.select(this))
      const brushG = this.$refs.brushG;
      d3.select(brushG)
        .transition()
        .call(brush.move, res);
    },
    drawRect() { //draw all rects
      const bins = this.bins;
      const x = this.scaleX;
      const y = this.scaleY;
      const color = this.fullEncoding.color;
      const rect = this.getRect;

      rect
        .data(bins)
        .attr("x", d => x(d.name))
        .attr("y", d => y(d.length))
        .attr("width", x.bandwidth())
        .attr("height", function(d) {
          //window.console.log(d)
          return y(0) - y(d.length);
        })
        .attr("fill", color)
    },
    drawAxis() { //draw axis

      const xAxis = this.$refs.xAxis;
      //window.console.log(xAxis)
      xAxis.innerHTML = ""
      const yAxis = this.$refs.yAxis;
      yAxis.innerHTML = ""

      const x = this.scaleX;
      const y = this.scaleY;
      const width = this.width;
      const height = this.height;
      const margin = this.margin;
      //const svg = this.getSvg;
      //window.console.log(svg);
      //window.console.log(margin, height);
          
      //const rect = this.getRect
      const bins = this.bins
      const xDisplay = this.fullEncoding.x;
      const yDisplay = 'Count';
      //window.console.log('x',xDisplay,'y',yDisplay)

      const set = new Set();
      //const bins = this.bins;

      for(let i=0;i<bins.length;i++){
          set.add(bins[i].x0);
          set.add(bins[i].x1);
      }
      //window.console.log(set)
      const values = Array.from(set);
      //window.console.log(values)

      let xAxisd3;

      if (this.fullEncoding.xType === 'numeric') {
        xAxisd3 = d3
          .axisBottom(
            d3.scaleLinear()
            .domain([bins[0].x0, bins[bins.length - 1].x1])
            .range(x.range())
          )
          .ticks(bins.length)
          .tickValues(values)
          .tickFormat((d => `${d.toFixed(2)}`))
      } else {
        xAxisd3 = d3.axisBottom(x)
        .ticks(bins.length);
      }
      
      d3.select(xAxis)
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(xAxisd3)
        .call(g =>
          g
            .append("text")
            .attr("x", width)
            .attr("y", 30)
            .attr("fill", "#000")
            .attr("font-weight", "bold")
            .attr("text-anchor", "end")
            .text(xDisplay)
        );

      //window.console.log(yAxis)
      d3.select(yAxis)
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y))
        .call(g =>
          g
            .append("text")
            .attr("x", 0)
            .attr("y", 10)
            .attr("fill", "#000")
            .attr("font-weight", "bold")
            .attr("text-anchor", "start")
            .text(yDisplay)
        );
    },
    colorRect() { //change the color of the selected rects
      const color = this.fullEncoding.color;
      const selectionColor = this.fullEncoding.selectionColor;
      const rect = this.getRect;
      const selectedBins = this.brushedBins.slice(0);
      if (this.clickedBin)
        selectedBins.push(this.clickedBin);

      rect.attr('fill', d => selectedBins.includes(d.name) ? selectionColor : color);
    },
    handleClick(event) {
      if (this.disableClick)
        return;

      const clickX = event.layerX;

      const x = this.scaleX;
      const minRange = x.range()[0];
      const band = x.bandwidth();

      const binIndex = Math.floor((clickX - minRange) / band);
      if (binIndex >= this.bins.length) {
        this.selection = [];
        this.clickedBin = undefined;
        return;
      }

      const bins = this.bins;
      this.selection = bins[binIndex];
      this.clickedBin = bins[binIndex].name;
      this.brushedBins = [];
    }
  },
  mounted() {
    //window.console.log("bins", this.bins);
    this.isMounted = true;
    //window.console.log(this.$refs)
    this.drawRect();
    this.drawAxis();
    const brushG = this.$refs.brushG;
    //window.console.log(brushG)
    const brushListener = this.brushListener;
    d3.select(brushG).call(brushListener);
  },
  watch: {
    selection: function () { //highlight the selected rect
      this.colorRect();
      this.$emit('selectionUpdate', this.selection)
    },
    data: function () {
      this.drawRect();
      this.drawAxis();
      this.selection = [];
      const brush = this.brushListener;
      const brushG = this.$refs.brushG;
      d3.select(brushG)
        .transition()
        .call(brush.clear);
    },
    encoding: {
      handler: function () {
        this.drawRect();
        this.drawAxis();
        const brush = this.brushListener;
        const brushG = this.$refs.brushG;
        d3.select(brushG)
          .call(brush.clear);      
      },
      deep: true
    }
  }
};
</script>

<style scoped>
.Histogram-root {
  position: relative;
  width: 100%;
  height: 100%;
  -moz-user-select: none;
  -o-user-select: none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>