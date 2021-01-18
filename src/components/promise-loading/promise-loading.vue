<template>
  <div>有 1/2 的几率失败，可以尝试一下效果</div>

  <input placeholder="请输入你要搜索的关键字" v-model="searchText" />
  <div v-if="searchResults.pending">正在查询中</div>
  <div v-else-if="searchResults.rejected">
    查询失败
    {{ searchResults.error }}
  </div>
  <div v-else-if="searchResults.fulfilled">
    <div v-for="(item, index) in searchResults.data" :key="index">
      {{ item }}
    </div>
  </div>
</template>

<script src="./_promise-loading" lang="ts"></script>

<style scoped></style>
