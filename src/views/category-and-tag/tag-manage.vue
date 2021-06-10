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
import { fetchTagList, createTag, deleteTag, updateTag } from '@/api/tag';

export default {
  name: 'Tag',
  components: {
    SimpleTable,
  },
  methods: {
    fetchFun() {
      return fetchTagList();
    },
    createFun(row) {
      return createTag(row);
    },
    deleteFun(id) {
      return deleteTag(id);
    },
    updateFun(row) {
      return updateTag(row);
    }
  }
};
</script>
