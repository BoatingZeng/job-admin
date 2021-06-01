<template>
  <div>
    <div class="filter-container">
      <el-button @click="getList">查询</el-button>
      <el-button @click="handleAdd">添加</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      style="width: 100%;"
    >
      <el-table-column label="ID" prop="id" />
      <el-table-column label="名称" prop="name" />
      <el-table-column label="操作">
        <template v-slot="scope">
          <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="editDialogVisible" :close-on-click-modal="false">
      <el-form ref="form" :model="editingRow" :rules="rules" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model.trim="editingRow.name" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="handleSave">
          保存
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'SimpleTable',
  props: {
    fetchFun: {
      type: Function,
      required: true
    },
    createFun: {
      type: Function,
      required: true
    },
    deleteFun: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      list: [],
      listLoading: true,
      editDialogVisible: false,
      editingRow: {},
      rules: {
        name: [
          { required: true },
        ],
      },
    }
  },
  created() {
    this.getList();
  },
  methods: {
    async getList() {
      this.listLoading = true
      const res = await this.fetchFun()
      this.list = res.data;
      this.listLoading = false
    },
    handleAdd() {
      this.editingRow = {}
      this.editDialogVisible = true
    },
    async handleSave() {
      const isValid = await this.$refs.form.validate();
      if (!isValid) return;
      await this.createFun(this.editingRow)
      this.editDialogVisible = false
      this.getList()
    },
    async handleDelete(row) {
      await this.deleteFun(row.id)
      this.getList()
    },
  }
}
</script>
