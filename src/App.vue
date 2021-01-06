<template>
  <Test />
  <ReactiveTable />
  <div style="color: #333">
    <h2>要求</h2>
    <pre>
      1. 每个单元格的第一部分表示 一个展示出来的值，第二部分表示 这个单元格内是不是表达式，第三部分表示真实的值

      2. 有新增行和列的功能

    </pre>
  </div>
</template>

<script lang="ts">
  import ReactiveTable from "./components/reactive-table/index.vue";
  import Test from "./components/async-loade-test/test.vue";
  export default {
    name: "App",
    components: {
      ReactiveTable,
      Test,
    },
  };
</script>
