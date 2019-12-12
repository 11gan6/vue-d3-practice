import Vue from 'vue'
// import App from './tests/TestExample.vue'
// import App from './tests/TestPatternGlyph.vue'
// import App from './tests/TestHeatChart1D.vue'
// import App from './tests/TestHeatChartMatrix.vue'
// import App from './tests/TestHeatChart1DRadial.vue'
// import App from './tests/TestLineChart.vue'
// import App from './tests/TestGeoMap.vue'
// import App from './tests/TestHistogramChart.vue'
import App from './tests/TestForcedirectedGraph.vue';
// Vue.use(ForcedirectedGraph)
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')

// 即
// render: function (createElement) {
//   return createElement(App);
// }

// 这个函数的作用就是生成一个 VNode节点，
// render 函数得到这个 VNode 节点之后，
// 返回给 Vue.js 的 mount 函数，
// 渲染成真实 DOM 节点，并挂载到根节点上。
