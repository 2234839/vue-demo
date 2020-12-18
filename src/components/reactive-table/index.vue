<template>
  <div class="c-row" v-for="(row, row_i) in table" :key="row_i">
    <div class="c-td" v-for="(td, col_i) in row" :key="col_i" :title="'position:' + row_i + ',' + col_i">
      <div class="c-td-no" :title="'这是第' + computedTable[row_i][col_i].value.updateTheOrder + '次计算得到的值'">
        {{ computedTable[row_i][col_i].value.updateTheOrder }}
      </div>
      {{ computedTable[row_i][col_i].value.value }}
      <input type="checkbox" v-model="td.isExp" title="是否为表达式" />
      <input type="text" v-model="td.value" />
    </div>
  </div>
  <div>
    <div v-for="(item, index) in updateLogView" :key="index">
      {{ item }}
    </div>
  </div>
</template>

<script src="./_index.ts" lang="ts"></script>
<style scoped>
  .c-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-auto-rows: minmax(100px, auto);
  }
  .c-td {
    position: relative;

    border: 1px solid #333;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .c-td-no {
    position: absolute;
    left: 2px;
    top: 2px;
    width: 16px;
    height: 16px;
    font-size: 12px;
    background: #333;
    color: #fff;
  }
  div {
    color: red;
  }
</style>
