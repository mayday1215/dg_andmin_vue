<template>
    <div>
        <el-dialog
                title="修改分类"
                :visible="dialogVisible"
                width="50%"
                :before-close="handleClose">
            <el-form ref="form" :model="form" label-width="80px" :rules="rules">
                <el-form-item label="分类名称" prop="cat_name">
                    <el-input v-model="form.cat_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeClick">取 消</el-button>
                <el-button type="primary" @click="submitClick">确 定</el-button>
              </span>
        </el-dialog>
    </div>
</template>

<script>
    import {reqEditCategorie} from "network/api"
  export default {
    name: "CategoriesEdit",
    props:{
      catRowInfo:{
        type:Object
      }
    },
    data(){
      return {
        dialogVisible:false,
        form:{
          cat_name:''
        },
        rules: {
          cat_name: [
            {required: true, message: '请输入分类名称', trigger: 'blur'}
          ],
        },
      }
    },
    methods:{
      //点击确定
      submitClick(){
        const id = this.catRowInfo.cat_id
        const cat_name = this.form.cat_name

        this.$refs.form.validate(async valid => {
          if (!valid) return
          const result = await reqEditCategorie(id,cat_name)
          if (result.meta.status !== 200) return this.$message.error("修改分类失败")
          this.$message.success("修改分类成功")
          this.$refs.form.resetFields()
          this.dialogVisible = false
          this.$emit("updateCateList")
        })
      },
      //点击取消
      closeClick(){
        this.$refs.form.resetFields()
        this.dialogVisible = false
      },
      //点xx
      handleClose(){
        this.$refs.form.resetFields()
        this.dialogVisible = false
      }
    },
    watch:{
      catRowInfo(newValue){
        this.form.cat_name = newValue.cat_name
        //console.log(newValue.cat_name)
      }
    }
  }
</script>

<style scoped>

</style>
