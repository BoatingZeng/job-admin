<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button @click="getList">查询</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      style="width: 100%;"
    >
      <el-table-column label="openId" prop="openId" show-overflow-tooltip />
      <el-table-column label="unionId" prop="unionId" show-overflow-tooltip />
      <el-table-column label="微信" prop="weixin" show-overflow-tooltip />
      <el-table-column label="真名" prop="realName" show-overflow-tooltip />
      <el-table-column label="填写电话" prop="fillPhone" show-overflow-tooltip />
      <el-table-column label="微信电话" prop="weixinPhone" show-overflow-tooltip />
      <el-table-column label="身份证" prop="idCard" show-overflow-tooltip />
      <el-table-column label="createdAt" prop="createdAt" show-overflow-tooltip />
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="getList" />
  </div>
</template>

<script>
import { fetchUserList } from '@/api/weixin-user'
import Pagination from '@/components/Pagination';

export default {
  name: 'WeixinUserList',
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
    }
  },
  created() {
    this.getList();
  },
  methods: {
    async getList() {
      this.listLoading = true
      const res = await fetchUserList(this.listQuery)
      this.list = res.data.rows
      this.total = res.data.count
      this.listLoading = false
    },
  }
}
</script>
