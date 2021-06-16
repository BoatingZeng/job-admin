<template>
  <div>
    <div class="filter-container">
      <el-button @click="getList">查询</el-button>
      <el-button type="primary" @click="handleAdd">添加</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      style="width: 100%;"
    >
      <el-table-column label="用户名" prop="userName" />
      <el-table-column label="真名" prop="realName" />
      <el-table-column label="电话" prop="phone" />
      <el-table-column label="操作">
        <template v-slot="scope">
          <el-button type="primary" size="mini" @click="handleModify(scope.row, 'info')">修改信息</el-button>
          <el-button type="warning" size="mini" @click="handleModify(scope.row, 'password')">修改密码</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="editDialogVisible" :close-on-click-modal="false">
      <el-form ref="form" :model="editingRow" :rules="rules" label-width="80px">
        <el-form-item v-if="editMode === 'add'" label="用户名" prop="userName">
          <el-input v-model.trim="editingRow.userName" />
        </el-form-item>
        <el-form-item v-if="editMode !== 'password'" label="真名" prop="realName">
          <el-input v-model.trim="editingRow.realName" />
        </el-form-item>
        <el-form-item v-if="editMode !== 'password'" label="电话" prop="phone">
          <el-input v-model.trim="editingRow.phone" />
        </el-form-item>
        <el-form-item v-if="editMode !== 'info'" label="密码" prop="password">
          <el-input v-model.trim="editingRow.password" show-password />
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
import { create, update, list, destroy } from '@/api/admin';

export default {
  name: 'AdminManage',
  data() {
    return {
      list: [],
      listLoading: true,
      editDialogVisible: false,
      editingRow: {},
      editMode: '', // add、info、password
      rules: {
        userName: [
          { required: true },
        ],
        password: [
          { required: true },
        ]
      },
    }
  },
  created() {
    this.getList();
  },
  methods: {
    async getList() {
      this.listLoading = true
      const res = await list()
      this.list = res.data;
      this.listLoading = false
    },
    handleAdd() {
      this.editingRow = {
        userName: '',
        password: '',
        realName: '',
        phone: '',
      }
      this.editMode = 'add';
      this.editDialogVisible = true
    },
    handleModify(row, mode) {
      this.editingRow = {
        ...row,
      };
      this.editMode = mode;
      this.editDialogVisible = true;
    },
    async handleSave() {
      const isValid = await this.$refs.form.validate();
      if (!isValid) return;
      if (this.editMode === 'add') {
        await create(this.editingRow);
      } else if (this.editMode === 'info') {
        const { userName, realName, phone } = this.editingRow;
        await update({
          userName,
          realName,
          phone,
        });
      } else if (this.editMode === 'password') {
        const { userName, password } = this.editingRow;
        await update({
          userName,
          password,
        });
      } else {
        this.$message.error('editMode不明：' + this.editMode);
      }
      this.editDialogVisible = false
      this.getList()
    },
    async handleDelete(row) {
      await destroy(row.userName)
      this.getList()
    },
  }
}
</script>
