<template>
  <div id="app">
    <SankeyDiagram>
          
    </SankeyDiagram>
  </div>
</template>

<script>
//import HelloWorld from './components/HelloWorld.vue'
import SankeyDiagram from '../components/SankeyDiagram/SankeyDiagram.vue';
import * as d3 from "d3";
import _ from 'lodash';

export default {
  name: 'app',
  data: function() {
    return {
      
    }
  },
  components: {
    SankeyDiagram
  }
}
</script>

<style lang="scss" scoped>
#app {
  width: 500px;
  height: 200px;
}
</style>
