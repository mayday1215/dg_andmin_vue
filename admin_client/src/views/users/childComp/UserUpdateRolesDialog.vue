<template>
    <div>
        <el-dialog
                title="提示"
                :visible="dialogVisible"
                width="50%"
                :before-close="handleClose">


            <p>当前用户： {{updateUserInfo.username}}</p>
            <br>
            <p>当前角色：{{updateUserInfo.role_name}}</p>
            <br>
            <p>
                分配新角色：
                <el-select v-model="selectRole" placeholder="请选择">
                    <el-option
                            v-for="item in rolesList"
                            :key="item.id"
                            :label="item.roleName"
                            :value="item.id">
                    </el-option>
                </el-select>
            </p>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitUpdateRole">确 定</el-button>
              </span>
        </el-dialog>
    </div>
</template>

<script>
    import {reqRolesList,reqUserRole} from "network/api"
  export default {
    name: "UserUpdateRolesDialog",
    props:{
      updateUserInfo:{
        type:Object,
        default(){
          return {}
        }
      }
    },
    data(){
      return {
        dialogVisible:false,
        rolesList:[],
        selectRole:''
      }
    },
    created(){
      this.getRolesList()
    },
    methods:{
      //点击确定
      async submitUpdateRole(){

        const id = this.updateUserInfo.id
        const rid = this.selectRole
        const result = await reqUserRole(id,rid)
        if (result.meta.status !== 200) return this.$message.error("设置角色失败")
        this.$message.success("设置角色成功")
        this.dialogVisible = false
        this.$emit("updateUsers")
      },
      //获取角色列表
      async getRolesList(){
        const result = await reqRolesList()
        if (result.meta.status !== 200) return this.$message.error("获取角色列表失败")
        this.rolesList = result.data

      },
      //点击取消或xx
      handleClose(){
        this.dialogVisible = false
      }
    }
  }
</script>

<style scoped>

</style>
