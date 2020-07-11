<template>
    <div>

        <el-dialog :title="isUpdateInfo ? '修改用户': '添加用户'" :visible="visible" width="50%" :before-close="handleClose">
            <el-form ref="addForm" :model="addForm" :rules="addRules" label-width="80px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username" :disabled="isUpdateInfo"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password" v-if="!isUpdateInfo">
                    <el-input v-model="addForm.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button @click="closeClick">取 消</el-button>
                <el-button type="primary" @click="submitClick">确定</el-button>
            </div>


        </el-dialog>
    </div>
</template>

<script>

    import {reqAddUser,reqUpateUser} from "network/api"

  //邮箱自定义验证
  const checkEmail = (rule, value, callback) => {
    const reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
    if (!reg.test(value)) {
      //验证失败
      return callback(new Error("请输入合法的邮箱"))
    }
    callback()
  }

  //手机自定义验证
  const checkMobile = (rule, value, callback) => {
    const reg = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/
    if (!reg.test(value)) {
      //验证失败

      return callback(new Error("请输入合法的手机"))
    }
    callback()
  }
  export default {
    name: "UserDialog",
    props:{
      rowUserInfo:{
        type:Object,
        default(){
          return {}
        }
      }
    },

    data() {
      return {
        visible: false,
        addForm: {
          username: '',
          password: '',
          email: '',
          mobile: ''
        },
        userId:'',
        addRules: {
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'},
            {min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 6, max: 15, message: '长度在 6到 15 个字符', trigger: 'blur'}
          ],
          email: [
            {required: true, message: '请输入邮箱', trigger: 'blur'},
            {validator: checkEmail, trigger: 'blur'},

          ],
          mobile: [
            {required: true, message: '请输入电话', trigger: 'blur'},
            {validator: checkMobile, trigger: 'blur'},

          ]
        },
      }
    },

    methods: {
      //点击取消按钮
      closeClick(){
        this.visible = false
        this.$refs.addForm.resetFields()
        this.$emit("updateRowUserInfo")
      },

      //点击确定
      submitClick(){
        this.$refs.addForm.validate(async valid => {
          if (!valid) return
          //验证通过发请求
          //判断时添加还是修改

          if (this.isUpdateInfo) {
            //修改用户

            const id = this.userId
            const {email,mobile} = this.addForm
            const result = await reqUpateUser({id,email,mobile})
            const {status,msg} = result.meta
            if (status !== 200){
              return this.$message.error("更新用户失败")
            }
            this.$message.success(msg)
          }else{
            //添加用户
            const result = await reqAddUser(this.addForm)
            if (result.meta.status !== 201){
              return this.$message.error("添加用户失败")
            }
            this.$message.success("添加用户成功")

            // if (result.meta.status !== 201){
            //   return this.$message.error("添加用户失败")
            // }
            // this.$message.success("添加用户成功")
            //添加用户
          }

          this.visible = false
          this.$refs.addForm.resetFields()

          this.$emit("updateUsers")

        })
      },
      //取消回调
      handleClose() {
        this.visible = false
        this.$refs.addForm.resetFields()
        this.$emit("updateRowUserInfo")
      },

    },
    //监听传过来的值
    watch:{
      rowUserInfo(){
        // this.userInfo = this.rowUserInfo
        const {username,mobile,email,id} = this.rowUserInfo
        this.addForm = {username,mobile,email,password: ''}
        this.userId = id
      }
    },
    computed:{
      isUpdateInfo(){
        return !!this.rowUserInfo.id || !!this.rowUserInfo.username
      }
    }
  }
</script>

<style scoped>

</style>
