<template>
  <div v-if="position.pending">正在请求获取地址位置信息....</div>
  <div v-else-if="position.fulfilled && position.data[0]">
    经纬度 ({{ position.data[0].coords.longitude }},
    {{ position.data[0].coords.latitude }})
  </div>
  <div v-else>查询失败 {{ position.data[1]?.message }}</div>
</template>

<script src="./_index" lang="ts"></script>

<style scoped></style>
