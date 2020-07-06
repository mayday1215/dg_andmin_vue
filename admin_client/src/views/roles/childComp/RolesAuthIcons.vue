<template>
    <div class="roles-icons">
        <el-row v-for="item in rights" :key="item.id"  class="center" style="border-bottom: 1px solid rgb(238, 238, 238)">
            <el-col :span="5">
                <el-tag closable @close="delAuth(item.id)">{{item.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
            </el-col>
            <el-col :span="19">
                <el-row v-for="cItem in item.children" :key="cItem.id" class="center">
                    <el-col :span="6">
                        <el-tag type="success" @close="delAuth(cItem.id)" closable >{{cItem.authName}}</el-tag>
                        <i class="el-icon-caret-right"></i>
                    </el-col>
                    <el-col :span="18">
                        <el-tag @close="delAuth(ccItem.id)" v-for="ccItem in cItem.children" :key="ccItem.id" type="warning" closable>
                            {{ccItem.authName}}
                        </el-tag>
                    </el-col>
                </el-row>

            </el-col>
        </el-row>
    </div>
</template>

<script>
    import {reqDelRoleRights} from "network/api"
  export default {
    name: "RolesAuthIcons",
    props: {
      rowInfo: {
        type: Object,
        default() {
          return {};
        }
      }
    },
    data(){
      return {
        rights:[]
      }
    },
    created() {
        this.rights = this.rowInfo.children
    },
    methods:{
      delAuth(rightId){
        //权限id rightId  角色id roleId
        //console.log(rightId)
        const roleId = this.rowInfo.id
        this.$confirm('此操作将永久删除权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const result = await reqDelRoleRights({rightId,roleId})
          if (result.meta.status !== 200) return this.$message.error("删除权限失败")
          this.$message.success("删除权限成功")
          this.rights = result.data
        }).catch(() => {
          this.$message.info("取消删除")
        });

      }
    }
  }
</script>

<style scoped>
    .center{
        display: flex;
        align-items: center;

    }
    .el-tag {
        margin: 7px;
    }

</style>
