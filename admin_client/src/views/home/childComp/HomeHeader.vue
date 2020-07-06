<template>
    <div class="header">
        <div class="logo">
            <img src="~assets/img/logo.png">
            <span>电商后台管理系统</span>
        </div>
        <el-button type="info" @click="logout">退出</el-button>
    </div>
</template>

<script>
  export default {
    name: "HomeHeader",
    methods:{
      logout(){
        this.$confirm('确定要退出登录吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '退出成功!'
          });
          sessionStorage.clear()
          this.$router.replace("/login")
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消退出'
          });
        });

      }
    }
  }
</script>

<style scoped lang="less">
    .header{
        height: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .logo {
            display: flex;
            align-items: center;
            height: 100%;
            img {
                width: 50px;
                height: 50px;
            }
            span{
                font-size: 22px;
                color:#fff;
                margin-left: 10px;
            }
        }
    }


</style>
