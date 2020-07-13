<template>
    <div>
        <!--        面包屑导航-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>数据统计</el-breadcrumb-item>
            <el-breadcrumb-item>数据报表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <div id="main" style="width: 750px;height:400px;"></div>
        </el-card>
    </div>
</template>

<script>
    import echarts from "echarts"
    import {reqReports} from "network/api"
  export default {
    name: "Reports",
    data(){
      return {
        options:{

        }
      }
    },
    created(){


    },
    mounted() {
      this.getReports()

    },
    methods:{
      //获取统计信息
      async getReports(){
        const result = await reqReports()
        const options = {
          title: {
            text: '用户来源'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#E9EEF3'
              }
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              boundaryGap: false
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ]
        }
        Object.assign(this.options,options,result.data)
        this.options.xAxis[0].boundaryGap = false
        const myChart = echarts.init(document.getElementById('main'));
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(this.options);
      }
    }
  }
</script>

<style scoped>

</style>
