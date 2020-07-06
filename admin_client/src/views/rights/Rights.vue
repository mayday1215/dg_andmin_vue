<template>
    <div>
        <!--        面包屑导航-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>


        <el-card class="box-card">
            <el-table :data="rightsList" style="width: 100%" border>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="authName" label="权限名称"></el-table-column>
                <el-table-column prop="path" label="路径"></el-table-column>
                <el-table-column prop="level" label="权限等级">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.level === '0'">一级</el-tag>
                        <el-tag type="success" v-else-if="scope.row.level === '1'">二级</el-tag>
                        <el-tag type="warning" v-else>三级</el-tag>
                    </template>
                </el-table-column>

            </el-table>
        </el-card>

    </div>
</template>

<script>
    import {reqRightsList} from "network/api"
  export default {
    name: "Rights",
    data(){
      return {
        rightsList:[],//权限列表
      }
    },
    created() {
      this.getRightsList()
    },
    methods:{
      //获取权限列表
      async getRightsList(){
        const result = await reqRightsList()
        console.log(result)
        if (result.meta.status !== 200) return this.$message.error("获取权限列表失败")
        //获取权限列表成功
        this.rightsList = result.data


      }
    }
  }
</script>

<style scoped>

</style>
