import StreamGraph from './StreamGraph.vue'

// 注册 ForcedirectedGraph
StreamGraph.install = (Vue) => {
    Vue.component(StreamGraph.name, StreamGraph)
}

// 返回一个Vue的子类，既然是子类，就没有办法直接通过他使用Vue原型上的方法，
// 所以需要new一个实例出来使用。

// 在全局注册了一个组件
export default StreamGraph

