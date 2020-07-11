<template>
    <div>
        <el-dialog
                title="提示"
                :visible.sync="dialogVisible"
                width="50%"
                :before-close="handleClose">
            <el-form ref="form" :model="form" label-width="80px" :rules="rules">
                <el-form-item label="分类名称" prop="cat_name">
                    <el-input v-model="form.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类">
                    <el-cascader
                            v-model="selectCate"
                            :options="childCategories"
                            :props="props"
                            clearable
                            checkStrictly
                            @change="handleChange">

                    </el-cascader>
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
    import {reqAddCategorie} from "network/api"
  export default {
    name: "CategoriesAdd",
    props:{
      childCategories:{
        type:Array,
        default(){
          return []
        }
      }
    },
    data() {
      return {
        dialogVisible: false,
        form: {
          cat_name: '',
          cat_pid:0,
          cat_level:0
        },
        rules: {
          cat_name: [
            {required: true, message: '请输入分类名称', trigger: 'blur'}
          ],
        },
        selectCate: [],
        props:{label:'cat_name',value:'cat_id',children:'children',expandTrigger:'hover',checkStrictly:true}
      }
    },
    methods: {
      //点击添加
      submitClick(){
        this.$refs.form.validate(async valid => {
          if (!valid) return
          const result = await reqAddCategorie(this.form)

          if (result.meta.status !== 201) return this.$message.error("添加分类失败")
          this.$message.success("添加分类成功")
          this.dialogVisible = false
          this.$emit("updateCateList")
        })
      },
      //点击取消
      closeClick(){
        this.$refs.form.resetFields()
        this.selectCate = []
        this.dialogVisible = false
      },
      //级联菜单发生变化
      handleChange(vals) {
        if (vals.length > 0){
          //选择了父分类
          this.form.cat_pid = vals[vals.length - 1]
          this.form.cat_level = vals.length
        }else{
          this.form.cat_pid = 0
          this.form.cat_level = 0
        }

      },
      //点击xx
      handleClose() {
        this.$refs.form.resetFields()
        this.selectCate = []
        this.dialogVisible = false
      }
    }
  }
</script>

<style scoped>
.el-cascader{
    width: 100%;
}
</style>
