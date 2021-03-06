<template>
    <div>
        <!-- <button @click="transition()">Update</button> -->
        <svg width="950" height="500"></svg>
    </div>
</template>

<script>
import * as d3 from 'd3'

export default {
    name: "StreamGraph",
    data () {
        return {
           layers0: null,
           layers1: null
        }
    },
    mounted () {
        var n = 20, // number of layers 层的总数
            m = 200, // number of samples per layer 每层的样本数目
            k = 10; // number of bumps per layer  每层的颠簸总数

        // d3.stack()用来生成一个新的堆栈生成器
        // stack.keys(d3.range(n))用来生成一个以0到n-1为主键的堆栈生成器
        // stack.offset(),默认情况下stacked series的baseline为0，
        // 然而我们也可以配置stack generator的offset来达到不同的baseline效果。这里设置的offset为
        // d3.stackOffsetWiggle 是专门用于流图，设置流图堆栈的offset,通过移动基线来减少层的加权摆动
        var stack = d3.stack().keys(d3.range(n)).offset(d3.stackOffsetWiggle),

        // bumps(m, k)用来返回颠簸k次的长度为m的数组
        // d3.range(n).map(function() { return bumps(m, k); })用来生成n*m的矩阵
        // d3.transpose()用来对生成的n*m的矩阵进行转置
        // 因此layers0用来存储堆栈布局后的数据，其中有n个系列，每个系列有m个数据点，每个数据点
        // 有一个最低点和顶点值，形如[lower,upper]这样的形式，lower和upper分别用来定义基线和顶线
        layers0 = stack(d3.transpose(d3.range(n).map(function() { return bumps(m, k); }))),

        
        //layers1和layers0的计算方法一样，但是值由于随机函数的影响，会有所不同，这里计算layers1
        // 主要是用来显示左上角“update”按钮对应的切换效果
        layers1 = stack(d3.transpose(d3.range(n).map(function() { return bumps(m, k); }))),

        // 将layers1和layers0两个矩阵连接起来
        layers = layers0.concat(layers1);

        // 获取svg元素
        var svg = d3.select("svg"),
            width = +svg.attr("width"),
            height = +svg.attr("height");

        // 定义x轴比例尺
        var x = d3.scaleLinear()
            // 定义定义域
            .domain([0, m - 1])

            // 定义值域
            .range([0, width]);

        // 定义y轴比例尺
        var y = d3.scaleLinear()
            // 定义定义域
            .domain([d3.min(layers, stackMin), d3.max(layers, stackMax)])
            // 定义值域
            .range([height, 0]);

        // 定义一个感知彩虹颜色函数z()
        var z = d3.interpolateCool;

        // d3.area()是一个区域生成器,区域通过两条线来界定
        // d3.area().y0()定义了base line;
        // d3.area().y1()定义了top line;
        // d3.area().x()定义了x坐标,其中base line和top line使用的是相同的x坐标
        var area = d3.area()
            .x(function(d, i) { return x(i); })
            .y0(function(d) { return y(d[0]); })
            .y1(function(d) { return y(d[1]); });

        // 绘制面积区域，通过path元素来绘制
        svg.selectAll("path")
            // 绑定数据
            .data(layers0)
            .enter().append("path")
                // 通过area()函数来为path元素生成绘制所需的数据
                .attr("d", area)
                // 设置填充色，通过z()颜色函数来获取
                .attr("fill", function() { return z(Math.random()); });

        // 获取堆栈数据矩阵的最大值
        function stackMax(layer) {
            // 这里取d[1]，是因为对于每个点d来说，d[1]大于d[0],因为d[0]是低点、d[1]是高点
            return d3.max(layer, function(d) { return d[1]; });
        }

        // 获取堆栈数据矩阵的最小值
        function stackMin(layer) {
            // 这里取d[0]，是因为对于每个点d来说，d[0]小于d[1],因为d[0]是低点、d[1]是高点
            return d3.min(layer, function(d) { return d[0]; });
        }


        // Inspired by Lee Byron’s test data generator.
        // 该方法用于生成长度为n的数组，其中通过m次颠簸，即调用dump(a,n)方法来变换a数组,最终返回变换后的a数组
        function bumps(n, m) {
            var a = [], i;
            for (i = 0; i < n; ++i) a[i] = 0;
            for (i = 0; i < m; ++i) bump(a, n);
            return a;
        }

        // 该方法通过一定的随机数的运算来变换数组a的值
        function bump(a, n) {
            var x = 1 / (0.1 + Math.random()),
                y = 2 * Math.random() - 0.5,
                z = 10 / (0.1 + Math.random());
            for (var i = 0; i < n; i++) {
                var w = (i / n - y) * z;
                a[i] += x * Math.exp(-w * w);
            }
        }

    },
    methods:{
        // 定义左上角 “update”按钮的动作动画
        transition() {
            var t;
            // 获取path元素，并在一定的持续时间内重新绘制
            d3.selectAll("path")
                // 这里绑定的数据t，是layers1和layers0之间相互切换
                .data((t = this.layers1, this.layers1 = this.layers0, this.layers0 = t))
                .transition()
                // 动画过渡持续时间
                .duration(2500)
                // 动画最终到达的状态，这里的area是切换后的数据所计算的新的值
                .attr("d", area);
        }
    }
}
</script>
<style scoped>
    svg {
        border: 1px solid #ccc;
    }
</style>
<style>
    button {
        position: absolute;
        left: 10px;
        top: 10px;
    }

</style>




