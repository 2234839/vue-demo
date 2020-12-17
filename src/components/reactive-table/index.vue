<template>
  <div class="c-row" v-for="(row, row_i) in table" :key="row_i">
    <div class="c-td" v-for="(td, col_i) in row" :key="col_i" :title="'position:' + row_i + ',' + col_i">
      {{ valueOf(td) }}
      <input type="checkbox" v-model="td.isExp" title="是否为表达式" />
      <input type="text" v-model="td.value" />
    </div>
  </div>
</template>

<script src="./_index.ts" lang="ts"></script>
<style scoped>
  .c-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 10px;
    grid-auto-rows: minmax(100px, auto);
  }
  .c-td {
    border: 1px solid #333;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  div {
    color: red;
  }
</style>
