<template>
    <div>
        <el-button type="primary"
                   :disabled="this.selectCat.length !== 3"
                   size="mini"
                   @click="addClick"
        >{{fromParams ? '添加参数' : '添加属性'}}
        </el-button>

        <el-table
                :data="attrList"
                style="width: 100%"
                border
        >
            <el-table-column type="expand">
                <template slot-scope="scope">
                    <el-tag closable v-for="(item,index) in scope.row.attr_vals" @close="delParItem(scope.row,index)"
                            :key="index">{{item}}
                    </el-tag>
                    <!--添加-->
                    <el-input
                            class="input-new-tag"
                            v-if="scope.row.inputVisible"
                            v-model="scope.row.inputValue"
                            ref="saveTagInput"
                            size="small"
                            @keyup.enter.native="handleInputConfirm(scope.row)"
                            @blur="handleInputConfirm(scope.row)"
                    >
                    </el-input>
                    <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag
                    </el-button>

                </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" :label="fromParams ? '参数名' : '属性名'"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" icon="el-icon-edit" @click="editClick(scope.row)">编辑
                    </el-button>
                    <el-button type="danger" size="mini" icon="el-icon-delete" @click="delClick(scope.row)">删除
                    </el-button>
                </template>
            </el-table-column>

        </el-table>
        <el-dialog
                :title="title"
                :visible="dialogVisible"
                width="50%"
                :before-close="handleClose">
            <el-form :model="pForm" :rules="rules" ref="pForm" label-width="100px" class="demo-ruleForm">
                <el-form-item :label="fromParams ? '动态参数' : '静态属性'" prop="attr_name">
                    <el-input v-model="pForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitClick">确 定</el-button>
          </span>
        </el-dialog>


    </div>
</template>

<script>
  import {reqAddCatAttr, reqUpdateCatAttr, reqDelCatAttr, reqDelCarAttrItem} from "network/api"

  export default {
    name: "ParamsList",
    props: {
      attrList: {
        type: Array,
        default() {
          return []
        }
      },
      activeName: {
        type: String
      },
      selectCat: {
        type: Array,
        default() {
          return [];
        }
      }
    },
    data() {
      return {
        dialogVisible: false,
        pInfo: {}, //参数或属性信息
        pForm: {
          attr_name: ''
        }, //表单信息
        rules: {
          attr_name: [
            {required: true, message: '请输入参数名', trigger: 'blur'},
          ]
        },//表单规则

      }
    },
    methods: {
      //失去焦点或者回车
      async handleInputConfirm(rowInfo) {
        // console.log(123)
        if (rowInfo.inputValue.trim() === "") {
          rowInfo.inputVisible = false
          rowInfo.inputValue = ""
          return
        }
        rowInfo.attr_vals.push(rowInfo.inputValue)
        rowInfo.inputVisible = false
        rowInfo.inputValue = ""

        const id = this.selectCat[2]
        const attrId = rowInfo.attr_id
        const attr_sel = this.activeName
        const attr_vals = rowInfo.attr_vals.join(" ")
        const attr_name = rowInfo.attr_name
        const result = await reqDelCarAttrItem({id, attrId, attr_sel, attr_vals, attr_name})
        if (result.meta.status !== 200) return this.$message.error("添加失败")
        this.$message.success("添加成功")

      },
      //点击显示文本框
      showInput(rowInfo) {
        rowInfo.inputVisible = true
        this.inputVisible = true
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      //删除参数每一项
      delParItem(pInfo, index) {
        this.$confirm('确定要删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {

          pInfo.attr_vals.splice(index, 1)
          const id = this.selectCat[2]
          const attrId = pInfo.attr_id
          const attr_sel = this.activeName
          const attr_vals = pInfo.attr_vals.join(" ")
          const attr_name = pInfo.attr_name
          const result = await reqDelCarAttrItem({id, attrId, attr_sel, attr_vals, attr_name})
          if (result.meta.status !== 200) return this.$message.error("删除失败")
          this.$message.success("删除成功")
        }).catch(() => {

          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      },
      //点击删除按钮
      delClick(pInfo) {
        this.$confirm('确定要删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const {attr_id} = pInfo
          const id = this.selectCat[2]
          const result = await reqDelCatAttr(id, attr_id)
          if (result.meta.status !== 200) return this.$message.error(result.meta.msg)
          this.$message.success("删除成功")
          this.$emit("updateCatAttrList")
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      },
      //点击确定
      submitClick() {
        const {attr_id} = this.pInfo
        const id = this.selectCat[2]
        const {attr_name} = this.pForm
        const attr_sel = this.activeName
        this.$refs.pForm.validate(async valid => {
          if (!valid) return
          if (this.pInfo.attr_id || this.pInfo.attr_name) {
            //修改请求
            const result = await reqUpdateCatAttr(id, attr_id, attr_name, attr_sel)
            if (result.meta.status !== 200) return this.$message.error(result.meta.msg)
            this.$message.success("更新成功")
            this.$emit("updateCatAttrList")
            this.dialogVisible = false
          } else {
            //添加请求
            const result = await reqAddCatAttr(id, attr_name, attr_sel)
            console.log(result)
            if (result.meta.status !== 201) return this.$message.error(result.meta.msg)
            this.$message.success("添加成功")
            this.$emit("updateCatAttrList")
            this.dialogVisible = false

          }
        })
      },
      //点击添加
      addClick() {
        this.pInfo = {}
        this.pForm.attr_name = ''
        this.dialogVisible = true
      },
      //点击编辑
      editClick(pInfo) {
        console.log(pInfo)
        this.pForm.attr_name = pInfo.attr_name
        this.pInfo = pInfo
        this.dialogVisible = true
      },
      //点击xx或者
      handleClose() {
        this.dialogVisible = false
      }
    },
    computed: {
      //计算来自哪里  返回true表示来自 动态参数    否则就是静态属性
      fromParams() {
        return this.activeName === 'many'
      },
      title() {
        if (this.activeName === "many") {
          //动态参数
          if (this.pInfo.attr_id || this.pInfo.attr_name) {
            //修改动态参数
            return '修改动态参数'
          }
          return '添加动态参数'
        } else {
          //静态属性
          if (this.pInfo.attr_id || this.pInfo.attr_name) {
            //修改静态属性
            return '修改静态属性'
          }
          return '添加静态属性'
        }
      }
    }
  }
</script>

<style scoped>
    .el-tag {
        margin: 10px;
    }

    .input-new-tag {
        width: 120px;
    }
</style>
