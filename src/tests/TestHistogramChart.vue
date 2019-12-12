<template>
  <div id="app">
    <HistogramChart :data="numericDataset" :encoding="numericEncoding">
          
    </HistogramChart>
    <HistogramChart :data="categoryDataset" :encoding="categoryEncoding">
          
    </HistogramChart>
  </div>
</template>

<script>
//import HelloWorld from './components/HelloWorld.vue'
import HistogramChart from '../components/HistogramChart/HistogramChart.vue';
import * as d3 from "d3";
import _ from 'lodash';

export default {
  name: 'app',
  data: function() {
    return {
      numericDataset: d3.range(20).map((d, i) => ({ Unemployment: Math.random(), id: i})),
      categoryDataset: d3.range(20).map((d, i) => ({ Alphabet: _.sample(['a', 'b', 'c', 'd', 'e', 'f', 'g']), id: i })),
      numericEncoding: {
        x: 'Unemployment',
        y: 'Countries',
        count: 7
      },
      categoryEncoding: {
        x: 'Alphabet',
        xType: 'ordinal'
      }
    }
  },
  components: {
    HistogramChart
  }
}
</script>

<style lang="scss" scoped>
#app {
  width: 500px;
  height: 200px;
}
</style>
