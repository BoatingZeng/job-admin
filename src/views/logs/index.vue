<template>
  <el-container class="log-container">
    <el-aside>
      <div>
        <el-link
          v-for="file in fileList"
          :key="file.name"
          :type="file.name === currentFile ? 'primary ' : 'default'"
          @click="getFileContent(file.name)"
        >{{ `${file.name}(${parseSize(file.size)})` }}</el-link>
      </div>
    </el-aside>
    <el-main class="file-content">
      <el-button v-clipboard:copy="fileContent" v-clipboard:success="clipboardSuccess">复制</el-button>
      <pre>
        <code>
          {{ fileContent }}
        </code>
      </pre>
    </el-main>
  </el-container>
</template>

<script>
import { listLog, getFileContent } from '@/api/log';
import clipboard from '@/directive/clipboard/index.js'

export default {
  name: 'Log',
  directives: {
    clipboard
  },
  data() {
    return {
      fileList: [],
      currentFile: '',
      fileContent: '',
    };
  },
  created() {
    this.listLog();
  },
  methods: {
    parseSize(size) {
      if (size > 1000000) return (size / 1000000).toFixed(2) + 'M';
      if (size > 1000) return (size / 1000).toFixed(2) + 'K';
      return size + 'B';
    },
    async listLog() {
      const res = await listLog();
      this.fileList = res.data;
    },
    async getFileContent(fileName) {
      const res = await getFileContent(fileName);
      this.currentFile = fileName;
      this.fileContent = res.data;
    },
    clipboardSuccess() {
      this.$message({
        message: 'Copy successfully',
        type: 'success',
        duration: 1500
      })
    }
  }
}
</script>

<style scoped>
.log-container {
  height: calc(100vh - 84px);;
}
.file-list {
  height: 100%;
}
.file-content {
  height: 100%;
}
</style>
