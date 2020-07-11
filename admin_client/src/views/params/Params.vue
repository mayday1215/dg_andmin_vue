<template>
    <div>
        <!--        面包屑导航-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>参数列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片区域-->
        <el-card>
            <!--提示区域-->
            <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" :closable="false" show-icon></el-alert>
            <!--选择分类-->
            <el-row>
                <span>选择商品分类:</span>
                <el-cascader
                        v-model="selectCat"
                        :options="categorieList"
                        :props="props"
                        @change="handleChange"></el-cascader>
            </el-row>
            <!--参数-->
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="动态参数" name="many">
                    <params-list :attrList="attrList" @updateCatAttrList="updateCatAttrList" :selectCat="selectCat"
                                 :activeName="activeName"></params-list>
                </el-tab-pane>
                <el-tab-pane label="静态属性" name="only">
                    <params-list :attrList="attrList" @updateCatAttrList="updateCatAttrList" :selectCat="selectCat"
                                 :activeName="activeName"></params-list>
                </el-tab-pane>
            </el-tabs>
        </el-card>
    </div>
</template>

<script>
  import {reqCategories, reqCategoriesAttr} from "network/api"
  import ParamsList from "./childComp/ParamsList";

  export default {
    name: "Params",
    components: {ParamsList},
    data() {
      return {
        categorieList: [],//分类列表
        props: {expandTrigger: 'hover', label: 'cat_name', value: 'cat_id', children: 'children'}, //级联配置
        selectCat: [],//级联选中
        activeName: 'many',//tabs切换选中项  动态参数是many  静态属性是only
        attrList: [], //获取到的参数列表
      }
    },
    created() {
      this.getCategoriesList()
    },
    methods: {
      //获取动态参数或者属性
      async getCatAttrList() {
        const id = this.selectCat[2]
        const sel = this.activeName
        const result = await reqCategoriesAttr(id, sel)

        if (result.meta.status !== 200) return this.$message.error("获取参数信息失败")
        result.data.forEach(item => {
          item.attr_vals = item.attr_vals !== '' ? item.attr_vals.split(" ") : []
          item.inputVisible = false
          item.inputValue = ""
        })
        this.attrList = result.data
      },
      //tabs切换事件
      handleClick() {
        if (this.selectCat.length === 3) {
          this.getCatAttrList()
        }
      },
      //级联发生变化
      handleChange(selectVals) {
        //如果选的不是第三级就不让选中
        if (selectVals.length < 3) {
          this.selectCat = []
          this.attrList = []
          return
        }
        //选择了三级菜单
        this.getCatAttrList()

      },
      //获取商品分类
      async getCategoriesList() {
        const result = await reqCategories({type: '', pagenum: '', pagesize: ''})
        if (result.meta.status !== 200) return this.$message.error("获取商品分类失败")
        this.categorieList = result.data
      },
      //更新列表
      updateCatAttrList() {
        this.getCatAttrList()
      }
    }
  }
</script>

<style scoped lang="less">
    .el-row {
        margin: 15px 0;

        span {
            margin-right: 10px;
        }
    }
</style>
