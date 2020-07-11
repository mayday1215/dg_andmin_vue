<template>
    <div>
        <!--        面包屑导航-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片-->
        <el-card>
            <el-alert title="添加商品信息" :closable="false" type="info" center show-icon></el-alert>
            <!--步骤条-->
            <el-steps :active="active - 0" align-center finish-status="success">
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>

            </el-steps>
            <!--tabs-->
            <el-form :model="addGoodsForm" label-position="top" :rules="rules" ref="ruleForm" label-width="100px"
                     class="demo-ruleForm">
                <el-tabs tab-position="left" v-model="active" @tab-click="tabClick" :before-leave="tabBeforeLeave">
                    <el-tab-pane label="基本信息" name="0">
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model="addGoodsForm.goods_name "></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price">
                            <el-input type="number" v-model="addGoodsForm.goods_price "></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight">
                            <el-input type="number" v-model="addGoodsForm.goods_weight "></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goods_number">
                            <el-input type="number" v-model="addGoodsForm.goods_number "></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类">
                            <el-cascader
                                    v-model="selCat"
                                    :options="catList"
                                    :props="{ expandTrigger: 'hover',label:'cat_name',value:'cat_id',children:'children' }"
                                    @change="catListChange"></el-cascader>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品参数" name="1">
                        <el-form-item :label="item.attr_name" v-for="item in paramsList" :key="item.attr_id">
                            <el-checkbox-group v-model="item.attr_vals" size="small">
                                <el-checkbox :label="cItem" border v-for="(cItem,index) in item.attr_vals"></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品属性" name="2">
                        <el-form-item :label="item.attr_name" v-for="item in attrList" :key="item.attr_id">
                            <el-input v-model="item.attr_vals"></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品图片" name="3">
                        <el-upload
                                class="upload-demo"
                                action="http://127.0.0.1:8888/api/private/v1/upload"
                                :on-preview="handlePreview"
                                :on-remove="handleRemove"
                                list-type="picture"
                                :headers="upImgHeaders"
                                :on-success="imgUpLoadSuccess"
                        >
                            <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name="4">
                        <quill-editor v-model="addGoodsForm.goods_introduce"/>
                        <el-button type="primary" @click="addGoods">添加商品</el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
        </el-card>
        <el-dialog
                title="预览图片"
                :visible.sync="dialogVisible"
                width="50%"
                :before-close="handleClose">
            <img :src="previewUrl" class="pImg">

        </el-dialog>
    </div>
</template>

<script>
  import {reqCategories,reqCategoriesAttr,reqAddGoods} from "network/api"

  export default {
    name: "GoodsAdd",
    data() {
      return {
        active: '0',
        addGoodsForm: {
          goods_name: '',
          goods_price: 0,
          goods_weight: 0,
          goods_number: 0,
          pics:[

          ], //图片临时路径
          goods_introduce:''
        }, //商品信息
        rules: {
          goods_name: [{required: true, message: '请输入商品名称', trigger: 'blur'},],
          goods_price: [{required: true, message: '请输入商品价格', trigger: 'blur'},],
          goods_weight: [{required: true, message: '请输入商品重量', trigger: 'blur'},],
          goods_number: [{required: true, message: '请输入商品数量', trigger: 'blur'},],
          selCat:[{required: true, message: '请选择商品分类', trigger: 'blur'}]
        }, //校验规则
        selCat:[], //选择商品分类的数组
        catList:[], //分类列表
        paramsList:[], //参数列表
        attrList:[], //属性列表
        upImgHeaders:{
          Authorization:window.sessionStorage.getItem("token")
        },//图片上传请求头
        previewUrl:'',
        dialogVisible:false //预览图片
      }
    },
    created() {
      this.getCatList()
    },
    methods: {
      //添加商品按钮
      addGoods(){
        this.$refs.ruleForm.validate(async valid => {
          if (!valid) return this.$message.error("请填写必要的表单项")
          //console.log("发请求")
          let attrsList = []
          this.paramsList.forEach(item => {
            attrsList.push({attr_id:item.attr_id, attr_value:item.attr_vals.join(" ")})
          })
          this.attrList.forEach(item => {
            attrsList.push({attr_id:item.attr_id, attr_value:item.attr_vals})
          })
          this.addGoodsForm.goods_cat = this.selCat.join(",")
          this.addGoodsForm.attrs = attrsList
          const result = await reqAddGoods(this.addGoodsForm)
          if (result.meta.status !== 201) return this.$message.error("添加商品失败")
          this.$message.success("添加商品成功")
          this.$router.replace("/goods")

        })
      },
      //关闭预览图片
      handleClose(){
        this.dialogVisible = false
      },
      //图片上传成功
      imgUpLoadSuccess(response){
        this.addGoodsForm.pics.push({pic:response.data.tmp_path})
      },
      //图片预览
      handlePreview(file){
        this.previewUrl = file.response.data.url
        this.dialogVisible = true

      },
      //点击图片xx
      handleRemove(file){
        const filePath = file.response.data.tmp_path
        const index = this.addGoodsForm.pics.findIndex(item => {
          return item === filePath
        })
        this.addGoodsForm.pics.splice(index,1)
      },
      //tabs前置钩子
      tabBeforeLeave(activeName,oldActiveName){
        if (oldActiveName === '0' && this.selCat.length !== 3 ){
          this.$message.error("请先选择商品分类")
          return false
        }

      },
      //tabs切换
      async tabClick(){
        const id = this.selCat[2]
        if (this.active === "1"){
          //获取商品参数
          const result = await reqCategoriesAttr(id,"many")
          if (result.meta.status !== 200) return this.$message.error("获取参数列表失败")
          result.data.forEach(item => {
            item.attr_vals = item.attr_vals.split(" ")
          })
          this.paramsList = result.data
        }else if (this.active === "2"){
          const result = await reqCategoriesAttr(id,"only")
          if (result.meta.status !== 200) return this.$message.error("获取属性列表失败")
          this.attrList = result.data
        }
      },
      //分类列表发生变化
      catListChange(){
        if (this.selCat.length !== 3) return this.selCat = []
      },
      //获取分类列表
      async getCatList() {
        const result = await reqCategories({type:'',pagenum:'',pagesize:''})
        if (result.meta.status !== 200) return this.$message.error("获取分类列表失败")
        this.catList = result.data
      },
    }
  }
</script>

<style scoped>
    .el-steps {
        margin: 15px 0;
    }

    .pImg{
        width: 100%;
    }

</style>
