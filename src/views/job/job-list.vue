<template>
  <div class="app-container">
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
      <el-table-column label="标题" prop="title" />
      <el-table-column label="详情" prop="detail" />
      <el-table-column label="操作">
        <template v-slot="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <el-dialog :visible.sync="editDialogVisible" :close-on-click-modal="false">
      <el-form :model="editingRow" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="editingRow.title" />
        </el-form-item>
        <el-form-item label="详情" prop="detail">
          <el-input v-model="editingRow.detail" type="textarea" />
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="微信号" prop="wechatId">
              <el-input v-model="editingRow.wechatId" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="薪酬" prop="salary">
              <el-input v-model="editingRow.salary" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="市" prop="city">
              <el-input v-model="editingRow.city" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="区" prop="district">
              <el-input v-model="editingRow.district" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="经度" prop="longitude">
              <el-input v-model="editingRow.longitude" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="纬度" prop="latitude">
              <el-input v-model="editingRow.latitude" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="详细地址" prop="address">
          <el-input v-model="editingRow.address" />
        </el-form-item>
        <el-form-item label="性别要求" prop="requiredGender">
          <el-select v-model="editingRow.requiredGender" clearable>
            <el-option
              v-for="{ label, value } in jobDict.requiredGender"
              :key="value"
              :label="label"
              :value="value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="持续时间" prop="durationType">
          <el-select v-model="editingRow.durationType" clearable>
            <el-option
              v-for="{ label, value } in jobDict.durationType"
              :key="value"
              :label="label"
              :value="value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="栏目" prop="categoryId">
          <el-input v-model="editingRow.categoryId" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="editingRow.status" clearable>
            <el-option
              v-for="{ label, value } in jobDict.status"
              :key="value"
              :label="label"
              :value="value"
            />
          </el-select>
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
import { fetchJobList, createJob, updateJob } from '@/api/job'
import { getDict } from '@/api/main'
import Pagination from '@/components/Pagination'

export default {
  name: 'JobList',
  components: { Pagination },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        currentPage: 1,
        pageSize: 10
      },
      editDialogVisible: false,
      editingRow: {},
      jobDict: {
        status: {},
        requiredGender: {},
        durationType: {}
      }
    }
  },
  created() {
    this.getDict()
    this.getList()
  },
  methods: {
    async getDict() {
      const dict = await getDict('job')
      if (dict) this.jobDict = dict
    },
    async getList() {
      this.listLoading = true
      const res = await fetchJobList(this.listQuery)
      this.list = res.data.rows
      this.total = res.data.count
      this.listLoading = false
    },
    handleEdit(row) {
      this.editingRow = { ...row }
      this.editDialogVisible = true
    },
    handleAdd() {
      this.editingRow = {}
      this.editDialogVisible = true
    },
    async handleSave() {
      if (this.editingRow.id) {
        await updateJob(this.editingRow)
      } else {
        await createJob(this.editingRow)
      }
      this.editDialogVisible = false
      this.getList()
    }
  }
}
</script>
