<template>
    <div>
        <!--        面包屑导航-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片-->
        <el-card>
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="goodsParams.query" clearable class="input-with-select" @clear="getGoodsList">
                        <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="$router.push('/goods/add')">添加商品</el-button>
                </el-col>
            </el-row>
            <el-table :data="goodsList" border style="width: 100%">
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="goods_name" label="商品名称"></el-table-column>
                <el-table-column prop="goods_price" label="商品价格（元）" width="90"></el-table-column>
                <el-table-column prop="goods_weight" label="商品重量" width='60'></el-table-column>
                <el-table-column label="创建时间" width="160">
                    <template slot-scope="scope">
                        {{scope.row.add_time | dateFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="120">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="delGoods(scope.row)"></el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="goodsParams.pagenum"
                    :page-size="goodsParams.pagesize"
                    :page-sizes="[5, 10, 15 ,20]"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>

        </el-card>
    </div>
</template>

<script>
  import {reqGoodsList,reqDelGoods} from "network/api"

  export default {
    name: "Goods",
    data() {
      return {
        goodsList: [],//商品列表
        goodsParams: {
          query: '',//搜索关建字
          pagenum: 1,
          pagesize: 10
        }, //请求商品参数
        total: 0
      }
    },
    created() {
      this.getGoodsList()
    },

    methods: {

      //当前页面改变
      handleCurrentChange(newPage) {
        this.goodsParams.pagenum = newPage
        this.getGoodsList()
      },
      //每页大小改变
      handleSizeChange(newSize) {
        this.goodsParams.pagesize = newSize
        this.getGoodsList()
      },
      //删除商品
      delGoods(goodsInfo) {
        this.$confirm('确定要删除该商品吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const result = await reqDelGoods(goodsInfo.goods_id)
          if (result.meta.status !== 200) return this.$message.error("删除商品失败")
          this.$message.success("删除商品成功")
          this.getGoodsList()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        })


      },
      //获取商品列表
      async getGoodsList() {
        const result = await reqGoodsList(this.goodsParams)
        if (result.meta.status !== 200) return this.$message.error("获取商品列表失败")
        const {total, goods} = result.data
        this.goodsList = goods
        this.total = total
      }
    },

  }
</script>

<style scoped>

</style>
