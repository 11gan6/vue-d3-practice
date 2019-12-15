<template>
    <div>
        <!-- <button @click="transition()">Update</button> -->
        <svg width="950" height="500"></svg>
    </div>
</template>

<script>
import * as d3 from 'd3'

export default {
    name: "SankeyDigram",
    data () {
        return {
            data:{
                'nodes': [
                    {name: "0"},
                    {name: "1"},
                    {name: "2"},
                    {name: "3"},
                    {name: "4"},
                    {name: "5"},
                    {name: "6"},
                    {name: "7"},
                    {name: "8"}
                ],
                'links': [
                    {source: 0, target: 3, value: 10},
                    {source: 1, target: 4, value: 10},
                    {source: 2, target: 4, value: 5},
                    {source: 1, target: 5, value: 5},
                    {source: 3, target: 6, value: 5},
                    {source: 3, target: 7, value: 5},
                    {source: 4, target: 7, value: 10},
                    {source: 4, target: 8, value: 5},
                    {source: 5, target: 8, value: 5}
                ]
            }
        }
    },
    mounted () {
        // 定义桑基布局
        var sankey = d3.sankey()
                .nodeWidth(80) 
                .nodePadding(40) 
                .size([width, height]) 
                .nodes(this.data.nodes)  
                .links(this.data.links)
                .layout(3);

        // 路径数据生成器
        var path = sankey.link();

        // 绘制连接数据
        var links = svg.append("g").selectAll("path")
                    .data(data.links)
                    .enter()

        // 绑定节点数据
        var nodes = svg.append("g").selectAll(".node")
                        .data(data.nodes)
                        .enter();

        // 绘制连接线
        links.append("path")
            .attr({
                fill: "none",   //填充色
                stroke: function(d,i){ return color(i); },  //描边色
                "stroke-opacity": 0.5,  //描边透明度
                d: path,  //路径数据
                id: function(d,i){ return 'link' +i }  //ID
            })
            .style("stroke-width", function (d) {  //连线的宽度
                return Math.max(1, d.dy);
            });

        // 绘制节点文本
        nodes.append("text")
            .attr({
                x: function (d) { return d.x+sankey.nodeWidth() / 2; },
                y: function (d) { return d.y+d.dy / 2; }
            })
            .text(function (d) { return d.name; }); 

        // 绘制连接文本
        links.append('text')
                .append('textPath')
                .attr('xlink:href', function (d,i) { return '#link' + i; })
                .attr('startOffset','50%')
                .text(function (d) { return '流量:' + d.value; })

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
    path:hover{
        stroke-opacity: 0.9;
    }
</style>




