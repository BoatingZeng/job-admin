<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="listQuery.status" placeholder="状态" clearable style="width: 90px" class="filter-item">
        <el-option v-for="{ label, value } in jobDict.status" :key="value" :label="label" :value="value" />
      </el-select>
      <el-select v-model="listQuery.categoryId" placeholder="栏目" clearable style="width: 90px" class="filter-item">
        <el-option v-for="{ id, name } in categoryList" :key="id" :label="name" :value="id" />
      </el-select>
      <el-select v-model="listQuery.requiredGender" placeholder="性别要求" clearable style="width: 110px" class="filter-item">
        <el-option v-for="{ label, value } in jobDict.requiredGender" :key="value" :label="label" :value="value" />
      </el-select>
      <el-select v-model="listQuery.durationType" placeholder="持续时间" clearable style="width: 110px" class="filter-item">
        <el-option v-for="{ label, value } in jobDict.durationType" :key="value" :label="label" :value="value" />
      </el-select>
      <el-input v-model="listQuery.searchText" placeholder="标题或标签" style="width: 200px;" class="filter-item" />
      <el-button class="filter-item" type="primary" @click="handleSearch">查询</el-button>
      <el-button class="filter-item" @click="handleReset">重置</el-button>
      <el-button class="filter-item" type="primary" @click="handleAdd">添加</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      style="width: 100%;"
    >
      <el-table-column label="ID" prop="id" show-overflow-tooltip />
      <el-table-column label="状态" prop="status">
        <template v-slot="scope">
          <el-tag
            :type="parseStatus(scope.row.status)"
          >
            {{ jobValue2Label.status[scope.row.status] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="标题" prop="title" show-overflow-tooltip />
      <el-table-column label="开始时间" prop="startTime" show-overflow-tooltip />
      <el-table-column label="详情" prop="detail" show-overflow-tooltip />
      <el-table-column label="微信号" prop="wechatId" show-overflow-tooltip />
      <el-table-column label="薪酬" prop="salary" show-overflow-tooltip />
      <el-table-column label="详细地址" prop="address" show-overflow-tooltip />
      <el-table-column label="栏目" prop="categoryName" show-overflow-tooltip />
      <el-table-column label="标签" prop="tags" show-overflow-tooltip />
      <el-table-column label="操作">
        <template v-slot="scope">
          <el-button type="primary" size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button v-if="scope.row.status === jobDict.status.on.value" type="warning" size="mini" :loading="operating" @click="handleChangeStatus(scope.row)">撤回</el-button>
          <el-button v-else type="success" size="mini" :loading="operating" @click="handleChangeStatus(scope.row)">发布</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <el-dialog :visible.sync="editDialogVisible" :close-on-click-modal="false">
      <el-form ref="form" :model="editingRow" :rules="rules" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model.trim="editingRow.title" />
        </el-form-item>
        <el-form-item label="详情" prop="detail">
          <el-input v-model="editingRow.detail" type="textarea" :rows="8" />
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="微信号" prop="wechatId">
              <el-input v-model.trim="editingRow.wechatId" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="薪酬" prop="salary">
              <el-input v-model.trim="editingRow.salary" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="省/市/区">
              <el-cascader
                v-model="editingRow.cityOptions"
                filterable
                :options="regionDataPlus"
                style="width: 100%;"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="经度" prop="longitude">
              <el-input v-model.trim="editingRow.longitude" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="纬度" prop="latitude">
              <el-input v-model.trim="editingRow.latitude" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="详细地址" prop="address">
          <el-input v-model.trim="editingRow.address" />
        </el-form-item>
        <el-row>
          <el-col :span="6">
            <el-form-item label="状态" prop="status">
              <el-select v-model="editingRow.status">
                <el-option
                  v-for="{ label, value } in jobDict.status"
                  :key="value"
                  :label="label"
                  :value="value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="性别要求" prop="requiredGender">
              <el-select v-model="editingRow.requiredGender">
                <el-option
                  v-for="{ label, value } in jobDict.requiredGender"
                  :key="value"
                  :label="label"
                  :value="value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="持续时间" prop="durationType">
              <el-select v-model="editingRow.durationType">
                <el-option
                  v-for="{ label, value } in jobDict.durationType"
                  :key="value"
                  :label="label"
                  :value="value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="栏目" prop="categoryId">
              <el-select v-model="editingRow.categoryId" filterable clearable @change="handleCategoryChange">
                <el-option
                  v-for="item in categoryList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="开始时间" prop="startTime">
              <el-date-picker
                v-model="editingRow.startTime"
                type="datetime"
                default-time="00:00:00"
                value-format="yyyy-MM-dd HH:mm:ss"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="标签" prop="tags">
              <el-select v-model="editingRow.tags" multiple filterable clearable style="width: 100%;">
                <el-option
                  v-for="item in tagList"
                  :key="item.name"
                  :label="item.name"
                  :value="item.name"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">
          取消
        </el-button>
        <el-button type="primary" :loading="operating" @click="handleSave">
          保存
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { regionDataPlus, CodeToText, TextToCode } from 'element-china-area-data';
import { numWithRange } from '@/utils/validate'
import { fetchJobList, createJob, updateJob } from '@/api/job'
import { fetchCategoryList } from '@/api/category';
import { fetchTagList } from '@/api/tag';
import { getDict } from '@/api/main'
import Pagination from '@/components/Pagination'

function convertTextToCodeList(provinceText, cityText, districtText) {
  const codeList = [];
  if (provinceText && TextToCode[provinceText]) {
    const province = TextToCode[provinceText];
    codeList.push(province.code);
    if (cityText && province[cityText]) {
      const city = province[cityText];
      codeList.push(city.code);
      if (districtText && city[districtText]) {
        codeList.push(city[districtText].code);
      } else {
        codeList.push('');
      }
    } else {
      codeList.push('');
    }
  }
  return codeList;
}

function parseSaveCity(v) {
  if (!v || v === '全部') return '';
  else return v;
}

function genNumValidate(min, max) {
  return function(rule, value, callback) {
    if (value) {
      const e = numWithRange(value, min, max);
      if (e) callback(e);
      else callback();
    } else {
      callback();
    }
  }
}

function initQuery() {
  return {
    categoryId: '',
    searchText: '',
    status: '',
    requiredGender: '',
    durationType: '',
  };
}

export default {
  name: 'JobList',
  components: { Pagination },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      operating: false,
      listQuery: {
        ...initQuery(),
        currentPage: 1,
        pageSize: 10
      },
      editDialogVisible: false,
      editingRow: {},
      jobDict: {
        status: {},
        requiredGender: {},
        durationType: {}
      },
      jobValue2Label: {
        status: {},
        requiredGender: {},
        durationType: {}
      },
      categoryList: [],
      tagList: [],
      rules: {
        title: [
          { required: true },
        ],
        detail: [
          { required: true },
        ],
        wechatId: [
          { required: true },
        ],
        salary: [
          { required: true },
        ],
        longitude: [
          { validator: genNumValidate(-180, 180) }
        ],
        latitude: [
          { validator: genNumValidate(-90, 90) }
        ]
      },
      regionDataPlus,
    }
  },
  created() {
    this.getCategory();
    this.getTag();
    this.getDict();
    this.getList();
  },
  methods: {
    parseStatus(status) {
      switch (status) {
        case 0:
          return 'warning';
        case 1:
          return 'success';
        case 2:
          return 'danger';
        default:
          return 'info';
      }
    },
    async getDict() {
      const { dict, value2Label } = await getDict('job')
      if (dict) this.jobDict = dict;
      if (value2Label) this.jobValue2Label = value2Label;
    },
    handleReset() {
      this.listQuery = {
        ...this.listQuery,
        ...initQuery(),
      };
      this.handleSearch();
    },
    handleSearch() {
      this.listQuery.currentPage = 1;
      this.getList();
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
      if (this.editingRow.tags && typeof this.editingRow.tags === 'string') {
        const tagList = this.editingRow.tags.split(',');
        this.editingRow.tags = tagList;
      } else {
        this.editingRow.tags = [];
      }
      const { province, city, district } = this.editingRow;
      this.editingRow.cityOptions = convertTextToCodeList(province, city, district);
      this.editDialogVisible = true
    },
    handleAdd() {
      this.editingRow = {}
      this.editDialogVisible = true
    },
    async handleSave() {
      const isValid = await this.$refs.form.validate();
      if (!isValid) return;
      this.operating = true;
      const saveRow = { ...this.editingRow };
      delete saveRow.createdAt;
      delete saveRow.updatedAt;
      if (saveRow.tags && saveRow.tags.length > 0) {
        saveRow.tags = saveRow.tags.join(',')
      } else {
        saveRow.tags = '';
      }
      if (!saveRow.categoryId) saveRow.categoryId = null;

      const co = saveRow.cityOptions;
      if (co) {
        saveRow.province = parseSaveCity(CodeToText[co[0]]);
        saveRow.city = parseSaveCity(CodeToText[co[1]]);
        saveRow.district = parseSaveCity(CodeToText[co[2]]);
      }

      delete saveRow.cityOptions;
      if (saveRow.id) {
        await updateJob(saveRow)
      } else {
        await createJob(saveRow)
      }
      this.editDialogVisible = false;
      this.operating = false;
      this.getList()
    },
    async getCategory() {
      const res = await fetchCategoryList();
      this.categoryList = res.data;
    },
    async getTag() {
      const res = await fetchTagList();
      this.tagList = res.data;
    },
    handleCategoryChange(value) {
      if (value) {
        const { name } = this.categoryList.find(item => item.id === value);
        this.editingRow.categoryName = name;
      } else {
        this.editingRow.categoryName = '';
      }
    },
    async handleChangeStatus(row) {
      this.operating = true;
      const { id, status } = row;
      let newStatus = this.jobDict.status.on.value;
      if (status === this.jobDict.status.on.value) {
        newStatus = this.jobDict.status.off.value;
      }
      await updateJob({ id, status: newStatus });
      this.operating = false;
      this.getList();
    }
  }
}
</script>
