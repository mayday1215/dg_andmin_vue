<template>
    <div>
        <!--        面包屑导航-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片-->
        <el-card>
            <el-row>
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="paramsInfo.query" class="input-with-select">
                        <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
                    </el-input>
                </el-col>
            </el-row>

            <el-table :data="orderList" style="width: 100%" border>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="order_number" label="订单号"></el-table-column>
                <el-table-column prop="order_price" label="订单价格"></el-table-column>
                <el-table-column prop="pay_status" label="是否付款">
                   <template slot-scope="data">
                       <el-tag type="success" v-if="data.row.pay_status === '1'">已付款</el-tag>
                       <el-tag type="danger" v-else>未付款</el-tag>
                   </template>
                </el-table-column>
                <el-table-column prop="is_send" label="是否发货"></el-table-column>
                <el-table-column prop="create_time" label="下单时间">
                    <template slot-scope="data">
                        {{data.row.create_time | dateFormat}}
                    </template>
                </el-table-column>
                <el-table-column  label="操作">
                    <template>
                        <el-button type="primary" size="mini" icon="el-icon-edit"></el-button>
                        <el-button type="success" size="mini" icon="el-icon-location"></el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="paramsInfo.pagenum"
                    :page-sizes="[5,10 , 15]"
                    :page-size="paramsInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>

        </el-card>



    </div>
</template>

<script>
    import {reqOrders} from "network/api"
  export default {
    name: "Orders",
    data(){
      return {
        paramsInfo:{
          query:'',
          pagenum:1,
          pagesize:10
        },
        total:0,
        orderList:[]
      }
    },
    created() {
      this.getOrderList()
    },
    methods:{
      //每页大小发生变化
      handleSizeChange(newSize){
        this.paramsInfo.pagesize = newSize
        this.getOrderList()
      },
      //当前页码发生变化
      handleCurrentChange(newPage){
        this.paramsInfo.pagenum = newPage
        this.getOrderList()
      },
      //获取订单列表
      async getOrderList(){
        const result = await reqOrders(this.paramsInfo)
        if (result.meta.status !== 200) return this.$message.error("获取订单列表失败")
        console.log(result)
        const {goods,total} = result.data
        this.total = total
        this.orderList = goods
      },
    }
  }
</script>

<style scoped>

</style>
