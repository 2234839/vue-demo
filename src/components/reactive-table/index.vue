<template>
  <button @click="addNewRow">添加一行</button>
  <button @click="addNewCol">添加一列</button>
  <div :style="{ '--c-col': 'repeat(' + table[0].length + ', 1fr)' }">
    <div
      style="display: flex; align-items: center; justify-content: space-between"
    >
      <div title="鼠标所在单元格的原始内容">rawData:{{ selectTd.value }}</div>
      <div
        class="c-edit"
        style="
          color: #333;
          border: 1px solid #333;
          padding: 2px 8px;
          margin: 0 6px;
        "
      >
        编辑：<input
          type="checkbox"
          v-model="editTd.isExp"
          title="是否为表达式"
        />
        <textarea
          type="text"
          style="width: 40vw"
          v-model="editTd.value"
          title="当前单元格的原始值"
        />
        <div style="font-size: 12px">鼠标点击单元格切换当前编辑</div>
      </div>
    </div>

    <div class="c-row" v-for="(row, row_i) in table" :key="row_i">
      <div
        class="c-td"
        :class="{
          '-editing': editTd === td,
          '-is_exp': td.isExp,
          '-depended': mayBeAssociatedTd.includes(td),
        }"
        v-for="(td, col_i) in row"
        :key="col_i"
        :title="'position:' + row_i + ',' + col_i"
        @mouseover="select(td)"
        @click="edit(td)"
      >
        <div
          class="c-td-no"
          :title="
            '这是第' +
            computedTable[row_i][col_i].value.updateTheOrder +
            '次计算得到的值'
          "
        >
          {{ computedTable[row_i][col_i].value.updateTheOrder }}
        </div>
        {{ computedTable[row_i][col_i].value.value }}
      </div>
    </div>
  </div>

  <div class="c-log">
    <div v-for="(item, index) in updateLogView" :key="index">
      {{ item }}
    </div>
  </div>

  <div style="color: #333">
    <h2>要求</h2>
    <pre>
      1. 每个单元格的第一部分表示 一个展示出来的值，第二部分表示 这个单元格内是不是表达式，第三部分表示真实的值

      2. 有新增行和列的功能

    </pre>
  </div>
</template>

<script src="./_index.ts" lang="ts"></script>
<style scoped>
  .c-row {
    display: grid;
    grid-template-columns: var(--c-col);
    grid-auto-rows: minmax(100px, auto);
  }
  .c-td {
    position: relative;

    border: 1px solid #333;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .c-td.-editing {
    border-color: rgb(243, 150, 11);
    background: rgb(231, 231, 231);
  }
  .c-td.-is_exp {
    color: rgb(30, 148, 0);
    font-size: 16px;
    font-weight: bold;
  }
  .c-td.-depended {
    background: rgb(233, 167, 46);
  }
  .c-td-no {
    position: absolute;
    left: 2px;
    top: 2px;
    height: 16px;
    min-width: 16px;
    font-size: 12px;
    background: #333;
    color: #fff;
    cursor: default;
  }
  div {
    color: red;
  }

  .c-log {
    text-align: left;
    padding-left: 20vw;
  }
</style>
