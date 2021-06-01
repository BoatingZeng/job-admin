<template>
  <div class="app-container">
    <el-tabs v-model="activeName">
      <el-tab-pane label="栏目" name="category"><category-manage /></el-tab-pane>
      <el-tab-pane label="标签" name="tag"><tag-manage /></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import CategoryManage from './category-manage';
import TagManage from './tag-manage';

export default {
  name: 'CategoryAndTag',
  components: {
    CategoryManage,
    TagManage,
  },
  data() {
    return {
      activeName: 'category',
    }
  }
}
</script>
