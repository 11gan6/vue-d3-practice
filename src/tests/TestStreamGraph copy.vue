<template>
  <div id="app">
    <StreamGraph>
          
    </StreamGraph>
  </div>
</template>

<script>
//import HelloWorld from './components/HelloWorld.vue'
import StreamGraph from '../components/StreamGraph/StreamGraph.vue';
import * as d3 from "d3";
import _ from 'lodash';

export default {
  name: 'app',
  data: function() {
    return {
      
    }
  },
  components: {
    StreamGraph
  }
}
</script>

<style lang="scss" scoped>
#app {
  width: 500px;
  height: 200px;
}
</style>
