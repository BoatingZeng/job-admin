<template>
  <simple-table
    :fetch-fun="fetchFun"
    :create-fun="createFun"
    :delete-fun="deleteFun"
    :update-fun="updateFun"
  />
</template>

<script>
import SimpleTable from './simple-table';
import { fetchCategoryList, createCategory, deleteCategory, updateCategory } from '@/api/category';

export default {
  name: 'CategoryManage',
  components: {
    SimpleTable,
  },
  methods: {
    fetchFun() {
      return fetchCategoryList();
    },
    createFun(row) {
      return createCategory(row);
    },
    deleteFun(id) {
      return deleteCategory(id);
    },
    updateFun(row) {
      return updateCategory(row);
    },
  }
}
</script>
