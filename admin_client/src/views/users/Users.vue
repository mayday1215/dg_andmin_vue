<template>
    <div>
        <!-- 面包屑导航-->
        <users-breadurumd></users-breadurumd>
        <!-- 卡片-->
        <el-card class="box-card">
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" @clear="clearClick" clearable v-model="pagParams.query" class="input-with-select">
                        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="8">
                    <el-button type="primary" @click="addUser">添加用户</el-button>
                </el-col>
            </el-row>
            <!--        表格-->
            <el-table :data="userList" style="width: 100%" border>
                <el-table-column prop="" type="index"></el-table-column>
                <el-table-column prop="username" label="姓名"></el-table-column>
                <el-table-column prop="email" label="邮箱"></el-table-column>
                <el-table-column prop="mobile" label="电话"></el-table-column>
                <el-table-column prop="role_name" label="角色"></el-table-column>
                <el-table-column prop="mg_state" label="状态">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.mg_state" @change="switchChange(scope.row)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200">
                    <template slot-scope="scope">
                        <!--                        <span>{{scope.row}}</span>-->
                        <el-tooltip class="item" effect="dark" content="编辑" placement="top-start" :enterable="false">
                            <el-button type="primary" icon="el-icon-edit" @click="editClick(scope.row)" size="mini"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="删除" placement="top-start" :enterable="false">
                            <el-button type="danger" icon="el-icon-delete" size="mini" @click="delUser(scope.row)"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="分配角色" placement="top-start" :enterable="false">
                            <el-button type="warning" icon="el-icon-setting" @click="updateRoles(scope.row)" size="mini"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <!--            分页-->
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="pagParams.pagenum"
                    :page-sizes="[2, 5, 10]"
                    :page-size="pagParams.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </el-card>

<!--        UserDialog-->
        <user-dialog ref="dialog" @updateUsers="updateUsers" @updateRowUserInfo="updateRowUserInfo" :rowUserInfo="rowUserInfo"></user-dialog>

<!--      分配角色  -->
        <user-update-roles-dialog ref="updateRoles" @updateUsers="updateUsers" :updateUserInfo="updateUserInfo"></user-update-roles-dialog>

    </div>
</template>

<script>
  import UsersBreadurumd from "./childComp/UsersBreadurumd";
  import UserDialog from "./childComp/UserDialog";
  import UserUpdateRolesDialog from "./childComp/UserUpdateRolesDialog";
  import {reqUsers, reqUserState,reqDelUser} from "network/api"
  import axios from "axios"

  export default {
    name: "Users",
    components: {UserUpdateRolesDialog, UsersBreadurumd,UserDialog},
    data() {
      return {
        userList: [],
        value1: true,
        total: 0,
        pagParams: {query: '', pagenum: 1, pagesize: 2},
        rowUserInfo:{},
        updateUserInfo:{}
      }
    },
    created() {
      this.getUserList()
    },
    methods: {
      //更新用户状态
      updateRowUserInfo(){
        this.rowUserInfo = {}
      },
      //点击分配角色
      updateRoles(userInfo){
        this.updateUserInfo = userInfo
        this.$refs.updateRoles.dialogVisible = true

      },
      //点击删除用户
      delUser(userInfo){

        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const result =await reqDelUser(userInfo.id)
          console.log(result)
          const {status,msg} = result.meta
          if (status !== 200) return this.$message.error(msg)

          this.$message.success(msg);
          this.getUserList()
        }).catch(() => {
            this.$message.info("取消删除")
        });

      },
      //点击添加用户
      addUser(){
        this.rowUserInfo = {}
        this.$refs.dialog.visible = true
      },
      //用户状态改变
      async switchChange(userInfo) {
        const {id, mg_state} = userInfo
        const result = await reqUserState(id, mg_state)
        console.log(result)
        if (result.meta.status !== 200) {
          return this.$message.error("更新状态失败")
        }
        this.$message.success("更新状态成功")
      },
      //获取用户列表
      async getUserList() {
        const result = await reqUsers(this.pagParams)
        if (result.meta.status !== 200) {
          //获取用户用户列表失败
          return this.$message.error("获取用户列表失败！")
        }
        const {total, pagenum, users} = result.data
        this.userList = users
        this.total = total


      },
      //改变每页大小
      handleSizeChange(size) {
        this.pagParams.pagesize = size
        this.getUserList()
      },
      //改变当前页数
      handleCurrentChange(page) {
        this.pagParams.pagenum = page
        this.getUserList()
      },
      //添加用户后更新数据
      updateUsers(){
        this.getUserList()
      },
      //清空文本框后回调
      clearClick(){
        this.getUserList()
      },
      //点击编辑
      editClick(userInfo){
        this.rowUserInfo = userInfo
        this.$refs.dialog.visible = true
      }
    }
  }
</script>

<style scoped>


</style>
