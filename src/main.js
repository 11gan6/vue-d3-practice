import Vue from 'vue'
// import App from './tests/TestExample.vue'
// import App from './tests/TestPatternGlyph.vue'
// import App from './tests/TestHeatChart1D.vue'
// import App from './tests/TestHeatChartMatrix.vue'
// import App from './tests/TestHeatChart1DRadial.vue'
// import App from './tests/TestLineChart.vue'
// import App from './tests/TestGeoMap.vue'
// import App from './tests/TestHistogramChart.vue'
// import App from './tests/TestForcedirectedGraph.vue';
// import App from './tests/TestStreamGraph.vue';
import App from './tests/App.vue';
import HistogramChart from './components/HistogramChart/HistogramChart.vue';
import ForcedirectedGraph from './components/ForcedirectedGraph/ForcedirectedGraph.vue';
import StreamGraph from './components/StreamGraph/StreamGraph.vue';
import SankeyDigram from './components/SankeyDigram/SankeyDigram.vue';
import VueRouter from 'vue-router'

Vue.use(VueRouter)
// Vue.use(ForcedirectedGraph)
Vue.config.productionTip = false

// Vue.component(HistogramChart.name, HistogramChart);
// Vue.component(ForcedirectedGraph.name, ForcedirectedGraph);
// Vue.component(StreamGraph.name, StreamGraph);

//安装插件
Vue.use(VueRouter);//挂载属性

//创建路由对象并配置路由规则
let router = new VueRouter({
    //routes
    routes: [
    //一个个link对象
    {
        path: '/',
        components: { // key => value
            HistogramChart: HistogramChart,
            default: HistogramChart, //默认省略不写name的情况
            ForcedirectedGraph: ForcedirectedGraph,
            StreamGraph: StreamGraph,
            SankeyDigram: SankeyDigram
        }
    }

  ]
});

new Vue({
  //让vue知道我们的路由规则
  router:router,//可以简写为router
  render: h => h(App),
}).$mount('#app')

// new Vue({
//   render: h => h(Dpp),
// }).$mount('#app1')

// new Vue({
//   render: h => h(Dpp),
// }).$mount('#app1')

// 即
// render: function (createElement) {
//   return createElement(App);
// }

// 这个函数的作用就是生成一个 VNode节点，
// render 函数得到这个 VNode 节点之后，
// 返回给 Vue.js 的 mount 函数，
// 渲染成真实 DOM 节点，并挂载到根节点上。
