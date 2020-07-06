<template>
    <div class="home">
        <el-container class="home-container">
            <el-header>
                <home-header></home-header>
            </el-header>
            <el-container class="container">

                <el-aside :width="widthFlag ? '64px':'200px'">
                    <home-aside-menu @toggleCloll="toggleCloll"></home-aside-menu>
                </el-aside>
                <el-main>
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
  import HomeHeader from "./childComp/HomeHeader";
  import HomeAsideMenu from "./childComp/HomeAsideMenu";
  export default {
    name: "Home",
    components: {
      HomeHeader,
      HomeAsideMenu
    },
    data(){
      return {
        widthFlag:false
      }
    },
    methods:{
      toggleCloll(boo){
        this.widthFlag = boo

      }
    }
  }
</script>

<style scoped lang="less">
    .home {
        height: 100%;

        .home-container {
            height: 100%;
        }
    }

    .el-header {
        background-color: #373d41;
    }

    .el-aside {
        background-color: #333744;
    }

    .el-main {
        background-color: #eaedf1;
    }


</style>
