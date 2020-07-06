<template>
    <div>
        <!--        面包屑导航-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
<!--        卡片区-->
        <el-card class="box-card">
            <el-button type="primary" @click="addRole">添加角色</el-button>
            <el-table :data="rolesList" style="width: 100%" border>
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <roles-auth-icons @updataRolesList="updataRolesList" :rowInfo="scope.row"></roles-auth-icons>
                    </template>
                </el-table-column>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="roleName" label="角色名称"></el-table-column>
                <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
                <el-table-column label="操作" width="300">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="deitRole(scope.row)">编辑</el-button>
                        <el-button type="danger" icon="el-icon-delete"  size="mini" @click="delRole(scope.row)">删除</el-button>
                        <el-button type="warning" icon="el-icon-setting"  size="mini" @click="allotClick(scope.row)">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

<!--        添加或编辑角色-->
        <roles-add-deit ref="rolesAddDeit" @updataRolesList="updataRolesList" :roleInfo="roleInfo"></roles-add-deit>

<!--        分配权限-->
        <roles-allot-rights ref="allot" :aotInfo="aotInfo" @updateAotInfo="updateAotInfo" @updataRolesList="updataRolesList"></roles-allot-rights>
    </div>



</template>

<script>
    import {reqRolesList,reqDelRole} from "network/api"
    import RolesAddDeit from "./childComp/RolesAddDeit";
    import RolesAuthIcons from "./childComp/RolesAuthIcons";
    import RolesAllotRights from "./childComp/RolesAllotRights";
  export default {
    name: "Roles",
    components: {RolesAddDeit,RolesAuthIcons,RolesAllotRights},
    data(){
      return {
        rolesList:[],//角色列表
        roleInfo:{}, //角色信息
        aotInfo:{} //
      }
    },
    created(){
      this.getRolesList()
    },
    methods:{
      //点击分配权限
      allotClick(roleInfo){
        this.aotInfo = roleInfo
        this.$refs.allot.dialogVisible = true
      },
      //点击删除用户
      async delRole(roleInfo){
        this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const result = await reqDelRole(roleInfo.id)
          if (result.meta.status !== 200) return this.$message.error("删除角色失败")
          this.$message.success("删除角色成功")
          this.getRolesList()
        }).catch(() => {
          this.$message.info("取消删除")
        });

      },
      //deitRole点击编辑角色
      deitRole(roleInfo){
        this.roleInfo = roleInfo
        this.$refs.rolesAddDeit.visible = true
      },
      //点击添加角色
      addRole(){
        this.roleInfo = {}
        this.$refs.rolesAddDeit.visible = true
      },
      //获取角色列表
      async getRolesList (){
        const result = await reqRolesList()
        if (result.meta.status !== 200) return this.$message.error("获取角色列表失败")
        //获取成功
        this.rolesList = result.data
      },
      //添加或编辑完更新列表
      updataRolesList (){
        this.getRolesList()
      },
      //更新aotInfo
      updateAotInfo(){
        this.aotInfo = {}
      }
    }
  }
</script>

<style scoped>

</style>
