<template>
    <div>
        <div class="toggle-btn" @click="toggleClick">| | |</div>
        <el-menu

                background-color="#333744"
                text-color="#fff"
                active-text-color="#409eff"
                unique-opened
                :collapse="isCollapse"
                :collapse-transition="false"
                router
                :default-active="defaultIndex"
        >
            <el-submenu :index="item.id + ''" v-for="item in menus" :key="item.id" class="item-menu">
                <template slot="title">
                    <i :class="menusIcons[item.id]"></i>
                    <span>{{item.authName}}</span>
                </template>
                <el-menu-item :index="childItem.id+''" v-for="childItem in item.children" :route="'/'+childItem.path">
                    <template slot="title">
                        <i class="el-icon-menu"></i>
                        <span>{{childItem.authName}}</span>
                    </template>
                </el-menu-item>
            </el-submenu>

        </el-menu>
    </div>
</template>

<script>
  import {reqMenus} from "network/api"

  export default {
    name: "HomeAsideMenu",
    data() {
      return {
        menus: [],
        menusIcons: {
          '125': 'iconfont icon-users',
          '103': 'iconfont icon-tijikongjian',
          '101': 'iconfont icon-shangpin',
          '102': 'iconfont icon-danju',
          '145': 'iconfont icon-baobiao'

        },
        isCollapse:false
      }
    },
    created() {
      this.getMenus()
    },
    methods: {
      //切换menus
      toggleClick(){
        this.isCollapse = !this.isCollapse
        this.$emit("toggleCloll",this.isCollapse)
      },
      //获取menus
      async getMenus() {
        const result = await reqMenus()
        if (result.meta.status === 200) {

          const {data} = result
          this.menus = data
        }
      }
    },
    computed:{
      //默认选中id
      defaultIndex(){
        if (this.menus.length <= 0){
          return
        }
        const path = this.$route.path
        const newMenus = []
        this.menus.forEach(item => {
          item.children.forEach(cItem => {
            newMenus.push({path:cItem.path,id:cItem.id})
          })
        })
        const activeMenu = newMenus.find(item => {
          return path.indexOf(item.path) >= 0
        })
        return activeMenu.id + ''
      }
    }
  }
</script>

<style scoped lang="less">
    .toggle-btn{
        background-color: #4a5064;
        text-align: center;
        font-size: 10px;
        color: #fff;
        line-height: 24px;
        cursor: pointer;
    }
    .el-menu{
        border-right: none;
    }
    .item-menu {

        i {
            margin-right: 10px;
            font-size: 16px;
        }

        span {
            font-size: 13px;
        }
    }
</style>
