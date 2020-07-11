<template>
    <div>
        <!--        面包屑导航-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        </el-breadcrumb>
<!--        卡片-->
        <el-card class="box-card">
           <el-button type="primary" @click="addCategories">添加分类</el-button>

            <zk-table
                    :data="categoriesList"
                    :columns="columns"
                    :selection-type="false"
                    :expand-type="false"
                    show-index
                    index-text="#"
                    border
                    style="margin-top: 15px"
            >
                <template slot="isOk"  scope="scope">
                    <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color:lightgreen"></i>
                    <i class="el-icon-error" v-else  style="color:red"></i>
                </template>

                <template slot="order" scope="scope">
                    <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
                    <el-tag type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
                    <el-tag type="warning" v-else>三级</el-tag>
                </template>

                <template slot="opt"  scope="scope">
                    <el-button type="primary" size="mini" icon="el-icon-edit" @click="editCategorie(scope.row)">编辑</el-button>
                    <el-button type="danger" size="mini" icon="el-icon-delete" @click="delCategorie(scope.row)">删除</el-button>
                </template>


            </zk-table>
<!--            分页-->
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="1"
                    :page-sizes="[5, 10, 20]"
                    :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </el-card>
        <categories-add ref="categoriesAdd" @updateCateList="updateCateList" :childCategories="childCategories"></categories-add>

        <categories-edit ref="categoriesEdit" :catRowInfo="catRowInfo" @updateCateList="updateCateList"></categories-edit>
    </div>
</template>

<script>
    import {reqCategories,reqDelCategorie} from "network/api"
    import CategoriesAdd from "./childComp/CategoriesAdd";
    import CategoriesEdit from "./childComp/CategoriesEdit";
  export default {
    name: "Categories",
    components: {CategoriesEdit, CategoriesAdd},
    data(){
      return {
        categoriesList:[], //分类数据
        total:0, //总条数
        queryInfo:{
          type:'',
          pagenum:1,
          pagesize:5
        },//请求参数
        columns:[
          {
            label: '分类名称',
            prop: 'cat_name',
          },
          {
            label: '是否有效',
            prop: 'cat_deleted',
            type:'template',
            template:'isOk'
          },
          {
            label: '排序',
            prop: 'cat_level',
            type:'template',
            template:'order'
          },
          {
            label: '操作',
            type:'template',
            template:'opt'
          }
        ],
        childCategories:[], //级联列表数据
        catRowInfo:{}
      }
    },
    created() {
      this.getCategories()
    },
    methods:{
      //点击编辑分类
      editCategorie(rowInfo){
        this.catRowInfo = rowInfo
        this.$refs.categoriesEdit.dialogVisible = true
      },
      //删除分类
      delCategorie(rowInfo){
        const {cat_id} = rowInfo
        this.$confirm('确定要删除该分类吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const result = await reqDelCategorie(cat_id)
          if (result.meta.status !== 200) return this.$message.error("删除分类失败")
          this.$message.success("删除分类成功")
          this.getCategories()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      },
      //更新分类列表
      updateCateList(){
        this.getCategories()
      },
      //添加分类
      async addCategories(){
        const params = {
          type:2,
          pagenum:'',
          pagesize:''
        }
        const result = await reqCategories(params)
        // console.log(result)
        if (result.meta.status !== 200) return this.$message.error("获取分类失败")
        this.childCategories = result.data
        this.$refs.categoriesAdd.dialogVisible = true
      },
      //当前页数改变
      handleCurrentChange(newPage){
        // console.log(newPage)
        this.queryInfo.pagenum = newPage
        this.getCategories()
      },
      //每页条数改变
      handleSizeChange(newSize){
        this.queryInfo.pagesize = newSize
        this.getCategories()
      },
      //获取分类列表
      async getCategories(){
        const result =await reqCategories(this.queryInfo)
        if (result.meta.status !== 200) return this.$message.error("获取商品分类失败")
        this.categoriesList =result.data.result
        this.total = result.data.total
      }
    }
  }
</script>

<style scoped>

</style>
