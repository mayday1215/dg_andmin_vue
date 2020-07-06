<template>
    <div>
        <el-dialog title="分配权限" :visible="dialogVisible" width="50%" @close="handleClose">
            <el-tree
                    :data="rightsTree"
                    show-checkbox
                    node-key="id"
                    :props="defaultProps"
                    default-expand-all
                    :default-checked-keys="checkeds"
                    ref="tree"
                    >
            </el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitChecks">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {reqRightsTreeList,reqSetRolesRights} from "network/api"
  export default {
    name: "RolesAllotRights",
    props:{
      aotInfo:{
        type:Object
      }
    },
    data() {
      return {
        dialogVisible: false,
        rightsTree: [],
        defaultProps:{
          children: 'children',
          label: 'authName'
        },
        checkeds:[]
      }
    },
    created(){
      this.getRightsTreeList()
    },
    mounted(){
      console.log("mounted")
    },
    methods: {

      //点击确定
      async submitChecks(){
        const {getCheckedKeys,getHalfCheckedKeys} = this.$refs.tree
        const rids = [...getCheckedKeys(),...getHalfCheckedKeys()].join(",")
        const {id} = this.aotInfo
        //console.log(rids,id)
        const result = await reqSetRolesRights(id,rids)
        if (result.meta.status !== 200) return this.$message.error("授权失败")
        this.dialogVisible = false
        this.$emit("updataRolesList")
      },
      //获取所有id
      getIds(obj,arr){
        if (!obj.id){
          return
        }
        if (!obj.children){
          return arr.push(obj.id)
        }
        obj.children.forEach(item => {
          this.getIds(item,arr)
        })
      },
      //获取树状权限列表
      async getRightsTreeList() {
        const result = await reqRightsTreeList()
        if (result.meta.status !== 200) return  this.$message.error("获取权限列表失败")
        this.rightsTree = result.data
      },
      //点xx
      handleClose() {
        this.checkeds = []
        this.$nextTick(() => {
          this.$refs.tree.setCheckedKeys([])
          this.$emit("updateAotInfo")
        })
        this.dialogVisible = false
      }
    },
    watch:{
      aotInfo(newVlaue){
        this.getIds(newVlaue,this.checkeds)

      }
    }
  }
</script>

<style scoped>

</style>
