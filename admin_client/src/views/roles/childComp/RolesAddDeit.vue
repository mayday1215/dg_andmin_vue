<template>
    <el-dialog :title="!addOrDeit ? '添加角色' : '编辑角色'" :visible="visible" width="50%" :before-close="handleClose">
        <el-form :model="rolesForm" :rules="rules" ref="rolesForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="角色名称" prop="roleName">
                <el-input v-model="rolesForm.roleName"></el-input>
            </el-form-item>
            <el-form-item label="角色描述" prop="roleDesc">
                <el-input v-model="rolesForm.roleDesc"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="closeClick">取 消</el-button>
            <el-button type="primary" @click="submitClick">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
  import {reqAddRoles, reqEditRoles} from "network/api"

  export default {
    name: "RolesAddDeit",
    props: {
      roleInfo: {
        type: Object
      }
    },
    data() {
      return {
        visible: false,
        rolesForm: {
          roleName: '',
          roleDesc: ''
        },
        rules: {
          roleName: [{required: true, message: '请输入角色名称', trigger: 'blur'},],
          roleDesc: [{required: true, message: '请输入该角色的描述', trigger: 'blur'},]
        },
        roleId: ''
      }
    },
    methods: {
      //点击确定
      async submitClick() {
        const {roleName, roleDesc, id} = this.rolesForm
        this.$refs.rolesForm.validate(async valid => {
          if (!valid) return
          if (!this.addOrDeit) {
            //确定添加
            const result = await reqAddRoles(roleName, roleDesc)
            if (result.meta.status !== 201) return this.$message.error("添加角色失败")
            this.$message.success("添加角色成功")
            this.visible = false
            this.$emit("updataRolesList")
          } else {
            //确定编辑
            const result = await reqEditRoles({roleName, roleDesc, id})
            if (result.meta.status !== 200) return this.$message.error("更新角色失败")
            this.$message.success("更新角色成功")
            this.visible = false
            this.$emit("updataRolesList")
          }

        })

         this.$refs.rolesForm.resetFields()


      },
      //点击取消
      closeClick() {
        this.$refs.rolesForm.resetFields()
        this.visible = false
      },
      //点xx
      handleClose() {
        this.visible = false
      }
    },
    watch: {
      roleInfo(newValue) {
        /* const {roleName,roleDesc,id} = newValue
         this.rolesForm.roleName = roleName
         this.rolesForm.roleDesc = roleDesc
         this.roleId = id*/
        this.rolesForm = {...newValue}

      }
    },
    computed: {
      addOrDeit() {
        //返回true表示 编辑  false 表示添加
        return !!this.roleInfo.id || !!this.roleInfo.roleName
      }
    }
  }
</script>

<style scoped>

</style>
