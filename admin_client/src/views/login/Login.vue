<template>
    <div class="login">
        <div class="login-box">
            <div class="login-logo">
                <img src="~assets/img/logo.png" alt="">
            </div>
            <el-form ref="loginFrom" :model="loginFrom" class="login-from" :rules="rules">
                <el-form-item prop="username">
                    <el-input prefix-icon="iconfont icon-user" v-model="loginFrom.username"
                              placeholder="请输入用户名"
                    ></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input prefix-icon="iconfont icon-3702mima"
                              v-model="loginFrom.password"
                              placeholder="请输入密码"
                              type="password"></el-input>
                </el-form-item>
                <el-form-item class="btns">
                    <el-button type="primary" @click="loginClick">登录</el-button>
                    <el-button type="info" @click="resetClick">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
  import {reqLogin} from "network/api"

  export default {
    name: "Login",
    data() {
      return {
        loginFrom: {
          username: 'admin',
          password: '123456'
        },
        rules: {
          username: [
            {required: true, message: '必须输入用户名', trigger: 'blur'},
            {min: 3, max: 10, message: '用户名长度在3到10位', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '必须输入密码', trigger: 'blur'},
          ],
        }
      }
    },
    methods: {
      //重置
      resetClick() {
        this.$refs.loginFrom.resetFields()
      },
      //登录按钮
      loginClick() {
        this.$refs.loginFrom.validate(async valid => {
          if (!valid) {
            return
          }
          //验证成功发请求
          const {username, password} = this.loginFrom
          const result = await reqLogin(username, password)
          const {token} = result.data
          window.sessionStorage.setItem("token", token)
          const {status, msg} = result.meta
          if (status === 200) {
            this.$message.success({
              message: msg,
              duration: 1000
            });
            this.$router.replace("/home")
            return
          }
          this.$message.error({
            message: msg,
            duration: 1000
          });
        })
      }
    }

  }
</script>

<style scoped lang="less">
    .login {
        background-color: #2b4b6b;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;

        .login-box {
            width: 450px;
            height: 300px;
            background-color: #fff;
            border-radius: 4px;

            position: relative;

            .login-logo {
                width: 130px;
                height: 130px;
                box-shadow: 0 0 10px #eeeeee;
                padding: 10px;
                background-color: #fff;
                border-radius: 50%;
                position: absolute;
                left: 50%;
                transform: translate(-50%, -50%);

                img {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    background-color: #eee;
                }
            }

            .login-from {
                width: 100%;
                padding: 10px 20px;
                position: absolute;
                bottom: 20px;

                .btns {
                    display: flex;
                    justify-content: flex-end;
                }
            }
        }

    }

</style>
