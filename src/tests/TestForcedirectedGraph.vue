<template>
  <div id="app">
    <ForcedirectedGraph>
          
    </ForcedirectedGraph>
  </div>
</template>

<script>
//import HelloWorld from './components/HelloWorld.vue'
import ForcedirectedGraph from '../components/ForcedirectedGraph/ForcedirectedGraph.vue';
import * as d3 from "d3";
import _ from 'lodash';

export default {
  name: 'app',
  data: function() {
    return {
      
    }
  },
  components: {
    ForcedirectedGraph
  }
}
</script>

<style lang="scss" scoped>
#app {
  width: 500px;
  height: 200px;
}
</style>
